// src/components/premium/ModalAnalisis.jsx
import React from 'react';
import { X, TrendingUp, TrendingDown, Download, Calculator } from 'lucide-react';
import { exportarEmpresaPDF } from '../../utils/pdfExport';

const ModalAnalisis = ({ isOpen, onClose, empresa }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            {empresa.ticker} - Análisis Completo
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
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
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Inversión inicial:</span>
                <span className="text-white font-semibold">$1.000.000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Rendimiento estimado (PER):</span>
                <span className="text-green-400 font-semibold">+$122.000 (12.2%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Inflación proyectada:</span>
                <span className="text-red-400">40%</span>
              </div>
              <div className="h-px bg-gray-700 my-2"></div>
              <div className="flex justify-between">
                <span className="text-gray-300 font-medium">Ganancia real:</span>
                <span className="text-red-400 font-bold">-$278.000 (negativa)</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                * Cálculo estimado basado en PER y crecimiento proyectado
              </p>
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
                  <span className="text-yellow-400">• Deuda:</span> Relación Deuda/EBITDA de {empresa.deudaEbitda} (saludable). 
                  {parseFloat(empresa.deudaEbitda) < 3 ? ' Bajo riesgo.' : ' Moderado.'}
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

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4">
            <button 
              onClick={() => exportarEmpresaPDF(empresa)}
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

export default ModalAnalisis;