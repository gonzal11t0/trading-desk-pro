const RISK_COUNTRY_API_URL = import.meta.env.DEV 
  ? '/api/argentina-datos/finanzas/indices/riesgo-pais'
  : 'https://api.argentinadatos.com/v1/finanzas/indices/riesgo-pais';

export const riskCountryApi = {
  async getLatestRiskCountry() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${RISK_COUNTRY_API_URL}/ultimo`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data || typeof data.valor !== 'number' || !data.fecha) {
        throw new Error('Datos inválidos recibidos de la API');
      }

      return {
        fecha: data.fecha,
        valor: data.valor,
        timestamp: new Date().toISOString(),
        source: 'argentinaDatos'
      };
    } catch (error) {
      console.error('Error obteniendo riesgo país:', error);
      return this.getFallbackData();
    }
  },

  getFallbackData() {
    const cached = localStorage.getItem('riskCountryCache');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Date.now() - new Date(parsed.timestamp).getTime() < 3600000) {
          return { ...parsed, source: 'cache' };
        }
      } catch (e) {}
    }

    return {
      fecha: new Date().toISOString().split('T')[0],
      valor: 1800,
      timestamp: new Date().toISOString(),
      source: 'mock'
    };
  },

  cacheData(data) {
    try {
      const cacheData = {
        ...data,
        cachedAt: new Date().toISOString()
      };
      localStorage.setItem('riskCountryCache', JSON.stringify(cacheData));
    } catch (e) {
      console.error('Error guardando en caché:', e);
    }
  }
};