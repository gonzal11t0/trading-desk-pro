import React, { useMemo } from 'react';

const TreemapBlock = React.memo(({ item, onClick }) => {
  const variationFormatted = `${item.variation > 0 ? '+' : ''}${item.variation.toFixed(2)}%`;
  
  const colorClass = useMemo(() => {
    if (item.variation > 2) return 'bg-gradient-to-br from-green-600 to-green-700';
    if (item.variation > 0.5) return 'bg-gradient-to-br from-green-500/90 to-green-600/90';
    if (item.variation < -2) return 'bg-gradient-to-br from-red-600 to-red-700';
    if (item.variation < -0.5) return 'bg-gradient-to-br from-red-500/90 to-red-600/90';
    if (item.variation > 0) return 'bg-gradient-to-br from-blue-600/90 to-blue-700/90';
    return 'bg-gradient-to-br from-gray-700 to-gray-800';
  }, [item.variation]);

  const textColorClass = useMemo(() => {
    if (item.variation > 2) return 'text-green-100';
    if (item.variation > 0.5) return 'text-green-100';
    if (item.variation < -2) return 'text-red-100';
    if (item.variation < -0.5) return 'text-red-100';
    if (item.variation > 0) return 'text-blue-100';
    return 'text-gray-300';
  }, [item.variation]);

  const variationColorClass = useMemo(() => {
    if (item.variation >= 0) return 'text-green-300 font-semibold';
    return 'text-red-300 font-semibold';
  }, [item.variation]);

  return (
    <div
      className={`min-w-0 flex flex-col justify-center items-center p-3 md:p-4 rounded-lg 
                 cursor-pointer transition-all duration-200 hover:scale-[1.02] 
                 hover:shadow-xl hover:brightness-110 active:scale-[0.98] ${colorClass}`}
      title={`${item.ticker}: ${variationFormatted}`}
      onClick={() => onClick?.(item)}
    >
      <div className={`text-lg md:text-xl font-bold truncate w-full text-center ${textColorClass}`}>
        {item.ticker}
      </div>
      <div className={`text-sm md:text-base mt-1 ${variationColorClass}`}>
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
  const gridStyle = useMemo(() => {
    if (data.length === 0) return {};
    const rows = Math.ceil(data.length / columns);
    return {
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, 1fr)`,
      gap: '0.75rem'
    };
  }, [data.length, columns]);

  if (data.length === 0) {
    return (
      <div className={`min-w-0 ${className}`}>
        <div className="mb-6 pb-4 border-b border-gray-700/50">
          <div className="text-xl md:text-2xl font-bold text-white mb-2">
            {title}
          </div>
          <div className="text-sm md:text-base text-gray-400">{dateTime}</div>
        </div>
        <div className="text-center py-12 text-gray-500 text-lg">
          No hay datos disponibles
        </div>
      </div>
    );
  }

  return (
    <div className={`min-w-0 ${className}`}>
      <div className="mb-6 pb-4 border-b border-gray-700/50">
        <div className="text-xl md:text-2xl font-bold text-white mb-2 truncate">
          {title}
        </div>
        <div className="text-sm md:text-base text-gray-400">{dateTime}</div>
      </div>
      
      <div 
        className="grid gap-3 md:gap-4"
        style={gridStyle}
      >
        {data.map((item, index) => (
          <TreemapBlock
            key={item.id || `${title}-${item.ticker}-${index}`}
            item={item}
            onClick={onBlockClick}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(FinancialTreemap);