type Resolve = (existing: string, incombant: string) => string | undefined

export class UniqueKeyMap {
  warn: boolean = false
  map: Record<string, any> = {}
  resolve: Resolve = () => undefined
  constructor(
    opt: {
      resolve?: Resolve
      warn?: boolean
    } = {},
  ) {
    if (opt.warn) this.warn = opt.warn
    if (opt.resolve) this.resolve = opt.resolve
  }

  get value() {
    return this.map
  }

  get(key) {
    return this.map[key]
  }

  add(key, incombant) {
    if (this.map.hasOwnProperty(key)) {
      const existing = this.map[key]

      if (existing !== incombant) {
        // const value = this.resolve(existing, incombant)
        // if (value) {
        //   console.warn(`Resolved ${key} to ${value} from ${existing} / ${incombant}`)
        //   this.map[key] = value
        //   return
        // }

        if (this.warn) {
          console.warn(`Attempted to add ${key} with ${incombant}, removing existing value ${existing}`)
        }
        delete this.map[key]
      }
    } else {
      this.map[key] = incombant
    }
  }

  remove(key) {
    delete this.map[key]
  }

  getValue(key) {
    return this.map[key]
  }

  toJSON() {
    return this.map
  }
}
