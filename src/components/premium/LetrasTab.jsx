// src/components/premium/LetrasTab.jsx
import React, { useState, useMemo } from 'react';
import LetraCard from './LetraCard';
import { usePremiumStore } from '../../stores/premiumStore';
import { Star } from 'lucide-react';

// Datos reales de letras y bonos CER (al 27/02/2026)
const letras = [
  {
    ticker: 'S27F6',
    nombre: 'LETRA S27F6',
    tipo: 'Capitalización',
    precio: 1202.40,
    varPrecio: -0.5,
    tna: 38.0,
    tea: 42.3,
    vencimiento: '2026-02-27',
    plazo: 30,
    tendencia: '📈 estable',
    analisis: 'Corto plazo, buena tasa. 🟢 COMPRAR'
  },
  {
    ticker: 'S29Y6',
    nombre: 'LETRA S29Y6',
    tipo: 'Capitalización',
    precio: 1165.50,
    varPrecio: -0.8,
    tna: 42.0,
    tea: 47.8,
    vencimiento: '2026-05-29',
    plazo: 90,
    tendencia: '🔥 fuerte',
    analisis: 'Alta tasa, plazo intermedio. 🟢 COMPRAR'
  },
  {
    ticker: 'S30N6',
    nombre: 'LETRA S30N6',
    tipo: 'Capitalización',
    precio: 1002.50,
    varPrecio: -1.2,
    tna: 40.0,
    tea: 45.1,
    vencimiento: '2026-11-30',
    plazo: 270,
    tendencia: '📈 estable',
    analisis: 'Largo plazo, tasa atractiva. 🟡 MANTENER'
  },
  {
    ticker: 'X29Y6',
    nombre: 'LETRA X29Y6 (CER)',
    tipo: 'Ajustable por inflación',
    precio: 1014.50,
    varPrecio: 0.3,
    tna: 22.0,
    tea: 24.5,
    vencimiento: '2026-05-29',
    plazo: 90,
    tendencia: '📈 estable',
    analisis: 'Cobertura inflacionaria. Tasa real positiva. 🟢 COMPRAR'
  },
  {
    ticker: 'X30N6',
    nombre: 'LETRA X30N6 (CER)',
    tipo: 'Ajustable por inflación',
    precio: 968.20,
    varPrecio: 0.2,
    tna: 22.0,
    tea: 24.5,
    vencimiento: '2026-11-30',
    plazo: 270,
    tendencia: '📈 estable',
    analisis: 'Cobertura inflacionaria a largo plazo. 🟢 COMPRAR'
  },
  {
    ticker: 'TZX27',
    nombre: 'BONO TZX27 (CER)',
    tipo: 'Ajustable por inflación',
    precio: 3058.00,
    varPrecio: 0.5,
    tna: 24.0,
    tea: 26.8,
    vencimiento: '2027-06-30',
    plazo: 480,
    tendencia: '📈 estable',
    analisis: 'Bono CER largo plazo, buena cobertura. 🟢 COMPRAR'
  },
  {
    ticker: 'TZX28',
    nombre: 'BONO TZX28 (CER)',
    tipo: 'Ajustable por inflación',
    precio: 2780.00,
    varPrecio: 0.4,
    tna: 24.0,
    tea: 26.8,
    vencimiento: '2028-06-30',
    plazo: 840,
    tendencia: '📈 estable',
    analisis: 'Muy largo plazo, alta exposición a inflación. 🟡 MANTENER'
  },
  {
    ticker: 'M31G6',
    nombre: 'M31G6 (TAMAR)',
    tipo: 'Capitalización',
    precio: 1067.00,
    varPrecio: -0.6,
    tna: 36.0,
    tea: 40.2,
    vencimiento: '2026-08-31',
    plazo: 180,
    tendencia: '📈 estable',
    analisis: 'Tasa intermedia, plazo razonable. 🟢 COMPRAR'
  },
  {
    ticker: 'D27F6',
    nombre: 'D27F6 (Dólar-linked)',
    tipo: 'Dólar-linked',
    precio: 128.00,
    varPrecio: 0.8,
    tna: 32.0,
    tea: 35.5,
    vencimiento: '2026-02-27',
    plazo: 30,
    tendencia: '🔥 fuerte',
    analisis: 'Protección cambiaria a corto plazo. 🟢 COMPRAR'
  },
  {
    ticker: 'AO27',
    nombre: 'AO27 (Bonar USD)',
    tipo: 'Dólar-linked',
    precio: 150.00,
    varPrecio: 0.5,
    tna: 28.0,
    tea: 31.2,
    vencimiento: '2027-10-29',
    plazo: 600,
    tendencia: '📈 estable',
    analisis: 'Dólar-linked largo plazo, estabilidad. 🟢 COMPRAR'
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
      {/* Header con filtros y contadores */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">
            {letrasFiltradas.length} instrumentos
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

      {letrasFiltradas.length === 0 ? (
        <div className="text-center py-8 bg-gray-800/30 rounded-xl">
          <Star className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No hay favoritos aún</p>
          <p className="text-sm text-gray-500 mt-1">
            Hacé clic en la ⭐ de cualquier instrumento para agregarlo
          </p>
        </div>
      ) : (
        letrasFiltradas.map(letra => (
          <LetraCard key={letra.ticker} letra={letra} />
        ))
      )}
      
      <button className="w-full py-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-gray-400 transition">
        Cargar más instrumentos...
      </button>
    </div>
  );
};

export default LetrasTab;