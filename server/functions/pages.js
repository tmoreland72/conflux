const moment = require('moment')
const merge = require('lodash/merge')

const db = require('./db')

exports.get = async (req, res) => {
   const tenantId = req.params.tenantId
   let payload = {
      collection: 'tenants',
      collectionId: tenantId,
      subcollection: 'pages',
   }

   try {
      let result = await db.get(payload)
      res.status(200).send(result)
   } catch (err) {
      res.status(200).send([])
   }
}

exports.getById = async (req, res) => {
   const tenantId = req.params.tenantId
   const id = req.params.id
   let payload = {
      collection: 'tenants',
      collectionId: tenantId,
      subcollection: 'pages',
      subcollectionId: id,
   }

   try {
      let result = await db.get(payload)
      res.status(200).send(result)
   } catch (err) {
      res.status(200).send([])
   }
}

exports.create = async (req, res) => {
   const { createdBy, item } = req.body
   const tenantId = req.params.tenantId
   let payload = {
      collection: 'tenants',
      collectionId: tenantId,
      subcollection: 'pages',
      subcollectionId: item.id,
      metadata: {
         createdBy,
         createdOn: moment().format('X'),
      },
      item,
   }

   try {
      let result = await db.add(payload)
      res.status(201).send(result)
   } catch (err) {
      console.error('firebase/pages', 'create', err)
      res.status(400).send('Bad Request')
   }
}

exports.retrieve = async (req, res) => {
   //TODO locate individual shared pages
   const { REQUESTER, SPACES } = req.body
   let response = []
   try {
      Promise.all(SPACES.map(async space => {
         let payload = {
            collectionGroup: 'pages',
            where: ['spaceId', '==', space.id],
         }
         let pages = await db.get(payload)
         pages.map(page => {
            response.push(page)
         })
      }))
         .then(() => {
            res.status(200).send(response)
         })
   } catch (err) {
      console.error(err)
      res.status(400).send(err)
   }

}

exports.update = async (req, res) => {
   const { updatedBy, updates } = req.body
   const tenantId = req.params.tenantId
   const pageId = req.params.id
   let payload = {
      collection: 'tenants',
      collectionId: tenantId,
      subcollection: 'pages',
      subcollectionId: pageId,
   }
   let current = await db.get(payload)

   let metadata = {
      updatedBy,
      updatedOn: moment().format('X'),
   }
   updates.metadata = merge(current.metadata, metadata)

   payload = {
      collection: 'tenants',
      collectionId: tenantId,
      subcollection: 'pages',
      subcollectionId: pageId,
      updates,
   }

   try {
      await db.update(payload)
      res.status(200).send()
   } catch (err) {
      res.status(400).send('Bad Request')
   }
}

exports.delete = async (req, res) => {
   const tenantId = req.params.tenantId
   const pageId = req.params.id
   let payload = {
      collection: 'tenants',
      collectionId: tenantId,
      subcollection: 'pages',
      subcollectionId: pageId,
   }

   try {
      let result = await db.delete(payload)
      res.status(204).send()
   } catch (err) {
      console.error('firebase/pages', 'delete', err)
      res.status(400).send('Bad Request')
   }
}
