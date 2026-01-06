// src/components/charts/TreemapDashboard.jsx - SIN BONOS
import React from 'react';
import FinancialTreemap from './FinancialTreemap';
import { useTreemapData } from '../../hooks/useTreemapData';
import { RefreshCw, AlertCircle } from 'lucide-react';
import './TreemapDashboard.css';

const TreemapDashboard = () => {
  const { 
    leaderPanel, 
    cedears, 
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
<div 
  className="treemap-dashboard-simple"
  style={{ 
    paddingBottom: '8px',      // Reducir padding inferior
    marginBottom: '4px',       // Reducir margen inferior
    minHeight: 'auto',         // Eliminar altura mínima fija
    height: 'fit-content'      // Ajustar al contenido
  }}
>        {[1, 2].map((section, idx) => (
          <div key={idx} className="treemap-panel-full">
            <div className="financial-treemap-compact">
              <div className="treemap-header-compact">
                <div className="treemap-title-compact">
                  {idx === 0 ? 'PANEL LÍDER' : 'CEDEARS'}
                </div>
                <div className="treemap-datetime-compact">Cargando...</div>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

// En TreemapDashboard.jsx - versión mejorada
return (
  <div className="treemap-dashboard-simple">
    {/* Encabezado... */}
    
    {/* Dos paneles lado a lado en pantallas grandes */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Panel Líder */}
      <div className="treemap-panel-full">
        <FinancialTreemap 
          data={leaderPanel}
          title="PANEL LÍDER - ACCIONES ARG"
          dateTime={currentDateTime}
          columns={4}
          blockSize="normal"
        />
      </div>
      
      {/* CEDEARs */}
      <div className="treemap-panel-full">
        <FinancialTreemap 
          data={cedears}
          title="CEDEARS - ACCIONES USA"
          dateTime={currentDateTime}
          columns={4}
          blockSize="normal"
        />
      </div>
    </div>
  </div>
);
};

export default TreemapDashboard;