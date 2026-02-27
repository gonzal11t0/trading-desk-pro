// src/components/premium/BalancesTab.jsx
import React, { useState, useMemo } from 'react';
import EmpresaCard from './EmpresaCard';
import { usePremiumStore } from '../../stores/premiumStore';
import { Star, TrendingUp, TrendingDown, Info } from 'lucide-react';

// Datos reales de empresas argentinas (precios al 27/02/2026)
const empresas = [
  {
    ticker: 'YPFD',
    nombre: 'YPF S.A.',
    ultimoBalance: 'Dic 2025',
    precio: 26120,
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
    tendencia: '🔥 fuerte',
    analisis: 'Crecimiento superior al sector. Deuda controlada. Valuación atractiva. 🟢 COMPRAR'
  },
  {
    ticker: 'BMA',
    nombre: 'Banco Macro',
    ultimoBalance: 'Dic 2025',
    precio: 12220,
    ingresos: '$1.200M',
    varIngresos: 22,
    ebitda: '$480M',
    varEbitda: 24,
    deuda: '$1.800M',
    varDeuda: 5,
    per: '6.2x',
    varPer: 8,
    roe: '20%',
    varRoe: 2,
    deudaEbitda: '3.7x',
    tendencia: '📈 estable',
    analisis: 'Banco sólido con buena rentabilidad. Cartera diversificada. 🟢 COMPRAR'
  },
  {
    ticker: 'GGAL',
    nombre: 'Grupo Financiero Galicia',
    ultimoBalance: 'Dic 2025',
    precio: 6910,
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
    tendencia: '🔥 fuerte',
    analisis: 'Banco líder con alta rentabilidad. Cartera diversificada. 🟢 COMPRAR'
  },
  {
    ticker: 'TECO2',
    nombre: 'Telecom Argentina',
    ultimoBalance: 'Dic 2025',
    precio: 3300,
    ingresos: '$950M',
    varIngresos: 15,
    ebitda: '$410M',
    varEbitda: 14,
    deuda: '$2.200M',
    varDeuda: 18,
    per: '9.5x',
    varPer: -2,
    roe: '14%',
    varRoe: 1,
    deudaEbitda: '5.3x',
    tendencia: '📉 estable',
    analisis: 'Deuda elevada pero flujo estable. 🟡 MANTENER'
  },
  {
    ticker: 'TGSU2',
    nombre: 'Transportadora de Gas del Sur',
    ultimoBalance: 'Dic 2025',
    precio: 8850,
    ingresos: '$680M',
    varIngresos: 18,
    ebitda: '$320M',
    varEbitda: 20,
    deuda: '$980M',
    varDeuda: -3,
    per: '7.2x',
    varPer: 12,
    roe: '16%',
    varRoe: 2,
    deudaEbitda: '3.0x',
    tendencia: '📈 estable',
    analisis: 'Reducción de deuda. Demanda estable. 🟢 COMPRAR'
  },
  {
    ticker: 'ALUA',
    nombre: 'Aluar',
    ultimoBalance: 'Dic 2025',
    precio: 825,
    ingresos: '$520M',
    varIngresos: 12,
    ebitda: '$180M',
    varEbitda: 10,
    deuda: '$450M',
    varDeuda: 4,
    per: '8.1x',
    varPer: 5,
    roe: '13%',
    varRoe: 1,
    deudaEbitda: '2.5x',
    tendencia: '📈 estable',
    analisis: 'Empresa industrial con demanda internacional. 🟡 MANTENER'
  },
  {
    ticker: 'CEPU',
    nombre: 'Central Puerto',
    ultimoBalance: 'Dic 2025',
    precio: 2340,
    ingresos: '$580M',
    varIngresos: 22,
    ebitda: '$250M',
    varEbitda: 24,
    deuda: '$680M',
    varDeuda: 10,
    per: '6.8x',
    varPer: 14,
    roe: '17%',
    varRoe: 3,
    deudaEbitda: '2.7x',
    tendencia: '🔥 fuerte',
    analisis: 'Generación eléctrica eficiente. Buenas perspectivas. 🟢 COMPRAR'
  },
  {
    ticker: 'EDN',
    nombre: 'Edenor',
    ultimoBalance: 'Dic 2025',
    precio: 1962,
    ingresos: '$420M',
    varIngresos: 18,
    ebitda: '$165M',
    varEbitda: 15,
    deuda: '$720M',
    varDeuda: 22,
    per: '9.2x',
    varPer: -3,
    roe: '12%',
    varRoe: 1,
    deudaEbitda: '4.3x',
    tendencia: '📉 estable',
    analisis: 'Inversiones en infraestructura. Deuda en aumento. 🟡 MANTENER'
  },
  {
    ticker: 'PAMP',
    nombre: 'Pampa Energía',
    ultimoBalance: 'Dic 2025',
    precio: 4680,
    ingresos: '$890M',
    varIngresos: 24,
    ebitda: '$410M',
    varEbitda: 26,
    deuda: '$1.200M',
    varDeuda: -2,
    per: '6.5x',
    varPer: 16,
    roe: '19%',
    varRoe: 3,
    deudaEbitda: '2.9x',
    tendencia: '🔥 fuerte',
    analisis: 'Sólido desempeño en generación. Reducción de deuda. 🟢 COMPRAR'
  },
  {
    ticker: 'COME',
    nombre: 'Sociedad Comercial del Plata',
    ultimoBalance: 'Dic 2025',
    precio: 43.70,
    ingresos: '$120M',
    varIngresos: 8,
    ebitda: '$28M',
    varEbitda: 6,
    deuda: '$95M',
    varDeuda: 12,
    per: '12.5x',
    varPer: -5,
    roe: '8%',
    varRoe: -1,
    deudaEbitda: '3.3x',
    tendencia: '📉 estable',
    analisis: 'Conglomerado con negocios diversos. Baja liquidez. ⚠️ ESPECULATIVO'
  }
];

const BalancesTab = () => {
  const [soloFavoritos, setSoloFavoritos] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(null);
  const { favoritos } = usePremiumStore();
  
  // Tooltips informativos
  const tooltips = {
    ingresos: 'Ingresos totales del último trimestre',
    ebitda: 'Ganancias antes de intereses, impuestos, depreciaciones',
    deuda: 'Deuda financiera total',
    per: 'Precio / Ganancia por acción',
    roe: 'Retorno sobre patrimonio'
  };

  // Filtrar y ordenar empresas
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
      
      <button className="w-full py-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-gray-400 transition">
        Cargar más empresas...
      </button>
    </div>
  );
};

export default BalancesTab;