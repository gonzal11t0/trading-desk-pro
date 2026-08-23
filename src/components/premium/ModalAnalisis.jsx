// src/components/premium/ModalAnalisis.jsx
import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, Download, Calendar, Clock, BarChart3, Info } from 'lucide-react';
import { exportarEmpresaPDF } from '../../utils/pdfExport';
import GraficoLinea from './GraficoLinea';

const ModalAnalisis = ({ isOpen, onClose, empresa }) => {
  const [tabActiva, setTabActiva] = useState('actual');
  const [mostrarAclaracion, setMostrarAclaracion] = useState(false);
  
  if (!isOpen) return null;

  const datosReales = empresa;
  const isBank = datosReales.sector === 'bank' || ['BMA', 'GGAL'].includes(datosReales.ticker);

  // Sólo se grafica el período publicado; no se fabrican puntos históricos.
  const historico = [
    { 
      periodo: datosReales.ultimoBalance, 
      precio: datosReales.precio,
      ingresos: datosReales.ingresos,
      ebitda: datosReales.ebitda,
      deuda: datosReales.deuda,
      resultadoNeto: datosReales.resultadoNeto,
      patrimonio: datosReales.patrimonio,
      per: datosReales.per
    }
  ];
  
  // Formatear números según moneda
  const formatNumber = (value, moneda) => {
    if (!value && value !== 0) return 'N/A';
    
    if (String(moneda).startsWith('USD')) {
      return `US$ ${value.toFixed(1)}M`;
    }
    return `$${Math.round(value).toLocaleString('es-AR')}M`;
  };

  // Determinar color según variación
  const getVariacionColor = (valor) => {
    if (valor > 0) return 'text-green-400';
    if (valor < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const moneda = datosReales.moneda || 'ARS';
  const perValue = Number.isFinite(Number(datosReales.per)) ? Number(datosReales.per) : null;
  const precio = Number(datosReales.precio);
  const deudaPatrimonio = Number(datosReales.patrimonio) !== 0
    ? (Number(datosReales.deuda) / Number(datosReales.patrimonio)).toFixed(2)
    : '—';
  const margenEbitda = Number(datosReales.ingresos) !== 0
    ? ((Number(datosReales.ebitda) / Number(datosReales.ingresos)) * 100).toFixed(1)
    : '—';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-gray-900 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">
              {datosReales.ticker} - {datosReales.nombre}
            </h2>
            <p className="text-sm text-gray-400">
              Último balance: {datosReales.ultimoBalance} · Precio: {Number.isFinite(precio) ? `$${precio.toLocaleString('es-AR')}` : '—'}
            </p>
            {datosReales.periodo && (
              <p className="text-xs text-gray-500 mt-1">Período: {datosReales.periodo}</p>
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
            /* === TAB ACTUAL - DATOS REALES === */
            <div className="space-y-6">
              {/* Datos de mercado */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">📊 Datos de Mercado</h3>
                  <button
                    onClick={() => setMostrarAclaracion(!mostrarAclaracion)}
                    className="text-gray-400 hover:text-yellow-400 transition"
                    title="Ver aclaración sobre datos"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
                
                {mostrarAclaracion && (
                  <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-700/30 rounded-lg text-xs text-yellow-400/90">
                    <p className="font-medium mb-1">🔍 Sobre los datos:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-300">
                      <li>📁 Las cifras contables corresponden a una carga revisada por un administrador</li>
                      <li>📅 Último balance: {datosReales.ultimoBalance} ({datosReales.periodo})</li>
                      <li>⚠️ Verificar contra el informe publicado en la fuente oficial de la emisora</li>
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-800/30 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Precio actual</p>
                    <p className="text-xl font-bold text-green-400">
                      {Number.isFinite(precio) ? `$${precio.toLocaleString('es-AR')}` : '—'}
                    </p>
                  </div>
                  
                  <div className="p-3 bg-gray-800/30 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">PER</p>
                    <p className="text-xl font-bold text-white">
                      {perValue === null ? '—' : `${perValue}x`}
                    </p>
                  </div>
                  
                  <div className="p-3 bg-gray-800/30 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">ROE</p>
                    <p className={`text-xl font-bold ${datosReales.roe > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {datosReales.roe}%
                    </p>
                  </div>
                  
                  <div className="p-3 bg-gray-800/30 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">{isBank ? 'Resultado neto' : 'Deuda/EBITDA'}</p>
                    <p className="text-xl font-bold text-white">
                      {isBank ? formatNumber(datosReales.resultadoNeto, moneda) : `${datosReales.deudaEbitda ?? '—'}x`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Datos reales del balance */}
              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <span>📈 Datos del balance</span>
                  <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded">carga validada</span>
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-gray-900/50 rounded">
                    <span className="text-sm text-gray-400">Ingresos</span>
                    <div className="text-right">
                      <span className="text-white font-semibold">{formatNumber(datosReales.ingresos, moneda)}</span>
                      <span className={`text-xs ml-2 ${getVariacionColor(datosReales.varIngresos)}`}>
                        {datosReales.varIngresos > 0 ? '+' : ''}{datosReales.varIngresos}%
                      </span>
                    </div>
                  </div>
                  {!isBank && <div className="flex justify-between items-center p-2 bg-gray-900/50 rounded">
                    <span className="text-sm text-gray-400">EBITDA</span>
                    <div className="text-right">
                      <span className="text-white font-semibold">{formatNumber(datosReales.ebitda, moneda)}</span>
                      <span className={`text-xs ml-2 ${getVariacionColor(datosReales.varEbitda)}`}>
                        {datosReales.varEbitda > 0 ? '+' : ''}{datosReales.varEbitda}%
                      </span>
                    </div>
                  </div>}
                  {!isBank && <div className="flex justify-between items-center p-2 bg-gray-900/50 rounded">
                    <span className="text-sm text-gray-400">Deuda Total</span>
                    <div className="text-right">
                      <span className="text-white font-semibold">{formatNumber(datosReales.deuda, moneda)}</span>
                      <span className={`text-xs ml-2 ${getVariacionColor(datosReales.varDeuda)}`}>
                        {datosReales.varDeuda > 0 ? '+' : ''}{datosReales.varDeuda}%
                      </span>
                    </div>
                  </div>}
                  {!isBank && <div className="flex justify-between items-center p-2 bg-gray-900/50 rounded">
                    <span className="text-sm text-gray-400">Deuda/EBITDA</span>
                    <span className="text-white font-semibold">{datosReales.deudaEbitda}x</span>
                  </div>}
                  {isBank && <>
                    <div className="flex justify-between items-center p-2 bg-gray-900/50 rounded">
                      <span className="text-sm text-gray-400">Resultado neto</span>
                      <span className="text-white font-semibold">{formatNumber(datosReales.resultadoNeto, moneda)}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-900/50 rounded">
                      <span className="text-sm text-gray-400">Patrimonio neto</span>
                      <span className="text-white font-semibold">{formatNumber(datosReales.patrimonio, moneda)}</span>
                    </div>
                  </>}
                </div>
              </div>

              {/* Análisis y Recomendación */}
              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
  <h4 className="font-semibold text-white mb-3">📈 Análisis de Tendencia</h4>
  <div className="space-y-2 text-sm text-gray-300">
    <p>• <span className="text-yellow-400">ROE:</span> {datosReales.roe}%</p>
    {!isBank && <p>• <span className="text-yellow-400">Deuda/Patrimonio:</span> {deudaPatrimonio}x</p>}
    {!isBank && <p>• <span className="text-yellow-400">Margen EBITDA:</span> {margenEbitda}%</p>}
    {isBank && <p>• <span className="text-yellow-400">Resultado neto:</span> {formatNumber(datosReales.resultadoNeto, moneda)}</p>}
  </div>
</div>
              <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/30 rounded-lg p-5 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-3">📝 Análisis</h3>
                <p className="text-gray-300 leading-relaxed mb-4">{datosReales.analisis}</p>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                  datosReales.recomendacion === 'COMPRAR' ? 'bg-green-900/30 border border-green-700/30' :
                  datosReales.recomendacion === 'MANTENER' ? 'bg-yellow-900/30 border border-yellow-700/30' :
                  'bg-red-900/30 border border-red-700/30'
                }`}>
                  <span className="text-lg">
                    {datosReales.recomendacion === 'COMPRAR' ? '🟢' : 
                     datosReales.recomendacion === 'MANTENER' ? '🟡' : '⚠️'}
                  </span>
                  <span className={`font-semibold ${
                    datosReales.recomendacion === 'COMPRAR' ? 'text-green-400' :
                    datosReales.recomendacion === 'MANTENER' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {datosReales.recomendacion}
                  </span>
                </div>
              </div>
            </div>
          ) : tabActiva === 'historico' ? (
            /* === TAB HISTÓRICO === */
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                Evolución de indicadores
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-2 text-gray-400">Período</th>
                      <th className="text-right py-3 px-2 text-gray-400">Ingresos</th>
                      <th className="text-right py-3 px-2 text-gray-400">{isBank ? 'Resultado neto' : 'EBITDA'}</th>
                      <th className="text-right py-3 px-2 text-gray-400">{isBank ? 'Patrimonio' : 'Deuda'}</th>
                      <th className="text-right py-3 px-2 text-gray-400">PER</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historico.map((item, index) => (
                      <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/30">
                        <td className="py-3 px-2 text-white font-medium">{item.periodo}</td>
                        <td className="text-right py-3 px-2 text-blue-400">{formatNumber(item.ingresos, moneda)}</td>
                        <td className="text-right py-3 px-2 text-purple-400">{formatNumber(isBank ? item.resultadoNeto : item.ebitda, moneda)}</td>
                        <td className="text-right py-3 px-2 text-yellow-400">{formatNumber(isBank ? item.patrimonio : item.deuda, moneda)}</td>
                        <td className="text-right py-3 px-2 text-green-400">{item.per}x</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-xs text-gray-500 text-right">
                Datos de carga manual; pueden no reflejar la presentación más reciente
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                <h4 className="font-semibold text-white mb-3">📈 Análisis de Tendencia</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>• <span className="text-yellow-400">ROE:</span> {datosReales.roe}%</p>
                  {!isBank && <p>• <span className="text-yellow-400">Deuda/Patrimonio:</span> {deudaPatrimonio}x</p>}
                  {!isBank && <p>• <span className="text-yellow-400">Margen EBITDA:</span> {margenEbitda}%</p>}
                  {isBank && <p>• <span className="text-yellow-400">Resultado neto:</span> {formatNumber(datosReales.resultadoNeto, moneda)}</p>}
                </div>
              </div>
            </div>
          ) : (
            /* === TAB GRÁFICOS === */
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-yellow-400" />
                Visualización de datos
              </h3>
              
              <GraficoLinea
                data={historico.map(h => ({ periodo: h.periodo, ingresos: h.ingresos, resultado: isBank ? h.resultadoNeto : h.ebitda }))}
                xKey="periodo"
                lines={[
                  { key: 'ingresos', name: 'Ingresos', color: '#3B82F6' },
                  { key: 'resultado', name: isBank ? 'Resultado neto' : 'EBITDA', color: '#A855F7' }
                ]}
              />
              
              <div className="text-xs text-gray-500 text-center">
                * Unidad informada: {moneda}
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-3 pt-6 mt-4 border-t border-gray-700">
            <button 
              onClick={() => exportarEmpresaPDF(datosReales)}
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

export default ModalAnalisis;
