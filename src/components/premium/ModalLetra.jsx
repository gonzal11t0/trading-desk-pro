// src/components/premium/ModalLetra.jsx
import React, { useState } from 'react';
import { X, Download, Calculator, Calendar, AlertCircle } from 'lucide-react';
import { exportarLetraPDF } from '../../utils/pdfExport';
import { getLetraData } from '../../data/letrasData';

const ModalLetra = ({ isOpen, onClose, letra }) => {
  const [tabActiva, setTabActiva] = useState('actual');
  const [montoInversion, setMontoInversion] = useState(1000000);
  const [diasRestantes, setDiasRestantes] = useState(null);
  
  if (!isOpen || !letra) return null;

  const letraInfo = getLetraData(letra.ticker, letra);
  
  // Datos reales de la letra
  const precioActual = letra.ultimo || 0;
  const variacion = letra.variacion_dia || 0;
  const moneda = letraInfo.moneda || 'ARS';
  const tna = letraInfo.tna;
  const tea = letraInfo.tea;
  const plazo = letraInfo.plazo;
  
  // Calcular días hasta vencimiento
  const calcularDias = () => {
    if (!letraInfo.vencimiento) return plazo || 30;
    const hoy = new Date();
    const vencimiento = new Date(letraInfo.vencimiento);
    const diff = vencimiento - hoy;
    return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
  };

  const diasReales = calcularDias();
  const dias = diasRestantes || diasReales || 30;

  // Cálculos para la calculadora
  const interesBruto = tna ? (montoInversion * tna * dias) / (365 * 100) : 0;
  const comision = (montoInversion * 0.035) / 100;
  const derechos = (montoInversion * 0.004) / 100;
  const iva = comision * 0.21;
  const totalGastos = comision + derechos + iva;
  const interesNeto = interesBruto - totalGastos;
  const montoFinal = montoInversion + interesNeto;
  const rendimientoPeriodo = interesNeto > 0 ? (interesNeto / montoInversion) * 100 : 0;

  // Formatear números
  const formatearNumero = (num) => {
    if (num === undefined || num === null || isNaN(num)) return '—';
    return num.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-gray-900 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">{letra.ticker}</h2>
            <p className="text-sm text-gray-400">{letra.nombre || letraInfo.nombre} • {letraInfo.tipo}</p>
            {letraInfo.vencimiento && (
              <p className="text-xs text-gray-500">Vence: {new Date(letraInfo.vencimiento).toLocaleDateString('es-AR')}</p>
            )}
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
            onClick={() => setTabActiva('calculadora')}
            className={`px-4 py-2 font-medium transition flex items-center gap-1 ${
              tabActiva === 'calculadora'
                ? 'text-yellow-400 border-b-2 border-yellow-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <Calculator className="w-4 h-4" />
            Calculadora
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {tabActiva === 'actual' ? (
            <div className="space-y-6">
              {/* Datos de la letra */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Precio actual</p>
                  <p className="text-xl font-bold text-white">
                    {moneda === 'USD' ? 'U$S' : '$'}{formatearNumero(precioActual)}
                  </p>
                  <p className={`text-sm ${variacion > 0 ? 'text-green-400' : variacion < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                    {variacion > 0 ? '+' : ''}{variacion.toFixed(2)}% vs ayer
                  </p>
                </div>
                
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">TNA</p>
                  {tna ? (
                    <p className="text-xl font-bold text-white">{tna}%</p>
                  ) : (
                    <div className="flex items-center gap-1 text-yellow-400">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">No disponible</span>
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">TEA</p>
                  {tea ? (
                    <p className="text-xl font-bold text-green-400">{tea}%</p>
                  ) : (
                    <p className="text-sm text-gray-400">—</p>
                  )}
                </div>
                
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Plazo</p>
                  <p className="text-xl font-bold text-white">
                    {plazo ? `${plazo} días` : '—'}
                  </p>
                </div>
              </div>

              {/* Detalles de la letra */}
              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">📊 Detalles del instrumento</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Moneda:</span>
                    <span className="text-white font-semibold">{moneda}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tipo:</span>
                    <span className="text-white font-semibold">{letraInfo.tipo}</span>
                  </div>
                  {letraInfo.vencimiento && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Vencimiento:</span>
                      <span className="text-white font-semibold">
                        {new Date(letraInfo.vencimiento).toLocaleDateString('es-AR')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* TAB CALCULADORA */
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-yellow-400" />
                Calculadora de rendimiento
              </h3>

              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Monto a invertir (ARS)</label>
                    <input
                      type="number"
                      value={montoInversion}
                      onChange={(e) => setMontoInversion(Number(e.target.value))}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Días de la operación</label>
                    <input
                      type="number"
                      value={dias}
                      onChange={(e) => setDiasRestantes(Number(e.target.value))}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    />
                    {plazo && (
                      <p className="text-xs text-gray-500 mt-1">* Plazo del instrumento: {plazo} días</p>
                    )}
                  </div>

                  {tna ? (
                    <div className="bg-gray-900/50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Interés bruto:</span>
                        <span className="text-green-400 font-bold">${formatearNumero(interesBruto)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Gastos (comisión + derechos + IVA):</span>
                        <span className="text-red-400 font-bold">-${formatearNumero(totalGastos)}</span>
                      </div>
                      <div className="h-px bg-gray-700 my-2"></div>
                      <div className="flex justify-between">
                        <span className="text-gray-300 font-medium">Interés neto:</span>
                        <span className="text-green-400 font-bold">${formatearNumero(interesNeto)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300 font-medium">Monto final:</span>
                        <span className="text-white font-bold">${formatearNumero(montoFinal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300 font-medium">Rendimiento del período:</span>
                        <span className="text-green-400 font-bold">{rendimientoPeriodo.toFixed(2)}%</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-800/30 rounded-lg p-6 text-center">
                      <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                      <p className="text-gray-300">TNA no disponible para este instrumento</p>
                    </div>
                  )}

                  <p className="text-xs text-gray-500">
                    * Cálculo basado en TNA fija. Gastos estimados según BYMA.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-3 pt-6 mt-4 border-t border-gray-700">
            <button 
              onClick={() => exportarLetraPDF(letra)}
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

export default ModalLetra;
