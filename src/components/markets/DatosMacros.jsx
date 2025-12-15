// src/components/markets/DatosMacros.jsx
import React, { useState } from 'react';

export default function DatosMacros({ reserves, monetaryBase, moneySupply }) {
  const [tooltipVisible, setTooltipVisible] = useState(null);

  // Función para formatear números con decimales completos
  const formatNumber = (value, isUSD = false) => {
     if (!value || value === 0) return '--';
    
    // Convertir de millones a billones
    const valueInBillions = value / 1000;
    const symbol = isUSD ? 'USD' : 'ARS';
    
    // Formatear con 1 decimal máximo
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
      color: reserves?.change >= 0 
        ? 'linear-gradient(135deg, #06b6d4, #0891b2)' 
        : 'linear-gradient(135deg, #ef4444, #dc2626)',
      borderColor: reserves?.change >= 0 ? '#06b6d4' : '#ef4444',
      format: (val) => `${formatNumber(val, 3)}M`
    },
    {
      id: 'monetaryBase',
      label: 'Base Monetaria',
      value: monetaryBase?.value,
      change: monetaryBase?.change,
      icon: '💵',
      description: monetaryBase?.label || 'Circulación Monetaria',
      tooltip: 'Valor en millones de pesos. Dinero en circulación más reservas bancarias en el BCRA.',
      color: monetaryBase?.change >= 0 
        ? 'linear-gradient(135deg, #10b981, #059669)' 
        : 'linear-gradient(135deg, #ef4444, #dc2626)',
      borderColor: monetaryBase?.change >= 0 ? '#10b981' : '#ef4444',
      format: (val) => `${formatNumber(val, 6)}M`
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
      color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      borderColor: '#8b5cf6',
      format: (val) => `${formatNumber(val, 8)}M`
    }
  ];

  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
    marginTop: '24px'
  };

  return (
    <div style={containerStyle}>
      {indicators.map((indicator) => (
        <div 
          key={indicator.id} 
          style={{
            border: `1px solid ${indicator.borderColor}40`,
            background: `linear-gradient(135deg, rgba(17, 24, 39, 0.8), rgba(3, 7, 18, 0.8))`,
            borderRadius: '12px',
            padding: '20px',
            boxShadow: `0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px ${indicator.borderColor}20`,
            position: 'relative',
            overflow: 'visible'
          }}
        >
          {/* Efecto de brillo */}
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '4px',
            background: indicator.color,
            borderRadius: '12px 12px 0 0'
          }}></div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{
              padding: '12px',
              borderRadius: '10px',
              background: indicator.color,
              boxShadow: `0 8px 16px ${indicator.borderColor}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px'
            }}>
              <span style={{ fontSize: '24px' }}>{indicator.icon}</span>
            </div>
            <div>
              <h4 style={{
                fontWeight: '700',
                fontSize: '14px',
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '4px'
              }}>
                {indicator.label}
              </h4>
              <p style={{
                fontSize: '12px',
                color: 'rgba(156, 163, 175, 0.8)'
              }}>
                {indicator.description}
              </p>
            </div>
          </div>
          
          <div style={{ marginTop: '12px' }}>
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#ffffff',
              fontFamily: 'monospace',
              marginBottom: '12px',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {indicator.value ? indicator.format(indicator.value) : '--'}
            </div>
            
            {indicator.change !== undefined && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '999px',
                background: indicator.change >= 0 
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(5, 150, 105, 0.2))' 
                  : 'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(220, 38, 38, 0.2))',
                border: `1px solid ${indicator.change >= 0 ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)'}`,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}>
                <span style={{
                  color: indicator.change >= 0 ? '#10b981' : '#ef4444',
                  fontSize: '16px'
                }}>
                  {indicator.change > 0 ? '↗' : '↘'}
                </span>
                <span style={{
                  fontWeight: '600',
                  fontSize: '14px',
                  color: indicator.change >= 0 ? '#10b981' : '#ef4444'
                }}>
                  {Math.abs(indicator.change)}%
                </span>
              </div>
            )}
            
            {indicator.m3 && (
              <div style={{
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(75, 85, 99, 0.3)'
              }}>
                <div style={{
                  fontSize: '12px',
                  color: 'rgba(156, 163, 175, 0.8)',
                  marginBottom: '4px'
                }}>
                  M3
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#ffffff',
                  fontFamily: 'monospace',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {formatNumber(indicator.m3, 4)}M
                </div>
              </div>
            )}
          </div>
          
          {/* Tooltip con icono 💡 y texto explicativo */}
          {(indicator.value || indicator.m3) && (
           <div style={{
  position: 'absolute',
  top: '10px',
  right: '10px',
  background: '#0f172a',
  color: '#ffffff',  // Cambiado a blanco sólido
  padding: '4px 8px',
  borderRadius: '6px',
  fontSize: '11px',
  opacity: '1',  // Cambiado a 1 (100% opaco)
  cursor: 'help',
  border: '1px solid #374151',  // gris sólido en lugar de rgba
  zIndex: '10'
}}
            onMouseEnter={() => setTooltipVisible(indicator.id)}
            onMouseLeave={() => setTooltipVisible(null)}
            >
              💡
              
              {/* Tooltip flotante */}
              {tooltipVisible === indicator.id && (
               <div style={{
              position: 'absolute',
              top: '100%',
              right: '0',
              marginTop: '8px',
              width: '240px',
              background: '#0f172a',                  
              color: '#ffffff',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '12px',
              lineHeight: '1.4',
              border: '1px solid #374151',  // Cambiado a sólido
              boxShadow: '0 8px 24px #000000',  // Negro sólido
              zIndex: '1000',
            }}>
                  <div style={{
                    fontWeight: '600',
                    color: indicator.borderColor,
                    marginBottom: '6px',
                    fontSize: '13px'
                  }}>
                    📊 {indicator.label}
                  </div>
                  <div style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '8px'
                  }}>
                    {indicator.tooltip}
                  </div>
                  
                  {/* Información adicional específica */}
                  {indicator.id === 'reserves' && (
                    <div style={{
                      fontSize: '11px',
                      color: 'rgba(156, 163, 175, 0.8)',
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                      paddingTop: '8px',
                      marginTop: '8px'
                    }}>
                      <div>🏦 <strong>Importancia:</strong> Indicador clave de solvencia externa</div>
                      <div>📈 <strong>Meta:</strong> Reservas positivas y estables</div>
                    </div>
                  )}
                  
                  {indicator.id === 'monetaryBase' && (
                    <div style={{
                      fontSize: '11px',
                      color: 'rgba(156, 163, 175, 0.8)',
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                      paddingTop: '8px',
                      marginTop: '8px'
                    }}>
                      <div>💰 <strong>Componentes:</strong> Efectivo + reservas bancarias</div>
                      <div>⚖️ <strong>Control:</strong> Herramienta clave de política monetaria</div>
                    </div>
                  )}
                  
                  {indicator.id === 'm2' && (
                    <div style={{
                      fontSize: '11px',
                      color: 'rgba(156, 163, 175, 0.8)',
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                      paddingTop: '8px',
                      marginTop: '8px'
                    }}>
                      <div>📈 <strong>M2:</strong> Liquidez inmediata del sistema</div>
                      <div>📊 <strong>M3:</strong> Liquidez ampliada + inversiones</div>
                    </div>
                  )}
                  
                  {/* Triángulo del tooltip */}
                  <div style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '12px',
                    width: '12px',
                    height: '12px',
                    background: '#0f172a',
                    transform: 'rotate(45deg)',
                    borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                  }}></div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};