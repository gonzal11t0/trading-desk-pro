// src/components/premium/ModalLetra.jsx
import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, Download, Calculator, Calendar } from 'lucide-react';

const ModalLetra = ({ isOpen, onClose, letra }) => {
  const [montoInversion, setMontoInversion] = useState(1000000);
  
  if (!isOpen) return null;

  // Cálculos para letras
  const interesBruto = (montoInversion * letra.tna * letra.plazo) / (365 * 100);
  const comision = (montoInversion * 0.035) / 100;
  const derechos = (montoInversion * 0.004) / 100;
  const iva = comision * 0.21;
  const totalGastos = comision + derechos + iva;
  const interesNeto = interesBruto - totalGastos;
  const montoFinal = montoInversion + interesNeto;
  const rendimientoPeriodo = (interesNeto / montoInversion) * 100;

  // Comparación con inflación
  const inflacionMensual = 5; // 5% mensual
  const perdidaInflacion = montoInversion * (inflacionMensual / 100);
  const gananciaReal = interesNeto - perdidaInflacion;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">{letra.ticker}</h2>
            <p className="text-sm text-gray-400">{letra.nombre} • {letra.tipo}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Datos de la letra */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/30 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Precio actual</p>
              <p className="text-xl font-bold text-white">${letra.precio.toFixed(2)}</p>
              <p className={`text-sm ${letra.varPrecio > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {letra.varPrecio > 0 ? '+' : ''}{letra.varPrecio}% vs ayer
              </p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">TNA</p>
              <p className="text-xl font-bold text-white">{letra.tna}%</p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">TEA</p>
              <p className="text-xl font-bold text-green-400">{letra.tea}%</p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Plazo</p>
              <p className="text-xl font-bold text-white">{letra.plazo} días</p>
              <p className="text-xs text-gray-400">Vence: {new Date(letra.vencimiento).toLocaleDateString('es-AR')}</p>
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
                  <span className="text-gray-400">Interés bruto ({letra.tna}% TNA):</span>
                  <span className="text-green-400 font-semibold">${interesBruto.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Gastos (comisión + derechos + IVA):</span>
                  <span className="text-red-400 font-semibold">-${totalGastos.toFixed(2)}</span>
                </div>
                <div className="h-px bg-gray-700 my-2"></div>
                <div className="flex justify-between">
                  <span className="text-gray-300 font-medium">Interés neto:</span>
                  <span className="text-green-400 font-bold">${interesNeto.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300 font-medium">Monto final:</span>
                  <span className="text-white font-bold">${montoFinal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300 font-medium">Rendimiento del período:</span>
                  <span className="text-green-400 font-bold">{rendimientoPeriodo.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Comparación con inflación */}
          <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-yellow-400" />
              Impacto de la inflación
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Inflación proyectada ({letra.plazo} días):</span>
                <span className="text-red-400">{inflacionMensual}% mensual ≈ ${perdidaInflacion.toFixed(2)}</span>
              </div>
              <div className="h-px bg-gray-700 my-2"></div>
              <div className="flex justify-between">
                <span className="text-gray-300 font-medium">Ganancia/pérdida real:</span>
                <span className={gananciaReal > 0 ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                  ${gananciaReal.toFixed(2)} {gananciaReal > 0 ? '(ganancia real)' : '(pérdida real)'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                * Cálculo estimado basado en inflación mensual proyectada del {inflacionMensual}%
              </p>
            </div>
          </div>

          {/* Análisis detallado */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">🔍 Análisis Detallado</h3>
            <div className="space-y-3">
              <div className="p-3 bg-gray-800/30 rounded">
                <p className="text-sm text-gray-300">
                  <span className="text-yellow-400">• Rendimiento nominal:</span> TNA {letra.tna}% / TEA {letra.tea}%. 
                  {letra.tna > 40 ? ' Superior a plazo fijo.' : ' En línea con el mercado.'}
                </p>
              </div>
              <div className="p-3 bg-gray-800/30 rounded">
                <p className="text-sm text-gray-300">
                  <span className="text-yellow-400">• Rendimiento real:</span> 
                  {gananciaReal > 0 
                    ? ' Positivo, gana a la inflación.' 
                    : ' Negativo, pierde contra inflación.'}
                </p>
              </div>
              <div className="p-3 bg-gray-800/30 rounded">
                <p className="text-sm text-gray-300">
                  <span className="text-yellow-400">• Recomendación:</span> {letra.analisis}
                </p>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4">
            <button className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg transition flex items-center justify-center gap-2">
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

export default ModalLetra;