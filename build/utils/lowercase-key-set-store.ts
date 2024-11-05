import {KeySetStore} from './key-set-store.ts'

export class LowerCaseKeySetStore extends KeySetStore {
  delete(k: string) {
    return super.delete(k.toLowerCase())
  }

  find(k: string) {
    return super.find(k.toLowerCase())
  }

  get(k: string) {
    return super.get(k.toLowerCase())
  }

  add(k: string, v: string) {
    return super.add(k.toLowerCase(), v.toLowerCase())
  }
}
