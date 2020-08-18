import { Cookies } from 'quasar'

export function get(key) {
   return Cookies.get(key)
}

export function getAll() {
   return Cookies.getAll()
}

export function has(key) {
   return Cookies.has(key)
}

export function set(key, value) {
   return Cookies.set(key, value)
}

export function remove(key) {
   return Cookies.remove(key)
}

export function removeAll() {
   let cookies = Cookies.getAll()
   Object.keys(cookies).map(key => {
      Cookies.remove(key)
   })
}
