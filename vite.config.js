import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: undefined 
      }
    },
    minify: 'esbuild'
  },
  server: {
    proxy: {
      '/api/backend': {
        target: 'https://trading-backend-psi.vercel.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/backend/, '/api')
      },
      '/api/argentina-datos': {
        target: 'https://api.argentinadatos.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/argentina-datos/, '')
      },
      '/api/coingecko': {
  target: 'https://api.coingecko.com/api/v3',
  changeOrigin: true,
  rewrite: (path) => path.replace(/^\/api\/coingecko/, '')
},
       '/api/yahoo': {
        target: 'https://query1.finance.yahoo.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/yahoo/, '')
      },
      '/api/rss/bbc': {
        target: 'https://feeds.bbci.co.uk',
        changeOrigin: true,
        rewrite: () => '/news/business/rss.xml'
      },
      '/api/rss/ft': {
        target: 'https://www.ft.com',
        changeOrigin: true,
        rewrite: () => '/rss/home'
      }
    }
  }
})
