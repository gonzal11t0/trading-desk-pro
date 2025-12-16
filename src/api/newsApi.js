// src/api/newsApi.js - SISTEMA HÍBRIDO DE EMERGENCIA
const CACHE_DURATION = 45 * 60 * 1000; // 45 minutos
const CACHE_KEY = 'news_cache_hybrid';
const NOTICIAS_A_MOSTRAR = 10;

// Configuración (AJUSTA ESTAS KEYS)
const ALPHA_VANTAGE_KEY = '9f749093f5d78a1546678f8f00c9bc8b';

let ultimaLlamadaAlphaVantage = 0;
const INTERVALO_MINIMO_MS = 1500; // 1.5 segundos entre llamadas

const puedeLlamarAlphaVantage = () => {
  const ahora = Date.now();
  const tiempoDesdeUltimaLlamada = ahora - ultimaLlamadaAlphaVantage;
  
  if (tiempoDesdeUltimaLlamada < INTERVALO_MINIMO_MS) {
    console.log(`⏳ Esperando para llamar a Alpha Vantage... (faltan ${INTERVALO_MINIMO_MS - tiempoDesdeUltimaLlamada}ms)`);
    return false;
  }
  
  ultimaLlamadaAlphaVantage = ahora;
  return true;
};

// Función principal
export const fetchLatestNews = async () => {
  console.log('🚀 Iniciando sistema híbrido de noticias...');
  
  // 1. Caché primero (si es válido)
  const cached = getValidCache();
  if (cached.length >= 5) {
    console.log(`📦 Cache válido: ${cached.length} noticias`);
    return cached.slice(0, NOTICIAS_A_MOSTRAR);
  }
  
  // 2. ESTRATEGIA EN CASCADA
  let noticias = [];
  
  // INTENTO 1: Alpha Vantage (rápido)
  try {
    console.log('🔄 Intento 1: Alpha Vantage...');
    noticias = await intentarAlphaVantage();
  } catch (error) {
  console.error(`❌ FALLA CRÍTICA Alpha Vantage:`, error);
  console.error(`   - Tipo de error: ${error.name}`);
  console.error(`   - Mensaje: ${error.message}`);  }
  
  // INTENTO 2: RSS de emergencia (si Alpha Vantage devuelve < 5)
  if (noticias.length < 5) {
    console.log(`📡 Intento 2: RSS de respaldo (solo ${noticias.length} noticias)...`);
    const noticiasRSS = await obtenerRSSDeRespaldo();
    noticias = [...noticias, ...noticiasRSS];
  }
  
  // INTENTO 3: Noticias estáticas (último recurso)
  if (noticias.length < 3) {
    console.log('🛡️ Intento 3: Noticias estáticas de emergencia...');
    noticias = [...noticias, ...obtenerNoticiasEstaticas()];
  }
  
  // 3. Procesar y formatear
  const noticiasFormateadas = formatearNoticias(noticias);
  
  // 4. Guardar en caché
  if (noticiasFormateadas.length >= 3) {
    saveToCache(noticiasFormateadas);
  }
  
  console.log(`✅ Listo: ${noticiasFormateadas.length} noticias para mostrar`);
  return noticiasFormateadas.slice(0, NOTICIAS_A_MOSTRAR);
};

// ========== INTENTO 1: ALPHA VANTAGE ==========
const intentarAlphaVantage = async () => {
    if (!puedeLlamarAlphaVantage()) {
    console.log('🔄 Saltando llamada a Alpha Vantage (rate limit local).');
    return []; // Devuelve array vacío en lugar de fallar
  }
const apiUrl = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=financial_markets&apikey=${ALPHA_VANTAGE_KEY}&limit=15`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    console.log('🌐 Llamando a Alpha Vantage...');
    const response = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      console.error(`❌ Error HTTP: ${response.status}`);
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('📦 Respuesta cruda de Alpha Vantage:', data); // LOG CLAVE

    // --- ¡ESTA ES LA PARTE MÁS IMPORTANTE! ---
    // 1. Verifica si la API devolvió un error en el JSON
    if (data['Error Message'] || data['Information']) {
  const mensajeError = data['Error Message'] || data['Information'];
  console.warn('⚠️ Alpha Vantage rate limit o error:', mensajeError);
  
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
      console.error('❌ La respuesta no tiene propiedad "feed":', data);
      throw new Error('Estructura de respuesta inesperada');
    }

    // 3. Si 'feed' existe pero es un array vacío, NO es un error.
    //    Simplemente devolvemos el array vacío.
    console.log(`✅ Alpha Vantage OK. feed es un array de longitud: ${data.feed.length}`);
    return data.feed; // <-- Esto devuelve las 50 noticias (o un array vacío)

  } catch (error) {
    clearTimeout(timeout);
    console.error('❌ Error en intentarAlphaVantage:', error.name, '-', error.message);
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
    console.warn(`⚠️ RSS ${fuente.name} falló:`, error.message);
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
    console.warn('No se pudo guardar cache:', error);
  }
};