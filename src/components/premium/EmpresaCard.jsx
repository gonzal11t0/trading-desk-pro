// src/components/premium/EmpresaCard.jsx
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Download, Bell, Star, ChevronRight } from 'lucide-react';
import BotonFavorito from './BotonFavorito';
import ModalAlerta from './ModalAlerta';
import ModalAnalisis from './ModalAnalisis';

const EmpresaCard = ({ empresa }) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalAlertaAbierto, setModalAlertaAbierto] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const getVariacionColor = (valor) => {
    if (valor > 0) return 'text-green-400 bg-green-400/10';
    if (valor < 0) return 'text-red-400 bg-red-400/10';
    return 'text-gray-400 bg-gray-400/10';
  };

  const getVariacionIcon = (valor) => {
    if (valor > 0) return <TrendingUp className="w-3 h-3" />;
    if (valor < 0) return <TrendingDown className="w-3 h-3" />;
    return null;
  };

  return (
    <>
      <div 
        className="group relative bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl p-6 border border-gray-700/50 hover:border-yellow-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/5 hover:scale-[1.02]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Efecto de brillo en hover */}
        <div className={`absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/5 to-transparent rounded-xl transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
        
        {/* Header */}
        <div className="relative flex justify-between items-start mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-2xl font-bold text-white tracking-tight">{empresa.ticker}</h3>
              <span className="px-2 py-0.5 text-xs bg-yellow-500/10 text-yellow-400 rounded-full border border-yellow-500/20">
                PREMIUM
              </span>
            </div>
            <p className="text-sm text-gray-500">Último balance: {empresa.ultimoBalance}</p>
          </div>
          
          <div className="flex items-center gap-1">
            <BotonFavorito tipo="balances" ticker={empresa.ticker} size="md" />
            
            <button
              onClick={() => setModalAlertaAbierto(true)}
              className="p-2 hover:bg-gray-700/50 rounded-lg text-gray-400 hover:text-yellow-400 transition-all hover:scale-110"
              title="Crear alerta"
            >
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Grid de indicadores con diseño mejorado */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
            <p className="text-xs text-gray-500 mb-1">Ingresos</p>
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">{empresa.ingresos}</span>
              <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${getVariacionColor(empresa.varIngresos)}`}>
                {getVariacionIcon(empresa.varIngresos)}
                <span className="text-xs font-medium">
                  {empresa.varIngresos > 0 ? '+' : ''}{empresa.varIngresos}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
            <p className="text-xs text-gray-500 mb-1">EBITDA</p>
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">{empresa.ebitda}</span>
              <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${getVariacionColor(empresa.varEbitda)}`}>
                {getVariacionIcon(empresa.varEbitda)}
                <span className="text-xs font-medium">
                  {empresa.varEbitda > 0 ? '+' : ''}{empresa.varEbitda}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
            <p className="text-xs text-gray-500 mb-1">Deuda</p>
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">{empresa.deuda}</span>
              <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${getVariacionColor(empresa.varDeuda)}`}>
                {getVariacionIcon(empresa.varDeuda)}
                <span className="text-xs font-medium">
                  {empresa.varDeuda > 0 ? '+' : ''}{empresa.varDeuda}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
            <p className="text-xs text-gray-500 mb-1">PER</p>
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">{empresa.per}</span>
              <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${getVariacionColor(empresa.varPer)}`}>
                {getVariacionIcon(empresa.varPer)}
                <span className="text-xs font-medium">
                  {empresa.varPer > 0 ? '+' : ''}{empresa.varPer}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Análisis rápido con diseño mejorado */}
        <div className="relative p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg mb-5 border-l-4 border-yellow-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-transparent" />
          <p className="relative text-sm text-gray-300 leading-relaxed">{empresa.analisis}</p>
        </div>

        {/* Botones de acción con diseño mejorado */}
        <div className="relative flex gap-3">
          <button
            onClick={() => setModalAbierto(true)}
            className="flex-1 bg-gradient-to-r from-yellow-600/20 to-yellow-600/5 hover:from-yellow-600/30 hover:to-yellow-600/10 text-yellow-400 py-3 rounded-lg transition-all hover:scale-[1.02] border border-yellow-500/20 hover:border-yellow-500/30 font-medium flex items-center justify-center gap-2 group"
          >
            Ver análisis completo
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-all hover:scale-110 border border-gray-600/30 group">
            <Download className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>

      <ModalAnalisis 
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        empresa={empresa}
      />

      <ModalAlerta
        isOpen={modalAlertaAbierto}
        onClose={() => setModalAlertaAbierto(false)}
        instrumento={{
          tipo: 'balances',
          ticker: empresa.ticker,
          nombre: empresa.ticker,
          precio: parseFloat(empresa.per)
        }}
      />
    </>
  );
};

export default EmpresaCard;