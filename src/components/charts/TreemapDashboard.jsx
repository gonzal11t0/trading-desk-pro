/* treemapdashboard */
import React, { useMemo } from 'react';
import FinancialTreemap from './FinancialTreemap';
import { useTreemapData } from '../../hooks/useTreemapData';
import { RefreshCw, AlertCircle } from 'lucide-react';
import './TreemapDashboard.css';

// Constantes para configuración
const REFRESH_INTERVAL = 220000; // 220 segundos = 3.67 minutos
const PANEL_TITLES = {
  LEADER: 'PANEL LÍDER - ACCIONES ARG',
  CEDEARS: 'CEDEARS - ACCIONES USA'
};
const SKELETON_ITEMS_COUNT = 10;
const COLUMNS_COUNT = 4;

// Componente memoizado para el header
const DashboardHeader = React.memo(({ currentDateTime, onRefresh, isLoading, error }) => (
  <div className="treemap-header-simple">
    <div className="header-left-simple">
      <h2 className="dashboard-title-simple">MAPAS DE MERCADO</h2>
      <div className="dashboard-subtitle-simple">
        <span className="datetime-label-simple">Última actualización:</span>
        <span className="datetime-value-simple">{currentDateTime}</span>
      </div>
    </div>
    
    <div className="header-right-simple">
      {error && (
        <div className="error-badge-simple">
          <AlertCircle className="error-icon-simple" />
          <span className="error-text-simple">Error en datos</span>
        </div>
      )}
      
      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="refresh-button-simple"
        title="Actualizar datos"
      >
        <RefreshCw className={`refresh-icon-simple ${isLoading ? 'spin' : ''}`} />
        <span className="refresh-text-simple">Actualizar</span>
      </button>
    </div>
  </div>
));

// Componente memoizado para skeleton loading
const TreemapSkeleton = React.memo(({ title }) => (
  <div className="treemap-panel-full">
    <div className="financial-treemap-compact">
      <div className="treemap-header-compact">
        <div className="treemap-title-compact">{title}</div>
        <div className="treemap-datetime-compact">Cargando...</div>
      </div>
      <div className={`grid grid-cols-${COLUMNS_COUNT} gap-2`}>
        {Array.from({ length: SKELETON_ITEMS_COUNT }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-800 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  </div>
));

// Componente memoizado para cada panel
const TreemapPanel = React.memo(({ data, title, dateTime, type }) => (
  <div className="treemap-panel-full">
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

  // Memoizar el formateo de fecha
  const currentDateTime = useMemo(() => {
    if (!lastUpdate) return 'Cargando...';
    
    return new Date(lastUpdate).toLocaleString('es-AR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, [lastUpdate]);

  // Memoizar handlers
  const handleRefresh = useMemo(() => () => {
    if (!loading) {
      refresh();
    }
  }, [loading, refresh]);

  // Mostrar skeleton mientras carga inicialmente
  if (loading && leaderPanel.length === 0) {
    return (
      <div className="treemap-dashboard-simple">
        <DashboardHeader 
          currentDateTime={currentDateTime}
          onRefresh={handleRefresh}
          isLoading={loading}
          error={error}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TreemapSkeleton title={PANEL_TITLES.LEADER} />
          <TreemapSkeleton title={PANEL_TITLES.CEDEARS} />
        </div>
      </div>
    );
  }

  return (
    <div className="treemap-dashboard-simple">
      <DashboardHeader 
        currentDateTime={currentDateTime}
        onRefresh={handleRefresh}
        isLoading={loading}
        error={error}
      />
      
      {/* Dos paneles lado a lado en pantallas grandes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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