import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Calendar, RefreshCw, Info, Minus } from 'lucide-react';
import inflationApi from '../../api/inflationApi';

const ExchangeBandsModule = () => {
  const [loading, setLoading] = useState(true);
  const [ipcCache, setIpcCache] = useState(null);
  const [lastIpcFetch, setLastIpcFetch] = useState(null);
  const [bandasData, setBandasData] = useState({
    piso: 0,
    techo: 0,
    pisoBase: 915.66,
    techoBase: 1527.61,
    fechaBase: '2026-01-01',
    ipcUtilizado: 0,
    ipcMesReferencia: '',
    tasaDiaria: 0,
    diasDesdeBase: 0,
    fechaActualizacion: ''
  });

  // Obtener mes T-2 para IPC
  const getMonthTMinus2 = () => {
    const now = new Date();
    const targetDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    return `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}`;
  };

  // Calcular días desde la fecha base (1/1/2026)
  const calcularDiasDesdeBase = () => {
    const fechaBase = new Date(2026, 0, 1);
    const hoy = new Date();
    const diffTime = hoy - fechaBase;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  // Calcular tasa diaria exponencial: r_d = (1 + r_m)^(1/30) - 1
  const calcularTasaDiaria = (ipcPercent) => {
    return Math.pow(1 + (ipcPercent / 100), 1 / 30) - 1;
  };

  // Calcular bandas con fórmula exponencial
  const calcularBandasExponencial = (pisoBase, techoBase, tasaDiaria, dias) => {
    const factor = 1 + tasaDiaria;
    const techoCalculado = techoBase * Math.pow(factor, dias);
    const pisoCalculado = pisoBase * Math.pow(factor, -dias);
    return { pisoCalculado, techoCalculado };
  };

const cargarDatosBandas = async (forceRefreshIPC = false) => {
  setLoading(true);
  
  try {
    let ipcValor;
    let mesTMinus2;
    
    // 👇 LÓGICA OPTIMIZADA: solo consultar IPC si:
    // - No hay cache
    // - ForceRefreshIPC es true (cuando el usuario toca "Recalcular")
    // - Pasaron más de 6 horas desde la última consulta
    const ahora = new Date();
    const deberiaActualizarIPC = !ipcCache || 
                                  forceRefreshIPC || 
                                  !lastIpcFetch || 
                                  (ahora - lastIpcFetch) > 6 * 60 * 60 * 1000;
    
    if (deberiaActualizarIPC) {
      console.log('🔄 Consultando IPC a la API...');
      // Obtener IPC histórico
      const ipcHistorico = await inflationApi.getLastMonthsInflation(12);
      
      const formattedIpcData = ipcHistorico.map(item => ({
        month: item.date ? item.date.slice(0, 7) : '',
        value: item.values?.monthly || 0,
        date: item.date
      }));
      
      // Obtener IPC del mes T-2
      mesTMinus2 = getMonthTMinus2();
      const ipcEncontrado = formattedIpcData.find(item => item.month === mesTMinus2);
      
      if (ipcEncontrado) {
        ipcValor = ipcEncontrado.value;
      } else {
        ipcValor = formattedIpcData[0]?.value || 2.9;
      }
      
      // Guardar en cache
      setIpcCache({
        valor: ipcValor,
        mes: mesTMinus2,
        timestamp: ahora
      });
      setLastIpcFetch(ahora);
      
    } else {
      console.log('📦 Usando IPC cacheado:', ipcCache);
      ipcValor = ipcCache.valor;
      mesTMinus2 = ipcCache.mes;
    }
    
    // Resto del código igual (calcular días, tasa diaria, bandas)
    const dias = calcularDiasDesdeBase();
    const tasaDiaria = calcularTasaDiaria(ipcValor);
    const { pisoCalculado, techoCalculado } = calcularBandasExponencial(
      915.66, 1527.61, tasaDiaria, dias
    );
    
    setBandasData({
      piso: pisoCalculado,
      techo: techoCalculado,
      pisoBase: 915.66,
      techoBase: 1527.61,
      fechaBase: '2026-01-01',
      ipcUtilizado: ipcValor,
      ipcMesReferencia: mesTMinus2,
      tasaDiaria: tasaDiaria * 100,
      diasDesdeBase: dias,
      fechaActualizacion: new Date().toLocaleDateString('es-AR')
    });
    
  } catch (error) {
    console.error('Error calculando bandas:', error);
    // Fallback...
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    cargarDatosBandas();
    
    // Actualizar cada hora (las bandas cambian diariamente)
    const interval = setInterval(() => {
      cargarDatosBandas();
    }, 3600000);
    
    return () => clearInterval(interval);
    // El intervalo debe conservar una sola instancia durante la vida del componente.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              IPC[{bandasData.ipcMesReferencia.replace('-', '/')}] = {bandasData.ipcUtilizado.toFixed(2)}% | 
              Tasa diaria: {bandasData.tasaDiaria.toFixed(4)}% | 
              Días desde base: {bandasData.diasDesdeBase}
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

      {/* Valores de las bandas */}
      <div className="mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 lg:gap-8">
          
          {/* PISO */}
          <div className="text-center w-full sm:w-auto min-w-0">
            <div className="text-gray-400 text-sm mb-1">INFERIOR</div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <TrendingDown className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
              <div className="text-white text-2xl md:text-3xl font-bold">
                ${bandasData.piso.toFixed(2)}
              </div>
            </div>
            <div className="text-xs md:text-sm text-blue-300 mb-1">
              Decaimiento exponencial
            </div>
            <div className="text-gray-500 text-xs">
              Base (1/1/26): ${bandasData.pisoBase.toFixed(2)}
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
                ${bandasData.techo.toFixed(2)}
              </div>
            </div>
            <div className="text-xs md:text-sm text-red-300 mb-1">
              Crecimiento exponencial
            </div>
            <div className="text-gray-500 text-xs">
              Base (1/1/26): ${bandasData.techoBase.toFixed(2)}
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
              Fórmula:
            </div>
            <div className="text-gray-300 text-xs md:text-sm font-mono">
              B_sup(t) = B_sup_0 × (1 + r_d)^t
            </div>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-3 text-gray-500 text-xs text-center">
        Bandas con ajuste exponencial diario | IPC {bandasData.ipcMesReferencia.replace('-', '/')} (T-2)
      </div>
    </div>
  );
};

export default ExchangeBandsModule;
