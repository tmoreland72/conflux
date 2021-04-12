const jwt = require('jsonwebtoken')

const users = require('./users')

const auth = async (req, res, next) => {
   try {
      const token = req.header('Authorization').replace('Bearer ', '')
      const data = jwt.verify(token, process.env.APP_JWTSECRET)
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
