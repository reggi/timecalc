import {DateTime} from 'luxon'

export class TimeCalc {
  hasDateTime = false
  values: any[] = []
  tags: string[] = []
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
  parser(parseStringValue: (value: string, date: DateTime) => number | DateTime) {
    return (value): number => {
      try {
        this.operandStack.push(value)
        if (typeof value === 'number') return value
        let result = parseStringValue(value.trim(), this.relativity)
        if (DateTime.isDateTime(result)) {
          if (this.operandStack.length === 1 && result.zoneName) {
            const ogzone = this.timezone
            this.timezone = result.zoneName
            result = result.setZone(ogzone, {keepLocalTime: false})
            result = result.setZone(this.timezone, {keepLocalTime: false})
          }
          this.hasDateTime = true
          return result.toMillis()
        }
        return result
      } catch (e) {
        this.tags.push(value)
        return 0
      }
    }
  }

  postEvaluate(e: number): number {
    if (typeof e === 'number' && this.hasDateTime && this.tags.length) {
      const now = DateTime.now()
      const evaluated = DateTime.fromMillis(e)
      const differenceInMilliseconds = evaluated.diff(now, 'milliseconds').milliseconds
      return differenceInMilliseconds
    }
    return e
  }
}
