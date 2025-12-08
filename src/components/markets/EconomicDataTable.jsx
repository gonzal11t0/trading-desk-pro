// src/components/markets/EconomicDataTable.jsx
import React, { useState } from 'react';

const EconomicDataTable = ({ data }) => {
  const [tooltipVisible, setTooltipVisible] = useState(null);

  const indicators = [
    { 
      id: 'emae', 
      label: 'EMAE', 
      description: 'Estimador Mensual de Actividad Económica', 
      icon: '📈', 
      color: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
      tooltip: 'Índice mensual que estima la evolución de la actividad económica. Valores >100 indican crecimiento respecto al año base 2004.'
    },
    { 
      id: 'gdp', 
      label: 'PBI Trimestral', 
      description: 'Producto Bruto Interno', 
      icon: '💰', 
      color: 'linear-gradient(135deg, #10b981, #059669)',
      tooltip: 'Valor total de bienes y servicios producidos en un trimestre. Indicador principal del tamaño de la economía.'
    },
    { 
      id: 'construction', 
      label: 'Construcción (ISAC)', 
      description: 'Índice de la Construcción', 
      icon: '🏗️', 
      color: 'linear-gradient(135deg, #f59e0b, #d97706)',
      tooltip: 'Mide la actividad del sector construcción. Incluye obras públicas y privadas, cemento, hierro y mano de obra.'
    },
    { 
      id: 'automotive', 
      label: 'Producción Automotriz', 
      description: 'ADEFA', 
      icon: '🚗', 
      color: 'linear-gradient(135deg, #ef4444, #dc2626)',
      tooltip: 'Unidades de vehículos producidas mensualmente. Sector clave para exportaciones y empleo industrial.'
    },
    { 
      id: 'unemployment', 
      label: 'Desempleo Trimestral', 
      description: 'Tasa de desocupación', 
      icon: '📉', 
      color: 'linear-gradient(135deg, #f43f5e, #e11d48)',
      tooltip: 'Porcentaje de población económicamente activa que busca trabajo y no lo encuentra. Encuesta Permanente de Hogares (EPH).'
    },
    { 
      id: 'employment', 
      label: 'Tasa de Empleo', 
      description: 'Porcentaje de población ocupada', 
      icon: '👥', 
      color: 'linear-gradient(135deg, #84cc16, #16a34a)',
      tooltip: 'Porcentaje de población total que tiene trabajo. Incluye empleo formal, informal y cuentapropistas.'
    },
    { 
      id: 'wages', 
      label: 'Informe de Salarios', 
      description: 'Índice de Salarios', 
      icon: '💵', 
      color: 'linear-gradient(135deg, #eab308, #ca8a04)',
      tooltip: 'Variación mensual de salarios registrados. Mide el poder adquisitivo y presión inflacionaria por costos.'
    },
    { 
      id: 'tradeBalance', 
      label: 'Balanza Comercial', 
      description: 'Exportaciones - Importaciones', 
      icon: '⚖️', 
      color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      tooltip: 'Diferencia entre exportaciones e importaciones. Superávit (+) genera dólares, déficit (-) consume reservas.'
    },
    { 
      id: 'exports', 
      label: 'Exportaciones', 
      description: 'Mensual', 
      icon: '📤', 
      color: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
      tooltip: 'Valor FOB de bienes vendidos al exterior. Principal fuente de ingreso de divisas para el país.'
    },
    { 
      id: 'imports', 
      label: 'Importaciones', 
      description: 'Mensual', 
      icon: '📥', 
      color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      tooltip: 'Valor CIF de bienes comprados del exterior. Incluye insumos, bienes de capital y consumo.'
    },
  ];

  const containerStyle = {
    overflowX: 'auto',
    marginBottom: '32px',
    borderRadius: '12px',
    border: '1px solid rgba(75, 85, 99, 0.3)',
    background: 'linear-gradient(180deg, rgba(17, 24, 39, 0.5), rgba(3, 7, 18, 0.5))',
    backdropFilter: 'blur(10px)'
  };

  const tableStyle = {
    width: '100%',
    fontSize: '14px',
    borderCollapse: 'collapse'
  };

  const thStyle = {
    textAlign: 'left',
    padding: '16px 20px',
    fontWeight: '700',
    color: '#e5e7eb',
    borderBottom: '1px solid rgba(75, 85, 99, 0.3)',
    background: 'linear-gradient(90deg, rgba(17, 24, 39, 0.9), rgba(31, 41, 55, 0.9))'
  };

  const trHoverStyle = {
    background: 'linear-gradient(90deg, rgba(31, 41, 55, 0.3), rgba(17, 24, 39, 0.3))',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={containerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{...thStyle, background: 'linear-gradient(90deg, #0f172a, #1e293b)'}}>
              <span style={{
                background: 'linear-gradient(90deg, #67e8f9, #93c5fd)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Indicador
              </span>
            </th>
            <th style={thStyle}>
              <span style={{
                background: 'linear-gradient(90deg, #6ee7b7, #10b981)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Valor
              </span>
            </th>
            <th style={thStyle}>
              <span style={{
                background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Período
              </span>
            </th>
            <th style={thStyle}>
              <span style={{
                background: 'linear-gradient(90deg, #c4b5fd, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Var. Anual
              </span>
            </th>
            <th style={thStyle}>
              <span style={{
                background: 'linear-gradient(90deg, #fda4af, #f43f5e)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Tendencia
              </span>
            </th>
          </tr>
        </thead>
        <tbody style={{ borderTop: '1px solid rgba(75, 85, 99, 0.2)' }}>
          {indicators.map((indicator) => {
            const indicatorData = data?.find(d => d.id === indicator.id) || {};
            const isPositive = indicatorData.yoy >= 0;
            const trendColor = indicatorData.trend === 'up' 
              ? 'linear-gradient(135deg, #10b981, #059669)' 
              : indicatorData.trend === 'down' 
                ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
                : 'linear-gradient(135deg, #eab308, #ca8a04)';
            
            return (
              <tr 
                key={indicator.id} 
                style={{
                  borderBottom: '1px solid rgba(75, 85, 99, 0.15)',
                  ':hover': trHoverStyle
                }}
                onMouseEnter={() => setTooltipVisible(indicator.id)}
                onMouseLeave={() => setTooltipVisible(null)}
              >
                <td style={{ padding: '16px 20px', verticalAlign: 'middle', position: 'relative' }}>
                  {/* Tooltip para el indicador */}
                  {tooltipVisible === indicator.id && (
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: 'calc(100% + 15px)',
                      transform: 'translateY(-50%)',
                      width: '220px',
                      background: '#0f172a',
                      color: '#ffffff',
                      padding: '12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      lineHeight: '1.4',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                      zIndex: '1000',
                      pointerEvents: 'none'
                    }}>
                      <div style={{
                        fontWeight: '600',
                        color: indicator.color.split(' ')[1].replace(',', ''),
                        marginBottom: '6px',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <span>{indicator.icon}</span>
                        <span>{indicator.label}</span>
                      </div>
                      <div style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        marginBottom: '8px'
                      }}>
                        {indicator.tooltip}
                      </div>
                      
                      {/* Información adicional específica */}
                      {indicator.id === 'emae' && (
                        <div style={{
                          fontSize: '11px',
                          color: 'rgba(156, 163, 175, 0.8)',
                          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                          paddingTop: '8px',
                          marginTop: '8px'
                        }}>
                          <div>📊 <strong>Base:</strong> Año 2004 = 100</div>
                          <div>📈 <strong>Meta:</strong> Valores por encima de 100</div>
                        </div>
                      )}
                      
                      {indicator.id === 'gdp' && (
                        <div style={{
                          fontSize: '11px',
                          color: 'rgba(156, 163, 175, 0.8)',
                          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                          paddingTop: '8px',
                          marginTop: '8px'
                        }}>
                          <div>🌍 <strong>Comparación:</strong> PBI per cápita</div>
                          <div>📅 <strong>Frecuencia:</strong> Datos trimestrales</div>
                        </div>
                      )}
                      
                      {indicator.id === 'construction' && (
                        <div style={{
                          fontSize: '11px',
                          color: 'rgba(156, 163, 175, 0.8)',
                          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                          paddingTop: '8px',
                          marginTop: '8px'
                        }}>
                          <div>🏠 <strong>Componentes:</strong> Obras públicas y privadas</div>
                          <div>👷 <strong>Empleo:</strong> Alto impacto laboral</div>
                        </div>
                      )}
                      
                      {indicator.id === 'unemployment' && (
                        <div style={{
                          fontSize: '11px',
                          color: 'rgba(156, 163, 175, 0.8)',
                          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                          paddingTop: '8px',
                          marginTop: '8px'
                        }}>
                          <div>📋 <strong>Metodología:</strong> Encuesta Permanente de Hogares</div>
                          <div>🎯 <strong>Meta:</strong> Menor al 5% (pleno empleo)</div>
                        </div>
                      )}
                      
                      {indicator.id === 'tradeBalance' && (
                        <div style={{
                          fontSize: '11px',
                          color: 'rgba(156, 163, 175, 0.8)',
                          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                          paddingTop: '8px',
                          marginTop: '8px'
                        }}>
                          <div>💵 <strong>Divisas:</strong> Superávit = ingreso de dólares</div>
                          <div>📉 <strong>Riesgo:</strong> Déficit crónico agota reservas</div>
                        </div>
                      )}
                      
                      {/* Triángulo del tooltip */}
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '-6px',
                        transform: 'translateY(-50%) rotate(45deg)',
                        width: '12px',
                        height: '12px',
                        background: '#0f172a',
                        borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                      }}></div>
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      padding: '8px',
                      borderRadius: '8px',
                      background: indicator.color,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                      position: 'relative',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'help'
                    }}>
                      <span style={{ fontSize: '20px' }}>{indicator.icon}</span>
                    </div>
                    <div>
                      <div style={{
                        fontWeight: '700',
                        fontSize: '16px',
                        background: indicator.color,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '4px'
                      }}>
                        {indicator.label}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: 'rgba(156, 163, 175, 0.8)'
                      }}>
                        {indicator.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                  <span style={{
                    fontWeight: '700',
                    fontSize: '18px',
                    background: trendColor,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
                  }}>
                    {indicatorData.value || '--'}
                  </span>
                </td>
                <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                  <div style={{
                    color: '#d1d5db',
                    fontWeight: '500',
                    fontSize: '14px'
                  }}>
                    {indicatorData.period || '--'}
                  </div>
                </td>
                <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: isPositive 
                      ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.1))' 
                      : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.1))',
                    border: `1px solid ${isPositive ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)'}`,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}>
                    <span style={{
                      color: isPositive ? '#10b981' : '#ef4444',
                      fontSize: '14px'
                    }}>
                      {isPositive ? '↗' : '↘'}
                    </span>
                    <span style={{
                      fontWeight: '600',
                      fontSize: '14px',
                      color: isPositive ? '#10b981' : '#ef4444'
                    }}>
                      {indicatorData.yoy ? `${indicatorData.yoy > 0 ? '+' : ''}${indicatorData.yoy}%` : '--'}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                  <div style={{
                    fontSize: '28px',
                    background: trendColor,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))'
                  }}>
                    {indicatorData.trend === 'up' ? '📈' : indicatorData.trend === 'down' ? '📉' : '➡️'}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EconomicDataTable;