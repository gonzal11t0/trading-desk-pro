import React, { useState, useCallback, useMemo } from 'react'
import { streams, getYouTubeEmbedUrl } from '../../utils/youtubeProxy'

// Componente memoizado para cada stream
const StreamCard = React.memo(({ 
  stream, 
  onLoad, 
  onError,
  onRetry,
  streamState 
}) => {
  const { id, videoId, title } = stream
  const { hasLoaded, hasError, retryCount } = streamState
  
  const embedUrl = useMemo(() => 
    getYouTubeEmbedUrl(videoId), 
    [videoId]
  )
  
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
    <div 
      className="terminal-card p-0 overflow-hidden group hover:border-blue-500/30 transition-all duration-300"
    >
      <div className="aspect-video min-h-[200px] bg-gray-900 relative">
        
        {/* Loading State */}
        {isLoading && (
          <StreamLoading />
        )}

        {/* Error State */}
        {hasError && currentRetry < 3 && (
          <StreamError 
            retryCount={currentRetry}
            onRetry={handleRetry}
          />
        )}

        {/* Permanent Error */}
        {hasError && currentRetry >= 3 && (
          <StreamPermanentError onOpenYouTube={handleOpenYouTube} />
        )}

        <iframe
          id={`iframe-${id}`}
          src={embedUrl}
          title={title}
          className={`w-full h-full ${hasError ? 'hidden' : 'block'}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          frameBorder="0"
          onLoad={handleLoad}
          onError={handleError}
          referrerPolicy="strict-origin-when-cross-origin"
          key={`${embedUrl}-${currentRetry}`} // Forzar recarga cuando cambia retryCount
        />
      </div>
      
      <StreamFooter 
        title={title}
        hasError={hasError}
        isLoading={isLoading}
      />
    </div>
  )
})

// Componentes auxiliares memoizados
const StreamLoading = React.memo(() => (
  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
      <p className="text-gray-400 text-sm">Cargando stream...</p>
    </div>
  </div>
))

const StreamError = React.memo(({ retryCount, onRetry }) => (
  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 flex-col p-4">
    <div className="text-yellow-400 text-3xl mb-2">⚠️</div>
    <p className="text-gray-400 text-sm text-center mb-3">
      Error cargando el stream
    </p>
    <button 
      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
      onClick={onRetry}
    >
      Reintentar ({3 - retryCount} intentos)
    </button>
  </div>
))

const StreamPermanentError = React.memo(({ onOpenYouTube }) => (
  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 flex-col p-4">
    <div className="text-red-400 text-3xl mb-2">❌</div>
    <p className="text-gray-400 text-sm text-center">
      Stream no disponible
    </p>
    <button 
      className="mt-2 px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
      onClick={onOpenYouTube}
    >
      Ver en YouTube
    </button>
  </div>
))

const StreamFooter = React.memo(({ title, hasError, isLoading }) => (
  <div className="p-4 border-t border-gray-700">
    <div className="flex items-center justify-between">
      <h3 className="text-white font-semibold text-sm truncate flex-1 mr-2">
        {title}
      </h3>
      <div className={`text-xs px-2 py-1 rounded ${
        hasError ? 'bg-red-500/20 text-red-400' : 
        isLoading ? 'bg-blue-500/20 text-blue-400' : 
        'bg-green-500/20 text-green-400'
      }`}>
        {hasError ? 'ERROR' : isLoading ? 'CARGANDO' : 'EN VIVO'}
      </div>
    </div>
  </div>
))

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

  const handleRetry = useCallback((streamId, videoId) => {
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
    <div className="section-bg rounded-xl p-6">
      <div className="text-center mb-8">
        <h2 className="text-white text-xl font-bold inline-flex items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900 px-8 py-4 rounded-xl shadow-lg">
          <span className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse"></span>
          📺 TRANSMISIONES EN VIVO
        </h2>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
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
  )
}
