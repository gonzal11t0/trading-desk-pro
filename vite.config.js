import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/bundle-analysis.html',
      open: false,
      template: 'treemap',
      gzipSize: true
    })
  ],
  
  server: {
    port: 5173,
    host: true,
    proxy: {
       // BLOQUEADOR DE TRADINGVIEW - DEBE IR PRIMERO
    '/support/support-portal-problems': {
      target: 'http://localhost:5173', // Redirige a localhost (fallará silenciosamente)
      changeOrigin: true,
      router: () => 'http://localhost:5173', // Fuerza redirección a localhost
      selfHandleResponse: true,
      configure: (proxy) => {
        proxy.on('proxyRes', (proxyRes, req, res) => {
          // Devuelve una respuesta 200 vacía inmediatamente
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          });
          res.end(JSON.stringify({ blocked: true, message: 'TradingView bloqueado' }));
        });
      }
    },
    
    '/telemetry.tradingview.com': {
      target: 'http://localhost:5173',
      changeOrigin: true,
      router: () => 'http://localhost:5173',
      selfHandleResponse: true,
      configure: (proxy) => {
        proxy.on('proxyRes', (proxyRes, req, res) => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true }));
        });
      }
    },
        '/api/coingecko': {
        target: 'https://api.coingecko.com/api/v3',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/coingecko/, '')
      },
      '/api/argentinadatos': {
        target: 'https://mercados.ambito.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/argentina-datos/, '')
      },
      '/api/estadisticasbcra': {
        target: 'https://api.estadisticasbcra.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/estadisticasbcra/, '')
      },
      '/api/bcrae': {
        target: 'https://api.bcra.gob.ar/estadisticas/v4.0',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/bcra/, '')
      },
      '/api/argentina-datos': {
        target: 'https://api.argentinadatos.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/argentina-datos/, '/v1')
      },
      '/api/argenstats': {
        target: 'https://argenstats.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/argenstats/, '/api/v1'),
        secure: false,
        headers: {
          'Authorization': 'Bearer as_prod_2LPhBgR8GnCZv6SAuH9fosOLJcMNoqjF',
          'X-API-Key': 'as_prod_2LPhBgR8GnCZv6SAuH9fosOLJcMNoqjF'
        }
      },
      '/api/dolarito': {
        target: 'https://www.dolarito.ar',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/dolarito/, ''),
        secure: false
      },
      '/api/bcra': {
        target: 'https://api.estadisticasbcra.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/bcra/, ''),
        secure: false
      },
      '/api/bluelytics': {
        target: 'https://api.bluelytics.com.ar',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/bluelytics/, ''),
        secure: false
      },
      '/api/yahoo': {
        target: 'https://query1.finance.yahoo.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/yahoo/, ''),
        secure: false
      },
      '/api/dolarsi': {
        target: 'https://www.dolarsi.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/dolarsi/, ''),
        secure: false
      },
      '/youtube-proxy': {
        target: 'https://www.youtube.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/youtube-proxy/, '')
      },
      '/api/argentina': {
        target: 'https://api.bluelytics.com.ar/v2',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/argentina/, '')
      },
      '/api/rss-proxy': {
        target: 'https://api.allorigins.win',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/rss-proxy/, '/get')
      },
      '/api/newsapi': {
        target: 'https://newsapi.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/newsapi/, '/v2')
      },
      '/api/cedears': {
        target: 'https://api.financialmodelingprep.com/v3',
        changeOrigin: true
      },
      '/api/eoddata': {
  target: 'https://api.eoddata.com',
  changeOrigin: true,
  rewrite: (path) => path.replace(/^\/api\/eoddata/, '')
  // ELIMINA el bloque 'configure' - no funciona así en Vite
}
    }
  },
  
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Chunking optimizado para React 19
          if (id.includes('node_modules')) {
  // Chunks específicos por librería
  if (id.includes('jspdf')) return 'vendor-pdf'
  if (id.includes('recharts')) return 'vendor-charts'
  if (id.includes('@dnd-kit')) return 'vendor-dnd'
  if (id.includes('axios')) return 'vendor-http'
  if (id.includes('crypto-js')) return 'vendor-crypto'
  if (id.includes('rss-parser')) return 'vendor-rss'
  if (id.includes('zod')) return 'vendor-zod'
  if (id.includes('react-hook-form')) return 'vendor-forms'
  
  // Todo lo demás, partido por tamaño
  return 'vendor-misc'
}
          
          // Chunking por funcionalidad de la app
          if (id.includes('/src/components/charts/')) {
            return 'chunk-charts'
          }
          if (id.includes('/src/components/markets/')) {
            return 'chunk-markets'
          }
          if (id.includes('/src/components/news/')) {
            return 'chunk-news'
          }
        }
      }
    },
    input: {
        main: './index.html'
      },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      },
      format: {
        comments: false
      }
    },
    sourcemap: false,
    reportCompressedSize: true,
    target: 'es2022'
  }
})