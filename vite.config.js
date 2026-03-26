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
      '/api/argentina-datos': {
        target: 'https://api.argentinadatos.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/argentina-datos/, '')
      },
      '/api/fmp': {
        target: 'https://financialmodelingprep.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/fmp/, '')
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
      '/api/eoddata': {
        target: 'https://eoddata.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/eoddata/, '')
      }
    }
  }
})