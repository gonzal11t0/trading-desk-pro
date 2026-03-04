// src/components/premium/LetraCard.jsx
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Download, Bell } from 'lucide-react';
import BotonFavorito from './BotonFavorito';
import ModalAlerta from './ModalAlerta';
import ModalLetra from './ModalLetra';
import { getLetraData } from '../../data/letrasData';

const LetraCard = ({ letra }) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalAlertaAbierto, setModalAlertaAbierto] = useState(false);

  if (!letra) return null;

  const letraInfo = getLetraData(letra.symbol);
  const variacion = letra.change ?? 0;
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
            <h3 className="text-xl font-bold text-white">{letra.symbol}</h3>
            <p className="text-sm text-gray-400">{letraInfo.nombre} • {letraInfo.tipo}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <BotonFavorito tipo="letras" ticker={letra.symbol} size="sm" />
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
                ${letra.last ? letra.last.toFixed(2) : '0.00'}
              </span>
              <span className={getVariacionColor(variacion)}>
                {variacionPorcentaje}%
              </span>
              {getVariacionIcon(variacion)}
            </div>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 mb-1">TNA</p>
            <span className="text-white font-semibold">
              {letraInfo.tna ? `${letraInfo.tna}%` : '—'}
            </span>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 mb-1">TEA</p>
            <span className="text-white font-semibold">
              {letraInfo.tea ? `${letraInfo.tea}%` : '—'}
            </span>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 mb-1">Plazo</p>
            <span className="text-white font-semibold">
              {letraInfo.plazo ? `${letraInfo.plazo} días` : '—'}
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
      <ModalLetra
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        letra={letra}
      />

      <ModalAlerta
        isOpen={modalAlertaAbierto}
        onClose={() => setModalAlertaAbierto(false)}
        instrumento={{
          tipo: 'letras',
          ticker: letra.symbol,
          nombre: letraInfo.nombre,
          precio: letra.last || 0
        }}
      />
    </>
  );
};

export default LetraCard;