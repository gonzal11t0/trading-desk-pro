// backend/scripts/get_letras_iol.js
const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

async function scrapeLetrasIOL() {
  let browser;
  try {
    console.log('🚀 Lanzando navegador para letras IOL...');
    
    // Detectar si estamos en producción (Vercel) o desarrollo
    const isProduction = process.env.VERCEL === '1';
    
    const launchOptions = {
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      headless: chromium.headless,
    };
    
    // En desarrollo, usar Chrome instalado
    if (!isProduction && process.platform === 'win32') {
      launchOptions.executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    } else {
      launchOptions.executablePath = await chromium.executablePath();
    }
    
    browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    
    console.log('🌐 Navegando a IOL (letras)...');
    
    // Timeout más largo para IOL
    await page.goto('https://iol.invertironline.com/mercado/cotizaciones/argentina/letras/todas', {
      waitUntil: 'networkidle2',
      timeout: 45000
    });

    console.log('⏳ Esperando tabla de letras...');
    await page.waitForSelector('table tbody tr', { timeout: 15000 });

    const letras = await page.evaluate(() => {
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
          ultimo_cierre: limpiarNumero(celdas[3]?.innerText),
          maximo: limpiarNumero(celdas[4]?.innerText),
          minimo: limpiarNumero(celdas[5]?.innerText),
          monto_operado: limpiarNumero(celdas[6]?.innerText),
        });
      });
      return resultados;
    });

    console.log(`✅ Se extrajeron ${letras.length} letras de IOL.`);
    return { success: true, data: letras, fuente: 'IOL (Letras)' };

  } catch (error) {
    console.error('❌ Error en scrapeLetrasIOL:', error.message);
    return { success: false, error: error.message, fuente: 'IOL' };
  } finally {
    if (browser) await browser.close();
    console.log('🕵️ Navegador cerrado.');
  }
}

module.exports = scrapeLetrasIOL;