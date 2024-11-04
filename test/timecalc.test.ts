import test from 'node:test'
import {TimeCalc} from '../src/timecalc.ts'
import ms from 'ms'

function assertIncludes(actual, expected, message?) {
  const result = actual.includes(expected)
  if (!result) {
    throw new Error(message || `Expected "${actual}" to include "${expected}".`)
  }
}

test('timecalc', () => {
  const timezone = 'America/New_York'
  const {evaluateTimezone} = TimeCalc
  const evaluate = evaluateTimezone(timezone)

  assertIncludes(evaluate('3h'), '3 hours')
  assertIncludes(evaluate('-3h'), '-3 hours')
  assertIncludes(evaluate('3pm'), '3:00 PM (America/New_York)')
  assertIncludes(evaluate('3pm sfo'), '3:00 PM (America/Los_Angeles)')
  assertIncludes(evaluate('sfo - jfk'), '3 hours')
  assertIncludes(evaluate('jfk - sfo'), '-3 hours')
  assertIncludes(evaluate('5pm sfo - 5pm jfk'), '3 hours')
  assertIncludes(evaluate('5pm jfk - 5pm sfo'), '-3 hours')
  assertIncludes(evaluate('5pm sfo - 5pm jfk + 1 hour'), '4 hours')
  assertIncludes(evaluate('1y + 1y'), '2 years')
})
