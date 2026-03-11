// src/components/premium/BonoCard.jsx
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Download, Bell } from 'lucide-react';
import BotonFavorito from './BotonFavorito';
import ModalAlerta from './ModalAlerta';
import ModalBono from './ModalBono';

const BonoCard = ({ bono }) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalAlertaAbierto, setModalAlertaAbierto] = useState(false);

  if (!bono) return null;

  // Usar las propiedades que vienen de Rava
  const ticker = bono.ticker;
  const ultimo = bono.ultimo ?? 0;
  const variacion = bono.variacion_dia ?? 0;
  const anterior = bono.anterior ?? 0;
  const apertura = bono.apertura ?? 0;
  const volumen = bono.volumen_nominal ?? 0;

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
            <h3 className="text-xl font-bold text-white">{ticker}</h3>
            <p className="text-sm text-gray-400">Bono • Rava</p>
          </div>
          
          <div className="flex items-center gap-2">
            <BotonFavorito tipo="bonos" ticker={ticker} size="sm" />
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
                ${ultimo.toFixed(2)}
              </span>
              <span className={getVariacionColor(variacion)}>
                {variacion > 0 ? '+' : ''}{variacion.toFixed(2)}%
              </span>
              {getVariacionIcon(variacion)}
            </div>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 mb-1">Anterior</p>
            <span className="text-white font-semibold">
              ${anterior.toFixed(2)}
            </span>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 mb-1">Apertura</p>
            <span className="text-white font-semibold">
              ${apertura.toFixed(2)}
            </span>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 mb-1">Volumen</p>
            <span className="text-white font-semibold">
              {volumen.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Botones */}
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

      {/* Modal */}
      <ModalBono
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        bono={bono}
      />

      <ModalAlerta
        isOpen={modalAlertaAbierto}
        onClose={() => setModalAlertaAbierto(false)}
        instrumento={{
          tipo: 'bonos',
          ticker: ticker,
          nombre: ticker,
          precio: ultimo
        }}
      />
    </>
  );
};

export default BonoCard;