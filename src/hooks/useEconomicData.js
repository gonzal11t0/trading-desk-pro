// src/hooks/useEconomicData.js - VERSIÓN COMPLETA CORREGIDA
import { useState, useEffect } from 'react';
import { fetchEconomicData, getBcraMonetaryData } from '../api/economicApi';

export const useEconomicData = () => {
  const [data, setData] = useState({
    bcra: [],           // Datos BCRA en formato array
    indicators: [],     // Indicadores económicos (ahora incluye datos BCRA)
    reserves: null,     // Reservas internacionales
    monetaryBase: null, // Base monetaria
    moneySupply: null,  // Oferta monetaria
    loading: true,
    error: null,
    lastUpdate: null
  });

  const fetchAllData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));
      
      // 1. Obtener datos económicos completos
      const economicData = await fetchEconomicData();
      
      // 2. Obtener datos BCRA en formato de array
      const bcraData = await getBcraMonetaryData();
      
      setData({
        bcra: bcraData || [],
        indicators: economicData?.indicators || [],
        reserves: economicData?.reserves || null,
        monetaryBase: economicData?.monetaryBase || null,
        moneySupply: economicData?.moneySupply || null,
        loading: false,
        error: null,
        lastUpdate: new Date().toISOString()
      });
      
      console.log(`✅ useEconomicData: ${bcraData.length} indicadores BCRA cargados`);
      
    } catch (error) {
      console.error('❌ Error fetching economic data:', error);
      setData(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Error al cargar datos económicos'
      }));
    }
  };

  useEffect(() => {
    fetchAllData();
    
    // Refrescar cada 5 minutos (300,000 ms)
    const interval = setInterval(fetchAllData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Función para obtener solo datos BCRA
  const getBcraData = () => data.bcra;

  // Función para obtener datos por categoría
  const getDataByCategory = (category) => {
    if (!data.bcra.length) return [];
    
    if (category === 'encajes') {
      return data.bcra.filter(item => 
        item.id.includes('encajes') || 
        item.label.toLowerCase().includes('encaje')
      );
    }
    if (category === 'tasas') {
      return data.bcra.filter(item => 
        item.unit === '%' || 
        item.label.toLowerCase().includes('tasa')
      );
    }
    if (category === 'instrumentos') {
      return data.bcra.filter(item => 
        ['cer', 'uva', 'uvi'].includes(item.id) ||
        item.unit === 'Índice'
      );
    }
    if (category === 'monetarios') {
      return data.bcra.filter(item => 
        ['reserves', 'monetary_base', 'm2'].includes(item.id)
      );
    }
    return data.bcra;
  };

  return {
    // Datos completos
    allData: [...data.bcra, ...data.indicators],
    
    // Datos segmentados
    bcraData: data.bcra,            // ¡IMPORTANTE: EconomicDataBlock necesita esto!
    indicators: data.indicators,
    reserves: data.reserves,
    monetaryBase: data.monetaryBase,
    moneySupply: data.moneySupply,
    
    // Estado
    loading: data.loading,
    error: data.error,
    lastUpdate: data.lastUpdate,
    
    // Métodos
    refresh: fetchAllData,
    getBcraData,
    getDataByCategory,
    
    // Utilidades
    hasBcraData: data.bcra.length > 0,
    hasEconomicData: data.indicators.length > 0,
    bcraCount: data.bcra.length,
    
    // Métodos específicos por categoría
    getEncajes: () => getDataByCategory('encajes'),
    getTasas: () => getDataByCategory('tasas'),
    getInstrumentos: () => getDataByCategory('instrumentos'),
    getMonetarios: () => getDataByCategory('monetarios'),
    
    // Información de estado
    status: {
      totalIndicadores: data.bcra.length + data.indicators.length,
      bcraConectado: data.bcra.length > 0,
      ultimaActualizacion: data.lastUpdate ? new Date(data.lastUpdate).toLocaleTimeString('es-AR') : 'Nunca'
    }
  };
};

export default useEconomicData;