// src/api/inflationApi.js - VERSIÓN FINAL CORREGIDA
const ARGENSTATS_API_KEY = 'as_prod_2LPhBgR8GnCZv6SAuH9fosOLJcMNoqjF';

export const inflationApi = {
  /**
   * Obtiene los últimos datos de inflación disponibles
   * @returns {Promise<Object>} Datos formateados de inflación
   */
  getCurrentInflation: async () => {
    try {
      
      const response = await fetch(
        `/api/argenstats/inflation?view=current`,
        {
          headers: {
            'Accept': 'application/json',
            'X-API-Key': ARGENSTATS_API_KEY
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success || !result.data) {
        return getMockInflationData();
      }

      const { data } = result;
      
      // FORMATO CORRECTO según estructura real
      return {
        // Valores principales (¡ESTOS SON LOS CORRECTOS!)
        monthly: data.values?.monthly || 0,      // 2.5%
        annual: data.values?.yearly || 0,        // 31.4% (IPC anual)
        accumulated: data.values?.accumulated || 0, // 27.9%
        index: data.index || 0,                  // 9841.3581
        
        // Metadatos
        date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
        lastUpdate: data.lastUpdate || '',
        component: data.component?.name || 'Nivel general',
        region: data.region || 'Nacional',
        
        // Datos completos
        raw: data,
        metadata: result.metadata,
        source: 'argenstats'
      };
    } catch (error) {
      console.error('❌ Error obteniendo inflación:', error);
      return getMockInflationData();
    }
  },

  /**
   * Obtiene serie histórica del IPC
   */
  getHistoricalInflation: async (from = '2024-01-01', to = '2024-12-01') => {
    try {
      const response = await fetch(
        `/api/argenstats/inflation?view=historical&from=${from}&to=${to}`,
        {
          headers: { 'X-API-Key': ARGENSTATS_API_KEY }
        }
      );
      
      const result = await response.json();
      
      if (result.success && Array.isArray(result.data)) {
        return result.data.map(item => ({
          date: item.date,
          monthly: item.values?.monthly,
          annual: item.values?.yearly,
          accumulated: item.values?.accumulated,
          index: item.index,
          component: item.component
        }));
      }
      return [];
    } catch (error) {
      console.error('❌ Error histórico:', error);
      return getMockHistoricalData();
    }
  },

  /**
   * Obtiene desglose por componentes
   */
  getInflationComponents: async (date = null) => {
    try {
      const targetDate = date || getCurrentMonthString();
      const response = await fetch(
        `/api/argenstats/inflation?view=components&date=${targetDate}`,
        {
          headers: { 'X-API-Key': ARGENSTATS_API_KEY }
        }
      );
      
      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      console.error('❌ Error componentes:', error);
      return null;
    }
  },

  /**
   * Obtiene inflación por región
   */
  getRegionalInflation: async (region = 'GBA') => {
    try {
      const response = await fetch(
        `/api/argenstats/inflation?view=current&region=${region}`,
        {
          headers: { 'X-API-Key': ARGENSTATS_API_KEY }
        }
      );
      
      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      console.error('❌ Error regional:', error);
      return null;
    }
  },

  /**
   * Obtiene los últimos N meses de inflación con cambios calculados
   * @param {number} months - Cantidad de meses a obtener (default: 4)
   * @returns {Promise<Array>} Datos de los últimos meses con cambios
   */
  getLastMonthsInflation: async (months = 4) => {
    try {
      // Calcular fechas para los últimos N meses
      const toDate = new Date();
      const fromDate = new Date();
      fromDate.setMonth(fromDate.getMonth() - months);
      
      const from = fromDate.toISOString().split('T')[0];
      const to = toDate.toISOString().split('T')[0];
      
      console.log(`📊 Obteniendo últimos ${months} meses (${from} a ${to})...`);
      
      const response = await fetch(
        `/api/argenstats/inflation?view=historical&from=${from}&to=${to}`,
        {
          headers: {
            'Accept': 'application/json',
            'X-API-Key': ARGENSTATS_API_KEY
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success || !Array.isArray(result.data)) {
        console.warn('⚠️ No se obtuvieron datos históricos:', result.error);
        return getMockHistoricalDataWithChanges(months);
      }

      // Ordenar por fecha (más reciente primero)
      const sortedData = result.data
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, months);
      
      // Calcular cambios vs mes anterior
      const dataWithChanges = sortedData.map((currentMonth, index) => {
        const previousMonth = sortedData[index + 1];
        
        if (!previousMonth) {
          return {
            ...currentMonth,
            change: { monthly: null, yearly: null, accumulated: null }
          };
        }
        
        // Calcular cambios
        const monthlyChange = currentMonth.values?.monthly - previousMonth.values?.monthly;
        const yearlyChange = currentMonth.values?.yearly - previousMonth.values?.yearly;
        const accumulatedChange = currentMonth.values?.accumulated - previousMonth.values?.accumulated;
        
        // Función helper para formatear con signo
        const formatChange = (value) => {
          if (value > 0) return `+${value.toFixed(1)}`;
          if (value < 0) return value.toFixed(1);
          return "0.0";
        };
        
        return {
          ...currentMonth,
          change: {
            monthly: formatChange(monthlyChange),
            yearly: formatChange(yearlyChange),
            accumulated: formatChange(accumulatedChange)
          }
        };
      });
      
      console.log(`✅ ${dataWithChanges.length} meses con cambios calculados:`, dataWithChanges);
      return dataWithChanges;
      
    } catch (error) {
      console.error('❌ Error obteniendo últimos meses:', error);
      return getMockHistoricalDataWithChanges(months);
    }
  }
};

// Helper functions
function getCurrentMonthString() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function getMockInflationData() {
  return {
    monthly: 13.2,
    annual: 289.4,
    accumulated: 287.9,
    index: 9841.36,
    date: new Date().toISOString().split('T')[0],
    component: 'Nivel general',
    region: 'Nacional',
    source: 'mock'
  };
}

function getMockHistoricalData() {
  return [
    { date: '2024-01-01', monthly: 20.6, annual: 254.2, accumulated: 20.6 },
    { date: '2024-02-01', monthly: 13.2, annual: 276.2, accumulated: 35.8 },
    { date: '2024-03-01', monthly: 11.0, annual: 287.9, accumulated: 50.8 }
  ];
}

function getMockHistoricalDataWithChanges(months = 4) {
  const mockData = [
    {
      date: "2025-11-30T00:00:00.000Z",
      values: { monthly: 2.5, yearly: 31.4, accumulated: 27.9 },
      change: { monthly: "+0.7", yearly: "+1.2", accumulated: "+2.5" }
    },
    {
      date: "2025-10-31T00:00:00.000Z",
      values: { monthly: 3.2, yearly: 30.2, accumulated: 25.4 },
      change: { monthly: "+0.9", yearly: "+2.1", accumulated: "+3.4" }
    },
    {
      date: "2025-09-30T00:00:00.000Z",
      values: { monthly: 4.1, yearly: 28.1, accumulated: 22.0 },
      change: { monthly: "-0.3", yearly: "+0.8", accumulated: "+4.2" }
    },
    {
      date: "2025-08-31T00:00:00.000Z",
      values: { monthly: 3.8, yearly: 27.3, accumulated: 17.8 },
      change: { monthly: "+0.5", yearly: "+1.5", accumulated: "+3.8" }
    }
  ];
  
  return mockData.slice(0, months);
}

export default inflationApi;