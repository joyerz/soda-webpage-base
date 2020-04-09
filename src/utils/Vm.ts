

export default class Vm<T> {
  data: T

  dataCache: T

  constructor(data: T) {
    this.data = data
    this.dataCache = JSON.parse(JSON.stringify(data))
    this.defineProperty()
  }

  defineProperty() {
    const thisdata = this.data
    const dataCache: any = this.dataCache
    Object.keys(thisdata).forEach(k => {
      const el = <HTMLElement>document.getElementById(k)
      Object.defineProperty(thisdata, k, {
        get() {
          return dataCache[k]
        },
        set(val) {
          if (val === dataCache[k]) return
          dataCache[k] = val
          if (el) {
            el.innerHTML = val
          }
        }
      })
    })
  }

  set(k: keyof T, v: T[keyof T]) {
    this.data[k] = v
    return this
  }
}