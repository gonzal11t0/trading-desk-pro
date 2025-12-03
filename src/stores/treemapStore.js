// src/stores/treemapStore.js
// Store de Zustand para el treemap
import { create } from 'zustand';

const useTreemapStore = create((set) => ({
  // Datos de los paneles
  leaderData: [],
  cedearsData: [],
  bondsData: [],
  
  // Estado de carga
  isLoading: false,
  lastUpdate: null,
  
  // Actions
  setLeaderData: (data) => set({ leaderData: data }),
  setCedearsData: (data) => set({ cedearsData: data }),
  setBondsData: (data) => set({ bondsData: data }),
  
  setLoading: (isLoading) => set({ isLoading }),
  updateLastUpdate: () => set({ lastUpdate: new Date().toISOString() }),
  
  // Función para actualizar todos los datos
  updateAllData: async () => {
    set({ isLoading: true });
    
    try {
      // Aquí llamarías a las APIs reales
      // Por ahora actualizamos con datos mock
      const mockLeader = [
        { ticker: 'GGAL', variation: Math.random() * 6 - 3, size: 25 },
        // ... más datos dinámicos
      ];
      
      set({
        leaderData: mockLeader,
        isLoading: false,
        lastUpdate: new Date().toISOString()
      });
    } catch (error) {
      set({ isLoading: false });
    }
  }
}));

export default useTreemapStore;