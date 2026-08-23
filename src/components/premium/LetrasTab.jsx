// src/components/premium/LetrasTab.jsx
import React, { useState, useEffect, useCallback } from 'react';
import LetraCard from './LetraCard';
import { usePremiumStore } from '../../stores/premiumStore';
import { letrasApi } from '../../api/letrasApi';
import { Star, RefreshCw } from 'lucide-react';

const normalizarLetra = (letra) => {
  const descripcionCompleta = String(letra?.ticker || '').trim();
  const [ticker = '', ...nombrePartes] = descripcionCompleta.split(/\s+/);
  const nombre = nombrePartes.join(' ');
  const fecha = descripcionCompleta.match(/(\d{2})\/(\d{2})\/(\d{2,4})/);
  const vencimiento = fecha
    ? `${fecha[3].length === 2 ? `20${fecha[3]}` : fecha[3]}-${fecha[2]}-${fecha[1]}`
    : null;
  const plazo = vencimiento
    ? Math.max(0, Math.ceil((new Date(`${vencimiento}T12:00:00`) - new Date()) / 86400000))
    : null;

  return {
    ...letra,
    ticker,
    nombre: nombre || ticker,
    tipo: /cer|aj.*cer/i.test(descripcionCompleta)
      ? 'Ajustable por CER'
      : /tamar/i.test(descripcionCompleta)
        ? 'Capitalizable TAMAR'
        : /vinc.*usd|d[oó]lar/i.test(descripcionCompleta)
          ? 'Vinculada al dólar'
          : 'Capitalizable',
    moneda: /usd/i.test(descripcionCompleta) ? 'USD vinculada' : 'ARS',
    vencimiento,
    plazo
  };
};

const LetrasTab = () => {
  const [letras, setLetras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [soloFavoritos, setSoloFavoritos] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const { favoritos } = usePremiumStore();

  const fetchLetras = useCallback(async () => {
    try {
      setLoading(true);
      const data = await letrasApi.getLetras();
      
      // Si data es un array, usarlo directamente
      const letrasArray = Array.isArray(data) ? data : (data.data || []);
      
      if (Array.isArray(letrasArray) && letrasArray.length > 0) {
        const letrasNacionales = letrasArray
          .filter(letra => {
            const descripcion = String(letra?.ticker || '');
            const precio = Number(letra?.ultimo);
            const esTesoroNacional = /tesoro nacional|l\.?\s*t\.?\s*na(?:cio)?/i.test(descripcion);
            return esTesoroNacional && precio >= 1;
          })
          .map(normalizarLetra);
        setLetras(letrasNacionales);
        setLastUpdate(new Date());
      } else {
        console.error('letrasArray no es un array:', letrasArray);
        setLetras([]);
      }
    } catch (error) {
      console.error('Error fetching letras:', error);
      setLetras([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLetras(); // carga inicial
    
    // Actualizar cada 20 minutos (1,200,000 ms)
    const interval = setInterval(fetchLetras, 20 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchLetras]);

  const letrasFiltradas = letras
    .filter(letra => letra != null)
    .filter(letra => !soloFavoritos || (favoritos.letras && favoritos.letras.includes(letra.ticker)))
    .sort((a, b) => {
      const aFav = favoritos.letras?.includes(a.ticker);
      const bFav = favoritos.letras?.includes(b.ticker);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return 0;
    });

  if (loading && letras.length === 0) {
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
            {letrasFiltradas.length} letras
          </span>
          {lastUpdate && (
            <span className="text-xs text-gray-500">
              Actualizado: {lastUpdate.toLocaleTimeString('es-AR')}
            </span>
          )}
          <button
            onClick={fetchLetras}
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

      {letrasFiltradas.length === 0 ? (
        <div className="text-center py-8 bg-gray-800/30 rounded-xl">
          <Star className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No hay letras para mostrar</p>
          <p className="text-sm text-gray-500 mt-1">Las letras se actualizan automáticamente</p>
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
