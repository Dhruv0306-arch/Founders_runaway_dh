import { Lightbulb, ChevronRight, BarChart, Target } from 'lucide-react'
import { formatMonths, formatCurrencyShort } from '../utils/formatters.js'
import { getReductionTips, getStatusConfig } from '../utils/calculations.js'

// ─── Individual scenario row ─────────────────────────────────────────────────

function ScenarioRow({ scenario, baseRunway, currency }) {
  const { reduction, newBurn, newRunway, extraMonths, config } = scenario
  const isInfinite = newRunway === Infinity

  const basePct = Math.min((baseRunway / 24) * 100, 100)
  const newPct = isInfinite ? 100 : Math.min((newRunway / 24) * 100, 100)
  
  const tips = getReductionTips(reduction)

  return (
    <div
      className="p-4 sm:p-5 rounded-xl border border-white/5 bg-[#0a0514]/50 transition-all duration-200 hover:border-white/10"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        {/* Left: badge + description */}
        <div className="flex items-center gap-3">
          <div
            className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border border-white/5 bg-[#120a2e]`}
          >
            <span className={`font-bebas text-lg ${config.textColor}`}>-{reduction}%</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-tight">
              Reduce burn to{' '}
              <span className={config.textColor}>{formatCurrencyShort(newBurn, currency)}/mo</span>
            </p>
            <p className="text-xs text-ecell-muted/80 mt-0.5">
              Save {formatCurrencyShort(scenario.burnNum - newBurn, currency)}/mo ·{' '}
              <span className={config.textColor}>{config.label}</span>
            </p>
          </div>
        </div>

        {/* Right: new runway */}
        <div className="text-right shrink-0">
          <div className={`font-mono font-bold text-lg ${config.textColor}`}>
            {isInfinite ? '∞' : formatMonths(newRunway)}
            <span className="text-xs font-normal text-ecell-muted/80 ml-1">mo</span>
          </div>
          <div className="text-[11px] text-ecell-muted/80 mt-0.5">
            +{isInfinite ? '∞' : formatMonths(extraMonths)} mo gained
          </div>
        </div>
      </div>

      {/* Comparison bars */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-ecell-muted/60 w-14 shrink-0 text-right font-mono">
            Current
          </span>
          <div className="flex-1 h-1.5 bg-ecell-purple/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-ecell-purple/40 rounded-full"
              style={{ width: `${basePct}%` }}
            />
          </div>
          <span className="text-[10px] text-ecell-muted/60 font-mono w-12 shrink-0">
            {formatMonths(baseRunway)}m
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-ecell-muted/80 w-14 shrink-0 text-right font-mono">
            Reduced
          </span>
          <div className="flex-1 h-1.5 bg-ecell-purple/20 rounded-full overflow-hidden">
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

      {/* Nested Cost-Cutting Tips */}
      {tips.length > 0 && (
        <div className="mt-5 pt-4 border-t border-white/5">
          <div className="flex items-center gap-1.5 mb-3">
            <Lightbulb className="w-3.5 h-3.5 text-ecell-muted/60" />
            <span className={`text-[10px] font-bold tracking-widest uppercase ${config.textColor}`}>
              {reduction}% Optimization Ideas
            </span>
          </div>
          <ul className="space-y-2 pl-1">
            {tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <ChevronRight className={`w-3.5 h-3.5 mt-0.5 shrink-0 opacity-70 ${config.textColor}`} />
                <span className="text-xs text-ecell-muted/80 leading-snug">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ─── Scenario Card (main export) ─────────────────────────────────────────────

export default function ScenarioCard({ scenarios, baseRunway, cashNum, burnNum, revenueNum = 0, currency, status }) {
  // Attach burnNum to each scenario for the savings calculation
  const enriched = scenarios.map((s) => ({ ...s, burnNum }))

  return (
    <div className="relative bg-[#120a2e]/60 rounded-2xl border border-white/5 p-6 sm:p-10 mb-6 overflow-hidden">

      {/* Header */}
      <div className="flex items-start gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
          <BarChart className="w-4 h-4 text-ecell-lavender" />
        </div>
        <div>
          <h3 className="font-bebas text-2xl text-white leading-none">
            SCENARIO{' '}
            <span className="text-gradient-purple">ANALYSIS</span>
          </h3>
          <p className="text-xs text-ecell-muted/80 mt-1 leading-relaxed">
            What happens to your runway if you reduce your monthly burn rate?
          </p>
        </div>
      </div>

      {/* Base / current state reference */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0a0514] border border-white/5 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#120a2e] flex items-center justify-center shrink-0">
          <Target className="w-4 h-4 text-ecell-muted/60" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">Current State (Baseline)</p>
          <p className="text-xs text-ecell-muted/80 truncate">
            {formatCurrencyShort(burnNum, currency)}/mo {revenueNum > 0 ? 'gross ' : ''}burn · no changes
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-mono font-bold text-white text-sm">
            {formatMonths(baseRunway)}
            <span className="text-xs font-normal text-ecell-muted/80 ml-1">mo</span>
          </p>
          <p className="text-[10px] text-ecell-muted/60">runway</p>
        </div>
      </div>

      {/* Scenario rows */}
      <div className="space-y-3">
        {enriched.map((scenario) => (
          <ScenarioRow key={scenario.reduction} scenario={scenario} baseRunway={baseRunway} currency={currency} />
        ))}
      </div>

      <p className="text-[10px] text-ecell-muted/60 mt-6 text-center tracking-wide">
        * Assumes cash on hand ({formatCurrencyShort(cashNum, currency)}) and revenue remain constant.
        Scenarios model cost-cutting only.
      </p>
    </div>
  )
}
