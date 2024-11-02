import {DateTime} from 'luxon'
import {evaluateExpression} from './evaluate.ts'
import {parseStringValue} from './parser.ts'

export class TimeCalc {
  hasDateTime = false
  values: any[] = []
  inAs: string[] = []
  // helps us know positions of the operands
  operandStack: any[] = []
  relativity: DateTime
  constructor(
    public timezone: string,
    public log?: (value: string | number) => void,
  ) {
    this.parser = this.parser.bind(this)
    this.relativity = DateTime.now().setZone(timezone)
  }

  /** handles each operand in the evaluation (must resolve to int) */
  parser(value): number {
    this.operandStack.push(value)
    if (typeof value === 'number') return value

    // first save specal "in and as" values these help us determine how to format the output
    if (typeof value === 'string' && (value.startsWith('in ') || value.startsWith('as '))) {
      this.inAs.push(value)
      return 0
    }

    if (typeof value === 'string') {
      const result = parseStringValue(value.trim(), this.relativity)
      if (DateTime.isDateTime(result)) {
        if (this.operandStack.length === 1 && result.zoneName) {
          this.relativity = this.relativity.setZone(result.zoneName)
        }
        this.hasDateTime = true
        return result.toMillis()
      }
      return result
    } else {
      return value
    }
  }

  evaluate(value) {
    const e = evaluateExpression(value, this.parser)
    if (this.hasDateTime) {
      if (this.inAs.length) {
        const now = DateTime.now()
        const evaluated = DateTime.fromMillis(e)
        const differenceInMilliseconds = evaluated.diff(now, 'milliseconds').milliseconds
        return this.resolveIn(differenceInMilliseconds)
      }
      return this.resolveIn(e)
    }
    return this.resolveIn(e)
  }

  unixToReadable(results) {
    // Convert Unix timestamp from seconds to milliseconds
    const date = DateTime.fromMillis(results).setZone(this.timezone)
    // Format to a human-readable string
    return date.toLocaleString(DateTime.DATETIME_MED)
  }

  resolveIn(value) {
    const formatIfNeeded = number => {
      return number % 1 !== 0 ? number.toFixed(2) : String(number)
    }

    const pluralize = (value, unit) => {
      const numFormatted = formatIfNeeded(value)
      return `${numFormatted} ${numFormatted === '1' ? unit.slice(0, -1) : unit}`
    }

    if (this.inAs.includes('in years')) {
      return pluralize(value / 1000 / 60 / 60 / 24 / 365, 'years')
    } else if (this.inAs.includes('in days')) {
      return pluralize(value / 1000 / 60 / 60 / 24, 'days')
    } else if (this.inAs.includes('in hours')) {
      return pluralize(value / 1000 / 60 / 60, 'hours')
    } else if (this.inAs.includes('in minutes')) {
      return pluralize(value / 1000 / 60, 'minutes')
    } else if (this.inAs.includes('in seconds')) {
      return pluralize(value / 1000, 'seconds')
    } else if (this.inAs.includes('in milliseconds')) {
      return `${value} millisecond${value === 1 ? '' : 's'}` // Milliseconds are integers and not formatted
    } else if (this.inAs.includes('in weeks')) {
      return pluralize(value / 1000 / 60 / 60 / 24 / 7, 'weeks')
    } else if (this.inAs.includes('as date')) {
      return this.unixToReadable(value)
    } else {
      // Default fallback based on the magnitude of the value
      if (value >= 31536000000 * 2) {
        // more than 1 year in milliseconds
        return this.unixToReadable(value)
      } else {
        const unitMap = [
          {threshold: 31536000000, unit: 'years', divisor: 31536000000},
          {threshold: 604800000, unit: 'weeks', divisor: 604800000},
          {threshold: 86400000, unit: 'days', divisor: 86400000},
          {threshold: 3600000, unit: 'hours', divisor: 3600000},
          {threshold: 60000, unit: 'minutes', divisor: 60000},
          {threshold: 1000, unit: 'seconds', divisor: 1000},
          {threshold: 0, unit: 'milliseconds', divisor: 1},
        ]

        const absoluteValue = Math.abs(value)
        const result = unitMap.find(u => absoluteValue >= u.threshold)
        const formattedValue = result
          ? pluralize(absoluteValue / result.divisor, result.unit)
          : `${absoluteValue} milliseconds`
        return value < 0 ? `-${formattedValue}` : formattedValue
      }
    }
  }
}
