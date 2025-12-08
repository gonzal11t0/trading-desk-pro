// src/api/economicApi.js
//import axios from 'axios';

// Configuración de APIs reales (futura implementación)
const API_ENDPOINTS = {
  INDEC: {
    emae: 'https://apis.datos.gob.ar/series/api/series?ids=143.3_NO_PR_2004_A_21',
    gdp: 'https://apis.datos.gob.ar/series/api/series?ids=168.1_T_CAMBIOR_D_0_0_26',
    inflation: 'https://apis.datos.gob.ar/series/api/series?ids=148.3_INIVELNAL_DICI_M_15'
  },
  BCRA: {
    reserves: 'https://api.bcra.gob.ar/estadisticas/v1.0/PrincipalesVariables',
    monetary: 'https://api.bcra.gob.ar/estadisticas/v1.0/DatosVariable'
  },
  MOCK: '/api/mock/economic' // Endpoint para datos mock
};

// Función principal para obtener datos económicos
export const fetchEconomicData = async () => {
  try {
    // Por ahora, devolvemos datos mock
    // En el futuro, puedes implementar las APIs reales aquí
    return await fetchMockData();
    
    // Para implementación futura con APIs reales:
    // const [indicatorsData, bcraData] = await Promise.all([
    //   fetchINDECData(),
    //   fetchBCRAData()
    // ]);
    // return processEconomicData(indicatorsData, bcraData);
    
  } catch (error) {
    console.error('Error fetching economic data:', error);
    throw error;
  }
};

// Función para datos mock (temporal)
const fetchMockData = async () => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const mockData = {
    // SIN lastUpdate
    indicators: [
      { id: 'emae', label: 'EMAE', value: '105.3', period: 'Sep 2024', yoy: -2.3, trend: 'down', unit: 'Índice' },
      { id: 'gdp', label: 'PBI', value: '-3.2%', period: 'Q3 2024', yoy: -5.1, trend: 'down', unit: '%' },
      { id: 'construction', label: 'Construcción', value: '85.4', period: 'Oct 2024', yoy: -15.2, trend: 'down', unit: 'Índice' },
      { id: 'unemployment', label: 'Desempleo', value: '7.6%', period: 'Q3 2024', yoy: 0.4, trend: 'up', unit: '%' },
      { id: 'employment', label: 'Empleo', value: '44.5%', period: 'Q3 2024', yoy: 0.2, trend: 'up', unit: '%' },
      { id: 'wages', label: 'Salarios', value: '+2.2%', period: 'Oct 2025', yoy: 152.4, trend: 'up', unit: '% mensual' },
      { id: 'tradeBalance', label: 'Balanza Comercial', value: '+800M', period: 'Oct 2024', yoy: 85.3, trend: 'up', unit: 'USD' },
      { id: 'exports', label: 'Exportaciones', value: '6,842M', period: 'Oct 2024', yoy: 12.4, trend: 'up', unit: 'USD' },
      { id: 'imports', label: 'Importaciones', value: '5,597M', period: 'Oct 2024', yoy: 8.7, trend: 'up', unit: 'USD' }
    ],
    reserves: {
           label:"En millones",
      
      value: 41.756,
      change: -2.3,
      description: 'Reservas Internacionales Netas'
    },
    monetaryBase: {
           label:"En millones",
      
      value: 40.264655,
      change: 4.2,
      description: 'Base Monetaria'
    },
    moneySupply: {
           label:"En millones",
      
      m2: 79.26470763,
      m3: 150.72028426,
      description: 'Agregados Monetarios'
    }
  };
  
  return mockData;
};
