import test from 'node:test'
import {units, formatResolveDate} from '../src/format-resolve.ts'
import assert from 'node:assert'

test('formatResolve', () => {
  assert.deepEqual(formatResolveDate(units.day.divisor * 3, 'day'), '3 days')
  assert.deepEqual(formatResolveDate(units.second.divisor * 3, 'day'), '3 seconds')
  assert.deepEqual(formatResolveDate(units.second.divisor * 3, 'second'), '3 seconds')
  assert.deepEqual(formatResolveDate(units.second.divisor * 61, 'second'), '61 seconds')
  assert.deepEqual(formatResolveDate(units.second.divisor * 61, 'minutes'), '1 minute, 1 second')
  assert.deepEqual(formatResolveDate(units.day.divisor * 700, 'years'), '1 year, 10 months, 4 weeks, 2 days, 9 hours')
  assert.deepEqual(formatResolveDate(units.year.divisor * 700, 'years'), '700 years')
  assert.deepEqual(formatResolveDate(-units.day.divisor * 3, 'day'), '-3 days')
  assert.deepEqual(formatResolveDate(-10800000, ['hours']), '-3 hours')
})
