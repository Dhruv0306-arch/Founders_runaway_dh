import { formatMonths, formatCurrencyShort } from '../utils/formatters.js'

// ─── Individual scenario row ─────────────────────────────────────────────────

function ScenarioRow({ scenario, baseRunway }) {
  const { reduction, newBurn, newRunway, extraMonths, config } = scenario
  const isInfinite = newRunway === Infinity

  const basePct = Math.min((baseRunway / 24) * 100, 100)
  const newPct = isInfinite ? 100 : Math.min((newRunway / 24) * 100, 100)

  return (
    <div
      className={`p-4 sm:p-5 rounded-xl border transition-all duration-200 ${config.bgColor} ${config.borderColor}`}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        {/* Left: badge + description */}
        <div className="flex items-center gap-3">
          <div
            className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border ${config.bgColor} ${config.borderColor}`}
          >
            <span className={`font-bebas text-lg ${config.textColor}`}>-{reduction}%</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-tight">
              Reduce burn to{' '}
              <span className={config.textColor}>{formatCurrencyShort(newBurn)}/mo</span>
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Save {formatCurrencyShort(scenario.burnNum - newBurn)}/mo ·{' '}
              <span className={config.textColor}>{config.label}</span>
            </p>
          </div>
        </div>

        {/* Right: new runway */}
        <div className="text-right shrink-0">
          <div className={`font-mono font-bold text-lg ${config.textColor}`}>
            {isInfinite ? '∞' : formatMonths(newRunway)}
            <span className="text-xs font-normal text-slate-500 ml-1">mo</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            +{isInfinite ? '∞' : formatMonths(extraMonths)} mo gained
          </div>
        </div>
      </div>

      {/* Comparison bars */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-700 w-14 shrink-0 text-right font-mono">
            Current
          </span>
          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-600 rounded-full"
              style={{ width: `${basePct}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-700 font-mono w-12 shrink-0">
            {formatMonths(baseRunway)}m
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 w-14 shrink-0 text-right font-mono">
            Reduced
          </span>
          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${config.barColor} rounded-full transition-all duration-700`}
              style={{ width: `${newPct}%` }}
            />
          </div>
          <span className={`text-[10px] font-mono ${config.textColor} w-12 shrink-0`}>
            {isInfinite ? '∞' : `${formatMonths(newRunway)}m`}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Scenario Card (main export) ─────────────────────────────────────────────

export default function ScenarioCard({ scenarios, baseRunway, cashNum, burnNum }) {
  // Attach burnNum to each scenario for the savings calculation
  const enriched = scenarios.map((s) => ({ ...s, burnNum }))

  return (
    <div className="relative bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-10 mb-6 overflow-hidden">
      {/* Top shimmer — purple for visual distinction */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-violet-500/40 to-transparent"
      />

      {/* Header */}
      <div className="flex items-start gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
          <span className="text-base">📊</span>
        </div>
        <div>
          <h3 className="font-bebas text-2xl text-white leading-none">
            SCENARIO{' '}
            <span className="text-gradient-purple">ANALYSIS</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            What happens to your runway if you reduce your monthly burn rate?
          </p>
        </div>
      </div>

      {/* Base / current state reference */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/40 mb-4">
        <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center shrink-0">
          <span className="text-sm">📌</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">Current State (Baseline)</p>
          <p className="text-xs text-slate-500 truncate">
            {formatCurrencyShort(burnNum)}/mo burn · no changes
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-mono font-bold text-white text-sm">
            {formatMonths(baseRunway)}
            <span className="text-xs font-normal text-slate-500 ml-1">mo</span>
          </p>
          <p className="text-[10px] text-slate-600">runway</p>
        </div>
      </div>

      {/* Scenario rows */}
      <div className="space-y-3">
        {enriched.map((scenario) => (
          <ScenarioRow key={scenario.reduction} scenario={scenario} baseRunway={baseRunway} />
        ))}
      </div>

      <p className="text-[10px] text-slate-700 mt-5 text-center tracking-wide">
        * Assumes cash on hand ({formatCurrencyShort(cashNum)}) and revenue remain constant.
        Scenarios model cost-cutting only.
      </p>
    </div>
  )
}
