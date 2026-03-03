// src/components/premium/ModalBono.jsx
import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, Download, Calculator, Calendar, Clock, BarChart3, AlertCircle } from 'lucide-react';
import { exportarBonoPDF } from '../../utils/pdfExport';
import GraficoLinea from './GraficoLinea';
import { getBonoData } from '../../data/bonosData';

// Datos históricos simulados (opcional)
const datosHistoricosBonos = {
  AL30: [
    { periodo: 'Feb 2026', precio: 86.48, tir: 15.2, variacion: -1.2 },
    { periodo: 'Ene 2026', precio: 87.50, tir: 14.9, variacion: 0.8 },
    { periodo: 'Dic 2025', precio: 86.80, tir: 15.0, variacion: -0.3 }
  ]
};

const ModalBono = ({ isOpen, onClose, bono }) => {
  const [tabActiva, setTabActiva] = useState('actual');
  const [montoInversion, setMontoInversion] = useState(1000000);
  const [diasRestantes, setDiasRestantes] = useState(360);
  
  if (!isOpen || !bono) return null;

  // Obtener datos fijos del bono
  const bonoInfo = getBonoData(bono.symbol);

  // Calcular días hasta vencimiento
  const calcularDias = () => {
    if (!bono.expiration) return null;
    const hoy = new Date();
    const vencimiento = new Date(bono.expiration);
    const diff = vencimiento - hoy;
    return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
  };

  const diasReales = calcularDias();
  const dias = diasRestantes || diasReales || 360;
  const añosExactos = dias / 365;

  // Datos del bono (con fallbacks)
  const precioActual = bono.last || bono.precio || 0;
  const tieneTir = bono.tir !== undefined && bono.tir !== null;
  const tirValor = bono.tir;
  
  // Usar datos fijos
  const valorNominal = bonoInfo.valorNominal;
  const tasaCupon = bonoInfo.cupon;
  const frecuencia = bonoInfo.frecuencia;
  const moneda = bonoInfo.moneda;
  
  // Calcular cantidad de bonos según moneda
  const cantidad = Math.floor(montoInversion / (moneda === 'USD' ? precioActual * 1200 : precioActual));
  const valorInvertido = cantidad * (moneda === 'USD' ? precioActual * 1200 : precioActual);

  // Ganancia por bono (si aplica)
  const gananciaPorBono = valorNominal - precioActual;
  const rendimientoTotal = gananciaPorBono * cantidad;
  const rendimientoPorcentaje = valorInvertido > 0 ? (rendimientoTotal / valorInvertido) * 100 : 0;

  // Calcular TIR de forma robusta (siempre entre -100% y +100%)
const calcularTIR = () => {
  if (!tasaCupon || precioActual <= 0) return null;
  
  const pagosPorAnio = {
    'mensual': 12,
    'semestral': 2,
    'trimestral': 4,
    'anual': 1
  }[frecuencia] || 2;
  
  const pagoPeriodo = (valorNominal * tasaCupon / 100) / pagosPorAnio;
  const pagoAnual = pagoPeriodo * pagosPorAnio;
  
  // Ganancia/pérdida anualizada por diferencia de precio
  const gananciaAnual = (valorNominal - precioActual) / añosExactos;
  
  // Fórmula de aproximación de TIR (rendimiento corriente + ganancia de capital)
  const tirAprox = ((pagoAnual + gananciaAnual) / ((precioActual + valorNominal) / 2)) * 100;
  
  // Acotar a valores razonables (-100% a +100%)
  if (tirAprox > 100) return '>100%';
  if (tirAprox < -100) return '<-100%';
  
  return tirAprox.toFixed(2) + '%';
};

  const tirCalculada = calcularTIR();
  const tirMostrar = tieneTir ? tirValor : (tirCalculada ? `${tirCalculada}% (estimado)` : null);

  // Pago por período según frecuencia
  const calcularPagoPeriodo = () => {
    if (!tasaCupon) return null;
    const pagosPorAnio = {
      'mensual': 12,
      'semestral': 2,
      'trimestral': 4,
      'anual': 1
    }[frecuencia] || 2;
    
    return (valorNominal * tasaCupon / 100) / pagosPorAnio;
  };

  const pagoPeriodo = calcularPagoPeriodo();

  // Función para formatear número
  const formatearNumero = (num) => {
    if (num === undefined || num === null) return '—';
    return num.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-gray-900 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">
              {bono.symbol} - Análisis Completo
            </h2>
            <p className="text-sm text-gray-400">
              Vence: {bono.expiration ? new Date(bono.expiration).toLocaleDateString('es-AR') : 'N/A'} · {moneda}
            </p>
            {bonoInfo.observaciones && (
              <p className="text-xs text-gray-500 mt-1">{bonoInfo.observaciones}</p>
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
            /* === TAB ACTUAL === */
            <div className="space-y-6">
              {/* Datos del bono */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Precio actual</p>
                  <p className="text-xl font-bold text-white">
                    {moneda === 'USD' ? 'U$S' : '$'}{formatearNumero(precioActual)}
                  </p>
                  <p className={`text-sm ${bono.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {bono.change ? (bono.change * 100).toFixed(2) : '0.00'}% vs ayer
                  </p>
                </div>
                <div className="flex items-center gap-2">
  <span className="text-xl font-bold text-red-400">TIR muy negativa</span>
  <div className="relative group">
    <AlertCircle className="w-4 h-4 text-gray-400 cursor-help" />
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-xs text-gray-300 rounded opacity-0 group-hover:opacity-100 transition w-48 border border-gray-600">
      El bono cotiza muy por encima de su valor nominal. La TIR real es fuertemente negativa.
    </div>
  </div>
</div>
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">TIR</p>
                  {tirMostrar ? (
                    <p className="text-xl font-bold text-green-400">{tirMostrar}</p>
                  ) : (
                    <div className="flex items-center gap-1 text-yellow-400">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">No disponible</span>
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Días a vencimiento</p>
                  <p className="text-xl font-bold text-white">{diasReales?.toLocaleString() || 'N/A'}</p>
                </div>
                
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Cupón</p>
                  {tasaCupon ? (
                    <p className="text-xl font-bold text-white">{tasaCupon}% {frecuencia}</p>
                  ) : (
                    <p className="text-sm text-gray-400">—</p>
                  )}
                </div>
              </div>

              {/* Resumen de inversión */}
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
                      <span className="text-gray-400">Pago periódico:</span>
                      <span className="text-green-400 font-semibold">
                        {moneda === 'USD' ? 'U$S' : '$'}{formatearNumero(pagoPeriodo)} ({frecuencia})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Próximos pagos (solo si hay cupón) */}
              {tasaCupon && pagoPeriodo && (
                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-yellow-400" />
                    Próximos pagos
                  </h3>
                  
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {[1, 2, 3, 4].map((i) => {
                      const fecha = new Date();
                      if (frecuencia === 'mensual') fecha.setMonth(fecha.getMonth() + i);
                      else if (frecuencia === 'semestral') fecha.setMonth(fecha.getMonth() + i * 6);
                      else if (frecuencia === 'trimestral') fecha.setMonth(fecha.getMonth() + i * 3);
                      
                      return (
                        <div key={i} className="flex justify-between p-2 bg-gray-700/30 rounded">
                          <span className="text-gray-300">{fecha.toLocaleDateString('es-AR')}</span>
                          <span className="text-white font-semibold">
                            {moneda === 'USD' ? 'U$S' : '$'}{formatearNumero(pagoPeriodo)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* === TAB CALCULADORA === */
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-yellow-400" />
                Calculadora de inversión
              </h3>

              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                <div className="space-y-4">
                  {/* Monto a invertir */}
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">
                      Monto a invertir ({moneda === 'USD' ? 'USD' : 'ARS'})
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={montoInversion.toLocaleString('es-AR')}
                      onChange={(e) => {
                        const valor = e.target.value.replace(/\./g, '').replace(/,/g, '');
                        if (!isNaN(valor) && valor !== '') {
                          setMontoInversion(Number(valor));
                        }
                      }}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    />
                  </div>

                  {/* Días hasta vencimiento */}
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Días hasta vencimiento</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={diasRestantes.toLocaleString('es-AR')}
                      onChange={(e) => {
                        const valor = e.target.value.replace(/\./g, '');
                        if (!isNaN(valor) && valor !== '') {
                          setDiasRestantes(Number(valor));
                        }
                      }}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    />
                    {diasReales && (
                      <p className="text-xs text-gray-500 mt-1">
                        * Vencimiento real: {diasReales} días ({new Date(bono.expiration).toLocaleDateString('es-AR')})
                      </p>
                    )}
                  </div>

                  {/* Resultados */}
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
                    
                    {tasaCupon && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Ingreso anual por cupones:</span>
                        <span className="text-green-400 font-bold">
                          {moneda === 'USD' ? 'U$S' : '$'}{formatearNumero(cantidad * (valorNominal * tasaCupon / 100))}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">Valor nominal al vencimiento:</span>
                      <span className="text-green-400 font-bold">
                        {moneda === 'USD' ? 'U$S' : '$'}{formatearNumero(cantidad * valorNominal)}
                      </span>
                    </div>
                    
                    {tirMostrar && (
                      <>
                        <div className="h-px bg-gray-700 my-2"></div>
                        <div className="flex justify-between">
                          <span className="text-gray-300 font-medium">TIR:</span>
                          <span className="text-yellow-400 font-bold">{tirMostrar}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-gray-500">
                    * Cálculo basado en datos fijos del bono. No incluye comisiones ni impuestos.
                    {!tasaCupon && ' Cupón no disponible para este bono.'}
                  </p>
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