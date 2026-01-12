/* notice*/
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

  const handleMouseEnter = useCallback((e) => {
    e.currentTarget.style.transform = 'scale(1.02)'
  }, [])

  const handleMouseLeave = useCallback((e) => {
    e.currentTarget.style.transform = 'scale(1)'
  }, [])

  const handleTitleMouseEnter = useCallback((e) => {
    e.currentTarget.style.color = '#f59e0b'
  }, [])

  const handleTitleMouseLeave = useCallback((e) => {
    e.currentTarget.style.color = '#fbbf24'
  }, [])

  const handleCardMouseEnter = useCallback((e) => {
    e.currentTarget.style.background = 'linear-gradient(to right, rgba(55, 65, 81, 0.3), rgba(31, 41, 55, 0.2))'
    e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)'
  }, [])

  const handleCardMouseLeave = useCallback((e) => {
    e.currentTarget.style.background = 'linear-gradient(to right, rgba(31, 41, 55, 0.2), rgba(17, 24, 39, 0.1))'
    e.currentTarget.style.borderColor = 'rgba(55, 65, 81, 0.3)'
  }, [])

  return (
    <div
      key={index}
      style={{
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div style={{
        background: 'linear-gradient(to right, rgba(31, 41, 55, 0.2), rgba(17, 24, 39, 0.1))',
        borderRadius: '0.75rem',
        border: '1px solid rgba(55, 65, 81, 0.3)',
        padding: '1rem',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={handleCardMouseEnter}
      onMouseLeave={handleCardMouseLeave}
      >
        
        {/* Header de Noticia */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: sourceColor.dot
            }}></div>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '0.25rem 0.5rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(55, 65, 81, 0.5)',
              color: '#d1d5db',
              textTransform: 'uppercase'
            }}>
              {news.source.toUpperCase()}
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>
              {formatTimeAgo(news.time_published)}
            </span>
            <ExternalLink style={{ 
              width: '12px', 
              height: '12px', 
              color: '#6b7280',
              opacity: 0,
              transition: 'all 0.3s ease'
            }} />
          </div>
        </div>

        {/* Título/Resumen de la Noticia */}
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: 700,
          marginBottom: '0.5rem',
          lineHeight: '1.25',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          color: '#fbbf24',
          transition: 'color 0.3s ease'
        }}
        onMouseEnter={handleTitleMouseEnter}
        onMouseLeave={handleTitleMouseLeave}
        >
          {news.title}
        </h3>

        {/* Footer de Noticia */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: 500 }}>
              {news.category}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#22c55e' }}>
              <TrendingUp style={{ width: '12px', height: '12px' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>ACTUAL</span>
            </div>
          </div>
          
          {/* Indicador de fuente */}
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <div style={{ width: '6px', height: '6px', backgroundColor: '#22c55e', borderRadius: '50%' }}></div>
            <div style={{ width: '6px', height: '6px', backgroundColor: '#3b82f6', borderRadius: '50%' }}></div>
          </div>
        </div>
      </div>

      {/* Separador elegante */}
      {index < totalItems - 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.75rem' }}>
          <div style={{ 
            width: '4rem', 
            height: '1px', 
            background: 'linear-gradient(to right, transparent, #4b5563, transparent)' 
          }}></div>
        </div>
      )}
    </div>
  )
})

// Componente para loading skeleton
const LoadingSkeleton = React.memo(() => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1.5rem',
      padding: '1rem',
      background: 'linear-gradient(to right, rgba(31, 41, 55, 0.3), rgba(17, 24, 39, 0.2))',
      borderRadius: '0.75rem',
      border: '1px solid rgba(55, 65, 81, 0.3)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <RefreshCw style={{ width: '16px', height: '16px', color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
        <span style={{ color: 'white', fontWeight: 700, fontSize: '0.875rem' }}>CARGANDO NOTICIAS...</span>
      </div>
    </div>

    {[1, 2, 3, 4, 5, 6].map((item) => (
      <div key={item} style={{ opacity: 0.5, animation: 'pulse 2s infinite' }}>
        <div style={{
          background: 'linear-gradient(to right, rgba(31, 41, 55, 0.2), rgba(17, 24, 39, 0.1))',
          borderRadius: '0.75rem',
          border: '1px solid rgba(55, 65, 81, 0.3)',
          padding: '1rem',
          height: '6rem',
          marginBottom: '0.75rem'
        }}></div>
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

  const handleRefreshMouseEnter = useCallback((e) => {
    e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.5)'
    e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.5)'
  }, [])

  const handleRefreshMouseLeave = useCallback((e) => {
    e.currentTarget.style.borderColor = 'rgba(55, 65, 81, 0.5)'
    e.currentTarget.style.backgroundColor = 'rgba(31, 41, 55, 0.5)'
  }, [])

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      {/* Header Mejorado */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        padding: '1rem',
        background: 'linear-gradient(to right, rgba(31, 41, 55, 0.3), rgba(17, 24, 39, 0.2))',
        borderRadius: '0.75rem',
        border: '1px solid rgba(55, 65, 81, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              width: '12px',
              height: '12px',
              backgroundColor: '#ef4444',
              borderRadius: '50%',
              animation: 'ping 1.5s infinite'
            }}></div>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#ef4444',
              borderRadius: '50%'
            }}></div>
          </div>
          <span style={{ color: 'white', fontWeight: 700, fontSize: '0.875rem' }}>
            NOTICIAS FINANCIERAS EN TIEMPO REAL
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            color: '#9ca3af', 
            fontSize: '0.75rem', 
            fontFamily: 'monospace'
          }}>
            {formattedTime}
          </div>
          <button
            onClick={handleRefreshClick}
            disabled={isLoading}
            style={{
              padding: '0.375rem',
              borderRadius: '0.5rem',
              backgroundColor: 'rgba(31, 41, 55, 0.5)',
              border: '1px solid rgba(55, 65, 81, 0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={handleRefreshMouseEnter}
            onMouseLeave={handleRefreshMouseLeave}
          >
            <RefreshCw style={{ 
              width: '16px', 
              height: '16px', 
              color: '#9ca3af',
              animation: isLoading ? 'spin 1s linear infinite' : 'none'
            }} />
          </button>
        </div>
      </div>

      {/* Lista de Noticias Mejorada */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {newsData.map((news, index) => (
          <NewsItem
            key={`${news.source}-${news.title.substring(0, 20)}-${index}`}
            news={news}
            index={index}
            totalItems={newsData.length}
            getSourceColor={getSourceColor}
            formatTimeAgo={formatTimeAgo}
          />
        ))}
      </div>
    </div>
  )
}