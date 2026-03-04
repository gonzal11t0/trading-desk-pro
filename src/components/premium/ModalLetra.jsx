// src/components/premium/ModalLetra.jsx
import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, Download, Calculator, Calendar, Clock, BarChart3, AlertCircle } from 'lucide-react';
import { exportarLetraPDF } from '../../utils/pdfExport';
import GraficoLinea from './GraficoLinea';
import { getLetraData } from '../../data/letrasData';

// Datos históricos simulados (opcional)
const datosHistoricosLetras = {
  'S27F6': [
    { periodo: 'Feb 2026', precio: 1202.40, tna: 38.0, tea: 42.3, variacion: -0.5 },
    { periodo: 'Ene 2026', precio: 1208.50, tna: 37.5, tea: 41.8, variacion: 0.2 }
  ],
  'S29Y6': [
    { periodo: 'Feb 2026', precio: 1165.50, tna: 42.0, tea: 47.8, variacion: -0.8 },
    { periodo: 'Ene 2026', precio: 1174.00, tna: 41.5, tea: 47.0, variacion: -0.3 }
  ]
};

const ModalLetra = ({ isOpen, onClose, letra }) => {
  const [tabActiva, setTabActiva] = useState('actual');
  const [montoInversion, setMontoInversion] = useState(1000000);
  const [diasRestantes, setDiasRestantes] = useState(null);
  
  if (!isOpen || !letra) return null;

  // Obtener datos fijos de la letra
  const letraInfo = getLetraData(letra.symbol);

  // Calcular días hasta vencimiento (si tenemos expiration)
  const calcularDias = () => {
    if (!letra.expiration) return null;
    const hoy = new Date();
    const vencimiento = new Date(letra.expiration);
    const diff = vencimiento - hoy;
    return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
  };

  const diasReales = calcularDias();
  const dias = diasRestantes || diasReales || letraInfo.plazo || 30;

  // Datos de la letra
  const precioActual = letra.last || letra.precio || 0;
  const tna = letraInfo.tna;
  const tea = letraInfo.tea;
  const plazo = letraInfo.plazo;
  const moneda = letraInfo.moneda;

  // Cálculos para letras
  const interesBruto = tna ? (montoInversion * tna * dias) / (365 * 100) : 0;
  const comision = (montoInversion * 0.035) / 100;
  const derechos = (montoInversion * 0.004) / 100;
  const iva = comision * 0.21;
  const totalGastos = comision + derechos + iva;
  const interesNeto = interesBruto - totalGastos;
  const montoFinal = montoInversion + interesNeto;
  const rendimientoPeriodo = interesNeto > 0 ? (interesNeto / montoInversion) * 100 : 0;

  // Comparación con inflación (estimada 5% mensual)
  const inflacionMensual = 5;
  const perdidaInflacion = montoInversion * (inflacionMensual / 100);
  const gananciaReal = interesNeto - perdidaInflacion;

  // Función para formatear número
  const formatearNumero = (num) => {
    if (num === undefined || num === null) return '—';
    return num.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Datos para gráfico (si tenemos histórico)
  const datosGrafico = (datosHistoricosLetras[letra.symbol] || []).map(item => ({
    periodo: item.periodo,
    tna: item.tna,
    tea: item.tea
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-gray-900 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">{letra.symbol}</h2>
            <p className="text-sm text-gray-400">{letraInfo.nombre} • {letraInfo.tipo}</p>
            {letraInfo.observaciones && (
              <p className="text-xs text-gray-500 mt-1">{letraInfo.observaciones}</p>
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
          {datosGrafico.length > 0 && (
            <button
              onClick={() => setTabActiva('graficos')}
              className={`px-4 py-2 font-medium transition flex items-center gap-1 ${
                tabActiva === 'graficos'
                  ? 'text-yellow-400 border-b-2 border-yellow-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Gráficos
            </button>
          )}
        </div>

        {/* Contenido */}
        <div className="p-6">
          {tabActiva === 'actual' ? (
            /* === TAB ACTUAL === */
            <div className="space-y-6">
              {/* Datos de la letra */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Precio actual</p>
                  <p className="text-xl font-bold text-white">
                    {moneda === 'USD' ? 'U$S' : '$'}{formatearNumero(precioActual)}
                  </p>
                  <p className={`text-sm ${letra.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {letra.change ? (letra.change * 100).toFixed(2) : '0.00'}% vs ayer
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
                    {diasReales && ` (${diasReales} reales)`}
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
                  {letra.expiration && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Vencimiento:</span>
                      <span className="text-white font-semibold">
                        {new Date(letra.expiration).toLocaleDateString('es-AR')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : tabActiva === 'calculadora' ? (
            /* === TAB CALCULADORA === */
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-yellow-400" />
                Calculadora de rendimiento
              </h3>

              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                <div className="space-y-4">
                  {/* Monto a invertir */}
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">
                      Monto a invertir (ARS)
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

                  {/* Días a vencimiento (editable) */}
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Días de la operación</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={dias.toLocaleString('es-AR')}
                      onChange={(e) => {
                        const valor = e.target.value.replace(/\./g, '');
                        if (!isNaN(valor) && valor !== '') {
                          setDiasRestantes(Number(valor));
                        }
                      }}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    />
                    {plazo && (
                      <p className="text-xs text-gray-500 mt-1">
                        * Plazo del instrumento: {plazo} días
                      </p>
                    )}
                  </div>

                  {/* Resultados (solo si hay TNA) */}
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
                      
                      {/* Comparación con inflación */}
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Inflación estimada ({dias} días):</span>
                          <span className="text-red-400">${formatearNumero(perdidaInflacion)}</span>
                        </div>
                        <div className="flex justify-between mt-2">
                          <span className="text-gray-300 font-medium">Ganancia/pérdida real:</span>
                          <span className={gananciaReal > 0 ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                            ${formatearNumero(gananciaReal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-800/30 rounded-lg p-6 text-center">
                      <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                      <p className="text-gray-300">TNA no disponible para este instrumento</p>
                      <p className="text-sm text-gray-500 mt-2">No es posible calcular rendimiento</p>
                    </div>
                  )}

                  <p className="text-xs text-gray-500">
                    * Cálculo basado en TNA fija. Gastos estimados según BYMA (0.035% comisión + 0.004% derechos + IVA 21%).
                    {!tna && ' TNA no disponible.'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* === TAB GRÁFICOS === */
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-yellow-400" />
                Evolución de tasas
              </h3>
              
              {datosGrafico.length > 0 ? (
                <>
                  <GraficoLinea
                    data={datosGrafico}
                    xKey="periodo"
                    lines={[
                      { key: 'tna', name: 'TNA (%)', color: '#4ADE80' },
                      { key: 'tea', name: 'TEA (%)', color: '#FBBF24' }
                    ]}
                  />
                  <p className="text-xs text-gray-500 text-center">
                    * Datos históricos simulados
                  </p>
                </>
              ) : (
                <div className="bg-gray-800/30 rounded-lg p-8 text-center">
                  <p className="text-gray-400">No hay datos históricos disponibles</p>
                </div>
              )}
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