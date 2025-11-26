import React from 'react'
import { RiskCountryModule } from './RiskCountryModule'
import { ExchangeBandsModule } from './ExchangeBandsModule'

export function FinancialDashboard() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <RiskCountryModule />
      <ExchangeBandsModule />
    </div>
  )
}