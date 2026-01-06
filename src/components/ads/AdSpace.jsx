// AdSpace.jsx - VERSIÓN CON ESTILOS OPTIMIZADOS
import React from 'react';

const AdSpace = () => {
  return (
    <div className="ad-space bg-gray-900 border border-gray-700 rounded-lg p-4 my-4">
      {/* Encabezado más discreto */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-500">
          • Espacio publicitario •
        </span>
        <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">
          Ad
        </span>
      </div>
      
      {/* Contenedor más compacto */}
      <div className="ad-container min-h-[180px] flex flex-col items-center justify-center border border-dashed border-gray-600 rounded-lg p-4 hover:border-gray-500 transition-colors">
        
        {/* Icono más pequeño */}
        <div className="w-12 h-12 bg-gradient-to-br from-blue-900 to-purple-900 rounded-full flex items-center justify-center mb-3">
          <span className="text-xl">💰</span>
        </div>
        
        {/* Texto optimizado */}
        <h4 className="text-base font-semibold text-center mb-1">
          Espacio Disponible
        </h4>
        
        <p className="text-gray-400 text-xs text-center mb-3 max-w-xs">
          Ideal para brokers, herramientas financieras, cursos.
        </p>
        
        {/* Botón más pequeño */}
        <div className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 rounded text-sm font-medium cursor-pointer hover:opacity-90 transition inline-block">
          Contactar
        </div>
        
        {/* Stats más pequeños */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          <span className="mr-3">🎯 Audience: Traders</span>
          <span>📊 CTR: 2.4%</span>
        </div>
      </div>
    </div>
  );
};

export default AdSpace;