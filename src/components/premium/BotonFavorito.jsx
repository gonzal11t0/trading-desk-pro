// src/components/premium/BotonFavorito.jsx
import React from 'react';
import { Star } from 'lucide-react';
import { usePremiumStore } from '../../stores/premiumStore';

const BotonFavorito = ({ tipo, ticker, size = 'md' }) => {
  const { favoritos, toggleFavorito, esFavorito } = usePremiumStore();
  const isFav = esFavorito(tipo, ticker);

  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorito(tipo, ticker);
      }}
      className={`${sizes[size]} rounded-full flex items-center justify-center transition ${
        isFav 
          ? 'text-yellow-400 hover:text-yellow-500' 
          : 'text-gray-500 hover:text-gray-400'
      }`}
      title={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      <Star className={`w-5 h-5 ${isFav ? 'fill-yellow-400' : ''}`} />
    </button>
  );
};

export default BotonFavorito;