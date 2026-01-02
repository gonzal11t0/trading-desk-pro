import React from 'react'
import InflationModule from './InflationModule'
import { DollarTypesModule } from './DollarTypesModule'
import InflationHistory from '../markets/InflationHistory';

export function EconomicIndicators() {
  return (
    <div className="section-bg rounded-xl p-4 mt-6 border border-gray-700/50 shadow-lg">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center space-x-3 px-6 py-3 rounded-xl bg-gradient-to-r from-gray-800/80 to-gray-900/80 shadow-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full shadow-lg shadow-yellow-500/25"></div>
            <span className="text-2xl">📊</span>
          </div>
          <h2 className="text-white font-bold text-lg tracking-tight">
            INDICADORES ECONÓMICOS
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <InflationHistory />
        <DollarTypesModule />
      </div>
    </div>
  )
}