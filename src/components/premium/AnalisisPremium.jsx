// src/components/premium/AnalisisPremium.jsx
import React, { useState } from 'react';
import BalancesTab from './BalancesTab';
import BonosTab from './BonosTab';
import LetrasTab from './LetrasTab';
import PanelAlertas from './PanelAlertas';
import { Crown, Bell, Sparkles } from 'lucide-react';

const AnalisisPremium = () => {
  const [tabActiva, setTabActiva] = useState('balances');
  const [panelAlertasAbierto, setPanelAlertasAbierto] = useState(false);
  
  const tabs = [
    { id: 'balances', nombre: '📈 Balances', icono: '📈', componente: <BalancesTab /> },
    { id: 'bonos', nombre: '💰 Bonos', icono: '💰', componente: <BonosTab /> },
    { id: 'letras', nombre: '📝 Letras', icono: '📝', componente: <LetrasTab /> }
  ];

  return (
    <div className="min-w-0 animate-fadeIn">
      {/* Header premium con diseño mejorado */}
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 border border-gray-700/50">
        {/* Efecto de brillo */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500/20 rounded-2xl border border-yellow-500/30">
              <Crown className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-2">
                Análisis Premium
                <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
              </h1>
              <p className="text-gray-400 mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Balances, bonos y letras con análisis profesional
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setPanelAlertasAbierto(true)}
            className="relative group p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-all hover:scale-105 border border-gray-700/50"
            title="Mis alertas"
          >
            <Bell className="w-5 h-5 text-yellow-400 group-hover:animate-bounce" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center animate-pulse">
              3
            </span>
          </button>
        </div>
      </div>

      {/* Tabs con diseño mejorado */}
      <div className="flex gap-1 mb-6 p-1 bg-gray-800/30 rounded-xl border border-gray-700/50">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setTabActiva(tab.id)}
            className={`flex-1 relative px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              tabActiva === tab.id
                ? 'bg-gradient-to-r from-yellow-600/20 to-yellow-600/10 text-yellow-400 shadow-lg shadow-yellow-600/10'
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
            }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <span>{tab.icono}</span>
              {tab.nombre}
            </span>
            {tabActiva === tab.id && (
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-yellow-400 rounded-full animate-slideIn" />
            )}
          </button>
        ))}
      </div>

      {/* Contenido con animación */}
      <div className="transition-opacity duration-300 animate-slideUp">
        {tabs.find(t => t.id === tabActiva)?.componente}
      </div>

      <PanelAlertas
        isOpen={panelAlertasAbierto}
        onClose={() => setPanelAlertasAbierto(false)}
      />
    </div>
  );
};

export default AnalisisPremium;