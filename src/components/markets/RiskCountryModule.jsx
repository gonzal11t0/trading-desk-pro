import React from 'react';
import { useRiskCountry } from '../../hooks/useRiskCountry';
import { AlertTriangle, RefreshCw, TrendingUp, ExternalLink, Shield } from 'lucide-react';

const RiskCountryModule = () => {
  const { data, loading, error, lastUpdated, refresh } = useRiskCountry();

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Formatear hora
  const formatTime = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  // Determinar nivel de riesgo
  const getRiskLevel = (valor) => {
    if (!valor) return 'unknown';
    if (valor >= 2000) return 'critical';
    if (valor >= 1500) return 'high';
    if (valor >= 1000) return 'medium';
    return 'low';
  };

  // Determinar clases Tailwind según nivel
  const getRiskClasses = (level) => {
    switch(level) {
      case 'critical':
        return {
          bg: 'bg-red-950/20',
          border: 'border-red-900/30',
          text: 'text-red-400',
          badgeBg: 'bg-red-900/30',
          badgeText: 'text-red-300',
          icon: 'text-red-500',
          value: 'text-red-400',
          gradient: 'from-red-900/10 to-red-950/5'
        };
      case 'high':
        return {
          bg: 'bg-orange-950/20',
          border: 'border-orange-900/30',
          text: 'text-orange-400',
          badgeBg: 'bg-orange-900/30',
          badgeText: 'text-orange-300',
          icon: 'text-orange-500',
          value: 'text-orange-400',
          gradient: 'from-orange-900/10 to-orange-950/5'
        };
      case 'medium':
        return {
          bg: 'bg-yellow-950/20',
          border: 'border-yellow-900/30',
          text: 'text-yellow-400',
          badgeBg: 'bg-yellow-900/30',
          badgeText: 'text-yellow-300',
          icon: 'text-yellow-500',
          value: 'text-yellow-400',
          gradient: 'from-yellow-900/10 to-yellow-950/5'
        };
      case 'low':
        return {
          bg: 'bg-green-950/20',
          border: 'border-green-900/30',
          text: 'text-green-400',
          badgeBg: 'bg-green-900/30',
          badgeText: 'text-green-300',
          icon: 'text-green-500',
          value: 'text-green-400',
          gradient: 'from-green-900/10 to-green-950/5'
        };
      default:
        return {
          bg: 'bg-gray-900/20',
          border: 'border-gray-700/30',
          text: 'text-gray-400',
          badgeBg: 'bg-gray-800/30',
          badgeText: 'text-gray-300',
          icon: 'text-gray-500',
          value: 'text-gray-400',
          gradient: 'from-gray-800/10 to-gray-900/5'
        };
    }
  };

  const riskLevel = getRiskLevel(data?.valor);
  const riskClasses = getRiskClasses(riskLevel);
  const riskLabels = {
    critical: 'CRÍTICO',
    high: 'ALTO',
    medium: 'MEDIO',
    low: 'BAJO',
    unknown: 'DESCONOCIDO'
  };

  // Estado de la fuente
  const getSourceConfig = (source) => {
    switch(source) {
      case 'argentinaDatos':
        return {
          bg: 'bg-green-900/30',
          text: 'text-green-400',
          label: 'LIVE',
          dotColor: 'bg-green-500'
        };
      case 'cache':
        return {
          bg: 'bg-blue-900/30',
          text: 'text-blue-400',
          label: 'CACHÉ',
          dotColor: 'bg-blue-500'
        };
      default:
        return {
          bg: 'bg-gray-800/30',
          text: 'text-gray-400',
          label: 'MOCK',
          dotColor: 'bg-gray-500'
        };
    }
  };

  const sourceConfig = getSourceConfig(data?.source);

  if (loading) {
    return (
      <div className={`bg-gray-900/30 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-gray-700/50 min-w-0 animate-pulse`}>
        <div className="flex justify-between items-start mb-4 md:mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-900/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="text-white text-lg md:text-xl font-semibold">Riesgo País</h3>
              <p className="text-gray-400 text-sm">EMBI+ Argentina</p>
            </div>
          </div>
          <RefreshCw className="w-4 h-4 text-gray-500 animate-spin" />
        </div>
        <div className="text-center py-8">
          <div className="h-10 bg-gray-800/50 rounded-lg w-32 mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-red-900/30 min-w-0">
        <div className="flex justify-between items-start mb-4 md:mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-900/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="text-white text-lg md:text-xl font-semibold">Riesgo País</h3>
              <p className="text-gray-400 text-sm">EMBI+ Argentina</p>
            </div>
          </div>
        </div>
        <div className="text-center py-6">
          <p className="text-red-400 font-medium mb-4">Error cargando datos</p>
          <button 
            onClick={refresh}
            className="px-4 py-2 bg-red-900/20 text-red-300 border border-red-800/30 rounded-lg text-sm hover:bg-red-900/30 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`bg-gradient-to-br ${riskClasses.gradient} backdrop-blur-sm rounded-xl p-4 md:p-6 border ${riskClasses.border} min-w-0 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4 md:mb-6 min-w-0">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={`p-3 ${riskClasses.bg} rounded-lg flex-shrink-0`}>
            <AlertTriangle className={`w-5 h-5 ${riskClasses.icon}`} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-white text-lg md:text-xl font-semibold truncate min-w-0">Riesgo País</h3>
              <span className={`px-2 py-1 ${riskClasses.badgeBg} ${riskClasses.badgeText} rounded-full text-xs font-bold uppercase flex-shrink-0`}>
                {riskLabels[riskLevel]}
              </span>
            </div>
            <p className="text-gray-400 text-sm">EMBI+ Argentina</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`px-2 py-1 ${sourceConfig.bg} ${sourceConfig.text} rounded-full text-xs font-medium uppercase`}>
            {sourceConfig.label}
          </span>
          <button 
            onClick={refresh}
            className={`p-2 ${riskClasses.bg} rounded-lg hover:opacity-80 transition-opacity`}
            title="Actualizar"
          >
            <RefreshCw className={`w-4 h-4 ${riskClasses.text}`} />
          </button>
        </div>
      </div>

      {/* Valor Principal */}
      <div className="mb-4 md:mb-6">
        <div className="flex justify-between items-baseline mb-1">
          <div className="flex items-baseline gap-2">
            <span className={`${riskClasses.value} text-3xl md:text-4xl font-bold`}>
              {data?.valor?.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) || 'N/A'}
            </span>
            <span className="text-gray-500 text-lg md:text-xl">puntos</span>
          </div>
          <TrendingUp className="w-5 h-5 text-gray-500" />
        </div>
        <p className="text-gray-500 text-sm">Valor EMBI+</p>
      </div>

      {/* Información adicional */}
      <div className="space-y-3 md:space-y-4">
        {/* Fecha de actualización */}
        {lastUpdated && (
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Actualizado</span>
            </div>
            <div className="text-right">
              <span className="text-white font-medium">{formatDate(lastUpdated)}</span>
              <span className="text-gray-400 text-xs block">{formatTime(lastUpdated)}</span>
            </div>
          </div>
        )}



        {/* Indicador de estado */}
        <div className="flex justify-between items-center pt-3 md:pt-4 border-t border-gray-700/30">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 ${sourceConfig.dotColor} rounded-full`}></div>
            <span className="text-gray-500 text-xs">
              {data?.source === 'argentinaDatos' ? 'Datos en vivo' : 'Datos cacheados'}
            </span>
          </div>
          {data?.source !== 'argentinaDatos' && (
            <button
              onClick={refresh}
              className="px-3 py-1.5 bg-gray-800/50 text-gray-300 text-xs rounded-lg hover:bg-gray-700/50 transition-colors"
            >
              Forzar actualización
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiskCountryModule;