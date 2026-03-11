// backend/scripts/get_letras_iol.js
const puppeteer = require('puppeteer');

async function scrapeLetrasIOL() {
  let browser;
  try {
    console.log('🚀 Lanzando navegador para letras...');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    console.log('🌐 Navegando a IOL (Letras)...');

    await page.goto('https://iol.invertironline.com/mercado/cotizaciones/argentina/letras/todas', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    console.log('⏳ Esperando que la tabla se cargue...');

    // Esperar a que aparezca al menos una fila de datos (ej. un ticker conocido)
    await page.waitForSelector('table tbody tr', { timeout: 10000 });

    console.log('✅ Tabla encontrada, extrayendo datos...');

    const letras = await page.evaluate(() => {
      // Buscar TODAS las tablas
      const tablas = document.querySelectorAll('table');
      let tablaLetras = null;
      let maxFilas = 0;

      // Encontrar la tabla más grande (la de datos)
      tablas.forEach(tabla => {
        const filas = tabla.querySelectorAll('tr').length;
        if (filas > maxFilas) {
          maxFilas = filas;
          tablaLetras = tabla;
        }
      });

      if (!tablaLetras) return [];

      const filas = tablaLetras.querySelectorAll('tbody tr');
      const resultados = [];

      filas.forEach((row) => {
        const celdas = row.querySelectorAll('td');
        if (celdas.length < 5) return; // Mínimo de columnas para tener datos útiles

        const ticker = celdas[0]?.innerText?.trim();
        if (!ticker || ticker === 'Símbolo' || ticker.includes('Símbolo')) return;

        // Función para limpiar números (formato argentino: puntos como separador de miles, coma decimal)
        const limpiarNumero = (texto) => {
          if (!texto || texto === '--' || texto === '---') return null;
          // Ej: "104,36" -> 104.36, "1.234,56" -> 1234.56
          const limpio = texto.replace(/\./g, '').replace(',', '.');
          const numero = parseFloat(limpio);
          return isNaN(numero) ? null : numero;
        };

        resultados.push({
          ticker: ticker,
          ultimo: limpiarNumero(celdas[1]?.innerText),
          ultima_tasa: limpiarNumero(celdas[2]?.innerText),
          variacion_dia: limpiarNumero(celdas[3]?.innerText),
          cantidad_compra: limpiarNumero(celdas[4]?.innerText),
          precio_compra_tasa: limpiarNumero(celdas[5]?.innerText),
          precio_venta_tasa: limpiarNumero(celdas[6]?.innerText),
          cantidad_venta: limpiarNumero(celdas[7]?.innerText),
          apertura: limpiarNumero(celdas[8]?.innerText),
          maximo: limpiarNumero(celdas[9]?.innerText),
          minimo: limpiarNumero(celdas[10]?.innerText),
          ultimo_cierre: limpiarNumero(celdas[11]?.innerText),
          monto_operado: limpiarNumero(celdas[12]?.innerText),
        });
      });

      return resultados;
    });

    console.log(`✅ Se extrajeron ${letras.length} letras.`);
    return { success: true, data: letras, fuente: 'IOL' };

  } catch (error) {
    console.error('❌ Error en scrapeLetrasIOL:', error.message);
    return { success: false, error: error.message, fuente: 'IOL' };
  } finally {
    if (browser) await browser.close();
    console.log('🕵️ Navegador cerrado.');
  }
}

module.exports = scrapeLetrasIOL;