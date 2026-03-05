# backend/scripts/get_bonds.py
import sys
import os
import json
import traceback

# Agregar la ruta de PyOBD al path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'PyOBD'))

try:
    print("🚀 Iniciando script de bonos...", file=sys.stderr)
    
    from PyOBD import *
    print("✅ PyOBD importado correctamente", file=sys.stderr)
    
    PyOBD = openBYMAdata()
    print("✅ openBYMAdata() ejecutado", file=sys.stderr)
    
    bonos = PyOBD.get_bonds()
    print(f"✅ get_bonds() ejecutado, tipo: {type(bonos)}", file=sys.stderr)
    
    # Convertir a JSON
    if hasattr(bonos, 'to_dict'):
        resultado = bonos.to_dict('records')
    elif isinstance(bonos, list):
        resultado = bonos
    else:
        resultado = str(bonos)
    
    print(json.dumps(resultado, default=str, indent=2))
    
except Exception as e:
    print(json.dumps({
        "error": str(e),
        "traceback": traceback.format_exc()
    }, indent=2), file=sys.stderr)
    sys.exit(1)