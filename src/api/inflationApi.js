const INFLATION_URL = '/api/argentina-datos/v1/finanzas/indices/inflacion';

export const inflationApi = {
  async getLastMonthsInflation(months = 12) {
    const response = await fetch(INFLATION_URL, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`La API de inflación respondió HTTP ${response.status}`);
    const payload = await response.json();
    if (!Array.isArray(payload) || payload.length === 0) throw new Error('La API de inflación no devolvió datos');

    const latest = payload
      .filter((item) => item.fecha && Number.isFinite(Number(item.valor)))
      .sort((a, b) => b.fecha.localeCompare(a.fecha))
      .slice(0, months);

    return latest.map((item, index) => {
      const previousValue = latest[index + 1] ? Number(latest[index + 1].valor) : null;
      const currentValue = Number(item.valor);
      const change = previousValue ? ((currentValue - previousValue) / Math.abs(previousValue)) * 100 : null;
      return {
        date: item.fecha,
        values: { monthly: currentValue, yearly: null, accumulated: null },
        change: { monthly: change === null ? null : `${change >= 0 ? '+' : ''}${change.toFixed(1)}`, yearly: null, accumulated: null },
        source: 'ArgentinaDatos'
      };
    });
  }
};

export default inflationApi;
