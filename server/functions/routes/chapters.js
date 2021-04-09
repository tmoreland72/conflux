const express = require('express')

const router = express.Router()
const chapters = require('../lib/chapters')

router.post('/', async (req, res) => {
   try {
      let chapter = req.body
      chapter = await chapters.create(req, chapter)
      res.status(201).send({
         success: true,
         message: 'created',
         data: chapter,
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
      let chapter = req.body
      chapter = await chapters.update(req, chapter)
      res.status(200).send({
         success: true,
         message: 'updated',
         data: chapter,
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
      let id = req.params.id
      await chapters.del(req, id)
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
