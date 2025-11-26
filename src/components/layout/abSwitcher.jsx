// src/components/layout/TabSwitcher.jsx
import React from 'react'
import { Map, Newspaper, Activity, Zap } from 'lucide-react'

export function TabSwitcher({ activeTab, onTabChange, children }) {
  const tabs = [
    {
      id: 'mapas',
      label: 'MAPAS MERCADO',
      icon: <Map className="w-4 h-4" />,
      color: 'from-yellow-400 to-yellow-300',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-400/30'
    },
    {
      id: 'noticias',
      label: 'FLUJO NOTICIAS', 
      icon: <Newspaper className="w-4 h-4" />,
      color: 'from-cyan-400 to-cyan-300',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-400/30'
    }
  ]

  return (
    <div className="section-bg rounded-xl border border-gray-600/50 shadow-2xl overflow-hidden">
      {/* 🔻 BARRA DE PESTAÑAS PREMIUM */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 border-b border-gray-600/50">
        {/* Fondo activo dinámico */}
        <div className={`absolute top-0 left-0 h-full transition-all duration-500 ease-out ${
          activeTab === 'mapas' ? 'w-1/2' : 'w-1/2 translate-x-full'
        }`}>
          <div className={`h-full bg-gradient-to-r ${
            activeTab === 'mapas' 
              ? 'from-yellow-400/5 to-yellow-300/5' 
              : 'from-cyan-400/5 to-cyan-300/5'
          }`} />
        </div>

        <div className="relative flex items-center px-2 py-1">
          {/* Icono de estado */}
          <div className="flex items-center px-3 py-2">
            <div className="relative">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-ping absolute"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full relative"></div>
            </div>
            
          </div>

          {/* Separador vertical */}
          <div className="h-6 w-px bg-gray-600/50 mx-2"></div>

          {/* Pestañas */}
          <div className="flex flex-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex-1 flex items-center justify-center space-x-2 px-4 py-3 mx-1 rounded-lg transition-all duration-300 group ${
                  activeTab === tab.id
                    ? `${tab.bgColor} border ${tab.borderColor} shadow-lg`
                    : 'hover:bg-gray-700/50'
                }`}
              >
                {/* Icono */}
                <div className={`transition-all duration-300 ${
                  activeTab === tab.id 
                    ? `text-transparent bg-gradient-to-r ${tab.color} bg-clip-text`
                    : 'text-gray-400 group-hover:text-gray-300'
                }`}>
                  {tab.icon}
                </div>

                {/* Texto */}
                <span className={`text-sm font-bold tracking-wider transition-all duration-300 ${
                  activeTab === tab.id
                    ? `text-transparent bg-gradient-to-r ${tab.color} bg-clip-text drop-shadow-lg`
                    : 'text-gray-400 group-hover:text-gray-300'
                }`}>
                  {tab.label}
                </span>

                {/* Indicador activo superior */}
                {activeTab === tab.id && (
                  <>
                    <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r ${tab.color} rounded-full shadow-lg`} />
                    <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r ${tab.color} rounded-full animate-ping`} />
                  </>
                )}

                {/* Efecto hover */}
                {activeTab !== tab.id && (
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-gray-600/0 to-gray-600/0 group-hover:from-gray-600/20 group-hover:to-gray-600/10 transition-all duration-300" />
                )}
              </button>
            ))}
          </div>

          {/* Indicador de tiempo */}
          <div className="flex items-center px-3 py-2">
            <Zap className="w-3 h-3 text-yellow-400 mr-1" />
            <span className="text-yellow-400 text-xs font-mono">
              {new Date().toLocaleTimeString('es-AR', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
              })}
            </span>
          </div>
        </div>

        {/* Barra de progreso sutil */}
        <div className="h-0.5 bg-gradient-to-r from-gray-600/30 to-gray-600/30">
          <div className={`h-full bg-gradient-to-r ${
            activeTab === 'mapas' ? 'from-yellow-400 to-yellow-300' : 'from-cyan-400 to-cyan-300'
          } transition-all duration-1000 ease-out animate-pulse`} 
          style={{ width: '100%' }} />
        </div>
      </div>

      {/* 🔻 CONTENIDO CON PADDING MEJORADO */}
      <div className="p-4 bg-gradient-to-br from-gray-900/50 to-gray-800/30">
        {children}
      </div>

      {/* Footer sutil del contenedor */}
      <div className="h-1 bg-gradient-to-r from-gray-600/20 via-gray-500/10 to-gray-600/20"></div>
    </div>
  )
}