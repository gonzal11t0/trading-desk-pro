const BCRA_BASE_URL = 'https://api.bcra.gob.ar/estadisticas/v4.0';

const MONETARY_INDICATORS = [
  { id: 1, key: 'reserves', label: 'Reservas Internacionales', unit: 'USD' },
  { id: 15, key: 'monetary_base', label: 'Base Monetaria', unit: 'ARS' },
  { id: 109, key: 'm2', label: 'M2 (Oferta Monetaria)', unit: 'ARS' }
];

const fetchJson = async (url) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`BCRA respondió HTTP ${response.status}`);
  return response.json();
};

export const getBcraMonetaryData = async () => {
  const payload = await fetchJson(`${BCRA_BASE_URL}/Monetarias?limit=2000`);
  const variables = Array.isArray(payload.results) ? payload.results : [];

  return MONETARY_INDICATORS.map((config) => {
    const variable = variables.find((item) => item.idVariable === config.id);
    const rawValue = Number(variable?.ultValorInformado);
    if (!Number.isFinite(rawValue)) {
      throw new Error(`BCRA no devolvió la variable ${config.id} (${config.label})`);
    }
    return {
      id: config.key,
      idVariable: config.id,
      label: config.label,
      rawValue,
      date: variable.ultFechaInformada,
      change: null,
      unit: config.unit,
      source: 'BCRA API v4.0',
      descripcion: variable.descripcion || config.label,
      hasRealData: true
    };
  });
};

export const fetchEconomicData = async () => {
  const bcraData = await getBcraMonetaryData();
  const find = (id) => bcraData.find((item) => item.id === id);
  const reserves = find('reserves');
  const monetaryBase = find('monetary_base');
  const m2 = find('m2');

  return {
    bcraData,
    indicators: [],
    reserves: reserves && { value: reserves.rawValue, change: reserves.change, label: reserves.label, unit: reserves.unit, date: reserves.date },
    monetaryBase: monetaryBase && { value: monetaryBase.rawValue, change: monetaryBase.change, label: monetaryBase.label, unit: monetaryBase.unit, date: monetaryBase.date },
    moneySupply: m2 && { m2: m2.rawValue, label: m2.label, unit: m2.unit, date: m2.date }
  };
};

export default { fetchEconomicData, getBcraMonetaryData };
