const express = require('express')

const router = express.Router()
const books = require('../lib/books')

router.post('/', async (req, res) => {
   try {
      let book = req.body
      book = await books.create(req, book)
      res.status(201).send({
         success: true,
         message: 'created',
         data: book,
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
      let changes = { ...req.body }
      const book = await books.update(req, { id, changes })
      res.status(200).send({
         success: true,
         message: 'updated',
         data: book,
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
      await books.del(req, id)
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

module.exports = router
