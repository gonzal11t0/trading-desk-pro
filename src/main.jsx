import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ErrorBoundary from './components/common/ErrorBoundary.jsx'

import './index.css'
import './global-styles.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, 
      retry: 1,
    },
  },
})
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary><App /></ErrorBoundary>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
