import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Calendar, RefreshCw, Info, Minus } from 'lucide-react';
import inflationApi from '../../api/inflationApi';

const ExchangeBandsModule = () => {
  const [loading, setLoading] = useState(true);
  const [ipcData, setIpcData] = useState([]);
  const [bandasData, setBandasData] = useState({
    piso: 915.66,
    techo: 1527.61,
    pisoCalculado: 915.66,
    techoCalculado: 1500.61,
    fechaActualizacion: new Date().toISOString().split('T')[0],
    ipcUtilizado: 0,
    ipcMesReferencia: '',
    variacionMensual: {
      piso: 0,
      techo: 0
    }
  });

  // Calcular mes t-2 (rezago de 2 meses)
  const getMonthTMinus2 = () => {
    const now = new Date();
    const targetDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    return `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}`;
  };

  // Calcular nuevas bandas con IPC[t-2]
  const calcularBandasConIPC = (pisoBase, techoBase, ipcPercent) => {
    const factor = 1 + (ipcPercent / 100);
    return {
      pisoCalculado: pisoBase * factor,
      techoCalculado: techoBase * factor,
      variacionPiso: ((pisoBase * factor) / pisoBase - 1) * 100,
      variacionTecho: ((techoBase * factor) / techoBase - 1) * 100
    };
  };

  // Cargar datos y calcular bandas
  const cargarDatosBandas = async () => {
    setLoading(true);
    
    try {
      const ipcHistorico = await inflationApi.getLastMonthsInflation(12);
      
      const formattedIpcData = ipcHistorico.map(item => ({
        month: item.date ? item.date.slice(0, 7) : '',
        value: item.values?.monthly || 0,
        date: item.date
      }));
      
      setIpcData(formattedIpcData);
      
      const mesTMinus2 = getMonthTMinus2();
      
      let ipcValor = 0;
      const ipcEncontrado = formattedIpcData.find(item => item.month === mesTMinus2);
      
      if (ipcEncontrado) {
        ipcValor = ipcEncontrado.value;
      } else {
        ipcValor = formattedIpcData[0]?.value || 2.1;
      }
      
      const basePiso = 915.66;
      const baseTecho = 1527.61;
      
      const bandasCalculadas = calcularBandasConIPC(basePiso, baseTecho, ipcValor);
      
      setBandasData({
        piso: basePiso,
        techo: baseTecho,
        pisoCalculado: bandasCalculadas.pisoCalculado,
        techoCalculado: bandasCalculadas.techoCalculado,
        fechaActualizacion: new Date().toLocaleDateString('es-AR'),
        ipcUtilizado: ipcValor,
        ipcMesReferencia: mesTMinus2,
        variacionMensual: {
          piso: bandasCalculadas.variacionPiso,
          techo: bandasCalculadas.variacionTecho
        }
      });
      
    } catch (error) {
      setBandasData(prev => ({
        ...prev,
        pisoCalculado: 933.50,
        techoCalculado: 1524.12,
        ipcUtilizado: 2.1,
        ipcMesReferencia: getMonthTMinus2()
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatosBandas();
    
    const interval = setInterval(() => {
      cargarDatosBandas();
    }, 3600000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-6 md:p-7 border border-gray-700/50 min-w-0 animate-pulse">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
              <div className="h-6 bg-gray-700 rounded w-40"></div>
            </div>
            <div className="h-4 bg-gray-800/50 rounded w-60"></div>
          </div>
          <div className="h-9 bg-gray-700 rounded w-28"></div>
        </div>
        <div className="text-center py-8">
          <div className="h-10 bg-gray-800/50 rounded-lg w-full max-w-xs mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Calculando bandas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-gray-700/50 min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-5 md:mb-8 min-w-0">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-4 md:gap-3 mb-3">
            <div className="w-1 h-5 md:h-6 bg-blue-600 rounded-full flex-shrink-0"></div>
            <h2 className="text-white text-lg md:text-xl lg:text-2xl font-bold truncate min-w-0">
              BANDAS CAMBIARIAS
            </h2>
          </div>
          
          {/* Información del cálculo */}
          <div className="flex items-start gap-2 p-2 md:p-3 bg-blue-900/10 rounded-lg">
            <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-blue-300 text-xs md:text-sm min-w-0">
              <span className="font-medium">Cálculo: </span>
              IPC[{bandasData.ipcMesReferencia.replace('-', '/')}] = {bandasData.ipcUtilizado.toFixed(2)}%
            </div>
          </div>
        </div>
        
        {/* Botón de recarga */}
        <button
          onClick={cargarDatosBandas}
          disabled={loading}
          className={`flex items-center gap-2 px-3 md:px-4 py-2 bg-gray-800/50 text-gray-300 rounded-lg transition-all duration-200 hover:bg-gray-700/50 min-w-0 flex-shrink-0 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="text-sm whitespace-nowrap">
            {loading ? 'Calculando...' : 'Recalcular'}
          </span>
        </button>
      </div>

      {/* Valores de las bandas - RESPONSIVE */}
      <div className="mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 lg:gap-8">
          
          {/* PISO */}
          <div className="text-center w-full sm:w-auto min-w-0">
            <div className="text-gray-400 text-sm mb-1">INFERIOR</div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <TrendingDown className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
              <div className="text-white text-2xl md:text-3xl font-bold">
                ${bandasData.pisoCalculado.toFixed(2)}
              </div>
            </div>
            <div className={`text-xs md:text-sm mb-1 ${
              bandasData.variacionMensual.piso >= 0 ? 'text-red-400' : 'text-green-400'
            }`}>
              {bandasData.variacionMensual.piso >= 0 ? '+' : ''}
              {bandasData.variacionMensual.piso.toFixed(1)}% mensual
            </div>
            <div className="text-gray-500 text-xs">
              Base: ${bandasData.piso.toFixed(2)}
            </div>
          </div>
          
          {/* SEPARADOR */}
          <div className="relative my-8 sm:my-0">
            <div className="hidden sm:flex items-center justify-center">
              <div className="w-8 md:w-12 h-1 bg-gradient-to-r from-blue-500 via-gray-500 to-red-500 rounded-full"></div>
              <Minus className="w-4 h-4 text-gray-500 mx-1" />
              <div className="w-8 md:w-12 h-1 bg-gradient-to-r from-red-500 via-gray-500 to-blue-500 rounded-full"></div>
            </div>
            <div className="sm:hidden w-full h-1 bg-gradient-to-r from-blue-500 via-gray-500 to-red-500 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500 text-xs bg-gray-900 px-1">
              ±
            </div>
          </div>
          
          {/* TECHO */}
          <div className="text-center w-full sm:w-auto min-w-0">
            <div className="text-gray-400 text-sm mb-1">SUPERIOR</div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-red-400" />
              <div className="text-white text-2xl md:text-3xl font-bold">
                ${bandasData.techoCalculado.toFixed(2)}
              </div>
            </div>
            <div className={`text-xs md:text-sm mb-1 ${
              bandasData.variacionMensual.techo >= 0 ? 'text-red-400' : 'text-green-400'
            }`}>
              {bandasData.variacionMensual.techo >= 0 ? '+' : ''}
              {bandasData.variacionMensual.techo.toFixed(1)}% mensual
            </div>
            <div className="text-gray-500 text-xs">
              Base: ${bandasData.techo.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Footer informativo */}
      <div className="bg-gray-800/30 rounded-lg p-3 md:p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div className="text-gray-400 text-xs md:text-sm">
              Actualizado: <span className="text-gray-300 font-medium">{bandasData.fechaActualizacion}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-gray-500 text-xs md:text-sm">
              IPC <span className="text-gray-300">{bandasData.ipcMesReferencia.replace('-', '/')}</span>:
            </div>
            <div className="text-blue-400 text-sm md:text-base font-semibold">
              {bandasData.ipcUtilizado.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      {/* Información adicional para móviles */}
      <div className="mt-3 text-gray-500 text-xs text-center sm:hidden">
        Las bandas se ajustan mensualmente con IPC[t-2]
      </div>
    </div>
  );
};

export default ExchangeBandsModule;