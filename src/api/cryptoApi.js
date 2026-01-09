// src/api/cryptoApi.js

/**
 * Obtiene el precio y cambio de una criptomoneda
 * @param {string} symbol - ID de la criptomoneda (bitcoin, ethereum, etc.)
 * @returns {Promise<{price: number, change: number}>} Datos de la criptomoneda
 */
export const fetchCryptoPrice = async (symbol) => {
  try {
    const data = await fetchCoinGeckoData(symbol);
    if (data) return data;
    
    const fallbackData = await fetchCoinCapData(symbol);
    if (fallbackData) return fallbackData;
    
    return getMockCryptoData(symbol);
  } catch {
    return getMockCryptoData(symbol);
  }
};

/**
 * Obtiene datos desde CoinGecko API (primera opción)
 */
const fetchCoinGeckoData = async (symbol) => {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd&include_24hr_change=true`,
      { timeout: 5000 }
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    const cryptoData = data[symbol];
    
    if (cryptoData?.usd !== undefined && cryptoData?.usd_24h_change !== undefined) {
      return {
        price: cryptoData.usd,
        change: cryptoData.usd_24h_change
      };
    }
    
    return null;
  } catch {
    return null;
  }
};

/**
 * Obtiene datos desde CoinCap API (fallback)
 */
const fetchCoinCapData = async (symbol) => {
  try {
    const response = await fetch(
      `https://api.coincap.io/v2/assets/${symbol}`,
      { timeout: 5000 }
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    const assetData = data.data;
    
    if (assetData?.priceUsd && assetData?.changePercent24Hr) {
      return {
        price: parseFloat(assetData.priceUsd),
        change: parseFloat(assetData.changePercent24Hr)
      };
    }
    
    return null;
  } catch {
    return null;
  }
};

/**
 * Datos mock para cuando fallan todas las APIs
 */
const getMockCryptoData = (symbol) => {
  const mockData = {
    bitcoin: { 
      price: 42150, 
      change: 2.5,
      name: 'Bitcoin'
    },
    ethereum: { 
      price: 2250, 
      change: 1.8,
      name: 'Ethereum'
    },
    tether: { 
      price: 1.0, 
      change: 0.0,
      name: 'Tether'
    },
    'usd-coin': { 
      price: 1.0, 
      change: 0.0,
      name: 'USD Coin'
    },
    binancecoin: { 
      price: 310.5, 
      change: -0.5,
      name: 'Binance Coin'
    },
    ripple: { 
      price: 0.62, 
      change: 0.8,
      name: 'Ripple'
    },
    cardano: { 
      price: 0.48, 
      change: 1.2,
      name: 'Cardano'
    },
    solana: { 
      price: 95.30, 
      change: 3.5,
      name: 'Solana'
    },
    dogecoin: { 
      price: 0.082, 
      change: 0.5,
      name: 'Dogecoin'
    },
    polkadot: { 
      price: 6.85, 
      change: -0.3,
      name: 'Polkadot'
    }
  };
  
  // Retorna datos específicos o datos default mejorados
  return mockData[symbol] || {
    price: 100,
    change: 0,
    name: 'Crypto'
  };
};

/**
 * Obtiene datos de múltiples criptomonedas a la vez (función adicional útil)
 */
export const fetchMultipleCryptoPrices = async (symbols) => {
  try {
    const promises = symbols.map(symbol => fetchCryptoPrice(symbol));
    const results = await Promise.allSettled(promises);
    
    return results.map((result, index) => ({
      symbol: symbols[index],
      ...(result.status === 'fulfilled' ? result.value : getMockCryptoData(symbols[index]))
    }));
  } catch {
    // Fallback completo con datos mock
    return symbols.map(symbol => ({
      symbol,
      ...getMockCryptoData(symbol)
    }));
  }
};