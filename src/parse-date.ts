import {DateTime} from 'luxon'
import ms from 'ms'
import * as chrono from 'chrono-node'
import wordsToNumbers from 'words-to-numbers'
import {parseTimezone} from './parse-timezone.ts'
import {units} from './format-ms.ts'

function handleNow(v, runtime) {
  if (v === 'now') {
    return runtime
  }
  throw new Error('Invalid now input')
}

function handleChrono(v, runtime: DateTime) {
  const value = chrono.parseDate(v)
  if (value) {
    let dateTime = DateTime.fromJSDate(value)
    dateTime = dateTime.set({
      hour: runtime.hour,
      minute: runtime.minute,
      second: runtime.second,
      millisecond: runtime.millisecond
    })
    if (runtime.zoneName) {
      return dateTime.setZone(runtime.zoneName, { keepLocalTime: false })
    }
    return dateTime
  }
  throw new Error('Invalid chrono input')
}

function handleMs(value) {
  const v = ms(value)
  if (v) {
    return v
  }
  const monthRegex = /^(?:\d+\s*(?:mo|month|months|mths|mth))$/i
  if (monthRegex.test(value)) {
    const number = parseInt(value, 10)
    return number * units.month.divisor
  }
  throw new Error('Invalid ms input')
}

function handleWords(value) {
  // remove the last word from the string
  const words = value.split(' ')
  const id = words.pop()
  const rest = words.join(' ')
  const number = wordsToNumbers(rest)
  if (number) {
    return handleMs(`${number} ${id}`)
  }
  throw new Error('Invalid words input')
}

function tryFunctionsUntilSuccess(functions) {
  return (value: string, runtime: DateTime = DateTime.now()) => {
    for (const func of functions) {
      try {
        return func(value, runtime)
      } catch (error) {
        // noop
      }
    }
    throw new Error(`All functions failed ${value}`)
  }
}

function formatDateTime({timezone, format, input}) {
  let parsedDateTime = DateTime.fromFormat(input, format).setZone(timezone, {keepLocalTime: true})
  if (!parsedDateTime.isValid) {
    throw new Error('Invalid date format or input')
  } else {
    return parsedDateTime
  }
}

function parseTimeWithTimezone(format) {
  return (input: string, runtime: DateTime) => {
    const {value, timezone} = parseTimezone(input)
    if (value === '' && timezone) {
      return runtime.setZone(timezone, {keepLocalTime: true})
    }
    return formatDateTime({format, input: value, timezone: timezone || runtime.zoneName})
  }
}

export const parseDate = tryFunctionsUntilSuccess([
  parseTimeWithTimezone('h:mma'), // 3:30pm
  parseTimeWithTimezone('h:mm a'), // 3:30 pm
  parseTimeWithTimezone('h:mma z'), // 3:30pm est
  parseTimeWithTimezone('h:mm a z'), // 3:30 pm est
  parseTimeWithTimezone('h:mma zz'), // 3:30pm est
  parseTimeWithTimezone('h:mm a zz'), // 3:30 pm est
  parseTimeWithTimezone('ha'), // 3pm
  parseTimeWithTimezone('h a'), // 3 pm
  parseTimeWithTimezone('ha z'), // 3pm est
  parseTimeWithTimezone('h a z'), // 3 pm est
  parseTimeWithTimezone('z'), //est
  parseTimeWithTimezone('ha zz'), // 3pm est
  parseTimeWithTimezone('h a zz'), // 3 pm est
  parseTimeWithTimezone('zz'), //est
  handleMs,
  handleNow,
  handleWords,
  handleChrono,
])
