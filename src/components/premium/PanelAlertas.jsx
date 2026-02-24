// src/components/premium/PanelAlertas.jsx
import React from 'react';
import { Bell, Trash2, ToggleLeft, ToggleRight, X } from 'lucide-react';
import { usePremiumStore } from '../../stores/premiumStore';

const PanelAlertas = ({ isOpen, onClose }) => {
  const { alertas, eliminarAlerta, toggleAlerta } = usePremiumStore();

  if (!isOpen) return null;

  // Función para obtener el color según el tipo
  const getTipoColor = (tipo) => {
    switch(tipo) {
      case 'balances': return 'text-blue-400';
      case 'bonos': return 'text-green-400';
      case 'letras': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  // Función para formatear el tipo
  const formatTipo = (tipo) => {
    switch(tipo) {
      case 'balances': return '📈 Balance';
      case 'bonos': return '💰 Bono';
      case 'letras': return '📝 Letra';
      default: return tipo;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Mis Alertas</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-gray-800 rounded transition"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-4">
          {alertas.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No tenés alertas configuradas</p>
              <p className="text-sm text-gray-500 mt-1">
                Creá una desde cualquier instrumento haciendo clic en <Bell className="w-3 h-3 inline" />
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {alertas.map(alerta => (
                <div 
                  key={alerta.id} 
                  className={`bg-gray-800/30 rounded-lg p-4 border transition ${
                    alerta.activa 
                      ? 'border-yellow-700/50' 
                      : 'border-gray-700/30 opacity-60'
                  }`}
                >
                  {/* Header de la alerta */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium ${getTipoColor(alerta.tipo)}`}>
                        {formatTipo(alerta.tipo)}
                      </span>
                      <h4 className="font-bold text-white">{alerta.ticker}</h4>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {/* Toggle activa/inactiva */}
                      <button
                        onClick={() => toggleAlerta(alerta.id)}
                        className="p-1.5 hover:bg-gray-700 rounded transition"
                        title={alerta.activa ? 'Desactivar alerta' : 'Activar alerta'}
                      >
                        {alerta.activa ? (
                          <ToggleRight className="w-5 h-5 text-green-400" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      
                      {/* Eliminar alerta */}
                      <button
                        onClick={() => eliminarAlerta(alerta.id)}
                        className="p-1.5 hover:bg-gray-700 rounded transition text-red-400 hover:text-red-300"
                        title="Eliminar alerta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Detalles de la alerta */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-900/50 rounded-lg p-2">
                      <p className="text-xs text-gray-500 mb-1">Condición</p>
                      <p className="text-white font-medium">
                        {alerta.condicion === 'mayor' ? '≥' : '≤'} ${alerta.precioObjetivo.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-2">
                      <p className="text-xs text-gray-500 mb-1">Precio actual</p>
                      <p className="text-white font-medium">
                        ${alerta.precioActual?.toFixed(2) || '—'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Fecha de creación */}
                  <p className="text-xs text-gray-600 mt-3">
                    Creada: {new Date(alerta.fechaCreacion).toLocaleDateString('es-AR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>

                  {/* Estado de la alerta */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      alerta.activa ? 'bg-green-500' : 'bg-gray-500'
                    }`} />
                    <span className="text-xs text-gray-400">
                      {alerta.activa ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer con instrucciones */}
        {alertas.length > 0 && (
          <div className="sticky bottom-0 bg-gray-900 border-t border-gray-700 p-4">
            <p className="text-xs text-gray-500 text-center">
              Las alertas se verifican cada 30 segundos cuando la página está abierta
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PanelAlertas;