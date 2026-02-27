// src/components/premium/ModalAnalisis.jsx
import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, Download, Calculator, Calendar, Clock } from 'lucide-react';
import { exportarEmpresaPDF } from '../../utils/pdfExport';
import { BarChart3 } from 'lucide-react';
import GraficoLinea from './GraficoLinea';
import { empresasApi } from '../../../api/empresasApi';
// Datos históricos simulados
const datosHistoricos = {
  // Energía
  YPFD: [
    { periodo: 'Dic 2025', ingresos: 4200, ebitda: 1100, deuda: 5300, per: 8.2 },
    { periodo: 'Sep 2025', ingresos: 3900, ebitda: 980, deuda: 5100, per: 7.9 },
    { periodo: 'Jun 2025', ingresos: 3600, ebitda: 890, deuda: 4900, per: 7.5 },
    { periodo: 'Mar 2025', ingresos: 3300, ebitda: 800, deuda: 4700, per: 7.1 }
  ],
  PAMP: [
    { periodo: 'Dic 2025', ingresos: 2100, ebitda: 580, deuda: 3200, per: 6.5 },
    { periodo: 'Sep 2025', ingresos: 1950, ebitda: 520, deuda: 3350, per: 6.3 },
    { periodo: 'Jun 2025', ingresos: 1800, ebitda: 470, deuda: 3500, per: 6.0 },
    { periodo: 'Mar 2025', ingresos: 1650, ebitda: 420, deuda: 3650, per: 5.8 }
  ],
  CEPU: [
    { periodo: 'Dic 2025', ingresos: 580, ebitda: 250, deuda: 680, per: 6.8 },
    { periodo: 'Sep 2025', ingresos: 540, ebitda: 230, deuda: 650, per: 6.6 },
    { periodo: 'Jun 2025', ingresos: 500, ebitda: 210, deuda: 620, per: 6.4 },
    { periodo: 'Mar 2025', ingresos: 460, ebitda: 190, deuda: 590, per: 6.2 }
  ],
  EDN: [
    { periodo: 'Dic 2025', ingresos: 420, ebitda: 165, deuda: 720, per: 9.2 },
    { periodo: 'Sep 2025', ingresos: 390, ebitda: 150, deuda: 680, per: 9.0 },
    { periodo: 'Jun 2025', ingresos: 360, ebitda: 135, deuda: 640, per: 8.8 },
    { periodo: 'Mar 2025', ingresos: 330, ebitda: 120, deuda: 600, per: 8.5 }
  ],
  
  // Bancos
  GGAL: [
    { periodo: 'Dic 2025', ingresos: 1800, ebitda: 720, deuda: 2100, per: 7.8 },
    { periodo: 'Sep 2025', ingresos: 1650, ebitda: 650, deuda: 2000, per: 7.5 },
    { periodo: 'Jun 2025', ingresos: 1500, ebitda: 580, deuda: 1900, per: 7.2 },
    { periodo: 'Mar 2025', ingresos: 1350, ebitda: 510, deuda: 1800, per: 6.9 }
  ],
  BMA: [
    { periodo: 'Dic 2025', ingresos: 1200, ebitda: 480, deuda: 1800, per: 6.2 },
    { periodo: 'Sep 2025', ingresos: 1100, ebitda: 440, deuda: 1750, per: 6.0 },
    { periodo: 'Jun 2025', ingresos: 1000, ebitda: 400, deuda: 1700, per: 5.8 },
    { periodo: 'Mar 2025', ingresos: 900, ebitda: 360, deuda: 1650, per: 5.5 }
  ],
  
  // Telecomunicaciones y gas
  TECO2: [
    { periodo: 'Dic 2025', ingresos: 950, ebitda: 410, deuda: 2200, per: 9.5 },
    { periodo: 'Sep 2025', ingresos: 920, ebitda: 390, deuda: 2100, per: 9.3 },
    { periodo: 'Jun 2025', ingresos: 890, ebitda: 370, deuda: 2000, per: 9.0 },
    { periodo: 'Mar 2025', ingresos: 860, ebitda: 350, deuda: 1900, per: 8.8 }
  ],
  TGSU2: [
    { periodo: 'Dic 2025', ingresos: 680, ebitda: 320, deuda: 980, per: 7.2 },
    { periodo: 'Sep 2025', ingresos: 650, ebitda: 300, deuda: 1000, per: 7.0 },
    { periodo: 'Jun 2025', ingresos: 620, ebitda: 280, deuda: 1020, per: 6.8 },
    { periodo: 'Mar 2025', ingresos: 590, ebitda: 260, deuda: 1040, per: 6.5 }
  ],
  
  // Industrial
  ALUA: [
    { periodo: 'Dic 2025', ingresos: 520, ebitda: 180, deuda: 450, per: 8.1 },
    { periodo: 'Sep 2025', ingresos: 500, ebitda: 170, deuda: 440, per: 7.9 },
    { periodo: 'Jun 2025', ingresos: 480, ebitda: 160, deuda: 430, per: 7.7 },
    { periodo: 'Mar 2025', ingresos: 460, ebitda: 150, deuda: 420, per: 7.5 }
  ],
  
  // Holding
  COME: [
    { periodo: 'Dic 2025', ingresos: 120, ebitda: 28, deuda: 95, per: 12.5 },
    { periodo: 'Sep 2025', ingresos: 115, ebitda: 26, deuda: 92, per: 12.0 },
    { periodo: 'Jun 2025', ingresos: 110, ebitda: 24, deuda: 89, per: 11.5 },
    { periodo: 'Mar 2025', ingresos: 105, ebitda: 22, deuda: 86, per: 11.0 }
  ]
};

