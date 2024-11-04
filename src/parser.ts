import {DateTime} from 'luxon'
import {parseTimezone, stringToTimezone} from './timezone.ts'
import {stack} from './parser-handlers.ts'

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

export const parseStringValue = tryFunctionsUntilSuccess([
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
  ...stack,
])
