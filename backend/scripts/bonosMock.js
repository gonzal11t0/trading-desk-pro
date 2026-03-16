// backend/scripts/bonosMock.js
function getBonosMock() {
  return {
    success: true,
    data: [
      { ticker: "AL30", ultimo: 86450, variacion_dia: -0.17, maximo: 86670, minimo: 85930, ultimo_cierre: 86600, monto_operado: 54288163371.4 },
      { ticker: "AL35", ultimo: 106200, variacion_dia: 0.01, maximo: 107090, minimo: 105690, ultimo_cierre: 106190, monto_operado: 3080950965.3 },
      { ticker: "GD30", ultimo: 89240, variacion_dia: -0.48, maximo: 89980, minimo: 89110, ultimo_cierre: 89670, monto_operado: 6262791867.5 },
      { ticker: "GD35", ultimo: 110800, variacion_dia: -0.81, maximo: 112060, minimo: 110530, ultimo_cierre: 111700, monto_operado: 18232746628.4 },
      { ticker: "AE38", ultimo: 109560, variacion_dia: -0.51, maximo: 110840, minimo: 109160, ultimo_cierre: 110130, monto_operado: 2946544430.8 },
      { ticker: "AL41", ultimo: 98600, variacion_dia: -0.40, maximo: 100470, minimo: 98320, ultimo_cierre: 99000, monto_operado: 699721744 },
      { ticker: "AN29", ultimo: 134090, variacion_dia: -0.23, maximo: 136710, minimo: 133010, ultimo_cierre: 134400, monto_operado: 1549047093.6 },
      { ticker: "AO27", ultimo: 144000, variacion_dia: -0.82, maximo: 145600, minimo: 142700, ultimo_cierre: 145200, monto_operado: 2258618929.1 }
    ],
    fuente: 'MOCK (modo demostración)'
  };
}

module.exports = getBonosMock;