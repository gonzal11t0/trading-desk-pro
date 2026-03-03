// src/components/premium/BonosTab.jsx
import React, { useState, useEffect } from 'react';
import BonoCard from './BonoCard';
import { usePremiumStore } from '../../stores/premiumStore';
import { bonosApi } from '../../../api/bonosApi';
import { Star } from 'lucide-react';

const BonosTab = () => {
  const [bonos, setBonos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [soloFavoritos, setSoloFavoritos] = useState(false);
  const { favoritos } = usePremiumStore();

  useEffect(() => {
    const fetchBonos = async () => {
      try {
        const data = await bonosApi.getBonos();
        // Filtramos los que nos interesan
        const filtrados = data.filter(bono => 
          bono && ['AL30', 'AL35', 'GD30', 'GD35', 'AL41', 'AN29', 'AE38', 'AO27'].includes(bono.symbol)
        );
        setBonos(filtrados);
      } catch (error) {
        console.error('Error fetching bonos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBonos();
  }, []);

  const bonosFiltrados = bonos
    .filter(bono => bono != null)
    .filter(bono => !soloFavoritos || favoritos.bonos?.includes(bono.symbol))
    .sort((a, b) => {
      const aFav = favoritos.bonos?.includes(a.symbol);
      const bFav = favoritos.bonos?.includes(b.symbol);
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
      {/* Filtro de favoritos */}
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

      {/* Lista de bonos */}
      {bonosFiltrados.length === 0 ? (
        <div className="text-center py-8 bg-gray-800/30 rounded-xl">
          <Star className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No hay bonos para mostrar</p>
        </div>
      ) : (
        bonosFiltrados.map(bono => (
          <BonoCard key={bono.symbol} bono={bono} />
        ))
      )}
    </div>
  );
};

export default BonosTab;