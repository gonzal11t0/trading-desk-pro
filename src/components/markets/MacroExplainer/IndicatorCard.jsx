import React from 'react';
import { TrendingUp, TrendingDown, Link, Info } from 'lucide-react';

const IndicatorCard = ({ indicator }) => {
  if (!indicator) return null;

  const getRelationshipIcon = (rel) => {
    switch (rel) {
      case 'directa': return <TrendingUp style={{ width: '16px', height: '16px', color: '#059669' }} />; // Verde
      case 'inversa': return <TrendingDown style={{ width: '16px', height: '16px', color: '#dc2626' }} />; // Rojo
      default: return <Link style={{ width: '16px', height: '16px', color: '#3b82f6' }} />; // Azul
    }
  };

  const getCategoryColor = (cat) => {
    const colors = {
      'Monetario': { bg: '#dbeafe', text: '#1d4ed8', border: '#93c5fd' }, // Azul
      'Inflación': { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' }, // Rojo
      'Tipo de Cambio': { bg: '#d1fae5', text: '#059669', border: '#6ee7b7' }, // Verde
      'Riesgo': { bg: '#ede9fe', text: '#7c3aed', border: '#a78bfa' }, // Violeta
      'Mercado': { bg: '#fef3c7', text: '#d97706', border: '#fbbf24' }, // Amarillo
      'Real': { bg: '#cffafe', text: '#0891b2', border: '#67e8f9' }, // Cian
      'Internacional': { bg: '#fce7f3', text: '#db2777', border: '#f9a8d4' }, // Rosa
      'Fiscal': { bg: '#ffedd5', text: '#ea580c', border: '#fdba74' } // Naranja
    };
    return colors[cat] || { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' };
  };

  const categoryColor = getCategoryColor(indicator.categoria);

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      border: `1px solid ${categoryColor.border}`,
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      {/* Header con título y categoría */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#111827', // Negro para el título
              margin: 0
            }}>
              {indicator.nombre}
            </h3>
            <span style={{
              padding: '4px 12px',
              borderRadius: '9999px',
              backgroundColor: categoryColor.bg,
              color: categoryColor.text,
              fontSize: '14px',
              fontWeight: 600,
              border: `1px solid ${categoryColor.border}`
            }}>
              {indicator.categoria}
            </span>
          </div>
          <p style={{
            fontSize: '14px',
            color: '#6b7280', // Gris para info secundaria
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              📊 {indicator.fuente}
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              ⏰ {indicator.frecuencia}
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              📏 {indicator.unidad}
            </span>
          </p>
        </div>
        <div style={{
          backgroundColor: '#f9fafb',
          padding: '8px',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <Info style={{ width: '20px', height: '20px', color: '#6b7280' }} />
        </div>
      </div>

      {/* Definición */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{
          fontSize: '16px',
          fontWeight: 600,
          color: '#374151', // Gris oscuro para subtítulo
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '20px' }}>📘</span>
          Definición
        </h4>
        <div style={{
          backgroundColor: '#f9fafb',
          padding: '16px',
          borderRadius: '12px',
          borderLeft: `4px solid ${categoryColor.text}`
        }}>
          <p style={{
            fontSize: '16px',
            lineHeight: 1.6,
            color: '#374151', // Texto oscuro sobre fondo claro
            margin: 0
          }}>
            {indicator.definicion}
          </p>
        </div>
      </div>

      {/* Dos columnas: SUBE y BAJA */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Si SUBE */}
        <div style={{
          backgroundColor: '#f0fdf4',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid #bbf7d0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <TrendingUp style={{ width: '20px', height: '20px', color: '#059669' }} />
            <h4 style={{
              fontWeight: 'bold',
              color: '#065f46', // Verde oscuro
              margin: 0,
              fontSize: '16px'
            }}>Si SUBE</h4>
          </div>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            {indicator.interpretacion.sube.split(', ').map((item, idx) => (
              <li key={idx} style={{
                marginBottom: '8px',
                fontSize: '14px',
                lineHeight: 1.5,
                color: '#374151' // Texto oscuro
              }}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Si BAJA */}
        <div style={{
          backgroundColor: '#fef2f2',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid #fecaca'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <TrendingDown style={{ width: '20px', height: '20px', color: '#dc2626' }} />
            <h4 style={{
              fontWeight: 'bold',
              color: '#991b1b', // Rojo oscuro
              margin: 0,
              fontSize: '16px'
            }}>Si BAJA</h4>
          </div>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            {indicator.interpretacion.baja.split(', ').map((item, idx) => (
              <li key={idx} style={{
                marginBottom: '8px',
                fontSize: '14px',
                lineHeight: 1.5,
                color: '#374151' // Texto oscuro
              }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Relaciones */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{
          fontSize: '16px',
          fontWeight: 600,
          color: '#374151',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '20px' }}>🔗</span>
          Relaciones con otros indicadores
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {Object.entries(indicator.relaciones).map(([key, value]) => (
            <div key={key} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#f8fafc',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              {getRelationshipIcon(value)}
              <span style={{
                fontSize: '14px',
                fontWeight: 500,
                color: '#1e293b', // Texto oscuro
                textTransform: 'capitalize'
              }}>
                {key.replace('_', ' ')}:
              </span>
              <span style={{
                fontSize: '14px',
                color: '#64748b',
                textTransform: 'capitalize'
              }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Nota y detalles */}
      <div style={{
        paddingTop: '16px',
        borderTop: '1px solid #e5e7eb'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '16px'
        }}>
          <div>
            <span style={{
              fontSize: '14px',
              color: '#6b7280',
              display: 'block',
              marginBottom: '4px'
            }}>
              Unidad de medida:
            </span>
            <p style={{
              fontSize: '16px',
              fontWeight: 500,
              color: '#111827',
              margin: 0
            }}>
              {indicator.unidad}
            </p>
          </div>
          <div>
            <span style={{
              fontSize: '14px',
              color: '#6b7280',
              display: 'block',
              marginBottom: '4px'
            }}>
              ID del indicador:
            </span>
            <p style={{
              fontFamily: 'monospace',
              fontSize: '16px',
              color: '#111827',
              margin: 0,
              backgroundColor: '#f9fafb',
              padding: '4px 8px',
              borderRadius: '4px',
              display: 'inline-block'
            }}>
              {indicator.id}
            </p>
          </div>
        </div>
        
        {indicator.nota && (
          <div style={{
            marginTop: '16px',
            padding: '12px 16px',
            backgroundColor: '#eff6ff',
            borderRadius: '8px',
            borderLeft: `4px solid #3b82f6`
          }}>
            <p style={{
              fontSize: '14px',
              color: '#1e40af', // Azul oscuro
              margin: 0,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px'
            }}>
              <span style={{ fontSize: '16px' }}>💡</span>
              <span>
                <strong style={{ fontWeight: 600 }}>Nota importante:</strong> {indicator.nota}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndicatorCard;