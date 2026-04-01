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
import { bonosApi } from '../../../api/bonosApi';
import { letrasApi } from '../../../api/letrasApi';

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
    const puntos = [];

    // 1. Letras del Tesoro (corto plazo)
    const letrasMap = {
      'S29Y6': { plazo: 0.16, tasa: 42, nombre: 'S29Y6', tipo: 'Letra', moneda: 'ARS' },
      'M31G6': { plazo: 0.5, tasa: 36, nombre: 'M31G6', tipo: 'Letra', moneda: 'ARS' },
      'S30N6': { plazo: 0.75, tasa: 40, nombre: 'S30N6', tipo: 'Letra', moneda: 'ARS' },
      'X30N6': { plazo: 0.75, tasa: 22, nombre: 'X30N6 (CER)', tipo: 'Letra CER', moneda: 'ARS' }
    };

    letras.forEach(letra => {
      const info = letrasMap[letra.ticker];
      if (info && letra.ultimo) {
        puntos.push({
          plazo: info.plazo,
          tasa: info.tasa,
          nombre: info.nombre,
          ticker: letra.ticker,
          tipo: info.tipo,
          moneda: info.moneda,
          precio: letra.ultimo
        });
      }
    });

    // 2. Bonos en pesos (mediano/largo plazo)
    const bonosPesosMap = {
      'AO27': { plazo: 0.8, tasa: 3.05, nombre: 'AO27', tipo: 'Bono ARS' },
      'AN29': { plazo: 2.7, tasa: 2.85, nombre: 'AN29', tipo: 'Bono ARS' },
      'AL30': { plazo: 4.8, tasa: 2.65, nombre: 'AL30', tipo: 'Bono ARS' },
      'AL35': { plazo: 9.7, tasa: 2.45, nombre: 'AL35', tipo: 'Bono ARS' },
      'AE38': { plazo: 12.8, tasa: 2.35, nombre: 'AE38', tipo: 'Bono ARS' },
      'AL41': { plazo: 15.8, tasa: 2.30, nombre: 'AL41', tipo: 'Bono ARS' }
    };

    bonos.forEach(bono => {
      const info = bonosPesosMap[bono.ticker];
      if (info && bono.ultimo) {
        puntos.push({
          plazo: info.plazo,
          tasa: info.tasa,
          nombre: info.nombre,
          ticker: bono.ticker,
          tipo: info.tipo,
          moneda: 'ARS',
          precio: bono.ultimo
        });
      }
    });

    // 3. Bonos en dólares (GD30, GD35) - datos fijos porque la API a veces no los trae
    const bonosDolaresFijos = [
      { plazo: 4.8, tasa: 14.8, nombre: 'GD30', ticker: 'GD30', tipo: 'Bono USD', moneda: 'USD', precio: 89240, variacion: -0.48 },
      { plazo: 9.7, tasa: 15.9, nombre: 'GD35', ticker: 'GD35', tipo: 'Bono USD', moneda: 'USD', precio: 110800, variacion: -0.81 }
    ];

    // Primero buscar si vienen de la API
   bonos.forEach(bono => {
  // GD30 (incluyendo variantes GD30, GD30C, GD30D)
  if (bono.ticker === 'GD30' || bono.ticker === 'GD30C' || bono.ticker === 'GD30D') {
    puntos.push({
      plazo: 4.8,
      tasa: 14.8,  // TIR aproximada (podríamos calcularla)
      nombre: 'GD30',
      ticker: bono.ticker,
      tipo: 'Bono USD',
      moneda: 'USD',
      precio: bono.ultimo,
      variacion: bono.variacion_dia
    });
  }
  // GD35 (incluyendo variantes GD35, GD35C, GD35D)
  if (bono.ticker === 'GD35' || bono.ticker === 'GD35C' || bono.ticker === 'GD35D') {
    puntos.push({
      plazo: 9.7,
      tasa: 15.9,
      nombre: 'GD35',
      ticker: bono.ticker,
      tipo: 'Bono USD',
      moneda: 'USD',
      precio: bono.ultimo,
      variacion: bono.variacion_dia
    });
  }
});

    // Agregar datos fijos si no aparecieron
    bonosDolaresFijos.forEach(bono => {
      const existe = puntos.some(p => p.ticker === bono.ticker || p.ticker === `${bono.ticker}D` || p.ticker === `${bono.ticker}C`);
      if (!existe) {
        puntos.push(bono);
      }
    });

    // Ordenar por plazo
    return puntos.sort((a, b) => a.plazo - b.plazo);
  }, [bonos, letras]);

  // Puntos para la curva suave (solo ARS)
  const puntosCurva = useMemo(() => {
    const plazos = [0.1, 0.2, 0.3, 0.5, 0.75, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16];
    const resultados = [];

    // Solo usar puntos ARS para la curva
    const puntosARS = datosCurva.filter(p => p.moneda === 'ARS');

    plazos.forEach(plazo => {
      const cercanos = puntosARS.filter(p => Math.abs(p.plazo - plazo) < 1.5);
      if (cercanos.length >= 2) {
        const ordenados = cercanos.sort((a, b) => Math.abs(a.plazo - plazo) - Math.abs(b.plazo - plazo));
        const p1 = ordenados[0];
        const p2 = ordenados[1];
        if (p1 && p2 && p1.plazo !== p2.plazo) {
          const tasa = p1.tasa + (p2.tasa - p1.tasa) * ((plazo - p1.plazo) / (p2.plazo - p1.plazo));
          resultados.push({ plazo, tasa: Math.max(0, Math.min(tasa, 50)) });
        } else if (p1) {
          resultados.push({ plazo, tasa: p1.tasa });
        }
      } else if (cercanos.length === 1) {
        resultados.push({ plazo, tasa: cercanos[0].tasa });
      }
    });

    return resultados;
  }, [datosCurva]);

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

      {/* Tabla de datos */}
      {mostrarTabla && (
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