const crypto = require('crypto')
const CryptoJS = require('crypto-js')

exports.hash = async (clearText) => {
   return new Promise((res, rej) => {
      const salt = crypto.randomBytes(16).toString('hex')
      crypto.scrypt(clearText, salt, 64, (err, derivedKey) => {
         if (err) rej(err)
         res(`${salt}:${derivedKey.toString('hex')}`)
      })
   })
}

exports.verify = async (clearText, hash) => {
   return new Promise(async (res, rej) => {
      try {
         const [salt, key] = hash.split(':')
         crypto.scrypt(clearText, salt, 64, (err, derivedKey) => {
            if (err) rej(err)
            res(key === derivedKey.toString('hex'))
         })
      } catch (error) {
         console.error(error.message)
         rej(error)
      }
   })
}

function convertBase64(string) {
   try {
      var wordArr = CryptoJS.enc.Utf8.parse(string)
      var result = CryptoJS.enc.Base64.stringify(wordArr)
      return result
   } catch (error) {
      console.error('convertBase64', error)
   }
}

exports.createJWT = ({ payload }) => {
   try {
      const header = convertBase64(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
      const secret = process.env.APP_JWTSECRET
      payload = convertBase64(JSON.stringify(payload))

      let sign = CryptoJS.HmacSHA256(`${header}.${payload}`, secret)
      sign = CryptoJS.enc.Base64.stringify(sign)

      const jwt = `${header}.${payload}.${sign}`
      return jwt
   } catch (error) {
      console.error('createJWT', error)
   }
}
