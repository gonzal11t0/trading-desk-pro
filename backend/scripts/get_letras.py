# backend/scripts/get_letras.py
import sys
import os
import json
import pandas as pd

# Agregar la ruta de PyOBD al path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'PyOBD'))

from PyOBD import *

try:
    PyOBD = openBYMAdata()
    letras = PyOBD.get_short_term_bonds()
    
    # Convertir DataFrame a lista de diccionarios
    if isinstance(letras, pd.DataFrame):
        # Seleccionar columnas relevantes
        columnas = ['symbol', 'last', 'bid', 'ask', 'volume', 'datetime']
        # Algunas letras pueden tener otras columnas, usamos las que existan
        disponibles = [col for col in columnas if col in letras.columns]
        letras_dict = letras[disponibles].to_dict(orient='records')
        print(json.dumps(letras_dict, default=str, indent=2))
    else:
        print(json.dumps({"error": "Formato inesperado"}, indent=2))
        
except Exception as e:
    print(json.dumps({"error": str(e)}, indent=2))