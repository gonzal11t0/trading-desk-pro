// src/api/newsApi.js - SISTEMA HÍBRIDO DE EMERGENCIA

const CACHE_DURATION = 45 * 60 * 1000; // 45 minutos
const CACHE_KEY = 'news_cache_hybrid';
const NOTICIAS_A_MOSTRAR = 10;

// Configuración (AJUSTA ESTAS KEYS)
const ALPHA_VANTAGE_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;;



let ultimaLlamadaAlphaVantage = 0;
const INTERVALO_MINIMO_MS = 100; // 1.5 segundos entre llamadas

const puedeLlamarAlphaVantage = () => {
  const ahora = Date.now();
  const tiempoDesdeUltimaLlamada = ahora - ultimaLlamadaAlphaVantage;
  
  if (tiempoDesdeUltimaLlamada < INTERVALO_MINIMO_MS) {
    return false;
  }
  
  ultimaLlamadaAlphaVantage = ahora;
  return true;
};

// Función principal
// ========== AGREGAR AL INICIO DE newsApi.js ==========
let llamadaEnCurso = null;
let ultimoResultado = null;
const CACHE_DURACION_RESULTADO = 10000; // 10 segundos

// ========== MODIFICAR fetchLatestNews ==========
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
        
        // Guardar como último resultado
        ultimoResultado = {
          data: cached.slice(0, NOTICIAS_A_MOSTRAR),
          timestamp: Date.now()
        };
        
        return cached.slice(0, NOTICIAS_A_MOSTRAR);
      }
      
      // 2. ESTRATEGIA EN CASCADA
      let noticias = [];
      
      // INTENTO 1: Alpha Vantage (rápido)
      try {
        noticias = await intentarAlphaVantage();
      } catch (error) {

      }
      
      // INTENTO 2: RSS de emergencia (si Alpha Vantage devuelve < 5)
      if (noticias.length < 5) {
        const noticiasRSS = await obtenerRSSDeRespaldo();
        noticias = [...noticias, ...noticiasRSS];
      }
      
      // INTENTO 3: Noticias estáticas (último recurso)
      if (noticias.length < 3) {
        noticias = [...noticias, ...obtenerNoticiasEstaticas()];
      }
      
      // 3. Procesar y formatear
      const noticiasFormateadas = formatearNoticias(noticias);
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
  // ========== MODIFICAR: Guardar en caché (SOLO si hay noticias REALES) ==========
// 4. Decidir si guardar en caché (SOLO noticias reales)
const tieneNoticiasReales = noticiasFormateadas.some(noticia => !esNoticiaEstatica(noticia));

if (tieneNoticiasReales && noticiasFormateadas.length >= 3) {
  saveToCache(noticiasFormateadas);
} else if (noticiasFormateadas.length > 0) {
  // Limpiar caché existente si solo tiene estáticas
  localStorage.removeItem(CACHE_KEY);
}

      const resultadoFinal = noticiasFormateadas.slice(0, NOTICIAS_A_MOSTRAR);
      
      // Guardar como último resultado
      ultimoResultado = {
        data: resultadoFinal,
        timestamp: Date.now()
      };
      
      return resultadoFinal;
      
    } finally {
      // Siempre liberar la llamada en curso
      llamadaEnCurso = null;
    }
  })();
  
  return llamadaEnCurso;
};

// ========== INTENTO 1: ALPHA VANTAGE ==========
const intentarAlphaVantage = async () => {
    if (!puedeLlamarAlphaVantage()) {
    return []; // Devuelve array vacío en lugar de fallar
  }
// Cambia en intentarAlphaVantage():
const apiUrl = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=financial_markets,economy_macro&apikey=${ALPHA_VANTAGE_KEY}&limit=50`;  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    // --- ¡ESTA ES LA PARTE MÁS IMPORTANTE! ---
    // 1. Verifica si la API devolvió un error en el JSON
    if (data['Error Message'] || data['Information']) {
  const mensajeError = data['Error Message'] || data['Information'];
  
  // Si es un error de rate limit, NO lanzo error, devuelvo array vacío
  // El sistema híbrido usará el caché o fuentes secundarias
  if (mensajeError.includes('rate limit') || mensajeError.includes('sparingly')) {
    return [];
  }
  // Solo lanzo error para otros problemas graves
  throw new Error('Error en la respuesta de la API: ' + mensajeError);
}

    // 2. Verifica si existe la propiedad 'feed'
    if (!data.hasOwnProperty('feed')) {
      throw new Error('Estructura de respuesta inesperada');
    }

    // 3. Si 'feed' existe pero es un array vacío, NO es un error.
    //    Simplemente devolvemos el array vacío.
    return data.feed; // <-- Esto devuelve las 50 noticias (o un array vacío)

  } catch (error) {
    clearTimeout(timeout);
    // Relanza solo errores de red o de estructura grave
    if (error.name === 'AbortError' || error.message.includes('HTTP') || error.message.includes('Estructura')) {
      throw error;
    }
    // Si fue solo un feed vacío, devolvemos array vacío sin romper el flujo
    return [];
  }
};

// ========== INTENTO 2: RSS DE RESPALDO ==========
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

const obtenerUnRSS = async (fuente) => {
  try {
    // Usar proxy CORS público
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
      // Flag para identificar que es RSS
      esRSS: true
    }));
    
  } catch (error) {
    return [];
  }
};

// ========== INTENTO 3: NOTICIAS ESTÁTICAS ==========
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

// ========== FUNCIONES AUXILIARES ==========
const formatearNoticias = (noticias) => {
  return noticias.map(noticia => ({
    // Mantener compatibilidad con tu componente Notice.jsx
    ...noticia,
    // Asegurar timestamp para formatTimeAgo
    timestamp: new Date(noticia.time_published)
  }));
};

const getValidCache = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return [];
    
    const { data, timestamp } = JSON.parse(cached);
    const isFresh = Date.now() - timestamp < CACHE_DURATION;
    
    return isFresh ? data : [];
  } catch {
    return [];
  }
};

const saveToCache = (noticias) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data: noticias.slice(0, 12),
      timestamp: Date.now()
    }));
  } catch (error) {
  }
};