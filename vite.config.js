// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    headers: {
      
      'Content-Security-Policy': '',
       build: {
    sourcemap: false,  
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }}
    },
    
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
          // Añade tu API Key aquí
          'Authorization': 'Bearer as_prod_2LPhBgR8GnCZv6SAuH9fosOLJcMNoqjF',
          'X-API-Key': 'as_prod_2LPhBgR8GnCZv6SAuH9fosOLJcMNoqjF'
        },
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            // Añadir parámetro de API key también como query param
            const url = new URL(req.url, 'http://localhost');
            url.searchParams.append('apikey', 'as_prod_2LPhBgR8GnCZv6SAuH9fosOLJcMNoqjF');
            proxyReq.path = url.pathname + url.search;
          });
        }
      },
      '/api/dolarito': {
        target: 'https://www.dolarito.ar',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/dolarito/, ''),
        secure: false,
      },
      '/api/bcra': {
        target: 'https://api.estadisticasbcra.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/bcra/, ''),
        secure: false,
      },
      '/api/bluelytics': {
        target: 'https://api.bluelytics.com.ar',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/bluelytics/, ''),
        secure: false,
      },
      '/api/yahoo': {
        target: 'https://query1.finance.yahoo.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/yahoo/, ''),
        secure: false,
      },
      '/api/dolarsi': {
        target: 'https://www.dolarsi.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/dolarsi/, ''),
        secure: false,
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
      // Proxy para datos argentinos
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
      // Proxy para CEDEARS
      '/api/cedears': {
        target: 'https://api.financialmodelingprep.com/v3',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            // Agregar API key si es necesario
            if (req.url.includes('financialmodelingprep')) {
              const url = new URL(proxyReq.path, 'https://api.financialmodelingprep.com');
              url.searchParams.set('apikey', import.meta.env.VITE_FMP_KEY || 'demo');
              proxyReq.path = url.pathname + url.search;
            }
          });
    }
  }
}
  }
})