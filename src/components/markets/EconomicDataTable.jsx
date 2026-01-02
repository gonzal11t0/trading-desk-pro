// src/components/markets/EconomicDataTable.jsx
import React, { useState } from 'react';

const EconomicDataTable = ({ data }) => {
  const [tooltipVisible, setTooltipVisible] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'label', direction: 'asc' });

  // IDs de indicadores que YA están en DatosMacros (NO mostrar en tabla)
  const EXCLUDED_IDS = [1, 15, 109]; // Reservas, Base Monetaria, M2

  // Configuración SOLO de indicadores complementarios (9 en total)
  
  const bcraIndicatorsConfig = [
    
    // ENCAJES BANCARIOS (3)
    { 
      
      id: 35, 
      key: 'encajes_totales',
      label: 'Encajes Totales', 
      description: 'Fondos inmovilizados en BCRA', 
      icon: '🏦', 
      color: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      tooltip: 'Total de encajes del sistema financiero. Fondos que los bancos deben mantener en el BCRA.',
      unit: 'ARS',
      
      format: (val) => {
        if (!val || val === 0) return 'ARS 0,0B';
        const billions = val / 1000; // Convertir millones a billones
        return `ARS ${billions.toFixed(1).replace('.', ',')}B`;
      },
      category: 'Encajes'
      
    },
    { 
      id: 36, 
      key: 'encajes_pesos',
      label: 'Encajes en Pesos', 
      description: 'Encajes moneda nacional', 
      icon: '💰', 
      color: 'linear-gradient(135deg, #10b981, #059669)',
      tooltip: 'Encajes en moneda nacional. Afectan la liquidez en pesos del sistema bancario.',
      unit: 'ARS',
      format: (val) => {
        if (!val || val === 0) return 'ARS 0,0B';
        const billions = val / 1000;
        return `ARS ${billions.toFixed(1).replace('.', ',')}B`;
      },
      category: 'Encajes'
    },
    { 
      id: 37, 
      key: 'encajes_dolares',
      label: 'Encajes en Dólares', 
      description: 'Encajes moneda extranjera', 
      icon: '💵', 
      color: 'linear-gradient(135deg, #f59e0b, #d97706)',
      tooltip: 'Encajes en moneda extranjera. Reflejan dólares inmovilizados en el BCRA.',
      unit: 'USD',
      format: (val) => {
        if (!val || val === 0) return 'USD 0,0B';
        const billions = val / 1000;
        return `USD ${billions.toFixed(1).replace('.', ',')}B`;
      },
      category: 'Encajes'
    },
    
    // TASAS DE INTERÉS (3)
    { 
      id: 26, 
      key: 'tasa_politica',
      label: 'Tasa Política', 
      description: 'Tasa de referencia BCRA', 
      icon: '📊', 
      color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      tooltip: 'Tasa de política monetaria. Principal herramienta del BCRA para controlar inflación.',
      unit: '%',
      format: (val) => {
        if (!val && val !== 0) return '--%';
        // Validar tasa razonable
        if (val > 1000 || val < 0) return 'Error dato';
        return `${val.toFixed(2).replace('.', ',')}%`;
      },
      category: 'Tasas'
    },
    { 
      id: 28, 
      key: 'badlar',
      label: 'BADLAR', 
      description: 'Tasa préstamos grandes', 
      icon: '💸', 
      color: 'linear-gradient(135deg, #ec4899, #db2777)',
      tooltip: 'Tasa de préstamos a grandes deudores del sistema bancario.',
      unit: '%',
      format: (val) => {
        if (!val && val !== 0) return '--%';
        if (val > 1000 || val < 0) return 'Error dato';
        return `${val.toFixed(2).replace('.', ',')}%`;
      },
      category: 'Tasas'
    },
    { 
      id: 29, 
      key: 'tm20',
      label: 'TM20', 
      description: 'Tasa media préstamos', 
      icon: '📈', 
      color: 'linear-gradient(135deg, #06b6d4, #0891b2)',
      tooltip: 'Tasa media de préstamos del sistema bancario.',
      unit: '%',
      format: (val) => {
        if (!val && val !== 0) return '--%';
        if (val > 1000 || val < 0) return 'Error dato';
        return `${val.toFixed(2).replace('.', ',')}%`;
      },
      category: 'Tasas'
    },
    
    // INSTRUMENTOS FINANCIEROS (3)
    { 
      id: 40, 
      key: 'cer',
      label: 'CER', 
      description: 'Coeficiente Estabilización', 
      icon: '📉', 
      color: 'linear-gradient(135deg, #f43f5e, #e11d48)',
      tooltip: 'Coeficiente de Estabilización de Referencia. Usado para ajuste por inflación.',
      unit: 'Índice',
      format: (val) => {
        if (!val && val !== 0) return '--';
        return val.toFixed(4).replace('.', ',');
      },
      category: 'Instrumentos'
    },
    { 
      id: 41, 
      key: 'uva',
      label: 'UVA', 
      description: 'Unidad Valor Adquisitivo', 
      icon: '🏠', 
      color: 'linear-gradient(135deg, #84cc16, #16a34a)',
      tooltip: 'Unidad de Valor Adquisitivo. Para créditos hipotecarios ajustados por inflación.',
      unit: 'Índice',
      format: (val) => {
        if (!val && val !== 0) return '--';
        return val.toFixed(2).replace('.', ',');
      },
      category: 'Instrumentos'
    },
    { 
      id: 42, 
      key: 'uvi',
      label: 'UVI', 
      description: 'Unidad de Vivienda', 
      icon: '🏘️', 
      color: 'linear-gradient(135deg, #eab308, #ca8a04)',
      tooltip: 'Unidad de Vivienda. Para créditos de vivienda del Banco Nación.',
      unit: 'Índice',
      format: (val) => {
        if (!val && val !== 0) return '--';
        if (val >= 1000) {
          return val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, '.').replace('.', ',');
        }
        return val.toFixed(2).replace('.', ',');
      },
      category: 'Instrumentos'
    }
  ];

  // Filtrar datos recibidos para excluir los IDs duplicados
  const realData = (data || []).filter(item => !EXCLUDED_IDS.includes(item.idVariable));

  // Mapear los datos reales con la configuración
  const indicators = bcraIndicatorsConfig.map(config => {
    // Buscar este indicador en los datos reales por idVariable
    const realIndicator = realData.find(item => item.idVariable === config.id);
    
    // Si no encontramos por idVariable, buscar por key
    const indicatorData = realIndicator || realData.find(item => item.id === config.key);
    
    // Determinar tendencia basada en el cambio
    const change = indicatorData?.change || 0;
    const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'stable';
    
    // Formatear el valor
    let formattedValue = '--';
    let rawValue = null;
    
    if (indicatorData) {
      rawValue = indicatorData.rawValue;
      if (config.format && rawValue !== undefined && rawValue !== null) {
        formattedValue = config.format(rawValue);
      } else if (indicatorData.value) {
        formattedValue = indicatorData.value;
      }
    }
    
    return {
      id: config.key,
      label: config.label,
      description: config.description,
      icon: config.icon,
      color: config.color,
      tooltip: config.tooltip,
      category: config.category,
      value: formattedValue,
      rawValue: rawValue,
      period: indicatorData?.date ? new Date(indicatorData.date).toLocaleDateString('es-AR') : 'Actual',
      yoy: change,
      trend: trend,
      unit: config.unit,
      source: indicatorData?.source || 'BCRA',
      hasRealData: !!indicatorData,
      idVariable: config.id
    };
  });

  // Función para ordenar
  const sortedIndicators = [...indicators].sort((a, b) => {
    if (sortConfig.key === 'label') {
      return sortConfig.direction === 'asc' 
        ? a.label.localeCompare(b.label)
        : b.label.localeCompare(a.label);
    }
    if (sortConfig.key === 'category') {
      return sortConfig.direction === 'asc'
        ? a.category.localeCompare(b.category)
        : b.category.localeCompare(a.category);
    }
    return 0;
  });

  // Función para manejar clic en header
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Estilos
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
    borderCollapse: 'collapse',
    minWidth: '800px'
  };

  const thStyle = {
    textAlign: 'left',
    padding: '16px 20px',
    fontWeight: '700',
    color: '#e5e7eb',
    borderBottom: '1px solid rgba(75, 85, 99, 0.3)',
    background: 'linear-gradient(90deg, rgba(17, 24, 39, 0.9), rgba(31, 41, 55, 0.9))',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'all 0.2s ease'
  };

  const thHoverStyle = {
    background: 'linear-gradient(90deg, rgba(31, 41, 55, 0.95), rgba(55, 65, 81, 0.9))'
  };

  const trHoverStyle = {
    background: 'linear-gradient(90deg, rgba(31, 41, 55, 0.3), rgba(17, 24, 39, 0.3))',
    transition: 'all 0.3s ease'
  };

  // Contar indicadores por categoría
  const encajesCount = indicators.filter(i => i.category === 'Encajes').length;
  const tasasCount = indicators.filter(i => i.category === 'Tasas').length;
  const instrumentosCount = indicators.filter(i => i.category === 'Instrumentos').length;

  return (
    <div style={containerStyle}>
      {/* Encabezado con filtros */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid rgba(6, 182, 212, 0.3)',
        background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.1), rgba(139, 92, 246, 0.1))',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '20px' }}>🏦</span>
          <div>
            <div style={{ 
              fontWeight: '600', 
              color: '#67e8f9',
              fontSize: '16px'
            }}>
              Datos BCRA - Indicadores Complementarios
            </div>
            <div style={{
              fontSize: '12px',
              color: 'rgba(156, 163, 175, 0.8)',
              marginTop: '2px'
            }}>
              {realData.length} indicadores • Actualizado: {new Date().toLocaleDateString('es-AR')}
            </div>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            fontSize: '12px',
            padding: '6px 12px',
            background: 'rgba(31, 41, 55, 0.5)',
            borderRadius: '20px',
            border: '1px solid rgba(75, 85, 99, 0.3)',
            color: '#9ca3af'
          }}>
            <span style={{ color: '#3b82f6', fontWeight: '500' }}>Encajes:</span> {encajesCount}
          </div>
          <div style={{
            fontSize: '12px',
            padding: '6px 12px',
            background: 'rgba(31, 41, 55, 0.5)',
            borderRadius: '20px',
            border: '1px solid rgba(75, 85, 99, 0.3)',
            color: '#9ca3af'
          }}>
            <span style={{ color: '#8b5cf6', fontWeight: '500' }}>Tasas:</span> {tasasCount}
          </div>
          <div style={{
            fontSize: '12px',
            padding: '6px 12px',
            background: 'rgba(31, 41, 55, 0.5)',
            borderRadius: '20px',
            border: '1px solid rgba(75, 85, 99, 0.3)',
            color: '#9ca3af'
          }}>
            <span style={{ color: '#84cc16', fontWeight: '500' }}>Instrumentos:</span> {instrumentosCount}
          </div>
        </div>
      </div>
      
      <table style={tableStyle}>
        <thead>
          <tr>
            <th 
              style={{...thStyle, width: '30%'}}
              onClick={() => handleSort('label')}
              onMouseEnter={(e) => e.currentTarget.style.background = thHoverStyle.background}
              onMouseLeave={(e) => e.currentTarget.style.background = thStyle.background}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  background: 'linear-gradient(90deg, #67e8f9, #93c5fd)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Indicador
                </span>
                {sortConfig.key === 'label' && (
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </th>
            <th 
              style={thStyle}
              onClick={() => handleSort('category')}
              onMouseEnter={(e) => e.currentTarget.style.background = thHoverStyle.background}
              onMouseLeave={(e) => e.currentTarget.style.background = thStyle.background}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  background: 'linear-gradient(90deg, #6ee7b7, #10b981)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Categoría
                </span>
                {sortConfig.key === 'category' && (
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </th>
            <th style={thStyle}>
              <span style={{
                background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Valor
              </span>
            </th>
            <th style={thStyle}>
              <span style={{
                background: 'linear-gradient(90deg, #c4b5fd, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Última actualización
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
          {sortedIndicators.map((indicator) => {
            const isPositive = indicator.yoy >= 0;
            const trendColor = indicator.trend === 'up' 
              ? 'linear-gradient(135deg, #10b981, #059669)' 
              : indicator.trend === 'down' 
                ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
                : 'linear-gradient(135deg, #eab308, #ca8a04)';
            
            // Color de categoría
            const categoryColor = indicator.category === 'Encajes' ? '#3b82f6' :
                                 indicator.category === 'Tasas' ? '#8b5cf6' :
                                 indicator.category === 'Instrumentos' ? '#84cc16' : '#9ca3af';
            
            return (
              <tr 
                key={indicator.id} 
                style={{
                  borderBottom: '1px solid rgba(75, 85, 99, 0.15)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = trHoverStyle.background}
                onMouseLeave={(e) => e.currentTarget.style.background = ''}
                onMouseOver={() => setTooltipVisible(indicator.id)}
                onMouseOut={() => setTooltipVisible(null)}
              >
                <td style={{ padding: '16px 20px', verticalAlign: 'middle', position: 'relative' }}>
                  {/* Tooltip */}
                  {tooltipVisible === indicator.id && (
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: 'calc(100% + 15px)',
                      transform: 'translateY(-50%)',
                      width: '260px',
                      background: '#0f172a',
                      color: '#ffffff',
                      padding: '14px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      lineHeight: '1.5',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
                      zIndex: '1000',
                      pointerEvents: 'none'
                    }}>
                      <div style={{
                        fontWeight: '600',
                        color: indicator.color.split(' ')[1].replace(',', ''),
                        marginBottom: '8px',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span>{indicator.icon}</span>
                        <span>{indicator.label}</span>
                      </div>
                      <div style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        marginBottom: '12px',
                        lineHeight: '1.6'
                      }}>
                        {indicator.tooltip}
                      </div>
                      
                      <div style={{
                        fontSize: '11px',
                        color: 'rgba(156, 163, 175, 0.8)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        paddingTop: '10px',
                        marginTop: '10px',
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}>
                        <div>
                          <div>📊 <strong>Unidad:</strong> {indicator.unit}</div>
                          <div>🏷️ <strong>Categoría:</strong> {indicator.category}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div>🔄 <strong>Fuente:</strong> BCRA v4.0</div>
                          <div>📅 <strong>ID Variable:</strong> {indicator.idVariable}</div>
                        </div>
                      </div>
                      
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
                      padding: '10px',
                      borderRadius: '10px',
                      background: indicator.color,
                      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)',
                      position: 'relative',
                      width: '44px',
                      height: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'help'
                    }}>
                      <span style={{ fontSize: '22px' }}>{indicator.icon}</span>
                      {!indicator.hasRealData && (
                        <div style={{
                          position: 'absolute',
                          top: '-4px',
                          right: '-4px',
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: '#f59e0b',
                          border: '2px solid #0f172a'
                        }}></div>
                      )}
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
                        color: 'rgba(156, 163, 175, 0.8)',
                        marginBottom: '2px'
                      }}>
                        {indicator.description}
                      </div>
                      {indicator.hasRealData ? (
                        <div style={{
                          fontSize: '10px',
                          color: 'rgba(6, 182, 212, 0.7)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <span>✅</span>
                          <span>Datos en tiempo real</span>
                        </div>
                      ) : (
                        <div style={{
                          fontSize: '10px',
                          color: 'rgba(245, 158, 11, 0.7)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <span>⚠️</span>
                          <span>Datos de ejemplo</span>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                
                {/* Categoría */}
                <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    background: `rgba(${parseInt(categoryColor.slice(1, 3), 16)}, ${parseInt(categoryColor.slice(3, 5), 16)}, ${parseInt(categoryColor.slice(5, 7), 16)}, 0.1)`,
                    border: `1px solid ${categoryColor}40`,
                    color: categoryColor,
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: categoryColor
                    }}></div>
                    {indicator.category}
                  </div>
                </td>
                
                {/* Valor */}
                <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                  <span style={{
                    fontWeight: '700',
                    fontSize: '18px',
                    color: indicator.hasRealData ? '#ffffff' : '#9ca3af',
                    filter: indicator.hasRealData ? 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))' : 'none'
                  }}>
                    {indicator.value}
                  </span>
                </td>
                
                {/* Última actualización */}
                <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                  <div style={{
                    color: '#d1d5db',
                    fontWeight: '500',
                    fontSize: '14px'
                  }}>
                    {indicator.period}
                  </div>
                </td>
                
                {/* Tendencia */}
                <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      background: isPositive 
                        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.1))' 
                        : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.1))',
                      border: `1px solid ${isPositive ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)'}`,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                    }}>
                      <span style={{
                        color: isPositive ? '#10b981' : '#ef4444',
                        fontSize: '16px'
                      }}>
                        {isPositive ? '↗' : '↘'}
                      </span>
                      <span style={{
                        fontWeight: '600',
                        fontSize: '14px',
                        color: isPositive ? '#10b981' : '#ef4444'
                      }}>
                        {indicator.yoy !== 0 ? `${indicator.yoy > 0 ? '+' : ''}${indicator.yoy}%` : '0%'}
                      </span>
                    </div>
                    
                    <div style={{
                      fontSize: '28px',
                      background: trendColor,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))'
                    }}>
                      {indicator.trend === 'up' ? '📈' : indicator.trend === 'down' ? '📉' : '➡️'}
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {/* Footer de la tabla */}
      <div style={{
        padding: '12px 20px',
        borderTop: '1px solid rgba(75, 85, 99, 0.2)',
        background: 'rgba(17, 24, 39, 0.3)',
        fontSize: '12px',
        color: 'rgba(156, 163, 175, 0.7)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div>
          <span>📋</span>
          <span style={{ marginLeft: '6px' }}>
            Mostrando {sortedIndicators.length} indicadores complementarios del BCRA
          </span>
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#10b981' }}></div>
            <span>Tendencia positiva</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#ef4444' }}></div>
            <span>Tendencia negativa</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#f59e0b' }}></div>
            <span>Datos de ejemplo</span>
          </div>
        </div>
      </div>
      
      {/* Nota informativa */}
      <div style={{
        padding: '8px 20px',
        background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.05), rgba(139, 92, 246, 0.05))',
        borderTop: '1px solid rgba(6, 182, 212, 0.1)',
        fontSize: '11px',
        color: 'rgba(156, 163, 175, 0.6)',
        textAlign: 'center'
      }}>
        <span>💡</span>
        <span style={{ marginLeft: '6px' }}>
          Los indicadores monetarios principales (Reservas, Base Monetaria, M2) se muestran en el bloque superior
        </span>
      </div>
    </div>
  );
};

export default EconomicDataTable;