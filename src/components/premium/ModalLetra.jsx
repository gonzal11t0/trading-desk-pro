// src/components/premium/ModalLetra.jsx
import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, Download, Calculator, Calendar, Clock, BarChart3 } from 'lucide-react';
import { exportarLetraPDF } from '../../utils/pdfExport';
import GraficoLinea from './GraficoLinea';

// Datos históricos simulados para letras
const datosHistoricosLetras = {
  'S27F6': [
    { periodo: 'Feb 2026', precio: 1202.40, tna: 38.0, tea: 42.3, variacion: -0.5 },
    { periodo: 'Ene 2026', precio: 1208.50, tna: 37.5, tea: 41.8, variacion: 0.2 },
    { periodo: 'Dic 2025', precio: 1206.00, tna: 37.8, tea: 42.0, variacion: 0.1 }
  ],
  'S29Y6': [
    { periodo: 'Feb 2026', precio: 1165.50, tna: 42.0, tea: 47.8, variacion: -0.8 },
    { periodo: 'Ene 2026', precio: 1174.00, tna: 41.5, tea: 47.0, variacion: -0.3 },
    { periodo: 'Dic 2025', precio: 1177.00, tna: 41.2, tea: 46.5, variacion: 0.2 }
  ],
  'S30N6': [
    { periodo: 'Feb 2026', precio: 1002.50, tna: 40.0, tea: 45.1, variacion: -1.2 },
    { periodo: 'Ene 2026', precio: 1014.00, tna: 39.5, tea: 44.5, variacion: -0.5 },
    { periodo: 'Dic 2025', precio: 1019.00, tna: 39.0, tea: 44.0, variacion: 0.1 }
  ],
  'X29Y6': [
    { periodo: 'Feb 2026', precio: 1014.50, tna: 22.0, tea: 24.5, variacion: 0.3 },
    { periodo: 'Ene 2026', precio: 1011.00, tna: 21.8, tea: 24.2, variacion: 0.2 },
    { periodo: 'Dic 2025', precio: 1009.00, tna: 21.5, tea: 23.9, variacion: 0.1 }
  ],
  'X30N6': [
    { periodo: 'Feb 2026', precio: 968.20, tna: 22.0, tea: 24.5, variacion: 0.2 },
    { periodo: 'Ene 2026', precio: 966.00, tna: 21.8, tea: 24.2, variacion: 0.1 },
    { periodo: 'Dic 2025', precio: 965.00, tna: 21.5, tea: 23.9, variacion: 0.0 }
  ],
  'TZX27': [
    { periodo: 'Feb 2026', precio: 3058.00, tna: 24.0, tea: 26.8, variacion: 0.5 },
    { periodo: 'Ene 2026', precio: 3042.00, tna: 23.8, tea: 26.5, variacion: 0.3 },
    { periodo: 'Dic 2025', precio: 3033.00, tna: 23.5, tea: 26.2, variacion: 0.2 }
  ],
  'TZX28': [
    { periodo: 'Feb 2026', precio: 2780.00, tna: 24.0, tea: 26.8, variacion: 0.4 },
    { periodo: 'Ene 2026', precio: 2768.00, tna: 23.8, tea: 26.5, variacion: 0.2 },
    { periodo: 'Dic 2025', precio: 2762.00, tna: 23.5, tea: 26.2, variacion: 0.1 }
  ],
  'M31G6': [
    { periodo: 'Feb 2026', precio: 1067.00, tna: 36.0, tea: 40.2, variacion: -0.6 },
    { periodo: 'Ene 2026', precio: 1073.00, tna: 35.5, tea: 39.5, variacion: -0.2 },
    { periodo: 'Dic 2025', precio: 1075.00, tna: 35.2, tea: 39.0, variacion: 0.1 }
  ],
  'D27F6': [
    { periodo: 'Feb 2026', precio: 128.00, tna: 32.0, tea: 35.5, variacion: 0.8 },
    { periodo: 'Ene 2026', precio: 127.00, tna: 31.8, tea: 35.0, variacion: 0.4 },
    { periodo: 'Dic 2025', precio: 126.50, tna: 31.5, tea: 34.5, variacion: 0.2 }
  ],
  'AO27': [
    { periodo: 'Feb 2026', precio: 150.00, tna: 28.0, tea: 31.2, variacion: 0.5 },
    { periodo: 'Ene 2026', precio: 149.20, tna: 27.8, tea: 31.0, variacion: 0.3 },
    { periodo: 'Dic 2025', precio: 148.70, tna: 27.5, tea: 30.5, variacion: 0.2 }
  ]
};

