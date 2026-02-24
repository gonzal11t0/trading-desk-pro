// src/components/premium/ModalAlerta.jsx
import React, { useState } from 'react';
import { X, Bell, ChevronDown, AlertCircle } from 'lucide-react';
import { usePremiumStore } from '../../stores/premiumStore';

const ModalAlerta = ({ isOpen, onClose, instrumento }) => {
  const [precioObjetivo, setPrecioObjetivo] = useState(instrumento.precio || 0);
  const [condicion, setCondicion] = useState('mayor');
  const [error, setError] = useState('');
  const { crearAlerta } = usePremiumStore();

  if (!isOpen) return null;

  // Validar y crear alerta
  const handleCrearAlerta = () => {
    // Validaciones
    if (precioObjetivo <= 0) {
      setError('El precio objetivo debe ser mayor a 0');
      return;
    }

    if (precioObjetivo === instrumento.precio) {
      setError('El precio objetivo no puede ser igual al precio actual');
      return;
    }

    // Crear alerta
    crearAlerta({
      tipo: instrumento.tipo,
      ticker: instrumento.ticker,
      nombre: instrumento.nombre || instrumento.ticker,
      precioObjetivo,
      condicion,
      precioActual: instrumento.precio
    });

    // Cerrar modal
    onClose();
  };

  // Obtener título según tipo
  const getTitulo = () => {
    switch(instrumento.tipo) {
      case 'balances': return 'Alerta de Balance';
      case 'bonos': return 'Alerta de Bono';
      case 'letras': return 'Alerta de Letra';
      default: return 'Crear Alerta';
    }
  };

  // Obtener precio actual formateado
  const getPrecioActual = () => {
    if (instrumento.tipo === 'balances') {
      return `PER: ${instrumento.precio}x`;
    }
    return `$${instrumento.precio?.toFixed(2)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-gray-900 rounded-xl max-w-md w-full border border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">{getTitulo()}</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-gray-800 rounded transition"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-4">
          {/* Instrumento */}
          <div className="bg-gray-800/30 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Instrumento</p>
            <div className="flex justify-between items-center">
              <p className="text-white font-semibold">{instrumento.ticker}</p>
              <p className="text-sm text-gray-300">{getPrecioActual()}</p>
            </div>
            {instrumento.nombre && instrumento.nombre !== instrumento.ticker && (
              <p className="text-xs text-gray-500 mt-1">{instrumento.nombre}</p>
            )}
          </div>

          {/* Condición */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Condición</label>
            <div className="relative">
              <select
                value={condicion}
                onChange={(e) => setCondicion(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white appearance-none cursor-pointer focus:outline-none focus:border-yellow-600"
              >
                <option value="mayor">Mayor o igual a</option>
                <option value="menor">Menor o igual a</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Precio objetivo */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Precio objetivo</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">$</span>
              <input
                type="number"
                value={precioObjetivo}
                onChange={(e) => {
                  setPrecioObjetivo(Number(e.target.value));
                  setError('');
                }}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-8 pr-4 py-3 text-white focus:outline-none focus:border-yellow-600"
                step={instrumento.tipo === 'balances' ? '0.1' : '0.01'}
                min="0.01"
              />
            </div>
          </div>

          {/* Preview de la alerta */}
          <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700">
            <p className="text-xs text-gray-400 mb-2">Vista previa de la alerta</p>
            <p className="text-sm text-gray-300">
              Te notificaremos cuando{' '}
              <span className="text-white font-medium">{instrumento.ticker}</span>{' '}
              sea{' '}
              <span className="text-yellow-400 font-medium">
                {condicion === 'mayor' ? '≥' : '≤'} ${precioObjetivo.toFixed(2)}
              </span>
            </p>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-gray-700">
          <button
            onClick={handleCrearAlerta}
            className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg transition font-medium"
          >
            Crear Alerta
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition font-medium"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAlerta;