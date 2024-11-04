import {TimeCalc} from './timecalc.ts'

export default function timecalc(timezone, expression) {
  try {
    return {error: null, results: TimeCalc.evaluate(timezone, expression)}
  } catch (e) {
    return {error: e.message, results: null}
  }
}

export {timecalc}
