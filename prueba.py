# prueba.py
import yfinance as yf

# Datos de YPF
ticker = "YPF"

# Obtener info de la empresa
info = yf.Ticker(ticker).info
print("=== INFO YPF ===")
print(f"Nombre: {info.get('longName', 'N/A')}")
print(f"Sector: {info.get('sector', 'N/A')}")
print(f"Precio actual: ${info.get('currentPrice', 'N/A')}")
print(f"PER: {info.get('trailingPE', 'N/A')}")
print(f"Market Cap: ${info.get('marketCap', 'N/A')}")

# Balances (trimestrales)
print("\n=== BALANCES TRIMESTRALES ===")
balances = yf.Ticker(ticker).quarterly_financials
print(balances.head())