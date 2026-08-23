const RISK_COUNTRY_URL = '/api/argentina-datos/v1/finanzas/indices/riesgo-pais/ultimo';
const CACHE_KEY = 'riskCountryCache';

const readCache = () => {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
    return cached?.valor && cached?.fecha ? cached : null;
  } catch {
    return null;
  }
};

export const riskCountryApi = {
  async getLatestRiskCountry() {
    try {
      const response = await fetch(RISK_COUNTRY_URL, { signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      if (!Number.isFinite(Number(payload.valor)) || !payload.fecha) throw new Error('Respuesta de riesgo país inválida');
      const data = { fecha: payload.fecha, valor: Number(payload.valor), timestamp: new Date().toISOString(), source: 'ArgentinaDatos' };
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      return data;
    } catch (error) {
      const cached = readCache();
      if (cached) return { ...cached, source: 'cache' };
      throw new Error(`No se pudo obtener el riesgo país: ${error.message}`);
    }
  }
};

export default riskCountryApi;
