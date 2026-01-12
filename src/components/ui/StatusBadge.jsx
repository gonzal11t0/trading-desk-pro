/* statusbadge*/
import React, { useMemo } from 'react'
import { Wifi, WifiOff, RefreshCw, Database } from 'lucide-react'

// Íconos memoizados por separado
const LiveIcon = React.memo(() => <Wifi className="w-3 h-3" />);
const MockIcon = React.memo(() => <Database className="w-3 h-3" />);
const OfflineIcon = React.memo(() => <WifiOff className="w-3 h-3" />);
const LoadingIcon = React.memo(() => <RefreshCw className="w-3 h-3" />);

const STATUS_CONFIGS = {
  live: {
    icon: <LiveIcon />,
    text: 'EN VIVO',
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    borderColor: 'border-green-400/20'
  },
  mock: {
    icon: <MockIcon />,
    text: 'MOCK DATA',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10', 
    borderColor: 'border-yellow-400/20'
  },
  offline: {
    icon: <OfflineIcon />,
    text: 'OFFLINE',
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
    borderColor: 'border-red-400/20'
  },
  default: {
    icon: <LoadingIcon />,
    text: 'CARGANDO',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/20'
  }
}

export const StatusBadge = React.memo(({ status, loading = false }) => {
  const config = useMemo(() => 
    STATUS_CONFIGS[status] || STATUS_CONFIGS.default, 
    [status]
  );

  return (
    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${config.bgColor} ${config.borderColor} ${config.color} ${loading ? 'animate-pulse' : ''}`}>
      {loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : config.icon}
      <span className="font-mono font-medium">{config.text}</span>
    </div>
  )
});