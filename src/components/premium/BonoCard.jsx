// src/components/premium/BonoCard.jsx
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Download, Bell } from 'lucide-react';
import BotonFavorito from './BotonFavorito';
import ModalAlerta from './ModalAlerta';
import ModalBono from './ModalBono';

const BonoCard = ({ bono }) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalAlertaAbierto, setModalAlertaAbierto] = useState(false);

  // 👇 LOGS (solo para verificar que llega bien)
  console.log('🎯 BonoCard recibió:', bono);

  if (!bono) return null;

  const variacion = bono.change ?? 0;
  const variacionPorcentaje = variacion ? (variacion * 100).toFixed(2) : '0.00';

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
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">{bono.symbol || 'S/D'}</h3>
            <p className="text-sm text-gray-400">
              Vence: {bono.expiration ? new Date(bono.expiration).toLocaleDateString('es-AR') : 'N/A'}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <BotonFavorito tipo="bonos" ticker={bono.symbol} size="sm" />
            <button
              onClick={() => setModalAlertaAbierto(true)}
              className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-yellow-400 transition"
              title="Crear alerta"
            >
              <Bell className="w-4 h-4" />
            </button>
            <span className="text-xs bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded">
              PREMIUM
            </span>
          </div>
        </div>

        {/* Grid de indicadores */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Último</p>
            <div className="flex items-center gap-1">
              <span className="text-white font-semibold">
                ${bono.last ? bono.last.toFixed(2) : '0.00'}
              </span>
              <span className={getVariacionColor(variacion)}>
                {variacionPorcentaje}%
              </span>
              {getVariacionIcon(variacion)}
            </div>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 mb-1">Bid / Ask</p>
            <span className="text-white font-semibold">
              ${bono.bid ? bono.bid.toFixed(2) : '0.00'} / ${bono.ask ? bono.ask.toFixed(2) : '0.00'}
            </span>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 mb-1">Volumen</p>
            <span className="text-white font-semibold">
              {bono.volume ? bono.volume.toLocaleString() : '0'}
            </span>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 mb-1">Apertura</p>
            <span className="text-white font-semibold">
              ${bono.open ? bono.open.toFixed(2) : '0.00'}
            </span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2">
          <button
            onClick={() => setModalAbierto(true)}
            className="flex-1 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 py-2 rounded-lg transition"
          >
            Ver análisis completo
          </button>
          <button className="p-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition">
            <Download className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      </div>

      {/* Modal de análisis */}
      <ModalBono 
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        bono={bono}
      />

      {/* Modal de alerta */}
      <ModalAlerta
        isOpen={modalAlertaAbierto}
        onClose={() => setModalAlertaAbierto(false)}
        instrumento={{
          tipo: 'bonos',
          ticker: bono.symbol,
          nombre: bono.symbol,
          precio: bono.last || 0
        }}
      />
    </>
  );
};

export default BonoCard;