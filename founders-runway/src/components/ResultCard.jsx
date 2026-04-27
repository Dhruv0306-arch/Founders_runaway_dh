import { useState, useEffect, useRef } from 'react'
import { Wallet, Flame, TrendingUp, LineChart, Lightbulb, ChevronRight, CalendarDays, CalendarClock } from 'lucide-react'
import { formatMonths, formatDays, formatCurrencyShort, formatCurrencyFull } from '../utils/formatters.js'
import { getRunwayEndDate } from '../utils/calculations.js'
import RunwayChart from './RunwayChart.jsx'

// ─── Animated Count-Up Hook ──────────────────────────────────────────────────

function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0)
  const prevTarget = useRef(0)

  useEffect(() => {
    if (target === null || target === undefined || target === Infinity) {
      setValue(target)
      return
    }

    const start = prevTarget.current
    const diff = target - start
    const startTime = performance.now()

    function tick(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(start + diff * eased)

      if (progress < 1) {
        requestAnimationFrame(tick)
      } else {
        setValue(target)
        prevTarget.current = target
      }
    }

    requestAnimationFrame(tick)
    return () => { prevTarget.current = target }
  }, [target, duration])

  return value
}

// ─── Runway Meter ─────────────────────────────────────────────────────────────

function RunwayMeter({ runway, status, statusConfig }) {
  const isInfinite = runway === Infinity
  // Cap at 24 months for visual purposes
  const pct = isInfinite ? 100 : Math.min((runway / 24) * 100, 100)
  const milestones = [3, 6, 12, 18, 24]

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-ecell-muted/80 font-medium uppercase tracking-wider">
          Runway Meter
        </span>
        <span className={`text-xs font-mono font-semibold ${statusConfig.textColor}`}>
          {isInfinite ? '∞ months' : `${formatMonths(runway)} months`}
        </span>
      </div>

      {/* Bar track */}
      <div className="relative h-2.5 bg-ecell-purple/20 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full animate-fill-bar transition-all duration-1000 ease-out ${statusConfig.barColor}`}
          style={{ width: `${pct}%` }}
        />
        {/* Danger zone stripe at 0–25% (0–6 months) */}
        <div className="absolute left-0 top-0 h-full w-[25%] bg-gradient-to-r from-red-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Milestone labels */}
      <div className="relative h-5 mt-1">
        {milestones.map((mo) => (
          <div
            key={mo}
            className="absolute flex flex-col items-center"
            style={{ left: `${(mo / 24) * 100}%`, transform: 'translateX(-50%)' }}
          >
            <div className="w-px h-1.5 bg-ecell-purple/40" />
            <span className="text-[9px] text-ecell-muted/60 mt-0.5 font-mono">{mo}m</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Cash Consumption Timeline ───────────────────────────────────────────────

function CashTimeline({ cashNum, burnNum, runway, currency }) {
  const isInfinite = runway === Infinity
  if (isInfinite || burnNum === 0 || cashNum === 0) return null

  const checkpoints = [1, 3, 6, 12].filter((m) => m <= Math.ceil(runway) + 1)

  return (
    <div>
      <p className="text-xs text-ecell-muted/80 font-medium uppercase tracking-wider mb-3">
        Cash Remaining Over Time
      </p>
      <div className="space-y-2.5">
        {checkpoints.map((month) => {
          const remaining = Math.max(0, cashNum - burnNum * month)
          const pct = (remaining / cashNum) * 100
          const isGone = remaining === 0

          return (
            <div key={month} className="flex items-center gap-3">
              <span className="text-[10px] text-ecell-muted/60 font-mono w-12 shrink-0">
                Mo {month}
              </span>
              <div className="flex-1 h-1.5 bg-ecell-purple/20 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isGone
                      ? 'bg-ecell-purple/30'
                      : pct > 50
                      ? 'bg-ecell-muted'
                      : pct > 20
                      ? 'bg-amber-500/60'
                      : 'bg-red-500/60'
                  }`}
                  style={{ width: isGone ? '1%' : `${pct}%` }}
                />
              </div>
              <span
                className={`text-[10px] font-mono w-16 text-right shrink-0 ${
                  isGone ? 'text-red-500' : 'text-ecell-muted'
                }`}
              >
                {isGone ? '— gone —' : formatCurrencyShort(remaining, currency)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Result Card (main export) ───────────────────────────────────────────────

export default function ResultCard({ runway, status, statusConfig, cashNum, burnNum, revenueNum = 0, advice, currency }) {
  const isInfinite = runway === Infinity
  const animatedRunway = useCountUp(isInfinite ? null : runway)
  const runwayMonths = isInfinite ? '∞' : formatMonths(animatedRunway)
  const runwayDays = formatDays(runway)
  const deadlineDate = getRunwayEndDate(runway)

  const netBurn = Math.max(0, burnNum - revenueNum)
  const annualBurn = netBurn * 12

  // Months label for urgency
  const urgencyLabel =
    status === 'danger'
      ? 'Act immediately'
      : status === 'warning'
      ? 'Plan your next move'
      : 'You\'re in good shape'

  return (
    <div className="relative bg-[#120a2e]/60 rounded-2xl border border-white/5 p-6 sm:p-10 mb-6 overflow-hidden">

      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 lg:gap-12">
        {/* ── Left: Big runway number ─────────────────────────────── */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          {/* Status badge */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-5 ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full bg-current ${
                status === 'danger' ? 'animate-danger-pulse' : 'animate-pulse-slow'
              }`}
            />
            {statusConfig.label}
          </div>

          {/* Huge runway display */}
          <div className="relative mb-3">
            <div
              className={`font-bebas leading-none ${statusConfig.textColor} ${
                isInfinite ? 'text-[100px]' : 'text-[100px] sm:text-[120px]'
              }`}
            >
              {isInfinite ? '∞' : runwayMonths}
            </div>
          </div>

          <p className="text-ecell-muted text-sm font-medium mb-2 leading-none">
            {isInfinite ? 'Infinite Runway' : 'Months of Runway'}
          </p>

          {!isInfinite && (
            <p className="text-ecell-muted/60 text-xs font-mono mb-2">
              ≈ {runwayDays} days until zero
            </p>
          )}

          {deadlineDate && (
            <div className="flex items-center gap-1.5 mb-4">
              <CalendarClock className="w-3.5 h-3.5 text-ecell-muted/50" />
              <p className="text-ecell-muted/80 text-xs">
                Cash out by <span className={`font-semibold ${statusConfig.textColor}`}>{deadlineDate}</span>
              </p>
            </div>
          )}

          {/* Urgency line */}
          <div
            className={`text-xs font-semibold tracking-wide uppercase ${statusConfig.textColor} opacity-70`}
          >
            {urgencyLabel}
          </div>

          {/* Status description */}
          <p className="text-ecell-muted/80 text-xs mt-2 max-w-[180px] leading-relaxed">
            {statusConfig.description}
          </p>
        </div>

        {/* ── Right: Metrics + Meter + Timeline ──────────────────── */}
        <div className="space-y-7">
          {/* Key metric chips */}
          <div className={`grid ${revenueNum > 0 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'} gap-3`}>
            {(revenueNum > 0
              ? [
                  { label: 'Cash on Hand', value: formatCurrencyShort(cashNum, currency), icon: <Wallet className="w-4 h-4 text-emerald-400" /> },
                  { label: 'Gross Burn', value: formatCurrencyShort(burnNum, currency), icon: <Flame className="w-4 h-4 text-ecell-orange" /> },
                  { label: 'Revenue', value: formatCurrencyShort(revenueNum, currency), icon: <TrendingUp className="w-4 h-4 text-emerald-400" /> },
                  { label: 'Net Burn', value: formatCurrencyShort(netBurn, currency), icon: <LineChart className="w-4 h-4 text-ecell-lavender" /> },
                ]
              : [
                  { label: 'Cash on Hand', value: formatCurrencyShort(cashNum, currency), icon: <Wallet className="w-4 h-4 text-emerald-400" /> },
                  { label: 'Monthly Burn', value: formatCurrencyShort(burnNum, currency), icon: <Flame className="w-4 h-4 text-ecell-orange" /> },
                  { label: 'Annual Burn', value: formatCurrencyShort(annualBurn, currency), icon: <CalendarDays className="w-4 h-4 text-ecell-lavender" /> },
                ]
            ).map(({ label, value, icon }) => (
              <div
                key={label}
                className="bg-ecell-purple/10 border border-ecell-purple/20 rounded-xl p-3 text-center"
              >
                <div className="flex justify-center mb-2">{icon}</div>
                <div className="font-mono font-semibold text-white/90 text-sm">{value}</div>
                <div className="text-[10px] text-ecell-muted/60 mt-1 uppercase tracking-widest leading-tight">{label}</div>
              </div>
            ))}
          </div>

          {/* Runway meter */}
          <RunwayMeter runway={runway} status={status} statusConfig={statusConfig} />

          {/* Runway Chart Visualization */}
          <RunwayChart cashNum={cashNum} burnNum={burnNum} revenueNum={revenueNum} currency={currency} />
        </div>
      </div>

      {/* ── Advice section ────────────────────────────────────────── */}
      {advice && advice.length > 0 && (
        <div className="mt-8 pt-8 border-t border-white/5">
          <div className="flex items-center gap-2 mb-5">
            <Lightbulb className="w-4 h-4 text-ecell-lavender" />
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">
              Strategic Advice
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {advice.map((tip, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-xl bg-[#0a0514] border border-white/5"
              >
                <ChevronRight className={`w-4 h-4 mt-0.5 shrink-0 ${statusConfig.textColor}`} />
                <span className="text-xs text-ecell-muted/80 leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Burn rate insight footer ──────────────────────────────── */}
      {burnNum > 0 && !isInfinite && (
        <div className="mt-6 pt-4 border-t border-ecell-purple/20 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Weekly Net Burn', value: formatCurrencyShort(netBurn / 4.33, currency) },
            { label: 'Daily Net Burn', value: formatCurrencyShort(netBurn / 30.44, currency) },
            { label: 'Net Cost Per Day', value: formatCurrencyFull(netBurn / 30.44, currency) },
            {
              label: 'Burn Ratio',
              value:
                cashNum > 0
                  ? `${((netBurn / cashNum) * 100).toFixed(1)}%/mo`
                  : 'N/A',
            },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="font-mono text-sm text-white font-medium">{value}</div>
              <div className="text-[10px] text-ecell-muted/60 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
