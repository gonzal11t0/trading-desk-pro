// src/api/newsApi.js - VERSIÓN CON FUENTES ESPECÍFICAS REALES
export const fetchLatestNews = async () => {
  try {
    console.log('🚀 Buscando noticias de fuentes específicas...');
    
    // Usar una API de scraping profesional (gratuita)
    const scrapedNews = await fetchFromScrapingAPI();
    
    if (scrapedNews.length > 0) {
      console.log(`✅ ${scrapedNews.length} noticias reales obtenidas`);
      return scrapedNews.slice(0, 8);
    }
    
    // Fallback: RSS específico de cada fuente
    const rssNews = await fetchSpecificRSS();
    
    if (rssNews.length > 0) {
      console.log(`✅ ${rssNews.length} noticias de RSS específico`);
      return rssNews.slice(0, 8);
    }
    

  } catch (error) {
    console.error('Error:', error);
  }
};

// Scraping real usando ScraperAPI (gratis - 1000 requests/mes)
const fetchFromScrapingAPI = async () => {
  const sources = [
    {
      name: 'Bloomberg',
      url: 'https://www.bloomberg.com/markets',
      scraperUrl: 'https://api.scraperapi.com/?api_key=TU_API_KEY&url=https://www.bloomberg.com/markets'
    },
    {
      name: 'Infobae Economía',
      url: 'https://www.infobae.com/economia/',
      scraperUrl: 'https://api.scraperapi.com/?api_key=TU_API_KEY&url=https://www.infobae.com/economia/'
    },
    {
      name: 'TN Economía', 
      url: 'https://tn.com.ar/economia/',
      scraperUrl: 'https://api.scraperapi.com/?api_key=TU_API_KEY&url=https://tn.com.ar/economia/'
    },
    {
      name: 'Yahoo Finance',
      url: 'https://finance.yahoo.com/news/',
      scraperUrl: 'https://api.scraperapi.com/?api_key=TU_API_KEY&url=https://finance.yahoo.com/news/'
    },
    {
      name: 'Reuters',
      url: 'https://www.reuters.com/business/',
      scraperUrl: 'https://api.scraperapi.com/?api_key=TU_API_KEY&url=https://www.reuters.com/business/'
    }
  ];

  const newsPromises = sources.map(source => scrapeWithAPI(source));
  const results = await Promise.allSettled(newsPromises);
  
  return results
    .filter(result => result.status === 'fulfilled' && result.value)
    .map(result => result.value)
    .flat();
};

