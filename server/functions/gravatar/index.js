const md5 = require("md5")

const baseUrl = "https://www.gravatar.com/avatar/"
const urlSuffix = "?d=identicon&s=640"

exports.generate = item => {
   let hashSeed = item.email ? item.email : JSON.stringify(item)
   let hashValue = md5(hashSeed)
   return baseUrl + hashValue + urlSuffix
}