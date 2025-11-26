import React, { useEffect, useRef, useState } from 'react'
import { ExternalLink, Maximize2, BarChart3, RefreshCw, Play, Pause } from 'lucide-react'

export function TradingViewCharts() {
  const chartsInitialized = useRef(false)
  const [isRefreshing, setIsRefreshing] = useState({})
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Configuración de gráficos
  const chartConfigs = [
    {
      id: 'btc-usd',
      symbol: 'BINANCE:BTCUSDT',
      title: 'Bitcoin / USD',
      description: 'BTCUSD - Binance',
      timeframe: '1D',
      directLink: 'https://www.tradingview.com/chart/?symbol=BINANCE:BTCUSDT',
      category: 'crypto',
      color: 'from-orange-500 to-yellow-500'
    },
    {
      id: 'spy-etf',
      symbol: 'AMEX:SPY',
      title: 'SPDR S&P 500 ETF',
      description: 'SPY ETF - S&P 500',
      timeframe: '1D',
      directLink: 'https://www.tradingview.com/chart/?symbol=AMEX:SPY',
      category: 'etf',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'aapl',
      symbol: 'NASDAQ:AAPL',
      title: 'Apple Inc.',
      description: 'NASDAQ:AAPL',
      timeframe: '1D',
      directLink: 'https://www.tradingview.com/chart/?symbol=NASDAQ:AAPL',
      category: 'tech',
      color: 'from-gray-500 to-gray-400'
    },
    {
      id: 'merval-byma',
      symbol: 'BYMA:IMV',
      title: 'MERVAL Argentina',
      description: 'BYMA:IMV',
      timeframe: '1D',
      directLink: 'https://www.tradingview.com/chart/?symbol=BYMA:IMV',
      category: 'index',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'gold',
      symbol: 'TVC:GOLD',
      title: 'Gold Spot',
      description: 'Gold Futures',
      timeframe: '1D',
      directLink: 'https://www.tradingview.com/chart/?symbol=TVC:GOLD',
      category: 'commodity',
      color: 'from-yellow-500 to-amber-500'
    },
    {
      id: 'tsla',
      symbol: 'NASDAQ:TSLA',
      title: 'Tesla Inc.',
      description: 'NASDAQ:TSLA',
      timeframe: '1D',
      directLink: 'https://www.tradingview.com/chart/?symbol=NASDAQ:TSLA',
      category: 'tech',
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'ggal-usd',
      symbol: 'NASDAQ:GGAL',
      title: 'Grupo Financiero Galicia',
      description: 'GGAL - ADR USD',
      timeframe: '1D',
      directLink: 'https://www.tradingview.com/chart/?symbol=NASDAQ:GGAL',
      category: 'finance',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: 'meliusd',
      symbol: 'NASDAQ:MELI',
      title: 'Mercado Libre',
      description: 'MELI - NASDAQ USD',
      timeframe: '1D',
      directLink: 'https://www.tradingview.com/chart/?symbol=NASDAQ:MELI',
      category: 'tech',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'ypf-usd',
      symbol: 'NYSE:YPF',
      title: 'YPF Sociedad Anónima',
      description: 'YPF - ADR USD',
      timeframe: '1D',
      directLink: 'https://www.tradingview.com/chart/?symbol=NYSE:YPF',
      category: 'energy',
      color: 'from-blue-500 to-blue-600'
    }
  ]

  // Función para inicializar un gráfico individual
  const initializeChart = (chartConfig) => {
    const container = document.getElementById(`tradingview_${chartConfig.id}`)
    if (!container) return

    // Limpiar contenedor primero
    container.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.async = true
    script.type = 'text/javascript'
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: chartConfig.symbol,
      interval: chartConfig.timeframe === '1D' ? 'D' : '240',
      timezone: "America/Argentina/Buenos_Aires",
      theme: "dark",
      style: "1",
      locale: "es",
      toolbar_bg: "#1A1A1A",
      enable_publishing: false,
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: true,
      container_id: `tradingview_${chartConfig.id}`,
      studies: [
        "RSI@tv-basicstudies",
        "MACD@tv-basicstudies"
      ]
    })

    container.appendChild(script)
  }

  // Inicializar todos los gráficos
  const initializeAllCharts = () => {
    if (chartsInitialized.current) return

    chartConfigs.forEach(chartConfig => {
      setTimeout(() => {
        initializeChart(chartConfig)
      }, 200)
    })

    chartsInitialized.current = true
  }

  // Recargar un gráfico específico
  const reloadChart = (chartId) => {
    setIsRefreshing(prev => ({ ...prev, [chartId]: true }))
    
    const chartConfig = chartConfigs.find(c => c.id === chartId)
    if (chartConfig) {
      initializeChart(chartConfig)
    }
    
    setTimeout(() => {
      setIsRefreshing(prev => ({ ...prev, [chartId]: false }))
    }, 1500)
  }

  // Recargar todos los gráficos
  const reloadAllCharts = () => {
    chartConfigs.forEach(chart => {
      reloadChart(chart.id)
    })
  }

  useEffect(() => {
    const mainScript = document.createElement('script')
    mainScript.src = 'https://s3.tradingview.com/tv.js'
    mainScript.async = true
    mainScript.onload = () => {
      setTimeout(initializeAllCharts, 1000)
    }
    
    document.head.appendChild(mainScript)

    // Auto-refresh cada 5 minutos si está activado
    const autoRefreshInterval = autoRefresh ? setInterval(reloadAllCharts, 300000) : null

    return () => {
      if (document.head.contains(mainScript)) {
        document.head.removeChild(mainScript)
      }
      if (autoRefreshInterval) clearInterval(autoRefreshInterval)
    }
  }, [autoRefresh])

  const openTradingView = (directLink) => {
    window.open(directLink, '_blank', 'noopener,noreferrer')
  }

  // Dividir en filas de 3 gráficos
  const rows = []
  for (let i = 0; i < chartConfigs.length; i += 3) {
    rows.push(chartConfigs.slice(i, i + 3))
  }

  const getCategoryIcon = (category) => {
    const icons = {
      crypto: '₿',
      etf: '📊',
      tech: '💻',
      index: '📈',
      commodity: '⚜️',
      finance: '🏦',
      energy: '⚡'
    }
    return icons[category] || '📈'
  }

  return (
    <div className="section-bg rounded-xl p-6 mt-6 w-full border border-gray-700/50 shadow-2xl">

      {/* Controles Globales */}
      <div className="flex items-center justify-between mb-6 p-4 rounded-xl bg-gradient-to-r from-gray-800/40 to-gray-900/40 border border-gray-700/30">      
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-300 ${
              autoRefresh 
                ? 'bg-green-500/20 border-green-500/30 text-green-400' 
                : 'bg-gray-700/50 border-gray-600/30 text-gray-400'
            }`}
          >
            {autoRefresh ? (
              <Play className="w-3 h-3" />
            ) : (
              <Pause className="w-3 h-3" />
            )}
            <span className="text-xs font-semibold">
              AUTO-REFRESH
            </span>
          </button>
          
          <button
            onClick={reloadAllCharts}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-all duration-300"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="text-xs font-semibold">RECARGAR TODO</span>
          </button>
        </div>
      </div>

      {/* Grid de Gráficos Premium */}
      <div className="space-y-6">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-3 gap-6">
            {row.map((chart) => (
              <div 
                key={chart.id}
                className="group relative rounded-xl overflow-hidden border border-gray-700/50 bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm transition-all duration-500 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10 hover:scale-[1.02]"
              >
                
                {/* Efecto de fondo sutil */}
                <div className={`absolute inset-0 bg-gradient-to-r ${chart.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  {/* Header del Gráfico Mejorado */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-900/30">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className={`text-lg ${chart.color.includes('yellow') ? 'text-yellow-400' : 'text-white'}`}>
                        {getCategoryIcon(chart.category)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-white font-bold text-sm truncate">
                          {chart.title}
                        </h3>
                        <p className="text-gray-400 text-xs truncate">
                          {chart.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">

                      
                      <button
                        onClick={() => openTradingView(chart.directLink)}
                        className="p-1.5 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-110"
                        title="Abrir en TradingView"
                      >
                        <ExternalLink className="w-3 h-3 text-gray-400 hover:text-blue-400" />
                      </button>
                    </div>
                  </div>

                  {/* Contenedor del Gráfico Mejorado */}
                  <div className="aspect-video bg-gray-900 relative min-h-[280px]">
                    <div 
                      id={`tradingview_${chart.id}`}
                      className="tradingview-widget-container w-full h-full"
                    >
                      {/* Estado de carga mejorado */}
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-b-lg">
                        <div className="text-center p-6">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-3"></div>
                          <p className="text-gray-300 font-semibold text-sm mb-1">Cargando Análisis</p>
                          <p className="text-gray-400 text-xs">{chart.symbol}</p>
                          <div className="flex justify-center mt-3 space-x-1">
                            {[...Array(3)].map((_, i) => (
                              <div key={i} className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Overlay de interacción premium */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => openTradingView(chart.directLink)}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-5 py-3 rounded-xl flex items-center space-x-2 transition-all duration-300 transform scale-90 group-hover:scale-100 shadow-2xl"
                      >
                        <Maximize2 className="w-4 h-4" />
                        <span className="text-sm font-bold">Pantalla Completa</span>
                      </button>
                    </div>
                  </div>

                  {/* Footer del Gráfico Mejorado */}
                  <div className="p-3 bg-gradient-to-r from-gray-800/40 to-gray-900/20 border-t border-gray-700/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-gray-400 text-xs font-mono truncate max-w-[120px]">
                          {chart.symbol}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-500 text-xs">
                        <span>TRADINGVIEW</span>
                        <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                        <span>LIVE</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`absolute top-3 right-3 w-2 h-2 rounded-full border border-white/50 bg-gradient-to-r ${chart.color}`}></div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="border-b-25 border-transparent"></div>

    </div>
  )
}