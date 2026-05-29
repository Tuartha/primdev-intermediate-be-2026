const cache = {}

export const setCache = (key, value, ttlSeconds = 300) => {
    cache[key] = {
        value: value,
        expiry: Date.now() + ttlSeconds * 1000,
    }
}

export const getCache = (key) => {
    const entry = cache[key]
    if (!entry) return null
    if(Date.now() > entry.expiry) {
        delete cache[key]
        return null
    }
    return entry.value
}

export const clearCache = (key) => {
  delete cache[key]
}

export const clearAllCache = () => {
  Object.keys(cache).forEach((key) => delete cache[key])
}