import assert from 'assert'
import {parseTimezone, stringToTimezone} from '../src/timezone.ts'
import test from 'node:test'

test('stringToTimezone', () => {
  assert.deepStrictEqual(stringToTimezone('EDT'), 'UTC-04:00')
  assert.deepStrictEqual(stringToTimezone('EST'), 'UTC-05:00')
  assert.deepStrictEqual(stringToTimezone('JFK'), 'America/New_York')
  assert.deepStrictEqual(stringToTimezone('edt'), 'UTC-04:00')
  assert.deepStrictEqual(stringToTimezone('est'), 'UTC-05:00')
  assert.deepStrictEqual(stringToTimezone('jfk'), 'America/New_York')
  assert.deepStrictEqual(stringToTimezone('jfk'), 'America/New_York')
  assert.deepStrictEqual(stringToTimezone('new york'), 'America/New_York')
})

test('parseTimezone', () => {
  assert.deepStrictEqual(parseTimezone('2pm copenhagen'), {value: '2pm', timezone: 'Europe/Copenhagen'})
  assert.deepStrictEqual(parseTimezone('2pm jfk'), {value: '2pm', timezone: 'America/New_York'})
  assert.deepStrictEqual(parseTimezone('2pm new york'), {value: '2pm', timezone: 'America/New_York'})
  assert.deepStrictEqual(parseTimezone('7pm new york'), {value: '7pm', timezone: 'America/New_York'})
  assert.deepStrictEqual(parseTimezone('2pm America/New_York'), {value: '2pm', timezone: 'America/New_York'})
  assert.deepStrictEqual(parseTimezone('2pm america/new_york'), {value: '2pm', timezone: 'America/New_York'})
})
