// AdSpace.jsx 
import React from 'react';

const AdSpace = () => {
  return (
    <div className="ad-space bg-gradient-to-br from-gray-900/50 to-gray-900/30 border border-gray-700/50 rounded-xl p-4 my-4 backdrop-blur-sm">
      {/* Encabezado mínimo */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-mono text-gray-500 tracking-wider">
          • PUBLICIDAD •
        </span>
        <span className="text-xs bg-gray-800/50 text-gray-400 px-2 py-1 rounded border border-gray-700">
          PATROCINADO
        </span>
      </div>
      
      {/* Contenedor ultra compacto */}
      <div className="min-h-[140px] flex flex-col items-center justify-center border-2 border-dashed border-gray-600/50 rounded-xl p-4 hover:border-blue-500/30 transition-all duration-300 hover:bg-gray-800/10">
        
        {/* Icono elegante */}
        <div className="mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg flex items-center justify-center border border-blue-500/20">
            <span className="text-lg">💎</span>
          </div>
        </div>
        
        {/* Texto conciso */}
        <div className="text-center mb-3">
          <h4 className="text-sm font-bold text-white/90 mb-1 tracking-tight">
            ESPACIO PREMIUM
          </h4>
          <p className="text-gray-400/80 text-xs leading-tight px-2">
            Conecta con traders profesionales
          </p>
        </div>
      </div>
      
      {/* Footer legal mínimo */}
      <div className="mt-3 pt-3 border-t border-gray-800/30">
        <p className="text-[10px] text-gray-600 text-center font-mono tracking-tight">
          Patrocinado • Anuncio segmentado • Crypto-friendly
        </p>
      </div>
    </div>
  );
};

export default AdSpace;