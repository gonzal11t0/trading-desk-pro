// src/components/premium/LetrasTab.jsx
import React, { useState, useEffect } from 'react';
import LetraCard from './LetraCard';
import { usePremiumStore } from '../../stores/premiumStore';
import { letrasApi } from '../../../api/letrasApi';
import { Star } from 'lucide-react';

const LetrasTab = () => {
  const [letras, setLetras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [soloFavoritos, setSoloFavoritos] = useState(false);
  const { favoritos } = usePremiumStore();

  useEffect(() => {
    const fetchLetras = async () => {
      try {
        const data = await letrasApi.getLetras();
        console.log('Datos de letras (raw):', data);
        
        // Extraer el array correctamente de la respuesta { success: true, data: [...] }
        const letrasArray = data.success ? data.data : data;
        
        if (Array.isArray(letrasArray)) {
          // Filtrar las que nos interesan
          const filtradas = letrasArray.filter(letra => 
            ['S27F6', 'S29Y6', 'S30N6', 'X29Y6', 'X30N6', 'TZX27', 'M31G6', 'D27F6'].includes(letra.ticker)
          );
          console.log('Letras filtradas:', filtradas);
          setLetras(filtradas);
        } else {
          console.error('letrasArray no es un array:', letrasArray);
        }
      } catch (error) {
        console.error('Error fetching letras:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLetras();
  }, []);

  const letrasFiltradas = letras
    .filter(letra => letra != null)
    .filter(letra => !soloFavoritos || favoritos.letras?.includes(letra.ticker))
    .sort((a, b) => {
      const aFav = favoritos.letras?.includes(a.ticker);
      const bFav = favoritos.letras?.includes(b.ticker);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return 0;
    });

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
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
          <p className="text-gray-400">No hay letras para mostrar</p>
        </div>
      ) : (
        letrasFiltradas.map(letra => (
          <LetraCard key={letra.ticker} letra={letra} />
        ))
      )}
    </div>
  );
};

export default LetrasTab;