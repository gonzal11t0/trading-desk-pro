// src/api/inflationApi.js

// Web scraping del BCRA para datos oficiales
export const error = (message, details = null) => {
  const err = new Error(message);
  err.details = details;
  throw err;
};

export const fetchInflationData = async () => {
  try {
    const bcraData = await fetchBCRAInflationData();
    if (bcraData?.length > 0) return bcraData;

    const bcraApiData = await fetchBCRAApi();
    if (bcraApiData?.length > 0) return bcraApiData;

    error('BCRA data sources failed');
  } catch (err) {
    console.warn('BCRA scraping failed, using reliable estimates', err);
    return getReliableInflationData();
  }
};



// Web scraping de la página del BCRA
const fetchBCRAInflationData = async () => {
  try {
    // Usar CORS proxy para evitar bloqueos
    const proxyUrl = 'https://api.allorigins.win/get?url=';
    const targetUrl = encodeURIComponent('https://www.bcra.gob.ar/PublicacionesEstadisticas/Principales_variables_datos.asp');
    
    const response = await fetch(proxyUrl + targetUrl);
    
    if (response.ok) {
      const result = await response.json();
      const html = result.contents;
      return parseBCRAHTML(html);
    }
    return null;
  } catch (error) {
    console.warn('BCRA scraping failed:', error);
    return null;
  }
};

// Parsear el HTML del BCRA para extraer datos de inflación
const parseBCRAHTML = (html) => {
  try {
    // Crear un parser de HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Buscar la tabla de inflación (ajustar selectores según la estructura real)
    const tables = doc.querySelectorAll('table');
    let inflationData = [];
    
    // Iterar sobre tablas para encontrar la de inflación
    for (let table of tables) {
      const rows = table.querySelectorAll('tr');
      
      for (let row of rows) {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 2) {
          const dateText = cells[0].textContent.trim();
          const valueText = cells[1].textContent.trim();
          
          // Verificar si es una fila de datos de inflación
          if (isValidInflationData(dateText, valueText)) {
            const inflationItem = parseInflationRow(dateText, valueText);
            if (inflationItem) {
              inflationData.push(inflationItem);
            }
          }
        }
      }
    }
    
    // Ordenar por fecha y tomar últimos 4 meses
    inflationData.sort((a, b) => new Date(b.date) - new Date(a.date));
    return inflationData.slice(0, 4);
    
  } catch (error) {
    console.warn('HTML parsing failed:', error);
    return null;
  }
};

// Verificar si una fila contiene datos válidos de inflación
const isValidInflationData = (dateText, valueText) => {
  // Patrones de fecha del BCRA
  const datePatterns = [
    /^\d{2}\/\d{4}$/, // MM/YYYY
    /^\d{2}-\d{4}$/,  // MM-YYYY
    /^\d{4}-\d{2}$/,  // YYYY-MM
    /^\d{1,2}\/\d{1,2}\/\d{4}$/ // DD/MM/YYYY
  ];
  
  // Patrones de porcentaje
  const valuePattern = /^-?\d+[,.]?\d*%?$/;
  
  return datePatterns.some(pattern => pattern.test(dateText)) && 
         valuePattern.test(valueText.replace(',', '.'));
};

// Parsear una fila de datos de inflación
const parseInflationRow = (dateText, valueText) => {
  try {
    // Convertir fecha
    let date;
    if (dateText.includes('/')) {
      const [month, year] = dateText.split('/');
      date = new Date(parseInt(year), parseInt(month) - 1, 1);
    } else if (dateText.includes('-')) {
      const [part1, part2] = dateText.split('-');
      if (part1.length === 4) {
        // Formato YYYY-MM
        date = new Date(parseInt(part1), parseInt(part2) - 1, 1);
      } else {
        // Formato MM-YYYY
        date = new Date(parseInt(part2), parseInt(part1) - 1, 1);
      }
    }
    
    if (!date || isNaN(date.getTime())) return null;
    
    // Convertir valor
    const value = parseFloat(valueText.replace(',', '.').replace('%', ''));
    if (isNaN(value)) return null;
    
    // Formatear mes
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    const monthName = monthNames[date.getMonth()];
    const year = date.getFullYear();
    
    return {
      month: `${monthName} ${year}`,
      inflation: Math.round(value * 10) / 10, // 1 decimal
      trend: 'equal', // Se calculará después
      date: date,
      source: 'bcra'
    };
    
  } catch (error) {
    console.warn('Error parsing row:', error);
    return null;
  }
};

// SOLUCIÓN CON PROXY - Reemplaza tu función actual con esta:
const fetchBCRAApi = async () => {
  try {
    // Usar proxy de CORS para evitar el bloqueo
    const proxyUrl = 'https://corsproxy.io/?';
    const targetUrl = 'https://api.estadisticasbcra.com/inflacion_mensual_oficial';
    
    const response = await fetch(proxyUrl + encodeURIComponent(targetUrl), {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'TradingDeskPro/1.0.0'
      },
      timeout: 10000
    });
    
    if (response.ok) {
      const data = await response.json();
      return processBCRAApiData(data);
    }
    return null;
  } catch (error) {
    console.warn('BCRA API failed:', error);
    return null;
  }
};

// Procesar datos de la API del BCRA
const processBCRAApiData = (data) => {
  if (!data || data.length === 0) return null;
  
  const inflationData = [];
  const recentData = data.slice(-4).reverse(); // Últimos 4 meses
  
  recentData.forEach((item, index) => {
    const date = new Date(item.d);
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    const monthName = monthNames[date.getMonth()];
    const year = date.getFullYear();
    
    // Calcular tendencia
    let trend = 'equal';
    if (index > 0) {
      const previousValue = recentData[index - 1].v;
      trend = item.v > previousValue ? 'up' : item.v < previousValue ? 'down' : 'equal';
    }
    
    inflationData.push({
      month: `${monthName} ${year}`,
      inflation: Math.round(item.v * 10) / 10,
      trend: trend,
      date: date,
      source: 'bcra_api'
    });
  });
  
  return inflationData;
};

// Datos de respaldo confiables
const getReliableInflationData = () => {
    return [
    { month: 'Septiembre 2025', inflation: 2.3, trend: 'up', source: 'bcra_estimated' },
    { month: 'Octubre 2025', inflation: 2.2, trend: 'up', source: 'bcra_estimated' },
    { month: 'Agosto 2025', inflation: 1.9, trend: 'Equal', source: 'bcra_estimated' },
    { month: 'Julio 2025', inflation: 1.9, trend: 'Equal', source: 'bcra_estimated' },
    { month: 'Junio 2025', inflation: 1.6, trend: 'Equal', source: 'bcra_estimated' },
    { month: 'Mayo 2025', inflation: 1.5, trend: 'Equal', source: 'bcra_estimated' },
    { month: 'Abril 2025', inflation: 2.8, trend: 'Equal', source: 'bcra_estimated' },
    { month: 'Marzo 2025', inflation: 3.7, trend: 'Equal', source: 'bcra_estimated' },
    { month: 'Febrero 2025', inflation: 2.4, trend: 'Equal', source: 'bcra_estimated' }
    ];
};