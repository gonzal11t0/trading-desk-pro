// src/components/premium/LetrasTab.jsx
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Download, Calculator, Calendar } from 'lucide-react';
import ModalLetra from './ModalLetra';

// Datos simulados de letras
const letras = [
  {
    ticker: 'LETRAS CAP',
    nombre: 'Letra Capitalización',
    tipo: 'Capitalización',
    precio: 980.00,
    varPrecio: -1.2,
    tna: 38.0,
    tea: 42.3,
    vencimiento: '2026-03-22',
    plazo: 30,
    analisis: 'Buena tasa en pesos. Corto plazo. 🟢 COMPRAR'
  },
  {
    ticker: 'LETRAS DIS',
    nombre: 'Letra Descuento',
    tipo: 'Descuento',
    precio: 950.00,
    varPrecio: -1.5,
    tna: 42.0,
    tea: 47.8,
    vencimiento: '2026-04-08',
    plazo: 45,
    analisis: 'Alta tasa, mayor plazo. 🟡 MANTENER'
  },
  {
    ticker: 'LECAP',
    nombre: 'Letra Capitalización',
    tipo: 'Capitalización',
    precio: 975.00,
    varPrecio: -0.8,
    tna: 40.0,
    tea: 45.1,
    vencimiento: '2026-04-23',
    plazo: 60,
    analisis: 'Tasa intermedia. Plazo extendido. 🟢 COMPRAR'
  },
  {
    ticker: 'LECER',
    nombre: 'Letra CER',
    tipo: 'Ajustable por inflación',
    precio: 1012.50,
    varPrecio: 0.3,
    tna: 22.0,
    tea: 24.5,
    vencimiento: '2026-05-15',
    plazo: 75,
    analisis: 'Cobertura inflacionaria. Tasa real positiva. 🟢 COMPRAR'
  }
];

const LetrasTab = () => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [letraSeleccionada, setLetraSeleccionada] = useState(null);

  const abrirModal = (letra) => {
    setLetraSeleccionada(letra);
    setModalAbierto(true);
  };

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
    <div className="space-y-4">
      {letras.map(letra => (
        <div key={letra.ticker} className="bg-gray-800/30 rounded-xl p-5 border border-gray-700/50 hover:border-yellow-700/50 transition">
          {/* Header de la letra */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-white">{letra.ticker}</h3>
              <p className="text-sm text-gray-400">{letra.nombre} • {letra.tipo}</p>
            </div>
            <span className="text-xs bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded">
              PREMIUM
            </span>
          </div>

          {/* Grid de indicadores */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Precio</p>
              <div className="flex items-center gap-1">
                <span className="text-white font-semibold">${letra.precio.toFixed(2)}</span>
                <span className={getVariacionColor(letra.varPrecio)}>
                  {letra.varPrecio > 0 ? '+' : ''}{letra.varPrecio}%
                </span>
                {getVariacionIcon(letra.varPrecio)}
              </div>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 mb-1">TNA</p>
              <span className="text-white font-semibold">{letra.tna}%</span>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 mb-1">TEA</p>
              <span className="text-white font-semibold">{letra.tea}%</span>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 mb-1">Plazo</p>
              <span className="text-white font-semibold">{letra.plazo} días</span>
            </div>
          </div>

          {/* Análisis rápido */}
          <div className="bg-gray-900/50 rounded-lg p-3 mb-4 border-l-4 border-yellow-500">
            <p className="text-sm text-gray-300">{letra.analisis}</p>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2">
            <button
              onClick={() => abrirModal(letra)}
              className="flex-1 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 py-2 rounded-lg transition flex items-center justify-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              Ver análisis completo
            </button>
            <button className="p-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition">
              <Download className="w-4 h-4 text-gray-300" />
            </button>
          </div>
        </div>
      ))}
      
      {/* Botón para cargar más */}
      <button className="w-full py-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-gray-400 transition">
        Cargar más letras...
      </button>

      {/* Modal de análisis */}
      {letraSeleccionada && (
        <ModalLetra 
          isOpen={modalAbierto}
          onClose={() => setModalAbierto(false)}
          letra={letraSeleccionada}
        />
      )}
    </div>
  );
};

export default LetrasTab;