import test from 'node:test'
import _timecalc from '../src/index.ts'

function assertIncludes(actual, expected, message?) {
  const result = actual.includes(expected)
  if (!result) {
    throw new Error(message || `Expected "${actual}" to include "${expected}".`)
  }
}

test('timecalc', () => {
  const timezone = 'America/New_York'
  const timecalc = value => _timecalc(timezone, value).results

  assertIncludes(timecalc('3pm'), 'America/New_York')
  assertIncludes(timecalc('3pm + 1h + 30m + 1d'), '4:30 PM')
  assertIncludes(timecalc('3h'), '3 hours')
  assertIncludes(timecalc('-3h'), '-3 hours')
  assertIncludes(timecalc('3pm'), '3:00 PM (America/New_York)')
  assertIncludes(timecalc('3pm sfo'), '3:00 PM (America/Los_Angeles)')
  assertIncludes(timecalc('sfo - jfk'), '3 hours')
  assertIncludes(timecalc('jfk - sfo'), '-3 hours')
  assertIncludes(timecalc('5pm sfo - 5pm jfk'), '3 hours')
  assertIncludes(timecalc('5pm jfk - 5pm sfo'), '-3 hours')
  assertIncludes(timecalc('5pm sfo - 5pm jfk + 1 hour'), '4 hours')
  assertIncludes(timecalc('1y + 1y'), '2 years')
  assertIncludes(timecalc('2 y + 3w + 21h + 1m - 45ms'), '2 years, 3 weeks, 21 hours, 59 seconds, 955 milliseconds')
  assertIncludes(timecalc('now - tomorrow'), '-1 day')
  assertIncludes(timecalc('tomorrow - now'), '1 day')
})
