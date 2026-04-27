import { useState, useMemo, useEffect, useRef } from 'react'
import ResultCard from './ResultCard.jsx'
import ScenarioCard from './ScenarioCard.jsx'
import FundingGoalCard from './FundingGoalCard.jsx'
import {
  calculateRunway,
  getRunwayStatus,
  getStatusConfig,
  getScenarios,
  getStartupAdvice,
} from '../utils/calculations.js'
import { formatCurrencyFull, parseInputValue } from '../utils/formatters.js'

// ─── Input Field ─────────────────────────────────────────────────────────────

function InputField({ label, icon, value, onChange, onBlur, error, hint, placeholder, suffix, currency = '$' }) {
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
      <label className="block text-xs font-semibold text-ecell-muted uppercase tracking-widest mb-2.5">
        {icon} {label}
      </label>
      <div
        className={`relative flex items-center rounded-xl border-2 transition-all duration-200 ${
          error
            ? 'border-red-500/50 bg-red-500/5 ring-2 ring-red-500/10'
            : focused
            ? 'border-ecell-purple/50 bg-ecell-dark ring-2 ring-ecell-purple/10'
            : 'border-ecell-purple/20 bg-ecell-dark/40 hover:border-ecell-purple/40'
        }`}
      >
        <span className="pl-4 text-ecell-lavender font-mono text-sm font-medium select-none">{currency}</span>
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
          className="flex-1 bg-transparent px-3 py-4 text-white font-mono text-lg outline-none placeholder:text-ecell-purple/30"
          aria-label={label}
          aria-invalid={!!error}
        />
        {suffix && (
          <span className="pr-4 text-ecell-lavender/60 text-xs font-medium font-mono select-none">
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
        <p className="text-ecell-lavender/50 text-xs mt-2 font-mono">{hint}</p>
      )}
    </div>
  )
}

const CURRENCIES = [
  { code: 'USD', symbol: '$', flag: '🇺🇸', name: 'US Dollar' },
  { code: 'INR', symbol: '₹', flag: '🇮🇳', name: 'Indian Rupee' },
  { code: 'EUR', symbol: '€', flag: '🇪🇺', name: 'Euro' },
  { code: 'GBP', symbol: '£', flag: '🇬🇧', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', flag: '🇨🇦', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', flag: '🇦🇺', name: 'Australian Dollar' },
  { code: 'SGD', symbol: 'S$', flag: '🇸🇬', name: 'Singapore Dollar' },
  { code: 'JPY', symbol: '¥', flag: '🇯🇵', name: 'Japanese Yen' },
  { code: 'CHF', symbol: 'Fr', flag: '🇨🇭', name: 'Swiss Franc' },
  { code: 'AED', symbol: 'د.إ', flag: '🇦🇪', name: 'UAE Dirham' },
  { code: 'HKD', symbol: 'HK$', flag: '🇭🇰', name: 'Hong Kong Dollar' },
  { code: 'CNY', symbol: '¥', flag: '🇨🇳', name: 'Chinese Yuan' },
]

// ─── Main Calculator ──────────────────────────────────────────────────────────

