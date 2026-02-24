// src/components/premium/ModalBono.jsx
import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, Download, Calculator, Calendar, Clock } from 'lucide-react';
import { exportarBonoPDF } from '../../utils/pdfExport';

// Datos históricos simulados para bonos
const datosHistoricosBonos = {
  AL30: [
    { periodo: 'Feb 2026', precio: 42.50, tir: 15.2, variacion: -2.3 },
    { periodo: 'Ene 2026', precio: 43.50, tir: 14.8, variacion: 1.2 },
    { periodo: 'Dic 2025', precio: 43.00, tir: 15.0, variacion: -0.5 },
    { periodo: 'Nov 2025', precio: 43.20, tir: 14.9, variacion: 0.8 }
  ],
  GD30: [
    { periodo: 'Feb 2026', precio: 41.80, tir: 16.1, variacion: -1.8 },
    { periodo: 'Ene 2026', precio: 42.60, tir: 15.7, variacion: 0.5 },
    { periodo: 'Dic 2025', precio: 42.40, tir: 15.9, variacion: -0.3 },
    { periodo: 'Nov 2025', precio: 42.50, tir: 15.8, variacion: 0.2 }
  ],
  AL35: [
    { periodo: 'Feb 2026', precio: 38.20, tir: 17.5, variacion: -3.1 },
    { periodo: 'Ene 2026', precio: 39.40, tir: 16.9, variacion: -1.0 },
    { periodo: 'Dic 2025', precio: 39.80, tir: 16.7, variacion: 0.5 },
    { periodo: 'Nov 2025', precio: 39.60, tir: 16.8, variacion: -0.2 }
  ],
  GD35: [
    { periodo: 'Feb 2026', precio: 37.50, tir: 18.2, variacion: -2.7 },
    { periodo: 'Ene 2026', precio: 38.50, tir: 17.6, variacion: -0.8 },
    { periodo: 'Dic 2025', precio: 38.80, tir: 17.4, variacion: 0.3 },
    { periodo: 'Nov 2025', precio: 38.70, tir: 17.5, variacion: -0.1 }
  ],
  'YPF 2029': [
    { periodo: 'Feb 2026', precio: 68.30, tir: 9.8, variacion: 1.2 },
    { periodo: 'Ene 2026', precio: 67.50, tir: 10.1, variacion: 0.8 },
    { periodo: 'Dic 2025', precio: 67.00, tir: 10.3, variacion: 0.4 },
    { periodo: 'Nov 2025', precio: 66.70, tir: 10.5, variacion: 0.2 }
  ],
  'PAMP 2028': [
    { periodo: 'Feb 2026', precio: 72.10, tir: 8.5, variacion: 0.8 },
    { periodo: 'Ene 2026', precio: 71.50, tir: 8.7, variacion: 0.5 },
    { periodo: 'Dic 2025', precio: 71.20, tir: 8.9, variacion: 0.3 },
    { periodo: 'Nov 2025', precio: 71.00, tir: 9.0, variacion: 0.1 }
  ]
};

const ModalBono = ({ isOpen, onClose, bono }) => {
  const [tabActiva, setTabActiva] = useState('actual');
  const [montoInversion, setMontoInversion] = useState(1000000);
  
  if (!isOpen) return null;

  // Obtener histórico del bono
  const historico = datosHistoricosBonos[bono.ticker] || [];

  // Calcular rendimiento estimado
  const rendimientoEstimado = montoInversion * (bono.tir / 100);
  const inflacionProyectada = 40;
  const gananciaReal = rendimientoEstimado - (montoInversion * (inflacionProyectada / 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-gray-900 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
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

        {/* Tabs */}
        <div className="flex border-b border-gray-700 px-4">
          <button
            onClick={() => setTabActiva('actual')}
            className={`px-4 py-2 font-medium transition ${
              tabActiva === 'actual'
                ? 'text-yellow-400 border-b-2 border-yellow-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            📊 Actual
          </button>
          <button
            onClick={() => setTabActiva('historico')}
            className={`px-4 py-2 font-medium transition flex items-center gap-1 ${
              tabActiva === 'historico'
                ? 'text-yellow-400 border-b-2 border-yellow-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <Clock className="w-4 h-4" />
            Histórico
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {tabActiva === 'actual' ? (
            /* === TAB ACTUAL === */
            <div className="space-y-6">
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
            </div>
          ) : (
            /* === TAB HISTÓRICO === */
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                Evolución Mensual
              </h3>

              {/* Tabla histórica */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-2 text-gray-400">Período</th>
                      <th className="text-right py-3 px-2 text-gray-400">Precio (USD)</th>
                      <th className="text-right py-3 px-2 text-gray-400">TIR (%)</th>
                      <th className="text-right py-3 px-2 text-gray-400">Variación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historico.map((item, index) => (
                      <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/30">
                        <td className="py-3 px-2 text-white font-medium">{item.periodo}</td>
                        <td className="text-right py-3 px-2 text-green-400">${item.precio.toFixed(2)}</td>
                        <td className="text-right py-3 px-2 text-blue-400">{item.tir}%</td>
                        <td className={`text-right py-3 px-2 ${item.variacion > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {item.variacion > 0 ? '+' : ''}{item.variacion}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Análisis de tendencia */}
              {historico.length > 1 && (
                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                  <h4 className="font-semibold text-white mb-3">📈 Análisis de Tendencia</h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>
                      • <span className="text-yellow-400">Precio:</span> {historico[0].precio > historico[historico.length-1].precio ? 'Caída' : 'Aumento'} del {Math.abs(((historico[0].precio - historico[historico.length-1].precio) / historico[historico.length-1].precio * 100)).toFixed(1)}% en los últimos 3 meses
                    </p>
                    <p>
                      • <span className="text-yellow-400">TIR:</span> {historico[0].tir > historico[historico.length-1].tir ? 'Aumento' : 'Reducción'} de {Math.abs(historico[0].tir - historico[historico.length-1].tir).toFixed(1)} puntos porcentuales
                    </p>
                    <p>
                      • <span className="text-yellow-400">Tendencia:</span> {historico[0].tir > historico[historico.length-1].tir ? 'Bonos más riesgosos' : 'Bonos más caros'} que hace 3 meses
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-3 pt-6 mt-4 border-t border-gray-700">
            <button 
              onClick={() => exportarBonoPDF(bono)}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalBono;