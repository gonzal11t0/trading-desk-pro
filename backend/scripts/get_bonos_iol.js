// backend/scripts/get_bonos_iol.js
const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

async function scrapeBonosIOL() {
  let browser;
  try {
    console.log('🚀 Lanzando navegador optimizado para Vercel (Bonos IOL)...');
    
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    console.log('🌐 Navegando a IOL (bonos)...');

    await page.goto('https://iol.invertironline.com/mercado/cotizaciones/argentina/bonos', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    console.log('⏳ Esperando que la tabla se cargue...');
    await page.waitForSelector('table tbody tr', { timeout: 10000 });

    console.log('✅ Tabla encontrada, extrayendo datos...');

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
    return { success: true, data: bonos, fuente: 'IOL (Bonos) - Puppeteer' };

  } catch (error) {
    console.error('❌ Error en scrapeBonosIOL:', error.message);
    return { success: false, error: error.message, fuente: 'IOL' };
  } finally {
    if (browser) await browser.close();
    console.log('🕵️ Navegador cerrado.');
  }
}

module.exports = scrapeBonosIOL;