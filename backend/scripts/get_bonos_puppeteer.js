// backend/scripts/get_bonos_puppeteer.js
const puppeteer = require('puppeteer');

async function scrapeBonosConPuppeteer() {
  let browser;
  try {
    console.log('🚀 Lanzando navegador...');
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    console.log('🌐 Navegando a Rava...');
    
    await page.goto('https://www.rava.com/cotizaciones/bonos', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    console.log('⏳ Esperando que la tabla se cargue...');
    
    // Selector más genérico
    await page.waitForSelector('table tr', { timeout: 10000 });
    
    console.log('✅ Tabla encontrada, extrayendo datos...');
    
    const bonos = await page.evaluate(() => {
      // Buscar TODAS las tablas
      const tablas = document.querySelectorAll('table');
      console.log(`📊 Encontradas ${tablas.length} tablas`);
      
      // Usar la tabla más grande (la de bonos)
      let tablaBonos = null;
      let maxFilas = 0;
      
      tablas.forEach(tabla => {
        const filas = tabla.querySelectorAll('tr').length;
        if (filas > maxFilas) {
          maxFilas = filas;
          tablaBonos = tabla;
        }
      });
      
      if (!tablaBonos) return [];
      
      const filas = tablaBonos.querySelectorAll('tr');
      const resultados = [];
      
      filas.forEach((row, index) => {
        // Saltar encabezados
        if (index === 0) return;
        
        const celdas = row.querySelectorAll('td, th');
        if (celdas.length < 2) return;
        
        const ticker = celdas[0]?.innerText?.trim();
        if (!ticker || ticker === 'Especie' || ticker.includes('▼')) return;
        
        const limpiarNumero = (texto) => {
          if (!texto) return null;
          const limpio = texto.replace(/\./g, '').replace(',', '.');
          const numero = parseFloat(limpio);
          return isNaN(numero) ? null : numero;
        };
        
        resultados.push({
          ticker,
          ultimo: limpiarNumero(celdas[1]?.innerText),
          variacion_dia: limpiarNumero(celdas[2]?.innerText),
          anterior: limpiarNumero(celdas[5]?.innerText),
          apertura: limpiarNumero(celdas[6]?.innerText),
          minimo: limpiarNumero(celdas[7]?.innerText),
          maximo: limpiarNumero(celdas[8]?.innerText),
          hora: celdas[9]?.innerText?.trim() || null,
          volumen_nominal: limpiarNumero(celdas[10]?.innerText),
        });
      });
      
      return resultados;
    });
    
    console.log(`✅ Se extrajeron ${bonos.length} bonos.`);
    return { success: true, data: bonos, fuente: 'Rava (Puppeteer)' };
    
  } catch (error) {
    console.error('❌ Error en scrapeBonosConPuppeteer:', error.message);
    return { success: false, error: error.message, fuente: 'Rava (Puppeteer)' };
  } finally {
    if (browser) await browser.close();
    console.log('🕵️ Navegador cerrado.');
  }
}

module.exports = scrapeBonosConPuppeteer;