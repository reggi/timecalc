export class KeySetStore {
  private store: {[key: string]: Set<string>} = {}
  private global = new Set<string>()

  handleCollision: 'throw' | 'warn'
  constructor(opts: {throw?: boolean; warn?: boolean} = {}) {
    this.handleCollision = opts.throw === true ? 'throw' : opts.warn ? 'warn' : 'throw'
  }

  get throw() {
    return this.handleCollision === 'throw'
  }

  get warn() {
    return this.handleCollision === 'warn'
  }

  private addGlobal(item: string) {
    this.global.add(item)
  }

  delete(key: string) {
    if (this.store[key]) {
      delete this.store[key]
      return true
    }
    return false
  }

  get(key: string) {
    return this.store[key]
  }

  find(value: string) {
    for (const key in this.store) {
      if (this.store[key].has(value)) {
        return key
      }
    }
    return null
  }

  add(key: string, item: string) {
    if (!this.store[key]) {
      this.store[key] = new Set<string>()
    }

    if (this.store[key].has(item)) {
      return
    }

    if (this.global.has(item)) {
      const foundKey = this.find(item)
      const message = `Can't add '${item}' to "${key}" already exists in '${foundKey}'`
      if (this.throw) {
        throw new Error(message)
      } else if (this.warn) {
        console.warn(message)
      }
    }

    this.store[key].add(item)
    this.addGlobal(item)
  }

  toJSON() {
    return Object.fromEntries(
      Object.entries(this.store).map(([key, value]: [string, Set<string>]) => {
        return [key, Array.from(value)]
      }),
    )
  }
}
