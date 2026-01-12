// src/components/charts/TradingViewCharts.lazy.jsx
import React, { Suspense, lazy } from 'react';

// Lazy load del componente pesado
const TradingViewChartsLazy = lazy(() => import('./TradingViewCharts'));

// Componente wrapper con loading state
const TradingViewChartsWrapper = (props) => (
  <Suspense 
    fallback={
      <div className="section-bg rounded-xl p-6 mt-6 w-full border border-gray-700/50">
        <div className="animate-pulse h-96 bg-gray-800 rounded-lg"></div>
      </div>
    }
  >
    <TradingViewChartsLazy {...props} />
  </Suspense>
);

export default TradingViewChartsWrapper;