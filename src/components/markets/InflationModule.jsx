// src/components/markets/InflationDashboard.jsx - VERSIÓN FINAL
import React, { useState, useEffect } from 'react';
import { inflationApi } from '../../api/inflationApi';

const InflationModule = () => {
  const [inflationData, setInflationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('current'); // 'current', 'historical', 'components'

  const fetchInflationData = async () => {
    try {
      setLoading(true);
      const data = await inflationApi.getCurrentInflation();
      setInflationData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInflationData();
    // Actualizar cada 2 horas (los datos de inflación no cambian tan seguido)
    const interval = setInterval(fetchInflationData, 7200000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-800 rounded w-1/3"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 bg-gray-800 rounded"></div>
            <div className="h-24 bg-gray-800 rounded"></div>
            <div className="h-24 bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !inflationData) {
    return (
      <div className="bg-red-900/20 border border-red-700 rounded-xl p-6">
        <div className="flex items-center mb-3">
          <span className="text-2xl mr-2">⚠️</span>
          <h3 className="text-xl font-bold text-red-300">Error de Conexión</h3>
        </div>
        <p className="text-red-400 mb-4">{error || 'No se pudieron cargar los datos'}</p>
        <button
          onClick={fetchInflationData}
          className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Calcular tendencia
  const getTrend = () => {
    const monthly = inflationData.monthly;
    if (monthly > 3) return { type: 'high', icon: '📈', color: 'text-red-400', label: 'Alta' };
    if (monthly > 1.5) return { type: 'moderate', icon: '📊', color: 'text-yellow-400', label: 'Moderada' };
    return { type: 'low', icon: '📉', color: 'text-green-400', label: 'Baja' };
  };

  const trend = getTrend();

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">🏦</span>
            <h2 className="text-2xl font-bold text-white">Inflación Argentina</h2>
            <span className={`ml-3 text-sm px-3 py-1 rounded-full ${trend.color} bg-gray-800/50`}>
              {trend.icon} {trend.label}
            </span>
          </div>
          <p className="text-gray-400 text-sm">
            IPC {inflationData.component} • {inflationData.region}
            <span className="mx-2">•</span>
            Dato: {new Date(inflationData.date).toLocaleDateString('es-AR', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="mt-3 md:mt-0">
          <div className="text-xs text-gray-500 bg-gray-800/50 px-3 py-1 rounded">
            Fuente: INDEC vía Argenstats
            <span className="ml-2 text-green-400">●</span>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* IPC Mensual */}
        <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-5 hover:border-gray-600 transition">
          <div className="text-gray-400 text-sm mb-1">IPC Mensual</div>
          <div className="text-4xl font-bold text-white mb-2">
            {inflationData.monthly.toFixed(1)}%
          </div>
          <div className="flex items-center text-sm">
            <span className="text-gray-500">Variación mes a mes</span>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            Último dato oficial publicado
          </div>
        </div>

        {/* IPC Anual */}
        <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-5 hover:border-gray-600 transition">
          <div className="text-gray-400 text-sm mb-1">IPC Anual</div>
          <div className="text-4xl font-bold text-red-400 mb-2">
            {inflationData.annual.toFixed(1)}%
          </div>
          <div className="flex items-center text-sm">
            <span className="text-gray-500">Variación interanual</span>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            Últimos 12 meses
          </div>
        </div>

        {/* Acumulado e Índice */}
        <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-5 hover:border-gray-600 transition">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-gray-400 text-sm mb-1">Acumulado Anual</div>
              <div className="text-2xl font-bold text-yellow-400">
                {inflationData.accumulated.toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Índice IPC</div>
              <div className="text-2xl font-bold text-blue-400">
                {inflationData.index.toLocaleString('es-AR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Base 2016 = 100
            <span className="mx-2">•</span>
            Actualizado: {new Date(inflationData.lastUpdate).toLocaleDateString('es-AR')}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col md:flex-row justify-between items-center pt-4 border-t border-gray-800">
        <div className="text-xs text-gray-500 mb-3 md:mb-0">
          <span className="text-gray-400">Metadatos:</span>
          <span className="ml-2">v{inflationData.metadata?.version}</span>
          <span className="mx-2">•</span>
          <span>{inflationData.metadata?.timestamp ? 
            new Date(inflationData.metadata.timestamp).toLocaleTimeString('es-AR') : 
            '--:--'}</span>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={fetchInflationData}
            className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded transition"
          >
            🔄 Actualizar
          </button>
          <button
            onClick={() => setView(view === 'current' ? 'historical' : 'current')}
            className="text-sm bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 px-3 py-1 rounded transition"
          >
            {view === 'current' ? '📅 Ver Histórico' : '📊 Ver Actual'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InflationModule;