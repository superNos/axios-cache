import Cacher from './cacher'

export default function wraper (instance, options) {
  const cacher = new Cacher(options)

  const unCacheMethod = [
    'post',
    'delete',
    'head',
    'put',
    'patch',
    'options'
  ]

  function requestWithCacheCheck (option, reqFunc, ...arg) {
    if (cacher._needCache(option)) {
      if (cacher._hasCache(option) && !cacher._cacheIfTimeout(option)) {
        return Promise.resolve({
          _fromAxiosCache: true,
          ...cacher._getCache(option)
        })
      } else {
        return reqFunc(...arg).then(res => {
          cacher._setCache(option, res)
          return res
        })
      }
    } else {
      return instance(...arg)
    }
  }

  function axiosWithCache (...arg) {
    if (arg.length == 1 && (arg[0].method === 'get' || arg[0].method === undefined)) {
      return requestWithCacheCheck(arg[0], instance.get, ...arg)
    } else {
      return instance(...arg)
    }
  }
  
  axiosWithCache.get = function (...arg) {
    if (arg.length == 1) {
      return requestWithCacheCheck({
        url: arg[0]
      }, instance.get, ...arg)
    } else if (arg.length == 2) {
      return requestWithCacheCheck({
        url: arg[0],
        ...arg[1]
      }, instance.get, ...arg)
    } else {
      return instance(...arg)
    }
  }

  unCacheMethod.forEach(method => {
    axiosWithCache[method] = (...arg) => {
      return instance[method](...arg)
    }
  })

  axiosWithCache.addFilter = (key) => {
    cacher._addFilter(key)
  }

  axiosWithCache.removeFilter = (key) => {
    cacher._removeFilter(key)
  }

  axiosWithCache.clear = () => {
    cacher._clear()
  }

  return axiosWithCache

}