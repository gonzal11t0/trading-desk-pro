// src/api/letrasApi.js
// Datos mock de letras (reales de IOL)
const letrasMock = [
  { 
    ticker: "S29Y6", 
    ultimo: 126.96, 
    variacion_dia: 0.40, 
    ultimo_cierre: 126.50, 
    monto_operado: 17824289538.99,
    tna: 42,
    tea: 47.8,
    plazo: 90,
    tipo: "Capitalización",
    nombre: "Letra S29Y6",
    moneda: "ARS"
  },
  { 
    ticker: "M31G6", 
    ultimo: 117.60, 
    variacion_dia: 0.40, 
    ultimo_cierre: 117.13, 
    monto_operado: 7117020626.56,
    tna: 36,
    tea: 40.2,
    plazo: 180,
    tipo: "Capitalización (TAMAR)",
    nombre: "Letra M31G6",
    moneda: "ARS"
  },
  { 
    ticker: "S30N6", 
    ultimo: 109.15, 
    variacion_dia: 0.32, 
    ultimo_cierre: 108.80, 
    monto_operado: 1204219381.01,
    tna: 40,
    tea: 45.1,
    plazo: 270,
    tipo: "Capitalización",
    nombre: "Letra S30N6",
    moneda: "ARS"
  },
  { 
    ticker: "X30N6", 
    ultimo: 110.24, 
    variacion_dia: 1.04, 
    ultimo_cierre: 109.10, 
    monto_operado: 1444251793.43,
    tna: 22,
    tea: 24.5,
    plazo: 270,
    tipo: "Ajustable por CER",
    nombre: "Letra X30N6",
    moneda: "ARS"
  }
];

export const letrasApi = {
  getLetras: async () => {
    try {
      // Simulamos una pequeña demora como si fuera una API real
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Devolvemos los datos mock
      return letrasMock;
      
    } catch (error) {
      console.error('❌ Error en letrasApi:', error);
      throw error;
    }
  }
};