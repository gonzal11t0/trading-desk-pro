import { create } from 'zustand';

export const useEducationStore = create((set) => ({
  // Estado del botón flotante
  showButton: false,
  
  // Si el usuario cerró manualmente
  userClosed: false,
  
  // Cuándo cerró por última vez (timestamp)
  lastClosedTime: null,
  
  // Indicador activo en el explainer
  activeIndicatorId: null,
  
  // Si el explainer está abierto
  isExplainerOpen: false,
  
  // Acciones
  setShowButton: (show) => set({ showButton: show }),
  
  closeButton: () => set({ 
    showButton: false, 
    userClosed: true,
    lastClosedTime: Date.now()
  }),
  
  resetButton: () => set({ 
    userClosed: false,
    lastClosedTime: null 
  }),
  
  setActiveIndicator: (id) => set({ activeIndicatorId: id }),
  
  openExplainer: (indicatorId = null) => set({ 
    isExplainerOpen: true, 
    activeIndicatorId: indicatorId,
    showButton: false
  }),
  
  closeExplainer: () => set({ 
    isExplainerOpen: false,
    activeIndicatorId: null
  }),
  
  toggleExplainer: () => set((state) => ({ 
    isExplainerOpen: !state.isExplainerOpen,
    showButton: false
  }))
}));