export default class Cacher {
  constructor (options) {
    this.cacheMap = new Map()
    this.maxCacheSize = options.maxCacheSize || 15
    this.ttl = options.ttl || 60 * 60 * 1000
    this.filters = options.filters || []
  }

  _needCache (option) {
    return this.filters.some(item => {
      return item === option.url
    })
  }

  _getCache (option) {
    let key = this._formatCacheKey(option)
    return JSON.parse(this.cacheMap.get(key).data)
  }

  _setCache (option, val) {
    let key = this._formatCacheKey(option)
    if (this.maxCacheSize && this.cacheMap.size >= this.maxCacheSize) {
      this.cacheMap.delete([...this.cacheMap.keys()][0])
    }
    let timeout = new Date().getTime() + this.ttl
    return this.cacheMap.set(key, {
      timeout: timeout,
      data: JSON.stringify(val)
    })
  }

  _hasCache (option) {
    let key = this._formatCacheKey(option)
    return this.cacheMap.has(key)
  }

  _formatCacheKey (option) {
    let key = option.url
    if (option.params) {
      let keyMap = Object.keys(option.params)
      keyMap.sort()
      let obj = {}
      keyMap.forEach(i => {
        obj[i] = JSON.parse(JSON.stringify(option.params[i]))
      })
      let paramsStr = JSON.stringify(obj)
      key += `?${paramsStr}`
    }
    return key
  }

  _cacheIfTimeout (option) {
    let key = this._formatCacheKey(option)
    let { timeout } = this.cacheMap.get(key)
    return timeout < new Date().getTime()
  }

  _clear () {
    this.cacheMap.clear()
  }

  _addFilter (key) {
    if (!this.filters.includes(key)) {
      this.filters.push(key)
    }
  }

  _removeFilter (key) {
    let index = this.filters.indexOf(key)
    if (~index) {
      this.filters.splice(index, 1)
    }
  }
} 