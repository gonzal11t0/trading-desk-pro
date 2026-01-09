// exchangeBandsApi.js 

const calculateBands2025 = (initialPiso, initialTecho, months) => {
  const bands = [];
  let piso = initialPiso;
  let techo = initialTecho;
  
  for (let i = 0; i < months; i++) {
    piso *= 0.99;  // -1%
    techo *= 1.01; // +1%
    
    const anchoAbsoluto = techo - piso;
    const anchoRelativo = ((techo / piso - 1) * 100);
    
    bands.push({
      month: `M${i + 1}`,
      periodo: `2025-${String(i + 1).padStart(2, '0')}`,
      piso: parseFloat(piso.toFixed(2)),
      techo: parseFloat(techo.toFixed(2)),
      anchoAbsoluto: parseFloat(anchoAbsoluto.toFixed(2)),
      anchoRelativo: parseFloat(anchoRelativo.toFixed(1)),
      ajustePiso: -1.0,
      ajusteTecho: 1.0,
      modelo: '2025',
      descripcion: 'Ajuste fijo: piso -1%, techo +1%'
    });
  }
  
  return bands;
};

/**
 * MODELO 2026 - Indexado a inflación (IPC[t-2])
 */
export const calculateBands2026 = (initialPiso, initialTecho, ipcSeries, months) => {
  const bands = [];
  let piso = initialPiso;
  let techo = initialTecho;
  const defaultIPC = 0.03; // 3% mensual default
  
  for (let i = 0; i < months; i++) {
    let ipcUtilizado = defaultIPC;
    let ipcMesReferencia = 'inicial';
    
    // Determinar IPC a utilizar con rezago de 2 meses
    if (i >= 2 && ipcSeries?.[i - 2]) {
      ipcUtilizado = ipcSeries[i - 2].value / 100;
      ipcMesReferencia = ipcSeries[i - 2].month;
    } else if (i === 0 && ipcSeries?.length > 0) {
      ipcUtilizado = ipcSeries[ipcSeries.length - 1].value / 100;
      ipcMesReferencia = ipcSeries[ipcSeries.length - 1].month;
    }
    
    // Aplicar ajuste indexado
    const factor = (1 + ipcUtilizado);
    piso *= factor;
    techo *= factor;
    
    const anchoAbsoluto = techo - piso;
    const anchoInicial = initialTecho - initialPiso;
    const anchoRelativo = (anchoAbsoluto / piso) * 100;
    const variacionAncho = ((anchoAbsoluto / anchoInicial) - 1) * 100;
    
    bands.push({
      month: `M${i + 1}`,
      periodo: `2026-${String(i + 1).padStart(2, '0')}`,
      piso: parseFloat(piso.toFixed(2)),
      techo: parseFloat(techo.toFixed(2)),
      anchoAbsoluto: parseFloat(anchoAbsoluto.toFixed(2)),
      anchoRelativo: parseFloat(anchoRelativo.toFixed(1)),
      ajustePiso: parseFloat((ipcUtilizado * 100).toFixed(2)),
      ajusteTecho: parseFloat((ipcUtilizado * 100).toFixed(2)),
      ipcUtilizado: parseFloat((ipcUtilizado * 100).toFixed(2)),
      ipcMesReferencia,
      variacionAncho: parseFloat(variacionAncho.toFixed(2)),
      modelo: '2026',
      descripcion: `Indexado a IPC[${ipcMesReferencia}]: ${(ipcUtilizado * 100).toFixed(2)}%`
    });
  }
  
  return bands;
};

/**
 * Datos de IPC mock para desarrollo
 */
export const getMockIPCSeries = () => [
  { month: '2025-10', value: 3.2 },
  { month: '2025-11', value: 3.5 },
  { month: '2025-12', value: 3.8 },
  { month: '2026-01', value: 4.0 },
  { month: '2026-02', value: 3.9 },
  { month: '2026-03', value: 3.7 },
  { month: '2026-04', value: 3.5 },
  { month: '2026-05', value: 3.3 },
  { month: '2026-06', value: 3.1 },
  { month: '2026-07', value: 2.9 },
  { month: '2026-08', value: 2.7 },
  { month: '2026-09', value: 2.5 }
];

/**
 * Función principal para calcular bandas cambiarias
 */
export const calculateExchangeBands = (modelo, initialValues, months, ipcData = null) => {
  const { pisoInicial, techoInicial } = initialValues;
  
  if (modelo === '2026') {
    const ipcSeries = ipcData || getMockIPCSeries();
    return calculateBands2026(pisoInicial, techoInicial, ipcSeries, months);
  }
  
  return calculateBands2025(pisoInicial, techoInicial, months);
};

/**
 * Comparar métricas entre modelos 2025 y 2026
 */
export const compareModels = (pisoInicial, techoInicial, months, ipcData = null) => {
  const bands2025 = calculateBands2025(pisoInicial, techoInicial, months);
  const bands2026 = calculateBands2026(pisoInicial, techoInicial, ipcData || getMockIPCSeries(), months);
  
  return bands2025.map((band2025, index) => {
    const band2026 = bands2026[index];
    const diferenciaPiso = band2026.piso - band2025.piso;
    const diferenciaTecho = band2026.techo - band2025.techo;
    
    return {
      month: band2025.month,
      piso2025: band2025.piso,
      techo2025: band2025.techo,
      piso2026: band2026.piso,
      techo2026: band2026.techo,
      diferenciaPiso: parseFloat(diferenciaPiso.toFixed(2)),
      diferenciaTecho: parseFloat(diferenciaTecho.toFixed(2)),
      ancho2025: band2025.anchoAbsoluto,
      ancho2026: band2026.anchoAbsoluto,
      variacionAncho: band2026.variacionAncho || 0,
      ipcUtilizado: band2026.ipcUtilizado || 0
    };
  });
};

/**
 * Obtener datos de IPC desde API externa (INDEC)
 * @returns {Promise<Array>} Series de IPC
 */
export const fetchIPCSeries = async () => {
  try {
    // Aquí iría la integración con INDEC API
    // Por ahora retornamos datos mock
    return getMockIPCSeries();
  } catch {
    return getMockIPCSeries();
  }
};

/**
 * Calcular bandas con valores default para uso rápido
 */
export const getDefaultExchangeBands = () => {
  const initialValues = { pisoInicial: 800, techoInicial: 1200 };
  const months = 12;
  
  return {
    modelo2025: calculateBands2025(initialValues.pisoInicial, initialValues.techoInicial, months),
    modelo2026: calculateBands2026(initialValues.pisoInicial, initialValues.techoInicial, getMockIPCSeries(), months),
    comparacion: compareModels(initialValues.pisoInicial, initialValues.techoInicial, months)
  };
};


export default {
  calculateExchangeBands,
  calculateBands2025,
  calculateBands2026,
  compareModels,
  fetchIPCSeries,
  getMockIPCSeries,
  getDefaultExchangeBands
};