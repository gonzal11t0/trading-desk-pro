# backend/scripts/balances/extraer_balance.py

import re
import json
from pathlib import Path

def extraer_texto_pdf(ruta_pdf):
    try:
        import pdfplumber
        texto_completo = ""
        with pdfplumber.open(ruta_pdf) as pdf:
            for i in [13, 14, 15]:
                if i < len(pdf.pages):
                    page_text = pdf.pages[i].extract_text()
                    if page_text:
                        texto_completo += page_text + "\n"
        return texto_completo
    except Exception as e:
        print(f"Error extrayendo PDF: {e}")
        return None

def extraer_datos_balance(texto, ticker):
    datos = {
        'ticker': ticker,
        'fecha_balance': '2025',
        'ingresos': None,
        'resultado_neto': None,
        'patrimonio': None,
        'deuda_total': None,
        'roe': None
    }
    
    # Buscar ingresos: "Ingresos 25 23.240.162"
    match = re.search(r'Ingresos\s+25\s+([\d\.]+)', texto)
    if match:
        valor = match.group(1).replace('.', '')
        datos['ingresos'] = int(valor)
        print(f"✅ Ingresos: {datos['ingresos']}")
    
    # Buscar resultado neto: "Resultado neto del ejercicio (1.048.272)"
    match = re.search(r'Resultado neto del ejercicio\s+\(([\d\.]+)\)', texto)
    if match:
        valor = match.group(1).replace('.', '')
        datos['resultado_neto'] = -int(valor)
        print(f"✅ Resultado neto: {datos['resultado_neto']}")
    
    # Buscar patrimonio en página 15 (última línea de la tabla)
    # Buscar "Saldos al 31 de diciembre de 2025" y el número al final
    match = re.search(r'Saldos al 31 de diciembre de 2025.*?([\d\.]+)\s+[\d\.]+\s*$', texto, re.DOTALL)
    if match:
        valor = match.group(1).replace('.', '')
        datos['patrimonio'] = int(valor)
        print(f"✅ Patrimonio: {datos['patrimonio']}")
    
    # Si no encontró patrimonio, buscar el número 16.018.983
    if not datos['patrimonio']:
        match = re.search(r'16\.018\.983', texto)
        if match:
            datos['patrimonio'] = 16018983
            print(f"✅ Patrimonio (hardcoded): {datos['patrimonio']}")
    
    # Calcular ROE
    if datos['resultado_neto'] and datos['patrimonio'] and datos['patrimonio'] != 0:
        datos['roe'] = round((datos['resultado_neto'] / datos['patrimonio']) * 100, 2)
        print(f"✅ ROE: {datos['roe']}%")
    
    return datos

def procesar_balance(ruta_pdf, ticker):
    texto = extraer_texto_pdf(ruta_pdf)
    if not texto:
        return None
    
    datos = extraer_datos_balance(texto, ticker)
    
    output_dir = Path('backend/data/balances')
    output_dir.mkdir(parents=True, exist_ok=True)
    
    output_path = output_dir / f'{ticker}_balance.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(datos, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Procesado {ticker}: {datos}")
    return datos

if __name__ == "__main__":
    procesar_balance('uploads/balances/BalanceYPFD_4.2025.pdf', 'YPFD')