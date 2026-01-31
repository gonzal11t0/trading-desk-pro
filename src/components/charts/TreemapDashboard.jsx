import React, { useMemo } from 'react';
import FinancialTreemap from './FinancialTreemap';
import { useTreemapData } from '../../hooks/useTreemapData';
import { RefreshCw, AlertCircle } from 'lucide-react';

const REFRESH_INTERVAL = 220000;
const PANEL_TITLES = {
  LEADER: 'PANEL LÍDER - ACCIONES ARG',
  CEDEARS: 'CEDEARS - ACCIONES USA'
};
const SKELETON_ITEMS_COUNT = 10;
const COLUMNS_COUNT = 4;

const DashboardHeader = React.memo(({ currentDateTime, onRefresh, isLoading, error }) => (
  <div className="min-w-0 bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-gray-700/50 mb-4 md:mb-6">
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="min-w-0">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white truncate">
          MAPAS DE MERCADO
        </h2>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm text-gray-400">Última actualización:</span>
          <span className="text-sm md:text-base font-medium text-blue-400">
            {currentDateTime}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {error && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-900/20 border border-red-800/30 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-red-300">Error en datos</span>
          </div>
        )}
        
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-1 py-2 bg-blue-600 hover:bg-blue-700 
                   disabled:bg-gray-700 disabled:cursor-not-allowed 
                   transition-colors rounded-lg text-white font-medium"
          title="Actualizar datos"
        >
<span className="text-xs">Actualizar</span>
        </button>
      </div>
    </div>
  </div>
));

const TreemapSkeleton = React.memo(({ title }) => (
  <div className="min-w-0 bg-gray-900/30 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-gray-700/50">
    <div className="mb-4 md:mb-6">
      <div className="text-lg md:text-xl font-semibold text-white mb-2">
        {title}
      </div>
      <div className="text-sm text-gray-400">Cargando...</div>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      {Array.from({ length: SKELETON_ITEMS_COUNT }).map((_, i) => (
        <div key={i} className="h-16 bg-gray-800 rounded animate-pulse"></div>
      ))}
    </div>
  </div>
));

const TreemapPanel = React.memo(({ data, title, dateTime, type }) => (
  <div className="min-w-0 bg-gray-900/30 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-gray-700/50">
    <FinancialTreemap 
      data={data}
      title={title}
      dateTime={dateTime}
      columns={COLUMNS_COUNT}
      blockSize="normal"
      data-testid={`treemap-${type}`}
    />
  </div>
));

const TreemapDashboard = () => {
  const { 
    leaderPanel, 
    cedears, 
    loading, 
    error, 
    lastUpdate, 
    refresh 
  } = useTreemapData(REFRESH_INTERVAL);

  const currentDateTime = useMemo(() => {
    if (!lastUpdate) return 'Cargando...';
    
    return new Date(lastUpdate).toLocaleString('es-AR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, [lastUpdate]);

  const handleRefresh = useMemo(() => () => {
    if (!loading) {
      refresh();
    }
  }, [loading, refresh]);

  if (loading && leaderPanel.length === 0) {
    return (
      <div className="min-w-0 bg-gray-950 p-4 md:p-6">
        <DashboardHeader 
          currentDateTime={currentDateTime}
          onRefresh={handleRefresh}
          isLoading={loading}
          error={error}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <TreemapSkeleton title={PANEL_TITLES.LEADER} />
          <TreemapSkeleton title={PANEL_TITLES.CEDEARS} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0 bg-gray-950 p-4 md:p-6">
      <DashboardHeader 
        currentDateTime={currentDateTime}
        onRefresh={handleRefresh}
        isLoading={loading}
        error={error}
      />
      
      <div className="flex flex-col gap-4 md:gap-6">
        <TreemapPanel 
          data={leaderPanel}
          title={PANEL_TITLES.LEADER}
          dateTime={currentDateTime}
          type="leader"
        />
        
        <TreemapPanel 
          data={cedears}
          title={PANEL_TITLES.CEDEARS}
          dateTime={currentDateTime}
          type="cedears"
        />
      </div>
    </div>
  );
};

export default React.memo(TreemapDashboard);