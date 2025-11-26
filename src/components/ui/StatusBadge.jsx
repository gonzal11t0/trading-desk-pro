  // src/components/ui/StatusBadge.jsx
  import React from 'react'
  import { Wifi, WifiOff, RefreshCw, Database } from 'lucide-react'

  export function StatusBadge({ status, loading = false }) {
    const getStatusConfig = () => {
      switch(status) {
        case 'live':
          return {
            icon: <Wifi className="w-3 h-3" />,
            text: 'EN VIVO',
            color: 'text-green-400',
            bgColor: 'bg-green-400/10',
            borderColor: 'border-green-400/20'
          }
        case 'mock':
          return {
            icon: <Database className="w-3 h-3" />,
            text: 'MOCK DATA',
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-400/10', 
            borderColor: 'border-yellow-400/20'
          }
        case 'offline':
          return {
            icon: <WifiOff className="w-3 h-3" />,
            text: 'OFFLINE',
            color: 'text-red-400',
            bgColor: 'bg-red-400/10',
            borderColor: 'border-red-400/20'
          }
        default:
          return {
            icon: <RefreshCw className="w-3 h-3" />,
            text: 'CARGANDO',
            color: 'text-blue-400',
            bgColor: 'bg-blue-400/10',
            borderColor: 'border-blue-400/20'
          }
      }
    }

    const config = getStatusConfig()

    return (
      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${config.bgColor} ${config.borderColor} ${config.color} ${loading ? 'animate-pulse' : ''}`}>
        {loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : config.icon}
        <span className="font-mono font-medium">{config.text}</span>
      </div>
    )
  }