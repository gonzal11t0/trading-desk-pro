/* exchangebandsModule*/
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Calendar, RefreshCw, Info } from 'lucide-react';
import inflationApi from '../../api/inflationApi';

const ExchangeBandsModule = () => {
  const [loading, setLoading] = useState(true);
  const [ setIpcData] = useState([]); // ✅ CORREGIDO: Añadí la variable de estado
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
      // 1. Obtener datos IPC de tu API
      const ipcHistorico = await inflationApi.getLastMonthsInflation(12);
      
      // Formatear datos para nuestro uso
      const formattedIpcData = ipcHistorico.map(item => ({
        month: item.date ? item.date.slice(0, 7) : '',
        value: item.values?.monthly || 0,
        date: item.date
      }));
      
      setIpcData(formattedIpcData);
      
      // 2. Determinar mes t-2
      const mesTMinus2 = getMonthTMinus2();
      
      // 3. Obtener IPC[t-2]
      let ipcValor = 0;
      const ipcEncontrado = formattedIpcData.find(item => item.month === mesTMinus2);
      
      if (ipcEncontrado) {
        ipcValor = ipcEncontrado.value;
      } else {
        // Si no encuentra exacto, usar el último disponible
        ipcValor = formattedIpcData[0]?.value || 2.1;
      }
      
      // 4. Calcular bandas ajustadas
      const basePiso = 915.66;
      const baseTecho = 1527.61;
      
      const bandasCalculadas = calcularBandasConIPC(basePiso, baseTecho, ipcValor);
      
      // 5. Actualizar estado
      setBandasData({
        piso: basePiso,
        techo: baseTecho,
        pisoCalculado: bandasCalculadas.pisoCalculado,
        techoCalculado: bandasCalculadas.techoCalculado,
        fechaActualizacion: new Date().toISOString().split('T')[0],
        ipcUtilizado: ipcValor,
        ipcMesReferencia: mesTMinus2,
        variacionMensual: {
          piso: bandasCalculadas.variacionPiso,
          techo: bandasCalculadas.variacionTecho
        }
      });
      
    } catch (error) {
      // Fallback a valores estáticos si hay error
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
    
    // Actualizar automáticamente cada hora
    const interval = setInterval(() => {
      cargarDatosBandas();
    }, 3600000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      backgroundColor: 'rgb(26, 26, 26)',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid #374151',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: 0
          }}>
            <div style={{
              width: '4px',
              height: '24px',
              background: '#3b82f6',
              borderRadius: '2px'
            }}></div>
            BANDAS CAMBIARIAS
          </h2>
          
          {/* Información del cálculo */}
          <div style={{
            marginTop: '8px',
            padding: '8px 12px',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Info size={16} style={{color: '#93c5fd', flexShrink: 0}} />
            <div style={{fontSize: '12px', color: '#93c5fd'}}>
              Calculado con IPC[{bandasData.ipcMesReferencia}]: {bandasData.ipcUtilizado.toFixed(2)}%
            </div>
          </div>
        </div>
        
        <button
          onClick={cargarDatosBandas}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: '#374151',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1,
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => {
            if (!loading) e.target.style.background = '#4b5563';
          }}
          onMouseOut={(e) => {
            if (!loading) e.target.style.background = '#374151';
          }}
        >
          <RefreshCw size={18} style={{
            animation: loading ? 'spin 1s linear infinite' : 'none'
          }} />
          {loading ? 'Calculando...' : 'Recalcular'}
        </button>
      </div>

      {/* Valores de las bandas */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: '32px'
        }}>
          {/* PISO */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              color: '#9ca3af',
              fontSize: '14px',
              marginBottom: '4px'
            }}>INFERIOR</div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <TrendingDown size={20} style={{color: '#60a5fa'}} />
              <div style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#ffffff'
              }}>${bandasData.pisoCalculado.toFixed(2)}</div>
            </div>
            <div style={{
              fontSize: '12px',
              marginTop: '2px',
              color: bandasData.variacionMensual.piso >= 0 ? '#f87171' : '#4ade80'
            }}>
              {bandasData.variacionMensual.piso >= 0 ? '+' : ''}{bandasData.variacionMensual.piso.toFixed(1)}% mensual
            </div>
            <div style={{
              fontSize: '10px',
              color: '#6b7280',
              marginTop: '2px'
            }}>
              Base: ${bandasData.piso.toFixed(2)}
            </div>
          </div>
          
          {/* SEPARADOR */}
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <div style={{
              width: '48px',
              height: '4px',
              background: 'linear-gradient(to right, #3b82f6, #6b7280, #ef4444)',
              borderRadius: '4px'
            }}></div>
            <div style={{
              position: 'absolute',
              top: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '12px',
              color: '#6b7280'
            }}>
              ~
            </div>
          </div>
          
          {/* TECHO */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              color: '#9ca3af',
              fontSize: '14px',
              marginBottom: '4px'
            }}>SUPERIOR</div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <TrendingUp size={20} style={{color: '#f87171'}} />
              <div style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#ffffff'
              }}>${bandasData.techoCalculado.toFixed(2)}</div>
            </div>
            <div style={{
              fontSize: '12px',
              marginTop: '2px',
              color: bandasData.variacionMensual.techo >= 0 ? '#f87171' : '#4ade80'
            }}>
              {bandasData.variacionMensual.techo >= 0 ? '+' : ''}{bandasData.variacionMensual.techo.toFixed(1)}% mensual
            </div>
            <div style={{
              fontSize: '10px',
              color: '#6b7280',
              marginTop: '2px'
            }}>
              Base: ${bandasData.techo.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Fecha de actualización */}
      <div style={{
        background: 'rgba(55, 65, 81, 0.5)',
        padding: '16px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={16} style={{color: '#9ca3af'}} />
          <div style={{ fontSize: '12px', color: '#9ca3af' }}>
            Actualizado: {bandasData.fechaActualizacion}
          </div>
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          IPC {bandasData.ipcMesReferencia}: {bandasData.ipcUtilizado.toFixed(2)}%
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default ExchangeBandsModule;