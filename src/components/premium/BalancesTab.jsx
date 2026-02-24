// src/components/premium/BalancesTab.jsx
import React, { useMemo, useState } from 'react';
import EmpresaCard from './EmpresaCard';
import { usePremiumStore } from '../../stores/premiumStore';
import { Star } from 'lucide-react';
// Datos simulados
const empresas = [
  {
    ticker: 'YPF',
    ultimoBalance: 'Dic 2025',
    ingresos: '$4.200M',
    varIngresos: 35,
    ebitda: '$1.100M',
    varEbitda: 37,
    deuda: '$5.300M',
    varDeuda: 8,
    per: '8.2x',
    varPer: 15,
    roe: '18%',
    varRoe: 3,
    deudaEbitda: '4.8x',
    analisis: 'Crecimiento superior al sector. Deuda controlada. Valuación atractiva. 🟢 COMPRAR'
  },
  {
    ticker: 'PAMPA',
    ultimoBalance: 'Dic 2025',
    ingresos: '$2.100M',
    varIngresos: 22,
    ebitda: '$580M',
    varEbitda: 25,
    deuda: '$3.200M',
    varDeuda: -5,
    per: '6.5x',
    varPer: 10,
    roe: '15%',
    varRoe: 2,
    deudaEbitda: '5.5x',
    analisis: 'Sólido desempeño en generación. Reducción de deuda. 🟢 COMPRAR'
  },
  {
    ticker: 'GGAL',
    ultimoBalance: 'Dic 2025',
    ingresos: '$1.800M',
    varIngresos: 28,
    ebitda: '$720M',
    varEbitda: 32,
    deuda: '$2.100M',
    varDeuda: 12,
    per: '7.8x',
    varPer: 8,
    roe: '22%',
    varRoe: 4,
    deudaEbitda: '2.9x',
    analisis: 'Banco líder con alta rentabilidad. Cartera diversificada. 🟢 COMPRAR'
  },
  {
    ticker: 'EDN',
    ultimoBalance: 'Dic 2025',
    ingresos: '$950M',
    varIngresos: 18,
    ebitda: '$310M',
    varEbitda: 15,
    deuda: '$1.100M',
    varDeuda: 22,
    per: '9.2x',
    varPer: -3,
    roe: '12%',
    varRoe: 1,
    deudaEbitda: '3.5x',
    analisis: 'Inversiones en infraestructura. Deuda en aumento. 🟡 MANTENER'
  }
];

const BalancesTab = () => {
  const [soloFavoritos, setSoloFavoritos] = useState(false);
  const { favoritos } = usePremiumStore();
  
  // Filtrar y ordenar empresas
  const empresasFiltradas = useMemo(() => {
    let filtradas = [...empresas];
    
    // Filtrar solo favoritos si está activado
    if (soloFavoritos) {
      filtradas = filtradas.filter(emp => 
        favoritos.balances?.includes(emp.ticker)
      );
    }
    
    // Ordenar: primero favoritos, luego el resto
    return filtradas.sort((a, b) => {
      const aFav = favoritos.balances?.includes(a.ticker);
      const bFav = favoritos.balances?.includes(b.ticker);
      
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return 0;
    });
  }, [empresas, favoritos.balances, soloFavoritos]);

  return (
    <div className="space-y-4">
      {/* Filtro de favoritos */}
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
      
      <button className="w-full py-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-gray-400 transition">
        Cargar más empresas...
      </button>
    </div>
  );
};

export default BalancesTab;