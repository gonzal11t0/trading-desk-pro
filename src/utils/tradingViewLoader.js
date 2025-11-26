// src/utils/tradingViewLoader.js
export const initializeTradingViewCharts = () => {
  const chartConfigs = [
    {
      containerId: 'tradingview_btc-usd',
      symbol: 'BINANCE:BTCUSDT',
      interval: 'D'
    },
    {
      containerId: 'tradingview_spx', 
      symbol: 'SP:SPX',
      interval: 'D'
    },
    {
      containerId: 'tradingview_aapl',
      symbol: 'NASDAQ:AAPL', 
      interval: 'D'
    },
    {
      containerId: 'tradingview_eur-usd',
      symbol: 'FX:EURUSD',
      interval: '4H'
    },
    {
      containerId: 'tradingview_gold',
      symbol: 'TVC:GOLD',
      interval: 'D'
    },
    {
      containerId: 'tradingview_tsla',
      symbol: 'NASDAQ:TSLA',
      interval: 'D'
    }
  ]

  chartConfigs.forEach(config => {
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.async = true
    script.type = 'text/javascript'
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: config.symbol,
      interval: config.interval,
      timezone: "America/Argentina/Buenos_Aires",
      theme: "dark",
      style: "1",
      locale: "es",
      toolbar_bg: "#1A1A1A",
      enable_publishing: false,
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: true,
      container_id: config.containerId,
      studies: [
        "RSI@tv-basicstudies",
        "MACD@tv-basicstudies"
      ]
    })
    const container = document.getElementById(config.containerId)
    if (container) {
      container.appendChild(script)
    }
  })
}