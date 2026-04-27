/**
 * Format a number as a short currency string (K/M/B suffixes).
 * Used in compact metric cards.
 */
export function formatCurrencyShort(value, symbol = '$') {
  if (value === null || value === undefined || isNaN(value)) return `${symbol}0`
  const abs = Math.abs(value)
  let result
  if (abs >= 1_000_000_000) {
    result = `${symbol}${(abs / 1_000_000_000).toFixed(1)}B`
  } else if (abs >= 1_000_000) {
    result = `${symbol}${(abs / 1_000_000).toFixed(1)}M`
  } else if (abs >= 1_000) {
    result = `${symbol}${(abs / 1_000).toFixed(1)}K`
  } else {
    result = `${symbol}${abs.toFixed(0)}`
  }
  return value < 0 ? `-${result}` : result
}

/**
 * Format a number as a full USD currency string.
 * e.g. 500000 → "$500,000"
 */
export function formatCurrencyFull(value, symbol = '$') {
  if (value === null || value === undefined || isNaN(value)) return `${symbol}0`
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
  return `${symbol}${formatted}`
}

/**
 * Format months to 1 decimal place.
 * Returns "∞" for Infinity.
 */
export function formatMonths(months) {
  if (months === Infinity || months === null || months === undefined) return '∞'
  if (isNaN(months)) return '0.0'
  return months.toFixed(1)
}

/**
 * Convert months to approximate days (30.44 days/month average).
 * Returns "∞" for Infinity.
 */
export function formatDays(months) {
  if (months === Infinity) return '∞'
  if (isNaN(months) || months === null) return '0'
  return Math.floor(months * 30.44).toLocaleString('en-US')
}

/**
 * Format a raw number string for display in inputs.
 * Strips non-numeric characters and adds commas.
 * e.g. "500000" → "500,000"
 */
export function formatInputDisplay(rawValue) {
  if (!rawValue) return ''
  // Strip everything except digits and a single decimal point
  const cleaned = rawValue.replace(/[^0-9.]/g, '')
  const [intPart, decPart] = cleaned.split('.')
  const formatted = Number(intPart || 0).toLocaleString('en-US')
  return decPart !== undefined ? `${formatted}.${decPart}` : formatted
}

/**
 * Parse a formatted input string back to a float.
 * e.g. "500,000" → 500000
 */
export function parseInputValue(rawValue) {
  if (!rawValue) return 0
  const cleaned = rawValue.toString().replace(/,/g, '')
  const num = parseFloat(cleaned)
  return isNaN(num) ? 0 : num
}
