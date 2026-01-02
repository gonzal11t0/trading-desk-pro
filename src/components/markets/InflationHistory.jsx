// src/components/markets/InflationHistory.jsx - VERSIÓN CON ESTILOS INLINE
import React, { useState, useEffect } from 'react';
import { inflationApi } from '../../api/inflationApi';

const InflationHistory = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistoricalData = async () => {
    try {
      setLoading(true);
      const data = await inflationApi.getLastMonthsInflation(9);
      setHistoricalData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoricalData();
    const interval = setInterval(fetchHistoricalData, 3600000);
    return () => clearInterval(interval);
  }, []);




  // Determinar estilos inline para valor
  const getValueStyles = (currentMonth, index) => {
    const changeValue = currentMonth.change?.monthly;
    
    // Estilos base
    const baseStyles = {
      fontSize: '1.1rem',
      fontWeight: '700',
      letterSpacing: '-0.025em'
    };
    
    if (!changeValue || changeValue === "0.0" || index === historicalData.length - 1) {
      return { ...baseStyles, color: '#d1d5db' }; // gris
    }
    
    const change = parseFloat(changeValue);
    if (change > 0) {
      return { ...baseStyles, color: '#f87171' }; // rojo
    } else {
      return { ...baseStyles, color: '#34d399' }; // verde
    }
  };

  // Estilos inline para flecha
  const getArrowStyles = (changeValue) => {
    const baseStyles = {
      fontSize: '0.875rem',
      fontWeight: '600'
    };
    
    if (!changeValue || changeValue === "0.0") {
      return { ...baseStyles, color: '#6b7280', display: 'none' }; // gris, oculto
    }
    
    const change = parseFloat(changeValue);
    if (change > 0) {
      return { ...baseStyles, color: '#f87171' }; // rojo
    } else {
      return { ...baseStyles, color: '#34d399' }; // verde
    }
  };

  // Obtener flecha
  const getArrow = (changeValue) => {
    if (!changeValue || changeValue === "0.0") return '';
    const change = parseFloat(changeValue);
    return change > 0 ? '↗' : '↘';
  };

  if (loading) {
    return (
      <div style={{
        backgroundColor: 'rgb(26, 26, 26)',
        border: '1px solid #374151',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        fontFamily: 'monospace'
      }}>
        <div style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '1rem' }}>
          CARGANDO DATOS DE INFLACIÓN...
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
            <div key={i} style={{
              height: '2rem',
              backgroundColor: 'rgb(26, 26, 26)',
              borderRadius: '0.25rem',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !historicalData.length) {
    return (
      <div style={{
        backgroundColor: 'rgb(26, 26, 26)',
        border: '1px solid #7f1d1d',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        fontFamily: 'monospace'
      }}>
        <div style={{ color: '#f87171', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
          ERROR DE CONEXIÓN
        </div>
        <div style={{ color: '#9ca3af', marginBottom: '1rem' }}>
          {error || 'No se pudieron cargar los datos'}
        </div>
        <button
          onClick={fetchHistoricalData}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'rgb(26, 26, 26)',
            color: '#d1d5db',
            border: '1px solid #374151',
            borderRadius: '0.25rem',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgb(26, 26, 26)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'rgb(26, 26, 26)'}
        >
          REINTENTAR
        </button>
      </div>
    );
  }

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[date.getMonth()] + ' ' + date.getFullYear();
  };

  return (
    <div style={{
      backgroundColor: 'rgb(26, 26, 26)',
      border: '1px solid #374151',
      borderRadius: '0.75rem',
      overflow: 'hidden',
      fontFamily: 'monospace'
    }}>
      {/* Header */}
      <div style={{
        borderBottom: '1px solid #374151',
        padding: '1.5rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{
              color: '#fff',
              fontSize: '1.5rem',
              fontWeight: '700',
              letterSpacing: '-0.025em'
            }}>
              INFLACIÓN
            </div>
            
          </div>

        </div>
      </div>

      {/* Lista de Meses */}
      <div>
        {historicalData.map((month, index) => {
          const isRecent = index === 0;
          const monthlyValue = month.values?.monthly || 0;
          const changeValue = month.change?.monthly;
          
          const valueStyles = getValueStyles(month, index);
          const arrowStyles = getArrowStyles(changeValue);
          const arrow = getArrow(changeValue);
          
          return (
            <div 
              key={month.date}
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: index < historicalData.length - 1 ? '1px solid #111827' : 'none',
                backgroundColor: isRecent ? 'rgba(17, 24, 39, 0.3)' : 'transparent',
                transition: 'background-color 0.2s',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(17, 24, 39, 0.5)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = isRecent ? 'rgba(17, 24, 39, 0.3)' : 'transparent'}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                {/* Mes */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {isRecent && (
                    <div style={{
                      width: '0.5rem',
                      height: '0.5rem',
                      backgroundColor: '#10b981',
                      borderRadius: '50%',
                      animation: 'pulse 2s infinite'
                    }}></div>
                  )}
                  <div style={{
                    color: '#d1d5db',
                    fontSize: '1.rem',
                    fontWeight: '500'
                  }}>
                    {formatDate(month.date)}
                  </div>
                </div>
                
                {/* Valor y Flecha */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  {/* Flecha */}
                  {changeValue && changeValue !== "0.0" && (
                    <div style={arrowStyles}>
                      {arrow} {Math.abs(parseFloat(changeValue)).toFixed(1)}%
                    </div>
                  )}
                  
                  {/* Valor */}
                  <div style={valueStyles}>
                    {monthlyValue.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Mínimo */}
      <div style={{
        borderTop: '1px solid #374151',
        padding: '0.75rem 1.5rem',
        backgroundColor: 'rgba(17, 24, 39, 0.3)'
      }}>
        <div style={{
          color: '#6b7280',
          fontSize: '0.875rem',
          textAlign: 'center'
        }}>
          IPC MENSUAL
        </div>
      </div>

      {/* Estilos CSS inline */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default InflationHistory;