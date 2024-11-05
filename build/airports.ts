import items from '../data-source/airport-data-js/data/airports.json' with {type: 'json'}
import {loopTimezones} from './utils/utils.ts'

loopTimezones(items as unknown as any, ({store, item}) => {
  const {iata, time} = item
  if (!time || !iata) return null
  store.add(iata.toLowerCase(), time)
})

// const airportCodes = (_airportCodes as any)
// const store = new LowerCaseKeySetStore({ warn: true })
// const backHalf = (v) => v.split('/').pop().replaceAll('_', ' ').toLowerCase()
// airportCodes.forEach((airport) => {
//   const { iata, time } = airport
//   if (!time || !iata) return null
//   store.add(time, iata)
//   store.add(time, backHalf(time))
// })
// console.log(JSON.stringify(store));
