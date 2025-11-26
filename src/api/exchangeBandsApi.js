// src/api/exchangeBandsApi.js

// VALORES BASE CON PRIMER AJUSTE DEL 1% YA APLICADO
const BASE_BANDS = {
  lower: 936.66,    // $936,66 (927.39 + 1%)
  upper: 1523.56,   // $1.523,56 (1508.48 + 1%)
};

// Función principal que exportas
export const fetchExchangeBandsData = async () => {
  try {
    
    // Obtener bandas con ajuste mensual aplicado
    const adjustedBands = getMonthlyAdjustedBands();
    
    return adjustedBands;
    
  } catch (error) {
    console.error('❌ Error en fetchExchangeBandsData:', error);
    return getMonthlyAdjustedBands(); // Fallback con ajuste
  }
};

// Calcular bandas con ajuste mensual del 1%
const getMonthlyAdjustedBands = () => {
  // Verificar si ya tenemos datos ajustados guardados
  const savedData = localStorage.getItem('exchangeBandsAdjustedData');
  
  if (savedData) {
    const parsed = JSON.parse(savedData);
    const dataAge = Date.now() - new Date(parsed.timestamp).getTime();
    const monthlyAge = 30 * 24 * 60 * 60 * 1000; // 30 días
    
    // Si los datos tienen menos de 30 días, usarlos
    if (dataAge < monthlyAge) {
      return { 
        ...parsed, 
        source: 'monthly_adjusted',
        lastUpdate: new Date().toISOString()
      };
    } else {
      // Calcular nuevo ajuste basado en los últimos valores
      return calculateNewMonthlyAdjustment(parsed);
    }
  }
  
  // Si no hay datos guardados, usar los valores base con primer ajuste ya aplicado
  const initialBands = {
    ...BASE_BANDS,
    spread: BASE_BANDS.upper - BASE_BANDS.lower,
    lastUpdate: new Date().toISOString(),
    adjustmentCount: 1, // Ya tiene el primer ajuste aplicado
    source: 'initial_adjusted'
  };
  
  // Guardar los datos iniciales
  localStorage.setItem('exchangeBandsAdjustedData', JSON.stringify({
    ...initialBands,
    timestamp: Date.now(),
    adjustmentDate: new Date().toISOString()
  }));
  
  return initialBands;
};

// Calcular nuevo ajuste mensual basado en valores anteriores
const calculateNewMonthlyAdjustment = (previousData) => {
  const lastLower = previousData.lower;
  const lastUpper = previousData.upper;
  const previousAdjustmentCount = previousData.adjustmentCount || 1;
  
  // Aplicar ajuste del 1%
  const adjustmentRate = 1.01; // 1% de aumento
  const newLower = Math.round((lastLower * adjustmentRate) * 100) / 100;
  const newUpper = Math.round((lastUpper * adjustmentRate) * 100) / 100;
  
  
  const adjustedBands = {
    lower: newLower,
    upper: newUpper,
    spread: newUpper - newLower,
    lastUpdate: new Date().toISOString(),
    adjustmentCount: previousAdjustmentCount + 1,
    source: 'monthly_adjustment'
  };
  
  // Guardar los nuevos datos ajustados
  localStorage.setItem('exchangeBandsAdjustedData', JSON.stringify({
    ...adjustedBands,
    timestamp: Date.now(),
    adjustmentDate: new Date().toISOString()
  }));
  
  return adjustedBands;
};

// Función para ver información de ajustes
export const getBandsAdjustmentInfo = () => {
  const savedData = localStorage.getItem('exchangeBandsAdjustedData');
  
  // Valores originales sin ajuste (para referencia)
  const originalValues = {
    lower: 927.39,
    upper: 1508.48
  };
  
  if (savedData) {
    const parsed = JSON.parse(savedData);
    const currentSpread = parsed.upper - parsed.lower;
    const originalSpread = originalValues.upper - originalValues.lower;
    
    // Calcular el ajuste total desde los valores originales
    const totalAdjustmentFromOriginal = ((parsed.lower / originalValues.lower - 1) * 100).toFixed(2);
    
    return {
      originalValues: originalValues,
      currentValues: { lower: parsed.lower, upper: parsed.upper },
      adjustmentsApplied: parsed.adjustmentCount || 1,
      originalSpread: originalSpread,
      currentSpread: currentSpread,
      totalAdjustment: `${totalAdjustmentFromOriginal}%`,
      lastAdjustment: parsed.adjustmentDate || new Date().toISOString(),
      nextAdjustment: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
  }
  
  return {
    originalValues: originalValues,
    currentValues: BASE_BANDS,
    adjustmentsApplied: 1,
    originalSpread: originalValues.upper - originalValues.lower,
    currentSpread: BASE_BANDS.upper - BASE_BANDS.lower,
    totalAdjustment: "1.00%",
    lastAdjustment: "Inicial",
    nextAdjustment: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  };
};

// Función para reiniciar a los valores con primer ajuste
export const resetBandsToAdjustedBase = () => {
  localStorage.removeItem('exchangeBandsAdjustedData');
  return BASE_BANDS;
};

// Función para simular paso de tiempo (útil para testing)
export const simulateTimePassage = (days = 30) => {
  const savedData = localStorage.getItem('exchangeBandsAdjustedData');
  if (savedData) {
    const parsed = JSON.parse(savedData);
    // Restar días al timestamp para simular que pasó el tiempo
    const newTimestamp = new Date(parsed.timestamp - (days * 24 * 60 * 60 * 1000));
    parsed.timestamp = newTimestamp.getTime();
    localStorage.setItem('exchangeBandsAdjustedData', JSON.stringify(parsed));
  }
  return getBandsAdjustmentInfo();
};