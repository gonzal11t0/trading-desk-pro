import React from 'react';
import { useRiskCountry } from '../../hooks/useRiskCountry';

const RiskCountryModule = () => {
  const { data, loading, error, lastUpdated, refresh } = useRiskCountry();

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Formatear hora
  const formatTime = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  // Determinar nivel de riesgo
  const getRiskLevel = (valor) => {
    if (!valor) return 'unknown';
    if (valor >= 2000) return 'critical';
    if (valor >= 1500) return 'high';
    if (valor >= 1000) return 'medium';
    return 'low';
  };

  // Determinar colores según nivel
  const getRiskColors = (level) => {
    switch(level) {
      case 'critical':
        return {
          bg: '#1f0000',
          border: '#ff000033',
          text: '#ff5555',
          badgeBg: '#ff000033',
          badgeText: '#ff9999',
          icon: '#ff4444',
          value: '#ff7777'
        };
      case 'high':
        return {
          bg: '#1f0f00',
          border: '#ff880033',
          text: '#ffaa55',
          badgeBg: '#ff880033',
          badgeText: '#ffcc99',
          icon: '#ff9944',
          value: '#ffbb77'
        };
      case 'medium':
        return {
          bg: '#1f1f00',
          border: '#ffff0033',
          text: '#ffff55',
          badgeBg: '#ffff0033',
          badgeText: '#ffff99',
          icon: '#ffff44',
          value: '#ffff77'
        };
      case 'low':
        return {
          bg: '#001f00',
          border: '#00ff0033',
          text: '#55ff55',
          badgeBg: '#00ff0033',
          badgeText: '#99ff99',
          icon: '#44ff44',
          value: '#77ff77'
        };
      default:
        return {
          bg: '#0f0f0f',
          border: '#66666633',
          text: '#aaaaaa',
          badgeBg: '#66666633',
          badgeText: '#cccccc',
          icon: '#888888',
          value: '#bbbbbb'
        };
    }
  };

  const riskLevel = getRiskLevel(data?.valor);
  const colors = getRiskColors(riskLevel);
  const riskLabels = {
    critical: 'CRÍTICO',
    high: 'ALTO',
    medium: 'MEDIO',
    low: 'BAJO',
    unknown: 'DESCONOCIDO'
  };

  // Estilos base
  const styles = {
    container: {
      background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.9), rgba(30, 30, 30, 0.7))',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      border: `1px solid ${colors.border}`,
      padding: '20px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
      transition: 'all 0.3s ease',
      fontFamily: "'Inter', 'Segoe UI', sans-serif"
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '24px'
    },
    titleContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    iconWrapper: {
      background: `${colors.bg}`,
      padding: '10px',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    titleText: {
      color: '#ffffff',
      fontSize: '18px',
      fontWeight: '600',
      margin: 0,
      lineHeight: '1.2'
    },
    subtitle: {
      color: '#888888',
      fontSize: '14px',
      margin: '4px 0 0 0'
    },
    badge: {
      background: colors.badgeBg,
      color: colors.badgeText,
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    statusBadge: {
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: '600',
      textTransform: 'uppercase'
    },
    valueContainer: {
      marginBottom: '24px'
    },
    valueRow: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginBottom: '4px'
    },
    value: {
      color: colors.value,
      fontSize: '42px',
      fontWeight: '700',
      lineHeight: '1'
    },
    unit: {
      color: '#888888',
      fontSize: '18px',
      marginLeft: '8px'
    },
    valueLabel: {
      color: '#666666',
      fontSize: '14px',
      marginTop: '4px'
    },
    infoRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '14px',
      marginBottom: '12px'
    },
    infoLabel: {
      color: '#888888',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    infoValue: {
      color: '#ffffff',
      fontWeight: '500',
      textAlign: 'right'
    },
    timeValue: {
      color: '#aaaaaa',
      fontSize: '12px',
      display: 'block'
    },
    separator: {
      borderTop: '1px solid rgba(100, 100, 100, 0.3)',
      paddingTop: '12px',
      marginTop: '12px'
    },
    sourceRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '12px'
    },
    sourceLabel: {
      color: '#666666'
    },
    sourceLink: {
      color: '#4dabf7',
      textDecoration: 'none',
      fontWeight: '500'
    },
    statusRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '16px',
      paddingTop: '12px',
      borderTop: '1px solid rgba(100, 100, 100, 0.3)'
    },
    statusIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '12px'
    },
    statusDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%'
    },
    statusText: {
      color: '#888888'
    },
    refreshButton: {
      background: 'rgba(100, 100, 100, 0.2)',
      color: '#cccccc',
      border: 'none',
      padding: '6px 12px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    controlButtons: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    smallButton: {
      background: 'transparent',
      border: 'none',
      padding: '6px',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    loadingContainer: {
      textAlign: 'center',
      padding: '24px 0'
    },
    loadingText: {
      color: '#888888',
      fontSize: '14px',
      marginTop: '8px'
    },
    errorContainer: {
      textAlign: 'center',
      padding: '16px 0'
    },
    errorText: {
      color: '#ff5555',
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '12px'
    },
    retryButton: {
      background: 'rgba(255, 85, 85, 0.1)',
      color: '#ff9999',
      border: '1px solid rgba(255, 85, 85, 0.3)',
      padding: '8px 16px',
      borderRadius: '6px',
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }
  };

  // Estado de la fuente
  const getSourceConfig = (source) => {
    switch(source) {
      case 'argentinaDatos':
        return {
          color: '#00ff0033',
          text: '#00ff00',
          label: 'LIVE',
          dotColor: '#00ff00'
        };
      case 'cache':
        return {
          color: '#0088ff33',
          text: '#88bbff',
          label: 'CACHÉ',
          dotColor: '#0088ff'
        };
      default:
        return {
          color: '#66666633',
          text: '#aaaaaa',
          label: 'MOCK',
          dotColor: '#888888'
        };
    }
  };

  const sourceConfig = getSourceConfig(data?.source);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.titleContainer}>
            <div style={{...styles.iconWrapper, background: 'rgba(255, 85, 85, 0.1)'}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff5555" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div>
              <h3 style={styles.titleText}>Riesgo País</h3>
              <p style={styles.subtitle}>EMBI+ Argentina</p>
            </div>
          </div>
          <div style={{animation: 'spin 1s linear infinite'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="2">
              <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
          </div>
        </div>
        <div style={styles.loadingContainer}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(100, 100, 100, 0.3)',
            height: '40px',
            width: '120px',
            borderRadius: '8px',
            animation: 'pulse 1.5s ease-in-out infinite',
            marginBottom: '8px'
          }}></div>
          <p style={styles.loadingText}>Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{...styles.container, borderColor: '#ff000033'}}>
        <div style={styles.header}>
          <div style={styles.titleContainer}>
            <div style={{...styles.iconWrapper, background: 'rgba(255, 85, 85, 0.1)'}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff5555" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div>
              <h3 style={styles.titleText}>Riesgo País</h3>
              <p style={styles.subtitle}>EMBI+ Argentina</p>
            </div>
          </div>
        </div>
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>Error cargando datos</p>
          <button 
            onClick={refresh}
            style={styles.retryButton}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255, 85, 85, 0.2)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255, 85, 85, 0.1)'}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={styles.container}
      onMouseOver={e => {
        e.currentTarget.style.borderColor = colors.border.replace('33', '66');
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.6)';
      }}
      onMouseOut={e => {
        e.currentTarget.style.borderColor = colors.border;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.5)';
      }}
    >
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleContainer}>
          <div style={styles.iconWrapper}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.icon} strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <h3 style={styles.titleText}>Riesgo País</h3>
              <span style={styles.badge}>{riskLabels[riskLevel]}</span>
            </div>
            <p style={styles.subtitle}>EMBI+ Argentina</p>
          </div>
        </div>
        
        <div style={styles.controlButtons}>
          <span style={{...styles.statusBadge, background: sourceConfig.color, color: sourceConfig.text}}>
            {sourceConfig.label}
          </span>
          <button 
            style={{...styles.smallButton, background: colors.bg}}
            onClick={refresh}
            title="Actualizar"
            onMouseOver={e => e.currentTarget.style.background = colors.bg.replace('1f', '2f')}
            onMouseOut={e => e.currentTarget.style.background = colors.bg}
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke={colors.text} 
              strokeWidth="2"
              style={{transition: 'transform 0.3s ease'}}
              onMouseOver={e => e.currentTarget.style.transform = 'rotate(180deg)'}
              onMouseOut={e => e.currentTarget.style.transform = 'rotate(0deg)'}
            >
              <path d="M23 4v6h-6"/>
              <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Valor Principal */}
      <div style={styles.valueContainer}>
        <div style={styles.valueRow}>
          <div>
            <span style={styles.value}>
              {data?.valor?.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) || 'N/A'}
            </span>
            <span style={styles.unit}>puntos</span>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
            <polyline points="17 6 23 6 23 12"/>
          </svg>
        </div>
        <p style={styles.valueLabel}>Valor EMBI+</p>
      </div>

      {/* Información adicional */}
      <div>


        <div style={styles.separator}>
          <div style={styles.sourceRow}>
            <span style={styles.sourceLabel}>Fuente oficial</span>
            <a 
              href="https://argentinadatos.com" 
              target="_blank" 
              rel="noopener noreferrer"
              style={styles.sourceLink}
              onMouseOver={e => e.currentTarget.style.color = '#6bc5ff'}
              onMouseOut={e => e.currentTarget.style.color = '#4dabf7'}
            >
              ArgentinaDatos.com
            </a>
          </div>
        </div>

        {/* Indicador de estado */}
        <div style={styles.statusRow}>
          <div style={styles.statusIndicator}>
          
          </div>
          {data?.source !== 'argentinaDatos' && (
            <button
              onClick={refresh}
              style={styles.refreshButton}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(100, 100, 100, 0.3)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(100, 100, 100, 0.2)'}
            >
              Forzar actualización
            </button>
          )}
        </div>
      </div>

      {/* Animaciones CSS inline */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default RiskCountryModule;