// src/App.jsx
import React from 'react'
import { TradingHeader } from './components/layout/TradingHeader'
import { QuotesCarousel } from './components/markets/QuotesCarousel'
import { LiveStreamsGrid } from './components/video/LiveStreamsGrid'
import { MarketMaps } from './components/charts/MarketMaps'
import { EconomicIndicators } from './components/markets/EconomicIndicators'
import { FinancialDashboard } from './components/markets/FinancialDashboard'
import { Notice } from './components/charts/Notice'
import { TabSwitcher } from './components/layout/abSwitcher'
import { TradingViewCharts } from './components/charts/TradingViewCharts'
import TreemapDashboard from './components/charts/TreemapDashboard'

import './App.css'

export default function App() {
    const [activeTab, setActiveTab] = React.useState('mapas')
  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <TradingHeader />
      <div className="container mx-auto px-4 ">
        <div className="mb-8 border-b-35 border-transparent">
          <QuotesCarousel />
        </div>
        <div className="flex flex-row gap-6 ">
          <div className="w-7/10 border-r-12 border-transparent border-b-25 border-transparent">
            <LiveStreamsGrid />
            <EconomicIndicators />
            <FinancialDashboard/>
          </div>
          <div className="w-3/10 ml-12 pl-12 border-b-25 border-transparent">
            <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab}>
              {activeTab === 'mapas' ? (
                <MarketMaps /> 
              ) : (
                <Notice  /> 
                
              )}
              <TreemapDashboard />
            </TabSwitcher>
          </div>
        </div>
        
        <TradingViewCharts />
      </div>
    </div>
  )
}