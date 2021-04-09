const jwt = require('jsonwebtoken')
const functions = require('firebase-functions')

const users = require('./users')

const config = functions.config()

const auth = async (req, res, next) => {
   try {
      const token = req.header('Authorization').replace('Bearer ', '')
      const data = jwt.verify(token, config.app.jwtsecret)
      const user = await users.getByEmail(data.email)
      if (!user) {
         throw new Error()
      }

      req.user = user
      req.token = token
      next()
   } catch (error) {
      res.status(401).send({ error: 'Not authorized' })
   }
}

module.exports = auth
