import moment from 'moment-timezone'
import {loopTimezones} from '../utils.ts'

// Function to format offset in UTC±HH:mm format, rounding to the nearest minute
function formatOffset(offset) {
  const sign = offset > 0 ? '-' : '+' // Invert sign because moment.js uses negative offset for east of UTC
  let totalMinutes = Math.round(Math.abs(offset)) // Convert to absolute minutes and round
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

// Function to get all unique offsets and abbreviations for a given time zone, excluding LMT
function getTimeZoneDetails(zone) {
  const zoneData = moment.tz.zone(zone)
  const details = {} // Use an object to map abbr to offset

  zoneData.untils.forEach((until, index) => {
    const abbr = zoneData.abbrs[index]
    if (abbr !== 'LMT') {
      // Exclude Local Mean Time entries
      const offset = zoneData.offsets[index]
      details[abbr] = formatOffset(offset)
    }
  })

  return details
}

// Retrieve details for each time zone, excluding those with only 'LMT'
const allZonesDetails = moment.tz.names().reduce((acc, zone) => {
  const zoneDetails = getTimeZoneDetails(zone)
  if (Object.keys(zoneDetails).length > 0) {
    // Only include zones with non-LMT entries
    acc[zone] = zoneDetails
  }
  return acc
}, {})

const v = Object.values(allZonesDetails).map(Object.entries).flat()

loopTimezones(v, ({store, item}) => {
  const [abbr, offset] = item
  if (!/^[a-zA-Z]+$/.test(abbr)) return
  store.add(abbr.toLowerCase(), offset)
})
