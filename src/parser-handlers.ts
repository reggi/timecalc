import ms from 'ms'
import * as chrono from 'chrono-node'
import {DateTime} from 'luxon'
import wordsToNumbers from 'words-to-numbers'
import {units} from './format-resolve'

function handleNow(v, runtime) {
  if (v === 'now') {
    return runtime
  }
  throw new Error('Invalid now input')
}

function handleChrono(v) {
  //https://moment.github.io/luxon/demo/global.html
  const value = chrono.parseDate(v)
  if (value) {
    return DateTime.fromJSDate(value)
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

export const stack = [handleMs, handleNow, handleWords, handleChrono]
