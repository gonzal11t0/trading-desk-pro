// src/components/charts/TreemapDashboard.jsx
import React, { useState, useMemo } from 'react';
import { Calculator, RefreshCw, DollarSign, Calendar, Percent, FileText } from 'lucide-react';

const TreemapDashboard = () => {
  // Estados principales
  const [monto, setMonto] = useState(100000);
  const [plazo, setPlazo] = useState(7);
  const [tasa, setTasa] = useState(33);
  const [cantidad, setCantidad] = useState(1);
  
  // Gastos (porcentajes fijos basados en tu imagen)
  const comisionPorcentaje = 0.035; // 0.35% = 0.035 en decimal
  const derechosPorcentaje = 0.004; // 0.04% = 0.004 en decimal
  const ivaPorcentaje = 0.21; // 21% sobre comisión

  // Cálculos
  const resultados = useMemo(() => {
    // Interés bruto
    const interesBruto = (monto * tasa * plazo) / (365 * 100);
    
    // Gastos
    const comision = (monto * comisionPorcentaje) / 100;
    const derechos = (monto * derechosPorcentaje) / 100;
    const iva = comision * ivaPorcentaje;
    const totalGastos = comision + derechos + iva;
    
    // Totales
    const interesNeto = interesBruto - totalGastos;
    const montoFinal = monto + interesNeto;
    
    // Tasa efectiva
    const tasaEfectiva = interesNeto > 0 
      ? (interesNeto / monto) * (365 / plazo) * 100 
      : 0;

    return {
      interesBruto: interesBruto,
      comision: comision,
      derechos: derechos,
      iva: iva,
      totalGastos: totalGastos,
      interesNeto: interesNeto,
      montoFinal: montoFinal,
      tasaEfectiva: tasaEfectiva
    };
  }, [monto, plazo, tasa, cantidad]);

  // Formatear moneda
  const formatCurrency = (value) => {
    return `$${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  // Reset a valores por defecto
  const handleReset = () => {
    setMonto(100000);
    setPlazo(7);
    setTasa(33);
    setCantidad(1);
  };

  return (
    <div className="min-w-0 bg-gray-900/30 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-gray-700/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Calculadora de Caución</h3>
        </div>
        <button
          onClick={handleReset}
          className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          title="Reiniciar valores"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Contenedor vertical - TODO en una columna */}
      <div className="space-y-4">
        
        {/* 1. MONTO */}
        <div className="bg-gray-800/20 rounded-lg p-4 border border-gray-700/30">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-4 h-4 text-blue-400" />
            <label className="text-sm font-medium text-gray-300">Monto ($)</label>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">$</span>
            <input
              type="number"
              value={monto}
              onChange={(e) => setMonto(Math.max(1000, Number(e.target.value)))}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white text-base"
              min="1000"
              step="1000"
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">Mín: $1.000</span>
            <span className="text-sm font-medium text-blue-300">{formatCurrency(monto)}</span>
            <span className="text-xs text-gray-500">Máx: $10.000.000</span>
          </div>
        </div>

        {/* 2. PLAZO EN DÍAS */}
        <div className="bg-gray-800/20 rounded-lg p-4 border border-gray-700/30">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-green-400" />
            <label className="text-sm font-medium text-gray-300">Plazo en días</label>
          </div>
          <input
            type="range"
            min="1"
            max="90"
            value={plazo}
            onChange={(e) => setPlazo(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">1 día</span>
            <span className="text-lg font-bold text-white">{plazo} días</span>
            <span className="text-xs text-gray-500">90 días</span>
          </div>
        </div>

        {/* 3. TASA NOMINAL ANUAL */}
        <div className="bg-gray-800/20 rounded-lg p-4 border border-gray-700/30">
          <div className="flex items-center gap-2 mb-3">
            <Percent className="w-4 h-4 text-purple-400" />
            <label className="text-sm font-medium text-gray-300">Tasa Nominal Anual (%)</label>
          </div>
          <input
            type="range"
            min="1"
            max="150"
            value={tasa}
            onChange={(e) => setTasa(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">1%</span>
            <span className="text-lg font-bold text-white">{tasa}%</span>
            <span className="text-xs text-gray-500">150%</span>
          </div>
        </div>

        {/* 4. CANTIDAD DE VECES */}
        <div className="bg-gray-800/20 rounded-lg p-4 border border-gray-700/30">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-amber-400" />
            <label className="text-sm font-medium text-gray-300">Cantidad de veces</label>
          </div>
          <select
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white text-base"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <option key={num} value={num}>{num} vez{num !== 1 ? 'es' : ''}</option>
            ))}
          </select>
          <div className="text-xs text-gray-500 mt-2">
            Número de renovaciones automáticas
          </div>
        </div>

        {/* 5. RESULTADOS */}
        <div className="bg-gradient-to-r from-blue-900/20 to-blue-800/10 rounded-lg p-4 border border-blue-700/30">
          <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            Resultados
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-blue-800/30">
              <span className="text-sm text-gray-400">Intereses:</span>
              <span className="text-lg font-bold text-blue-300">
                {formatCurrency(resultados.interesBruto)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-base font-medium text-gray-300">Monto Final:</span>
              <span className="text-xl font-bold text-green-400">
                {formatCurrency(resultados.montoFinal)}
              </span>
            </div>
            <div className="text-sm text-gray-400 mt-3 pt-3 border-t border-blue-800/30">
              Tasa efectiva anual: <span className="font-semibold text-green-300">{resultados.tasaEfectiva.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        {/* 6. GASTOS */}
        <div className="bg-gradient-to-r from-amber-900/10 to-amber-800/5 rounded-lg p-4 border border-amber-700/30">
          <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            Gastos
          </h4>
          <div className="space-y-2.5">
            <div className="flex justify-between items-center py-1.5">
              <span className="text-sm text-gray-400">Comisión ({comisionPorcentaje}%):</span>
              <span className="text-sm font-medium text-amber-300">{formatCurrency(resultados.comision)}</span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-sm text-gray-400">Derechos de mercado ({derechosPorcentaje}%):</span>
              <span className="text-sm font-medium text-amber-300">{formatCurrency(resultados.derechos)}</span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-sm text-gray-400">IVA ({ivaPorcentaje * 100}%):</span>
              <span className="text-sm font-medium text-amber-300">{formatCurrency(resultados.iva)}</span>
            </div>
            <div className="flex justify-between items-center pt-3 mt-2 border-t border-amber-800/30">
              <span className="text-sm font-medium text-gray-300">Total gastos:</span>
              <span className="text-base font-bold text-red-300">{formatCurrency(resultados.totalGastos)}</span>
            </div>
          </div>
        </div>

        {/* 7. INTERÉS NETO (RESUMEN FINAL) */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-4 border border-gray-700/50">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-400">Interés neto</div>
              <div className="text-2xl font-bold text-white">
                {formatCurrency(resultados.interesNeto)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Después de todos los gastos
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Rendimiento neto</div>
              <div className={`text-xl font-bold ${resultados.interesNeto > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {((resultados.interesNeto / monto) * 100).toFixed(2)}%
              </div>
              <div className="text-xs text-gray-500 mt-1">
                sobre el capital
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-700/50">
            <div className="text-xs text-gray-500 text-center">
              Cálculo basado en convención 365 días • Inversión inicial: {formatCurrency(monto)}
            </div>
          </div>
        </div>

      </div> {/* Fin del contenedor vertical */}

      {/* Footer informativo */}
      <div className="mt-6 pt-4 border-t border-gray-700/30">
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-start gap-1.5">
            <div className="w-1 h-1 rounded-full bg-gray-500 mt-1"></div>
            <span>Los porcentajes de gastos son referenciales según BYMA</span>
          </div>
          <div className="flex items-start gap-1.5">
            <div className="w-1 h-1 rounded-full bg-gray-500 mt-1"></div>
            <span>El cálculo no incluye impuesto a las ganancias</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreemapDashboard;"// �ltima correcci�n TEA" 
