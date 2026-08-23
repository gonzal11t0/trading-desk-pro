// src/components/premium/CurvaRendimientoTab.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from 'recharts';
import { TrendingUp, Download, RefreshCw, Info } from 'lucide-react';
import { bonosApi } from '../../api/bonosApi';
import { letrasApi } from '../../api/letrasApi';

const CurvaRendimientoTab = () => {
  const [bonos, setBonos] = useState([]);
  const [letras, setLetras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [mostrarTabla, setMostrarTabla] = useState(true);

  // Cargar datos de bonos y letras
  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [bonosData, letrasData] = await Promise.all([
        bonosApi.getBonos(),
        letrasApi.getLetras()
      ]);
      
      setBonos(Array.isArray(bonosData) ? bonosData : []);
      setLetras(Array.isArray(letrasData) ? letrasData : []);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
    const interval = setInterval(cargarDatos, 20 * 60 * 1000); // 20 min
    return () => clearInterval(interval);
  }, []);

  // Datos para la curva
  const datosCurva = useMemo(() => {
    const hoy = new Date();
    const crearPunto = (instrumento, tipoPredeterminado) => {
      const tasa = Number(instrumento.tir ?? instrumento.tea ?? instrumento.tna);
      const vencimiento = instrumento.vencimiento ? new Date(instrumento.vencimiento) : null;
      const plazo = Number(instrumento.plazo_anos) || (
        vencimiento && !Number.isNaN(vencimiento.getTime())
          ? (vencimiento - hoy) / (365.25 * 24 * 60 * 60 * 1000)
          : null
      );

      if (!Number.isFinite(tasa) || !Number.isFinite(plazo) || plazo <= 0) return null;
      return {
        plazo,
        tasa,
        nombre: instrumento.nombre || instrumento.ticker,
        ticker: instrumento.ticker,
        tipo: instrumento.tipo || tipoPredeterminado,
        moneda: instrumento.moneda || 'ARS',
        precio: Number(instrumento.ultimo)
      };
    };

    return [
      ...letras.map(letra => crearPunto(letra, 'Letra')),
      ...bonos.map(bono => crearPunto(bono, 'Bono'))
    ].filter(Boolean).sort((a, b) => a.plazo - b.plazo);
  }, [bonos, letras]);

  // Custom tooltip
  // Custom tooltip mejorado - muestra todos los puntos en la misma coordenada X
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // Agrupar por tipo de moneda
    const puntosARS = payload.filter(p => p.dataKey === 'tasa' && p.payload?.moneda === 'ARS');
    const puntosUSD = payload.filter(p => p.dataKey === 'tasa' && p.payload?.moneda === 'USD');
    
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl max-w-xs">
        <p className="text-yellow-400 font-bold text-sm mb-2">
          Plazo: {label} años
        </p>
        
        {puntosARS.length > 0 && (
          <div className="mb-2">
            <div className="text-blue-400 text-xs font-semibold mb-1">📊 Bonos ARS / Letras</div>
            {puntosARS.map((p, idx) => (
              <div key={idx} className="text-sm border-b border-gray-800 pb-1 mb-1">
                <div className="text-white font-medium">{p.payload.ticker}</div>
                <div className="text-gray-300 text-xs">{p.payload.tipo}</div>
                <div className="text-yellow-400">Tasa: {p.value.toFixed(2)}%</div>
                {p.payload.precio && (
                  <div className="text-gray-400 text-xs">Precio: ${p.payload.precio.toLocaleString('es-AR')}</div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {puntosUSD.length > 0 && (
          <div>
            <div className="text-green-400 text-xs font-semibold mb-1">💵 Bonos USD</div>
            {puntosUSD.map((p, idx) => (
              <div key={idx} className="text-sm border-b border-gray-800 pb-1 mb-1">
                <div className="text-white font-medium">{p.payload.ticker}</div>
                <div className="text-gray-300 text-xs">{p.payload.tipo}</div>
                <div className="text-green-400">TIR: {p.value.toFixed(2)}%</div>
                {p.payload.precio && (
                  <div className="text-gray-400 text-xs">Precio: ${p.payload.precio.toLocaleString('es-AR')}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  return null;
};
  // Exportar datos
  const exportarCSV = () => {
    const headers = ['Ticker', 'Nombre', 'Plazo (años)', 'Tasa (%)', 'Tipo', 'Moneda'];
    const rows = datosCurva.map(p => [
      p.ticker,
      p.nombre,
      p.plazo,
      p.tasa.toFixed(2),
      p.tipo,
      p.moneda
    ]);
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `curva-rendimiento-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading && datosCurva.length === 0) {
    return (
      <div className="bg-gray-800/30 rounded-xl p-8 border border-gray-700/50 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mx-auto mb-4"></div>
        <p className="text-gray-400">Cargando curva de rendimiento...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-yellow-400" />
          <h2 className="text-xl font-bold text-white">Curva de Rendimiento Argentina</h2>
          <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded">Yield Curve</span>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdate && (
            <span className="text-xs text-gray-500">
              Actualizado: {lastUpdate.toLocaleTimeString('es-AR')}
            </span>
          )}
          <button
            onClick={cargarDatos}
            disabled={loading}
            className="p-2 hover:bg-gray-700 rounded-lg transition"
            title="Actualizar"
          >
            <RefreshCw className={`w-4 h-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={exportarCSV}
            className="p-2 hover:bg-gray-700 rounded-lg transition"
            title="Exportar CSV"
          >
            <Download className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={() => setMostrarTabla(!mostrarTabla)}
            className="p-2 hover:bg-gray-700 rounded-lg transition text-xs text-gray-400"
          >
            {mostrarTabla ? 'Ocultar tabla' : 'Mostrar tabla'}
          </button>
        </div>
      </div>

      {/* Gráfico */}
      {datosCurva.length === 0 ? (
        <div className="bg-yellow-950/20 rounded-xl p-6 border border-yellow-700/30 text-center">
          <Info className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
          <h3 className="text-white font-semibold mb-2">No hay rendimientos verificables para construir la curva</h3>
          <p className="text-sm text-gray-400">
            La fuente actual informa precios, pero no entrega TIR/TNA, vencimientos y flujos suficientes.
            No se muestran tasas estimadas ni datos fijos.
          </p>
        </div>
      ) : (
      <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <span className="text-xs text-gray-400">Curva de Rendimiento (ARS)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs text-gray-400">Bonos ARS / Letras</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-400">Bonos USD (GD30, GD35)</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            📅 {new Date().toLocaleDateString('es-AR')}
          </div>
        </div>

        <div className="w-full h-[450px]">
  <ResponsiveContainer width="100%" height="100%">
    <LineChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
      
      {/* Eje Y izquierdo (ARS - escala 0-45% para ver las letras) */}
      <YAxis
        yAxisId="left"
        domain={[0, 45]}
        label={{ value: 'Tasa ARS (%)', angle: -90, position: 'insideLeft', fill: '#9ca3af', offset: -5 }}
        tick={{ fill: '#9ca3af' }}
        tickFormatter={(value) => `${value}%`}
      />
      
      {/* Eje Y derecho (USD - escala 0-20%) */}
      <YAxis
        yAxisId="right"
        orientation="right"
        domain={[0, 20]}
        label={{ value: 'TIR USD (%)', angle: 90, position: 'insideRight', fill: '#9ca3af', offset: -5 }}
        tick={{ fill: '#9ca3af' }}
        tickFormatter={(value) => `${value}%`}
      />
      
      <XAxis
        dataKey="plazo"
        type="number"
        domain={[0, 16]}
        tickCount={9}
        label={{ value: 'Plazo (años)', position: 'insideBottom', offset: -5, fill: '#9ca3af' }}
        tick={{ fill: '#9ca3af' }}
      />
      
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      
      {/* Puntos de bonos ARS y Letras */}
      <Line
        yAxisId="left"
        data={datosCurva.filter(p => p.moneda === 'ARS')}
        type="monotone"
        dataKey="tasa"
        stroke="none"
        dot={{ r: 5, fill: '#3b82f6', stroke: '#3b82f6', strokeWidth: 2 }}
        activeDot={{ r: 7, fill: '#3b82f6' }}
        name="Bonos ARS / Letras"
      />
      
      {/* Puntos de bonos USD (eje derecho) */}
      <Line
        yAxisId="right"
        data={datosCurva.filter(p => p.moneda === 'USD')}
        type="monotone"
        dataKey="tasa"
        stroke="none"
        dot={{ r: 6, fill: '#22c55e', stroke: '#22c55e', strokeWidth: 2 }}
        activeDot={{ r: 8, fill: '#22c55e' }}
        name="Bonos USD (GD30, GD35)"
      />
      
      <ReferenceLine y={0} stroke="#4b5563" strokeDasharray="3 3" />
    </LineChart>
  </ResponsiveContainer>
</div>
      </div>
      )}

      {/* Tabla de datos */}
      {mostrarTabla && datosCurva.length > 0 && (
        <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
          <h3 className="text-sm font-semibold text-white mb-3">📊 Datos de la Curva</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 text-gray-400">Ticker</th>
                  <th className="text-left py-2 text-gray-400">Nombre</th>
                  <th className="text-right py-2 text-gray-400">Plazo (años)</th>
                  <th className="text-right py-2 text-gray-400">Tasa/TIR</th>
                  <th className="text-left py-2 text-gray-400">Tipo</th>
                  <th className="text-left py-2 text-gray-400">Moneda</th>
                  <th className="text-right py-2 text-gray-400">Precio</th>
                 </tr>
              </thead>
              <tbody>
                {datosCurva.map((punto, idx) => (
                  <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800/30">
                    <td className={`py-2 font-medium ${punto.moneda === 'USD' ? 'text-green-400' : 'text-yellow-400'}`}>
                      {punto.ticker}
                    </td>
                    <td className="py-2 text-gray-300">{punto.nombre}</td>
                    <td className="py-2 text-right text-gray-300">{punto.plazo}</td>
                    <td className="py-2 text-right text-white font-semibold">{punto.tasa.toFixed(2)}%</td>
                    <td className="py-2 text-gray-400">{punto.tipo}</td>
                    <td className="py-2 text-gray-400">{punto.moneda}</td>
                    <td className="py-2 text-right text-gray-300">
                      ${punto.precio?.toLocaleString('es-AR') || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 pt-2 border-t border-gray-700/30 text-xs text-gray-500 flex justify-between">
            <span>📈 {datosCurva.length} instrumentos (Letras + Bonos)</span>
            <span>🔄 Actualización automática cada 20 minutos</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurvaRendimientoTab;
