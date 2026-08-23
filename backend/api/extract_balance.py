import base64
import binascii
import hashlib
import hmac
import io
import json
import os
import re
import time
from http.server import BaseHTTPRequestHandler

import pdfplumber


def decode_segment(value):
    return base64.urlsafe_b64decode(value + '=' * (-len(value) % 4))


def require_admin(authorization):
    if not authorization or not authorization.startswith('Bearer '):
        raise ValueError('Token no proporcionado')
    secret = os.environ.get('JWT_SECRET')
    if not secret:
        raise ValueError('Servidor sin JWT_SECRET')
    token = authorization.split(' ', 1)[1]
    header_part, payload_part, signature_part = token.split('.')
    header = json.loads(decode_segment(header_part))
    if header.get('alg') != 'HS256':
        raise ValueError('Algoritmo de token inválido')
    expected = hmac.new(secret.encode(), f'{header_part}.{payload_part}'.encode(), hashlib.sha256).digest()
    if not hmac.compare_digest(expected, decode_segment(signature_part)):
        raise ValueError('Token inválido')
    payload = json.loads(decode_segment(payload_part))
    if payload.get('exp') and payload['exp'] < time.time():
        raise ValueError('Token vencido')
    if payload.get('role') != 'admin':
        raise PermissionError('Acceso denegado')
    return payload


def parse_number(raw):
    if not raw:
        return None
    negative = '(' in raw or raw.strip().startswith('-')
    value = re.sub(r'[^\d,.-]', '', raw).replace('-', '')
    if not value:
        return None
    if ',' in value and '.' in value:
        value = value.replace('.', '').replace(',', '.')
    elif value.count('.') > 1:
        value = value.replace('.', '')
    elif value.count(',') > 1:
        value = value.replace(',', '')
    elif ',' in value:
        tail = value.rsplit(',', 1)[1]
        value = value.replace(',', '') if len(tail) == 3 else value.replace(',', '.')
    elif '.' in value and len(value.rsplit('.', 1)[1]) == 3:
        value = value.replace('.', '')
    try:
        number = float(value)
        return -number if negative else number
    except ValueError:
        return None


NUMBER = r'\(?-?\d[\d.]*(?:,\d+)?\)?'


def first_value(lines, labels):
    candidates = []
    for line in lines:
        if not any(re.search(label, line, re.I) for label in labels):
            continue
        label_end = max((match.end() for label in labels if (match := re.search(label, line, re.I))), default=0)
        values = re.findall(NUMBER, line[label_end:])
        parsed = [parse_number(value) for value in values]
        parsed = [value for value in parsed if value is not None]
        if parsed:
            value = parsed[1] if len(parsed) > 1 and abs(parsed[0]) <= 99 else parsed[0]
            if not (1900 <= abs(value) <= 2100 and len(parsed) == 1):
                candidates.append(value)
    return max(candidates, key=lambda value: abs(value)) if candidates else None


def extract_fields(text, ticker):
    lines = [' '.join(line.split()) for line in text.splitlines() if line.strip()]
    lower = text.lower()
    currency = 'USD' if re.search(r'us\$|usd|d[oó]lares', lower) else 'ARS'
    if re.search(r'en millones|millones de', lower):
        unit = f'{currency} millones'
    elif re.search(r'en miles|miles de', lower):
        unit = f'{currency} miles'
    else:
        unit = currency

    date_match = re.search(
        r'(?:al|finalizado el)\s+(\d{1,2})\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\s+de\s+(20\d{2})',
        lower
    )
    period = date_match.group(0).replace('finalizado el ', '').replace('al ', '').title() if date_match else ''

    is_bank = ticker.upper() in ('BMA', 'GGAL')
    fields = {
        'ticker': ticker.upper(),
        'sector': 'bank' if is_bank else 'industrial',
        'ultimoBalance': period,
        'periodo': period,
        'moneda': unit,
        'ingresos': first_value(lines, [r'ingreso operativo neto', r'ingresos(?: por ventas| de actividades ordinarias)?', r'ventas netas']),
        'ebitda': None if is_bank else first_value(lines, [r'ebitda ajustado', r'ebitda']),
        'deuda': None if is_bank else first_value(lines, [r'deuda financiera total', r'deuda total', r'pr[eé]stamos totales']),
        'patrimonio': first_value(lines, [r'patrimonio neto total', r'patrimonio atribuible', r'patrimonio neto']),
        'resultadoNeto': first_value(lines, [r'resultado neto del (?:ejercicio|per[ií]odo)', r'ganancia \(p[eé]rdida\) neta', r'resultado del per[ií]odo'])
    }
    expected = ('ingresos', 'patrimonio', 'resultadoNeto') if is_bank else ('ingresos', 'ebitda', 'deuda', 'patrimonio', 'resultadoNeto')
    found = sum(fields[key] is not None for key in expected)
    return fields, found


class handler(BaseHTTPRequestHandler):
    def send_json(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        try:
            require_admin(self.headers.get('Authorization'))
            length = int(self.headers.get('Content-Length', '0'))
            if length > 4_300_000:
                return self.send_json(413, {'error': 'El PDF supera el límite de extracción (3 MB)'})
            payload = json.loads(self.rfile.read(length) or b'{}')
            encoded = payload.get('pdfBase64', '')
            ticker = str(payload.get('ticker', '')).strip().upper()
            if not re.fullmatch(r'[A-Z0-9.]{2,10}', ticker):
                return self.send_json(400, {'error': 'Seleccioná o escribí un ticker antes del PDF'})
            pdf_bytes = base64.b64decode(encoded, validate=True)
            if len(pdf_bytes) > 3_100_000 or not pdf_bytes.startswith(b'%PDF'):
                return self.send_json(400, {'error': 'El archivo no es un PDF válido o supera 3 MB'})
            with pdfplumber.open(io.BytesIO(pdf_bytes)) as document:
                text = '\n'.join(page.extract_text() or '' for page in document.pages)
            if not text.strip():
                return self.send_json(422, {'error': 'El PDF no contiene texto extraíble; puede ser un documento escaneado'})
            fields, found = extract_fields(text, ticker)
            self.send_json(200, {
                'success': True,
                'fields': fields,
                'found': found,
                'warnings': ['Extracción preliminar: los formatos cambian entre emisoras y períodos. Revisá cada cifra y su unidad contra el PDF antes de publicar.']
            })
        except PermissionError as error:
            self.send_json(403, {'error': str(error)})
        except (ValueError, json.JSONDecodeError, binascii.Error) as error:
            self.send_json(401, {'error': str(error)})
        except Exception as error:
            self.send_json(500, {'error': f'No fue posible analizar el PDF: {error}'})
