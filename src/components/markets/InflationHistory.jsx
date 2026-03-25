import React, { useState, useEffect } from 'react';
import { inflationApi } from '../../api/inflationApi';

const InflationHistory = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistoricalData = async () => {
    try {
      setLoading(true);
      const data = await inflationApi.getLastMonthsInflation(9);
      setHistoricalData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoricalData();
    const interval = setInterval(fetchHistoricalData, 3600000);
    return () => clearInterval(interval);
  }, []);

  // Determinar clases para valor
  const getValueClasses = (currentMonth, index) => {
    const changeValue = currentMonth.change?.monthly;
    
    if (!changeValue || changeValue === "0.0" || index === historicalData.length - 1) {
      return "text-gray-300 font-bold text-lg tracking-tight"; // gris
    }
    
    const change = parseFloat(changeValue);
    if (change > 0) {
      return "text-red-400 font-bold text-lg tracking-tight"; // rojo
    } else {
      return "text-green-400 font-bold text-lg tracking-tight"; // verde
    }
  };

  // Determinar clases para flecha
  const getArrowClasses = (changeValue) => {
    if (!changeValue || changeValue === "0.0") {
      return "text-gray-500 font-semibold text-sm hidden"; // gris, oculto
    }
    
    const change = parseFloat(changeValue);
    if (change > 0) {
      return "text-red-400 font-semibold text-sm"; // rojo
    } else {
      return "text-green-400 font-semibold text-sm"; // verde
    }
  };

  // Obtener flecha
  const getArrow = (changeValue) => {
    if (!changeValue || changeValue === "0.0") return '';
    const change = parseFloat(changeValue);
    return change > 0 ? '↗' : '↘';
  };

  if (loading) {
    return (
      <div className="bg-gray-900 border border-gray-600 rounded-lg p-6 font-mono">
        <div className="text-gray-400 text-sm mb-4">
          CARGANDO DATOS DE INFLACIÓN...
        </div>
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
            <div 
              key={i} 
              className="h-8 bg-gray-800 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !historicalData.length) {
    return (
      <div className="bg-gray-900 border border-red-800 rounded-lg p-6 font-mono">
        <div className="text-red-400 text-sm mb-2">
          ERROR DE CONEXIÓN
        </div>
        <div className="text-gray-400 mb-4">
          {error || 'No se pudieron cargar los datos'}
        </div>
        <button
          onClick={fetchHistoricalData}
          className="px-4 py-2 bg-gray-800 text-gray-300 border border-gray-600 rounded text-sm hover:bg-gray-700 transition-colors cursor-pointer"
        >
          REINTENTAR
        </button>
      </div>
    );
  }

 // InflationHistory.jsx
const formatDate = (dateString) => {
  if (!dateString) return 'Fecha no disponible';
  
  try {
    // Si la fecha viene como "2026-02-01"
    const date = new Date(dateString);
    
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      // Si no es válida, intentar parsear el string manualmente
      const parts = dateString.split('-');
      if (parts.length === 3) {
        return `${getMonthName(parseInt(parts[1]) - 1)} ${parts[0]}`;
      }
      return dateString;
    }
    
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
    
  } catch (error) {
    console.error('Error formateando fecha:', dateString, error);
    return dateString;
  }
};

// Función auxiliar para obtener nombre del mes
function getMonthName(monthIndex) {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return months[monthIndex];
}

// InflationHistory.jsx - SOLO EL RETURN CORREGIDO
return (
  <div className="bg-gray-900 border border-gray-600 rounded-xl overflow-hidden font-mono min-w-0">
    {/* Header */}
    <div className="border-b border-gray-600 p-4 md:p-5 lg:p-6 min-w-0">
      <div className="flex justify-between items-center min-w-0">
        <div className="min-w-0">
          <div className="text-white text-xl md:text-2xl font-bold tracking-tight truncate min-w-0">
            INFLACIÓN
          </div>
        </div>
      </div>
    </div>

    {/* Lista de Meses - DISEÑO RESPONSIVO */}
    <div className="min-w-0">
      {historicalData.map((month, index) => {
        const isRecent = index === 0
        const monthlyValue = month.values?.monthly || 0
        const changeValue = month.change?.monthly
        
        const valueClasses = getValueClasses(month, index)
        const arrowClasses = getArrowClasses(changeValue)
        const arrow = getArrow(changeValue)
        
        return (
          <div 
            key={month.date}
            className={`p-4 md:p-5 border-b ${
              index < historicalData.length - 1 
                ? 'border-gray-800' 
                : 'border-b-0'
            } ${
              isRecent 
                ? 'bg-gray-800/30' 
                : 'bg-transparent'
            } hover:bg-gray-800/50 transition-colors cursor-pointer min-w-0`}
          >
            <div className="flex justify-between items-center min-w-0 gap-3">
              {/* Mes - CON TEXTO COMPLETO */}
              <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                {isRecent && (
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0"></div>
                )}
                <div className="text-gray-300 text-sm md:text-base font-medium break-words flex-1 min-w-0">
                  {formatDate(month.date)}
                </div>
              </div>
              
              {/* Valor y Flecha */}
              <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                {/* Flecha - OCULTA EN MÓVIL SI NO HAY ESPACIO */}
                {changeValue && changeValue !== "0.0" && (
                  <div className={`${arrowClasses} hidden @[380px]:block`}>
                    {arrow} {Math.abs(parseFloat(changeValue)).toFixed(1)}%
                  </div>
                )}
                
                {/* Valor */}
                <div className={`${valueClasses} text-right whitespace-nowrap`}>
                  {monthlyValue.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>

    {/* Footer */}
    <div className="border-t border-gray-600 py-3 px-4 md:px-6 bg-gray-800/30 min-w-0">
      <div className="text-gray-500 text-xs md:text-sm text-center truncate">
        IPC MENSUAL
      </div>
    </div>
  </div>
)
};

export default InflationHistory;