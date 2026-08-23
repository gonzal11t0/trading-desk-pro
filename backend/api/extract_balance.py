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
from urllib.parse import parse_qs, urlparse
from urllib.request import Request, urlopen

def decode_segment(value):
    return base64.urlsafe_b64decode(value + '=' * (-len(value) % 4))


def require_admin(authorization):
    if not authorization or not authorization.startswith('Bearer '):
        raise ValueError('Token no proporcionado')
    secret = os.environ.get('JWT_SECRET')
    if not secret and os.environ.get('REQUIRE_JWT_SECRET') == 'true':
        raise RuntimeError('JWT_SECRET no está configurado')
    secret = secret or 'trading-desk-pro-secret-key-2026'
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


def extract_cepu_fields(text):
    normalized = ' '.join(text.split())

    def value(pattern):
        match = re.search(pattern, normalized, re.I)
        return parse_number(match.group(1)) if match else None

    fields = {
        'ticker': 'CEPU',
        'sector': 'industrial',
        'ultimoBalance': 'Jun 2026',
        'periodo': '2T 2026',
        'moneda': 'USD millones',
        'ingresos': value(r'ingresos por ventas en el 2T26 totalizaron US\$\s*(' + NUMBER + r')\s*MM'),
        'varIngresos': value(r'ingresos por ventas en el 2T26.*?incremento del\s*(' + NUMBER + r')%\s*frente.*?2T25'),
        'ebitda': value(r'EBITDA ajustado del 2T26 fue de US\$\s*(' + NUMBER + r')\s*MM'),
        'varEbitda': value(r'EBITDA ajustado del 2T26.*?incremento del\s*(' + NUMBER + r')%\s*frente.*?2T25'),
        'deuda': value(r'saldo total de deuda bruta\s+ascendía a aproximadamente US\$\s*(' + NUMBER + r')\s*MM'),
        'patrimonio': value(r'Patrimonio total\s+(' + NUMBER + r')\s+' + NUMBER),
        'resultadoNeto': value(r'Resultado neto del período\s+(' + NUMBER + r')\s+' + NUMBER),
        'analisis': 'Datos extraídos de la presentación oficial de resultados 2T 2026. Revisar las cifras contra el PDF antes de publicar.',
        'recomendacion': 'SIN RECOMENDACIÓN'
    }
    expected = ('ingresos', 'ebitda', 'deuda', 'patrimonio', 'resultadoNeto')
    return fields, sum(fields[key] is not None for key in expected)


def download_official_pdf(ticker, source_url):
    parsed = urlparse(source_url)
    allowed_hosts = {
        'CEPU': {'centralpuerto.com', 'www.centralpuerto.com'}
    }
    if parsed.scheme != 'https' or parsed.hostname not in allowed_hosts.get(ticker, set()):
        raise ValueError('El enlace no pertenece a la fuente oficial permitida para esta empresa')

    headers = {'User-Agent': 'TradingDeskPro/1.0'}
    final_url = source_url
    if not parsed.path.lower().endswith('.pdf'):
        with urlopen(Request(source_url, headers=headers), timeout=25) as response:
            html = response.read(2_000_001)
        if len(html) > 2_000_000:
            raise ValueError('La página oficial es demasiado grande para localizar el informe')
        links = re.findall(rb'https://www\.centralpuerto\.com/[^"\s]+\.pdf', html, re.I)
        candidates = [link.decode('utf-8', 'ignore') for link in links]
        preferred = [link for link in candidates if re.search(r'2T26.*ESP.*CEPU|20260811_2T26', link, re.I)]
        if not preferred:
            raise ValueError('No se encontró la presentación de resultados más reciente en la página oficial')
        final_url = preferred[0]

    with urlopen(Request(final_url, headers=headers), timeout=40) as response:
        pdf_bytes = response.read(15_000_001)
    if len(pdf_bytes) > 15_000_000 or not pdf_bytes.startswith(b'%PDF'):
        raise ValueError('La fuente oficial no devolvió un PDF válido')
    return pdf_bytes, final_url


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
            if length > 4_400_000:
                return self.send_json(413, {'error': 'El PDF supera el límite de envío directo'})
            content_type = self.headers.get('Content-Type', '')
            source_url = ''
            if content_type.startswith('application/pdf'):
                ticker = parse_qs(urlparse(self.path).query).get('ticker', [''])[0].strip().upper()
                pdf_bytes = self.rfile.read(length)
            else:
                payload = json.loads(self.rfile.read(length) or b'{}')
                encoded = payload.get('pdfBase64', '')
                ticker = str(payload.get('ticker', '')).strip().upper()
                source_url = str(payload.get('sourceUrl', '')).strip()
                if source_url:
                    pdf_bytes, source_url = download_official_pdf(ticker, source_url)
                else:
                    pdf_bytes = base64.b64decode(encoded, validate=True)
            if not re.fullmatch(r'[A-Z0-9.]{2,10}', ticker):
                return self.send_json(400, {'error': 'Seleccioná o escribí un ticker antes del PDF'})
            if len(pdf_bytes) > 15_000_000 or not pdf_bytes.startswith(b'%PDF'):
                return self.send_json(400, {'error': 'El archivo no es un PDF válido o supera 15 MB'})
            import pdfplumber
            with pdfplumber.open(io.BytesIO(pdf_bytes)) as document:
                text = '\n'.join(page.extract_text() or '' for page in document.pages)
            if not text.strip():
                return self.send_json(422, {'error': 'El PDF no contiene texto extraíble; puede ser un documento escaneado'})
            verified = ticker == 'CEPU' and bool(re.search(r'2T\s*2026|2T26', text, re.I))
            fields, found = extract_cepu_fields(text) if verified else extract_fields(text, ticker)
            self.send_json(200, {
                'success': True,
                'fields': fields,
                'found': found,
                'sourceUrl': source_url or None,
                'extractor': {
                    'verified': verified,
                    'label': 'Central Puerto 2T 2026' if verified else f'{ticker} genérico',
                    'message': 'Reglas comprobadas contra la presentación oficial.' if verified else 'Formato aún no comprobado para esta emisora y período; requiere revisión completa.'
                },
                'warnings': ['Extracción preliminar: los formatos cambian entre emisoras y períodos. Revisá cada cifra y su unidad contra el PDF antes de publicar.']
            })
        except PermissionError as error:
            self.send_json(403, {'error': str(error)})
        except (ValueError, json.JSONDecodeError, binascii.Error) as error:
            self.send_json(401, {'error': str(error)})
        except Exception as error:
            self.send_json(500, {'error': f'No fue posible analizar el PDF: {error}'})
