// src/api/commoditiesApi.js 

/**
 * Obtiene datos de commodities (oro, plata, petróleo)
 * @returns {Promise<Object>} Datos de commodities formateados
 */
export const fetchCommoditiesData = async () => {
  try {
    const [goldData, silverData, oilData] = await Promise.allSettled([
      fetchCommodity('gold'),
      fetchCommodity('silver'),
      fetchCommodity('oil')
    ]);

    // Usar datos de la API si están disponibles, sino usar fallback
    return {
      gold: formatCommodityData(
        goldData.status === 'fulfilled' ? goldData.value : null,
        'Oro',
        1987.50,
        15.25,
        0.77
      ),
      silver: formatCommodityData(
        silverData.status === 'fulfilled' ? silverData.value : null,
        'Plata',
        23.18,
        0.42,
        1.85
      ),
      oil: formatCommodityData(
        oilData.status === 'fulfilled' ? oilData.value : null,
        'Petróleo WTI',
        78.42,
        -1.35,
        -1.69
      )
    };
  } catch (error) {
    return await fetchReliableCommodities();
  }
};

/**
 * Formatea datos de un commodity
 */
const formatCommodityData = (apiData, name, defaultPrice, defaultChange, defaultChangePercent) => ({
  price: apiData?.price || defaultPrice,
  change: apiData?.change || defaultChange,
  changePercent: apiData?.changePercent || defaultChangePercent,
  name
});

/**
 * Obtiene datos de un commodity específico desde APIs externas
 */
const fetchCommodity = async (commodity) => {
  try {
    const urls = {
      gold: 'https://api.metals.live/v1/spot/gold',
      silver: 'https://api.metals.live/v1/spot/silver',
      oil: 'https://api.etherchain.org/api/v1/prices'
    };

    const response = await fetch(urls[commodity], { timeout: 5000 });
    if (!response.ok) return null;

    const data = await response.json();
    return processCommodityResponse(commodity, data);
  } catch {
    return null;
  }
};

/**
 * Procesa la respuesta de la API según el tipo de commodity
 */
const processCommodityResponse = (commodity, data) => {
  switch (commodity) {
    case 'gold':
    case 'silver':
      if (data[0]) {
        return {
          price: data[0].price,
          change: data[0].change,
          changePercent: data[0].changePercent
        };
      }
      break;

    case 'oil':
      if (data.data?.[0]) {
        return {
          price: data.data[0].usd,
          change: -1.35,
          changePercent: -1.69
        };
      }
      break;
  }
  return null;
};

/**
 * Fallback usando Financial Modeling Prep API
 */
const fetchReliableCommodities = async () => {
  try {
    // Usar API key del entorno si está disponible
    const apiKey = import.meta.env.VITE_FMP_KEY || 'demo';
    const response = await fetch(
      `https://financialmodelingprep.com/api/v3/quote/GCUSD,SIUSD,CLUSD?apikey=${apiKey}`,
      { timeout: 5000 }
    );

    if (!response.ok) throw new Error('API fallback failed');

    const data = await response.json();
    
    // Encontrar cada commodity en los datos
    const findCommodity = (symbol, data) => 
      data.find(item => item.symbol === symbol);

    const gold = findCommodity('GCUSD', data);
    const silver = findCommodity('SIUSD', data);
    const oil = findCommodity('CLUSD', data);

    return {
      gold: {
        price: gold?.price || 1987.50,
        change: gold?.change || 15.25,
        changePercent: gold?.changesPercentage || 0.77,
        name: 'Oro'
      },
      silver: {
        price: silver?.price || 23.18,
        change: silver?.change || 0.42,
        changePercent: silver?.changesPercentage || 1.85,
        name: 'Plata'
      },
      oil: {
        price: oil?.price || 78.42,
        change: oil?.change || -1.35,
        changePercent: oil?.changesPercentage || -1.69,
        name: 'Petróleo WTI'
      }
    };
  } catch {
    // Datos mock de respaldo final
    return {
      gold: {
        price: 1987.50,
        change: 15.25,
        changePercent: 0.77,
        name: 'Oro'
      },
      silver: {
        price: 23.18,
        change: 0.42,
        changePercent: 1.85,
        name: 'Plata'
      },
      oil: {
        price: 78.42,
        change: -1.35,
        changePercent: -1.69,
        name: 'Petróleo WTI'
      }
    };
  }
};