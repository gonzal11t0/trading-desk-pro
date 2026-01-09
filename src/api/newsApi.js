// src/api/newsApi.js - VERSIÓN CORREGIDA SIN hasOwnProperty

const CACHE_DURATION = 45 * 60 * 1000; // 45 minutos
const CACHE_KEY = 'news_cache_hybrid';
const NOTICIAS_A_MOSTRAR = 10;
const CACHE_DURACION_RESULTADO = 10000; // 10 segundos
const INTERVALO_MINIMO_MS = 100; // 1.5 segundos entre llamadas

const ALPHA_VANTAGE_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;

// Variables de estado
let ultimaLlamadaAlphaVantage = 0;
let llamadaEnCurso = null;
let ultimoResultado = null;

/**
 * Verifica si se puede realizar una llamada a Alpha Vantage
 */
const puedeLlamarAlphaVantage = () => {
  const ahora = Date.now();
  const tiempoDesdeUltimaLlamada = ahora - ultimaLlamadaAlphaVantage;
  
  if (tiempoDesdeUltimaLlamada < INTERVALO_MINIMO_MS) {
    return false;
  }
  
  ultimaLlamadaAlphaVantage = ahora;
  return true;
};

/**
 * Función principal para obtener noticias financieras
 */
export const fetchLatestNews = async () => {
  // 1. Si hay una llamada en curso, devuelve esa promesa
  if (llamadaEnCurso) {
    return llamadaEnCurso;
  }
  
  // 2. Si tenemos un resultado reciente (menos de 10 segundos), úsalo
  if (ultimoResultado && (Date.now() - ultimoResultado.timestamp) < CACHE_DURACION_RESULTADO) {
    return ultimoResultado.data;
  }
  
  // 3. Marcar que hay una llamada en curso
  llamadaEnCurso = (async () => {
    try {
      const cached = getValidCache();
      if (cached.length >= 5) {
        ultimoResultado = {
          data: cached.slice(0, NOTICIAS_A_MOSTRAR),
          timestamp: Date.now()
        };
        return cached.slice(0, NOTICIAS_A_MOSTRAR);
      }
      
      // ESTRATEGIA EN CASCADA
      let noticias = [];
      
      // INTENTO 1: Alpha Vantage
      try {
        noticias = await intentarAlphaVantage();
      } catch {
        // Continuar con otras fuentes
      }
      
      // INTENTO 2: RSS de emergencia
      if (noticias.length < 5) {
        const noticiasRSS = await obtenerRSSDeRespaldo();
        noticias = [...noticias, ...noticiasRSS];
      }
      
      // INTENTO 3: Noticias estáticas
      if (noticias.length < 3) {
        noticias = [...noticias, ...obtenerNoticiasEstaticas()];
      }
      
      const noticiasFormateadas = formatearNoticias(noticias);
      
      // Decidir si guardar en caché (SOLO noticias reales)
      const tieneNoticiasReales = noticiasFormateadas.some(noticia => !esNoticiaEstatica(noticia));
      
      if (tieneNoticiasReales && noticiasFormateadas.length >= 3) {
        saveToCache(noticiasFormateadas);
      } else if (noticiasFormateadas.length > 0) {
        localStorage.removeItem(CACHE_KEY);
      }
      
      const resultadoFinal = noticiasFormateadas.slice(0, NOTICIAS_A_MOSTRAR);
      
      ultimoResultado = {
        data: resultadoFinal,
        timestamp: Date.now()
      };
      
      return resultadoFinal;
      
    } finally {
      llamadaEnCurso = null;
    }
  })();
  
  return llamadaEnCurso;
};

/**
 * Intentar obtener noticias de Alpha Vantage
 */
