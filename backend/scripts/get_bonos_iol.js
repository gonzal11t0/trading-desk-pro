// backend/scripts/get_bonos_iol.js
const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

async function scrapeBonosIOL() {
  let browser;
  try {
    console.log('🚀 Lanzando navegador...');
    
    // Usar Chrome instalado en el sistema
    const executablePath = process.platform === 'win32'
      ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
      : '/usr/bin/google-chrome';
    
    browser = await puppeteer.launch({
      executablePath,  // 👈 Usar Chrome instalado
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });

    const page = await browser.newPage();
    await page.goto('https://iol.invertironline.com/mercado/cotizaciones/argentina/bonos', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    await page.waitForSelector('table tbody tr', { timeout: 10000 });

    const bonos = await page.evaluate(() => {
      const filas = document.querySelectorAll('table tbody tr');
      const resultados = [];

      filas.forEach(row => {
        const celdas = row.querySelectorAll('td');
        if (celdas.length < 3) return;

        const ticker = celdas[0]?.innerText?.trim();
        if (!ticker || ticker === 'Símbolo') return;

        const limpiarNumero = (texto) => {
          if (!texto || texto === '--' || texto === '---') return null;
          const limpio = texto.replace(/\./g, '').replace(',', '.');
          const numero = parseFloat(limpio);
          return isNaN(numero) ? null : numero;
        };

        resultados.push({
          ticker: ticker,
          ultimo: limpiarNumero(celdas[1]?.innerText),
          variacion_dia: limpiarNumero(celdas[2]?.innerText),
          maximo: limpiarNumero(celdas[7]?.innerText),
          minimo: limpiarNumero(celdas[8]?.innerText),
          ultimo_cierre: limpiarNumero(celdas[9]?.innerText),
          monto_operado: limpiarNumero(celdas[10]?.innerText),
        });
      });
      return resultados;
    });

    console.log(`✅ Se extrajeron ${bonos.length} bonos.`);
    return { success: true, data: bonos, fuente: 'IOL (Bonos)' };

  } catch (error) {
    console.error('❌ Error en scrapeBonosIOL:', error.message);
    // Fallback a datos mock
    const getBonosMock = require('./bonosMock');
    return getBonosMock();
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = scrapeBonosIOL;