// src/components/charts/FinancialTreemap.jsx - VERSIÓN MEJORADA
import React from 'react';
import './FinancialTreemap.css';

const FinancialTreemap = ({ 
  data = [], 
  title = "PANEL", 
  dateTime = "",
  columns = 2,
}) => {
  
  const getColor = (variation) => {
    if (variation > 2) return '#00ff00';
    if (variation > 0.5) return '#90ee90';
    if (variation < -2) return '#ff0000';
    if (variation < -0.5) return '#ff6b6b';
    if (variation > 0) return '#4169e1';
    return '#2c3e50';
  };

  const getGridStyle = () => {
    const rows = Math.ceil(data.length / columns);
    
    return {
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, 1fr)`,
      height: `${rows * 70}px`,
      gap: '5px'
    };
  };

  // Si no hay datos, mostrar mensaje
  if (data.length === 0) {
    return (
      <div className="financial-treemap-compact">
        <div className="treemap-header-compact">
          <div className="treemap-title-compact">{title}</div>
          <div className="treemap-datetime-compact">{dateTime}</div>
        </div>
        <div className="text-center py-8 text-gray-500">
          No hay datos disponibles
        </div>
      </div>
    );
  }

  return (
    <div className="financial-treemap-compact">
      <div className="treemap-header-compact">
        <div className="treemap-title-compact">{title}</div>
        <div className="treemap-datetime-compact">{dateTime}</div>
      </div>
      
      <div 
        className="treemap-grid-compact"
        style={getGridStyle()}
      >
        {data.map((item, index) => (
          <div
            key={`${title}-${item.ticker}-${index}`}
            className="treemap-block-compact"
            style={{
              backgroundColor: getColor(item.variation),
              cursor: 'pointer'
            }}
            title={`${item.ticker}: ${item.variation > 0 ? '+' : ''}${item.variation}%`}
          >
            <div className="block-ticker-compact">{item.ticker}</div>
            <div className={`block-variation-compact ${item.variation >= 0 ? 'positive' : 'negative'}`}>
              {item.variation > 0 ? '+' : ''}{item.variation.toFixed(2)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialTreemap;