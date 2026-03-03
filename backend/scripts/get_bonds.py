# backend/scripts/get_bonds.py
import sys
import os
import json
import pandas as pd

# Agregar la ruta de PyOBD al path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'PyOBD'))

from PyOBD import *

try:
    PyOBD = openBYMAdata()
    bonos = PyOBD.get_bonds()
    
    # Convertir DataFrame a lista de diccionarios
    if isinstance(bonos, pd.DataFrame):
        # Seleccionar columnas relevantes
        columnas = ['symbol', 'last', 'close', 'change', 'bid', 'ask', 
                    'volume', 'datetime', 'expiration']
        bonos_dict = bonos[columnas].to_dict(orient='records')
        print(json.dumps(bonos_dict, default=str, indent=2))
    else:
        print(json.dumps({"error": "Formato inesperado"}, indent=2))
        
except Exception as e:
    print(json.dumps({"error": str(e)}, indent=2))