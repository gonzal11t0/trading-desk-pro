// src/components/premium/ModalBono.jsx
import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, Download, Calculator, Calendar } from 'lucide-react';
import { exportarEmpresaPDF } from '../../utils/pdfExport';

const ModalBono = ({ isOpen, onClose, bono }) => {
  const [montoInversion, setMontoInversion] = useState(1000000);
  
  if (!isOpen) return null;

  // Calcular rendimiento estimado
  const rendimientoEstimado = montoInversion * (bono.tir / 100);
  const inflacionProyectada = 40; // 40% anual
  const gananciaReal = rendimientoEstimado - (montoInversion * (inflacionProyectada / 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">
              {bono.ticker} - {bono.nombre}
            </h2>
            <p className="text-sm text-gray-400">{bono.tipo}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Datos del bono */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/30 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Precio actual</p>
              <p className="text-xl font-bold text-white">${bono.precio.toFixed(2)}</p>
              <p className={`text-sm ${bono.varPrecio > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {bono.varPrecio > 0 ? '+' : ''}{bono.varPrecio}% vs ayer
              </p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">TIR</p>
              <p className="text-xl font-bold text-green-400">{bono.tir}%</p>
              <p className={`text-sm ${bono.varTir > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {bono.varTir > 0 ? '+' : ''}{bono.varTir}pp
              </p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Duración</p>
              <p className="text-xl font-bold text-white">{bono.duracion} años</p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Cupón</p>
              <p className="text-xl font-bold text-white">{bono.cupon}%</p>
              <p className="text-xs text-gray-400">Vence: {new Date(bono.fechaVencimiento).toLocaleDateString('es-AR')}</p>
            </div>
          </div>

          {/* Calculadora de rendimiento */}
          <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-yellow-400" />
              Calculadora de Rendimiento
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Monto a invertir (ARS)</label>
                <input
                  type="number"
                  value={montoInversion}
                  onChange={(e) => setMontoInversion(Number(e.target.value))}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  min="10000"
                  step="10000"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Rendimiento estimado ({bono.tir}% TIR):</span>
                  <span className="text-green-400 font-semibold">
                    ${rendimientoEstimado.toFixed(2)} ({((rendimientoEstimado / montoInversion) * 100).toFixed(2)}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Inflación proyectada:</span>
                  <span className="text-red-400">{inflacionProyectada}%</span>
                </div>
                <div className="h-px bg-gray-700 my-2"></div>
                <div className="flex justify-between">
                  <span className="text-gray-300 font-medium">Ganancia real:</span>
                  <span className={gananciaReal > 0 ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                    ${gananciaReal.toFixed(2)} {gananciaReal > 0 ? '(positiva)' : '(negativa)'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * Cálculo estimado basado en TIR actual e inflación proyectada anual
                </p>
              </div>
            </div>
          </div>

          {/* Flujo de pagos */}
          <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-yellow-400" />
              Próximos pagos
            </h3>
            
            <div className="space-y-2">
              <div className="flex justify-between p-2 bg-gray-700/30 rounded">
                <span className="text-gray-300">15/05/2026</span>
                <span className="text-white font-semibold">${(montoInversion * (bono.cupon / 100) / 2).toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-700/30 rounded">
                <span className="text-gray-300">15/11/2026</span>
                <span className="text-white font-semibold">${(montoInversion * (bono.cupon / 100) / 2).toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-700/30 rounded">
                <span className="text-gray-300">15/05/2027</span>
                <span className="text-white font-semibold">${(montoInversion * (bono.cupon / 100) / 2).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Análisis detallado */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">🔍 Análisis Detallado</h3>
            <div className="space-y-3">
              <div className="p-3 bg-gray-800/30 rounded">
                <p className="text-sm text-gray-300">
                  <span className="text-yellow-400">• Rendimiento:</span> TIR de {bono.tir}% en USD, 
                  {bono.tir > 15 ? ' superior a bonos comparables.' : ' en línea con el mercado.'}
                </p>
              </div>
              <div className="p-3 bg-gray-800/30 rounded">
                <p className="text-sm text-gray-300">
                  <span className="text-yellow-400">• Duración:</span> {bono.duracion} años. 
                  {bono.duracion > 5 ? ' Alta sensibilidad a tasas.' : ' Moderada sensibilidad.'}
                </p>
              </div>
              <div className="p-3 bg-gray-800/30 rounded">
                <p className="text-sm text-gray-300">
                  <span className="text-yellow-400">• Riesgo:</span> {bono.tipo === 'Soberano USD' ? 'Riesgo país' : 'Riesgo corporativo'}. 
                  {bono.tir > 16 ? ' Alto rendimiento, alto riesgo.' : ' Riesgo moderado.'}
                </p>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4">
            <button 
  onClick={() => exportarEmpresaPDF(bono)}
  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg transition flex items-center justify-center gap-2"
>
  <Download className="w-4 h-4" />
  Exportar PDF
</button>
            <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition">
              Ver histórico
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalBono;