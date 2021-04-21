const express = require('express')
const router = express.Router()
const auth = require('../lib/auth')
const published = require('../lib/published')

// Publish book
router.post('/:id', auth, async (req, res) => {
   try {
      const id = req.params.id
      await published.publishBook(id)
      res.status(201).send()
   } catch (error) {
      console.error(error)
      res.status(400).send({
         success: false,
         message: error.message,
         data: { ...error },
      })
   }
})

// Unpublish book
router.delete('/:id', auth, async (req, res) => {
   try {
      const id = req.params.id
      await published.unpublishBook(id)
      res.status(204).send()
   } catch (error) {
      console.error(error)
      res.status(400).send({
         success: false,
         message: error.message,
         data: { ...error },
      })
   }
})

// Get published book
router.get('/:id', async (req, res) => {
   try {
      const id = req.params.id
      const book = await published.getPublishedBook(id)
      if (book) {
         res.status(200).send({ success: true, data: book })
      } else {
         res.status(200).send({ success: false })
      }
   } catch (error) {
      console.error(error)
      res.status(400).send({
         success: false,
         message: error.message,
         data: { ...error },
      })
   }
})

module.exports = router
