import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Search, Filter, BookOpen, TrendingUp, DollarSign, 
  PieChart, Globe, Building, BarChart3, ChevronRight,
  Clock, Download, Share2, Star, Zap, Target, TrendingDown,
  Info, ExternalLink, Grid, List, Bookmark, Eye
} from 'lucide-react';
import { useEducationStore } from '../../../stores/useEducationStore';
import { MACRO_INDICATORS, MACRO_CATEGORIES } from './MacroData';
import IndicatorCard from './IndicatorCard';

const MacroExplainer = () => {
  const { isExplainerOpen, closeExplainer, activeIndicatorId } = useEducationStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef(null);

  // Efecto para focus en search al abrir
  useEffect(() => {
    if (isExplainerOpen && searchRef.current) {
      setTimeout(() => {
        searchRef.current.focus();
      }, 300);
    }
  }, [isExplainerOpen]);

  // Filtrar indicadores
  const filteredIndicators = MACRO_INDICATORS.filter(indicator => {
    const matchesSearch = 
      indicator.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      indicator.definicion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      indicator.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'Todos' || indicator.categoria === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Indicador activo
  const activeIndicator = activeIndicatorId 
    ? MACRO_INDICATORS.find(ind => ind.id === activeIndicatorId)
    : null;

  // Iconos por categoría
  const categoryIcons = {
    'Monetario': <DollarSign style={{ width: '18px', height: '18px' }} />,
    'Inflación': <TrendingUp style={{ width: '18px', height: '18px' }} />,
    'Tipo de Cambio': <DollarSign style={{ width: '18px', height: '18px' }} />,
    'Riesgo': <BarChart3 style={{ width: '18px', height: '18px' }} />,
    'Mercado': <PieChart style={{ width: '18px', height: '18px' }} />,
    'Real': <Building style={{ width: '18px', height: '18px' }} />,
    'Internacional': <Globe style={{ width: '18px', height: '18px' }} />,
    'Fiscal': <Building style={{ width: '18px', height: '18px' }} />
  };

  // Colores por categoría
  const categoryColors = {
    'Monetario': { bg: '#3b82f6', text: '#ffffff', light: '#dbeafe' },
    'Inflación': { bg: '#ef4444', text: '#ffffff', light: '#fee2e2' },
    'Tipo de Cambio': { bg: '#10b981', text: '#ffffff', light: '#d1fae5' },
    'Riesgo': { bg: '#8b5cf6', text: '#ffffff', light: '#ede9fe' },
    'Mercado': { bg: '#f59e0b', text: '#ffffff', light: '#fef3c7' },
    'Real': { bg: '#06b6d4', text: '#ffffff', light: '#cffafe' },
    'Internacional': { bg: '#ec4899', text: '#ffffff', light: '#fce7f3' },
    'Fiscal': { bg: '#f97316', text: '#ffffff', light: '#ffedd5' }
  };

  // Toggle favorito
  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  // Indicadores populares (más vistos/favoritos)
  const popularIndicators = MACRO_INDICATORS
    .filter(ind => ['RESERVAS', 'IPC_MENSUAL', 'DOLAR_BLUE', 'EMBI', 'PBI'].includes(ind.id))
    .slice(0, 5);

  if (!isExplainerOpen) return null;

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slideInRight {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slide-up {
          animation: slideUp 0.4s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.4s ease-out;
        }
        
        .animate-pulse-slow {
          animation: pulse 2s infinite ease-in-out;
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .dark-glass {
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .hover-lift {
          transition: all 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.15);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.3s ease-out'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          width: '100%',
          maxWidth: '1200px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #e5e7eb',
          animation: 'slideUp 0.4s ease-out'
        }}>
          {/* Header Premium */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '24px 32px',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Patrón de fondo */}
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            }} />
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              position: 'relative',
              zIndex: 1
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  padding: '12px',
                  borderRadius: '14px',
                  backdropFilter: 'blur(10px)'
                }}>
                  <BookOpen style={{ width: '28px', height: '28px' }} />
                </div>
                <div>
                  <h1 style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    Guía de Indicadores Macroeconómicos
                    <span style={{
                      fontSize: '14px',
                      fontWeight: 'normal',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <Zap style={{ width: '14px', height: '14px' }} />
                      PRO
                    </span>
                  </h1>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginTop: '8px',
                    fontSize: '14px',
                    opacity: 0.9
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Target style={{ width: '16px', height: '16px' }} />
                      {MACRO_INDICATORS.length} indicadores disponibles
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock style={{ width: '16px', height: '16px' }} />
                      Actualizado hoy
                    </span>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => {}}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    padding: '10px 16px',
                    borderRadius: '10px',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                >
                  <Download style={{ width: '18px', height: '18px' }} />
                  PDF
                </button>
                <button
                  onClick={() => {}}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    padding: '10px 16px',
                    borderRadius: '10px',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                >
                  <Share2 style={{ width: '18px', height: '18px' }} />
                  Compartir
                </button>
                <button
                  onClick={closeExplainer}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                  aria-label="Cerrar"
                >
                  <X style={{ width: '24px', height: '24px' }} />
                </button>
              </div>
            </div>

            {/* Barra de búsqueda premium */}
            <div style={{
              position: 'relative',
              maxWidth: '600px',
              marginTop: '8px',
              zIndex: 1
            }}>
              <div style={{
                position: 'relative',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '14px',
                border: isSearchFocused ? '2px solid rgba(255, 255, 255, 0.5)' : '2px solid transparent',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Search style={{
                  width: '20px',
                  height: '20px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginLeft: '16px',
                  position: 'absolute',
                  left: 0
                }} />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Buscar indicador (ej: Reservas, IPC, EMBI, Dólar Blue...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  style={{
                    width: '100%',
                    padding: '16px 16px 16px 48px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    style={{
                      position: 'absolute',
                      right: '16px',
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255, 255, 255, 0.7)',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    <X style={{ width: '20px', height: '20px' }} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div style={{
            display: 'flex',
            flex: 1,
            overflow: 'hidden',
            backgroundColor: '#f8fafc'
          }}>
{/* Panel lateral - Categorías */}
<div style={{
  width: '280px',
  borderRight: '1px solid #e5e7eb',
  backgroundColor: '#ffffff',
  padding: '24px',
  overflowY: 'auto',
  animation: 'slideInRight 0.4s ease-out'
}} className="scrollbar-thin">
  <div style={{ marginBottom: '32px' }}>
    <h3 style={{
      fontSize: '14px',
      fontWeight: 600,
      color: '#4b5563', // Gris oscuro
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }}>
      <Filter style={{ width: '16px', height: '16px', color: '#6b7280' }} />
      CATEGORÍAS
    </h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <button
        onClick={() => setSelectedCategory('Todos')}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: '12px 16px',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          transition: 'all 0.2s',
          backgroundColor: selectedCategory === 'Todos' ? '#eff6ff' : 'transparent',
          color: selectedCategory === 'Todos' ? '#1d4ed8' : '#1f2937', // Texto oscuro
          border: 'none',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          if (selectedCategory !== 'Todos') {
            e.currentTarget.style.backgroundColor = '#f9fafb';
            e.currentTarget.style.color = '#111827';
          }
        }}
        onMouseLeave={(e) => {
          if (selectedCategory !== 'Todos') {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#1f2937';
          }
        }}
      >
        <Grid style={{ 
          width: '18px', 
          height: '18px',
          color: selectedCategory === 'Todos' ? '#1d4ed8' : '#6b7280'
        }} />
        <span>Todos los indicadores</span>
        <span style={{
          marginLeft: 'auto',
          fontSize: '12px',
          backgroundColor: selectedCategory === 'Todos' ? '#3b82f6' : '#004fecff',
          color: selectedCategory === 'Todos' ? 'white' : '#374151', // Texto oscuro
          padding: '2px 8px',
          borderRadius: '9999px',
          fontWeight: 500
        }}>
          {MACRO_INDICATORS.length}
        </span>
      </button>
      
      {MACRO_CATEGORIES.map(cat => {
        const count = MACRO_INDICATORS.filter(ind => ind.categoria === cat).length;
        const color = categoryColors[cat];
        return (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.2s',
              backgroundColor: selectedCategory === cat ? color.light : 'transparent',
              color: selectedCategory === cat ? color.bg : '#1f2937', // Texto oscuro
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              if (selectedCategory !== cat) {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.color = '#111827';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCategory !== cat) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#1f2937';
              }
            }}
          >
            <div style={{
              color: selectedCategory === cat ? color.bg : '#6b7280' // Gris para iconos inactivos
            }}>
              {categoryIcons[cat]}
            </div>
            <span>{cat}</span>
            <span style={{
              marginLeft: 'auto',
              fontSize: '12px',
              backgroundColor: selectedCategory === cat ? color.bg : '#f3f4f6',
              color: selectedCategory === cat ? 'white' : '#374151', // Texto oscuro
              padding: '2px 8px',
              borderRadius: '9999px',
              fontWeight: 500
            }}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  </div>

  {/* Indicadores Populares */}
  <div style={{ marginBottom: '32px' }}>
    <h3 style={{
      fontSize: '14px',
      fontWeight: 600,
      color: '#4b5563', // Gris oscuro
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }}>
      <TrendingUp style={{ width: '16px', height: '16px', color: '#6b7280' }} />
      MÁS CONSULTADOS
    </h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {popularIndicators.map(ind => (
        <button
          key={ind.id}
          onClick={() => useEducationStore.getState().setActiveIndicator(ind.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 12px',
            borderRadius: '10px',
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            cursor: 'pointer',
            transition: 'all 0.2s',
            textAlign: 'left'
          }}
          className="hover-lift"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
            e.currentTarget.style.borderColor = categoryColors[ind.categoria].bg;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f9fafb';
            e.currentTarget.style.borderColor = '#e5e7eb';
          }}
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: categoryColors[ind.categoria].light,
            color: categoryColors[ind.categoria].bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {categoryIcons[ind.categoria]}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#111827', // Casi negro
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {ind.nombre}
            </div>
            <div style={{
              fontSize: '11px',
              color: '#6b7280', // Gris medio
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '2px'
            }}>
              {ind.fuente} • {ind.frecuencia}
            </div>
          </div>
          <ChevronRight style={{ width: '16px', height: '16px', color: '#9ca3af' }} />
        </button>
      ))}
    </div>


              </div>

              {/* Favoritos */}
              {favorites.length > 0 && (
                <div>
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#64748b',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    <Star style={{ width: '16px', height: '16px', color: '#f59e0b' }} />
                    Mis Favoritos
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {favorites.slice(0, 3).map(favId => {
                      const ind = MACRO_INDICATORS.find(i => i.id === favId);
                      if (!ind) return null;
                      return (
                        <button
                          key={favId}
                          onClick={() => useEducationStore.getState().setActiveIndicator(favId)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            backgroundColor: '#fffbeb',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            textAlign: 'left'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef3c7'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fffbeb'}
                        >
                          <Star style={{ width: '14px', height: '14px', color: '#f59e0b', flexShrink: 0 }} />
                          <span style={{
                            fontSize: '13px',
                            color: '#92400e',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {ind.nombre}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Panel principal */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              backgroundColor: '#ffffff'
            }}>
              {/* Barra de herramientas */}
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setViewMode('grid')}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: viewMode === 'grid' ? '#3b82f6' : '#f1f5f9',
                        color: viewMode === 'grid' ? 'white' : '#64748b',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Grid style={{ width: '16px', height: '16px' }} />
                      Grid
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: viewMode === 'list' ? '#3b82f6' : '#f1f5f9',
                        color: viewMode === 'list' ? 'white' : '#64748b',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s'
                      }}
                    >
                      <List style={{ width: '16px', height: '16px' }} />
                      Lista
                    </button>
                  </div>
                  
                  {searchTerm && (
                    <span style={{
                      fontSize: '14px',
                      color: '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <Info style={{ width: '16px', height: '16px' }} />
                      {filteredIndicators.length} resultados para "{searchTerm}"
                    </span>
                  )}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    onClick={() => window.print()}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      backgroundColor: 'white',
                      color: '#475569',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <Download style={{ width: '16px', height: '16px' }} />
                    Exportar
                  </button>
                  <button
                    onClick={closeExplainer}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      color: 'white',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    Comenzar Exploración
                  </button>
                </div>
              </div>

              {/* Contenido de indicadores */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px',
                backgroundColor: '#f8fafc'
              }} className="scrollbar-thin">
                {activeIndicator ? (
                  <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                    <button
                      onClick={() => useEducationStore.getState().setActiveIndicator(null)}
                      style={{
                        marginBottom: '20px',
                        color: '#3b82f6',
                        backgroundColor: '#eff6ff',
                        border: 'none',
                        padding: '10px 16px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
                    >
                      <ChevronRight style={{ transform: 'rotate(180deg)', width: '16px', height: '16px' }} />
                      Volver a la lista
                    </button>
                    <IndicatorCard indicator={activeIndicator} />
                  </div>
                ) : filteredIndicators.length > 0 ? (
                  viewMode === 'grid' ? (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                      gap: '20px'
                    }}>
                      {filteredIndicators.map(indicator => {
                        const color = categoryColors[indicator.categoria];
                        return (
                          <div
                            key={indicator.id}
                            onClick={() => useEducationStore.getState().setActiveIndicator(indicator.id)}
                            style={{
                              backgroundColor: 'white',
                              borderRadius: '16px',
                              padding: '20px',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              border: '1px solid #e5e7eb',
                              position: 'relative',
                              animation: 'slideUp 0.4s ease-out'
                            }}
                            className="hover-lift"
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = color.bg}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                          >
                            {/* Encabezado */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                  width: '40px',
                                  height: '40px',
                                  borderRadius: '12px',
                                  backgroundColor: color.light,
                                  color: color.bg,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}>
                                  {categoryIcons[indicator.categoria]}
                                </div>
                                <div>
                                  <h3 style={{
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    color: '#1e293b',
                                    margin: 0
                                  }}>
                                    {indicator.nombre}
                                  </h3>
                                  <span style={{
                                    fontSize: '12px',
                                    color: color.bg,
                                    backgroundColor: color.light,
                                    padding: '2px 8px',
                                    borderRadius: '9999px',
                                    fontWeight: 500
                                  }}>
                                    {indicator.categoria}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(indicator.id);
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: favorites.includes(indicator.id) ? '#f59e0b' : '#cbd5e1',
                                  cursor: 'pointer',
                                  padding: '4px'
                                }}
                              >
                                <Star style={{ width: '18px', height: '18px' }} />
                              </button>
                            </div>

                            {/* Descripción */}
                            <p style={{
                              fontSize: '14px',
                              color: '#0a5de2ff',
                              lineHeight: 1.5,
                              marginBottom: '16px',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {indicator.definicion}
                            </p>

                            {/* Footer */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              paddingTop: '16px',
                              borderTop: '1px solid #f1f5f9'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{
                                  fontSize: '12px',
                                  color: '#64748b',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}>
                                  <Clock style={{ width: '12px', height: '12px' }} />
                                  {indicator.frecuencia}
                                </span>
                                <span style={{
                                  fontSize: '12px',
                                  color: '#0067f8ff',
                                  backgroundColor: '#f1f5f9',
                                  padding: '2px 8px',
                                  borderRadius: '4px'
                                }}>
                                  {indicator.fuente}
                                </span>
                              </div>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                color: '#3b82f6',
                                fontSize: '14px',
                                fontWeight: 500
                              }}>
                                Ver detalles
                                <ChevronRight style={{ width: '16px', height: '16px' }} />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {filteredIndicators.map(indicator => {
                        const color = categoryColors[indicator.categoria];
                        return (
                          <div
                            key={indicator.id}
                            onClick={() => useEducationStore.getState().setActiveIndicator(indicator.id)}
                            style={{
                              backgroundColor: 'white',
                              borderRadius: '12px',
                              padding: '16px 20px',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              border: '1px solid #e5e7eb',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '16px'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#f8fafc';
                              e.currentTarget.style.transform = 'translateX(4px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'white';
                              e.currentTarget.style.transform = 'translateX(0)';
                            }}
                          >
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '10px',
                              backgroundColor: color.light,
                              color: color.bg,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              {categoryIcons[indicator.categoria]}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                <h3 style={{
                                  fontSize: '16px',
                                  fontWeight: 600,
                                  color: '#1e293b',
                                  margin: 0
                                }}>
                                  {indicator.nombre}
                                </h3>
                                <span style={{
                                  fontSize: '12px',
                                  color: color.bg,
                                  backgroundColor: color.light,
                                  padding: '2px 8px',
                                  borderRadius: '9999px',
                                  fontWeight: 500
                                }}>
                                  {indicator.categoria}
                                </span>
                              </div>
                              <p style={{
                                fontSize: '14px',
                                color: '#64748b',
                                margin: 0,
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}>
                                {indicator.definicion}
                              </p>
                            </div>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '16px',
                              flexShrink: 0
                            }}>
                              <div style={{ textAlign: 'right' }}>
                                <div style={{
                                  fontSize: '12px',
                                  color: '#64748b',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  justifyContent: 'flex-end'
                                }}>
                                  <Clock style={{ width: '12px', height: '12px' }} />
                                  {indicator.frecuencia}
                                </div>
                                <div style={{
                                  fontSize: '12px',
                                  color: '#64748b',
                                  marginTop: '4px'
                                }}>
                                  {indicator.fuente}
                                </div>
                              </div>
                              <ChevronRight style={{ width: '20px', height: '20px', color: '#94a3b8' }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    color: '#006affff'
                  }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      backgroundColor: '#f1f5f9',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                      color: '#94a3b8'
                    }}>
                      <Search style={{ width: '36px', height: '36px' }} />
                    </div>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: 600,
                      color: '#475569',
                      marginBottom: '12px'
                    }}>
                      No se encontraron indicadores
                    </h3>
                    <p style={{
                      fontSize: '16px',
                      color: '#64748b',
                      maxWidth: '400px',
                      margin: '0 auto 24px'
                    }}>
                      Intenta con otros términos de búsqueda o selecciona una categoría diferente
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('Todos');
                      }}
                      style={{
                        padding: '12px 24px',
                        borderRadius: '10px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        color: 'white',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      Mostrar todos los indicadores
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: '16px 32px',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#64748b' }}>
                <Eye style={{ width: '16px', height: '16px' }} />
                <span>Útil para: <strong style={{ color: '#1e293b' }}>Inversores · Estudiantes · Analistas</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#64748b' }}>
                <Bookmark style={{ width: '16px', height: '16px' }} />
                <span>Guardado automáticamente</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => window.open('https://www.bcra.gob.ar', '_blank')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: 'white',
                  color: '#475569',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                  fontSize: '14px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <ExternalLink style={{ width: '16px', height: '16px' }} />
                BCRA Oficial
              </button>
              <button
                onClick={closeExplainer}
                style={{
                  padding: '10px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
              >
                Cerrar Guía
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MacroExplainer;