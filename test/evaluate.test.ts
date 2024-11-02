import assert from 'node:assert'
import {evaluateExpression} from '../src/evaluate.ts'
import {test} from 'node:test'

test('evaluateExpression', () => {
  // one value
  assert.strictEqual(evaluateExpression('1'), 1)
  assert.strictEqual(evaluateExpression('300'), 300)
  assert.strictEqual(evaluateExpression('800'), 800)
  assert.strictEqual(evaluateExpression('50'), 50)

  // Add
  assert.strictEqual(evaluateExpression('1/2 + 1/2'), 1 / 2 + 1 / 2)
  assert.strictEqual(evaluateExpression('1/2+1/2'), 1 / 2 + 1 / 2)
  assert.strictEqual(evaluateExpression('1 + 1'), 1 + 1)
  assert.strictEqual(evaluateExpression('1+1'), 1 + 1)
  // Multiply
  assert.strictEqual(evaluateExpression('1 * 1'), 1 * 1)
  assert.strictEqual(evaluateExpression('1 * 2'), 1 * 2)
  assert.strictEqual(evaluateExpression('2 * 200'), 2 * 200)
  // Divide
  assert.strictEqual(evaluateExpression('1 / 2'), 1 / 2)
  assert.strictEqual(evaluateExpression('4 / 2'), 4 / 2)
  // Subtract
  assert.strictEqual(evaluateExpression('1 - 1'), 1 - 1)
  assert.strictEqual(evaluateExpression('10 - 5'), 10 - 5)

  assert.strictEqual(evaluateExpression('(1 + 2) * 3'), (1 + 2) * 3, 'Should handle simple parentheses')
  assert.strictEqual(evaluateExpression('2 * (2 + 3)'), 2 * (2 + 3), 'Should handle parentheses affecting the result')

  // Multiplication and Division (from left to right)
  assert.strictEqual(evaluateExpression('2 * 3 / 2'), (2 * 3) / 2, 'Should handle division after multiplication')
  assert.strictEqual(evaluateExpression('8 / 2 * 4'), (8 / 2) * 4, 'Should handle multiplication after division')

  // Multiplication and Division combined with Addition and Subtraction
  assert.strictEqual(evaluateExpression('2 + 3 * 4'), 2 + 3 * 4, 'Should respect multiplication before addition')
  assert.strictEqual(evaluateExpression('8 - 2 * 4'), 8 - 2 * 4, 'Should respect multiplication before subtraction')
  assert.strictEqual(evaluateExpression('8 / 2 - 4'), 8 / 2 - 4, 'Should respect division before subtraction')
  assert.strictEqual(
    evaluateExpression('1 + 2 * 3 - 4 / 2'),
    1 + 2 * 3 - 4 / 2,
    'Should handle multiple operations correctly',
  )

  // More complex expressions
  assert.strictEqual(
    evaluateExpression('1 + (2 * (2 + 3)) - 4'),
    1 + 2 * (2 + 3) - 4,
    'Should handle complex nested parentheses',
  )
  assert.strictEqual(
    evaluateExpression('((1 + 1) * 3 + (3 / 3)) - 2'),
    (1 + 1) * 3 + 3 / 3 - 2,
    'Should handle deeply nested parentheses',
  )
  assert.strictEqual(
    evaluateExpression('2 + 3 * (4 - 1) + 2 * 3'),
    2 + 3 * (4 - 1) + 2 * 3,
    'Should mix multiple operations with parentheses',
  )

  // Edge cases
  assert.strictEqual(evaluateExpression('2 * 2 + 3 * 3'), 2 * 2 + 3 * 3, 'Should calculate separate multiplication')
  assert.strictEqual(
    evaluateExpression('2 * (2 + 3 * 2) + 3'),
    2 * (2 + 3 * 2) + 3,
    'Should handle expressions starting with parentheses',
  )
  assert.strictEqual(
    evaluateExpression('2 + 3 * 4 - 5 / 5'),
    2 + 3 * 4 - 5 / 5,
    'Should handle all operations in one expression',
  )
  assert.strictEqual(
    evaluateExpression('18 / 2 * 3'),
    (18 / 2) * 3,
    'Should handle division followed by multiplication',
  )

  const results: any[] = []
  evaluateExpression('3pm America/Los_Angeles + 1 hour', value => {
    results.push(value)
    return 0
  })
  assert.deepStrictEqual(results, ['3pm America/Los_Angeles', '1 hour'])
})
