import {evaluate} from './evaluate.ts'
import {formatMs} from './format-ms.ts'
import {parseDate} from './parse-date.ts'
import {TimeCalc} from './timecalc.ts'

export default function timecalc(timezone, expression) {
  try {
    const calc = new TimeCalc(timezone)
    let evaluated: number = evaluate(expression, calc.parser(parseDate))
    evaluated = calc.postEvaluate(evaluated)
    const results = formatMs(evaluated, calc.tags, calc.timezone)
    return {error: null, results}
  } catch (e) {
    return {error: e.message, results: null}
  }
}

export {timecalc}
