import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  X, 
  ChevronRight, 
  Sparkles, 
  Lightbulb,
  TrendingUp,
  DollarSign,
  PieChart,
  AlertCircle
} from 'lucide-react';
import { useEducationStore } from '../../../stores/useEducationStore';
import { useMacroEducation } from '../../../hooks/useMacroEducation';

const FloatingEduButton = () => {
  const { showButton, closeButton, openExplainer } = useEducationStore();
  const { userClosed } = useMacroEducation();
  
  const [isHovered, setIsHovered] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const educationalTips = [
    {
      id: 1,
      icon: <DollarSign style={{ width: '16px', height: '16px' }} />,
      title: "¿Qué son las Reservas?",
      description: "Dinero en moneda extranjera que tiene el BCRA para pagar deudas y estabilizar el dólar.",
      color: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
      bgColor: "rgba(59, 130, 246, 0.1)",
      emoji: "🏦"
    },
    {
      id: 2,
      icon: <TrendingUp style={{ width: '16px', height: '16px' }} />,
      title: "¿Qué es el IPC?",
      description: "Índice de Precios al Consumidor. Mide cuánto aumentan los precios que pagas mensualmente.",
      color: "linear-gradient(135deg, #ef4444 0%, #ec4899 100%)",
      bgColor: "rgba(239, 68, 68, 0.1)",
      emoji: "📈"
    },
    {
      id: 3,
      icon: <PieChart style={{ width: '16px', height: '16px' }} />,
      title: "¿Qué es el Riesgo País?",
      description: "Mide el riesgo de invertir en Argentina vs. EE.UU. Cuanto más alto, más difícil pedir prestado.",
      color: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
      bgColor: "rgba(139, 92, 246, 0.1)",
      emoji: "⚠️"
    },
    {
      id: 4,
      icon: <AlertCircle style={{ width: '16px', height: '16px' }} />,
      title: "Dólar Blue vs. Oficial",
      description: "La brecha muestra la diferencia entre el dólar regulado y el mercado paralelo.",
      color: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      bgColor: "rgba(16, 185, 129, 0.1)",
      emoji: "💱"
    }
  ];

  useEffect(() => {
    if (!showButton) return;
    
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % educationalTips.length);
    }, 8000);

    return () => clearInterval(tipInterval);
  }, [showButton]);

  useEffect(() => {
    if (showButton && !userClosed) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [showButton, userClosed]);

  if (!showButton || userClosed) return null;

  const currentTip = educationalTips[currentTipIndex];

  // Estilos inline para animaciones
  const styles = {
    slideInRight: {
      animation: 'slideInRight 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
    },
    shrink: {
      animation: 'shrink 60s linear forwards'
    },
    bounceSlow: {
      animation: 'bounceSlow 3s infinite ease-in-out'
    },
    ping: {
      animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1)'
    }
  };

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .hover-scale {
          transition: all 0.3s ease-out;
        }
        
        .hover-scale:hover {
          transform: scale(1.05);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        
        .hover-glow {
          transition: all 0.3s ease;
        }
        
        .hover-glow:hover {
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
        }
        
        .button-hover-effect {
          transition: all 0.2s ease;
        }
        
        .button-hover-effect:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.3);
        }
        
        .button-active-effect:active {
          transform: translateY(1px);
        }
        
        .rotate-on-hover {
          transition: transform 0.3s ease;
        }
        
        .rotate-on-hover:hover {
          transform: rotate(12deg);
        }
        
        .slide-on-hover {
          transition: transform 0.3s ease;
        }
        
        .slide-on-hover:hover {
          transform: translateX(3px);
        }
      `}</style>

      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 50
      }}>
        {/* Efecto de pulso */}
        {pulse && (
          <div style={{
            position: 'absolute',
            inset: 0,
            animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1)',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderRadius: '16px',
            filter: 'blur(20px)'
          }} />
        )}

        {/* Contenedor principal */}
        <div 
          style={{
            background: currentTip.color,
            borderRadius: '16px',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.5s ease-out',
            ...styles.slideInRight
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Decoración superior */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3), transparent)'
          }} />
          
          {/* Badge "Nuevo" */}
          <div style={{
            position: 'absolute',
            top: '-8px',
            left: '-8px'
          }}>
            <div style={{
              position: 'relative',
              background: 'linear-gradient(to right, #fbbf24, #f97316)',
              color: 'white',
              fontSize: '12px',
              fontWeight: 'bold',
              padding: '4px 12px',
              borderRadius: '9999px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Sparkles style={{ width: '12px', height: '12px' }} />
              Nuevo
            </div>
          </div>

          {/* Contenido */}
          <div style={{ padding: '20px' }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  padding: '8px',
                  borderRadius: '12px',
                  backgroundColor: currentTip.bgColor,
                  backdropFilter: 'blur(10px)'
                }}>
                  <div style={{ fontSize: '24px' }}>{currentTip.emoji}</div>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Lightbulb style={{ width: '16px', height: '16px', color: 'rgba(255, 255, 255, 0.8)' }} />
                    <span style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'rgba(255, 255, 255, 0.9)'
                    }}>TIP DEL DÍA</span>
                  </div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: 'white',
                    marginTop: '4px'
                  }}>{currentTip.title}</h3>
                </div>
              </div>
              
              {/* Botón cerrar */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeButton();
                }}
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  transition: 'color 0.2s',
                  padding: '4px',
                  borderRadius: '8px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}
                aria-label="Cerrar"
              >
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            {/* Descripción */}
            <p style={{
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '20px',
              fontSize: '14px',
              lineHeight: '1.6'
            }}>
              {currentTip.description}
            </p>

            {/* Indicadores de tips */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '20px'
            }}>
              {educationalTips.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTipIndex(index)}
                  style={{
                    width: index === currentTipIndex ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: index === currentTipIndex ? 'white' : 'rgba(255, 255, 255, 0.4)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    border: 'none',
                    padding: 0
                  }}
                  onMouseEnter={(e) => {
                    if (index !== currentTipIndex) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (index !== currentTipIndex) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
                    }
                  }}
                  aria-label={`Ver tip ${index + 1}`}
                />
              ))}
            </div>

            {/* Botón de acción principal */}
            <button
              onClick={() => {
                closeButton();
                openExplainer();
              }}
              style={{
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: 'white',
                color: '#1f2937',
                fontWeight: 'bold',
                padding: '12px 24px',
                borderRadius: '12px',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                border: 'none',
                cursor: 'pointer'
              }}
              className="button-hover-effect button-active-effect"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(1px)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
            >
              {/* Efecto de brillo */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent)',
                transform: 'translateX(-100%)',
                transition: 'transform 1s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(100%)';
              }} />
              
              <BookOpen 
                style={{ 
                  width: '20px', 
                  height: '20px',
                  transition: 'transform 0.3s'
                }}
                className="rotate-on-hover"
              />
              <span>Explorar 30+ Indicadores</span>
              <ChevronRight 
                style={{ 
                  width: '20px', 
                  height: '20px',
                  transition: 'transform 0.3s'
                }}
                className="slide-on-hover"
              />
            </button>

            {/* Footer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#34d399',
                  borderRadius: '50%',
                  animation: 'ping 2s infinite'
                }} />
                <span style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.7)'
                }}>Disponible</span>
              </div>
              <div style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.6)'
              }}>
                Tip {currentTipIndex + 1} de {educationalTips.length}
              </div>
            </div>
          </div>

          {/* Barra de tiempo */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3), transparent)'
          }}>
            <div 
              style={{
                height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                transition: 'width 1s linear',
                animation: 'shrink 60s linear forwards'
              }}
            />
          </div>
        </div>

        {/* Botón minimizado */}
        {!isHovered && (
          <div style={{
            position: 'absolute',
            bottom: '-8px',
            right: '-8px'
          }}>
            <div style={{
              background: 'linear-gradient(to right, #2563eb, #4f46e5)',
              color: 'white',
              padding: '8px',
              borderRadius: '9999px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
              animation: 'bounceSlow 3s infinite ease-in-out'
            }}>
              <BookOpen style={{ width: '16px', height: '16px' }} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FloatingEduButton;