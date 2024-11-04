import {DateTime} from 'luxon'
import ms from 'ms'

const fixUnit = (alias: string[], divisor: number) => ({alias, divisor})

const year = 1000 * 60 * 60 * 24 * 365.25

export const units = {
  year: fixUnit(['y', 'year', 'years'], 1000 * 60 * 60 * 24 * 365.25), // Adjusted for leap year
  month: fixUnit(['mo', 'mth', 'mths', 'month', 'months'], year / 12), // Average month length considering leap years
  week: fixUnit(['w', 'week', 'weeks'], 1000 * 60 * 60 * 24 * 7),
  day: fixUnit(['d', 'day', 'days'], 1000 * 60 * 60 * 24),
  hour: fixUnit(['h', 'hour', 'hours'], 1000 * 60 * 60),
  minute: fixUnit(['m', 'minute', 'minutes'], 1000 * 60),
  second: fixUnit(['s', 'second', 'seconds'], 1000),
  millisecond: fixUnit(['ms', 'millisecond', 'milliseconds'], 1),
}

function pluralize(value: number, unit: string): string {
  const isSingular = value === 1
  const correctUnit = isSingular ? unit.replace(/s$/, '') : unit.endsWith('s') ? unit : unit + 's'
  return correctUnit
}

function resolveSignularAlias(unit) {
  unit = unit.toLowerCase()
  const unitChunks = unit.split(' ')
  for (const unitOption in units) {
    if (unitChunks.some(chunk => units[unitOption].alias.map(alias => alias.toLowerCase()).includes(chunk))) {
      return unitOption
    }
  }
  throw new Error(`Unknown unit: ${unit}`)
}

function resolveAliasTags(tags) {
  for (const unitOption in units) {
    for (const tag of tags) {
      try {
        const candidateUnit = resolveSignularAlias(tag)
        if (candidateUnit === unitOption) {
          return candidateUnit
        }
      } catch (e) {
        continue
      }
    }
  }
  return undefined
}

export function resolve(value: number, unit?: string) {
  // Use absolute value to handle negative numbers
  const absValue = Math.abs(value)

  if (unit && units[unit]) {
    const divisor: number = units[unit].divisor
    const result = value / divisor // Keep the original value's sign in the result
    const word = pluralize(result, unit)
    return {result, word, divisor}
  } else {
    for (const unitOption in units) {
      const divisor: number = units[unitOption].divisor
      if (absValue >= divisor) {
        // Check against absolute value
        const result = value / divisor // Calculate result preserving the sign of 'value'
        const word = pluralize(result, unitOption)
        return {result, word, divisor}
      }
    }
  }
  return {result: value, word: 'milliseconds', divisor: 1} // Adjusted divisor from 0 to 1 to avoid division by zero elsewhere
}

export function formatResolve(value: number, unit?: string): any[] {
  let results: {result: number; word: string; divisor: number}[] = []
  let remainder = value
  do {
    const resolved = resolve(remainder, unit)
    const resultWithoutRemainder = Math.floor(resolved.result)
    results.push({
      result: resultWithoutRemainder,
      word: pluralize(resultWithoutRemainder, resolved.word),
      divisor: resolved.divisor,
    })
    remainder = remainder % resolved.divisor
    unit = undefined
  } while (remainder > 0)
  return results
}

export function formatResolveHuman(value: number, unit?: string): string {
  const results = formatResolve(value, unit)
  return results
    .filter(r => r.result !== 0)
    .map(r => [r.result, r.word].join(' '))
    .join(', ')
}

function unixToReadable(results, timezone) {
  let date = DateTime.fromMillis(results)
  if (timezone) {
    date = date.setZone(timezone, {keepLocalTime: false})
  }
  return `${date.toLocaleString(DateTime.DATETIME_MED)} (${date.zoneName})`
}

export function formatResolveDate(value: number, tags: string[] | string = [], timezone?: string): string {
  tags = Array.isArray(tags) ? tags : [tags]
  const tag = resolveAliasTags(tags)
  if (!tag && value >= units.year.divisor * 30) {
    return unixToReadable(value, timezone)
  }
  return formatResolveHuman(value, tag)
}
