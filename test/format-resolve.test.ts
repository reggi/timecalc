import test from 'node:test'
import {resolve, formatResolveHuman, formatResolve, units} from '../src/format-resolve.ts'
import assert from 'node:assert'

test('formatResolve', () => {
  assert.deepStrictEqual(formatResolve(units.day.divisor * 3, 'day'), [{result: 3, word: 'days', divisor: 86400000}])
  assert.deepStrictEqual(formatResolve(units.second.divisor * 3, 'day'), [
    {result: 0, word: 'days', divisor: 86400000},
    {result: 3, word: 'seconds', divisor: 1000},
  ])
  assert.deepStrictEqual(formatResolve(units.second.divisor * 3, 'second'), [
    {result: 3, word: 'seconds', divisor: 1000},
  ])
  assert.deepStrictEqual(formatResolve(units.second.divisor * 61, 'second'), [
    {result: 61, word: 'seconds', divisor: 1000},
  ])
  assert.deepStrictEqual(formatResolve(units.second.divisor * 61, 'minutes'), [
    {result: 1, word: 'minute', divisor: 1000 * 60},
    {result: 1, word: 'second', divisor: 1000},
  ])
  assert.deepStrictEqual(formatResolve(units.day.divisor * 700, 'years'), [
    {result: 1, word: 'year', divisor: 31536000000},
    {result: 11, word: 'months', divisor: 2592000000},
    {result: 5, word: 'days', divisor: 86400000},
  ])

  assert.deepStrictEqual(formatResolveHuman(units.day.divisor * 700, 'years'), '1 year, 11 months, 5 days')

  assert.deepStrictEqual(formatResolve(-units.day.divisor * 3, 'day'), [{result: -3, word: 'days', divisor: 86400000}])

  assert.deepEqual(resolve(-10800000, 'hours'), {result: -3, word: 'hours', divisor: 3600000})
})
