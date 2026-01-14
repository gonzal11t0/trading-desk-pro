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
      '/api/markets': {
        target: 'https://api.coingecko.com/api/v3',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/markets/, '')
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
      }
    }
  },
  
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Chunking optimizado para React 19
          if (id.includes('node_modules')) {
            // React 19 core (nuevo)
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react'
            }
            // Gráficos pesados
            if (id.includes('recharts') || id.includes('tradingview')) {
              return 'vendor-charts'
            }
            // Estado y data
            if (id.includes('@tanstack') || id.includes('zustand')) {
              return 'vendor-state'
            }
            // UI y formularios
            if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@dnd-kit')) {
              return 'vendor-ui'
            }
            // Iconos
            if (id.includes('lucide')) {
              return 'vendor-icons'
            }
            // HTTP y utilities
            if (id.includes('axios') || id.includes('crypto-js') || id.includes('rss-parser')) {
              return 'vendor-utils'
            }
            return 'vendor-other'
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
    chunkSizeWarningLimit: 800,
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