// Si no hay datos para un ticker, usar datos genéricos
const datosGenericos = [
  { periodo: 'Dic 2025', ingresos: 500, ebitda: 200, deuda: 800, per: 8.0 },
  { periodo: 'Sep 2025', ingresos: 470, ebitda: 185, deuda: 780, per: 7.8 },
  { periodo: 'Jun 2025', ingresos: 440, ebitda: 170, deuda: 760, per: 7.6 },
  { periodo: 'Mar 2025', ingresos: 410, ebitda: 155, deuda: 740, per: 7.4 }
];

const ModalAnalisis = ({ isOpen, onClose, empresa }) => {
  const [tabActiva, setTabActiva] = useState('actual');
  const [montoInversion, setMontoInversion] = useState(1000000);
  const [empresaData, setEmpresaData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await empresasApi.getCompanyData(empresa.ticker);
        setEmpresaData(data);
        console.log('✅ Datos cargados:', data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (isOpen) {
      fetchData();
    }
  }, [empresa.ticker, isOpen]);

  // AHORA SÍ, después de todos los hooks, va el early return
  if (!isOpen) return null;

  // Obtener histórico de la empresa
const historico = datosHistoricos[empresa.ticker] || datosGenericos;

  // Calcular rendimiento estimado
  const rendimientoEstimado = montoInversion * (parseFloat(empresa.per) / 100);
  const inflacionProyectada = 40;
  const gananciaReal = rendimientoEstimado - (montoInversion * (inflacionProyectada / 100));
    
const datosGrafico = historico.map(item => ({
  periodo: item.periodo,
  ingresos: item.ingresos,
  ebitda: item.ebitda,
  deuda: item.deuda
}));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-gray-900 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">
              {empresa.ticker} - Análisis Completo
            </h2>
            <p className="text-sm text-gray-400">Último balance: {empresa.ultimoBalance}</p>
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
            /* === TAB ACTUAL === */
            <div className="space-y-6">
              {/* Balance comparativo */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">📊 Balance Comparativo</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded">
                    <span className="text-gray-400">Ingresos</span>
                    <div className="flex items-center gap-3">
                      <span className="text-white font-semibold">{empresa.ingresos}</span>
                      <span className={empresa.varIngresos > 0 ? 'text-green-400' : 'text-red-400'}>
                        {empresa.varIngresos > 0 ? '+' : ''}{empresa.varIngresos}%
                      </span>
                      <span className="text-sm text-gray-500">vs industria: +28%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded">
                    <span className="text-gray-400">EBITDA</span>
                    <div className="flex items-center gap-3">
                      <span className="text-white font-semibold">{empresa.ebitda}</span>
                      <span className={empresa.varEbitda > 0 ? 'text-green-400' : 'text-red-400'}>
                        {empresa.varEbitda > 0 ? '+' : ''}{empresa.varEbitda}%
                      </span>
                      <span className="text-sm text-gray-500">vs industria: +25%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded">
                    <span className="text-gray-400">Deuda</span>
                    <div className="flex items-center gap-3">
                      <span className="text-white font-semibold">{empresa.deuda}</span>
                      <span className={empresa.varDeuda > 0 ? 'text-red-400' : 'text-green-400'}>
                        {empresa.varDeuda > 0 ? '+' : ''}{empresa.varDeuda}%
                      </span>
                      <span className="text-sm text-gray-500">vs industria: +12%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded">
                    <span className="text-gray-400">PER</span>
                    <div className="flex items-center gap-3">
                      <span className="text-white font-semibold">{empresa.per}</span>
                      <span className={empresa.varPer > 0 ? 'text-green-400' : 'text-red-400'}>
                        {empresa.varPer > 0 ? '+' : ''}{empresa.varPer}%
                      </span>
                      <span className="text-sm text-gray-500">industria: 9.5x</span>
                    </div>
                  </div>
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
                    <label className="text-sm text-gray-400 mb-1 block">Inversión inicial (ARS)</label>
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
                      <span className="text-gray-400">Rendimiento estimado (PER):</span>
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

              {/* Análisis detallado */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">🔍 Análisis Detallado</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-800/30 rounded">
                    <p className="text-sm text-gray-300">
                      <span className="text-yellow-400">• Crecimiento:</span> La empresa crece por encima del sector en ingresos (+35% vs +28%) y EBITDA (+37% vs +25%).
                    </p>
                  </div>
                  <div className="p-3 bg-gray-800/30 rounded">
                    <p className="text-sm text-gray-300">
                      <span className="text-yellow-400">• Deuda:</span> Relación Deuda/EBITDA de {empresa.deudaEbitda || '4.8x'} (saludable). 
                      {parseFloat(empresa.deudaEbitda || '4.8') < 3 ? ' Bajo riesgo.' : ' Moderado.'}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-800/30 rounded">
                    <p className="text-sm text-gray-300">
                      <span className="text-yellow-400">• Valuación:</span> PER de {empresa.per} vs industria 9.5x. 
                      {parseFloat(empresa.per) < 9.5 ? ' Subvaluada.' : ' En línea con el mercado.'}
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
                Evolución Trimestral
              </h3>

              {/* Tabla histórica */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-2 text-gray-400">Período</th>
                      <th className="text-right py-3 px-2 text-gray-400">Ingresos</th>
                      <th className="text-right py-3 px-2 text-gray-400">EBITDA</th>
                      <th className="text-right py-3 px-2 text-gray-400">Deuda</th>
                      <th className="text-right py-3 px-2 text-gray-400">PER</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historico.map((item, index) => (
                      <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/30">
                        <td className="py-3 px-2 text-white font-medium">{item.periodo}</td>
                        <td className="text-right py-3 px-2 text-green-400">${item.ingresos}M</td>
                        <td className="text-right py-3 px-2 text-green-400">${item.ebitda}M</td>
                        <td className="text-right py-3 px-2 text-yellow-400">${item.deuda}M</td>
                        <td className="text-right py-3 px-2 text-blue-400">{item.per}x</td>
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
                      • <span className="text-yellow-400">Ingresos:</span> Crecimiento del {((historico[0].ingresos - historico[historico.length-1].ingresos) / historico[historico.length-1].ingresos * 100).toFixed(1)}% en el último año
                    </p>
                    <p>
                      • <span className="text-yellow-400">EBITDA:</span> Crecimiento del {((historico[0].ebitda - historico[historico.length-1].ebitda) / historico[historico.length-1].ebitda * 100).toFixed(1)}% en el último año
                    </p>
                    <p>
                      • <span className="text-yellow-400">Deuda:</span> {historico[0].deuda > historico[historico.length-1].deuda ? 'Reducción' : 'Aumento'} del {Math.abs(((historico[0].deuda - historico[historico.length-1].deuda) / historico[historico.length-1].deuda * 100)).toFixed(1)}%
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
                Evolución de indicadores
              </h3>
              
              <GraficoLinea
                data={datosGrafico}
                xKey="periodo"
                lines={[
                  { key: 'ingresos', name: 'Ingresos (M)', color: '#4ADE80' },
                  { key: 'ebitda', name: 'EBITDA (M)', color: '#FBBF24' },
                  { key: 'deuda', name: 'Deuda (M)', color: '#F87171' }
                ]}
              />
              
              <div className="bg-gray-800/30 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">📈 Análisis visual</h4>
                <p className="text-sm text-gray-300">
                  {empresa.ticker} muestra una tendencia {empresa.varIngresos > 0 ? 'positiva' : 'negativa'} en ingresos, 
                  con EBITDA en {empresa.varEbitda > 0 ? 'crecimiento' : 'descenso'} y deuda 
                  {empresa.varDeuda > 0 ? ' en aumento' : ' controlada'}.
                </p>
              </div>
            </div>
          )}

          {/* Botones de acción (siempre visibles) */}
          <div className="flex gap-3 pt-6 mt-4 border-t border-gray-700">
            <button 
              onClick={() => exportarEmpresaPDF(empresa)}
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