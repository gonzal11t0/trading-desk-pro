// src/components/premium/ModalBono.jsx
import React from 'react';
import { X, Download, AlertCircle } from 'lucide-react';
import { getBonoData } from '../../data/bonosData';

const ModalBono = ({ isOpen, onClose, bono }) => {
  if (!isOpen || !bono) return null;

  // Obtener datos del bono usando ticker
  const bonoInfo = getBonoData(bono.ticker);
  // Datos de mercado informados por la fuente
  const precioActual = bono.ultimo || bono.precio || 0;
  const variacion = bono.variacion_dia || 0;
  const cierreAnterior = bono.ultimo_cierre || 0;
  
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
              {bonoInfo.nombre || 'Bono'} · Cotización informada por IOL
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
            <div className="space-y-6">
              {/* Datos del bono */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Precio actual</p>
                  <p className="text-xl font-bold text-white">
                    ${formatearNumero(precioActual)}
                  </p>
                  <p className={`text-sm ${variacion > 0 ? 'text-green-400' : variacion < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                    {variacion > 0 ? '+' : ''}{variacion.toFixed(2)}% vs ayer
                  </p>
                </div>
                
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Cierre anterior</p>
                  <p className="text-xl font-bold text-white">
                    ${formatearNumero(cierreAnterior)}
                  </p>
                </div>
                
              </div>

              <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/30 rounded-lg p-5 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <span>📊</span> Información para evaluar
                </h3>
                <div className="flex items-start gap-3 text-yellow-300">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">La fuente no informa aquí valor residual, moneda de liquidación, cupones ni flujo de fondos. Por ese motivo no se calcula cantidad, valor al vencimiento ni TIR.</p>
                </div>
              </div>
            </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-6 mt-4 border-t border-gray-700">
            <button 
              onClick={async () => (await import('../../utils/pdfExport')).exportarBonoPDF(bono)}
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
