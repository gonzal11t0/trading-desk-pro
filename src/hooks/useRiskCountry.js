import { useEffect, useState } from 'react';
import { riskCountryApi } from '../api/riskCountryApi';

export const useRiskCountry = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchRiskCountry = async () => {
    try {
      setLoading(true);
      const result = await riskCountryApi.getLatestRiskCountry();
      
      // Guardar en caché si es dato real
      if (result.source === 'argentinaDatos') {
        riskCountryApi.cacheData(result);
      }
      
      setData(result);
      setLastUpdated(new Date().toISOString());
      setError(null);
    } catch (err) {
      setError('No se pudo conectar con la API de riesgo país');
      console.error('Error en useRiskCountry:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    fetchRiskCountry();
    
    // Configurar actualización periódica cada 5 minutos
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