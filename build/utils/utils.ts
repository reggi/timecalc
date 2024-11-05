import {DateTime} from 'luxon'
import {UniqueKeyMap} from './unique-key-map.ts'

export function validTimezone(timezone: string) {
  return DateTime.now().setZone(timezone)
}

export function fromTimezone(timezone: string, time: DateTime) {
  return time.setZone(timezone, {keepLocalTime: true})
}

export function getUtcOffset(timezone: string) {
  const dateTime = DateTime.now().setZone(timezone)
  return dateTime.toFormat('ZZ')
}

export function resolveOffesetOrTimezone(offset: string, timezone: string) {
  // check if it's the same
  if (getUtcOffset(timezone) === offset) {
    return timezone
  }
  return undefined
}

export function loop(items: any[], handle: ({store, item}) => void, store = new UniqueKeyMap({warn: true})) {
  items.forEach(item => {
    handle({store, item})
  })
  console.log(JSON.stringify(store, null, 2))
}

export function loopTimezones(items: any[], handle: ({store, item}) => void) {
  loop(items, handle, new UniqueKeyMap({warn: true, resolve: resolveOffesetOrTimezone}))
}
