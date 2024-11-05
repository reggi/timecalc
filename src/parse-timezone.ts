import data from '../data/merge.json' with {type: 'json'}

export function stringToTimezone(v: string) {
  v = v.toLowerCase()
  if (data[v]) {
    return data[v]
  }
  throw new Error(`Invalid input ${v}`)
}

function removeSubstring(str: string, substring: string) {
  const index = str.indexOf(substring)
  if (index !== -1) {
    str = str.slice(0, index) + str.slice(index + substring.length)
  }
  // convert multiples space to one space
  str = str.replace(/\s+/g, ' ')
  return str.trim()
}

function parseTimezoneV1(raw: string) {
  // sort legend keys
  const keys = Object.keys(data).sort((a, b) => b.length - a.length)
  // search for key in raw string
  for (const key of keys) {
    const index = raw.indexOf(key)
    if (index !== -1) {
      // return the value of the key
      return {
        // remove the key from the raw string
        value: removeSubstring(raw, key),
        timezone: data[key],
      }
    }
  }
  return {value: raw}
}

function parseTimezoneV2(raw: string) {
  const items = raw.split(' ')
  for (const item of items) {
    const timezone = data[item.toLowerCase()]
    if (timezone) {
      items.splice(items.indexOf(item), 1)
      return {
        value: items.join(' '),
        timezone,
      }
    }
  }
  return {value: raw}
}

function removeSubstringV2(raw: string, substring: string, index: number): string {
  return raw.substring(0, index) + raw.substring(index + substring.length).trim()
}

function isWholeWordMatch(raw: string, substring: string, index: number): boolean {
  const startOk = index === 0 || [' ', '/'].includes(raw[index - 1])
  const endOk = index + substring.length === raw.length || [' ', '/'].includes(raw[index + substring.length])
  return startOk && endOk
}

function parseTimezoneV3(raw: string) {
  raw = raw.toLowerCase()
  const keys = Object.keys(data).sort((a, b) => b.length - a.length)
  let bestMatch: {value: string; timezone: string} | null = null
  let longest = 0

  // search for key in raw string and find the longest valid (whole word) match
  for (const key of keys) {
    let index = raw.indexOf(key)
    while (index !== -1) {
      if (isWholeWordMatch(raw, key, index)) {
        if (key.length > longest) {
          longest = key.length
          bestMatch = {
            value: removeSubstringV2(raw, key, index).trim(),
            timezone: data[key],
          }
        }
      }
      // Continue searching from the next character after the current index
      index = raw.indexOf(key, index + 1)
    }
  }

  return bestMatch || {value: raw, timezone: undefined}
}

export const parseTimezone = parseTimezoneV3