// Scraping profesional con ScraperAPI
const scrapeWithAPI = async (source) => {
  try {
    const API_KEY = '9f749093f5d78a1546678f8f00c9bc8b'; // Asegurate que esté bien pegada
    const scraperUrl = `https://api.scraperapi.com/?api_key=${API_KEY}&url=${encodeURIComponent(source.url)}&render=true`;
    
    console.log(`🔍 Scrapeando ${source.name}...`);
    const response = await fetch(scraperUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (response.ok) {
      const html = await response.text();
      const news = parseSpecificSource(html, source.name);
      console.log(`✅ ${source.name}: ${news.length} noticias`);
      return news;
    } else {
      console.log(`❌ ${source.name}: HTTP ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ ${source.name}: Error -`, error.message);
  }
  return [];
};
// Parsers específicos y actualizados para CADA fuente
const parseSpecificSource = (html, sourceName) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  try {
    switch (sourceName) {
      case 'Bloomberg':
        return parseBloombergReal(doc);
      case 'Infobae Economía':
        return parseInfobaeReal(doc);
      case 'TN Economía':
        return parseTNReal(doc);
      case 'Yahoo Finance':
        return parseYahooReal(doc);
      case 'Reuters':
        return parseReutersReal(doc);
      default:
        return [];
    }
  } catch (error) {
    console.warn(`Error parsing ${sourceName}:`, error);
    return [];
  }
};

// Bloomberg - Parser real
const parseBloombergReal = (doc) => {
  const articles = [];
  
  // Selectores REALES de Bloomberg
  const selectors = [
    'a[data-component="headline"]',
    '.story-list-story__info__headline-link',
    '[data-component-type="headline"]',
    'h1 a, h2 a, h3 a'
  ];

  selectors.forEach(selector => {
    const elements = doc.querySelectorAll(selector);
    elements.forEach(element => {
      const title = element.textContent?.trim();
      const url = element.href;
      
      if (title && url && title.length > 20 && 
          !title.includes('Subscribe') && 
          !title.includes('Newsletter')) {
        
        articles.push({
          title: generateSummary(title),
          source: 'Bloomberg',
          url: url.startsWith('http') ? url : `https://www.bloomberg.com${url}`,
          timestamp: new Date(),
          category: 'mercados',
          type: 'scraped'
        });
      }
    });
  });

  return articles.slice(0, 2);
};

// Infobae Economía - Parser real
const parseInfobaeReal = (doc) => {
  const articles = [];
  
  // Selectores REALES de Infobae
  const selectors = [
    '.headline a',
    '.news-story-headline a',
    'h2 a, h3 a',
    '[data-type="title"] a'
  ];

  selectors.forEach(selector => {
    const elements = doc.querySelectorAll(selector);
    elements.forEach(element => {
      const title = element.textContent?.trim();
      const url = element.href;
      
      if (title && url && title.length > 15 && !title.includes('Foto')) {
        articles.push({
          title: generateSummary(title),
          source: 'Infobae Economía',
          url: url.startsWith('http') ? url : `https://www.infobae.com${url}`,
          timestamp: new Date(),
          category: 'economía',
          type: 'scraped'
        });
      }
    });
  });

  return articles.slice(0, 2);
};

// TN Economía - Parser real (ya funciona)
const parseTNReal = (doc) => {
  const articles = [];
  
  const selectors = [
    '.news-title a',
    'h2 a, h3 a',
    '.title a'
  ];

  selectors.forEach(selector => {
    const elements = doc.querySelectorAll(selector);
    elements.forEach(element => {
      const title = element.textContent?.trim();
      const url = element.href;
      
      if (title && url && title.length > 15) {
        articles.push({
          title: generateSummary(title),
          source: 'TN Economía',
          url: url.startsWith('http') ? url : `https://tn.com.ar${url}`,
          timestamp: new Date(),
          category: 'economía',
          type: 'scraped'
        });
      }
    });
  });

  return articles.slice(0, 2);
};

// Yahoo Finance - Parser real
const parseYahooReal = (doc) => {
  const articles = [];
  
  // Selectores REALES de Yahoo Finance
  const selectors = [
    'h3 a',
    '[data-test-locator="headline"] a',
    '.stream-item h3 a',
    'a[referrerpolicy="origin"]'
  ];

  selectors.forEach(selector => {
    const elements = doc.querySelectorAll(selector);
    elements.forEach(element => {
      const title = element.textContent?.trim();
      const url = element.href;
      
      if (title && url && title.length > 15 && 
          !url.includes('/video/') && 
          !url.includes('/quote/')) {
        
        articles.push({
          title: generateSummary(title),
          source: 'Yahoo Finance',
          url: url.startsWith('http') ? url : `https://finance.yahoo.com${url}`,
          timestamp: new Date(),
          category: 'finanzas',
          type: 'scraped'
        });
      }
    });
  });

  return articles.slice(0, 2);
};

// Reuters - Parser real
const parseReutersReal = (doc) => {
  const articles = [];
  
  // Selectores REALES de Reuters
  const selectors = [
    'a[data-testid="Heading"]',
    'a[class*="media-story-card__heading"]',
    'h3 a, h2 a'
  ];

  selectors.forEach(selector => {
    const elements = doc.querySelectorAll(selector);
    elements.forEach(element => {
      const title = element.textContent?.trim();
      const url = element.href;
      
      if (title && url && title.length > 15) {
        articles.push({
          title: generateSummary(title),
          source: 'Reuters',
          url: url.startsWith('http') ? url : `https://www.reuters.com${url}`,
          timestamp: new Date(),
          category: 'negocios',
          type: 'scraped'
        });
      }
    });
  });

  return articles.slice(0, 2);
};

// RSS específico de cada fuente
const fetchSpecificRSS = async () => {
  const rssFeeds = [
    {
      name: 'Bloomberg',
      url: 'https://rss2json.com/api.json?rss_url=https://feeds.bloomberg.com/markets/news',
      category: 'mercados'
    },
    {
      name: 'Infobae Economía',
      url: 'https://rss2json.com/api.json?rss_url=https://www.infobae.com/feeds/rss/economia/',
      category: 'economía'
    },
    {
      name: 'TN Economía',
      url: 'https://rss2json.com/api.json?rss_url=https://tn.com.ar/feed/economia/',
      category: 'economía'
    },
    {
      name: 'Yahoo Finance', 
      url: 'https://rss2json.com/api.json?rss_url=https://finance.yahoo.com/news/rss',
      category: 'finanzas'
    },
    {
      name: 'Reuters',
      url: 'https://rss2json.com/api.json?rss_url=https://www.reutersagency.com/feed/?best-topics=business-finance',
      category: 'negocios'
    }
  ];

  const newsPromises = rssFeeds.map(feed => fetchRSSFeed(feed));
  const results = await Promise.allSettled(newsPromises);
  
  return results
    .filter(result => result.status === 'fulfilled' && result.value)
    .map(result => result.value)
    .flat();
};

const fetchRSSFeed = async (feed) => {
  try {
    const response = await fetch(feed.url);
    
    if (response.ok) {
      const data = await response.json();
      return data.items?.map(item => ({
        title: generateSummary(item.title),
        source: feed.name,
        url: item.link,
        timestamp: new Date(item.pubDate || Date.now()),
        category: feed.category,
        type: 'rss'
      })) || [];
    }
  } catch (Error ) {
    console.log(`❌ RSS falló para ${feed.name}`);
  }
  return [];
};



const generateSummary = (text) => {
  if (!text) return 'Última actualización de mercados';
  if (text.length <= 120) return text;
  
  const truncated = text.substring(0, 120);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 80 
    ? truncated.substring(0, lastSpace) + '...'
    : truncated + '...';
};
