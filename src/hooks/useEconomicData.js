// src/hooks/useEconomicData.js - VERSIÓN CORREGIDA
import { useState, useEffect } from 'react';
import { fetchEconomicData, getBcraMonetaryData } from '../api/economicApi';

export const useEconomicData = () => {
  const [data, setData] = useState({
    bcra: [],
    indicators: [],
    reserves: null,
    monetaryBase: null,
    moneySupply: null,
    loading: true,
    error: null,
    lastUpdate: null
  });

  const fetchAllData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));
      
      // 1. Obtener datos económicos completos (incluye BCRA en formato estructurado)
      const economicData = await fetchEconomicData();
      
      // 2. Obtener datos BCRA en formato de array para otros usos
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
      
    } catch (error) {
      console.error('Error fetching economic data:', error);
      setData(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message 
      }));
    }
  };

  useEffect(() => {
    fetchAllData();
    
    // Refrescar cada 20 minutos
    const interval = setInterval(fetchAllData, 20 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Función para obtener solo datos BCRA
  const getBcraData = () => data.bcra;

  // Función para obtener datos por categoría
  const getDataByCategory = (category) => {
    if (category === 'monetary') return data.bcra;
    if (category === 'inflation') {
      return data.indicators.filter(item => 
        item.label?.toLowerCase().includes('inflación')
      );
    }
    if (category === 'risk') {
      return data.indicators.filter(item => 
        item.label?.toLowerCase().includes('riesgo') || 
        item.label?.toLowerCase().includes('embi')
      );
    }
    return [];
  };

  return {
    // Datos completos
    allData: [...data.bcra, ...data.indicators],
    
    // Datos segmentados
    bcraData: data.bcra,
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
    bcraCount: data.bcra.length
  };
};