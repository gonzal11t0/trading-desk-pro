// backend/scripts/get_bonos_rava.js
const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeBonosRava() {
  try {
    console.log('🌐 Solicitando página de bonos a Rava...');
    
    const { data } = await axios.get('https://www.rava.com/cotizaciones/bonos', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    console.log('✅ Página descargada, analizando HTML...');
    
    const $ = cheerio.load(data);
    
    // 1. Buscar TODAS las tablas en la página
    const tablas = $('table');
    console.log(`📊 Se encontraron ${tablas.length} tablas en total.`);
    
    // 2. Intentar con diferentes selectores
    const selectores = [
      'table.table tbody tr',
      'table.table tr',
      'table tbody tr',
      'table tr',
      '.table tbody tr',
      '.table tr'
    ];
    
    let bonos = [];
    let selectorUsado = '';
    
    for (const selector of selectores) {
      const filas = $(selector);
      console.log(`🔍 Selector "${selector}": ${filas.length} filas encontradas`);
      
      if (filas.length > 5) { // Si encuentra más de 5 filas, probablemente es la correcta
        bonos = [];
        selectorUsado = selector;
        
        filas.each((i, row) => {
          const columns = $(row).find('td');
          if (columns.length < 3) return; // Ignorar filas sin suficientes columnas
          
          const ticker = $(columns[0]).text().trim();
          if (!ticker || ticker === 'Especie' || ticker.includes('▼')) return;
          
          const limpiarNumero = (texto) => {
            const limpio = $(texto).text().trim().replace(/\./g, '').replace(',', '.');
            const numero = parseFloat(limpio);
            return isNaN(numero) ? null : numero;
          };
          
          bonos.push({
            ticker,
            ultimo: limpiarNumero(columns[1]),
            variacion_dia: limpiarNumero(columns[2]),
            anterior: limpiarNumero(columns[5]),
            apertura: limpiarNumero(columns[6]),
            minimo: limpiarNumero(columns[7]),
            maximo: limpiarNumero(columns[8]),
            hora: $(columns[9]).text().trim(),
            volumen: columns[10] ? limpiarNumero(columns[10]) : null
          });
        });
        
        if (bonos.length > 0) break;
      }
    }
    
    console.log(`✅ Se encontraron ${bonos.length} bonos usando selector "${selectorUsado}".`);
    
    if (bonos.length === 0) {
      // Guardar una muestra del HTML para debug
      const htmlSample = data.substring(0, 500);
      console.log('📝 Muestra del HTML (primeros 500 caracteres):', htmlSample);
    }
    
    return { 
      success: true, 
      data: bonos, 
      fuente: 'Rava',
      selector_usado: selectorUsado,
      total_tablas: tablas.length
    };
    
  } catch (error) {
    console.error('❌ Error en scrapeBonosRava:', error.message);
    return { 
      success: false, 
      error: error.message,
      fuente: 'Rava'
    };
  }
}

module.exports = scrapeBonosRava;