// src/components/premium/LetrasTab.jsx
import React, { useMemo, useState } from 'react';
import LetraCard from './LetraCard';
import { usePremiumStore } from '../../stores/premiumStore';
import { Star } from 'lucide-react';
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
  const [soloFavoritos, setSoloFavoritos] = useState(false);
  const { favoritos } = usePremiumStore();
  
  const letrasFiltradas = useMemo(() => {
    let filtradas = [...letras];
    
    if (soloFavoritos) {
      filtradas = filtradas.filter(letra => 
        favoritos.letras?.includes(letra.ticker)
      );
    }
    
    return filtradas.sort((a, b) => {
      const aFav = favoritos.letras?.includes(a.ticker);
      const bFav = favoritos.letras?.includes(b.ticker);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return 0;
    });
  }, [letras, favoritos.letras, soloFavoritos]);

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

      {letrasFiltradas.length === 0 ? (
        <div className="text-center py-8 bg-gray-800/30 rounded-xl">
          <Star className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No hay favoritos aún</p>
          <p className="text-sm text-gray-500 mt-1">
            Hacé clic en la ⭐ de cualquier letra para agregarla
          </p>
        </div>
      ) : (
        letrasFiltradas.map(letra => (
          <LetraCard key={letra.ticker} letra={letra} />
        ))
      )}
      
      <button className="w-full py-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-gray-400 transition">
        Cargar más letras...
      </button>
    </div>
  );
};

export default LetrasTab;