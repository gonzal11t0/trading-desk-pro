import React from 'react';
import { TrendingUp, TrendingDown, Link, Info } from 'lucide-react';

const IndicatorCard = ({ indicator }) => {
  if (!indicator) return null;

  const getRelationshipIcon = (rel) => {
    switch (rel) {
      case 'directa': 
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'inversa': 
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: 
        return <Link className="w-4 h-4 text-blue-500" />;
    }
  };

  const getCategoryColor = (cat) => {
    const colors = {
      'Monetario': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-300' },
      'Inflación': { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-300' },
      'Tipo de Cambio': { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-300' },
      'Riesgo': { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-300' },
      'Mercado': { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-300' },
      'Real': { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-300' },
      'Internacional': { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-300' },
      'Fiscal': { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-300' }
    };
    return colors[cat] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-300' };
  };

  const categoryColor = getCategoryColor(indicator.categoria);

  return (
    <div className={`
      bg-white rounded-2xl p-6 
      shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]
      border max-w-4xl mx-auto
      ${categoryColor.border}
    `}>
      {/* Header con título y categoría */}
      <div className="
        flex flex-col md:flex-row justify-between items-start md:items-center 
        gap-4 mb-6 pb-4 border-b border-gray-200
      ">
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
            <h3 className="
              text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 
              mb-2 md:mb-0
            ">
              {indicator.nombre}
            </h3>
            <span className={`
              px-3 py-1 rounded-full text-sm font-semibold 
              border inline-block w-fit
              ${categoryColor.bg} ${categoryColor.text} ${categoryColor.border}
            `}>
              {indicator.categoria}
            </span>
          </div>
          <div className="
            flex flex-col sm:flex-row items-start sm:items-center 
            gap-2 text-sm text-gray-500 flex-wrap
          ">
            <span className="flex items-center gap-1">
              📊 {indicator.fuente}
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              ⏰ {indicator.frecuencia}
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              📏 {indicator.unidad}
            </span>
          </div>
        </div>
        <div className="
          bg-gray-50 p-2 rounded-lg border border-gray-200 
          self-start md:self-center
        ">
          <Info className="w-5 h-5 text-gray-500" />
        </div>
      </div>

      {/* Definición */}
      <div className="mb-6">
        <h4 className="
          text-base md:text-lg font-semibold text-gray-700 mb-3
          flex items-center gap-2
        ">
          <span className="text-xl">📘</span>
          Definición
        </h4>
        <div className={`
          bg-gray-50 p-4 rounded-xl border-l-4
          ${categoryColor.border}
        `}>
          <p className="
            text-gray-700 text-sm md:text-base leading-relaxed 
            md:leading-loose m-0
          ">
            {indicator.definicion}
          </p>
        </div>
      </div>

      {/* Dos columnas: SUBE y BAJA */}
      <div className="
        grid grid-cols-1 md:grid-cols-2 gap-4 mb-6
      ">
        {/* Si SUBE */}
        <div className="
          bg-green-50 p-4 rounded-xl border border-green-200
        ">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h4 className="
              font-bold text-green-800 m-0 text-base md:text-lg
            ">
              Si SUBE
            </h4>
          </div>
          <ul className="pl-5 m-0 space-y-2">
            {indicator.interpretacion.sube.split(', ').map((item, idx) => (
              <li key={idx} className="
                text-gray-700 text-sm md:text-base leading-relaxed
              ">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Si BAJA */}
        <div className="
          bg-red-50 p-4 rounded-xl border border-red-200
        ">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-5 h-5 text-red-600" />
            <h4 className="
              font-bold text-red-800 m-0 text-base md:text-lg
            ">
              Si BAJA
            </h4>
          </div>
          <ul className="pl-5 m-0 space-y-2">
            {indicator.interpretacion.baja.split(', ').map((item, idx) => (
              <li key={idx} className="
                text-gray-700 text-sm md:text-base leading-relaxed
              ">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Relaciones */}
      <div className="mb-6">
        <h4 className="
          text-base md:text-lg font-semibold text-gray-700 mb-3
          flex items-center gap-2
        ">
          <span className="text-xl">🔗</span>
          Relaciones con otros indicadores
        </h4>
        <div className="
          flex flex-wrap gap-2
        ">
          {Object.entries(indicator.relaciones).map(([key, value]) => (
            <div key={key} className="
              flex items-center gap-2 bg-slate-50 px-3 py-2 
              rounded-lg border border-slate-200
            ">
              {getRelationshipIcon(value)}
              <span className="
                text-sm md:text-base font-medium text-slate-800
                capitalize
              ">
                {key.replace('_', ' ')}:
              </span>
              <span className="
                text-sm md:text-base text-slate-600 capitalize
              ">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Nota y detalles */}
      <div className="pt-4 border-t border-gray-200">
        <div className="
          grid grid-cols-1 md:grid-cols-2 gap-4 mb-4
        ">
          <div>
            <span className="
              text-sm text-gray-500 block mb-1
            ">
              Unidad de medida:
            </span>
            <p className="
              text-gray-900 font-medium text-base md:text-lg m-0
            ">
              {indicator.unidad}
            </p>
          </div>
          <div>
            <span className="
              text-sm text-gray-500 block mb-1
            ">
              ID del indicador:
            </span>
            <p className="
              font-mono text-gray-900 text-base md:text-lg m-0
              bg-gray-50 px-2 py-1 rounded inline-block
            ">
              {indicator.id}
            </p>
          </div>
        </div>
        
        {indicator.nota && (
          <div className="
            mt-4 p-3 md:p-4 bg-blue-50 rounded-lg 
            border-l-4 border-blue-500
          ">
            <p className="
              text-blue-900 text-sm md:text-base m-0
              flex items-start gap-2
            ">
              <span className="text-lg">💡</span>
              <span>
                <strong className="font-semibold">Nota importante:</strong>{' '}
                {indicator.nota}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndicatorCard;