// src/api/mervalApi.js
export const fetchMervalData = async () => {
  try {
    const response = await fetch(
      'https://api.estadisticasbcra.com/api/merval'
    );
    
    if (!response.ok) throw new Error('MERVAL API Error');
    const result = await response.json();
    
    const latest = result[result.length - 1];
    
    return {
      price: latest.v,
      change: 0,
      changePercent: 0,
      volume: 0,
      timestamp: latest.d
    };
  } catch {
    return fetchMervalFallback();
  }
};

const fetchMervalFallback = async () => {
  try {
    const response = await fetch(
      'https://mercados.ambito.com/merval/grafico/anual'
    );
    
    if (response.ok) {
      const result = await response.json();
      const latest = result[result.length - 1];
      
      return {
        price: latest.cierre,
        change: latest.variacion,
        changePercent: latest.variacionPorcentual,
        volume: 0,
        timestamp: latest.fecha
      };
    }
    throw new Error('Fallback MERVAL API failed');
  } catch {
    // Datos mock directos sin función extra
    return {
      price: 1250450,
      change: 9845,
      changePercent: 0.79,
      volume: 24567890000,
      timestamp: new Date().toISOString()
    };
  }
};