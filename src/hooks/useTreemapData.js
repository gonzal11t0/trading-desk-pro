// src/hooks/useTreemapData.js - SIN BONOS
import { useState, useEffect } from 'react';
import { treemapApi } from '../api/treemapApi';

export const useTreemapData = (refreshInterval = 60000) => {
  const [data, setData] = useState({
    leaderPanel: [],
    cedears: [],
    loading: true,
    error: null,
    lastUpdate: null
  });

  const fetchData = async () => {
    setData(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Solo obtener panel líder y cedears
      const [leaderPanel, cedears] = await Promise.all([
        treemapApi.getLeaderPanel(),
        treemapApi.getCedears()
      ]);
      
      setData({
        leaderPanel: leaderPanel || [],
        cedears: cedears || [],
        loading: false,
        error: null,
        lastUpdate: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error in useTreemapData:', error);
      
      // Fallback a datos mock (sin bonos)
      setData({
        leaderPanel: getMockLeaderPanel(),
        cedears: getMockCedears(),
        loading: false,
        error: error.message,
        lastUpdate: new Date().toISOString()
      });
    }
  };

  // Funciones mock (sin bonos)
  const getMockLeaderPanel = () => [
    { ticker: 'GGAL', variation: 2.15, price: 1250.50 },
    { ticker: 'YPFD', variation: -0.71, price: 8450.75 },
    { ticker: 'PAMP', variation: 1.45, price: 2345.25 },
    { ticker: 'CEPU', variation: 4.77, price: 856.30 },
    { ticker: 'BMA', variation: 0.85, price: 3450.60 },
    { ticker: 'LOMA', variation: -1.25, price: 1567.80 },
    { ticker: 'CRES', variation: 0.15, price: 890.40 },
    { ticker: 'EDN', variation: 1.75, price: 1230.20 }
  ];
  
  const getMockCedears = () => [
    { ticker: 'SPY', variation: 0.73, price: 485.25 },
    { ticker: 'MSTR', variation: -8.14, price: 675.40 },
    { ticker: 'NVDA', variation: 0.45, price: 125.30 },
    { ticker: 'META', variation: -0.75, price: 345.60 },
    { ticker: 'AAPL', variation: -1.63, price: 198.75 },
    { ticker: 'GOOGL', variation: 0.25, price: 145.30 },
    { ticker: 'TSLA', variation: -4.03, price: 245.80 },
    { ticker: 'AMZN', variation: 1.25, price: 178.90 }
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