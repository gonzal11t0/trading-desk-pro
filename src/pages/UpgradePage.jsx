// src/pages/UpgradePage.jsx
import React from 'react';
import { Crown, ArrowRight, Check, Info, Clock } from 'lucide-react';

const UpgradePage = () => {
  // Función para activar premium en pruebas
  const activarPruebaGratis = () => {
    localStorage.setItem('esPremium', 'true');
    // Opcional: guardar timestamp para controlar expiración
    localStorage.setItem('pruebaInicio', Date.now().toString());
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

          {/* ⚠️ ACLARACIÓN SOBRE DATOS SIMULADOS */}
          <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
            <p className="text-sm text-yellow-300 flex items-start gap-2">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="font-semibold">🟡 Datos simulados:</strong> Los bonos y letras que verás durante la prueba son demostrativos. 
                La versión completa incluirá datos en tiempo real de fuentes oficiales.
              </span>
            </p>
          </div>

          {/* Botón de prueba gratuita */}
          <button
            onClick={activarPruebaGratis}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-2"
          >
            <Clock className="w-5 h-5" />
            ACTIVAR PRUEBA GRATIS POR 3 DÍAS
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <p className="text-xs text-gray-500 text-center mt-4">
            * Sin compromiso, sin tarjeta de crédito. Luego de los 3 días, podés suscribirte por $10.000/mes.
          </p>
        </div>

        {/* Preview de lo que verán */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
            <h3 className="font-semibold text-white mb-2">📈 Balances</h3>
            <p className="text-sm text-gray-400">YPF, PAMPA, GGAL, EDN y más</p>
            <p className="text-xs text-green-400 mt-2">✅ Datos reales</p>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
            <h3 className="font-semibold text-white mb-2">💰 Bonos</h3>
            <p className="text-sm text-gray-400">AL30, GD30, YPF 2029, PAMP 2028</p>
            <p className="text-xs text-yellow-400 mt-2">🟡 Datos simulados (demostración)</p>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
            <h3 className="font-semibold text-white mb-2">📝 Letras</h3>
            <p className="text-sm text-gray-400">LETRAS CAP, DIS, LECAP</p>
            <p className="text-xs text-yellow-400 mt-2">🟡 Datos simulados (demostración)</p>
          </div>
        </div>

        {/* Mensaje final */}
        <p className="text-xs text-gray-600 text-center mt-8">
          Al activar la prueba aceptás que los datos de bonos y letras son simulados con fines demostrativos.
          Pronto estará disponible el pago real con Mercado Pago.
        </p>
      </div>
    </div>
  );
};

export default UpgradePage;