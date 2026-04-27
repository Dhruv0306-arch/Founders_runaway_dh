import React, { useState } from 'react'
import { Target, CheckCircle2 } from 'lucide-react'
import { formatCurrencyShort } from '../utils/formatters.js'

export default function FundingGoalCard({ cashNum, burnNum, revenueNum = 0, currency = '$' }) {
  const [targetMonths, setTargetMonths] = useState(18)

  const netBurn = Math.max(0, burnNum - revenueNum)
  
  // If net burn is 0 or less, they are profitable, they don't *need* funding to survive.
  if (netBurn <= 0) return null

  const requiredCash = targetMonths * netBurn
  const shortfall = Math.max(0, requiredCash - cashNum)
  
  // If they already have enough cash for the target months:
  const isFunded = shortfall === 0

  return (
    <div className="bg-[#120a2e]/40 border border-white/5 rounded-2xl p-6 sm:p-8 mt-6">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-4 h-4 text-ecell-orange" />
        <h3 className="font-bebas text-xl text-white tracking-wide uppercase mt-1">
          Funding Goal Calculator
        </h3>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="flex-1 w-full">
            <div className="flex justify-between mb-3">
              <label className="text-sm font-semibold text-white tracking-wide">
                Target Runway
              </label>
              <span className="text-sm font-bold text-ecell-orange bg-ecell-orange/10 px-2.5 py-0.5 rounded-md">
                {targetMonths} Months
              </span>
            </div>
            <input
              type="range"
              min="3"
              max="36"
              step="1"
              value={targetMonths}
              onChange={(e) => setTargetMonths(Number(e.target.value))}
              className="w-full h-1.5 bg-ecell-purple/30 rounded-lg appearance-none cursor-pointer accent-ecell-orange outline-none"
            />
            <div className="flex justify-between mt-2 px-1 text-[10px] text-ecell-muted/50 font-mono">
              <span>3m</span>
              <span>12m</span>
              <span>24m</span>
              <span>36m</span>
            </div>
          </div>

          <div className="w-full sm:w-auto shrink-0 bg-[#0a0514] border border-white/5 rounded-xl p-5 text-center min-w-[180px]">
            <p className="text-[10px] text-ecell-muted/60 uppercase tracking-widest mb-1.5">
              Shortfall to Raise
            </p>
            {isFunded ? (
              <div className="flex items-center justify-center gap-1.5 text-emerald-400 mt-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-xl font-bebas uppercase tracking-wide mt-1">Fully Funded</span>
              </div>
            ) : (
              <>
                <p className="text-2xl font-mono font-bold text-ecell-orange leading-none mb-1.5">
                  {formatCurrencyShort(shortfall, currency)}
                </p>
                <p className="text-[11px] text-ecell-muted/40">
                  Reserve: <span className="font-mono text-ecell-muted/60">{formatCurrencyShort(requiredCash, currency)}</span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
