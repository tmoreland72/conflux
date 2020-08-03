import filter from 'lodash/filter'

const key = (collection, item, itemField, scopeField) => {
   return new Promise ((res) => {
      let key = item[itemField].replace(/[^A-Za-z0-9]/g,'_').toLowerCase()
      if (collection) {
         let uniq = false
         let counter = 1
         while (!uniq) {
            let filtered
            if (scopeField) {
               filtered = filter(collection, { key, [scopeField]: item[scopeField] })
            } else {
               filtered = filter(collection, { key })
            }

            if (filtered.length) {
               key = key + String(counter)
               counter++
            } else {
               uniq = true
            }
         }
      }
      res(key)
   })
}

const _random = (min, max) => {
   return Math.floor(Math.random() * (max - min)) + min
}

const uuid = props => {
   const {
      characters = "abcdefghijklmnopqrstuvwxyz0123456789",
      length = 6,
      prefix = "",
      regexp = "^[a-z]",
   } = props

   const regex = RegExp(regexp)
   let uid = ""

   while (uid.length < length || !regex.test(uid)) {
      if (uid.length === length) {
         uid = ""
      }
      uid = uid + characters[_random(0,characters.length-1)]
   }
   return prefix + uid
}

export { key, uuid }
