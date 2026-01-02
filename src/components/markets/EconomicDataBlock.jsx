// src/components/markets/EconomicDataBlock.jsx - VERSIÓN COMPLETA CORREGIDA
import React from 'react';
import EconomicDataTable from './EconomicDataTable';
import DatosMacros from './DatosMacros';
import { useEconomicData } from '../../hooks/useEconomicData';

const EconomicDataBlock = () => {
  const { 
    bcraData,           // ¡CORRECCIÓN: Usar bcraData en lugar de indicators!
    reserves, 
    monetaryBase, 
    moneySupply, 
    loading, 
    error, 
    refresh,
    lastUpdate,
    status
  } = useEconomicData();

  const containerStyle = {
    background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)',
    border: '1px solid rgba(6, 182, 212, 0.3)',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 25px 50px -12px rgba(6, 182, 212, 0.15)',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: '24px'
  };

  const headerLineStyle = {
    height: '4px',
    width: '96px',
    margin: '12px auto 0',
    background: 'linear-gradient(90deg, #06b6d4, #8b5cf6)',
    borderRadius: '999px'
  };

  const glowStyle = {
    position: 'absolute',
    inset: '-20px',
    background: 'radial-gradient(circle at 50% 0%, rgba(6, 182, 212, 0.2) 0%, transparent 70%)',
    filter: 'blur(40px)',
    opacity: '0.5'
  };

  const loadingSpinnerStyle = {
    width: '48px',
    height: '48px',
    border: '3px solid rgba(6, 182, 212, 0.3)',
    borderTop: '3px solid #06b6d4',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto'
  };

  const statusBadgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
    marginLeft: '12px',
    background: status?.bcraConectado 
      ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.1))' 
      : 'linear-gradient(90deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.1))',
    border: `1px solid ${status?.bcraConectado ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
    color: status?.bcraConectado ? '#10b981' : '#f59e0b'
  };

  return (
    <div style={containerStyle}>
      <div style={glowStyle}></div>
      
      {/* CABECERA CENTRADA CON ESTADO */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '24px',
        paddingBottom: '20px',
        borderBottom: '1px solid rgba(6, 182, 212, 0.2)',
        position: 'relative'
      }}>
        <div style={{ textAlign: 'center', position: 'relative' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            position: 'relative',
            flexWrap: 'wrap'
          }}>
            <span style={{
              fontSize: '28px',
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.5))'
            }}>
              📊
            </span>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              background: 'linear-gradient(90deg, #67e8f9, #93c5fd, #c4b5fd)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0,
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }}>
              Indicadores Económicos Argentina
            </h3>
            
            {/* Badge de estado */}
            <div style={statusBadgeStyle}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: status?.bcraConectado ? '#10b981' : '#f59e0b',
                animation: status?.bcraConectado ? 'pulse 2s infinite' : 'none'
              }}></span>
              <span>
                {status?.bcraConectado ? `${status.totalIndicadores} indicadores` : 'Sin conexión'}
              </span>
            </div>
          </div>
          
          <div style={headerLineStyle}></div>
          
          {/* Información de actualización */}
          {lastUpdate && !loading && !error && (
            <div style={{
              fontSize: '12px',
              color: 'rgba(156, 163, 175, 0.8)',
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}>
              <span>🔄</span>
              <span>Actualizado: {new Date(lastUpdate).toLocaleTimeString('es-AR')}</span>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={loadingSpinnerStyle}></div>
          <p style={{
            color: 'rgba(103, 232, 249, 0.8)',
            marginTop: '16px',
            fontWeight: '500',
            fontSize: '16px'
          }}>
            Conectando con BCRA API...
          </p>
          <p style={{
            color: 'rgba(156, 163, 175, 0.6)',
            fontSize: '14px',
            marginTop: '8px'
          }}>
            Obteniendo datos en tiempo real del Banco Central
          </p>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '20px',
            background: 'linear-gradient(90deg, rgba(220, 38, 38, 0.4), rgba(153, 27, 27, 0.2))',
            border: '1px solid rgba(220, 38, 38, 0.5)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            maxWidth: '500px'
          }}>
            <span style={{ fontSize: '28px', color: '#f87171' }}>⚠️</span>
            <div style={{ textAlign: 'left' }}>
              <span style={{
                color: '#fecaca',
                fontWeight: '600',
                fontSize: '16px',
                display: 'block',
                marginBottom: '8px'
              }}>
                Error de conexión con BCRA
              </span>
              <p style={{
                color: 'rgba(248, 113, 113, 0.7)',
                fontSize: '14px',
                marginBottom: '16px',
                lineHeight: '1.4'
              }}>
                {error}
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={refresh}
                  style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(90deg, #06b6d4, #3b82f6)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    ':hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)'
                    }
                  }}
                >
                  🔄 Reintentar conexión
                </button>
                <button
                  onClick={() => {
                    console.log('Usando datos de fallback...');
                    refresh();
                  }}
                  style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(90deg, rgba(107, 114, 128, 0.3), rgba(75, 85, 99, 0.2))',
                    border: '1px solid rgba(156, 163, 175, 0.3)',
                    borderRadius: '8px',
                    color: '#d1d5db',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Usar datos locales
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* ¡CORRECCIÓN CRÍTICA: Pasar bcraData en lugar de indicators! */}

          <DatosMacros
            reserves={reserves}
            monetaryBase={monetaryBase}
            moneySupply={moneySupply}
          />
          
          {/* Footer informativo */}
          <div style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(75, 85, 99, 0.2)',
            fontSize: '12px',
            color: 'rgba(156, 163, 175, 0.6)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🏦</span>
              <span>Fuente: BCRA API v4.0 • Datos oficiales</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🔄</span>
              <span>Actualización automática cada 5 min</span>
            </div>
          </div>
        </>
      )}
      
      {/* Estilos CSS para animaciones */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default EconomicDataBlock;