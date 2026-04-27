import { formatMonths, formatDays, formatCurrencyShort, formatCurrencyFull } from '../utils/formatters.js'

// ─── Runway Meter ─────────────────────────────────────────────────────────────

function RunwayMeter({ runway, status, statusConfig }) {
  const isInfinite = runway === Infinity
  // Cap at 24 months for visual purposes
  const pct = isInfinite ? 100 : Math.min((runway / 24) * 100, 100)
  const milestones = [3, 6, 12, 18, 24]

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
          Runway Meter
        </span>
        <span className={`text-xs font-mono font-semibold ${statusConfig.textColor}`}>
          {isInfinite ? '∞ months' : `${formatMonths(runway)} months`}
        </span>
      </div>

      {/* Bar track */}
      <div className="relative h-2.5 bg-slate-800 rounded-full overflow-hidden">
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
            <div className="w-px h-1.5 bg-slate-700" />
            <span className="text-[9px] text-slate-700 mt-0.5 font-mono">{mo}m</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Cash Consumption Timeline ───────────────────────────────────────────────

function CashTimeline({ cashNum, burnNum, runway }) {
  const isInfinite = runway === Infinity
  if (isInfinite || burnNum === 0 || cashNum === 0) return null

  const checkpoints = [1, 3, 6, 12].filter((m) => m <= Math.ceil(runway) + 1)

  return (
    <div>
      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-3">
        Cash Remaining Over Time
      </p>
      <div className="space-y-2.5">
        {checkpoints.map((month) => {
          const remaining = Math.max(0, cashNum - burnNum * month)
          const pct = (remaining / cashNum) * 100
          const isGone = remaining === 0

          return (
            <div key={month} className="flex items-center gap-3">
              <span className="text-[10px] text-slate-600 font-mono w-12 shrink-0">
                Mo {month}
              </span>
              <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isGone
                      ? 'bg-slate-700'
                      : pct > 50
                      ? 'bg-slate-400'
                      : pct > 20
                      ? 'bg-amber-500/60'
                      : 'bg-red-500/60'
                  }`}
                  style={{ width: isGone ? '1%' : `${pct}%` }}
                />
              </div>
              <span
                className={`text-[10px] font-mono w-16 text-right shrink-0 ${
                  isGone ? 'text-red-500' : 'text-slate-400'
                }`}
              >
                {isGone ? '— gone —' : formatCurrencyShort(remaining)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Result Card (main export) ───────────────────────────────────────────────

export default function ResultCard({ runway, status, statusConfig, cashNum, burnNum, advice }) {
  const isInfinite = runway === Infinity
  const runwayMonths = formatMonths(runway)
  const runwayDays = formatDays(runway)

  // Annual burn figure
  const annualBurn = burnNum * 12

  // Months label for urgency
  const urgencyLabel =
    status === 'danger'
      ? 'Act immediately'
      : status === 'warning'
      ? 'Plan your next move'
      : 'You\'re in good shape'

  return (
    <div
      className={`relative bg-slate-900 rounded-2xl border p-6 sm:p-10 mb-6 overflow-hidden transition-all duration-500 ${statusConfig.borderColor} ${statusConfig.glowClass}`}
    >
      {/* Status top border shimmer */}
      <div
        aria-hidden="true"
        className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent ${
          status === 'safe'
            ? 'via-emerald-500/70'
            : status === 'warning'
            ? 'via-amber-500/70'
            : 'via-red-500/70'
        } to-transparent`}
      />

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

          <p className="text-slate-400 text-sm font-medium mb-2 leading-none">
            {isInfinite ? 'Infinite Runway' : 'Months of Runway'}
          </p>

          {!isInfinite && (
            <p className="text-slate-600 text-xs font-mono mb-4">
              ≈ {runwayDays} days until zero
            </p>
          )}

          {/* Urgency line */}
          <div
            className={`text-xs font-semibold tracking-wide uppercase ${statusConfig.textColor} opacity-70`}
          >
            {urgencyLabel}
          </div>

          {/* Status description */}
          <p className="text-slate-500 text-xs mt-2 max-w-[180px] leading-relaxed">
            {statusConfig.description}
          </p>
        </div>

        {/* ── Right: Metrics + Meter + Timeline ──────────────────── */}
        <div className="space-y-7">
          {/* Key metric chips */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Cash on Hand', value: formatCurrencyShort(cashNum), icon: '💵' },
              { label: 'Monthly Burn', value: formatCurrencyShort(burnNum), icon: '🔥' },
              { label: 'Annual Burn', value: formatCurrencyShort(annualBurn), icon: '📅' },
            ].map(({ label, value, icon }) => (
              <div
                key={label}
                className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-3 text-center"
              >
                <div className="text-base mb-1">{icon}</div>
                <div className="font-mono font-semibold text-white text-sm">{value}</div>
                <div className="text-[10px] text-slate-600 mt-0.5 leading-tight">{label}</div>
              </div>
            ))}
          </div>

          {/* Runway meter */}
          <RunwayMeter runway={runway} status={status} statusConfig={statusConfig} />

          {/* Cash timeline breakdown */}
          <CashTimeline cashNum={cashNum} burnNum={burnNum} runway={runway} />
        </div>
      </div>

      {/* ── Advice section ────────────────────────────────────────── */}
      {advice && advice.length > 0 && (
        <div className="mt-8 pt-8 border-t border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-base">💡</span>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Strategic Advice for Your Situation
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {advice.map((tip, i) => (
              <div
                key={i}
                className={`flex items-start gap-2.5 p-3.5 rounded-xl border ${statusConfig.bgColor} ${statusConfig.borderColor}`}
              >
                <span className={`text-xs ${statusConfig.textColor} mt-0.5 shrink-0 font-bold`}>
                  →
                </span>
                <span className="text-xs text-slate-300 leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Burn rate insight footer ──────────────────────────────── */}
      {burnNum > 0 && !isInfinite && (
        <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Weekly Burn', value: formatCurrencyShort(burnNum / 4.33) },
            { label: 'Daily Burn', value: formatCurrencyShort(burnNum / 30.44) },
            { label: 'Cost Per Day', value: formatCurrencyFull(burnNum / 30.44) },
            {
              label: 'Burn Ratio',
              value:
                cashNum > 0
                  ? `${((burnNum / cashNum) * 100).toFixed(1)}%/mo`
                  : 'N/A',
            },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="font-mono text-sm text-slate-300 font-medium">{value}</div>
              <div className="text-[10px] text-slate-600 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
