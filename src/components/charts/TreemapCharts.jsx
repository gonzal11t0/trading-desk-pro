/* treemapcharts*/ 
import React, { useMemo} from 'react'


// Datos mock fuera del componente
const US_MARKET_DATA = [
  { id: 'tech', name: 'Tecnología', value: 35, color: '#3b82f6' },
  { id: 'health', name: 'Salud', value: 20, color: '#10b981' },
  { id: 'finance', name: 'Finanzas', value: 15, color: '#f59e0b' },
  { id: 'energy', name: 'Energía', value: 10, color: '#ef4444' },
  { id: 'industrial', name: 'Industriales', value: 8, color: '#8b5cf6' },
  { id: 'consumer', name: 'Consumo', value: 7, color: '#06b6d4' },
  { id: 'materials', name: 'Materiales', value: 5, color: '#84cc16' }
]

const ARGENTINA_MARKET_DATA = [
  { id: 'finance-arg', name: 'Finanzas', value: 25, color: '#3b82f6' },
  { id: 'energy-arg', name: 'Energía', value: 20, color: '#ef4444' },
  { id: 'agro', name: 'Agro', value: 18, color: '#10b981' },
  { id: 'industrial-arg', name: 'Industrial', value: 15, color: '#f59e0b' },
  { id: 'services', name: 'Servicios', value: 12, color: '#8b5cf6' },
  { id: 'commerce', name: 'Comercio', value: 10, color: '#06b6d4' }
]

// Componente memoizado para cada fila del treemap
const TreemapRow = React.memo(({ item }) => (
  <div className="flex items-center justify-between p-2 hover:bg-terminal-bg-secondary rounded transition-colors">
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
))

// Componente memoizado para cada treemap
const TreemapSection = React.memo(({ data, title, lastUpdate }) => (
  <div className="bg-terminal-bg-card rounded-xl p-4 border border-terminal-border mb-4">
    <h3 className="text-white font-semibold text-sm mb-3 flex items-center">
      <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
      {title}
    </h3>
    
    <div className="space-y-2">
      {data.map((item) => (
        <TreemapRow key={item.id} item={item} />
      ))}
    </div>
    
    <div className="mt-3 pt-2 border-t border-gray-700 text-center">
      <span className="text-gray-500 text-xs">
        Última actualización: {lastUpdate}
      </span>
    </div>
  </div>
))

export function TreemapCharts({ 
  usMarketData = US_MARKET_DATA, 
  argentinaMarketData = ARGENTINA_MARKET_DATA 
}) {
  
  // Memoizar la hora actual para evitar recálculos en cada render
  const currentTime = useMemo(() => new Date().toLocaleTimeString(), [])

  // Memoizar los datos si fueran props dinámicas
  const memoizedUsData = useMemo(() => usMarketData, [usMarketData])
  const memoizedArgData = useMemo(() => argentinaMarketData, [argentinaMarketData])

  return (
    <div>
      <TreemapSection 
        data={memoizedUsData}
        title="MAPA DE MERCADO USA"
        lastUpdate={currentTime}
      />
      
      <TreemapSection 
        data={memoizedArgData}
        title="MAPA DE MERCADO ARG"
        lastUpdate={currentTime}
      />
    </div>
  )
}

// Props por defecto
TreemapCharts.defaultProps = {
  usMarketData: US_MARKET_DATA,
  argentinaMarketData: ARGENTINA_MARKET_DATA
}