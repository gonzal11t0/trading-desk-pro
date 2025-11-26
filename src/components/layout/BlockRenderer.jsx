import React from 'react'
import { CryptoCard } from '../markets/CryptoCard'
import { StockCard } from '../markets/StockCard'
import { ForexCard } from '../markets/ForexCard'
import { VideoPlayer } from '../video/VideoPlayer'
import { DolarCard } from '../markets/DolarCard'
import { MervalCard } from '../markets/MervalCard' 
import { CommoditiesCard } from '../markets/CommoditiesCard' 
// Debug: verificar que VideoPlayer se importó
console.log('🔄 VideoPlayer importado:', VideoPlayer)

export function BlockRenderer({ block }) {
  console.log('🎯 BlockRenderer recibió:', block)
  
  switch(block.component) {
    case 'CryptoCard':

      return <CryptoCard {...block} />
    case 'StockCard':

      return <StockCard {...block} />
    case 'ForexCard':

      return <ForexCard {...block} />
    case 'VideoPlayer':

      return <VideoPlayer {...block} />
    case 'DolarCard':
      return <DolarCard {...block} />
    case 'MervalCard': 
      return <MervalCard {...block} />
    case 'CommoditiesCard': 
      return <CommoditiesCard {...block} />
    default:
      return (
        <div className="bg-dark-100 rounded-xl p-6 border border-red-500">
          <h3 className="text-red-400 font-bold">Componente no soportado: {block.component}</h3>
          <p className="text-gray-400">Block ID: {block.id}</p>
          <p className="text-gray-400">Tipo: {block.type}</p>
          <p className="text-gray-400">Revisa la consola para más detalles</p>
        </div>
      )
  }
}