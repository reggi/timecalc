import {TimeCalc} from './timecalc.ts'

export default function timecalc(timezone, expression) {
  try {
    const pv = new TimeCalc(timezone)
    const results = pv.evaluate(expression)
    return {error: null, results}
  } catch (e) {
    return {error: e.message, results: null}
  }
}

export {timecalc}
