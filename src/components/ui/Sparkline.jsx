// src/components/ui/Sparkline.jsx
import React from 'react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

export function Sparkline({ data, positive = true, height = 30 }) {
  if (!data || data.length === 0) {
    return (
      <div className={`w-full h-[${height}px] flex items-center justify-center`}>
        <div className={`w-full h-px ${positive ? 'bg-green-400' : 'bg-red-400'} opacity-50`}></div>
      </div>
    )
  }

  const color = positive ? '#00FF9D' : '#FF5E5E'

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={true}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}