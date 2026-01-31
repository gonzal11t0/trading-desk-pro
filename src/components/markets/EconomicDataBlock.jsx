import React from 'react';
import EconomicDataTable from './EconomicDataTable';
import DatosMacros from './DatosMacros';
import { useEconomicData } from '../../hooks/useEconomicData';
import { Database, RefreshCw, AlertTriangle, Clock, Building } from 'lucide-react';

const EconomicDataBlock = () => {
  const { 
    bcraData,           
    reserves, 
    monetaryBase, 
    moneySupply, 
    loading, 
    error, 
    refresh,
    lastUpdate,
    status
  } = useEconomicData();

  // Formatear hora de actualización
  const formatTime = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return '';
    }
  };

  return (
     <div className="w-full min-w-0 bg-gradient-to-br from-gray-900 via-gray-900 to-blue-950/30 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-blue-500/20 shadow-xl shadow-blue-900/10 
                  col-span-full lg:col-span-full xl:col-span-full">
      {/* Contenedor interno para mantener consistencia */}
    <div className="w-full min-w-0">
        
        {/* Header con estado */}
<div className="w-full min-w-0 text-center mb-4 md:mb-6 pb-4 md:pb-6 border-b border-blue-500/10">
          <div className="flex flex-col items-center gap-3 md:gap-4">
            {/* Título principal */}
            <div className="flex items-center justify-center gap-3 md:gap-4 flex-wrap">
              <span className="text-3xl md:text-4xl animate-pulse">📊</span>
              <h3 className="text-white text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                Indicadores Económicos Argentina
              </h3>
              
              {/* Badge de estado */}
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs md:text-sm font-medium ${
                status?.bcraConectado 
                  ? 'bg-green-900/30 text-green-400 border border-green-700/30' 
                  : 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/30'
              }`}>
                <div className={`w-2 h-2 rounded-full ${status?.bcraConectado ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                <span>
                  {status?.bcraConectado 
                    ? `${status.totalIndicadores || 'Varios'} indicadores` 
                    : 'Sin conexión'}
                </span>
              </div>
            </div>
            
            {/* Línea decorativa */}
            <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            
            {/* Información de actualización */}
            {lastUpdate && !loading && !error && (
              <div className="flex items-center justify-center gap-2 text-gray-400 text-xs md:text-sm">
                <Clock className="w-3 h-3 md:w-4 md:h-4" />
                <span>Actualizado: {formatTime(lastUpdate)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Estados de carga/error */}
        {loading ? (
          <div className="text-center py-8 md:py-12">
            <div className="w-12 h-12 md:w-16 md:h-16 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-blue-300 font-medium text-lg md:text-xl mb-2">
              Conectando con BCRA API...
            </p>
            <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto">
              Obteniendo datos en tiempo real del Banco Central de la República Argentina
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-6 md:py-8">
            <div className="inline-flex flex-col md:flex-row items-center gap-4 md:gap-6 p-4 md:p-6 bg-red-900/20 border border-red-800/30 rounded-xl backdrop-blur-sm max-w-2xl">
              <AlertTriangle className="w-10 h-10 md:w-12 md:h-12 text-red-400 flex-shrink-0" />
              <div className="text-left">
                <h4 className="text-red-300 font-bold text-lg md:text-xl mb-2">
                  Error de conexión con BCRA
                </h4>
                <p className="text-red-400/80 text-sm md:text-base mb-4">
                  {typeof error === 'string' ? error : 'No se pudo conectar con la API del BCRA'}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={refresh}
                    className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reintentar conexión
                  </button>
                  <button
                    onClick={() => {
                      console.log('Usando datos de fallback...');
                      refresh();
                    }}
                    className="px-4 py-2.5 bg-gray-800/50 text-gray-300 border border-gray-700 rounded-lg hover:bg-gray-700/50 transition-colors"
                  >
                    Usar datos locales
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Componente DatosMacros */}
            <div className="mb-4 md:mb-6">
              <DatosMacros
                reserves={reserves}
                monetaryBase={monetaryBase}
                moneySupply={moneySupply}
              />
            </div>

            {/* Footer informativo */}
            <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-700/30">
              <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Building className="w-3 h-3 md:w-4 md:h-4" />
                  <span>Fuente: BCRA API v4.0 • Datos oficiales</span>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="w-3 h-3 md:w-4 md:h-4" />
                  <span>Actualización automática cada 5 minutos</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EconomicDataBlock;