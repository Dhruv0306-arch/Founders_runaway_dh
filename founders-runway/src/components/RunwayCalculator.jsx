import { useState, useMemo } from 'react'
import ResultCard from './ResultCard.jsx'
import ScenarioCard from './ScenarioCard.jsx'
import {
  calculateRunway,
  getRunwayStatus,
  getStatusConfig,
  getScenarios,
  getStartupAdvice,
} from '../utils/calculations.js'
import { formatCurrencyFull, parseInputValue } from '../utils/formatters.js'

// ─── Input Field ─────────────────────────────────────────────────────────────

function InputField({ label, icon, value, onChange, onBlur, error, hint, placeholder, suffix }) {
  const [focused, setFocused] = useState(false)

  // Format with commas for display
  const displayValue = (() => {
    if (!value) return ''
    const raw = value.replace(/,/g, '')
    const [intPart, decPart] = raw.split('.')
    const intFormatted = intPart ? Number(intPart).toLocaleString('en-US') : ''
    return decPart !== undefined ? `${intFormatted}.${decPart}` : intFormatted
  })()

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2.5">
        {icon} {label}
      </label>
      <div
        className={`relative flex items-center rounded-xl border-2 transition-all duration-200 ${
          error
            ? 'border-red-500/50 bg-red-500/5 ring-2 ring-red-500/10'
            : focused
            ? 'border-cyan-500/50 bg-slate-800 ring-2 ring-cyan-500/10'
            : 'border-slate-700/60 bg-slate-800/40 hover:border-slate-600'
        }`}
      >
        <span className="pl-4 text-slate-500 font-mono text-sm font-medium select-none">$</span>
        <input
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={(e) => {
            // Only allow digits and one decimal point
            const raw = e.target.value.replace(/[^0-9.]/g, '')
            // Prevent multiple dots
            const dots = (raw.match(/\./g) || []).length
            if (dots <= 1) onChange(raw)
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false)
            onBlur && onBlur()
          }}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-3 py-4 text-white font-mono text-lg outline-none placeholder:text-slate-700"
          aria-label={label}
          aria-invalid={!!error}
        />
        {suffix && (
          <span className="pr-4 text-slate-600 text-xs font-medium font-mono select-none">
            {suffix}
          </span>
        )}
      </div>

      {/* Error */}
      {error && (
        <p role="alert" className="flex items-center gap-1.5 text-red-400 text-xs mt-2 font-medium">
          <span>⚠</span>
          {error}
        </p>
      )}

      {/* Formatted value hint */}
      {!error && hint && (
        <p className="text-slate-600 text-xs mt-2 font-mono">{hint}</p>
      )}
    </div>
  )
}

// ─── Main Calculator ──────────────────────────────────────────────────────────

