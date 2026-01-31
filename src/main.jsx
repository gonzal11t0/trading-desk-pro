import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { initTradingViewBlocker } from './utils/tradingview-blocker';

import './index.css'
import './global-styles.css'

import CryptoJS from 'crypto-js';
window.CryptoJS = CryptoJS;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, 
      retry: 1,
    },
  },
})
initTradingViewBlocker();
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)