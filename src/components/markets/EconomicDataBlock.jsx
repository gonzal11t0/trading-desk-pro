// src/components/markets/EconomicDataBlock.jsx
import React from 'react';
import EconomicDataTable from './EconomicDataTable';
import DatosMacros from './DatosMacros';
import { useEconomicData } from '../../hooks/useEconomicData';

const EconomicDataBlock = () => {
  const { data, isLoading, error } = useEconomicData();

  const containerStyle = {
    background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)',
    border: '1px solid rgba(6, 182, 212, 0.3)',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 25px 50px -12px rgba(6, 182, 212, 0.15)',
    position: 'relative',
    overflow: 'hidden'
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

  return (
    <div style={containerStyle}>
      <div style={glowStyle}></div>
      
      {/* CABECERA CENTRADA */}
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
            position: 'relative'
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
          </div>
          <div style={headerLineStyle}></div>
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={loadingSpinnerStyle}></div>
          <p style={{
            color: 'rgba(103, 232, 249, 0.8)',
            marginTop: '16px',
            fontWeight: '500',
            fontSize: '16px'
          }}>
            Cargando datos económicos...
          </p>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            background: 'linear-gradient(90deg, rgba(220, 38, 38, 0.4), rgba(153, 27, 27, 0.2))',
            border: '1px solid rgba(220, 38, 38, 0.5)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)'
          }}>
            <span style={{ fontSize: '24px', color: '#f87171' }}>⚠️</span>
            <div>
              <span style={{
                color: '#fecaca',
                fontWeight: '500',
                fontSize: '16px'
              }}>
                Error cargando datos
              </span>
              <p style={{
                color: 'rgba(248, 113, 113, 0.7)',
                fontSize: '14px',
                marginTop: '4px'
              }}>
                Reintentando...
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <EconomicDataTable data={data?.indicators || []} />
          <DatosMacros 
            reserves={data?.reserves}
            monetaryBase={data?.monetaryBase}
            moneySupply={data?.moneySupply}
          />
        </>
      )}
    </div>
  );
};

export default EconomicDataBlock;