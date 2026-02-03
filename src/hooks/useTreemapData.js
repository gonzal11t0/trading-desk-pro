// src/hooks/useTreemapData.js - VERSIÓN ROBUSTA
import { useState, useEffect } from 'react';

export const useTreemapData = (refreshInterval = 60000) => {
  const [data, setData] = useState({
    leaderPanel: [],
    cedears: [],
    loading: true,
    error: null,
    lastUpdate: null
  });

  const fetchData = async () => {
    console.log('🔄 Fetching treemap data...');
    setData(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Usar datos mock garantizados
      const [leaderPanel, cedears] = await Promise.all([
        getMockLeaderPanel(),
        getMockCedears()
      ]);
      
      console.log('✅ Data loaded:', {
        leaderCount: leaderPanel.length,
        cedearsCount: cedears.length
      });
      
      setData({
        leaderPanel: leaderPanel,
        cedears: cedears,
        loading: false,
        error: null,
        lastUpdate: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Error in treemap data:', error);
      
      // Fallback garantizado
      setData({
        leaderPanel: getFallbackLeaderPanel(),
        cedears: getFallbackCedears(),
        loading: false,
        error: 'Usando datos de demostración',
        lastUpdate: new Date().toISOString()
      });
    }
  };

  // Datos mock básicos
  const getMockLeaderPanel = async () => {
    return [
      { ticker: 'GGAL', variation: 2.15, price: 1250.50 },
      { ticker: 'YPFD', variation: -0.71, price: 8450.75 },
      { ticker: 'PAMP', variation: 1.45, price: 2345.25 },
      { ticker: 'CEPU', variation: 4.77, price: 856.30 },
      { ticker: 'BMA', variation: 0.85, price: 3450.60 },
      { ticker: 'LOMA', variation: -1.25, price: 1567.80 },
      { ticker: 'CRES', variation: 0.15, price: 890.40 },
      { ticker: 'EDN', variation: 1.75, price: 1230.20 }
    ].map(item => ({
      ...item,
      id: item.ticker,
      source: 'mock',
      real: false
    }));
  };
  
  const getMockCedears = async () => {
    return [
      { ticker: 'SPY', variation: 0.73, price: 485.25 },
      { ticker: 'AAPL', variation: -1.63, price: 182.34 },
      { ticker: 'MSFT', variation: 0.45, price: 415.62 },
      { ticker: 'GOOGL', variation: 0.25, price: 142.25 },
      { ticker: 'AMZN', variation: 1.25, price: 155.45 },
      { ticker: 'META', variation: -0.75, price: 368.90 },
      { ticker: 'TSLA', variation: -4.03, price: 245.80 },
      { ticker: 'NVDA', variation: 0.45, price: 525.30 }
    ].map(item => ({
      ...item,
      id: item.ticker,
      source: 'mock',
      real: false
    }));
  };

  // Fallback en caso de error extremo
  const getFallbackLeaderPanel = () => [
    { ticker: 'GGAL', variation: 0, price: 1000, id: 'GGAL', source: 'fallback', real: false },
    { ticker: 'YPFD', variation: 0, price: 8000, id: 'YPFD', source: 'fallback', real: false }
  ];
  
  const getFallbackCedears = () => [
    { ticker: 'SPY', variation: 0, price: 500, id: 'SPY', source: 'fallback', real: false },
    { ticker: 'AAPL', variation: 0, price: 180, id: 'AAPL', source: 'fallback', real: false }
  ];

  useEffect(() => {
    fetchData();
    
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return {
    ...data,
    refresh: fetchData
  };
};