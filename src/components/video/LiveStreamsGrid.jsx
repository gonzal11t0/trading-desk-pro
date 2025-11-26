import React from 'react'
import { streams, getYouTubeEmbedUrl } from '../../utils/youtubeProxy'

export function LiveStreamsGrid() {
  const [loadedStreams, setLoadedStreams] = React.useState({})
  const [retryCount, setRetryCount] = React.useState({})

  const handleLoad = (streamId) => {
    setLoadedStreams(prev => ({ ...prev, [streamId]: true }))
  }

  const handleError = (streamId) => {
    setLoadedStreams(prev => ({ ...prev, [streamId]: false }))
    setRetryCount(prev => ({ ...prev, [streamId]: (prev[streamId] || 0) + 1 }))
  }

  const retryStream = (streamId, videoId, event) => {
    event.stopPropagation()
    const iframe = document.getElementById(`iframe-${streamId}`)
    if (iframe) {
      const newUrl = getYouTubeEmbedUrl(videoId) + `&retry=${Date.now()}`
      iframe.src = newUrl
    }
  }

  return (
    
    <div className="section-bg rounded-xl p-6">
      <div className="text-center mb-8">
        <h2 className="text-white text-xl font-bold inline-flex items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900 px-8 py-4 rounded-xl  shadow-lg">
          <span className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse"></span>
          📺 TRANSMISIONES EN VIVO
        </h2>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        {streams.map((stream) => {
          const embedUrl = getYouTubeEmbedUrl(stream.videoId)
          const hasError = loadedStreams[stream.id] === false
          const isLoading = loadedStreams[stream.id] === undefined
          const currentRetry = retryCount[stream.id] || 0

          return (
            <div 
              key={stream.id} 
              className="terminal-card p-0 overflow-hidden group hover:border-blue-500/30 transition-all duration-300"
            >
              <div className="aspect-video min-h-[200px] bg-gray-900 relative">
                
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
                      onClick={(e) => retryStream(stream.id, stream.videoId, e)}
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
                      onClick={() => window.open(`https://www.youtube.com/watch?v=${stream.videoId}`, '_blank')}
                    >
                      Ver en YouTube
                    </button>
                  </div>
                )}
                <iframe
                  id={`iframe-${stream.id}`}
                  src={embedUrl}
                  title={stream.title}
                  className={`w-full h-full ${hasError ? 'hidden' : 'block'}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  frameBorder="0"
                  onLoad={() => handleLoad(stream.id)}
                  onError={() => handleError(stream.id)}
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
              
              <div className="p-4 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold text-sm truncate flex-1 mr-2">
                    {stream.title}
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
            </div>
          )
        })}
      </div>
    </div>
  )
}