const intentarAlphaVantage = async () => {
  if (!puedeLlamarAlphaVantage()) {
    return [];
  }
  
  const apiUrl = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=financial_markets,economy_macro&apikey=${ALPHA_VANTAGE_KEY}&limit=50`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    // Verificar errores en la respuesta
    if (data['Error Message'] || data['Information']) {
      const mensajeError = data['Error Message'] || data['Information'];
      
      // Si es rate limit, devolver array vacío
      if (mensajeError.includes('rate limit') || mensajeError.includes('sparingly')) {
        return [];
      }
      throw new Error('Error en la respuesta de la API');
    }

    // Verificar estructura de respuesta - CORREGIDO
    if (!data.feed) {
      throw new Error('Estructura de respuesta inesperada');
    }

    return data.feed;

  } catch (error) {
    clearTimeout(timeout);
    
    if (error.name === 'AbortError' || 
        error.message.includes('HTTP') || 
        error.message.includes('Estructura')) {
      throw error;
    }
    
    return [];
  }
};

/**
 * Verificar si una noticia es estática
 */
const esNoticiaEstatica = (noticia) => {
  const fuentesEstaticas = [
    'Análisis Local',
    'Informe Oficial', 
    'Reporte Corporativo',
    'Mercados Globales',
    'Perspectivas'
  ];
  return fuentesEstaticas.includes(noticia.source);
};

/**
 * Obtener noticias de fuentes RSS de respaldo
 */
const obtenerRSSDeRespaldo = async () => {
  const fuentesRSS = [
    {
      name: 'Reuters Business',
      url: 'http://feeds.reuters.com/reuters/businessNews',
      category: 'negocios'
    },
    {
      name: 'BBC Business',
      url: 'http://feeds.bbci.co.uk/news/business/rss.xml',
      category: 'negocios'
    },
    {
      name: 'Financial Times',
      url: 'https://www.ft.com/rss/home',
      category: 'finanzas'
    }
  ];
  
  const promesas = fuentesRSS.map(fuente => obtenerUnRSS(fuente));
  const resultados = await Promise.allSettled(promesas);
  
  return resultados
    .filter(r => r.status === 'fulfilled' && r.value.length > 0)
    .map(r => r.value)
    .flat();
};

/**
 * Obtener noticias de una fuente RSS específica
 */
const obtenerUnRSS = async (fuente) => {
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(fuente.url)}&callback=?`;
    
    const response = await fetch(proxyUrl, { timeout: 8000 });
    if (!response.ok) return [];
    
    const data = await response.json();
    const parser = new DOMParser();
    const xml = parser.parseFromString(data.contents, 'text/xml');
    const items = xml.querySelectorAll('item');
    
    return Array.from(items).slice(0, 3).map(item => ({
      title: item.querySelector('title')?.textContent || `Noticia de ${fuente.name}`,
      source: fuente.name,
      url: item.querySelector('link')?.textContent || fuente.url,
      time_published: new Date(item.querySelector('pubDate')?.textContent || Date.now()).toISOString(),
      summary: item.querySelector('description')?.textContent || '',
      banner_image: null,
      esRSS: true
    }));
    
  } catch {
    return [];
  }
};

/**
 * Generar noticias estáticas de respaldo
 */
const obtenerNoticiasEstaticas = () => {
  const ahora = new Date();
  return [
    {
      title: 'Mercados argentinos: MERVAL muestra volatilidad en sesión clave',
      source: 'Análisis Local',
      url: '#',
      time_published: ahora.toISOString(),
      summary: 'El índice porteño registra movimientos ante expectativas económicas.',
      banner_image: null
    },
    {
      title: 'BCRA analiza medidas para la estabilidad cambiaria',
      source: 'Informe Oficial',
      url: '#',
      time_published: new Date(ahora - 3600000).toISOString(),
      summary: 'El Banco Central evalúa herramientas para el mercado de divisas.',
      banner_image: null
    },
    {
      title: 'Empresas líderes: YPF y Galicia presentan perspectivas 2026',
      source: 'Reporte Corporativo',
      url: '#',
      time_published: new Date(ahora - 7200000).toISOString(),
      summary: 'Compañías argentinas actualizan sus proyecciones para el próximo año.',
      banner_image: null
    },
    {
      title: 'Wall Street: Tecnológicas lideran avance del S&P 500',
      source: 'Mercados Globales',
      url: '#',
      time_published: new Date(ahora - 10800000).toISOString(),
      summary: 'Apple, Microsoft y Nvidia impulsan ganancias en los principales índices.',
      banner_image: null
    },
    {
      title: 'Análisis: Materias primas y su impacto en economías emergentes',
      source: 'Perspectivas',
      url: '#',
      time_published: new Date(ahora - 14400000).toISOString(),
      summary: 'Expertos evalúan el comportamiento del petróleo y commodities.',
      banner_image: null
    }
  ];
};

/**
 * Formatear noticias para compatibilidad con componentes
 */
const formatearNoticias = (noticias) => {
  return noticias.map(noticia => ({
    ...noticia,
    timestamp: new Date(noticia.time_published)
  }));
};

/**
 * Obtener caché válido del localStorage
 */
const getValidCache = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return [];
    
    const parsedData = JSON.parse(cached);
    const { data, timestamp } = parsedData;
    const isFresh = Date.now() - timestamp < CACHE_DURATION;
    
    return isFresh ? data : [];
  } catch {
    return [];
  }
};

/**
 * Guardar noticias en caché
 */
const saveToCache = (noticias) => {
  try {
    const cacheData = {
      data: noticias.slice(0, 12),
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch {
    // Fallo silencioso si no se puede guardar
  }
};

/**
 * Verificar si un objeto tiene una propiedad - FUNCIÓN HELPER
 */
const hasProperty = (obj, prop) => {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};

/**
 * Versión alternativa usando el operador in
 */
const hasPropertyAlt = (obj, prop) => {
  return prop in obj;
};

// Exportar funciones adicionales
export const clearNewsCache = () => {
  try {
    localStorage.removeItem(CACHE_KEY);
    ultimoResultado = null;
  } catch {
    // Fallo silencioso
  }
};

// Si necesitas verificar propiedades en otros lugares, usa estas funciones:
export const newsUtils = {
  hasProperty,
  hasPropertyAlt
};

export default {
  fetchLatestNews,
  clearNewsCache,
  newsUtils
};