const CACHE_KEY = 'financialNewsCache';
const CACHE_DURATION = 30 * 60 * 1000;
const FEEDS = [
  { name: 'BBC Business', url: '/api/rss/bbc' },
  { name: 'Financial Times', url: '/api/rss/ft' }
];

const readCache = () => {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
    return cached?.timestamp && Date.now() - cached.timestamp < CACHE_DURATION ? cached.items : null;
  } catch {
    return null;
  }
};

const parseFeed = (xmlText, source) => {
  const xml = new DOMParser().parseFromString(xmlText, 'text/xml');
  if (xml.querySelector('parsererror')) throw new Error(`${source} devolvió XML inválido`);

  return Array.from(xml.querySelectorAll('item')).slice(0, 8).map((item) => ({
    title: item.querySelector('title')?.textContent?.trim(),
    source,
    url: item.querySelector('link')?.textContent?.trim(),
    time_published: new Date(item.querySelector('pubDate')?.textContent || Date.now()).toISOString(),
    summary: item.querySelector('description')?.textContent?.replace(/<[^>]*>/g, '').trim() || '',
    banner_image: null
  })).filter((item) => item.title && item.url);
};

const fetchFeed = async ({ name, url }) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`${name} respondió HTTP ${response.status}`);
  return parseFeed(await response.text(), name);
};

export const fetchLatestNews = async () => {
  const cached = readCache();
  if (cached?.length) return cached;

  const results = await Promise.allSettled(FEEDS.map(fetchFeed));
  const items = results
    .filter((result) => result.status === 'fulfilled')
    .flatMap((result) => result.value)
    .sort((a, b) => new Date(b.time_published) - new Date(a.time_published))
    .slice(0, 10);

  if (items.length === 0) throw new Error('No se pudieron obtener noticias financieras reales');
  localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), items }));
  return items;
};

export default { fetchLatestNews };
