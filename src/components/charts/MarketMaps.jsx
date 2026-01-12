/* market maps */
import React from 'react'
export function MarketMaps() {
  const usMarketData = [...]
  const argentinaMarketData = [...]

  const renderVisualGrid = (data, title, country) => {
    const total = data.reduce((sum, item) => sum + item.value, 0) // <- Se calcula CADA VEZ
    
    return (
      <div className="section-bg rounded-md p-3 mb-4">
        <h3 className="text-white font-medium text-xs mb-2 flex items-center justify-center">
          <div className="flex items-center">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-1.5"></span>
            {title}
          </div>
          <span className="text-gray-500 text-2xs ml-1.5">({country})</span>
        </h3>
        
        <div className="h-32 mb-2 bg-terminal-bg-card rounded-sm border border-gray-600/30 p-1">
          <div className="grid grid-cols-4 grid-rows-3 gap-0.5 h-full w-full">
            {data.map((item, index) => (
              <div
                key={index}
                className="rounded-sm flex flex-col items-center justify-center p-0.5 relative group hover:opacity-95 transition-opacity"
                style={{ 
                  backgroundColor: item.color,
                  gridColumn: `span ${Math.max(1, Math.round((item.value / total) * 4))}` // <- Cálculo repetido
                }}
                title={`${getFullName(item.name)}: ${item.value}% ${item.change}`} // <- getFullName llamado CADA VEZ
              >
                <span className="text-white text-2xs font-semibold text-center leading-none">
                  {item.name}
                </span>
                <span className={`text-2xs font-mono ${item.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {item.change}
                </span>
                <span className="text-white text-2xs font-mono opacity-70">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-gray-600/30">
          <div className="flex justify-center text-2xs">
            <span className="text-gray-500">Total Mercado</span>
            <span className="text-green-400 font-mono ml-1">+1.8%</span> {/* <- Hardcodeado */}
          </div>
          <div className="text-gray-500 text-2xs text-center mt-1">
            Actualizado: {new Date().toLocaleTimeString()} {/* <- Se crea CADA VEZ */}
          </div>
        </div>
      </div>
    )
  }

  const getFullName = (shortName) => { // <- Se define CADA RENDER
    const names = {
      'TECNO': 'Tecnología',
      'SALUD': 'Salud',
      'FINANZ': 'Finanzas',
      'ENERG': 'Energía',
      'INDUS': 'Industriales',
      'CONSUMO': 'Consumo',
      'MATERIAL': 'Materiales',
      'AGRO': 'Agro',
      'SERVIC': 'Servicios',
      'COMERCIO': 'Comercio'
    }
    return names[shortName] || shortName
  }

  return (
    <div>
      <div className="border-b-8 border-transparent"> 
        {renderVisualGrid(usMarketData, "MAPA DE MERCADOS", "USA")}
      </div>
      {renderVisualGrid(argentinaMarketData, "MAPA DE MERCADOS", "ARG")}
    </div>
  )
}