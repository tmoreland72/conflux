import { LocalStorage } from 'quasar'

export function get(key) {
   return LocalStorage.getItem(key)
}

export function getAll() {
   return LocalStorage.getAll()
}

export function has(key) {
   return LocalStorage.has(key)
}

export function set(key, value) {
   return LocalStorage.set(key, value)
}

export function remove(key) {
   return LocalStorage.remove(key)
}

export function removeAll() {
   return LocalStorage.clear()
}
