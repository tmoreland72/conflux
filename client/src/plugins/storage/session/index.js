import { SessionStorage } from 'quasar'

export function get(key) {
   return SessionStorage.getItem(key)
}

export function getAll() {
   return SessionStorage.getAll()
}

export function has(key) {
   return SessionStorage.has(key)
}

export function set(key, value) {
   return SessionStorage.set(key, value)
}

export function remove(key) {
   return SessionStorage.remove(key)
}

export function removeAll() {
   return SessionStorage.clear()
}
