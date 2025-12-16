// src/hooks/useTreemapData.js - NUEVO ARCHIVO
import { useState, useEffect } from 'react';
import { treemapApi } from '../api/treemapApi';

export const useTreemapData = (refreshInterval = 60000) => {
  const [data, setData] = useState({
    leaderPanel: [],
    cedears: [],
    bonds: [],
    loading: true,
    error: null,
    lastUpdate: null
  });

  const fetchData = async () => {
    setData(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await treemapApi.getAllTreemapData();
      
      setData({
        leaderPanel: result.leaderPanel || [],
        cedears: result.cedears || [],
        bonds: result.bonds || [],
        loading: false,
        error: null,
        lastUpdate: result.timestamp
      });
    } catch (error) {
      console.error('Error in useTreemapData:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

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