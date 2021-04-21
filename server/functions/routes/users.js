const express = require('express')

const router = express.Router()
const users = require('../lib/users')
const { fireauth } = require('../services/firebase')

router.get('/email/:email', async (req, res) => {
   try {
      const email = req.params.email
      const user = await users.getByEmail(email)
      res.status(200).send({
         success: true,
         message: 'found',
         data: user,
      })
   } catch (error) {
      res.status(400).send({
         success: false,
         message: error.message,
         data: { ...error },
      })
   }
})

router.patch('/:id', async (req, res) => {
   try {
      const id = req.params.id
      let changes = {
         ...req.body,
         updated: new Date().valueOf(),
      }
      const updatedUser = await users.update(req, { id, changes })
      res.status(200).send({
         success: true,
         message: 'updated',
         data: updatedUser,
      })
   } catch (error) {
      res.status(400).send({
         success: false,
         message: error.message,
         data: { ...error },
      })
   }
})

router.delete('/:id', async (req, res) => {
   try {
      const id = req.params.id
      await users.del(req, id)
      res.status(200).send({
         success: true,
         message: 'deleted',
         data: { id },
      })
   } catch (error) {
      res.status(400).send({
         success: false,
         message: error.message,
         data: { ...error },
      })
   }
})

router.get('/token/:id', async (req, res) => {
   try {
      const id = req.params.id
      const token = await fireauth.createCustomToken(id)
      res.status(200).send({
         success: true,
         message: 'success',
         data: token,
      })
   } catch (error) {
      console.error('users createCustomToken', error)
   }
})

module.exports = router