export default function RunwayCalculator() {
  const [currency, setCurrency] = useState(CURRENCIES[0])
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCurrencyOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const [cashRaw, setCashRaw] = useState('')
  const [burnRaw, setBurnRaw] = useState('')
  const [revenueRaw, setRevenueRaw] = useState('')
  const [cashError, setCashError] = useState('')
  const [burnError, setBurnError] = useState('')
  const [revenueError, setRevenueError] = useState('')

  // Parse to numbers
  const cashNum = useMemo(() => parseInputValue(cashRaw), [cashRaw])
  const burnNum = useMemo(() => parseInputValue(burnRaw), [burnRaw])
  const revenueNum = useMemo(() => parseInputValue(revenueRaw), [revenueRaw])

  // Determine whether we have enough input to calculate
  const hasInput = cashRaw.trim() !== '' && burnRaw.trim() !== ''
  const isValid = hasInput && !cashError && !burnError && !revenueError

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

  function validateRevenue() {
    if (revenueRaw.trim() !== '' && revenueNum < 0) {
      setRevenueError('Revenue cannot be negative.')
      return false
    }
    setRevenueError('')
    return true
  }

  // Core calculations (memoized)
  const runway = useMemo(() => {
    if (!isValid) return null
    return calculateRunway(cashNum, burnNum, revenueNum)
  }, [cashNum, burnNum, revenueNum, isValid])

  const status = useMemo(() => (runway !== null ? getRunwayStatus(runway) : null), [runway])
  const statusConfig = useMemo(() => (status ? getStatusConfig(status) : null), [status])
  const advice = useMemo(() => (status ? getStartupAdvice(status) : null), [status])
  const scenarios = useMemo(() => {
    if (!isValid || burnNum <= 0) return null
    return getScenarios(cashNum, burnNum, revenueNum)
  }, [cashNum, burnNum, revenueNum, isValid])

  // Edge case flags
  const isProfitable = isValid && revenueNum >= burnNum && revenueNum > 0
  const isZeroBurn = isValid && burnNum === 0 && cashNum > 0 && revenueNum === 0
  const isZeroCash = isValid && cashNum === 0

  return (
    <section id="calculator" className="relative py-24 px-4 sm:px-6">
      {/* Faint section separator */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent to-ecell-purple/20"
      />

      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <h2 className="font-bebas text-5xl sm:text-6xl text-white mb-3 leading-none">
            CALCULATE YOUR{' '}
            <span className="text-gradient-cyan">RUNWAY</span>
          </h2>
          <p className="text-ecell-muted/60 text-sm max-w-md mx-auto leading-relaxed">
            Enter your current financial position and get an instant diagnosis with
            actionable insights.
          </p>
        </div>

        {/* ── Currency Dropdown ───────────────────────────────────────────── */}
        <div className="flex justify-center mb-8 relative z-50">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
              className="flex items-center gap-2 bg-ecell-dark/80 px-4 py-2 rounded-xl border border-ecell-purple/30 shadow-lg text-sm font-semibold hover:bg-ecell-purple/10 transition-colors"
            >
              <span>{currency.flag}</span>
              <span className="text-white">{currency.code}</span>
              <span className="text-ecell-muted/60 mx-1">—</span>
              <span className="text-ecell-orange font-bold">{currency.symbol}</span>
              <svg 
                className={`w-4 h-4 ml-2 text-ecell-muted transition-transform duration-200 ${isCurrencyOpen ? 'rotate-180' : ''}`} 
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isCurrencyOpen && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-56 bg-ecell-dark/95 backdrop-blur-md border border-ecell-purple/30 rounded-xl shadow-2xl overflow-hidden animate-fade-up z-50">
                <div className="max-h-64 overflow-y-auto custom-scrollbar">
                  {CURRENCIES.map((cur) => (
                    <button
                      key={cur.code}
                      onClick={() => {
                        setCurrency(cur)
                        setIsCurrencyOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-ecell-purple/20 transition-colors ${
                        currency.code === cur.code ? 'bg-ecell-purple/20' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{cur.flag}</span>
                        <div className="flex flex-col items-start">
                          <span className={`font-semibold ${currency.code === cur.code ? 'text-ecell-orange' : 'text-white'}`}>{cur.code}</span>
                          <span className="text-[10px] text-ecell-muted/60">{cur.name}</span>
                        </div>
                      </div>
                      <span className={`font-bold font-mono ${currency.code === cur.code ? 'text-ecell-orange' : 'text-ecell-muted/40'}`}>
                        {cur.symbol}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Input Card ──────────────────────────────────────────────── */}
        <div className="relative bg-ecell-dark rounded-2xl border border-ecell-purple/15 p-6 sm:p-10 mb-6 overflow-hidden">
          {/* Top shimmer line */}
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ecell-purple/40 to-transparent"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
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
              currency={currency.symbol}
              placeholder="500,000"
              hint={cashNum > 0 ? `= ${formatCurrencyFull(cashNum, currency.symbol)}` : ''}
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
              currency={currency.symbol}
              placeholder="50,000"
              suffix="/mo"
              hint={burnNum > 0 ? `= ${formatCurrencyFull(burnNum, currency.symbol)} / month` : ''}
            />
            <InputField
              label="Monthly Revenue"
              icon="💸"
              value={revenueRaw}
              onChange={(v) => {
                setRevenueRaw(v)
                if (revenueError) setRevenueError('')
              }}
              onBlur={validateRevenue}
              error={revenueError}
              currency={currency.symbol}
              placeholder="0 (Optional)"
              suffix="/mo"
              hint={revenueNum > 0 ? `= ${formatCurrencyFull(revenueNum, currency.symbol)} / month` : ''}
            />
          </div>

          {/* ── Edge case banners ─────────────────────────── */}
          {isProfitable && (
            <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-ecell-purple/20 border border-ecell-purple/40">
              <span className="text-lg shrink-0 mt-0.5">🚀</span>
              <div>
                <p className="text-ecell-lavender text-sm font-semibold">You are Profitable!</p>
                <p className="text-ecell-muted/80 text-xs mt-0.5 leading-relaxed">
                  Your monthly revenue covers or exceeds your monthly burn. Your runway is theoretically{' '}
                  <strong className="text-ecell-lavender">infinite</strong>. Keep growing!
                </p>
              </div>
            </div>
          )}

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
          <div className="mt-8 pt-6 border-t border-ecell-purple/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ecell-muted/40">
            <div className="flex items-center gap-2 font-mono flex-wrap">
              <span className="text-ecell-muted/30">Runway</span>
              <span className="text-ecell-muted/30">=</span>
              <span className="text-ecell-muted/50">Total Cash</span>
              <span className="text-ecell-muted/30">÷</span>
              <span className="text-ecell-muted/50">(Burn - Revenue)</span>
            </div>
            <div className="flex items-center gap-4 font-mono">
              <span className="text-emerald-600">🟢 ≥6 mo = Safe</span>
              <span className="text-amber-600">🟡 3-6 = Warning</span>
              <span className="text-red-600">🔴 &lt;3 = Danger</span>
            </div>
          </div>

          {/* ── Funding Goal Calculator ─────────────────────── */}
          {isValid && burnNum > 0 && (
            <FundingGoalCard
              cashNum={cashNum}
              burnNum={burnNum}
              revenueNum={revenueNum}
              currency={currency.symbol}
            />
          )}
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
              revenueNum={revenueNum}
              advice={advice}
              currency={currency.symbol}
            />
            {scenarios && (
              <ScenarioCard
                scenarios={scenarios}
                baseRunway={runway}
                cashNum={cashNum}
                burnNum={burnNum}
                revenueNum={revenueNum}
                currency={currency.symbol}
                status={status}
              />
            )}
          </div>
        )}
      </div>
    </section>
  )
}
