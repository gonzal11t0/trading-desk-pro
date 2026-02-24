// src/components/premium/EmpresaCard.jsx
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Download } from 'lucide-react';
import ModalAnalisis from './ModalAnalisis';

const EmpresaCard = ({ empresa }) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  
  // Determinar color según variación
  const getVariacionColor = (valor) => {
    if (valor > 0) return 'text-green-400';
    if (valor < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const getVariacionIcon = (valor) => {
    if (valor > 0) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (valor < 0) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return null;
  };

  return (
    <>
      <div className="bg-gray-800/30 rounded-xl p-5 border border-gray-700/50 hover:border-yellow-700/50 transition">
        {/* Header de la empresa */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">{empresa.ticker}</h3>
            <p className="text-sm text-gray-400">Último balance: {empresa.ultimoBalance}</p>
          </div>
          <span className="text-xs bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded">
            PREMIUM
          </span>
        </div>

        {/* Grid de indicadores */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Ingresos</p>
            <div className="flex items-center gap-1">
              <span className="text-white font-semibold">{empresa.ingresos}</span>
              <span className={getVariacionColor(empresa.varIngresos)}>
                {empresa.varIngresos > 0 ? '+' : ''}{empresa.varIngresos}%
              </span>
              {getVariacionIcon(empresa.varIngresos)}
            </div>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 mb-1">EBITDA</p>
            <div className="flex items-center gap-1">
              <span className="text-white font-semibold">{empresa.ebitda}</span>
              <span className={getVariacionColor(empresa.varEbitda)}>
                {empresa.varEbitda > 0 ? '+' : ''}{empresa.varEbitda}%
              </span>
              {getVariacionIcon(empresa.varEbitda)}
            </div>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 mb-1">Deuda</p>
            <div className="flex items-center gap-1">
              <span className="text-white font-semibold">{empresa.deuda}</span>
              <span className={getVariacionColor(empresa.varDeuda)}>
                {empresa.varDeuda > 0 ? '+' : ''}{empresa.varDeuda}%
              </span>
              {getVariacionIcon(empresa.varDeuda)}
            </div>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 mb-1">PER</p>
            <div className="flex items-center gap-1">
              <span className="text-white font-semibold">{empresa.per}</span>
              <span className={getVariacionColor(empresa.varPer)}>
                {empresa.varPer > 0 ? '+' : ''}{empresa.varPer}%
              </span>
              {getVariacionIcon(empresa.varPer)}
            </div>
          </div>
        </div>

        {/* Análisis rápido */}
        <div className="bg-gray-900/50 rounded-lg p-3 mb-4 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-300">{empresa.analisis}</p>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2">
          <button
            onClick={() => setModalAbierto(true)}
            className="flex-1 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 py-2 rounded-lg transition flex items-center justify-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Ver análisis completo
          </button>
          <button className="p-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition">
            <Download className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      </div>

      {/* Modal de análisis */}
      <ModalAnalisis 
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        empresa={empresa}
      />
    </>
  );
};

export default EmpresaCard;