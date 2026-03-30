# backend/scripts/balances/extraer_cepu.py
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
        print(f"Error extrayendo PDF CEPU: {e}")
        return None

def parsear_numero(valor_str):
    """Convierte un string como '782.6' a float 782.6"""
    return float(valor_str.replace(',', ''))

def extraer_datos_cepu(texto, ticker):
    datos = {
        'ticker': ticker,
        'fecha_balance': '2025',
        'ingresos_usd': None,
        'resultado_neto_usd': None,
        'ebitda_usd': None,
        'ebitda_ajustado_usd': None,
        'resultado_operativo_usd': None,
        'ganancia_bruta_usd': None,
        'resultado_antes_impuestos_usd': None,
        'patrimonio_usd': None,
        'deuda_total_usd': None,
        'roe': None
    }
    
    # Ingresos
    match = re.search(r'Ingresos de Actividades Ordinarias\s+([\d\.]+)\s+([\d\.]+)', texto)
    if match:
        datos['ingresos_usd'] = parsear_numero(match.group(1)) * 1_000_000
        print(f"✅ Ingresos: US$ {datos['ingresos_usd']:,.0f}")
    
    # Resultado neto
    match = re.search(r'Ganancia \(Pérdida\) neta del ejercicio\s+([\d\.]+)\s+([\d\.]+)', texto)
    if match:
        datos['resultado_neto_usd'] = parsear_numero(match.group(1)) * 1_000_000
        print(f"✅ Resultado neto: US$ {datos['resultado_neto_usd']:,.0f}")
    
    # EBITDA
    match = re.search(r'EBITDA\s+([\d\.]+)\s+([\d\.]+)', texto)
    if match:
        datos['ebitda_usd'] = parsear_numero(match.group(1)) * 1_000_000
        print(f"✅ EBITDA: US$ {datos['ebitda_usd']:,.0f}")
    
    # EBITDA Ajustado
    match = re.search(r'EBITDA Ajustado\s+([\d\.]+)\s+([\d\.]+)', texto)
    if match:
        datos['ebitda_ajustado_usd'] = parsear_numero(match.group(1)) * 1_000_000
        print(f"✅ EBITDA Ajustado: US$ {datos['ebitda_ajustado_usd']:,.0f}")
    
    # Resultado operativo
    match = re.search(r'Resultado operative\s+([\d\.]+)\s+([\d\.]+)', texto)
    if match:
        datos['resultado_operativo_usd'] = parsear_numero(match.group(1)) * 1_000_000
        print(f"✅ Resultado operativo: US$ {datos['resultado_operativo_usd']:,.0f}")
    
    # Ganancia bruta
    match = re.search(r'Ganancia bruta\s+([\d\.]+)\s+([\d\.]+)', texto)
    if match:
        datos['ganancia_bruta_usd'] = parsear_numero(match.group(1)) * 1_000_000
        print(f"✅ Ganancia bruta: US$ {datos['ganancia_bruta_usd']:,.0f}")
    
    # Resultado antes de impuestos
    match = re.search(r'Resultados antes del impuesto a las ganancias\s+([\d\.]+)\s+([\d\.]+)', texto)
    if match:
        datos['resultado_antes_impuestos_usd'] = parsear_numero(match.group(1)) * 1_000_000
        print(f"✅ Resultado antes impuestos: US$ {datos['resultado_antes_impuestos_usd']:,.0f}")
    
    # Patrimonio neto
    match = re.search(r'Patrimonio neto total y pasivos\s+([\d\.,]+)\s+([\d\.,]+)', texto)
    if match:
        valor = match.group(1).replace(',', '').replace('.', '')
        datos['patrimonio_usd'] = float(valor) * 1_000_000
        print(f"✅ Patrimonio: US$ {datos['patrimonio_usd']:,.0f}")
    
    # Calcular ROE
    if datos['resultado_neto_usd'] and datos['patrimonio_usd'] and datos['patrimonio_usd'] != 0:
        datos['roe'] = round((datos['resultado_neto_usd'] / datos['patrimonio_usd']) * 100, 2)
        print(f"✅ ROE: {datos['roe']}%")
    
    return datos

def procesar_cepu(ruta_pdf, ticker):
    texto = extraer_texto_pdf(ruta_pdf)
    if not texto:
        print("❌ No se pudo extraer texto del PDF")
        return None
    
    datos = extraer_datos_cepu(texto, ticker)
    
    if not datos:
        print("❌ No se pudieron extraer datos")
        return None
    
    # Asegurar que la carpeta existe
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
    procesar_cepu('uploads/balances/BalanceCEPU4.2025.pdf', 'CEPU')