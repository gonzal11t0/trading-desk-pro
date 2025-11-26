// src/components/charts/TreemapCharts.jsx
import React from 'react'

export function TreemapCharts() {
  // Datos mock para los treemaps - luego conectaremos APIs reales
  const usMarketData = [
    { name: 'Tecnología', value: 35, color: '#3b82f6' },
    { name: 'Salud', value: 20, color: '#10b981' },
    { name: 'Finanzas', value: 15, color: '#f59e0b' },
    { name: 'Energía', value: 10, color: '#ef4444' },
    { name: 'Industriales', value: 8, color: '#8b5cf6' },
    { name: 'Consumo', value: 7, color: '#06b6d4' },
    { name: 'Materiales', value: 5, color: '#84cc16' }
  ]

  const argentinaMarketData = [
    { name: 'Finanzas', value: 25, color: '#3b82f6' },
    { name: 'Energía', value: 20, color: '#ef4444' },
    { name: 'Agro', value: 18, color: '#10b981' },
    { name: 'Industrial', value: 15, color: '#f59e0b' },
    { name: 'Servicios', value: 12, color: '#8b5cf6' },
    { name: 'Comercio', value: 10, color: '#06b6d4' }
  ]

  const renderTreemap = (data, title) => (
    <div className="bg-terminal-bg-card rounded-xl p-4 border border-terminal-border mb-4">
      <h3 className="text-white font-semibold text-sm mb-3 flex items-center">
        <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
        {title}
      </h3>
      
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-2 hover:bg-terminal-bg-secondary rounded transition-colors">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-white text-sm">{item.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">{item.value}%</span>
              <div className="w-16 bg-gray-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full"
                  style={{ 
                    width: `${item.value}%`,
                    backgroundColor: item.color
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-700 text-center">
        <span className="text-gray-500 text-xs">Última actualización: {new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  )

  return (
    <div>
      {renderTreemap(usMarketData, "MAPA DE MERCADO USA")}
      {renderTreemap(argentinaMarketData, "MAPA DE MERCADO ARG")}
    </div>
  )
}