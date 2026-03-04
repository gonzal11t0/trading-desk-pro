// src/pages/UpgradePage.jsx
import React from 'react';
import { Crown, ArrowRight, Check, Info  } from 'lucide-react';

const UpgradePage = () => {
  // Función para activar premium en pruebas
  const activarPremiumPrueba = () => {
    localStorage.setItem('esPremium', 'true');
    window.location.href = '/analisis-premium';
  };

  return (
    <div className="min-w-0 bg-gray-950 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <Crown className="w-16 h-16 text-yellow-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Actualizate a <span className="text-yellow-400">Premium</span>
          </h1>
          <p className="text-xl text-gray-400">
            Accedé a análisis profesional de empresas, bonos y letras
          </p>
        </div>

        {/* Pricing */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 border border-yellow-600/30 mb-10">
          <div className="text-center mb-6">
            <span className="text-3xl font-bold text-white">$10.000</span>
            <span className="text-gray-400">/mes</span>
          </div>
          
          <div className="space-y-4 mb-8">
            {[
              'Balances completos de 9 empresas argentinas',
              'Análisis automático con recomendaciones',
              'Bonos soberanos y corporativos con TIR',
              'Calculadora de ganancia real vs inflación',
              'Letras de corto plazo actualizadas',
              'Exportación a PDF y Excel',
              'Históricos y comparativos'
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">{item}</span>
              </div>
            ))}
          </div>

          {/* Botón de prueba (después será Mercado Pago) */}
          <button
            onClick={activarPremiumPrueba}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-2"
          >
            ACTIVAR PREMIUM (MODO PRUEBA)
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <p className="text-xs text-gray-500 text-center mt-4">
            * Modo prueba: activa premium con un clic (sin pago real)
          </p>
        </div>
        {/* Después del botón de prueba */}
        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
          <p className="text-sm text-blue-300 flex items-center gap-2">
            <Info className="w-4 h-4" />
            ⚠️ Modo demostración: activás premium con un clic. Pronto estará disponible el pago real con Mercado Pago.
          </p>
        </div>
        {/* Preview de lo que verán */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
            <h3 className="font-semibold text-white mb-2">📈 Balances</h3>
            <p className="text-sm text-gray-400">YPF, PAMPA, GGAL, EDN y más</p>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
            <h3 className="font-semibold text-white mb-2">💰 Bonos</h3>
            <p className="text-sm text-gray-400">AL30, GD30, YPF 2029, PAMP 2028</p>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
            <h3 className="font-semibold text-white mb-2">📝 Letras</h3>
            <p className="text-sm text-gray-400">LETRAS CAP, DIS, LECAP</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;  // <--- TIENE QUE ESTAR ASÍ