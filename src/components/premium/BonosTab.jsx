// src/components/premium/BonosTab.jsx
import React, { useMemo, useState } from 'react';
import BonoCard from './BonoCard';
import { usePremiumStore } from '../../stores/premiumStore';
import { Star } from 'lucide-react';
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
      <div className="flex justify-end mb-2">
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