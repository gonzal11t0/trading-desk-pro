// backend/scripts/letrasMock.js
function getLetrasMock() {
  return {
    success: true,
    data: [
      { ticker: "S29Y6", ultimo: 126.96, variacion_dia: 0.40, ultimo_cierre: 126.50, maximo: 127.30, minimo: 126.20, monto_operado: 17824289538.99 },
      { ticker: "S30N6", ultimo: 109.15, variacion_dia: 0.32, ultimo_cierre: 108.80, maximo: 109.50, minimo: 108.60, monto_operado: 1204219381.01 },
      { ticker: "M31G6", ultimo: 117.60, variacion_dia: 0.40, ultimo_cierre: 117.13, maximo: 118.00, minimo: 117.00, monto_operado: 7117020626.56 },
      { ticker: "X30N6", ultimo: 110.24, variacion_dia: 1.04, ultimo_cierre: 109.10, maximo: 110.80, minimo: 108.90, monto_operado: 1444251793.43 },
      { ticker: "S27F6", ultimo: 1202.40, variacion_dia: -0.50, ultimo_cierre: 1208.50, maximo: 1210.00, minimo: 1200.00, monto_operado: 230536761446.53 },
      { ticker: "X29Y6", ultimo: 102.84, variacion_dia: 0.43, ultimo_cierre: 102.40, maximo: 103.15, minimo: 102.20, monto_operado: 117762222200.74 }
    ],
    fuente: 'MOCK (fallback)'
  };
}

module.exports = getLetrasMock;