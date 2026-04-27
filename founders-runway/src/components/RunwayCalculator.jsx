import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Wallet, Flame, TrendingUp, ChevronDown, CheckCircle2, AlertTriangle, AlertCircle, Calculator, Zap, RotateCcw } from 'lucide-react'
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
      <label className="flex items-center gap-2 text-xs font-semibold text-ecell-muted uppercase tracking-widest mb-2.5">
        {icon} {label}
      </label>
      <div
        className={`relative flex items-center rounded-xl border transition-all duration-200 bg-[#0a0514] ${
          error
            ? 'border-red-500/50 ring-1 ring-red-500/20'
            : focused
            ? 'border-ecell-purple/50 ring-1 ring-ecell-purple/20'
            : 'border-white/5 hover:border-white/20'
        }`}
      >
        <span className="pl-4 text-ecell-lavender/70 font-mono text-sm font-medium select-none">{currency}</span>
        <input
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9.]/g, '')
            const dots = (raw.match(/\./g) || []).length
            if (dots <= 1) onChange(raw)
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false)
            onBlur && onBlur()
          }}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-3 py-3 text-white font-mono text-base outline-none placeholder:text-ecell-muted/30"
          aria-label={label}
          aria-invalid={!!error}
        />
        {suffix && (
          <span className="pr-4 text-ecell-muted/50 text-xs font-medium font-mono select-none">
            {suffix}
          </span>
        )}
      </div>

      {error && (
        <p role="alert" className="flex items-center gap-1.5 text-red-400 text-[11px] mt-2 font-medium">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}

      {!error && hint && (
        <p className="text-ecell-muted/60 text-[11px] mt-2 font-mono">{hint}</p>
      )}
    </div>
  )
}

const CURRENCIES = [
  { code: 'USD', symbol: '$', flag: 'US', name: 'US Dollar' },
  { code: 'INR', symbol: '₹', flag: 'IN', name: 'Indian Rupee' },
  { code: 'EUR', symbol: '€', flag: 'EU', name: 'Euro' },
  { code: 'GBP', symbol: '£', flag: 'GB', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', flag: 'CA', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', flag: 'AU', name: 'Australian Dollar' },
  { code: 'SGD', symbol: 'S$', flag: 'SG', name: 'Singapore Dollar' },
  { code: 'JPY', symbol: '¥', flag: 'JP', name: 'Japanese Yen' },
  { code: 'CHF', symbol: 'Fr', flag: 'CH', name: 'Swiss Franc' },
  { code: 'AED', symbol: 'د.إ', flag: 'AE', name: 'UAE Dirham' },
  { code: 'HKD', symbol: 'HK$', flag: 'HK', name: 'Hong Kong Dollar' },
  { code: 'CNY', symbol: '¥', flag: 'CN', name: 'Chinese Yuan' },
]

const PRESETS = [
  { label: 'Pre-Seed', cash: '250000', burn: '40000', revenue: '0', desc: '$250K raised, $40K/mo burn', explanation: 'Early startup stage where founders are validating the idea and building the first version of the product.' },
  { label: 'Series A', cash: '3000000', burn: '200000', revenue: '50000', desc: '$3M raised, $200K burn, $50K rev', explanation: 'Growth stage where the startup has traction and is raising money to scale product, team, and revenue.' },
  { label: 'Bootstrapped', cash: '80000', burn: '15000', revenue: '10000', desc: '$80K saved, $15K burn, $10K rev', explanation: 'A startup funded without outside investors, usually using founder money, revenue, or personal savings.' },
]

// ─── Main Calculator ──────────────────────────────────────────────────────────

