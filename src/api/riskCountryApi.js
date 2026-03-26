// src/api/riskCountryApi.js
// src/api/riskCountryApi.js
const RISK_COUNTRY_API_URL = import.meta.env.DEV 
  ? '/api/argentina-datos/v1/finanzas/indices/riesgo-pais'  // 👈 debe coincidir con la ruta del proxy
  : 'https://api.argentinadatos.com/v1/finanzas/indices/riesgo-pais';
export const riskCountryApi = {
  async getLatestRiskCountry() {
    try {
      const url = `${RISK_COUNTRY_API_URL}/`;
      console.log('📡 URL a llamar:', url);
      
      const response = await fetch(url);
      console.log('📊 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Datos recibidos (cantidad):', data.length);
      
      // La API devuelve un array con todos los valores históricos
      // El último elemento es el más reciente
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No hay datos disponibles');
      }
      
      const latest = data[data.length - 1];
      console.log('📅 Último registro:', latest);
      
      return {
        fecha: latest.fecha,
        valor: latest.valor,
        timestamp: new Date().toISOString(),
        source: 'argentinaDatos'
      };
      
    } catch (error) {
      console.error('❌ Error en riesgo país:', error.message);
      return this.getFallbackData();
    }
  },

  getFallbackData() {
    const cached = this.getCachedData();
    if (cached) {
      console.log('📦 Usando datos cacheados');
      return { ...cached, source: 'cache' };
    }
    console.log('🎭 Usando datos mock');
    return this.getMockData();
  },

  getCachedData() {
    try {
      const cached = localStorage.getItem('riskCountryCache');
      if (!cached) return null;
      const parsed = JSON.parse(cached);
      // Cache válido por 1 hora
      const isFresh = Date.now() - new Date(parsed.timestamp).getTime() < 3600000;
      return isFresh ? parsed : null;
    } catch {
      return null;
    }
  },

  cacheData(data) {
    try {
      localStorage.setItem('riskCountryCache', JSON.stringify(data));
    } catch {}
  },

  getMockData() {
    return {
      fecha: new Date().toISOString().split('T')[0],
      valor: 400,
      timestamp: new Date().toISOString(),
      source: 'mock',
      description: 'EMBI+ Argentina',
      change: -25,
      changePercent: -1.37
    };
  }
};

export default riskCountryApi;