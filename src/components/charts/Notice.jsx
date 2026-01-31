import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { Clock, ExternalLink, TrendingUp, Zap, AlertTriangle, RefreshCw } from 'lucide-react'
import { fetchLatestNews } from '../../api/newsApi'

// Mover constantes fuera del componente
const SOURCE_COLORS = {
  'Bloomberg': { dot: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)' },
  'Infobae Economía': { dot: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444, #ec4899)' },
  'TN Economía': { dot: '#f97316', gradient: 'linear-gradient(135deg, #f97316, #f59e0b)' },
  'Yahoo Finance': { dot: '#a855f7', gradient: 'linear-gradient(135deg, #a855f7, #8b5cf6)' },
  'Reuters': { dot: '#eab308', gradient: 'linear-gradient(135deg, #eab308, #f97316)' }
}

const DEFAULT_COLOR = { dot: '#6b7280', gradient: 'linear-gradient(135deg, #6b7280, #4b5563)' }

// Componente memoizado para items de noticias
const NewsItem = React.memo(({ news, index, totalItems, getSourceColor, formatTimeAgo }) => {
  const sourceColor = useMemo(() => getSourceColor(news.source), [news.source, getSourceColor])
  
  const handleClick = useCallback(() => {
    window.open(news.url, '_blank', 'noopener,noreferrer')
  }, [news.url])

  return (
    <div
      key={index}
      className="cursor-pointer transition-all duration-300 hover:scale-[1.02]"
      onClick={handleClick}
    >
      <div className="bg-gradient-to-r from-gray-800/20 to-gray-900/10 rounded-xl border border-gray-700/30 p-4 transition-all duration-300 hover:bg-gradient-to-r hover:from-gray-700/30 hover:to-gray-800/20 hover:border-cyan-500/30 min-w-0">
        
        {/* Header de Noticia */}
        <div className="flex items-start justify-between mb-3 min-w-0">
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: sourceColor.dot }}
            ></div>
            <span className="text-xs font-semibold px-2 py-1 bg-gray-700/50 text-gray-300 rounded-full uppercase">
              {news.source.toUpperCase()}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-xs">
              {formatTimeAgo(news.time_published)}
            </span>
            <ExternalLink className="w-3 h-3 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Título/Resumen de la Noticia */}
        <h3 className="text-lg font-bold mb-2 line-clamp-2 leading-snug text-yellow-400 hover:text-yellow-300 transition-colors duration-300 group">
          {news.title}
        </h3>

        {/* Footer de Noticia */}
        <div className="flex items-center justify-between min-w-0">
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-xs font-medium">
              {news.category}
            </span>
            <div className="flex items-center gap-1 text-green-500">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs font-semibold">ACTUAL</span>
            </div>
          </div>
          
          {/* Indicador de fuente */}
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Separador elegante */}
      {index < totalItems - 1 && (
        <div className="flex justify-center mt-3">
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
        </div>
      )}
    </div>
  )
})

// Componente para loading skeleton
const LoadingSkeleton = React.memo(() => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded-xl border border-gray-700/30">
      <div className="flex items-center gap-3">
        <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
        <span className="text-white font-bold text-sm">CARGANDO NOTICIAS...</span>
      </div>
    </div>

    {[1, 2, 3, 4, 5, 6].map((item) => (
      <div key={item} className="opacity-50 animate-pulse">
        <div className="bg-gradient-to-r from-gray-800/20 to-gray-900/10 rounded-xl border border-gray-700/30 p-4 h-24 mb-3"></div>
      </div>
    ))}
  </div>
))

// Optimizar la función formatTimeAgo
const formatTimeAgo = (timestamp) => {
  if (!timestamp) return ''
  
  let fecha
  
  try {
    // Si ya es un Date válido
    if (timestamp instanceof Date && !isNaN(timestamp)) {
      fecha = timestamp
    } else if (typeof timestamp === 'string') {
      // Formato Alpha Vantage: "20251216T210943"
      if (/^\d{8}T\d{6}$/.test(timestamp)) {
        const year = timestamp.substring(0, 4)
        const month = timestamp.substring(4, 6)
        const day = timestamp.substring(6, 8)
        const hour = timestamp.substring(9, 11)
        const minute = timestamp.substring(11, 13)
        const second = timestamp.substring(13, 15)
        fecha = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`)
      } else {
        fecha = new Date(timestamp)
      }
    } else if (typeof timestamp === 'number') {
      fecha = new Date(timestamp)
    } else {
      return 'Reciente'
    }
    
    if (isNaN(fecha.getTime())) {
      return 'Reciente'
    }
    
    const ahora = new Date()
    const diffMs = ahora - fecha
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffMins < 1) return 'Ahora'
    if (diffMins < 60) return `Hace ${diffMins}m`
    if (diffHours < 24) return `Hace ${diffHours}h`
    if (diffDays < 30) return `Hace ${diffDays}d`
    
    return fecha.toLocaleDateString('es-AR', { 
      day: '2-digit', 
      month: 'short' 
    }).replace('.', '')
    
  } catch (error) {
    return 'Reciente'
  }
}

export function Notice() {
  const [newsData, setNewsData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const intervalRef = useRef(null)

  // Memoizar la función getSourceColor
  const getSourceColor = useCallback((source) => {
    return SOURCE_COLORS[source] || DEFAULT_COLOR
  }, [])

  // Memoizar loadNews para no recrearla
  const loadNews = useCallback(async () => {
    setIsLoading(true)
    try {
      const news = await fetchLatestNews()
      setNewsData(news)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Error loading news:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Setup interval effect
  useEffect(() => {
    loadNews()
    
    intervalRef.current = setInterval(loadNews, 300000)
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [loadNews])

  // Memoizar handlers del botón refresh
  const handleRefreshClick = useCallback(() => {
    if (!isLoading) {
      loadNews()
    }
  }, [isLoading, loadNews])

  // Memoizar formatted time
  const formattedTime = useMemo(() => 
    lastUpdate.toLocaleTimeString('es-AR', { 
      hour: '2-digit', 
      minute: '2-digit'
    }), 
    [lastUpdate]
  )

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="flex flex-col gap-1 min-w-0">
      {/* Header Mejorado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 p-4 bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded-xl border border-gray-700/30 min-w-0">
        <div className="flex items-center gap-3 mb-2 sm:mb-0">
          <div className="relative">
            <div className="absolute w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          </div>
          <span className="text-white font-bold text-sm">
            NOTICIAS FINANCIERAS EN TIEMPO REAL
          </span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="text-gray-400 text-xs font-mono">
            {formattedTime}
          </div>
          <button
            onClick={handleRefreshClick}
            disabled={isLoading}
            className="p-1.5 rounded-lg bg-gray-800/50 border border-gray-600/50 hover:bg-gray-700/50 hover:border-gray-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Lista de Noticias Mejorada */}
      <div className="flex flex-col gap-3">
        {newsData.map((news, index) => (
          <div key={`${news.source}-${news.title.substring(0, 20)}-${index}`} className="group">
            <NewsItem
              news={news}
              index={index}
              totalItems={newsData.length}
              getSourceColor={getSourceColor}
              formatTimeAgo={formatTimeAgo}
            />
          </div>
        ))}
      </div>

      {/* Footer informativo */}
      <div className="mt-4 pt-4 border-t border-gray-700/30">
        <div className="text-gray-500 text-xs text-center">
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-3 h-3" />
            <span>Actualizado cada 5 minutos • Fuentes: Bloomberg, Reuters, Yahoo Finance</span>
          </div>
        </div>
      </div>
    </div>
  )
}