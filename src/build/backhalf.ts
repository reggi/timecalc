import moment from 'moment-timezone'
import {loopTimezones} from '../utils.ts'

loopTimezones(moment.tz.names(), ({store, item}) => {
  if (item.includes('/')) {
    const key = item.split('/').pop().replaceAll('_', ' ').toLowerCase()
    store.add(key.toLowerCase(), item)
    store.add(item.toLowerCase(), item)
  }
})
