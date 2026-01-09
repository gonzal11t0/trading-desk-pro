// src/api/riskCountryApi.js 

const RISK_COUNTRY_API_URL = import.meta.env.DEV 
  ? '/api/argentina-datos/finanzas/indices/riesgo-pais'
  : 'https://api.argentinadatos.com/v1/finanzas/indices/riesgo-pais';

const CACHE_KEY = 'riskCountryCache';
const CACHE_DURATION = 3600000; // 1 hora

export const riskCountryApi = {
  /**
   * Obtiene el último valor del riesgo país (EMBI+ Argentina)
   */
  async getLatestRiskCountry() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${RISK_COUNTRY_API_URL}/ultimo`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (!data || typeof data.valor !== 'number' || !data.fecha) {
        throw new Error('Datos inválidos');
      }

      const result = {
        fecha: data.fecha,
        valor: data.valor,
        timestamp: new Date().toISOString(),
        source: 'argentinaDatos'
      };

      this.cacheData(result);
      return result;
      
    } catch {
      return this.getFallbackData();
    }
  },

  /**
   * Obtiene datos de fallback (cache o mock)
   */
  getFallbackData() {
    const cached = this.getCachedData();
    if (cached) {
      return { ...cached, source: 'cache' };
    }

    return this.getMockData();
  },

  /**
   * Obtiene datos cacheados válidos
   */
  getCachedData() {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      
      const parsed = JSON.parse(cached);
      const isFresh = Date.now() - new Date(parsed.timestamp).getTime() < CACHE_DURATION;
      
      return isFresh ? parsed : null;
    } catch {
      return null;
    }
  },

  /**
   * Genera datos mock para cuando no hay conexión
   */
  getMockData() {
    return {
      fecha: new Date().toISOString().split('T')[0],
      valor: 1800,
      timestamp: new Date().toISOString(),
      source: 'mock',
      description: 'EMBI+ Argentina',
      change: -25,
      changePercent: -1.37
    };
  },

  /**
   * Guarda datos en caché
   */
  cacheData(data) {
    try {
      const cacheData = {
        ...data,
        cachedAt: new Date().toISOString()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch {
      // Fallo silencioso
    }
  },

  /**
   * Obtiene datos históricos del riesgo país
   */
  async getHistoricalData(days = 30) {
    try {
      const response = await fetch(`${RISK_COUNTRY_API_URL}?limit=${days}`, {
        timeout: 10000
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (!Array.isArray(data)) {
        return this.getMockHistoricalData(days);
      }

      return data.map(item => ({
        fecha: item.fecha,
        valor: item.valor,
        fechaFormateada: this.formatDate(item.fecha)
      })).reverse(); // Más reciente primero
      
    } catch {
      return this.getMockHistoricalData(days);
    }
  },

  /**
   * Genera datos históricos mock
   */
  getMockHistoricalData(days = 30) {
    const data = [];
    const baseValue = 1800;
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Variación aleatoria realista
      const variation = (Math.random() - 0.5) * 40; // ±20 puntos
      const value = baseValue + (i * 2) + variation;
      
      data.push({
        fecha: date.toISOString().split('T')[0],
        valor: Math.round(value),
        fechaFormateada: this.formatDate(date.toISOString().split('T')[0])
      });
    }
    
    return data;
  },

  /**
   * Formatea fecha para mostrar
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  },

  /**
   * Calcula estadísticas del riesgo país
   */
  calculateStats(historicalData) {
    if (!Array.isArray(historicalData) || historicalData.length === 0) {
      return null;
    }

    const values = historicalData.map(item => item.valor);
    const latest = values[0];
    const previous = values.length > 1 ? values[1] : latest;
    const change = latest - previous;
    const changePercent = (change / previous) * 100;
    
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    
    return {
      current: latest,
      change,
      changePercent: parseFloat(changePercent.toFixed(2)),
      min,
      max,
      avg: parseFloat(avg.toFixed(0)),
      volatility: parseFloat(((max - min) / avg * 100).toFixed(1))
    };
  }
};

export default riskCountryApi;