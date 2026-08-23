// LiveStreamsGrid.jsx - VERSIÓN COMPLETA REESCRITA
import React, { useState, useCallback, useMemo } from 'react'
import { streams, getYouTubeEmbedUrl } from '../../utils/youtubeProxy'

// STREAM CARD CON RESTRICCIONES DE ANCHO
const StreamCard = React.memo(({ stream, onLoad, onError, onRetry, streamState }) => {
  const { id, videoId, title } = stream
  const { hasLoaded, hasError, retryCount } = streamState
  
  const embedUrl = useMemo(() => getYouTubeEmbedUrl(videoId), [videoId])
  
  const isLoading = hasLoaded === undefined
  const currentRetry = retryCount || 0

  const handleLoad = useCallback(() => {
    onLoad(id)
  }, [id, onLoad])

  const handleError = useCallback(() => {
    onError(id)
  }, [id, onError])

  const handleRetry = useCallback((e) => {
    e.stopPropagation()
    onRetry(id, videoId)
  }, [id, videoId, onRetry])

  const handleOpenYouTube = useCallback(() => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank')
  }, [videoId])

  return (
    <div className="terminal-card p-0 overflow-hidden group hover:border-blue-500/30 transition-all duration-300 min-w-0">
      <div className="aspect-video min-h-[180px] bg-gray-900 relative w-full">
        
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-gray-400 text-sm">Cargando stream...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {hasError && currentRetry < 3 && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 flex-col p-4">
            <div className="text-yellow-400 text-3xl mb-2">⚠️</div>
            <p className="text-gray-400 text-sm text-center mb-3">
              Error cargando el stream
            </p>
            <button 
              className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
              onClick={handleRetry}
            >
              Reintentar ({3 - currentRetry} intentos)
            </button>
          </div>
        )}

        {/* Permanent Error */}
        {hasError && currentRetry >= 3 && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 flex-col p-4">
            <div className="text-red-400 text-3xl mb-2">❌</div>
            <p className="text-gray-400 text-sm text-center">
              Stream no disponible
            </p>
            <button 
              className="mt-2 px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
              onClick={handleOpenYouTube}
            >
              Ver en YouTube
            </button>
          </div>
        )}

        {/* IFRAME - ANCHO RESPONSIVO */}
        <iframe
          id={`iframe-${id}`}
          src={embedUrl}
          title={title}
          className={`w-full h-full max-w-full ${hasError ? 'hidden' : 'block'}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          frameBorder="0"
          onLoad={handleLoad}
          onError={handleError}
          referrerPolicy="strict-origin-when-cross-origin"
          key={`${embedUrl}-${currentRetry}`}
        />
      </div>
      
      {/* FOOTER CON TÍTULO NO TRUNCADO */}
      <div className="p-3 sm:p-4 border-t border-gray-700 min-w-0">
        <div className="flex items-center justify-between min-w-0">
          <h3 className="text-white font-semibold text-sm sm:text-base flex-1 mr-2 break-words line-clamp-2 min-w-0">
            {title}
          </h3>
          <div className={`text-xs px-2 py-1 rounded flex-shrink-0 ${
            hasError ? 'bg-red-500/20 text-red-400' : 
            isLoading ? 'bg-blue-500/20 text-blue-400' : 
            'bg-green-500/20 text-green-400'
          }`}>
            {hasError ? 'ERROR' : isLoading ? 'CARGANDO' : 'EN VIVO'}
          </div>
        </div>
      </div>
    </div>
  )
})

export function LiveStreamsGrid() {
  // Estado estructurado
  const [streamsState, setStreamsState] = useState(() => {
    const initialState = {}
    streams.forEach(stream => {
      initialState[stream.id] = {
        hasLoaded: undefined,
        hasError: false,
        retryCount: 0
      }
    })
    return initialState
  })

  // Handlers memoizados
  const handleLoad = useCallback((streamId) => {
    setStreamsState(prev => ({
      ...prev,
      [streamId]: {
        ...prev[streamId],
        hasLoaded: true,
        hasError: false
      }
    }))
  }, [])

  const handleError = useCallback((streamId) => {
    setStreamsState(prev => ({
      ...prev,
      [streamId]: {
        ...prev[streamId],
        hasLoaded: false,
        hasError: true,
        retryCount: (prev[streamId]?.retryCount || 0) + 1
      }
    }))
  }, [])

  const handleRetry = useCallback((streamId) => {
    setStreamsState(prev => ({
      ...prev,
      [streamId]: {
        ...prev[streamId],
        hasLoaded: undefined,
        hasError: false
      }
    }))
  }, [])

  return (
    <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-gray-700/50 min-w-0">
      <div className="text-center mb-4 md:mb-6">
        <h2 className="text-white text-xl md:text-2xl font-bold inline-flex items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900 px-4 md:px-8 py-3 md:py-4 rounded-xl shadow-lg">
          <span className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full mr-2 md:mr-3 animate-pulse"></span>
          📺 TRANSMISIONES EN VIVO
        </h2>
      </div>
      
      {/* GRID MÁS COMPACTO - MÁS COLUMNAS */}
      <div className="@container">
        <div className="grid grid-cols-2 @[480px]:grid-cols-3 @[768px]:grid-cols-4 @[1024px]:grid-cols-5 @[1280px]:grid-cols-6 gap-2 md:gap-3 lg:gap-4 min-w-0">
          {streams.map((stream) => (
            <StreamCard
              key={stream.id}
              stream={stream}
              streamState={streamsState[stream.id]}
              onLoad={handleLoad}
              onError={handleError}
              onRetry={handleRetry}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
