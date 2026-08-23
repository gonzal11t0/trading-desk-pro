import React, { useState, useEffect, useMemo } from 'react';
import EmpresaCard from './EmpresaCard';
import { usePremiumStore } from '../../stores/premiumStore';
import { Star } from 'lucide-react';
import balancesData from '../../data/balances_reales.json';
import { companyApi } from '../../api/companyApi';

const BalancesTab = () => {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [soloFavoritos, setSoloFavoritos] = useState(false);
  const [preciosActualizados, setPreciosActualizados] = useState(0);
  const { favoritos } = usePremiumStore();

  useEffect(() => {
    setEmpresas(balancesData.empresas);
    setLoading(false);

    Promise.allSettled(
      balancesData.empresas.map(async empresa => ({
        ticker: empresa.ticker,
        data: await companyApi.getCompany(empresa.ticker)
      }))
    ).then(results => {
      const cotizaciones = new Map(
        results
          .filter(result => result.status === 'fulfilled' && Number.isFinite(Number(result.value.data?.precio)))
          .map(result => [result.value.ticker, result.value.data])
      );
      setPreciosActualizados(cotizaciones.size);
      setEmpresas(actuales => actuales.map(empresa => {
        const mercado = cotizaciones.get(empresa.ticker);
        return mercado ? {
          ...empresa,
          precio: Number(mercado.precio),
          per: Number.isFinite(Number(mercado.per)) ? Number(mercado.per) : empresa.per,
          precioEnVivo: true
        } : empresa;
      }));
    });
  }, []);

  const empresasFiltradas = useMemo(() => {
    let filtradas = [...empresas];
    
    if (soloFavoritos) {
      filtradas = filtradas.filter(emp => 
        favoritos.balances?.includes(emp.ticker)
      );
    }
    
    return filtradas.sort((a, b) => {
      const aFav = favoritos.balances?.includes(a.ticker);
      const bFav = favoritos.balances?.includes(b.ticker);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return 0;
    });
  }, [empresas, favoritos.balances, soloFavoritos]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header con filtros y contadores */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">
            {empresasFiltradas.length} empresas
          </span>
          {soloFavoritos && (
            <span className="text-xs bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded-full">
              Solo favoritos
            </span>
          )}
          <span className="text-xs text-gray-500 ml-2">
            Balances cargados: {balancesData.ultima_actualizacion}
          </span>
          <span className="text-xs text-gray-500">
            · Cotizaciones actualizadas: {preciosActualizados}/{balancesData.empresas.length}
          </span>
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

      {/* Lista de empresas */}
      {empresasFiltradas.length === 0 ? (
        <div className="text-center py-8 bg-gray-800/30 rounded-xl">
          <Star className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No hay favoritos aún</p>
          <p className="text-sm text-gray-500 mt-1">
            Hacé clic en la ⭐ de cualquier empresa para agregarla
          </p>
        </div>
      ) : (
        empresasFiltradas.map(empresa => (
          <EmpresaCard key={empresa.ticker} empresa={empresa} />
        ))
      )}
      
      <p className="text-xs text-gray-500 text-center px-4">
        Los importes del balance provienen del archivo local fechado. Precio y PER se consultan al mercado cuando la fuente responde.
        No constituyen una recomendación de inversión.
      </p>
    </div>
  );
};

export default BalancesTab;
