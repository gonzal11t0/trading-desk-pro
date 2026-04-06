// src/components/markets/QuotesCarousel.jsx
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

  // MANTENGO TODOS TUS useEffect ORIGINALES SIN CAMBIOS
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

  // Función para colores - MANTENGO EXACTAMENTE IGUAL
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

  // LOADING STATE con altura reservada para evitar CLS
  if (isLoading && quotes.length === 0) {
    return (
      <div className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 border-t border-b border-gray-700/50 min-h-[200px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="opacity-50 animate-pulse">
                <div className="bg-gray-800 rounded-xl p-4 h-24 sm:h-28 lg:h-32"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="
      relative 
      bg-gradient-to-r from-gray-900 via-black to-gray-900
      border-t border-b border-gray-700/50
      shadow-2xl shadow-blue-500/5
      min-h-[200px]  /* Altura mínima reservada para evitar CLS */
    ">
      {/* Barra superior animada - MANTENGO EL PULSE ORIGINAL */}
      <div className="
        absolute 
        top-0 
        left-0 
        right-0 
        h-0.5
        bg-gradient-to-r from-transparent via-blue-500 to-transparent
        animate-pulse
      "></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header - ESTRUCTURA ORIGINAL COMPLETA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {/* Ping animation - MANTENGO LOS DOS DIVS ORIGINALES */}
              <div className="relative">
                <div className="
                  absolute 
                  w-3 
                  h-3 
                  bg-gradient-to-br from-green-500 to-cyan-500
                  rounded-full 
                  animate-ping
                  opacity-75
                "></div>
                <div className="
                  w-3 
                  h-3 
                  bg-gradient-to-br from-green-500 to-cyan-500
                  rounded-full 
                  shadow-lg shadow-green-500/25
                "></div>
              </div>
              
              <span className="
                text-green-500 
                font-bold 
                text-sm 
                tracking-wide 
                uppercase
              ">
                Mercados en Vivo
              </span>
            </div>
            
            {/* ACTUALIZACIÓN AUTOMÁTICA - MANTENGO display: 'none' original */}
            <div className="
              hidden 
              md:flex
              items-center 
              gap-2 
              text-gray-400 
              text-xs
            ">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>ACTUALIZACIÓN AUTOMÁTICA</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Hora - MANTENGO display: 'none' original */}
            <div className="
              hidden 
              md:block
              text-gray-400 
              text-xs 
              font-mono
            ">
              {lastUpdate.toLocaleTimeString('es-AR', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit',
                hour12: false 
              })}
            </div>
            
            {/* Botones de control - MANTENGO LA ESTRUCTURA ORIGINAL */}
            <div className="flex items-center gap-3">
              <button
                onClick={manualRefresh}
                disabled={isLoading}
                className="
                  p-2 
                  rounded-lg 
                  bg-gray-800/50 
                  border border-gray-700/50 
                  hover:bg-gray-700/50 
                  hover:border-gray-600/50 
                  transition-all 
                  duration-300
                  disabled:opacity-50 
                  disabled:cursor-not-allowed
                "
                aria-label="Actualizar cotizaciones"
              >
                <RefreshCw className={`
                  w-4 h-4 text-gray-400
                  ${isLoading ? 'animate-spin' : ''}
                `} />
              </button>
              
              <button
                onClick={togglePlay}
                className="
                  p-2 
                  rounded-lg 
                  bg-gray-800/50 
                  border border-gray-700/50 
                  hover:bg-gray-700/50 
                  hover:border-gray-600/50 
                  transition-all 
                  duration-300
                "
                aria-label={isPlaying ? 'Pausar carrusel' : 'Reanudar carrusel'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-gray-400" />
                ) : (
                  <Play className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Grid de Quotes - ESTRUCTURA ORIGINAL COMPLETA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {currentQuotes.map((quote, index) => {
            const colorStyle = getColorStyle(quote.symbol);
            
            return (
              <div
                key={index}
                className="
                  relative 
                  backdrop-blur-sm 
                  rounded-xl 
                  p-4 
                  border border-gray-700/30 
                  transition-all 
                  duration-300 
                  ease-out
                  hover:scale-[1.02] 
                  hover:border-gray-600/50 
                  hover:shadow-xl 
                  hover:shadow-black/20
                  cursor-pointer
                  group
                "
                style={{
                  background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.4), rgba(17, 24, 39, 0.6))'
                }}
              >
                {/* Fondo de color - MANTENGO EL DIV ORIGINAL */}
                <div 
                  className="
                    absolute 
                    top-0 
                    left-0 
                    right-0 
                    bottom-0 
                    rounded-xl 
                    opacity-20 
                    group-hover:opacity-30 
                    transition-opacity 
                    duration-300
                  "
                  style={{ background: colorStyle.background }}
                ></div>
                
                <div className="relative z-10">
                  {/* Header del quote - ESTRUCTURA ORIGINAL */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {/* Dot de color - MANTENGO TAMAÑO ORIGINAL */}
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: colorStyle.dot }}
                      ></div>
                      
                      {/* Nombre con color - MANTENGO ESTILOS ORIGINALES */}
                      <span 
                        className="
                          font-semibold 
                          text-sm 
                          tracking-tight 
                          uppercase
                        "
                        style={{ color: colorStyle.text }}
                      >
                        {quote.symbol}
                      </span>
                    </div>
                    
                    {/* Badge de cambio - MANTENGO ESTILOS EXACTOS */}
                    <div className={`
                      inline-flex 
                      items-center 
                      gap-1 
                      px-2 
                      py-1 
                      rounded-lg 
                      border
                      ${quote.positive 
                        ? 'bg-green-500/20 border-green-500/30 text-green-400' 
                        : 'bg-red-500/20 border-red-500/30 text-red-400'
                      }
                    `}>
                      {quote.positive ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span className="text-xs font-bold font-mono">
                        {quote.change}
                      </span>
                    </div>
                  </div>

                  {/* Precio y detalles - ESTRUCTURA ORIGINAL */}
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="
                        text-2xl 
                        font-black 
                        text-white 
                        tracking-tight 
                        mb-1 
                        font-mono
                        sm:text-3xl
                        lg:text-2xl
                      ">
                        {quote.price}
                      </div>
                      
                      {/* Volume - MANTENGO CONDICIONAL ORIGINAL */}
                      {quote.volume && (
                        <div className="text-gray-400 text-xs font-mono">
                          VOL: {quote.volume}
                        </div>
                      )}
                    </div>
                    
                    {/* Indicador de dirección - MANTENGO TAMAÑOS ORIGINALES */}
                    <div className={`
                      w-8 
                      h-8 
                      rounded-full 
                      flex 
                      items-center 
                      justify-center 
                      text-xl
                      sm:w-10 sm:h-10 sm:text-2xl
                      ${quote.positive 
                        ? 'bg-green-500/10 text-green-400' 
                        : 'bg-red-500/10 text-red-400'
                      }
                    `}>
                      {quote.positive ? '↗' : '↘'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Indicadores de paginación - ESTRUCTURA ORIGINAL COMPLETA */}
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalSets }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSet(i)}
              className={`
                transition-all 
                duration-300 
                ease-out 
                rounded-full 
                border-none 
                cursor-pointer
                hover:bg-gray-500
                ${currentSet === i 
                  ? 'w-4 h-2 bg-blue-500' 
                  : 'w-2 h-2 bg-gray-600'
                }
              `}
              onMouseEnter={(e) => {
                if (currentSet !== i) {
                  e.currentTarget.classList.remove('bg-gray-600');
                  e.currentTarget.classList.add('bg-gray-500');
                }
              }}
              onMouseLeave={(e) => {
                if (currentSet !== i) {
                  e.currentTarget.classList.remove('bg-gray-500');
                  e.currentTarget.classList.add('bg-gray-600');
                }
              }}
              aria-label={`Ir a conjunto ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Barra inferior - MANTENGO ORIGINAL */}
      <div className="
        absolute 
        bottom-0 
        left-0 
        right-0 
        h-0.5
        bg-gradient-to-r from-transparent via-cyan-500 to-transparent
        opacity-30
      "></div>
    </div>
  )
}