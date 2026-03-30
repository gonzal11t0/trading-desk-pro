# backend/scripts/balances/update_balances.py
import json
from pathlib import Path
from extraer_balance import procesar_balance
from .extraer_balance import procesar_balance
EMPRESAS = ['YPFD', 'BMA', 'GGAL', 'TECO2', 'TGSU2', 'ALUA', 'CEPU', 'EDN', 'PAMP', 'COME']
UPLOAD_DIR = Path('backend/uploads/balances')
DATA_DIR = Path('backend/data/balances')

def actualizar_todos():
    resultados = []
    
    for empresa in EMPRESAS:
        pdf_path = UPLOAD_DIR / f'{empresa}_2025.pdf'
        if pdf_path.exists():
            print(f"📄 Procesando {empresa}...")
            datos = procesar_balance(pdf_path, empresa)
            if datos:
                resultados.append(datos)
        else:
            print(f"⚠️ No encontrado: {pdf_path}")
    
    # Guardar índice general
    with open(DATA_DIR / 'indice_balances.json', 'w', encoding='utf-8') as f:
        json.dump(resultados, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Procesados {len(resultados)} de {len(EMPRESAS)} empresas")

if __name__ == "__main__":
    actualizar_todos()