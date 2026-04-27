import React, { useState } from 'react'
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
    <div className="mt-8 pt-6 border-t border-ecell-purple/15">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-ecell-orange/10 border border-ecell-orange/20 flex items-center justify-center shrink-0">
          <span className="text-base">🎯</span>
        </div>
        <div>
          <h3 className="font-bebas text-2xl text-white leading-none tracking-wide">
            FUNDING <span className="text-ecell-orange">GOAL</span> CALCULATOR
          </h3>
          <p className="text-xs text-ecell-muted/60 mt-1 leading-relaxed">
            See how much cash you need to raise to reach your target runway.
          </p>
        </div>
      </div>

      <div className="bg-ecell-purple/5 border border-ecell-purple/20 p-5 rounded-xl">
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

          <div className="w-full sm:w-auto shrink-0 bg-ecell-dark border border-ecell-purple/30 rounded-xl p-5 text-center min-w-[200px] shadow-lg">
            <p className="text-[10px] text-ecell-muted/80 uppercase tracking-widest mb-1.5">
              Shortfall to Raise
            </p>
            {isFunded ? (
              <p className="text-2xl font-bebas text-emerald-400 mt-2">
                FULLY FUNDED ✨
              </p>
            ) : (
              <>
                <p className="text-3xl font-mono font-bold text-ecell-orange leading-none mb-1.5">
                  {formatCurrencyShort(shortfall, currency)}
                </p>
                <p className="text-xs text-ecell-muted/50">
                  Target Reserve: <span className="font-mono text-ecell-muted/80">{formatCurrencyShort(requiredCash, currency)}</span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
