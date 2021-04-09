const express = require('express')

const router = express.Router()
const pages = require('../lib/pages')

router.post('/', async (req, res) => {
   try {
      let page = req.body
      page = await pages.create(req, page)
      res.status(201).send({
         success: true,
         message: 'created',
         data: page,
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
      let page = req.body
      page = await pages.update(req, page)
      res.status(200).send({
         success: true,
         message: 'updated',
         data: page,
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
      await pages.del(req, id)
      res.status(200).send({
         success: true,
         message: 'deleted',
         data: { id },
      })
   } catch (error) {
      console.error('pages', 'delete', error.message)
      res.status(400).send({
         success: false,
         message: error.message,
         data: { ...error },
      })
   }
})

module.exports = router
