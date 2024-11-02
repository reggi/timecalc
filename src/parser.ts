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

function overrideTimezone({format, input}) {
  let parts = input.split(' ')
  let formatParts = format.split(' ')
  const timezoneIndex = formatParts.findIndex(f => f.includes('z'))
  if (timezoneIndex !== -1) {
    parts[timezoneIndex] = stringToTimezone(parts[timezoneIndex])
  }
  let sanitizedInput = parts.join(' ')
  return sanitizedInput
}

function formatDateTime({runtime, timezone, format, input}) {
  // Parse the input using the provided format
  let parsedDateTime = DateTime.fromFormat(input, format).setZone(timezone)

  // Check if parsedDateTime is valid
  if (parsedDateTime.isValid) {
    // Set the timezone to runtime's timezone while keeping local time
    return parsedDateTime.setZone(runtime.zone, {keepLocalTime: true})
  } else {
    // Handle the error case where the date is invalid
    throw new Error('Invalid date format or input')
  }
}

function parseTimeWithTimezone(format) {
  return (input: string, runtime: DateTime) => {
    const {value, timezone} = parseTimezone(input)
    if (value === '' && timezone) {
      return runtime.setZone(timezone, {keepLocalTime: true})
    }
    return formatDateTime({runtime, format, input: value, timezone})
    // // log the timezone of runtime
    // console.log(runtime.toISO())
    // input = overrideTimezone({format, input})
    // const dateTime = DateTime.fromFormat(input, format, {setZone: true})
    // console.log(dateTime.toISO())
    // if (!dateTime.isValid) throw new Error('Invalid input')
    // const today = runtime.setZone(dateTime.zoneName, { keepLocalTime: true })
    // const parsedDateTime = today.set({hour: dateTime.hour, minute: dateTime.minute})
    // return parsedDateTime
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
