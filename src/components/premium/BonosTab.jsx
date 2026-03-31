import React, { useState, useEffect } from 'react';
import BonoCard from './BonoCard';
import { usePremiumStore } from '../../stores/premiumStore';
import { bonosApi } from '../../../api/bonosApi';
import { Star, RefreshCw } from 'lucide-react';

const BonosTab = () => {
  const [bonos, setBonos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [soloFavoritos, setSoloFavoritos] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const { favoritos } = usePremiumStore();

  const fetchBonos = async () => {
    try {
      setLoading(true);
      const data = await bonosApi.getBonos();
      
      const filtrados = data.filter(bono => {
        const ticker = bono.ticker;
        return ticker === 'AL30' || ticker === 'AL30C' || ticker === 'AL30D' ||
               ticker === 'AL35' || ticker === 'AL35C' || ticker === 'AL35D' ||
               ticker === 'GD30' || ticker === 'GD30C' || ticker === 'GD30D' ||
               ticker === 'GD35' || ticker === 'GD35C' || ticker === 'GD35D' ||
               ticker === 'AE38' || ticker === 'AE38C' || ticker === 'AE38D' ||
               ticker === 'AL41' || ticker === 'AL41C' || ticker === 'AL41D' ||
               ticker === 'AN29' || ticker === 'AN29C' || ticker === 'AN29D' ||
               ticker === 'AO27' || ticker === 'AO27C' || ticker === 'AO27D';
      });
      
      setBonos(filtrados);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching bonos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBonos(); // carga inicial
    
    // Actualizar cada 25 minutos (1,500,000 ms)
    const interval = setInterval(fetchBonos, 25 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const bonosFiltrados = bonos
    .filter(bono => bono != null)
    .filter(bono => !soloFavoritos || favoritos.bonos?.includes(bono.ticker))
    .sort((a, b) => {
      const aFav = favoritos.bonos?.includes(a.ticker);
      const bFav = favoritos.bonos?.includes(b.ticker);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return 0;
    });

  if (loading && bonos.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header con filtros y última actualización */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">
            {bonosFiltrados.length} bonos
          </span>
          {lastUpdate && (
            <span className="text-xs text-gray-500">
              Actualizado: {lastUpdate.toLocaleTimeString('es-AR')}
            </span>
          )}
          <button
            onClick={fetchBonos}
            disabled={loading}
            className="p-1 hover:bg-gray-700 rounded-lg transition"
            title="Actualizar ahora"
          >
            <RefreshCw className={`w-4 h-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
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

      {/* Lista de bonos */}
      {bonosFiltrados.length === 0 ? (
        <div className="text-center py-8 bg-gray-800/30 rounded-xl">
          <Star className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No hay bonos para mostrar</p>
        </div>
      ) : (
        bonosFiltrados.map(bono => (
          <BonoCard key={bono.ticker} bono={bono} />
        ))
      )}
    </div>
  );
};

export default BonosTab;