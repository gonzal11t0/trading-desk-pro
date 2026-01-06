// App.jsx - VERSIÓN CORREGIDA
import React from 'react'
import { TradingHeader } from './components/layout/TradingHeader'
import { QuotesCarousel } from './components/markets/QuotesCarousel'
import { LiveStreamsGrid } from './components/video/LiveStreamsGrid'
import { EconomicIndicators } from './components/markets/EconomicIndicators'
import { FinancialDashboard } from './components/markets/FinancialDashboard'
import { Notice } from './components/charts/Notice'
import { TradingViewCharts } from './components/charts/TradingViewCharts'
import TreemapDashboard from './components/charts/TreemapDashboard'
import EconomicDataBlock from './components/markets/EconomicDataBlock'
import AdSpace from './components/ads/AdSpace'
import { FloatingEduButton, MacroExplainer } from './components/markets/MacroExplainer';

import './App.css'

export default function App() {
  return (
    
    <div className="min-h-screen bg-black text-white font-mono">
            <FloatingEduButton />
      <MacroExplainer />
      <TradingHeader />
      <div className="container mx-auto px-4 ">
        <div className="mb-8 border-b-35 border-transparent">
          <QuotesCarousel />
        </div>
        <div className="flex flex-row gap-6 ">
          
          {/* COLUMNA IZQUIERDA (70%) */}
          <div className="w-7/10 border-r-12 border-transparent border-b-25 border-transparent">
            <LiveStreamsGrid />
            
            {/* 📊 INDICADORES ECONÓMICOS */}
            <EconomicIndicators />
            
            {/* ⭐⭐ ADSPACE - JUSTO AQUÍ ⭐⭐ */}
            <AdSpace />
            
            <FinancialDashboard/>
            <div className="w-3/10 ml-12 pl-12 border-b-25 border-transparent"></div>
            <EconomicDataBlock/>
          </div>
          
          {/* COLUMNA DERECHA (30%) */}
          <div className="w-3/10 ml-12 pl-12 border-b-25 border-transparent">
            <Notice /> 
            <TreemapDashboard />
            {/* ⚠️ QUITAR AdSpace de aquí */}
          </div>
        </div>
        
        {/* GRAFICOS TRADINGVIEW (debajo de AdSpace) */}
        <TradingViewCharts />
      </div>
    </div>
  )
}