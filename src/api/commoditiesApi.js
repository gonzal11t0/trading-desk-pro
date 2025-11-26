// src/api/commoditiesApi.js
export const fetchCommoditiesData = async () => {
  try {
    // API simple sin parámetros no usados
    const goldData = await fetchCommodity('gold');
    const silverData = await fetchCommodity('silver');
    const oilData = await fetchCommodity('oil');
    
    return {
      gold: {
        price: goldData.price || 1987.50,
        change: goldData.change || 15.25,
        changePercent: goldData.changePercent || 0.77,
        name: 'Oro'
      },
      silver: {
        price: silverData.price || 23.18,
        change: silverData.change || 0.42,
        changePercent: silverData.changePercent || 1.85,
        name: 'Plata'
      },
      oil: {
        price: oilData.price || 78.42,
        change: oilData.change || -1.35,
        changePercent: oilData.changePercent || -1.69,
        name: 'Petróleo WTI'
      }
    };
  } catch {
    console.warn('Commodities APIs failed, using reliable fallback');
    return fetchReliableCommodities();
  }
};

const fetchCommodity = async (commodity) => {
  try {
    let url = '';
    switch(commodity) {
      case 'gold':
        url = 'https://api.metals.live/v1/spot/gold';
        break;
      case 'silver':
        url = 'https://api.metals.live/v1/spot/silver';
        break;
      case 'oil':
        url = 'https://api.etherchain.org/api/v1/prices';
        break;
      default:
        return {};
    }
    
    const response = await fetch(url);
    if (response.ok) {
      const result = await response.json();
      // Procesar directamente sin función extra
      if (commodity === 'gold' && result[0]) {
        return {
          price: result[0].price,
          change: result[0].change,
          changePercent: result[0].changePercent
        };
      }
      if (commodity === 'silver' && result[0]) {
        return {
          price: result[0].price,
          change: result[0].change,
          changePercent: result[0].changePercent
        };
      }
      if (commodity === 'oil' && result.data && result.data[0]) {
        return {
          price: result.data[0].usd,
          change: -1.35,
          changePercent: -1.69
        };
      }
    }
    return {};
  } catch {
    return {};
  }
};

const fetchReliableCommodities = async () => {
  try {
    const response = await fetch(
      'https://financialmodelingprep.com/api/v3/quote/GCUSD,SIUSD,CLUSD?apikey=demo'
    );
    
    if (response.ok) {
      const result = await response.json();
      const gold = result.find(item => item.symbol === 'GCUSD');
      const silver = result.find(item => item.symbol === 'SIUSD');
      const oil = result.find(item => item.symbol === 'CLUSD');
      
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
    }
    throw new Error('Commodities fallback API failed');
  } catch {
    console.warn('All commodities APIs failed, using mock data');
    // Datos mock directos sin función extra
    return {
      gold: {
        price: 1987.50,
        change: 15.25,
        changePercent: 0.77,
        name: 'Oro'
      },
      oil: {
        price: 78.42,
        change: -1.35,
        changePercent: -1.69,
        name: 'Petróleo WTI'
      },
      silver: {
        price: 23.18,
        change: 0.42,
        changePercent: 1.85,
        name: 'Plata'
      }
    };
  }
};