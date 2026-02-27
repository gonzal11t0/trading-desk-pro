// src/components/premium/BonosTab.jsx
import React, { useState, useMemo } from 'react';
import BonoCard from './BonoCard';
import { usePremiumStore } from '../../stores/premiumStore';
import { Star } from 'lucide-react';

// Datos reales de bonos (al 27/02/2026)
const bonos = [
  {
    ticker: 'AL30',
    nombre: 'Bonar 2030',
    tipo: 'Soberano USD',
    precio: 87.36,
    varPrecio: -1.2,
    tir: 15.2,
    varTir: 1.1,
    duracion: 3.2,
    cupon: 3.5,
    fechaVencimiento: '2030-01-09',
    tendencia: '📉 estable',
    analisis: 'Rendimiento atractivo en USD. Sensible a tasa Fed. 🟡 MANTENER'
  },
  {
    ticker: 'AL35',
    nombre: 'Bonar 2035',
    tipo: 'Soberano USD',
    precio: 110.59,
    varPrecio: -2.1,
    tir: 17.5,
    varTir: 1.5,
    duracion: 5.3,
    cupon: 3.8,
    fechaVencimiento: '2035-02-15',
    tendencia: '🔥 fuerte',
    analisis: 'Alta TIR pero largo plazo. Riesgo país sensible. 🟢 COMPRAR'
  },
  {
    ticker: 'AL41',
    nombre: 'Bonar 2041',
    tipo: 'Soberano USD',
    precio: 103.08,
    varPrecio: -2.5,
    tir: 18.1,
    varTir: 1.6,
    duracion: 7.8,
    cupon: 4.0,
    fechaVencimiento: '2041-03-15',
    tendencia: '🔥 fuerte',
    analisis: 'Muy largo plazo, alta TIR. Solo para perfiles agresivos. 🟡 MANTENER'
  },
  {
    ticker: 'AN29',
    nombre: 'AN29',
    tipo: 'Soberano USD',
    precio: 135.60,
    varPrecio: -0.8,
    tir: 14.8,
    varTir: 0.9,
    duracion: 2.5,
    cupon: 4.5,
    fechaVencimiento: '2029-11-15',
    tendencia: '📈 estable',
    analisis: 'Corto plazo, menor riesgo. 🟢 COMPRAR'
  },
  {
    ticker: 'GD30',
    nombre: 'Global 2030',
    tipo: 'Soberano USD',
    precio: 90.84,
    varPrecio: -1.5,
    tir: 16.1,
    varTir: 1.3,
    duracion: 4.1,
    cupon: 4.0,
    fechaVencimiento: '2030-07-09',
    tendencia: '📉 estable',
    analisis: 'Mayor duration, más volatilidad. 🟡 MANTENER'
  },
  {
    ticker: 'GD35',
    nombre: 'Global 2035',
    tipo: 'Soberano USD',
    precio: 112.81,
    varPrecio: -2.3,
    tir: 18.2,
    varTir: 1.6,
    duracion: 6.0,
    cupon: 4.2,
    fechaVencimiento: '2035-07-09',
    tendencia: '🔥 fuerte',
    analisis: 'Máxima TIR de la curva. Alto riesgo. 🟡 MANTENER'
  },
  {
    ticker: 'GD38',
    nombre: 'Global 2038',
    tipo: 'Soberano USD',
    precio: 117.58,
    varPrecio: -2.7,
    tir: 18.5,
    varTir: 1.7,
    duracion: 7.2,
    cupon: 4.5,
    fechaVencimiento: '2038-01-15',
    tendencia: '🔥 fuerte',
    analisis: 'TIR muy alta, plazo extremo. Alto riesgo. ⚠️ ESPECULATIVO'
  },
  {
    ticker: 'AE38',
    nombre: 'AE38',
    tipo: 'Soberano USD',
    precio: 113.61,
    varPrecio: -2.0,
    tir: 17.9,
    varTir: 1.5,
    duracion: 6.5,
    cupon: 4.3,
    fechaVencimiento: '2038-06-15',
    tendencia: '📈 estable',
    analisis: 'Buena relación riesgo/retorno. 🟢 COMPRAR'
  },
  {
    ticker: 'AL41D',
    nombre: 'Bonar 2041 D',
    tipo: 'Soberano USD (D)',
    precio: 71.86,
    varPrecio: -1.1,
    tir: 9.8,
    varTir: 0.5,
    duracion: 8.1,
    cupon: 3.2,
    fechaVencimiento: '2041-03-15',
    tendencia: '📈 estable',
    analisis: 'Versión dólar, menor TIR pero más estable. 🟢 COMPRAR'
  },
  {
    ticker: 'AO27',
    nombre: 'AO27',
    tipo: 'Soberano USD',
    precio: 150.00,
    varPrecio: 0.5,
    tir: 8.5,
    varTir: -0.2,
    duracion: 1.8,
    cupon: 5.0,
    fechaVencimiento: '2027-10-29',
    tendencia: '📈 estable',
    analisis: 'Corto plazo, cupón alto. Muy estable. 🟢 COMPRAR'
  }
];

const BonosTab = () => {
  const [soloFavoritos, setSoloFavoritos] = useState(false);
  const { favoritos } = usePremiumStore();
  
  const bonosFiltrados = useMemo(() => {
    let filtrados = [...bonos];
    
    if (soloFavoritos) {
      filtrados = filtrados.filter(bono => 
        favoritos.bonos?.includes(bono.ticker)
      );
    }
    
    return filtrados.sort((a, b) => {
      const aFav = favoritos.bonos?.includes(a.ticker);
      const bFav = favoritos.bonos?.includes(b.ticker);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return 0;
    });
  }, [bonos, favoritos.bonos, soloFavoritos]);

  return (
    <div className="space-y-4">
      {/* Header con filtros y contadores */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">
            {bonosFiltrados.length} bonos
          </span>
          {soloFavoritos && (
            <span className="text-xs bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded-full">
              Solo favoritos
            </span>
          )}
        </div>
        
        <button
          onClick={() => setSoloFavoritos(!soloFavoritos)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition ${
            soloFavoritos 
              ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30' 
              : 'bg-gray-800/50 text-gray-400 hover:text-gray-300'
          }`}
        >
          <Star className={`w-4 h-4 ${soloFavoritos ? 'fill-yellow-400' : ''}`} />
          {soloFavoritos ? 'Mostrando favoritos' : 'Mostrar solo favoritos'}
        </button>
      </div>

      {bonosFiltrados.length === 0 ? (
        <div className="text-center py-8 bg-gray-800/30 rounded-xl">
          <Star className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No hay favoritos aún</p>
          <p className="text-sm text-gray-500 mt-1">
            Hacé clic en la ⭐ de cualquier bono para agregarlo
          </p>
        </div>
      ) : (
        bonosFiltrados.map(bono => (
          <BonoCard key={bono.ticker} bono={bono} />
        ))
      )}
      
      <button className="w-full py-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-gray-400 transition">
        Cargar más bonos...
      </button>
    </div>
  );
};

export default BonosTab;