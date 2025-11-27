// src/components/markets/ExchangeBandsModule.jsx
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, ExternalLink, Calendar } from 'lucide-react';
import { fetchExchangeBandsData } from '../../api/exchangeBandsApi';

export function ExchangeBandsModule() {
  const [bandsData, setBandsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [error, setError] = useState(null);
  const [nextUpdate, setNextUpdate] = useState(null);

  const loadBandsData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchExchangeBandsData();
      setBandsData(data);
      setLastUpdate(new Date());
      
      // Calcular próxima actualización (primer día del próximo mes)
      const nextUpdateDate = getNextMonthFirstDay();
      setNextUpdate(nextUpdateDate);
      
      // Guardar para cache mensual
      localStorage.setItem('exchangeBandsRealData', JSON.stringify({
        ...data,
        timestamp: Date.now(),
        nextUpdate: nextUpdateDate
      }));
    } catch (error) {
      console.error('Error loading exchange bands data:', error);
      setError('Error cargando datos oficiales');
    } finally {
      setIsLoading(false);
    }
  };

  // Calcular primer día del próximo mes
  const getNextMonthFirstDay = () => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return nextMonth;
  };

  // Verificar si necesita actualización mensual
  const needsMonthlyUpdate = () => {
    const savedData = localStorage.getItem('exchangeBandsMonthlyData');
    if (!savedData) return true;
    
    const parsed = JSON.parse(savedData);
    const dataAge = Date.now() - new Date(parsed.timestamp).getTime();
    const monthlyAge = 30 * 24 * 60 * 60 * 1000; // 30 días
    
    return dataAge >= monthlyAge;
  };

  useEffect(() => {
    // Solo cargar si necesita actualización mensual o es la primera vez
    if (needsMonthlyUpdate() || !bandsData) {
      loadBandsData();
    } else {
      // Cargar datos cacheados
      const savedData = localStorage.getItem('exchangeBandsRealData');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setBandsData(parsed);
        setNextUpdate(new Date(parsed.nextUpdate));
      }
      setIsLoading(false);
    }
    
    // No necesitamos interval de actualización por ser mensual
  }, []);

  const displayData = bandsData || {
    lower: 850,
    upper: 1180,
    spread: 330,
    source: 'default'
  };

  const getSourceInfo = (source) => {
    const sources = {
      'dolarito': { 
        name: 'Dolarito.ar', 
        color: 'text-green-400', 
        url: 'https://www.dolarito.ar/dolar/bandas-cambiarias' 
      },
      'dolarito_scraped': { 
        name: 'Dolarito.ar', 
        color: 'text-green-400',
        url: 'https://www.dolarito.ar/dolar/bandas-cambiarias'
      },
      'dolarito_text': { 
        name: 'Dolarito.ar', 
        color: 'text-green-400',
        url: 'https://www.dolarito.ar/dolar/bandas-cambiarias'
      },
      'bcra': { 
        name: 'BCRA', 
        color: 'text-blue-400', 
        url: 'https://www.bcra.gob.ar/PublicacionesEstadisticas/Evolucion_moneda.asp' 
      },
      'bcra_calculated': { 
        name: 'BCRA Calculado', 
        color: 'text-blue-400' 
      },
      'blue_calculated': { 
        name: 'Basado en Blue', 
        color: 'text-orange-400' 
      },
      'monthly_cached': { 
        name: 'Cache Mensual', 
        color: 'text-yellow-400' 
      },
      'estimated_monthly': { 
        name: 'Estimado Mensual', 
        color: 'text-orange-400' 
      },
      'manual_monthly': { 
        name: 'Manual', 
        color: 'text-gray-400' 
      },
      'default': { 
        name: 'Por Defecto', 
        color: 'text-gray-400' 
      }
    };
    return sources[source] || { name: source, color: 'text-gray-400' };
  };

  const sourceInfo = getSourceInfo(displayData.source);

  const formatDate = (date) => {
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="section-bg rounded-xl p-6 border border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        {/* HEADER CON INFORMACIÓN MENSUAL */}
        <div className="text-center mb-6">
          <div className="flex flex-col items-center justify-center space-y-2 mb-4">
<div className="flex items-center space-x-3">
  <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
    <TrendingUp className="h-5 w-5 text-white" />
  </div>
<h2 className="text-white font-bold text-lg tracking-tight" style={{ marginLeft: '1rem' }}>
  BANDAS CAMBIARIAS
</h2>
</div>
            
            <div className="flex items-center space-x-2">
              <span className={`text-xs ${sourceInfo.color}`}>
                {sourceInfo.name}
              </span>
              {(displayData.source.includes('dolarito') || displayData.source === 'bcra') && (
                <a 
                  href={sourceInfo.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Información de actualización mensual */}
          <div className="flex items-center justify-center space-x-2 text-gray-400 text-xs mb-3">
            <Calendar className="w-3 h-3" />
            <span>ACTUALIZACIÓN MENSUAL</span>
          </div>

          {/* Botón de refresh forzado */}
          <div className="flex justify-center">
            <button
              onClick={loadBandsData}
              disabled={isLoading}
              className="p-2 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 disabled:opacity-50"
              title="Forzar actualización"
            >
              <RefreshCw className={`w-4 h-4 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
            <p className="text-red-400/70 text-xs mt-1">Usando datos de respaldo</p>
          </div>
        )}

        {/* VALORES PRINCIPALES */}
        <div className="flex justify-around items-center mt-8 mb-4">
          {/* Banda Inferior - VERDE */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <div style={{ color: '#34d399' }}>
                <TrendingDown className="w-5 h-5" />
              </div>
              <div 
                style={{ 
                  color: '#34d399', 
                  fontSize: '2.5rem',
                  fontWeight: '900'
                }} 
                className="font-mono tracking-tight select-all cursor-text"
              >
                ${displayData.lower}
              </div>
            </div>
            <div className="text-gray-400 text-sm font-light">INFERIOR</div>
          </div>

          {/* Banda Superior - ROJO */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <div style={{ color: '#ef4444' }}>
                <TrendingUp className="w-5 h-5" />
              </div>
              <div 
                style={{ 
                  color: '#ef4444', 
                  fontSize: '2.5rem',
                  fontWeight: '900'
                }} 
                className="font-mono tracking-tight select-all cursor-text"
              >
                ${displayData.upper}
              </div>
            </div>
            <div className="text-gray-400 text-sm font-light">SUPERIOR</div>
          </div>
        </div>

        {/* INFORMACIÓN ADICIONAL MEJORADA */}
        <div className="mt-6 pt-4 border-t border-gray-700/30">
        
          
          

          {/* Próxima actualización */}
          {nextUpdate && (
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-center justify-center space-x-2">
                <Calendar className="w-3 h-3 text-blue-400" />
                <span className="text-blue-400 text-xs">
                  Próxima actualización: {formatDate(nextUpdate)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* INDICADOR DE ESTADO MENSUAL */}
        <div className="mt-4 p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs">ESTADO</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-400 text-xs font-semibold">ACTUALIZADO</span>
            </div>
          </div>
          <div className="text-gray-500 text-xs text-center mt-1">
            Datos oficiales mensuales
          </div>
        </div>
      </div>
    </div>
  );
}