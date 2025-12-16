// src/components/charts/TreemapDashboard.jsx - VERSIÓN ACTUALIZADA CON DATOS REALES
import React from 'react';
import FinancialTreemap from './FinancialTreemap';
import { useTreemapData } from '../../hooks/useTreemapData';
import { RefreshCw, AlertCircle } from 'lucide-react';
import './TreemapDashboard.css';

const TreemapDashboard = () => {
  const { 
    leaderPanel, 
    cedears, 
    bonds, 
    loading, 
    error, 
    lastUpdate, 
    refresh 
  } = useTreemapData(220000); // Actualizar cada 60 segundos

  const currentDateTime = lastUpdate 
    ? new Date(lastUpdate).toLocaleString('es-AR', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Cargando...';

  // Mostrar skeleton mientras carga
  if (loading && leaderPanel.length === 0) {
    return (
      <div className="treemap-dashboard-simple">
        {[1, 2, 3].map((section, idx) => (
          <div key={idx} className="treemap-panel-full">
            <div className="financial-treemap-compact">
              <div className="treemap-header-compact">
                <div className="treemap-title-compact">
                  {idx === 0 ? 'PANEL LÍDER' : idx === 1 ? 'CEDEARS' : 'BONOS ($)'}
                </div>
                <div className="treemap-datetime-compact">Cargando...</div>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="treemap-dashboard-simple">
      {/* Botón de actualización y estado */}
      <div className="flex justify-between items-center mb-4 p-2 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          {error && (
            <div className="flex items-center text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span>Error: Mostrando datos de respaldo</span>
            </div>
          )}
          <span className="text-sm text-gray-600">
            Última actualización: {currentDateTime}
          </span>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Actualizando...' : 'Actualizar'}</span>
        </button>
      </div>

      {/* Panel Líder */}
      <div className="treemap-panel-full">
        <FinancialTreemap 
          data={leaderPanel}
          title="PANEL LÍDER"
          dateTime={currentDateTime}
          columns={5}
          blockSize="compact"
        />
      </div>
      
      {/* CEDEARs */}
      <div className="treemap-panel-full">
        <FinancialTreemap 
          data={cedears}
          title="CEDEARS"
          dateTime={currentDateTime}
          columns={5}
          blockSize="compact"
        />
      </div>
      
      {/* Bonos */}
      <div className="treemap-panel-full">
  <FinancialTreemap 
    data={bonds}
    title="BONOS ($)"
    dateTime={currentDateTime}
    columns={6}
    blockSize="compact"
    showSimulatedWarning={bonds.some(b => b.isSimulated)}
  />
</div>
    </div>
  );
};

export default TreemapDashboard;