import moment from 'moment-timezone'
import {loopTimezones} from '../utils.ts'

loopTimezones(moment.tz.names(), ({store, item}) => {
  const now = moment.tz(item)
  const abbr = now.zoneAbbr()
  const offset = now.format('Z')
  if (!/^[a-zA-Z]+$/.test(abbr)) return
  store.add(abbr.toLowerCase(), `UTC${offset}`)
})