export default function RunwayCalculator() {
  const [cashRaw, setCashRaw] = useState('')
  const [burnRaw, setBurnRaw] = useState('')
  const [cashError, setCashError] = useState('')
  const [burnError, setBurnError] = useState('')

  // Parse to numbers
  const cashNum = useMemo(() => parseInputValue(cashRaw), [cashRaw])
  const burnNum = useMemo(() => parseInputValue(burnRaw), [burnRaw])

  // Determine whether we have enough input to calculate
  const hasInput = cashRaw.trim() !== '' && burnRaw.trim() !== ''
  const isValid = hasInput && !cashError && !burnError

  // Validate individual fields on blur
  function validateCash() {
    if (cashRaw.trim() === '') {
      setCashError('Please enter your total cash on hand.')
      return false
    }
    if (cashNum < 0) {
      setCashError('Cash on hand cannot be negative.')
      return false
    }
    setCashError('')
    return true
  }

  function validateBurn() {
    if (burnRaw.trim() === '') {
      setBurnError('Please enter your monthly burn rate.')
      return false
    }
    if (burnNum < 0) {
      setBurnError('Burn rate cannot be negative.')
      return false
    }
    setBurnError('')
    return true
  }

  // Core calculations (memoized)
  const runway = useMemo(() => {
    if (!isValid) return null
    return calculateRunway(cashNum, burnNum)
  }, [cashNum, burnNum, isValid])

  const status = useMemo(() => (runway !== null ? getRunwayStatus(runway) : null), [runway])
  const statusConfig = useMemo(() => (status ? getStatusConfig(status) : null), [status])
  const advice = useMemo(() => (status ? getStartupAdvice(status) : null), [status])
  const scenarios = useMemo(() => {
    if (!isValid || burnNum <= 0) return null
    return getScenarios(cashNum, burnNum)
  }, [cashNum, burnNum, isValid])

  // Edge case flags
  const isZeroBurn = isValid && burnNum === 0 && cashNum > 0
  const isZeroCash = isValid && cashNum === 0

  return (
    <section id="calculator" className="relative py-24 px-4 sm:px-6">
      {/* Faint section separator */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent to-slate-800"
      />

      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <h2 className="font-bebas text-5xl sm:text-6xl text-white mb-3 leading-none">
            CALCULATE YOUR{' '}
            <span className="text-gradient-cyan">RUNWAY</span>
          </h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
            Enter your current financial position and get an instant diagnosis with
            actionable insights.
          </p>
        </div>

        {/* ── Input Card ──────────────────────────────────────────────── */}
        <div className="relative bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-10 mb-6 overflow-hidden">
          {/* Top shimmer line */}
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <InputField
              label="Total Cash on Hand"
              icon="💰"
              value={cashRaw}
              onChange={(v) => {
                setCashRaw(v)
                if (cashError) setCashError('')
              }}
              onBlur={validateCash}
              error={cashError}
              placeholder="500,000"
              hint={cashNum > 0 ? `= ${formatCurrencyFull(cashNum)}` : ''}
            />

            <InputField
              label="Monthly Burn Rate"
              icon="🔥"
              value={burnRaw}
              onChange={(v) => {
                setBurnRaw(v)
                if (burnError) setBurnError('')
              }}
              onBlur={validateBurn}
              error={burnError}
              placeholder="50,000"
              suffix="/mo"
              hint={burnNum > 0 ? `= ${formatCurrencyFull(burnNum)} / month` : ''}
            />
          </div>

          {/* ── Edge case banners ─────────────────────────── */}
          {isZeroBurn && (
            <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
              <span className="text-lg shrink-0 mt-0.5">✨</span>
              <div>
                <p className="text-emerald-400 text-sm font-semibold">Zero Burn Rate Detected</p>
                <p className="text-emerald-500/70 text-xs mt-0.5 leading-relaxed">
                  Your company has zero monthly expenditure — either pre-revenue with no costs or
                  fully profitable. Your runway is theoretically{' '}
                  <strong className="text-emerald-400">infinite</strong>.
                </p>
              </div>
            </div>
          )}

          {isZeroCash && (
            <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/25">
              <span className="text-lg shrink-0 mt-0.5">🚨</span>
              <div>
                <p className="text-red-400 text-sm font-semibold">Zero Cash Detected</p>
                <p className="text-red-400/70 text-xs mt-0.5 leading-relaxed">
                  You have no cash remaining. Runway is zero days. Immediate action is required —
                  stop all expenditure and explore emergency funding now.
                </p>
              </div>
            </div>
          )}

          {/* ── Formula reminder ─────────────────────────── */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-2 font-mono">
              <span className="text-slate-700">Runway (months)</span>
              <span className="text-slate-700">=</span>
              <span className="text-slate-500">Total Cash</span>
              <span className="text-slate-700">÷</span>
              <span className="text-slate-500">Monthly Burn</span>
            </div>
            <div className="flex items-center gap-4 font-mono">
              <span className="text-emerald-600">🟢 ≥6 mo = Safe</span>
              <span className="text-amber-600">🟡 3–6 = Warning</span>
              <span className="text-red-600">🔴 &lt;3 = Danger</span>
            </div>
          </div>
        </div>

        {/* ── Results ─────────────────────────────────────────────────── */}
        {runway !== null && statusConfig && (
          <div className="animate-slide-in">
            <ResultCard
              runway={runway}
              status={status}
              statusConfig={statusConfig}
              cashNum={cashNum}
              burnNum={burnNum}
              advice={advice}
            />
            {scenarios && (
              <ScenarioCard
                scenarios={scenarios}
                baseRunway={runway}
                cashNum={cashNum}
                burnNum={burnNum}
              />
            )}
          </div>
        )}
      </div>
    </section>
  )
}
