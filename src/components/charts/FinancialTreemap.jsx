/* financialTreemap*/
import React, { useMemo, useCallback } from 'react';
import './FinancialTreemap.css';

const TreemapBlock = React.memo(({ item, getColor, onClick }) => {
  const variationFormatted = `${item.variation > 0 ? '+' : ''}${item.variation.toFixed(2)}%`;
  
  return (
    <div
      className="treemap-block-compact"
      style={{ backgroundColor: getColor(item.variation) }}
      title={`${item.ticker}: ${variationFormatted}`}
      onClick={() => onClick?.(item)}
    >
      <div className="block-ticker-compact">{item.ticker}</div>
      <div className={`block-variation-compact ${item.variation >= 0 ? 'positive' : 'negative'}`}>
        {variationFormatted}
      </div>
    </div>
  );
});

const FinancialTreemap = ({ 
  data = [], 
  title = "PANEL", 
  dateTime = "",
  columns = 4,
  className = "",
  onBlockClick
}) => {
  const getColor = useCallback((variation) => {
    if (variation > 2) return '#00ff00';
    if (variation > 0.5) return '#90ee90';
    if (variation < -2) return '#ff0000';
    if (variation < -0.5) return '#ff6b6b';
    if (variation > 0) return '#4169e1';
    return '#2c3e50';
  }, []);

  const gridStyle = useMemo(() => {
    if (data.length === 0) return {};
    const rows = Math.ceil(data.length / columns);
    return {
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, 1fr)`,
      height: `${rows * 70}px`,
      gap: '5px'
    };
  }, [data.length, columns]);

  // No data state
  if (data.length === 0) {
    return (
      <div className={`financial-treemap-compact ${className}`}>
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
    <div className={`financial-treemap-compact ${className}`}>
      <div className="treemap-header-compact">
        <div className="treemap-title-compact">{title}</div>
        <div className="treemap-datetime-compact">{dateTime}</div>
      </div>
      
      <div 
        className="treemap-grid-compact"
        style={gridStyle}
      >
        {data.map((item, index) => (
          <TreemapBlock
            key={item.id || `${title}-${item.ticker}-${index}`}
            item={item}
            getColor={getColor}
            onClick={onBlockClick}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(FinancialTreemap);