import assert from 'node:assert'
import {evaluate} from '../src/evaluate.ts'
import {test} from 'node:test'

test('evaluate', () => {
  // one value
  assert.strictEqual(evaluate('1'), 1)
  assert.strictEqual(evaluate('300'), 300)
  assert.strictEqual(evaluate('800'), 800)
  assert.strictEqual(evaluate('50'), 50)

  // Add
  assert.strictEqual(evaluate('1/2 + 1/2'), 1 / 2 + 1 / 2)
  assert.strictEqual(evaluate('1/2+1/2'), 1 / 2 + 1 / 2)
  assert.strictEqual(evaluate('1 + 1'), 1 + 1)
  assert.strictEqual(evaluate('1+1'), 1 + 1)
  // Multiply
  assert.strictEqual(evaluate('1 * 1'), 1 * 1)
  assert.strictEqual(evaluate('1 * 2'), 1 * 2)
  assert.strictEqual(evaluate('2 * 200'), 2 * 200)
  // Divide
  assert.strictEqual(evaluate('1 / 2'), 1 / 2)
  assert.strictEqual(evaluate('4 / 2'), 4 / 2)
  // Subtract
  assert.strictEqual(evaluate('1 - 1'), 1 - 1)
  assert.strictEqual(evaluate('10 - 5'), 10 - 5)

  assert.strictEqual(evaluate('(1 + 2) * 3'), (1 + 2) * 3, 'Should handle simple parentheses')
  assert.strictEqual(evaluate('2 * (2 + 3)'), 2 * (2 + 3), 'Should handle parentheses affecting the result')

  // Multiplication and Division (from left to right)
  assert.strictEqual(evaluate('2 * 3 / 2'), (2 * 3) / 2, 'Should handle division after multiplication')
  assert.strictEqual(evaluate('8 / 2 * 4'), (8 / 2) * 4, 'Should handle multiplication after division')

  // Multiplication and Division combined with Addition and Subtraction
  assert.strictEqual(evaluate('2 + 3 * 4'), 2 + 3 * 4, 'Should respect multiplication before addition')
  assert.strictEqual(evaluate('8 - 2 * 4'), 8 - 2 * 4, 'Should respect multiplication before subtraction')
  assert.strictEqual(evaluate('8 / 2 - 4'), 8 / 2 - 4, 'Should respect division before subtraction')
  assert.strictEqual(evaluate('1 + 2 * 3 - 4 / 2'), 1 + 2 * 3 - 4 / 2, 'Should handle multiple operations correctly')

  // More complex expressions
  assert.strictEqual(evaluate('1 + (2 * (2 + 3)) - 4'), 1 + 2 * (2 + 3) - 4, 'Should handle complex nested parentheses')
  assert.strictEqual(
    evaluate('((1 + 1) * 3 + (3 / 3)) - 2'),
    (1 + 1) * 3 + 3 / 3 - 2,
    'Should handle deeply nested parentheses',
  )
  assert.strictEqual(
    evaluate('2 + 3 * (4 - 1) + 2 * 3'),
    2 + 3 * (4 - 1) + 2 * 3,
    'Should mix multiple operations with parentheses',
  )

  // Edge cases
  assert.strictEqual(evaluate('2 * 2 + 3 * 3'), 2 * 2 + 3 * 3, 'Should calculate separate multiplication')
  assert.strictEqual(
    evaluate('2 * (2 + 3 * 2) + 3'),
    2 * (2 + 3 * 2) + 3,
    'Should handle expressions starting with parentheses',
  )
  assert.strictEqual(evaluate('2 + 3 * 4 - 5 / 5'), 2 + 3 * 4 - 5 / 5, 'Should handle all operations in one expression')
  assert.strictEqual(evaluate('18 / 2 * 3'), (18 / 2) * 3, 'Should handle division followed by multiplication')

  const results: any[] = []
  evaluate('3pm America/Los_Angeles + 1 hour', value => {
    results.push(value)
    return 0
  })
  assert.deepStrictEqual(results, ['3pm America/Los_Angeles', '1 hour'])
})