export default function RunwayCalculator() {
  const [currency, setCurrency] = useState(CURRENCIES[0])
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false)
  const dropdownRef = useRef(null)
  const resultsRef = useRef(null)
  const [hoveredPreset, setHoveredPreset] = useState(null)

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

  function applyPreset(preset) {
    setCashRaw(preset.cash)
    setBurnRaw(preset.burn)
    setRevenueRaw(preset.revenue)
    setCashError('')
    setBurnError('')
    setRevenueError('')
  }

  function resetAll() {
    setCashRaw('')
    setBurnRaw('')
    setRevenueRaw('')
    setCashError('')
    setBurnError('')
    setRevenueError('')
  }

  const cashNum = useMemo(() => parseInputValue(cashRaw), [cashRaw])
  const burnNum = useMemo(() => parseInputValue(burnRaw), [burnRaw])
  const revenueNum = useMemo(() => parseInputValue(revenueRaw), [revenueRaw])

  const hasInput = cashRaw.trim() !== '' && burnRaw.trim() !== ''
  const isValid = hasInput && !cashError && !burnError && !revenueError

  function validateCash() {
    if (cashRaw.trim() === '') {
      setCashError('Required')
      return false
    }
    if (cashNum < 0) {
      setCashError('Cannot be negative')
      return false
    }
    setCashError('')
    return true
  }

  function validateBurn() {
    if (burnRaw.trim() === '') {
      setBurnError('Required')
      return false
    }
    if (burnNum < 0) {
      setBurnError('Cannot be negative')
      return false
    }
    setBurnError('')
    return true
  }

  function validateRevenue() {
    if (revenueRaw.trim() !== '' && revenueNum < 0) {
      setRevenueError('Cannot be negative')
      return false
    }
    setRevenueError('')
    return true
  }

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

  const isProfitable = isValid && revenueNum >= burnNum && revenueNum > 0
  const isZeroBurn = isValid && burnNum === 0 && cashNum > 0 && revenueNum === 0
  const isZeroCash = isValid && cashNum === 0

  // Auto-scroll to results on mobile when they first appear
  useEffect(() => {
    if (runway !== null && resultsRef.current && window.innerWidth < 1024) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [runway !== null])

  return (
    <section id="calculator" className="relative py-12 sm:py-24 min-h-screen bg-[#0a0514]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Top Dashboard Header ───────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 pb-6 border-b border-white/5">
          <div>
            <h2 className="font-bebas text-3xl sm:text-4xl text-white tracking-wide">
              FINANCIAL <span className="text-ecell-orange">DASHBOARD</span>
            </h2>
            <p className="text-xs text-ecell-muted/60 uppercase tracking-widest mt-1">
              Strategic Runway Planning
            </p>
          </div>

          <div className="relative z-50" ref={dropdownRef}>
            <button
              onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
              className="flex items-center gap-2 bg-[#120a2e] px-4 py-2.5 rounded-lg border border-white/10 text-sm font-semibold hover:bg-white/5 transition-colors"
            >
              <span className="text-white/80 font-mono text-xs">{currency.flag}</span>
              <span className="text-white">{currency.code}</span>
              <span className="text-ecell-orange font-bold font-mono ml-2">{currency.symbol}</span>
              <ChevronDown className={`w-4 h-4 ml-2 text-ecell-muted transition-transform duration-200 ${isCurrencyOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCurrencyOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-[#120a2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-fade-up z-50">
                <div className="max-h-64 overflow-y-auto custom-scrollbar">
                  {CURRENCIES.map((cur) => (
                    <button
                      key={cur.code}
                      onClick={() => {
                        setCurrency(cur)
                        setIsCurrencyOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-white/5 transition-colors ${
                        currency.code === cur.code ? 'bg-white/5' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-start">
                          <span className={`font-semibold ${currency.code === cur.code ? 'text-ecell-orange' : 'text-white/90'}`}>{cur.code}</span>
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

        {/* ── 2-Column Dashboard Grid ────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: Controls & Inputs */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 lg:self-start">
            
            {/* Quick Presets */}
            <div>
              <div className="flex gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => applyPreset(p)}
                    onMouseEnter={() => setHoveredPreset(p.label)}
                    onMouseLeave={() => setHoveredPreset(null)}
                    onTouchStart={() => setHoveredPreset(hoveredPreset === p.label ? null : p.label)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-white/5 bg-[#120a2e]/40 text-[11px] font-semibold text-ecell-muted/80 hover:text-white hover:border-ecell-orange/30 hover:bg-ecell-orange/5 transition-all duration-200 group"
                  >
                    <Zap className="w-3 h-3 text-ecell-orange/50 group-hover:text-ecell-orange transition-colors" />
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Expanding explanation bar */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-out ${
                  hoveredPreset ? 'max-h-24 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'
                }`}
              >
                {PRESETS.filter((p) => p.label === hoveredPreset).map((p) => (
                  <div
                    key={p.label}
                    className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-ecell-purple/8 border border-ecell-purple/15"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-ecell-lavender/70 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-semibold text-ecell-lavender/90">{p.label}</span>
                      <span className="text-ecell-muted/50 mx-1.5">—</span>
                      <span className="text-[11px] text-ecell-muted/70 leading-relaxed">{p.explanation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#120a2e]/40 border border-white/5 rounded-2xl p-6 sm:p-8">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-ecell-orange" /> Baseline Metrics
              </h3>
              
              <div className="space-y-6">
                <InputField
                  label="Total Cash on Hand"
                  icon={<Wallet className="w-3.5 h-3.5" />}
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
                  icon={<Flame className="w-3.5 h-3.5" />}
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
                  icon={<TrendingUp className="w-3.5 h-3.5" />}
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

              {/* Edge Cases */}
              {isProfitable && (
                <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-ecell-purple/10 border border-ecell-purple/20">
                  <CheckCircle2 className="w-5 h-5 text-ecell-lavender shrink-0 mt-0.5" />
                  <div>
                    <p className="text-ecell-lavender text-xs font-bold uppercase tracking-widest">Profitable</p>
                    <p className="text-ecell-muted/80 text-[11px] mt-1 leading-relaxed">
                      Revenue exceeds burn. Runway is theoretically infinite.
                    </p>
                  </div>
                </div>
              )}

              {isZeroBurn && (
                <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Zero Burn</p>
                    <p className="text-emerald-500/70 text-[11px] mt-1 leading-relaxed">
                      No monthly expenditure detected. Runway is theoretically infinite.
                    </p>
                  </div>
                </div>
              )}

              {isZeroCash && (
                <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-400 text-xs font-bold uppercase tracking-widest">Zero Cash</p>
                    <p className="text-red-400/70 text-[11px] mt-1 leading-relaxed">
                      No cash remaining. Immediate action required.
                    </p>
                  </div>
                </div>
              )}

              {/* Formula + Reset */}
              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-ecell-muted/40">
                  <span>Runway</span><span>=</span><span className="text-ecell-muted/60">Cash</span><span>÷</span><span className="text-ecell-muted/60">(Burn - Rev)</span>
                </div>
                {hasInput && (
                  <button
                    onClick={resetAll}
                    className="flex items-center gap-1 text-[10px] text-ecell-muted/50 hover:text-red-400 transition-colors font-medium"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>
            </div>

            {isValid && burnNum > 0 && (
              <FundingGoalCard
                cashNum={cashNum}
                burnNum={burnNum}
                revenueNum={revenueNum}
                currency={currency.symbol}
              />
            )}
          </div>

          {/* RIGHT COLUMN: Results & Insights */}
          <div className="lg:col-span-8" ref={resultsRef}>
            {runway !== null && statusConfig ? (
              <div className="animate-fade-up">
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
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center border border-dashed border-white/5 rounded-2xl bg-[#120a2e]/10 p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <Calculator className="w-6 h-6 text-ecell-muted/40" />
                </div>
                <p className="text-ecell-muted/60 text-sm">
                  Enter your financial baselines to generate your dashboard.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
