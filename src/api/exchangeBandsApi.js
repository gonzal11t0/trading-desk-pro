// exchangeBandsApi.js - VERSIÓN ACTUALIZADA 2026

/**
 * MODELO 2025 - Ajuste fijo mensual
 * Piso: -1% mensual, Techo: +1% mensual
 */
const calculateBands2025 = (initialPiso, initialTecho, months) => {
  const bands = [];
  let piso = initialPiso;
  let techo = initialTecho;
  
  for (let i = 0; i < months; i++) {
    piso = piso * 0.99;      // -1%
    techo = techo * 1.01;    // +1%
    
    const anchoAbsoluto = techo - piso;
    const anchoRelativo = (techo / piso - 1) * 100;
    
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
      descripcion: `Ajuste fijo: piso -1%, techo +1%`
    });
  }
  
  return bands;
};

/**
 * MODELO 2026 - Indexado a inflación (IPC[t-2])
 * Ambas bandas se ajustan según la inflación del mes t-2
 */
export const calculateBands2026 = (initialPiso, initialTecho, ipcSeries, months) => {
  const bands = [];
  let piso = initialPiso;
  let techo = initialTecho;
  
  // IPC mensual default si no hay datos (ej: 3% mensual)
  const defaultIPC = 0.03;
  
  for (let i = 0; i < months; i++) {
    // Obtener IPC[t-2] - rezago de 2 meses
    let ipcUtilizado = defaultIPC;
    let ipcMesReferencia = 'inicial';
    
    if (i >= 2) {
      // A partir del mes 3, usamos IPC real con rezago
      const ipcIndex = i - 2;
      if (ipcSeries && ipcSeries[ipcIndex]) {
        ipcUtilizado = ipcSeries[ipcIndex].value / 100; // Convertir % a decimal
        ipcMesReferencia = ipcSeries[ipcIndex].month;
      }
    } else if (i === 0 && ipcSeries && ipcSeries.length > 0) {
      // Para primeros meses, usar último IPC disponible
      ipcUtilizado = ipcSeries[ipcSeries.length - 1].value / 100;
      ipcMesReferencia = ipcSeries[ipcSeries.length - 1].month;
    }
    
    // Aplicar ajuste indexado (mismo % para ambas bandas)
    piso = piso * (1 + ipcUtilizado);
    techo = techo * (1 + ipcUtilizado);
    
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
      ipcMesReferencia: ipcMesReferencia,
      variacionAncho: parseFloat(variacionAncho.toFixed(2)),
      modelo: '2026',
      descripcion: `Indexado a IPC[${ipcMesReferencia}]: ${(ipcUtilizado * 100).toFixed(2)}%`
    });
  }
  
  return bands;
};

/**
 * Datos de IPC mock para desarrollo
 * En producción, esto vendría de INDEC API
 */
export const getMockIPCSeries = () => {
  return [
    { month: '2025-10', value: 3.2 }, // Oct 2025
    { month: '2025-11', value: 3.5 }, // Nov 2025
    { month: '2025-12', value: 3.8 }, // Dic 2025
    { month: '2026-01', value: 4.0 }, // Ene 2026
    { month: '2026-02', value: 3.9 }, // Feb 2026
    { month: '2026-03', value: 3.7 }, // Mar 2026
    { month: '2026-04', value: 3.5 }, // Abr 2026
    { month: '2026-05', value: 3.3 }, // May 2026
    { month: '2026-06', value: 3.1 }, // Jun 2026
    { month: '2026-07', value: 2.9 }, // Jul 2026
    { month: '2026-08', value: 2.7 }, // Ago 2026
    { month: '2026-09', value: 2.5 }  // Sep 2026
  ];
};

/**
 * Función principal - Decide qué modelo usar
 */
export const calculateExchangeBands = (modelo, initialValues, months, ipcData = null) => {
  const { pisoInicial, techoInicial } = initialValues;
  
  if (modelo === '2026') {
    const ipcSeries = ipcData || getMockIPCSeries();
    return calculateBands2026(pisoInicial, techoInicial, ipcSeries, months);
  }
  
  // Default: modelo 2025
  return calculateBands2025(pisoInicial, techoInicial, months);
};

/**
 * Calcular métricas comparativas entre modelos
 */
export const compareModels = (pisoInicial, techoInicial, months, ipcData = null) => {
  const bands2025 = calculateBands2025(pisoInicial, techoInicial, months);
  const bands2026 = calculateBands2026(pisoInicial, techoInicial, ipcData || getMockIPCSeries(), months);
  
  const comparacion = bands2025.map((band2025, index) => {
    const band2026 = bands2026[index];
    
    return {
      month: band2025.month,
      piso2025: band2025.piso,
      techo2025: band2025.techo,
      piso2026: band2026.piso,
      techo2026: band2026.techo,
      diferenciaPiso: band2026.piso - band2025.piso,
      diferenciaTecho: band2026.techo - band2025.techo,
      ancho2025: band2025.anchoAbsoluto,
      ancho2026: band2026.anchoAbsoluto,
      variacionAncho: band2026.variacionAncho || 0
    };
  });
  
  return comparacion;
};
export default ExchangeBandsModule;