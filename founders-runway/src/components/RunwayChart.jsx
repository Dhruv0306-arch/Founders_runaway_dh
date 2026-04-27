import React, { useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { formatCurrencyShort } from '../utils/formatters.js'

export default function RunwayChart({ cashNum, burnNum, revenueNum = 0, currency = '$' }) {
  const data = useMemo(() => {
    const netBurn = Math.max(0, burnNum - revenueNum)
    if (netBurn <= 0) {
      // Infinite runway, flat line
      return [
        { month: 'Now', cash: cashNum },
        { month: 'Month 6', cash: cashNum },
        { month: 'Month 12', cash: cashNum },
        { month: 'Month 18', cash: cashNum },
        { month: 'Month 24', cash: cashNum },
      ]
    }

    const points = []
    let currentCash = cashNum
    let m = 0
    // Show max 24 months or until 0
    while (currentCash >= 0 && m <= 24) {
      points.push({
        month: m === 0 ? 'Now' : `Mo ${m}`,
        cash: Math.max(0, currentCash)
      })
      if (currentCash <= 0) break
      currentCash -= netBurn
      m++
    }
    return points
  }, [cashNum, burnNum, revenueNum])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-ecell-dark/90 backdrop-blur-sm border border-ecell-purple/20 p-3 rounded-xl shadow-xl">
          <p className="text-ecell-muted/80 text-xs mb-1 font-mono uppercase tracking-wider">{label}</p>
          <p className="text-white font-bold font-mono text-lg">
            {formatCurrencyShort(payload[0].value, currency)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-64 w-full mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FD562A" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#4526b1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#4526b1" strokeOpacity={0.15} vertical={false} />
          <XAxis 
            dataKey="month" 
            stroke="#beb1de" 
            strokeOpacity={0.4} 
            fontSize={10} 
            tickMargin={10} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#beb1de" 
            strokeOpacity={0.4} 
            fontSize={10} 
            tickFormatter={(value) => formatCurrencyShort(value, currency)} 
            tickLine={false} 
            axisLine={false} 
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#7153d9', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Area 
            type="monotone" 
            dataKey="cash" 
            stroke="#FD562A" 
            strokeWidth={3} 
            fillOpacity={1} 
            fill="url(#colorCash)" 
            animationDuration={1500}
            activeDot={{ r: 6, fill: '#FD562A', stroke: '#120a2e', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
