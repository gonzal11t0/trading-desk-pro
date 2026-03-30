# backend/scripts/balances/extraer_pamp.py
import re
import json
from pathlib import Path

def extraer_texto_pdf(ruta_pdf):
    try:
        import pdfplumber
        texto_completo = ""
        with pdfplumber.open(ruta_pdf) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    texto_completo += page_text + "\n"
        return texto_completo
    except Exception as e:
        print(f"Error extrayendo PDF PAMP: {e}")
        return None

def parsear_numero(valor_str):
    """Convierte un string como '1.998' a float 1998"""
    return float(valor_str.replace(',', '').replace('.', ''))

def extraer_datos_pamp(texto, ticker):
    datos = {
        'ticker': ticker,
        'fecha_balance': '2025',
        'ingresos_usd': None,
        'resultado_neto_usd': None,
        'patrimonio_usd': None,
        'deuda_total_usd': None,
        'roe': None
    }
    
    # Buscar Ingresos por ventas - capturar el primer número después del concepto
    # El patrón busca "Ingresos por ventas" seguido de espacios y luego el número 1.998
    match = re.search(r'Ingresos por ventas\s+([\d\.]+)', texto)
    if match:
        datos['ingresos_usd'] = parsear_numero(match.group(1)) * 1_000_000
        print(f"✅ Ingresos anuales: US$ {datos['ingresos_usd']:,.0f}")
    
    # Buscar Resultado del período - capturar el primer número después del concepto
    match = re.search(r'Resultado del período\s+([\d\.]+)', texto)
    if match:
        datos['resultado_neto_usd'] = parsear_numero(match.group(1)) * 1_000_000
        print(f"✅ Resultado neto anual: US$ {datos['resultado_neto_usd']:,.0f}")
    
    # Buscar patrimonio neto (página 18)
    match = re.search(r'Patrimonio atribuible a los propietarios\s+([\d\.]+)\s+([\d\.]+)', texto)
    if match:
        datos['patrimonio_usd'] = parsear_numero(match.group(1)) * 1_000_000
        print(f"✅ Patrimonio: US$ {datos['patrimonio_usd']:,.0f}")
    
    # Buscar deuda total (préstamos corriente + no corriente) en página 18
    match_no_corriente = re.search(r'Pasivo no corriente[\s\S]*?Préstamos\s+([\d\.]+)\s+([\d\.]+)', texto)
    match_corriente = re.search(r'Pasivo corriente[\s\S]*?Préstamos\s+([\d\.]+)\s+([\d\.]+)', texto)
    
    if match_no_corriente and match_corriente:
        deuda_no_corriente = parsear_numero(match_no_corriente.group(1)) * 1_000_000
        deuda_corriente = parsear_numero(match_corriente.group(1)) * 1_000_000
        datos['deuda_total_usd'] = deuda_no_corriente + deuda_corriente
        print(f"✅ Deuda total: US$ {datos['deuda_total_usd']:,.0f}")
    
    # Calcular ROE
    if datos['resultado_neto_usd'] and datos['patrimonio_usd'] and datos['patrimonio_usd'] != 0:
        datos['roe'] = round((datos['resultado_neto_usd'] / datos['patrimonio_usd']) * 100, 2)
        print(f"✅ ROE: {datos['roe']}%")
    
    return datos

def procesar_pamp(ruta_pdf, ticker):
    texto = extraer_texto_pdf(ruta_pdf)
    if not texto:
        print("❌ No se pudo extraer texto del PDF")
        return None
    
    datos = extraer_datos_pamp(texto, ticker)
    
    output_dir = Path('backend/data/balances')
    output_dir.mkdir(parents=True, exist_ok=True)
    
    output_path = output_dir / f'{ticker}_balance.json'
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(datos, f, indent=2, ensure_ascii=False)
        print(f"✅ Archivo guardado en: {output_path}")
    except Exception as e:
        print(f"❌ Error guardando archivo: {e}")
        return None
    
    print(f"✅ Procesado {ticker}: {datos}")
    return datos

if __name__ == "__main__":
    procesar_pamp('uploads/balances/BalancePAMP4.2025.pdf', 'PAMP')