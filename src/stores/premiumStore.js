// src/stores/premiumStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePremiumStore = create(
  persist(
    (set, get) => ({
      // ========== FAVORITOS ==========
      favoritos: {
        balances: [], // ['YPF', 'PAMP', ...]
        bonos: [],    // ['AL30', 'GD30', ...]
        letras: []    // ['LETRAS CAP', ...]
      },

      toggleFavorito: (tipo, ticker) => {
        const favoritos = { ...get().favoritos };
        const index = favoritos[tipo].indexOf(ticker);
        
        if (index === -1) {
          favoritos[tipo].push(ticker);
        } else {
          favoritos[tipo].splice(index, 1);
        }
        
        set({ favoritos });
      },

      esFavorito: (tipo, ticker) => {
        return get().favoritos[tipo]?.includes(ticker) || false;
      },

      // ========== ALERTAS ==========
      alertas: [], // [{ id, tipo, ticker, precioObjetivo, condicion, activa }]

      crearAlerta: (alerta) => {
        const nuevasAlertas = [
          ...get().alertas,
          {
            id: Date.now(),
            ...alerta,
            activa: true,
            fechaCreacion: new Date().toISOString()
          }
        ];
        set({ alertas: nuevasAlertas });
      },

      eliminarAlerta: (id) => {
        set({ alertas: get().alertas.filter(a => a.id !== id) });
      },

      toggleAlerta: (id) => {
        set({
          alertas: get().alertas.map(a =>
            a.id === id ? { ...a, activa: !a.activa } : a
          )
        });
      },

      // Verificar alertas (se llamará cada cierto tiempo)
      verificarAlertas: (preciosActuales) => {
        const alertasActivas = get().alertas.filter(a => a.activa);
        
        alertasActivas.forEach(alerta => {
          const precioActual = preciosActuales[alerta.ticker];
          if (!precioActual) return;

          const deberiaDisparar = alerta.condicion === 'mayor'
            ? precioActual >= alerta.precioObjetivo
            : precioActual <= alerta.precioObjetivo;

          if (deberiaDisparar) {
            // Disparar alerta (podría ser un toast, notificación, etc.)
            console.log(`🔔 ALERTA: ${alerta.ticker} alcanzó ${precioActual}`);
            
            // Opcional: desactivar alerta después de disparar
            // get().toggleAlerta(alerta.id);
          }
        });
      }
    }),
    {
      name: 'premium-storage', // nombre en localStorage
      partialize: (state) => ({
        favoritos: state.favoritos,
        alertas: state.alertas
      })
    }
  )
);