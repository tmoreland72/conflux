const moment = require('moment')
const merge = require('lodash/merge')

const db = require('./db')

exports.get = async (req, res) => {
   const tenantId = req.params.tenantId
   let payload = {
      collection: 'tenants',
      collectionId: tenantId,
      subcollection: 'spaces',
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
      subcollection: 'spaces',
      subcollectionId: id
   }

   try {
      let result = await db.get(payload)
      console.log('result', result)
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
      subcollection: 'spaces',
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
   } catch(err) {
      console.error('firebase/spaces', 'create', err)
      res.status(400).send('Bad Request')
   }
}

exports.update = async (req, res) => {
   const { updatedBy, updates } = req.body
   const tenantId = req.params.tenantId
   const spaceId = req.params.id
   let payload = {
      collection: 'tenants',
      collectionId: tenantId,
      subcollection: 'spaces',
      subcollectionId: spaceId
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
      subcollection: 'spaces',
      subcollectionId: spaceId,
      updates,
   }

   try {
      await db.update(payload)
      res.status(200).send()
   } catch(err) {
      res.status(400).send('Bad Request')
   }
}

exports.delete = async (req, res) => {
   const tenantId = req.params.tenantId
   const spaceId = req.params.id
   let payload = {
      collection: 'tenants',
      collectionId: tenantId,
      subcollection: 'spaces',
      subcollectionId: spaceId,
   }

   try {
      let result = await db.delete(payload)
      res.status(204).send()
   } catch(err) {
      console.error('firebase/spaces', 'delete', err)
      res.status(400).send('Bad Request')
   }
}
