// src/components/layout/TradingHeader.jsx
import React from 'react'

export function TradingHeader() {
  return (
    <header className="relative text-center py-16 mb-12 overflow-hidden">
      {/* Fondo con efecto gradiente sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 opacity-90"></div>
      
      {/* Partículas decorativas */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-green-400 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10">
        {/* Status Bar Mejorada */}
        <div className="inline-flex items-center justify-center space-x-6 px-8 py-4 rounded-2xl border border-gray-700/50 bg-gray-900/30 backdrop-blur-sm shadow-2xl">
          {/* Status LIVE */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg shadow-green-500/25 animate-ping absolute"></div>
              <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg shadow-green-500/25 relative"></div>
            </div>
            <span className="text-green-400 font-semibold text-sm tracking-wider group-hover:text-green-300 transition-colors">
              SYSTEM LIVE
            </span>
          </div>

          {/* Separador elegante */}
          <div className="w-px h-6 bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>

          {/* Fecha */}
          <div className="flex items-center space-x-2">
            <div className="text-cyan-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-gray-300 font-mono text-sm tracking-tight">
              {new Date().toLocaleDateString('es-AR', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              }).toUpperCase()}
            </span>
          </div>

          {/* Separador elegante */}
          <div className="w-px h-6 bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>

          {/* Hora en tiempo real */}
          <div className="flex items-center space-x-2">
            <div className="text-blue-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-gray-300 font-mono text-sm font-bold tracking-tighter bg-gray-800/50 px-3 py-1 rounded-lg border border-gray-700/30">
              {new Date().toLocaleTimeString('es-AR', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit',
                hour12: false 
              })}
            </span>
          </div>
        </div>

        
      </div>

      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full"></div>
    </header>
  )
}