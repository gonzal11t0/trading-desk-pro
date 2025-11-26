import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAppStore = create(
  persist(
    (set) => ({
      blocks: [],
      layout: [],
      
      config: {
        gridColumns: 3,
        refreshInterval: 30000,
        darkMode: true
      },
      
      addBlock: (block) => set((state) => ({ 
        blocks: [...state.blocks, block] 
      })),
      
      updateLayout: (newLayout) => set({ layout: newLayout }),
      
      updateConfig: (newConfig) => set((state) => ({
        config: { ...state.config, ...newConfig }
      })),
      
    initializeBlocks: (blocksFromConfig) => set({
  blocks:blocksFromConfig || [
    { 
      id: 'crypto-btc', 
      type: 'crypto', 
      symbol: 'bitcoin', 
      title: 'Bitcoin (BTC)',
      component: 'CryptoCard' 
    },
    { 
      id: 'crypto-eth', 
      type: 'crypto', 
      symbol: 'ethereum', 
      title: 'Ethereum (ETH)',
      component: 'CryptoCard' 
    },
    { 
      id: 'stock-aapl', 
      type: 'stock', 
      symbol: 'AAPL', 
      title: 'Apple Inc.',
      component: 'StockCard' 
    },
    { 
      id: 'forex-usdars', 
      type: 'forex', 
      symbol: 'USDARS', 
      title: 'Dólar Blue',
      component: 'ForexCard'
    },
    { 
      id: 'stock-msft', 
      type: 'stock', 
      symbol: 'MSFT', 
      title: 'Microsoft',
      component: 'StockCard' 
    }
  ]
})
    }),
    {
      name: 'trading-desk-storage',
      partialize: (state) => ({ 
        blocks: state.blocks,
        layout: state.layout,
        config: state.config
      })
    }
  )
)