import {UniqueKeyMap} from '../src/unique-key-map.ts'
import {test} from 'node:test'
import assert from 'node:assert'

test('UniqueKeyMap', () => {
  const uniqueMap = new UniqueKeyMap()
  uniqueMap.add('key1', 'value1')
  uniqueMap.add('key2', 'value2')
  uniqueMap.add('key1', 'value3') // This will remove 'key1' from the map because the values differ
  uniqueMap.add('key2', 'value2') // This will do nothing because the value is the same
  assert.deepStrictEqual(uniqueMap.value, {key2: 'value2'})
})
