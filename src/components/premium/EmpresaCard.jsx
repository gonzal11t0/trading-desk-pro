// src/components/premium/EmpresaCard.jsx
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Download, Bell, Star, Info } from 'lucide-react';
import BotonFavorito from './BotonFavorito';
import ModalAlerta from './ModalAlerta';
import ModalAnalisis from './ModalAnalisis';

const EmpresaCard = ({ empresa }) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalAlertaAbierto, setModalAlertaAbierto] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(null);
  
  const getVariacionColor = (valor) => {
    if (valor > 20) return 'text-green-400 bg-green-400/20 font-bold';
    if (valor > 0) return 'text-green-400 bg-green-400/10';
    if (valor < -20) return 'text-red-400 bg-red-400/20 font-bold';
    if (valor < 0) return 'text-red-400 bg-red-400/10';
    return 'text-gray-400 bg-gray-400/10';
  };

  const getVariacionIcon = (valor) => {
    if (valor > 20) return <TrendingUp className="w-4 h-4" />;
    if (valor > 0) return <TrendingUp className="w-3 h-3" />;
    if (valor < -20) return <TrendingDown className="w-4 h-4" />;
    if (valor < 0) return <TrendingDown className="w-3 h-3" />;
    return null;
  };

  const tooltips = {
    ingresos: 'Ingresos totales del último trimestre',
    ebitda: 'Ganancias antes de intereses, impuestos, depreciaciones',
    deuda: 'Deuda financiera total',
    resultadoNeto: 'Ganancia o pérdida neta informada para el período',
    roe: 'Resultado neto sobre patrimonio neto',
    per: 'Precio / Ganancia por acción'
  };
  const precio = Number(empresa.precio);
  const isBank = empresa.sector === 'bank' || ['BMA', 'GGAL'].includes(empresa.ticker);
  const indicadores = isBank
    ? [
        { key: 'ingresos', label: 'Ingresos operativos', value: empresa.ingresos, var: empresa.varIngresos },
        { key: 'resultadoNeto', label: 'Resultado neto', value: empresa.resultadoNeto, var: empresa.varResultadoNeto },
        { key: 'roe', label: 'ROE', value: empresa.roe, var: empresa.varRoe },
        { key: 'per', label: 'PER', value: empresa.per, var: empresa.varPer }
      ]
    : [
        { key: 'ingresos', label: 'Ingresos', value: empresa.ingresos, var: empresa.varIngresos },
        { key: 'ebitda', label: 'EBITDA', value: empresa.ebitda, var: empresa.varEbitda },
        { key: 'deuda', label: 'Deuda', value: empresa.deuda, var: empresa.varDeuda },
        { key: 'per', label: 'PER', value: empresa.per, var: empresa.varPer }
      ];

  return (
    <>
      <div className="group relative bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl p-6 border border-gray-700/50 hover:border-yellow-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/5 hover:scale-[1.02]">
        
        {/* Badge de tendencia */}
        {empresa.tendencia && (
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white text-xs px-2 py-1 rounded-full shadow-lg">
            {empresa.tendencia}
          </div>
        )}

        {/* Header */}
        <div className="relative flex justify-between items-start mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-2xl font-bold text-white tracking-tight">{empresa.ticker}</h3>
              <span className="text-xs text-gray-400">{empresa.nombre}</span>
              <span className="px-2 py-0.5 text-xs bg-yellow-500/10 text-yellow-400 rounded-full border border-yellow-500/20">
                PREMIUM
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Último balance: {empresa.ultimoBalance} · Precio{empresa.precioEnVivo ? ' de mercado' : ' de referencia'}: {Number.isFinite(precio) ? `$${precio.toLocaleString('es-AR')}` : '—'}
            </p>
          </div>
          
          <div className="flex items-center gap-1">
            <BotonFavorito tipo="balances" ticker={empresa.ticker} size="md" />
            
            <button
              onClick={() => setModalAlertaAbierto(true)}
              className="p-2 hover:bg-gray-700/50 rounded-lg text-gray-400 hover:text-yellow-400 transition-all hover:scale-110"
              title="Crear alerta"
            >
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Grid de indicadores con tooltips */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {indicadores.map(item => (
            <div 
              key={item.key}
              className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/30 relative group/indicator"
              onMouseEnter={() => setTooltipVisible(item.key)}
              onMouseLeave={() => setTooltipVisible(null)}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  {item.label}
                  <Info className="w-3 h-3 text-gray-600 cursor-help" />
                </p>
                {tooltipVisible === item.key && (
                  <div className="absolute z-10 bg-gray-800 text-xs text-gray-300 p-2 rounded shadow-lg border border-gray-700 -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    {tooltips[item.key]}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">{item.value ?? '—'}</span>
                <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${getVariacionColor(item.var)}`}>
                  {getVariacionIcon(item.var)}
                  <span className="text-xs font-medium">
                    {Number.isFinite(Number(item.var)) ? `${item.var > 0 ? '+' : ''}${item.var}%` : '—'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Análisis rápido con badge de tendencia */}
        <div className="relative p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg mb-5 border-l-4 border-yellow-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-transparent" />
          <p className="relative text-sm text-gray-300 leading-relaxed">{empresa.analisis}</p>
        </div>

        {/* Botones de acción */}
        <div className="relative flex gap-3">
          <button
            onClick={() => setModalAbierto(true)}
            className="flex-1 bg-gradient-to-r from-yellow-600/20 to-yellow-600/5 hover:from-yellow-600/30 hover:to-yellow-600/10 text-yellow-400 py-3 rounded-lg transition-all hover:scale-[1.02] border border-yellow-500/20 hover:border-yellow-500/30 font-medium"
          >
            Ver análisis completo
          </button>
          <button className="p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-all hover:scale-110 border border-gray-600/30 group">
            <Download className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>

      <ModalAnalisis 
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        empresa={empresa}
      />

      <ModalAlerta
        isOpen={modalAlertaAbierto}
        onClose={() => setModalAlertaAbierto(false)}
        instrumento={{
          tipo: 'balances',
          ticker: empresa.ticker,
          nombre: empresa.nombre,
          precio: empresa.precio
        }}
      />
    </>
  );
};

export default EmpresaCard;
