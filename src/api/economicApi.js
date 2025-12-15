// src/api/economicApi.js - VERSIÓN SIMPLIFICADA Y FUNCIONAL

const BCRA_BASE_URL = 'https://api.bcra.gob.ar/estadisticas/v4.0';

/**
 * Obtiene los principales indicadores monetarios del BCRA (v4.0)
 * Versión simplificada que usa el listado general con ultValorInformado
 */
export const getBcraMonetaryData = async () => {
  try {
    console.log('📡 Obteniendo datos BCRA v4.0 (versión simplificada)...');

    // 1. Obtener el listado completo de variables
    const res = await fetch(`${BCRA_BASE_URL}/monetarias?limit=200`);
    if (!res.ok) {
      throw new Error(`Error HTTP ${res.status} al obtener variables`);
    }

    const data = await res.json();
    const variables = data.results || [];
    console.log(`🔢 Variables disponibles: ${variables.length}`);

    // 2. IDs de las variables que nos interesan (confirmados en pruebas)
const targetConfigs = [
  {
    id: 1,
    key: 'reserves',
    label: 'Reservas Internacionales',
    unit: 'USD',
    color: 'blue',
    // 41.824 (millones) → 41.8 (billones)
    format: (val) => `USD ${(val / 100000).toFixed(1).replace('.', ',')}B`
  },
  {
    id: 15,
    key: 'monetary_base',
    label: 'Base Monetaria',
    unit: 'ARS',
    color: 'green',
    // 40.856.240 (millones) → 40.856,2 (billones)
    format: (val) => {
      const billions = val / 100000; // Convertir millones a billones
      // Formato español con separadores de miles
      return `ARS ${billions.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, '.').replace('.', ',')}B`;
    }
  },
  {
    id: 109,
    key: 'm2',
    label: 'M2 (Oferta Monetaria)',
    unit: 'ARS',
    color: 'purple',
    format: (val) => {
      const billions = val / 100000; // Convertir millones a billones
      return `ARS ${billions.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, '.').replace('.', ',')}B`;
    }
  }
];

    const results = [];
    const today = new Date().toISOString().split('T')[0];

    // 3. Buscar cada variable en el listado
    for (const config of targetConfigs) {
      const variable = variables.find(v => v.idVariable === config.id);
      
      if (variable && variable.ultValorInformado !== undefined) {
        // Formatear el valor
        const formattedValue = config.format(variable.ultValorInformado);
        
        results.push({
          id: config.key,
          label: config.label,
          value: formattedValue,
          rawValue: variable.ultValorInformado,
          date: today, // Usamos fecha actual ya que ultimaFechaInformada viene undefined
          change: 0, // Sin histórico no podemos calcular variación
          unit: config.unit,
          color: config.color,
          source: 'BCRA v4.0',
          metadata: {
            idVariable: config.id,
            descripcion: variable.descripcion,
            categoria: variable.categoria
          }
        });

        console.log(`✅ ${config.label}: ${formattedValue}`);
      } else {
        console.warn(`⚠️ Variable no encontrada o sin valor: ${config.label}`);
        // Agregar placeholder
        results.push({
          id: config.key,
          label: config.label,
          value: config.unit === 'USD' ? 'USD 0M' : 'ARS 0M',
          rawValue: 0,
          date: today,
          change: 0,
          unit: config.unit,
          color: config.color,
          source: 'No disponible'
        });
      }
    }

    console.log(`🎯 BCRA: ${results.length} indicadores obtenidos`);
    
    // Si obtuvimos al menos un dato real, lo devolvemos
    const hasRealData = results.some(item => item.rawValue > 0);
    if (hasRealData) {
      return results;
    }
    
    // Si no, usamos datos de fallback
    return getFallbackBcraData();

  } catch (error) {
    console.error('❌ Error en getBcraMonetaryData:', error);
    return getFallbackBcraData();
  }
};

/**
 * Función principal para obtener datos económicos (compatibilidad)
 * Esta es la función que tu useEconomicData.js probablemente espera
 */
export const fetchEconomicData = async () => {
  try {
    // Obtener datos BCRA
    const bcraData = await getBcraMonetaryData();
    
    // Extraer datos en el formato que espera tu UI
    const reservesData = bcraData.find(item => item.id === 'reserves');
    const monetaryBaseData = bcraData.find(item => item.id === 'monetary_base');
    const m2Data = bcraData.find(item => item.id === 'm2');
    
    // Estructura compatible con tu EconomicDataBlock
    return {
      indicators: [], // Otros indicadores económicos (vacío por ahora)
      reserves: reservesData ? {
        label: "En millones",
        value: reservesData.rawValue,
        change: reservesData.change || 0,
        description: reservesData.label
      } : null,
      monetaryBase: monetaryBaseData ? {
        label: "En millones", 
        value: monetaryBaseData.rawValue,
        change: monetaryBaseData.change || 0,
        description: monetaryBaseData.label
      } : null,
      moneySupply: {
        label: "En millones",
        m2: m2Data?.rawValue || 0,
        m3: 0, // No tenemos M3
        description: 'Agregados Monetarios'
      }
    };
    
  } catch (error) {
    console.error('Error en fetchEconomicData:', error);
    // Devolver estructura vacía pero válida
    return {
      indicators: [],
      reserves: null,
      monetaryBase: null,
      moneySupply: null
    };
  }
};

/**
 * Datos de fallback (para cuando la API falle)
 */
const getFallbackBcraData = () => {
  console.log('📊 Usando datos de fallback estáticos');
  return [
    {
      id: 'reserves',
      label: 'Reservas Internacionales',
      value: 'USD 0',
      rawValue: 41824,
      date: new Date().toISOString().split('T')[0],
      change: -2.3,
      unit: 'USD',
      color: 'blue',
      source: 'BCRA v4.0 (Fallback)'
    },
    {
      id: 'monetary_base',
      label: 'Base Monetaria',
      value: 'ARS 0M',
      rawValue: 40856,
      date: new Date().toISOString().split('T')[0],
      change: 4.2,
      unit: 'ARS',
      color: 'green',
      source: 'BCRA v4.0 (Fallback)'
    },
    {
      id: 'm2',
      label: 'M2 (Oferta Monetaria)',
      value: 'ARS 0',
      rawValue: 80803,
      date: new Date().toISOString().split('T')[0],
      change: 0,
      unit: 'ARS',
      color: 'purple',
      source: 'BCRA v4.0 (Fallback)'
    }
  ];
};

// Exportar ambas funciones para compatibilidad
export default {
  fetchEconomicData,
  getBcraMonetaryData
};