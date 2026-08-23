const CACHE_KEY = 'tradingDeskQuotesCache';

const SOURCES = [
  { symbol: 'S&P 500', loader: () => fetchYahooQuote('%5EGSPC') },
  { symbol: 'NASDAQ', loader: () => fetchYahooQuote('%5EIXIC') },
  { symbol: 'BTC/USD', loader: fetchBitcoin },
  { symbol: 'DÓLAR BLUE', loader: fetchDolarBlue },
  { symbol: 'MERVAL', loader: () => fetchYahooQuote('%5EMERV') },
  { symbol: 'ORO', loader: () => fetchYahooQuote('GC%3DF') }
];

const fetchJson = async (url) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(12000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
};

const fetchYahooQuote = async (encodedSymbol) => {
  const data = await fetchJson(`/api/yahoo/v8/finance/chart/${encodedSymbol}?interval=1d&range=5d`);
  const result = data.chart?.result?.[0];
  const meta = result?.meta;
  const prices = (result?.indicators?.quote?.[0]?.close || []).filter(Number.isFinite);
  const price = Number(meta?.regularMarketPrice ?? prices.at(-1));
  const previousClose = Number(meta?.chartPreviousClose ?? meta?.previousClose ?? prices.at(-2));
  if (!Number.isFinite(price)) throw new Error('Yahoo no devolvió precio');
  const change = Number.isFinite(previousClose) ? price - previousClose : null;
  return { price, change, changePercent: change === null ? null : (change / previousClose) * 100, source: 'Yahoo Finance' };
};

const fetchBitcoin = async () => {
  const data = await fetchJson('/api/coingecko/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
  const bitcoin = data.bitcoin;
  if (!Number.isFinite(bitcoin?.usd)) throw new Error('CoinGecko no devolvió precio');
  return { price: bitcoin.usd, change: null, changePercent: Number(bitcoin.usd_24h_change), source: 'CoinGecko' };
};

const fetchDolarBlue = async () => {
  const data = await fetchJson('https://dolarapi.com/v1/dolares/blue');
  const price = (Number(data.compra) + Number(data.venta)) / 2;
  if (!Number.isFinite(price)) throw new Error('DolarApi no devolvió cotización blue');
  return { price, change: null, changePercent: null, source: 'DolarApi' };
};

const readCache = () => {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || {}; }
  catch { return {}; }
};

const formatPrice = (symbol, price) => {
  if (!Number.isFinite(price)) return '—';
  if (symbol === 'DÓLAR BLUE') return `$${Math.round(price).toLocaleString('es-AR')}`;
  if (symbol === 'MERVAL') return Math.round(price).toLocaleString('es-AR');
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);
};

const formatQuote = (symbol, data, source = data?.source) => {
  const changePercent = Number(data?.changePercent);
  const hasChange = Number.isFinite(changePercent);
  return {
    symbol,
    price: formatPrice(symbol, Number(data?.price)),
    change: hasChange ? `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%` : '—',
    positive: !hasChange || changePercent >= 0,
    source,
    raw: data
  };
};

export const fetchQuotesData = async () => {
  const cache = readCache();
  const results = await Promise.allSettled(SOURCES.map(({ loader }) => loader()));
  const nextCache = { ...cache };

  const quotes = SOURCES.map(({ symbol }, index) => {
    const result = results[index];
    if (result.status === 'fulfilled') {
      nextCache[symbol] = { ...result.value, cachedAt: new Date().toISOString() };
      return formatQuote(symbol, result.value);
    }
    if (cache[symbol]) return formatQuote(symbol, cache[symbol], `${cache[symbol].source} (último dato disponible)`);
    return formatQuote(symbol, null, 'No disponible');
  });

  localStorage.setItem(CACHE_KEY, JSON.stringify(nextCache));
  return quotes;
};

export default { fetchQuotesData };
