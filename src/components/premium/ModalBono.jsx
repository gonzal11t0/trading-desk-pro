// src/components/premium/ModalBono.jsx
import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, Download, Calculator, Calendar, Clock, BarChart3, AlertCircle } from 'lucide-react';
import { exportarBonoPDF } from '../../utils/pdfExport';
import GraficoLinea from './GraficoLinea';
import { getBonoData } from '../../data/bonosData';

const ModalBono = ({ isOpen, onClose, bono }) => {
  const [tabActiva, setTabActiva] = useState('actual');
  const [montoInversion, setMontoInversion] = useState(1000000);
  const [diasRestantes, setDiasRestantes] = useState(360);
  
  if (!isOpen || !bono) return null;

  // Obtener datos del bono usando ticker
  const bonoInfo = getBonoData(bono.ticker);
  const moneda = bonoInfo.moneda || 'ARS';
  
  // Datos reales del bono desde IOL
  const precioActual = bono.ultimo || bono.precio || 0;
  const variacion = bono.variacion_dia || 0;
  const cierreAnterior = bono.ultimo_cierre || 0;
  
  // Datos fijos del bono
  const valorNominal = bonoInfo.valorNominal || 1000;
  const tasaCupon = bonoInfo.cupon;
  const frecuencia = bonoInfo.frecuencia;
  
  // Calcular días hasta vencimiento (si hay fecha)
  const calcularDias = () => {
    if (!bonoInfo.vencimiento) return null;
    const hoy = new Date();
    const vencimiento = new Date(bonoInfo.vencimiento);
    const diff = vencimiento - hoy;
    return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
  };

  const diasReales = calcularDias();
  const dias = diasRestantes || diasReales || 360;
  
  // Calcular cantidad de bonos
  const cantidad = precioActual > 0 ? Math.floor(montoInversion / precioActual) : 0;
  const valorInvertido = cantidad * precioActual;
  
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
            <h2 className="text-xl font-bold text-white">{bono.ticker} - Análisis Completo</h2>
            <p className="text-sm text-gray-400">
              {bonoInfo.nombre || 'Bono'} · {moneda}
            </p>
            {bonoInfo.vencimiento && (
              <p className="text-xs text-gray-500">Vence: {new Date(bonoInfo.vencimiento).toLocaleDateString('es-AR')}</p>
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
              {/* Datos del bono */}
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
                  <p className="text-xs text-gray-400 mb-1">Cierre anterior</p>
                  <p className="text-xl font-bold text-white">
                    {moneda === 'USD' ? 'U$S' : '$'}{formatearNumero(cierreAnterior)}
                  </p>
                </div>
                
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Días a vencimiento</p>
                  <p className="text-xl font-bold text-white">{diasReales?.toLocaleString() || 'N/A'}</p>
                </div>
              </div>

              {/* Detalles del bono */}
              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">📊 Detalles del bono</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Valor nominal:</span>
                    <span className="text-white font-semibold">
                      {moneda === 'USD' ? 'U$S' : '$'}{formatearNumero(valorNominal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Precio actual:</span>
                    <span className="text-white font-semibold">
                      {moneda === 'USD' ? 'U$S' : '$'}{formatearNumero(precioActual)}
                    </span>
                  </div>
                  {tasaCupon && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cupón:</span>
                      <span className="text-green-400 font-semibold">
                        {tasaCupon}% {frecuencia}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Evaluación */}
              <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/30 rounded-lg p-5 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <span>📊</span> Información para evaluar
                </h3>
                {(() => {
                  const recomendacion = bonoInfo.recomendacion(precioActual, bono.monto_operado);
                  return (
                    <>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{recomendacion.texto}</span>
                        <span className={`text-sm px-2 py-1 rounded ${
                          bonoInfo.riesgo === 'Bajo' ? 'bg-green-900/30 text-green-400' :
                          bonoInfo.riesgo === 'Medio' ? 'bg-yellow-900/30 text-yellow-400' :
                          'bg-red-900/30 text-red-400'
                        }`}>
                          Riesgo {bonoInfo.riesgo}
                        </span>
                      </div>
                      <p className="text-gray-300">Señal configurada manualmente: {recomendacion.razon}</p>
                      <p className="text-xs text-yellow-400 mt-2">No constituye una recomendación de inversión. Verificá TIR, flujos, legislación y moneda.</p>
                      <div className="mt-3 pt-3 border-t border-gray-700 text-xs text-gray-500">
                        Precio actual: {moneda === 'USD' ? 'U$S' : '$'}{precioActual.toLocaleString('es-AR')} | 
                        Plazo: {diasReales?.toLocaleString() || 'N/A'} días
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          ) : (
            /* TAB CALCULADORA */
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-yellow-400" />
                Calculadora de inversión
              </h3>

              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Monto a invertir ({moneda})</label>
                    <input
                      type="number"
                      value={montoInversion}
                      onChange={(e) => setMontoInversion(Number(e.target.value))}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Días hasta vencimiento</label>
                    <input
                      type="number"
                      value={dias}
                      onChange={(e) => setDiasRestantes(Number(e.target.value))}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    />
                    {diasReales && (
                      <p className="text-xs text-gray-500 mt-1">* Vencimiento real: {diasReales} días</p>
                    )}
                  </div>

                  <div className="bg-gray-900/50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cantidad de bonos:</span>
                      <span className="text-white font-bold">{cantidad}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Inversión total:</span>
                      <span className="text-white font-bold">
                        {moneda === 'USD' ? 'U$S' : '$'}{formatearNumero(valorInvertido)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Valor nominal al vencimiento:</span>
                      <span className="text-green-400 font-bold">
                        {moneda === 'USD' ? 'U$S' : '$'}{formatearNumero(cantidad * valorNominal)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
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
