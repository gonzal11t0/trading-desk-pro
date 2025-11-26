import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, RefreshCw, ExternalLink } from 'lucide-react';
import { fetchRiskCountryData } from '../../api/riskCountryApi';

export function RiskCountryModule() {
  const [riskData, setRiskData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [error, setError] = useState(null);

  const loadRiskData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchRiskCountryData();
      setRiskData(data);
      setLastUpdate(new Date());
      
      // Guardar para cache
      localStorage.setItem('riskCountryRealData', JSON.stringify({
        ...data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error loading risk country data:', error);
      setError('Error cargando datos en tiempo real');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRiskData();
    
    // Auto-refresh cada 10 minutos (más largo porque es scraping)
    const interval = setInterval(loadRiskData, 600000);
    return () => clearInterval(interval);
  }, []);

  const displayData = riskData || {
    value: 1645,
    previous: 1620,
    trend: 'up',
    change: 25,
    lastUpdate: new Date().toISOString(),
    source: 'default'
  };

  const riskLevel = getRiskLevel(displayData.value);

  const getSourceInfo = (source) => {
    const sources = {
      'ambito': { name: 'Ámbito.com', color: 'text-blue-400', url: 'https://www.ambito.com/contenidos/riesgo-pais.html' },
      'market': { name: 'Datos Mercado', color: 'text-green-400' },
      'cached': { name: 'Datos en Cache', color: 'text-yellow-400' },
      'estimated': { name: 'Estimado', color: 'text-orange-400' },
      'manual': { name: 'Manual', color: 'text-gray-400' },
      'default': { name: 'Por Defecto', color: 'text-gray-400' }
    };
    return sources[source] || { name: source, color: 'text-gray-400' };
  };

  const sourceInfo = getSourceInfo(displayData.source);

  return (
    <div className="section-bg rounded-xl p-6 border border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 group border-b-8 border-b-transparent">
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${riskLevel.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
      
      <div className="relative z-10">
        {/* HEADER COMPLETAMENTE CENTRADO */}
        <div className="text-center mb-6">
          {/* Título y fuente centrados */}
          <div className="flex flex-col items-center justify-center space-y-2 mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl bg-gradient-to-r ${riskLevel.color} shadow-lg`}>
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-white font-bold text-lg tracking-tight">
                RIESGO PAÍS
              </h2>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`text-xs ${sourceInfo.color}`}>
                {sourceInfo.name}
              </span>
              {displayData.source === 'ambito' && (
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

          {/* Botón de refresh centrado debajo del título */}
          <div className="flex justify-center">
            <button
              onClick={loadRiskData}
              disabled={isLoading}
              className="p-2 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 disabled:opacity-50"
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

        {/* VALOR PRINCIPAL EMBI+ CON FLECHAS DE TENDENCIA */}
        <div className="text-center mb-6">
          <div className="inline-flex flex-col items-center space-y-4 p-6 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-sm">
            <div className="flex items-center justify-center space-x-4">
              {/* Flecha de tendencia - SUBE */}
              {displayData.trend === 'up' && (
                <div className="flex flex-col items-center">
                  <TrendingUp style={{ 
                    width: '32px', 
                    height: '32px', 
                    color: '#ef4444',
                    animation: 'pulse 2s infinite'
                  }} />
                </div>
              )}
              
              {/* Valor principal */}
              <div className="flex flex-col items-center">
                <div className="flex items-baseline space-x-2">
                  <span 
                    style={{ color: '#fbbf24', fontSize: '2.0rem' }}
                    className="font-black font-mono tracking-tight select-all cursor-text"
                  >
                    {displayData.value}
                  </span>
                  <span 
                    style={{ color: '#fbbf24', fontSize: '1.2rem' }}
                    className="text-gray-400 font-normal"
                  >
                    puntos
                  </span>
                </div>
              </div>

              {/* Flecha de tendencia - BAJA */}
              {displayData.trend === 'down' && (
                <div className="flex flex-col items-center">
                  <TrendingDown style={{ 
                    width: '32px', 
                    height: '32px', 
                    color: '#22c55e',
                    animation: 'pulse 2s infinite'
                  }} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function para niveles de riesgo
const getRiskLevel = (value) => {
  if (value > 2000) return { level: 'EXTREMO', color: 'from-red-500 to-rose-500', bg: 'bg-red-500/10', borderColor: 'border-red-500/30' };
  if (value > 1700) return { level: 'ALTO', color: 'from-orange-500 to-amber-500', bg: 'bg-orange-500/10', borderColor: 'border-orange-500/30' };
  if (value > 1400) return { level: 'MEDIO', color: 'from-yellow-500 to-yellow-400', bg: 'bg-yellow-500/10', borderColor: 'border-yellow-500/30' };
  return { level: 'MODERADO', color: 'from-green-500 to-emerald-500', bg: 'bg-green-500/10', borderColor: 'border-green-500/30' };
}; 