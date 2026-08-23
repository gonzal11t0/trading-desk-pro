import React, { useState } from 'react';

export default function DatosMacros({ reserves, monetaryBase, moneySupply }) {
  const [tooltipVisible, setTooltipVisible] = useState(null);

  const formatNumber = (value, isUSD = false) => {
    if (!value || value === 0) return '--';
    
    const valueInBillions = value / 1000;
    const symbol = isUSD ? 'USD' : 'ARS';
    
    const formatted = valueInBillions.toLocaleString('es-AR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    });
    
    return `${symbol} ${formatted}B`;
  };

  const indicators = [
    {
      id: 'reserves',
      label: 'Reservas BCRA',
      value: reserves?.value,
      change: reserves?.change,
      icon: '🏦',
      description: reserves?.label || 'Reservas Internacionales',
      tooltip: 'Valor en millones de dólares. Representa las reservas internacionales brutas del Banco Central.',
      positiveClass: 'from-cyan-500 to-blue-600',
      negativeClass: 'from-red-500 to-red-600',
      bgPositive: 'bg-gradient-to-br from-cyan-500/20 to-blue-600/10',
      bgNegative: 'bg-gradient-to-br from-red-500/20 to-red-600/10',
      format: (val) => `${formatNumber(val, true)}`
    },
    {
      id: 'monetaryBase',
      label: 'Base Monetaria',
      value: monetaryBase?.value,
      change: monetaryBase?.change,
      icon: '💵',
      description: monetaryBase?.label || 'Circulación Monetaria',
      tooltip: 'Valor en millones de pesos. Dinero en circulación más reservas bancarias en el BCRA.',
      positiveClass: 'from-green-500 to-emerald-600',
      negativeClass: 'from-red-500 to-red-600',
      bgPositive: 'bg-gradient-to-br from-green-500/20 to-emerald-600/10',
      bgNegative: 'bg-gradient-to-br from-red-500/20 to-red-600/10',
      format: (val) => `${formatNumber(val, false)}`
    },
    {
      id: 'm2',
      label: 'Oferta Monetaria(M2)',
      value: moneySupply?.m2,
      m3: moneySupply?.m3,
      change: 0,
      icon: '📊',
      description: moneySupply?.label || 'Agregados Monetarios',
      tooltip: 'M2: Efectivo + depósitos. M3: M2 + instrumentos de inversión líquidos.',
      positiveClass: 'from-purple-500 to-violet-600',
      negativeClass: 'from-red-500 to-red-600',
      bgPositive: 'bg-gradient-to-br from-purple-500/20 to-violet-600/10',
      bgNegative: 'bg-gradient-to-br from-red-500/20 to-red-600/10',
      format: (val) => `${formatNumber(val, false)}`
    }
  ];

  return (
    <div className="w-full min-w-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6">
      {indicators.map((indicator) => {
        const hasChange = Number.isFinite(indicator.change);
        const isPositive = hasChange ? indicator.change >= 0 : true;
        const hasValue = indicator.value || indicator.m3;
        
        return (
          <div 
            key={indicator.id} 
            className="w-full min-w-0 relative overflow-visible bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-xl p-5 border border-gray-700/50 shadow-xl"
          >
            {/* Top border effect */}
            <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-gradient-to-r ${isPositive ? indicator.positiveClass : indicator.negativeClass}`}></div>
            
            {/* Icon and Title */}
            <div className="flex items-center gap-4 mb-5">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${isPositive ? indicator.positiveClass : indicator.negativeClass} shadow-lg flex items-center justify-center w-12 h-12`}>
                <span className="text-2xl">{indicator.icon}</span>
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-white text-sm uppercase tracking-wider truncate">
                  {indicator.label}
                </h4>
                <p className="text-gray-400 text-xs mt-1 truncate">
                  {indicator.description}
                </p>
              </div>
            </div>
            
            {/* Value and Change */}
            <div className="mt-3">
              <div className="text-2xl font-bold text-white font-mono truncate mb-3 text-shadow">
                {indicator.value ? indicator.format(indicator.value) : '--'}
              </div>
              
              {hasChange && (
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isPositive ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                  <span className={`text-lg ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? '↗' : '↘'}
                  </span>
                  <span className={`font-semibold text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {Math.abs(indicator.change)}%
                  </span>
                </div>
              )}
              
              {/* M3 Value (for money supply) */}
              {indicator.m3 && (
                <div className="mt-5 pt-4 border-t border-gray-700/30">
                  <div className="text-gray-400 text-xs mb-1">
                    M3
                  </div>
                  <div className="text-lg font-semibold text-white font-mono truncate">
                    {formatNumber(indicator.m3, false)}
                  </div>
                </div>
              )}
            </div>
            
            {/* Tooltip */}
            {hasValue && (
              <div 
                className="absolute top-3 right-3 bg-gray-900 text-white p-1.5 rounded-md text-xs cursor-help border border-gray-700 z-10"
                onMouseEnter={() => setTooltipVisible(indicator.id)}
                onMouseLeave={() => setTooltipVisible(null)}
              >
                💡
                
                {tooltipVisible === indicator.id && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-gray-900 text-white p-4 rounded-lg text-xs leading-relaxed border border-gray-700 shadow-2xl z-50">
                    <div className={`font-semibold text-sm mb-2 ${isPositive ? 'text-cyan-400' : 'text-red-400'}`}>
                      📊 {indicator.label}
                    </div>
                    <div className="text-gray-300 mb-3">
                      {indicator.tooltip}
                    </div>
                    
                    {/* Additional info based on indicator */}
                    {indicator.id === 'reserves' && (
                      <div className="text-gray-400 text-xs border-t border-gray-700 pt-3 mt-3">
                        <div className="flex items-center gap-1 mb-1">
                          <span>🏦</span>
                          <span><strong>Importancia:</strong> Indicador clave de solvencia externa</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>📈</span>
                          <span><strong>Meta:</strong> Reservas positivas y estables</span>
                        </div>
                      </div>
                    )}
                    
                    {indicator.id === 'monetaryBase' && (
                      <div className="text-gray-400 text-xs border-t border-gray-700 pt-3 mt-3">
                        <div className="flex items-center gap-1 mb-1">
                          <span>💰</span>
                          <span><strong>Componentes:</strong> Efectivo + reservas bancarias</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>⚖️</span>
                          <span><strong>Control:</strong> Herramienta clave de política monetaria</span>
                        </div>
                      </div>
                    )}
                    
                    {indicator.id === 'm2' && (
                      <div className="text-gray-400 text-xs border-t border-gray-700 pt-3 mt-3">
                        <div className="flex items-center gap-1 mb-1">
                          <span>📈</span>
                          <span><strong>M2:</strong> Liquidez inmediata del sistema</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>📊</span>
                          <span><strong>M3:</strong> Liquidez ampliada + inversiones</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Tooltip arrow */}
                    <div className="absolute -top-1.5 right-3 w-3 h-3 bg-gray-900 transform rotate-45 border-l border-t border-gray-700"></div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
