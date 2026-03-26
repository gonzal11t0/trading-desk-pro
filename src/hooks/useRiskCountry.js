// src/hooks/useRiskCountry.js
import { useEffect, useState } from 'react';
import { riskCountryApi } from '../api/riskCountryApi';

export const useRiskCountry = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchRiskCountry = async () => {
    console.log('🔄 fetchRiskCountry iniciado');
    try {
      setLoading(true);
      const result = await riskCountryApi.getLatestRiskCountry();
      console.log('✅ Resultado final:', result);
      
      setData(result);
      setLastUpdated(new Date().toISOString());
      setError(null);
    } catch (err) {
      console.error('❌ Error en fetchRiskCountry:', err);
      setError('No se pudo conectar con la API de riesgo país');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiskCountry();
    const intervalId = setInterval(fetchRiskCountry, 300000);
    return () => clearInterval(intervalId);
  }, []);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh: fetchRiskCountry,
  };
};