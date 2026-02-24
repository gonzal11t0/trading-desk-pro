// src/components/premium/AnalisisPremium.jsx
import React, { useState } from 'react';
import BalancesTab from './BalancesTab';
import BonosTab from './BonosTab';
import LetrasTab from './LetrasTab';
import { Crown } from 'lucide-react';

const AnalisisPremium = () => {
  const [tabActiva, setTabActiva] = useState('balances');
  
  const tabs = [
    { id: 'balances', nombre: '📈 Balances', componente: <BalancesTab /> },
    { id: 'bonos', nombre: '💰 Bonos', componente: <BonosTab /> },
    { id: 'letras', nombre: '📝 Letras', componente: <LetrasTab /> }
  ];

  return (
    <div className="min-w-0">
      {/* Header premium */}
      <div className="bg-gradient-to-r from-yellow-900/20 to-yellow-800/10 rounded-xl p-6 border border-yellow-700/30 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Crown className="w-6 h-6 text-yellow-400" />
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Análisis <span className="text-yellow-400">Premium</span>
          </h1>
        </div>
        <p className="text-gray-400">
          Balances, bonos y letras con análisis automático y calculadoras en tiempo real
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setTabActiva(tab.id)}
            className={`px-6 py-3 font-medium transition ${
              tabActiva === tab.id
                ? 'text-yellow-400 border-b-2 border-yellow-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab.nombre}
          </button>
        ))}
      </div>

      {/* Contenido de la pestaña activa */}
      <div className="space-y-4">
        {tabs.find(t => t.id === tabActiva)?.componente}
      </div>
    </div>
  );
};

export default AnalisisPremium;