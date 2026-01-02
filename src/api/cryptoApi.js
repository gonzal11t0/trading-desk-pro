// src/api/cryptoApi.js
export const fetchCryptoPrice = async (symbol) => {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd&include_24hr_change=true`
    );
    
    if (!response.ok) throw new Error('API Error');
    const data = await response.json();
    
    return {
      price: data[symbol]?.usd,
      change: data[symbol]?.usd_24h_change
    };
  } catch {
    // Sin parámetro 'error' para evitar warning
    return fetchCryptoFallback(symbol);
  }
};

const fetchCryptoFallback = async (symbol) => {
  try {
    const response = await fetch(
      `https://api.coincap.io/v2/assets/${symbol}`
    );
    if (response.ok) {
      const data = await response.json();
      return {
        price: parseFloat(data.data.priceUsd),
        change: parseFloat(data.data.changePercent24Hr)
      };
    }
    throw new Error('CoinCap API failed');
  } catch {
    return getMockCryptoData(symbol);
  }
};

const getMockCryptoData = (symbol) => {
  const mockData = {
    bitcoin: { price: 42150, change: 2.5 },
    ethereum: { price: 2250, change: 1.8 },
    default: { price: 100, change: 0 }
  };
  return mockData[symbol] || mockData.default;
};