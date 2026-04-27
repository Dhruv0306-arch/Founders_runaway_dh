/**
 * Core runway formula:
 *   Runway (Months) = Total Cash on Hand / Monthly Burn Rate
 *
 * Thresholds:
 *   >= 6 months  → Safe / Green
 *   3–6 months   → Warning / Yellow
 *   < 3 months   → Danger / Red
 */

/**
 * Calculate runway in months.
 * Returns Infinity if burnRate is 0 (cash lasts forever).
 * Returns 0 if cash is 0.
 */
export function calculateRunway(cash, burnRate) {
  if (cash <= 0) return 0
  if (burnRate <= 0) return Infinity
  return cash / burnRate
}

/**
 * Map a runway value to a status string.
 */
export function getRunwayStatus(months) {
  if (months === null || months === undefined) return null
  if (months === Infinity) return 'safe'
  if (months >= 6) return 'safe'
  if (months >= 3) return 'warning'
  return 'danger'
}

/**
 * Full config object for each status — colors, labels, copy.
 */
export function getStatusConfig(status) {
  const configs = {
    safe: {
      label: 'Safe Zone',
      emoji: '🟢',
      description: 'Your runway is healthy. Keep optimizing.',
      textColor: 'text-emerald-400',
      dimTextColor: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/25',
      barColor: 'bg-emerald-400',
      dotColor: 'bg-emerald-400',
      glowClass: 'glow-safe',
      ringColor: 'ring-emerald-500/30',
    },
    warning: {
      label: 'Warning Zone',
      emoji: '🟡',
      description: 'Time to act. Optimize burn or start fundraising.',
      textColor: 'text-amber-400',
      dimTextColor: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/25',
      barColor: 'bg-amber-400',
      dotColor: 'bg-amber-400',
      glowClass: 'glow-warning',
      ringColor: 'ring-amber-500/30',
    },
    danger: {
      label: 'Danger Zone',
      emoji: '🔴',
      description: 'Critical. Take immediate action now.',
      textColor: 'text-red-400',
      dimTextColor: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/25',
      barColor: 'bg-red-500',
      dotColor: 'bg-red-400',
      glowClass: 'glow-danger',
      ringColor: 'ring-red-500/30',
    },
  }
  return configs[status] || configs.safe
}

/**
 * Calculate 10%, 20%, 30% burn reduction scenarios.
 */
export function getScenarios(cash, burnRate) {
  const baseRunway = calculateRunway(cash, burnRate)
  return [10, 20, 30].map((reduction) => {
    const newBurn = burnRate * (1 - reduction / 100)
    const newRunway = calculateRunway(cash, newBurn)
    const extraMonths = newRunway === Infinity ? Infinity : newRunway - baseRunway
    const status = getRunwayStatus(newRunway)
    return {
      reduction,
      newBurn,
      newRunway,
      extraMonths,
      status,
      config: getStatusConfig(status),
    }
  })
}

/**
 * Strategic advice tailored to the startup's runway situation.
 */
export function getStartupAdvice(status) {
  const advice = {
    safe: [
      'Invest in growth — you have breathing room to experiment.',
      'Document your burn structure clearly for future investor decks.',
      'Build a 2–3 month buffer before your next fundraising round.',
      'Model out scenarios: what if revenue drops 30% next quarter?',
    ],
    warning: [
      'Begin fundraising conversations now — it takes 3–6 months minimum.',
      'Identify the top 3 non-essential expenses you can cut or defer.',
      'Set weekly cash flow reviews with your co-founder or CFO.',
      'Explore bridge financing, revenue-based financing, or grants.',
    ],
    danger: [
      'Stop all non-essential spending immediately — today.',
      'Activate every investor relationship you have, even weak ties.',
      'Consider a revenue sprint — what can you close or sell this week?',
      'Have a transparent conversation with your team about the situation.',
    ],
  }
  return advice[status] || advice.safe
}
