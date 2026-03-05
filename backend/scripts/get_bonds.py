# backend/scripts/get_bonds.py
import sys
import os
import json
import traceback

# Capturar toda la salida de error
error_log = []

def log(msg):
    error_log.append(msg)
    print(msg, file=sys.stderr)
    sys.stderr.flush()

log("🚀 Script get_bonds.py iniciado")

try:
    # Agregar ruta
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'PyOBD'))
    log("📂 Ruta PyOBD agregada")
    
    # Importar PyOBD
    log("📦 Importando PyOBD...")
    from PyOBD import *
    log("✅ PyOBD importado")
    
    # Inicializar
    log("🔄 Inicializando openBYMAdata()...")
    PyOBD = openBYMAdata()
    log("✅ openBYMAdata() OK")
    
    # Obtener bonos
    log("📊 Ejecutando get_bonds()...")
    bonos = PyOBD.get_bonds()
    log(f"✅ get_bonds() OK. Tipo: {type(bonos)}")
    
    # Convertir a JSON
    if hasattr(bonos, 'to_dict'):
        resultado = bonos.to_dict('records')
    elif isinstance(bonos, list):
        resultado = bonos
    else:
        resultado = str(bonos)
    
    log(f"📦 JSON generado con {len(resultado)} bonos")
    
    # Devolver JSON + logs
    respuesta = {
        "success": True,
        "data": resultado,
        "logs": error_log
    }
    print(json.dumps(respuesta, default=str))
    
except Exception as e:
    respuesta = {
        "success": False,
        "error": str(e),
        "traceback": traceback.format_exc(),
        "logs": error_log
    }
    print(json.dumps(respuesta, indent=2))