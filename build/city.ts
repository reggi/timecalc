import items from '../data-source/city-timezones/data/cityMap.json' with {type: 'json'}
import {loopTimezones} from './utils/utils.ts'

loopTimezones(items, ({store, item}) => {
  const {city, timezone} = item
  if (!timezone || !city) return null
  store.add(city.toLowerCase(), timezone)
})
