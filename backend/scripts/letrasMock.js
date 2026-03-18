// backend/scripts/letrasMock.js
function getLetrasMock() {
  return {
    success: true,
    data: [
      { ticker: "S29Y6", ultimo: 125.10, variacion_dia: 0.40, maximo: 125.30, minimo: 124.47, ultimo_cierre: 124.60, monto_operado: 17824289538.99 },
      { ticker: "S30N6", ultimo: 106.24, variacion_dia: 0.32, maximo: 106.79, minimo: 105.03, ultimo_cierre: 105.90, monto_operado: 1204219381.01 },
      { ticker: "M31G6", ultimo: 115.97, variacion_dia: 0.40, maximo: 116.49, minimo: 114.80, ultimo_cierre: 115.50, monto_operado: 7117020626.56 },
      { ticker: "X30N6", ultimo: 106.50, variacion_dia: 1.04, maximo: 106.80, minimo: 104.50, ultimo_cierre: 105.40, monto_operado: 1444251793.43 },
      { ticker: "TZX27", ultimo: 138620, variacion_dia: -0.62, maximo: 140980, minimo: 138010, ultimo_cierre: 139490, monto_operado: 66085838 },
      { ticker: "S27F6", ultimo: 104.36, variacion_dia: 0.07, maximo: 104.50, minimo: 104.20, ultimo_cierre: 104.29, monto_operado: 230536761446.53 },
      { ticker: "X29Y6", ultimo: 102.84, variacion_dia: 0.43, maximo: 103.15, minimo: 102.40, ultimo_cierre: 102.40, monto_operado: 117762222200.74 },
      { ticker: "D27F6", ultimo: 128.00, variacion_dia: 0.80, maximo: 128.50, minimo: 127.50, ultimo_cierre: 127.00, monto_operado: 5000000 }
    ],
    fuente: 'MOCK (modo demostración)'
  };
}

module.exports = getLetrasMock;