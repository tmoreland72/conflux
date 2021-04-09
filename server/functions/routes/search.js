const express = require('express')

const router = express.Router()
const algolia = require('../lib/algolia')

router.post('/', async (req, res) => {
   try {
      let request = req.body
      results = await algolia.search(request)
      res.status(200).send({
         success: true,
         message: 'created',
         data: results,
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
