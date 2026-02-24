// src/components/premium/BalancesTab.jsx
import React from 'react';
import EmpresaCard from './EmpresaCard';

// Datos simulados (después vendrán de una API)
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
  return (
    <div className="space-y-4">
      {empresas.map(empresa => (
        <EmpresaCard key={empresa.ticker} empresa={empresa} />
      ))}
      
      {/* Botón para cargar más */}
      <button className="w-full py-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-gray-400 transition">
        Cargar más empresas...
      </button>
    </div>
  );
};

export default BalancesTab;