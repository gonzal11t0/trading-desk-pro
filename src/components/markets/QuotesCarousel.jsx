// src/components/markets/QuotesCarousel.jsx - VERSIÓN FINAL CON ESTILOS INLINE
import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Play, Pause, RefreshCw } from 'lucide-react'
import { fetchQuotesData } from '../../api/quotesApi'

export function QuotesCarousel() {
  const [quotes, setQuotes] = useState([])
  const [currentSet, setCurrentSet] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)

  const itemsPerSet = 3
  const totalSets = Math.ceil(quotes.length / itemsPerSet)

  useEffect(() => {
    loadQuotesData()
  }, [])

  useEffect(() => {
    if (!isPlaying || quotes.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentSet((prev) => (prev + 1) % totalSets)
    }, 2500)

    return () => clearInterval(interval)
  }, [totalSets, isPlaying, quotes.length])

  useEffect(() => {
    const dataInterval = setInterval(() => {
      loadQuotesData()
    }, 30000)

    return () => clearInterval(dataInterval)
  }, [])

  const loadQuotesData = async () => {
    try {
      const quotesData = await fetchQuotesData()
      setQuotes(quotesData)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Error loading quotes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const currentQuotes = quotes.slice(
    currentSet * itemsPerSet, 
    (currentSet * itemsPerSet) + itemsPerSet
  )

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const manualRefresh = () => {
    setIsLoading(true)
    loadQuotesData()
  }

  // Función para colores con valores HEX - MANTENER ESTA
  const getColorStyle = (symbol) => {
    const colors = {
      'S&P 500': { text: '#60a5fa', dot: '#3b82f6', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' },
      'NASDAQ': { text: '#a855f7', dot: '#8b5cf6', background: 'linear-gradient(135deg, #a855f7, #ec4899)' },
      'BTC/USD': { text: '#fb923c', dot: '#f97316', background: 'linear-gradient(135deg, #f97316, #eab308)' },
      'DÓLAR BLUE': { text: '#4ade80', dot: '#22c55e', background: 'linear-gradient(135deg, #22c55e, #10b981)' },
      'MERVAL': { text: '#22d3ee', dot: '#06b6d4', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' },
      'ORO': { text: '#fbbf24', dot: '#f59e0b', background: 'linear-gradient(135deg, #f59e0b, #d97706)' }
    }
    return colors[symbol] || { text: '#9ca3af', dot: '#6b7280', background: 'linear-gradient(135deg, #6b7280, #4b5563)' }
  }

  if (isLoading && quotes.length === 0) {
    return (
      <div style={{ 
        position: 'relative', 
        background: 'linear-gradient(to right, #111827, #000, #111827)',
        borderTop: '1px solid rgba(55, 65, 81, 0.5)',
        borderBottom: '1px solid rgba(55, 65, 81, 0.5)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '0.75rem' }}>
            {[1, 2, 3].map((item) => (
              <div key={item} style={{ 
                opacity: 0.5,
                animation: 'pulse 2s infinite'
              }}>
                <div style={{ 
                  backgroundColor: '#1f2937', 
                  borderRadius: '12px', 
                  padding: '1rem',
                  height: '6rem'
                }}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      position: 'relative', 
      background: 'linear-gradient(to right, #111827, #000, #111827)',
      borderTop: '1px solid rgba(55, 65, 81, 0.5)',
      borderBottom: '1px solid rgba(55, 65, 81, 0.5)',
      boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.05)'
    }}>
      {/* Barra superior animada */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        height: '2px',
        background: 'linear-gradient(to right, transparent, #3b82f6, transparent)',
        animation: 'pulse 2s infinite'
      }}></div>
      
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  width: '12px',
                  height: '12px',
                  background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                  borderRadius: '50%',
                  boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.7)',
                  animation: 'ping 1.5s infinite'
                }}></div>
                <div style={{
                  width: '12px',
                  height: '12px',
                  background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                  borderRadius: '50%',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.25)'
                }}></div>
              </div>
              <span style={{
                color: '#10b981',
                fontWeight: 700,
                fontSize: '0.875rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}>
                Mercados en Vivo
              </span>
            </div>
            
            <div style={{ 
              display: 'none', 
              alignItems: 'center', 
              gap: '0.5rem',
              color: '#9ca3af',
              fontSize: '0.75rem'
            }}>
              <RefreshCw style={{ width: '12px', height: '12px', animation: 'spin 1s linear infinite' }} />
              <span>ACTUALIZACIÓN AUTOMÁTICA</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              color: '#9ca3af', 
              fontSize: '0.75rem', 
              fontFamily: 'monospace',
              display: 'none'
            }}>
              {lastUpdate.toLocaleTimeString('es-AR', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit',
                hour12: false 
              })}
            </div>
            
            <button
              onClick={manualRefresh}
              disabled={isLoading}
              style={{
                padding: '0.5rem',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(31, 41, 55, 0.5)',
                border: '1px solid rgba(55, 65, 81, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.5)';
                e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(55, 65, 81, 0.5)';
                e.currentTarget.style.backgroundColor = 'rgba(31, 41, 55, 0.5)';
              }}
            >
              <RefreshCw style={{ 
                width: '16px', 
                height: '16px', 
                color: '#9ca3af',
                animation: isLoading ? 'spin 1s linear infinite' : 'none'
              }} />
            </button>
            
            <button
              onClick={togglePlay}
              style={{
                padding: '0.5rem',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(31, 41, 55, 0.5)',
                border: '1px solid rgba(55, 65, 81, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.5)';
                e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(55, 65, 81, 0.5)';
                e.currentTarget.style.backgroundColor = 'rgba(31, 41, 55, 0.5)';
              }}
            >
              {isPlaying ? (
                <Pause style={{ width: '16px', height: '16px', color: '#9ca3af' }} />
              ) : (
                <Play style={{ width: '16px', height: '16px', color: '#9ca3af' }} />
              )}
            </button>
          </div>
        </div>

        {/* Grid de Quotes */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(1, 1fr)', 
          gap: '0.75rem', 
          marginBottom: '1rem' 
        }}>
          {currentQuotes.map((quote, index) => {
            const colorStyle = getColorStyle(quote.symbol);
            
            return (
              <div
                key={index}
                style={{
                  position: 'relative',
                  background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.4), rgba(17, 24, 39, 0.6))',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '12px',
                  padding: '1rem',
                  border: '1px solid rgba(55, 65, 81, 0.3)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.5)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.borderColor = 'rgba(55, 65, 81, 0.3)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Fondo de color */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: colorStyle.background,
                  borderRadius: '12px',
                  opacity: 0.2,
                  transition: 'opacity 0.3s ease'
                }}></div>
                
                <div style={{ position: 'relative', zIndex: 10 }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {/* Dot de color */}
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: colorStyle.dot
                      }}></div>
                      {/* Texto con color */}
                      <span style={{
                        color: colorStyle.text,
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        letterSpacing: '-0.025em',
                        textTransform: 'uppercase'
                      }}>
                        {quote.symbol}
                      </span>
                    </div>
                    
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.5rem',
                      backgroundColor: quote.positive ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: quote.positive ? '#22c55e' : '#ef4444',
                      border: `1px solid ${quote.positive ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                    }}>
                      {quote.positive ? (
                        <TrendingUp style={{ width: '12px', height: '12px' }} />
                      ) : (
                        <TrendingDown style={{ width: '12px', height: '12px' }} />
                      )}
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 700, 
                        fontFamily: 'monospace' 
                      }}>
                        {quote.change}
                      </span>
                    </div>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'flex-end', 
                    justifyContent: 'space-between' 
                  }}>
                    <div>
                      <div style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: 900, 
                        color: 'white',
                        letterSpacing: '-0.025em',
                        marginBottom: '0.25rem',
                        fontFamily: 'monospace'
                      }}>
                        {quote.price}
                      </div>
                      {quote.volume && (
                        <div style={{ 
                          color: '#9ca3af', 
                          fontSize: '0.75rem', 
                          fontFamily: 'monospace' 
                        }}>
                          VOL: {quote.volume}
                        </div>
                      )}
                    </div>
                    
                    <div style={{
                      width: '2rem',
                      height: '2rem',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: quote.positive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: quote.positive ? '#22c55e' : '#ef4444',
                      fontSize: '1.25rem'
                    }}>
                      {quote.positive ? '↗' : '↘'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Indicadores de paginación */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
          {Array.from({ length: totalSets }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSet(i)}
              style={{
                width: currentSet === i ? '1rem' : '0.5rem',
                height: '0.5rem',
                borderRadius: '9999px',
                backgroundColor: currentSet === i ? '#3b82f6' : '#4b5563',
                transition: 'all 0.3s ease',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                if (currentSet !== i) {
                  e.currentTarget.style.backgroundColor = '#6b7280';
                }
              }}
              onMouseLeave={(e) => {
                if (currentSet !== i) {
                  e.currentTarget.style.backgroundColor = '#4b5563';
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Barra inferior */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(to right, transparent, #06b6d4, transparent)',
        opacity: 0.3
      }}></div>
    </div>
  )
}