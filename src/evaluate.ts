const parseFraction = input => {
  const parts = input.split('/')
  return parts.length === 2 ? parseFloat(parts[0]) / parseFloat(parts[1]) : parseFloat(input)
}

const parseNumber = input => {
  if (typeof input === 'string' && input.includes('/')) {
    return parseFraction(input.trim())
  } else if (typeof input === 'string') {
    return parseFloat(input)
  } else if (typeof input === 'number') {
    return input
  }
  throw new Error(`Invalid input: ${input}`)
}

export function evaluateExpression(expression, transform = parseNumber) {
  // Handle parentheses first and ensure spaces are managed correctly around operators
  expression = expression.replace(/\s+/g, ' ')
  const operatorRegex = /[\+\-\*\/\%]/
  const parenthesesRegex = /\(([^()]+)\)/

  // Evaluate any expressions within parentheses
  while (parenthesesRegex.test(expression)) {
    expression = expression.replace(parenthesesRegex, (match, subExpression) =>
      evaluateExpression(subExpression, transform),
    )
  }

  // Function to apply an operator to two operands
  const applyOperation = (a, op, b) => {
    switch (op) {
      case '+':
        return a + b
      case '-':
        return a - b
      case '*':
        return a * b
      case '/':
        return a / b // should handle division by zero
      case '%':
        return a % b
      default:
        return NaN
    }
  }

  const trim = value => {
    if (typeof value === 'string') {
      return value.trim()
    }
    return value
  }

  // Split and process each token based on the presence of operators
  let tokens = expression
    .split(/([\+\-])/)
    .filter(Boolean)
    .map(token =>
      /\d\s*[/\*%]\s*\d/.test(token)
        ? token.split(/([\*\/\%])/).reduce((acc, val) => {
            if (operatorRegex.test(val)) {
              acc.push(val)
            } else if (acc.length && operatorRegex.test(acc[acc.length - 1])) {
              let operator = acc.pop()
              let leftOperand = acc.pop()
              acc.push(applyOperation(transform(trim(leftOperand)), operator, transform(trim(val))))
            } else {
              acc.push(val)
            }
            return acc
          }, [])
        : token,
    )

  const flatTokens = tokens.flat()
  if (flatTokens.length === 1) return transform(trim(flatTokens[0]))

  // Flatten the tokens array and evaluate addition and subtraction
  tokens = flatTokens.reduce((acc, val) => {
    if (operatorRegex.test(val)) {
      acc.push(val)
    } else if (acc.length && operatorRegex.test(acc[acc.length - 1])) {
      let operator = acc.pop()
      let leftOperand = acc.pop()
      acc.push(applyOperation(transform(trim(leftOperand)), operator, transform(trim(val))))
    } else {
      acc.push(val)
    }
    return acc
  }, [])

  return tokens.length === 1 ? tokens[0] : NaN
}