// Datos genéricos por si falta algún ticker
const datosGenericos = [
  { periodo: 'Feb 2026', precio: 1000.00, tna: 30.0, tea: 33.0, variacion: 0.0 },
  { periodo: 'Ene 2026', precio: 1000.00, tna: 30.0, tea: 33.0, variacion: 0.0 },
  { periodo: 'Dic 2025', precio: 1000.00, tna: 30.0, tea: 33.0, variacion: 0.0 }
];

const ModalLetra = ({ isOpen, onClose, letra }) => {
  const [tabActiva, setTabActiva] = useState('actual');
  const [montoInversion, setMontoInversion] = useState(1000000);
  
  if (!isOpen || !letra) return null;

  // Obtener histórico de la letra
  const historico = datosHistoricosLetras[letra.ticker] || datosGenericos;

  // Datos para el gráfico
  const datosGrafico = historico.map(item => ({
    periodo: item.periodo,
    tna: item.tna,
    tea: item.tea
  }));

  // Cálculos para letras
  const interesBruto = (montoInversion * (letra.tna || 0) * (letra.plazo || 30)) / (365 * 100);
  const comision = (montoInversion * 0.035) / 100;
  const derechos = (montoInversion * 0.004) / 100;
  const iva = comision * 0.21;
  const totalGastos = comision + derechos + iva;
  const interesNeto = interesBruto - totalGastos;
  const montoFinal = montoInversion + interesNeto;
  const rendimientoPeriodo = interesNeto > 0 ? (interesNeto / montoInversion) * 100 : 0;

  // Comparación con inflación
  const inflacionMensual = 5;
  const perdidaInflacion = montoInversion * (inflacionMensual / 100);
  const gananciaReal = interesNeto - perdidaInflacion;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-gray-900 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
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

        {/* Tabs */}
        <div className="flex border-b border-gray-700 px-4">
          <button
            onClick={() => setTabActiva('actual')}
            className={`px-4 py-2 font-medium transition flex items-center gap-1 ${
              tabActiva === 'actual'
                ? 'text-yellow-400 border-b-2 border-yellow-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <span>📊</span> Actual
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
                  <p className="text-xl font-bold text-white">${letra.precio?.toFixed(2)}</p>
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
            </div>
          ) : tabActiva === 'historico' ? (
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
                      <th className="text-right py-3 px-2 text-gray-400">Precio</th>
                      <th className="text-right py-3 px-2 text-gray-400">TNA</th>
                      <th className="text-right py-3 px-2 text-gray-400">TEA</th>
                      <th className="text-right py-3 px-2 text-gray-400">Variación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historico.map((item, index) => (
                      <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/30">
                        <td className="py-3 px-2 text-white font-medium">{item.periodo}</td>
                        <td className="text-right py-3 px-2 text-green-400">${item.precio.toFixed(2)}</td>
                        <td className="text-right py-3 px-2 text-blue-400">{item.tna}%</td>
                        <td className="text-right py-3 px-2 text-purple-400">{item.tea}%</td>
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
                      • <span className="text-yellow-400">TNA:</span> {historico[0].tna > historico[historico.length-1].tna ? 'Aumento' : 'Reducción'} de {Math.abs(historico[0].tna - historico[historico.length-1].tna).toFixed(1)} puntos porcentuales
                    </p>
                    <p>
                      • <span className="text-yellow-400">TEA:</span> {historico[0].tea > historico[historico.length-1].tea ? 'Aumento' : 'Reducción'} de {Math.abs(historico[0].tea - historico[historico.length-1].tea).toFixed(1)} puntos porcentuales
                    </p>
                    <p>
                      • <span className="text-yellow-400">Tendencia:</span> {historico[0].tna > historico[historico.length-1].tna ? 'Tasas en alza' : 'Tasas en baja'} en los últimos meses
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* === TAB GRÁFICOS === */
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-yellow-400" />
                Evolución de tasas
              </h3>
              
              <GraficoLinea
                data={datosGrafico}
                xKey="periodo"
                lines={[
                  { key: 'tna', name: 'TNA (%)', color: '#4ADE80' },
                  { key: 'tea', name: 'TEA (%)', color: '#FBBF24' }
                ]}
              />
              
              <div className="bg-gray-800/30 rounded-lg p-4">
                <p className="text-sm text-gray-300">
                  Las tasas de {letra.ticker} han mostrado una tendencia 
                  {historico[0]?.tna > historico[historico.length-1]?.tna ? ' alcista' : ' bajista'} 
                  en los últimos meses.
                </p>
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