const express = require('express')
const jwtDecode = require('jwt-decode')

const router = express.Router()
const users = require('../lib/users')

router.post('/login', async (req, res) => {
   try {
      let { email, password } = req.body
      const result = await users.login(req, { email, password })
      res.status(200).send(result)
   } catch (error) {
      res.status(400).send({
         success: false,
         message: error.message,
         data: { ...error },
      })
   }
})

router.post('/reset', async (req, res) => {
   try {
      let { email } = req.body
      const result = await users.resetPassword(req, email)
      res.status(200).send(result)
   } catch (error) {
      res.status(400).send({
         success: false,
         message: error.message,
         data: { ...error },
      })
   }
})

router.post('/register', async (req, res) => {
   try {
      let user = req.body
      const result = await users.register(req, user)
      res.status(200).send(result)
   } catch (error) {
      res.status(400).send({
         success: false,
         message: error.message,
         data: { ...error },
      })
   }
})

module.exports = router
