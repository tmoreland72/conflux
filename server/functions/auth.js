const fb = require("./firebase")

exports.get = async (props) => {
   const { userId, email, phoneNumber } = props

   let result = false
   if (userId) {
      result = await fb.authGetById(userId)
      .then(result => {
         return result
      })
      .catch(err => {
         console.error(err)
         return false
      })
   } else if (email) {
      result = await fb.authGetByEmail(email)
      .then(result => {
         return result
      })
      .catch(err => {
         console.error(err)
         return false
      })
   } else if (phoneNumber) {
      result = await fb.authGetByPhoneNumber(phoneNumber)
      .then(result => {
         return result
      })
      .catch(err => {
         console.error(err)
         return false
      })
   }

   return result
}

exports.add = async (props) => {
   const { userId, item } = props
   let payload = { userId, item }
   let result = await fb.authAdd(payload)
   if (result) {
      return item
   } else {
      return false
   }
}

exports.delete = async (userId) => {
   let result = await fb.authDelete(userId)
   return !!result
}
