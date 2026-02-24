// src/components/premium/BonosTab.jsx
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Download, Calculator } from 'lucide-react';
import ModalBono from './ModalBono';

// Datos simulados de bonos
const bonos = [
  {
    ticker: 'AL30',
    nombre: 'Bonar 2030',
    tipo: 'Soberano USD',
    precio: 42.50,
    varPrecio: -2.3,
    tir: 15.2,
    varTir: 1.1,
    duracion: 3.2,
    cupon: 3.5,
    fechaVencimiento: '2030-01-09',
    analisis: 'Rendimiento atractivo en USD. Sensible a tasa Fed. 🟡 MANTENER'
  },
  {
    ticker: 'GD30',
    nombre: 'Global 2030',
    tipo: 'Soberano USD',
    precio: 41.80,
    varPrecio: -1.8,
    tir: 16.1,
    varTir: 1.3,
    duracion: 4.1,
    cupon: 4.0,
    fechaVencimiento: '2030-07-09',
    analisis: 'Mayor duration, más volatilidad. 🟡 MANTENER'
  },
  {
    ticker: 'AL35',
    nombre: 'Bonar 2035',
    tipo: 'Soberano USD',
    precio: 38.20,
    varPrecio: -3.1,
    tir: 17.5,
    varTir: 1.5,
    duracion: 5.3,
    cupon: 3.8,
    fechaVencimiento: '2035-02-15',
    analisis: 'Alta TIR pero largo plazo. Riesgo país sensible. 🟢 COMPRAR'
  },
  {
    ticker: 'GD35',
    nombre: 'Global 2035',
    tipo: 'Soberano USD',
    precio: 37.50,
    varPrecio: -2.7,
    tir: 18.2,
    varTir: 1.6,
    duracion: 6.0,
    cupon: 4.2,
    fechaVencimiento: '2035-07-09',
    analisis: 'Máxima TIR de la curva. Alto riesgo. 🟡 MANTENER'
  },
  {
    ticker: 'YPF 2029',
    nombre: 'YPF 2029',
    tipo: 'Corporativo USD',
    precio: 68.30,
    varPrecio: 1.2,
    tir: 9.8,
    varTir: -0.3,
    duracion: 2.8,
    cupon: 6.5,
    fechaVencimiento: '2029-11-15',
    analisis: 'Bono corporativo con menor riesgo. Flujo positivo. 🟢 COMPRAR'
  },
  {
    ticker: 'PAMP 2028',
    nombre: 'Pampa 2028',
    tipo: 'Corporativo USD',
    precio: 72.10,
    varPrecio: 0.8,
    tir: 8.5,
    varTir: -0.2,
    duracion: 2.1,
    cupon: 7.0,
    fechaVencimiento: '2028-05-20',
    analisis: 'Sólida empresa energética. Bajo riesgo. 🟢 COMPRAR'
  }
];

const BonosTab = () => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [bonoSeleccionado, setBonoSeleccionado] = useState(null);

  const abrirModal = (bono) => {
    setBonoSeleccionado(bono);
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
      {bonos.map(bono => (
        <div key={bono.ticker} className="bg-gray-800/30 rounded-xl p-5 border border-gray-700/50 hover:border-yellow-700/50 transition">
          {/* Header del bono */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-white">{bono.ticker}</h3>
              <p className="text-sm text-gray-400">{bono.nombre} • {bono.tipo}</p>
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
                <span className="text-white font-semibold">${bono.precio.toFixed(2)}</span>
                <span className={getVariacionColor(bono.varPrecio)}>
                  {bono.varPrecio > 0 ? '+' : ''}{bono.varPrecio}%
                </span>
                {getVariacionIcon(bono.varPrecio)}
              </div>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 mb-1">TIR</p>
              <div className="flex items-center gap-1">
                <span className="text-white font-semibold">{bono.tir}%</span>
                <span className={getVariacionColor(bono.varTir)}>
                  {bono.varTir > 0 ? '+' : ''}{bono.varTir}pp
                </span>
                {getVariacionIcon(bono.varTir)}
              </div>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 mb-1">Duración</p>
              <span className="text-white font-semibold">{bono.duracion} años</span>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 mb-1">Cupón</p>
              <span className="text-white font-semibold">{bono.cupon}%</span>
            </div>
          </div>

          {/* Análisis rápido */}
          <div className="bg-gray-900/50 rounded-lg p-3 mb-4 border-l-4 border-yellow-500">
            <p className="text-sm text-gray-300">{bono.analisis}</p>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2">
            <button
              onClick={() => abrirModal(bono)}
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
        Cargar más bonos...
      </button>

      {/* Modal de análisis */}
      {bonoSeleccionado && (
        <ModalBono 
          isOpen={modalAbierto}
          onClose={() => setModalAbierto(false)}
          bono={bonoSeleccionado}
        />
      )}
    </div>
  );
};

export default BonosTab;