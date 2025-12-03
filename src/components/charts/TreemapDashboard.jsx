// src/components/charts/TreemapDashboard.jsx - VERSIÓN SIMPLIFICADA
import React from 'react';
import FinancialTreemap from './FinancialTreemap';
import './TreemapDashboard.css';

const TreemapDashboard = () => {
  // Datos mock
  const leaderData = [
    { ticker: 'GGAL', variation: 2.15 },
    { ticker: 'YPFD', variation: -0.71 },
    { ticker: 'PAMP', variation: 1.45 },
    { ticker: 'CEPU', variation: 4.77 },
    { ticker: 'SUPV', variation: 1.20 },
    { ticker: 'BMA', variation: 0.85 },
    { ticker: 'LOMA', variation: -1.25 },
    { ticker: 'TXAR', variation: 0.30 },
    { ticker: 'COME', variation: 2.80 },
    { ticker: 'METR', variation: -0.90 },
    { ticker: 'CRES', variation: 0.15 },
    { ticker: 'EDN', variation: 1.75 }
  ];

  const cedearsData = [
    { ticker: 'IBIT', variation: -6.92 },
    { ticker: 'ETHA', variation: -9.53 },
    { ticker: 'SPY', variation: -1.25 },
    { ticker: 'MSTR', variation: -2.80 },
    { ticker: 'NVDA', variation: -4.15 },
    { ticker: 'VIST', variation: -0.85 },
    { ticker: 'META', variation: 0.45 },
    { ticker: 'MELI', variation: 1.52 },
    { ticker: 'PLTR', variation: -3.20 },
    { ticker: 'MSFT', variation: 0.25 },
    { ticker: 'AAPL', variation: -0.75 },
    { ticker: 'GOOGL', variation: -1.15 }
  ];

  const bondsData = [
    { ticker: 'AL30', variation: -0.51 },
    { ticker: 'GD30', variation: -0.55 },
    { ticker: 'GD35', variation: -0.60 },
    { ticker: 'TX26', variation: -0.45 },
    { ticker: 'TXZD5', variation: 0.06 },
    { ticker: 'GD38', variation: -0.35 },
    { ticker: 'AE38', variation: -0.40 },
    { ticker: 'GD41', variation: -0.25 },
    { ticker: 'GD46', variation: -0.30 },
    { ticker: 'AL35', variation: -0.20 },
    { ticker: 'GD29', variation: -0.15 },
    { ticker: 'AL41', variation: -0.10 }
  ];

  const currentDateTime = new Date().toLocaleString('es-AR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="treemap-dashboard-simple">
      <div className="treemap-panel-full">
        <FinancialTreemap 
          data={leaderData}
          title="PANEL LÍDER"
          dateTime={currentDateTime}
          columns={5}  
          blockSize="compact"
        />
      </div>
      
      <div className="treemap-panel-full">
        <FinancialTreemap 
          data={cedearsData}
          title="CEDEARS"
          dateTime={currentDateTime}
          columns={5} 
          blockSize="compact"
        />
      </div>
      
      <div className="treemap-panel-full">
        <FinancialTreemap 
          data={bondsData}
          title="BONOS ($)"
          dateTime={currentDateTime}
          columns={6} 
          blockSize="compact"
        />
      </div>
    </div>
  );
};

export default TreemapDashboard;