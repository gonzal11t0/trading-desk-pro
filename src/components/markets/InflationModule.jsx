import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react';
import { fetchInflationData } from '../../api/inflationApi';

export default function InflationModule() {
  const [inflationData, setInflationData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [dataSource, setDataSource] = useState('Cargando...');

  const loadInflationData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchInflationData();
      setInflationData(data);
      setLastUpdate(new Date());
      
      if (data[0]?.source === 'bcra') {
        setDataSource('BCRA Oficial');
      } else if (data[0]?.source === 'bcra_api') {
        setDataSource('BCRA API');
      } else {
        setDataSource('Estimado BCRA');
      }
    } catch (error) {
      console.error('Error loading inflation data:', error);
      setInflationData(getFallbackData());
      setDataSource('Respaldo');
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackData = () => [
    { month: 'Octubre 2024', inflation: 8.8, trend: 'down', source: 'fallback' },
    { month: 'Septiembre 2024', inflation: 11.9, trend: 'down', source: 'fallback' },
    { month: 'Agosto 2024', inflation: 13.2, trend: 'up', source: 'fallback' },
    { month: 'Julio 2024', inflation: 12.8, trend: 'down', source: 'fallback' }
  ];

  useEffect(() => {
    loadInflationData();
    const interval = setInterval(loadInflationData, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const displayData = inflationData.length > 0 ? inflationData : getFallbackData();

  const getInflationColor = (inflation) => {
    if (inflation > 15) return '#ef4444';
    if (inflation > 10) return '#f97316';
    if (inflation > 5) return '#eab308';
    return '#22c55e';
  };

  const getTrendStyle = (trend) => {
    const styles = {
      up: { 
        color: '#ef4444', 
        background: 'rgba(239, 68, 68, 0.1)', 
        border: '1px solid rgba(239, 68, 68, 0.2)' 
      },
      down: { 
        color: '#22c55e', 
        background: 'rgba(34, 197, 94, 0.1)', 
        border: '1px solid rgba(34, 197, 94, 0.2)' 
      },
      equal: { 
        color: '#9ca3af', 
        background: 'rgba(156, 163, 175, 0.1)', 
        border: '1px solid rgba(156, 163, 175, 0.2)' 
      }
    };
    return styles[trend] || styles.equal;
  };

  return (
    <div style={{
      backgroundColor: '#1A1A1A',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      padding: '1rem',
      transition: 'all 0.3s ease',
      height: '100%'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.3)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    }}
    >
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr auto auto',
        gap: '0.75rem',
        background: 'linear-gradient(to right, rgba(31, 41, 55, 0.4), rgba(17, 24, 39, 0.4))',
        borderRadius: '0.5rem',
        padding: '0.75rem',
        border: '1px solid rgba(245, 158, 11, 0.2)',
        marginBottom: '0.75rem'
      }}>
        <div style={{ color: '#fbbf24', fontSize: '0.75rem', fontWeight: 600 }}>MES</div>
        <div style={{ color: '#fbbf24', fontSize: '0.75rem', fontWeight: 600, textAlign: 'right' }}>INFLACIÓN</div>
        <div style={{ color: '#fbbf24', fontSize: '0.75rem', fontWeight: 600, textAlign: 'right' }}>TENDENCIA</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {displayData.map((item, index) => {
          const inflationColor = getInflationColor(item.inflation);
          const trendStyle = getTrendStyle(item.trend);
          
          return (
            <div 
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto',
                gap: '0.75rem',
                alignItems: 'center',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                backgroundColor: index % 2 === 0 ? 'rgba(31, 41, 55, 0.1)' : 'rgba(31, 41, 55, 0.05)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'rgba(31, 41, 55, 0.1)' : 'rgba(31, 41, 55, 0.05)';
              }}
            >
              <div style={{ color: 'white', fontSize: '0.875rem', fontWeight: 500 }}>
                {item.month}
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{ 
                  fontSize: '1rem', 
                  fontWeight: 700, 
                  fontFamily: 'monospace',
                  color: inflationColor
                }}>
                  {item.inflation}%
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '0.5rem',
                  color: trendStyle.color,
                  background: trendStyle.background,
                  border: trendStyle.border,
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  {item.trend === 'up' ? (
                    <TrendingUp style={{ width: '12px', height: '12px' }} />
                  ) : item.trend === 'down' ? (
                    <TrendingDown style={{ width: '12px', height: '12px' }} />
                  ) : (
                    <Minus style={{ width: '12px', height: '12px' }} />
                  )}
                  <span>
                    {item.trend === 'up' ? '▲' : item.trend === 'down' ? '▼' : '●'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}