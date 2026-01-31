// EconomicIndicators.jsx - VERSIÓN COMPLETA REESCRITA
import React from 'react'
import InflationHistory from '../markets/InflationHistory'
import { DollarTypesModule } from './DollarTypesModule'

export function EconomicIndicators() {
  return (
    <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-gray-700/50 shadow-lg min-w-0">
      <div className="text-center mb-4 md:mb-6">
        <div className="inline-flex items-center justify-center space-x-3 px-4 md:px-6 py-3 md:py-4 rounded-xl bg-gradient-to-r from-gray-800/80 to-gray-900/80 shadow-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 md:w-3 md:h-3 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full shadow-lg shadow-yellow-500/25"></div>
            <span className="text-xl md:text-2xl">📊</span>
          </div>
          <h2 className="text-white font-bold text-lg md:text-xl tracking-tight">
            INDICADORES ECONÓMICOS
          </h2>
        </div>
      </div>

      {/* GRID RESPONSIVO CON ESPACIADO ADECUADO */}
      <div className="@container">
        <div className="grid grid-cols-1 @[640px]:grid-cols-2 gap-4 md:gap-6 lg:gap-8 min-w-0">
          <div className="min-w-0">
            <InflationHistory />
          </div>
          <div className="min-w-0">
            <DollarTypesModule />
          </div>
        </div>
      </div>
    </div>
  )
}