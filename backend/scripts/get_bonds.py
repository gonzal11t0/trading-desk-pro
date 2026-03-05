# backend/scripts/get_bonds.py
import sys
import os
import json
import traceback

# 📍 LOG 1: El script arrancó
print("🚀 Script get_bonds.py iniciado", file=sys.stderr)
sys.stderr.flush()

# Agregar la ruta de PyOBD
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'PyOBD'))
print("📂 Ruta PyOBD agregada", file=sys.stderr)
sys.stderr.flush()

try:
    # 📍 LOG 2: Intentando importar PyOBD
    print("📦 Importando PyOBD...", file=sys.stderr)
    sys.stderr.flush()
    
    from PyOBD import *
    
    print("✅ PyOBD importado correctamente", file=sys.stderr)
    sys.stderr.flush()
    
    # 📍 LOG 3: Inicializando openBYMAdata
    print("🔄 Inicializando openBYMAdata()...", file=sys.stderr)
    sys.stderr.flush()
    
    PyOBD = openBYMAdata()
    
    print("✅ openBYMAdata() ejecutado", file=sys.stderr)
    sys.stderr.flush()
    
    # 📍 LOG 4: Obteniendo bonos
    print("📊 Obteniendo bonos con get_bonds()...", file=sys.stderr)
    sys.stderr.flush()
    
    bonos = PyOBD.get_bonds()
    
    print(f"✅ get_bonds() ejecutado. Tipo: {type(bonos)}", file=sys.stderr)
    sys.stderr.flush()
    
    # Convertir a JSON
    if hasattr(bonos, 'to_dict'):
        resultado = bonos.to_dict('records')
    elif isinstance(bonos, list):
        resultado = bonos
    else:
        resultado = str(bonos)
    
    print(f"📦 JSON generado con {len(resultado)} bonos", file=sys.stderr)
    sys.stderr.flush()
    
    # 📍 LOG 5: Imprimiendo JSON final
    print(json.dumps(resultado, default=str, indent=2))
    
except Exception as e:
    print("❌ ERROR:", file=sys.stderr)
    print(json.dumps({
        "error": str(e),
        "traceback": traceback.format_exc()
    }, indent=2))
    sys.exit(1)