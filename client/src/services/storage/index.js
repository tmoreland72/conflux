import plugins from './plugins'

export function get(storage, key) {
   return plugins[storage].get(key)
}

export function getAll(storage) {
   return plugins[storage].getAll()
}

export function has(storage, key) {
   return plugins[storage].has(key)
}

export function set(storage, key, value) {
   return plugins[storage].set(key,value)
}

export function remove(storage, key) {
   return plugins[storage].remove(key)
}

export function removeAll(storage) {
   return plugins[storage].removeAll()
}
