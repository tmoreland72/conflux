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

exports.retrieve = async (req, res) => {
   const REQUESTER = req.body

   let response = []
   try {
      const SPACES = await getAllSpaces()
      if (SPACES) {
         SPACES.map(space => {
            // Return requester owned Spaces
            if (space.ownerId === REQUESTER.uid) {
               space.authorizations = { admin: true }
               response.push(space)
               return false
            }

            // Private Spaces
            if (space.private) return false

            // Return Spaces in same domain with ADMIN or READ permissions
            if (space.permissions && space.tenantId === REQUESTER.tenantId &&
               ( space.permissions.domain.admin || space.permissions.domain.read )
            ) {
               space.authorizations = {}
               Object.keys(space.permissions.domain).map(key => {
                  space.authorizations[key] = space.permissions.domain[key]
               })
               response.push(space)
               return false
            }

            // Return Spaces giving public permissions to Requester
            if (space.permissions) {
               space.permissions.public.map(perm => {
                  if (perm.email === REQUESTER.email &&
                     ( perm.admin || perm.read )
                  ) {
                     space.authorizations = {}
                     Object.keys(perm).map(key => {
                        if (key === 'email') return false
                        space.authorizations[key] = perm[key]
                     })
                     response.push(space)
                     return false
                  }
               })
            }
         })
         res.status(200).send(response)
      } else {
         res.status(200).send([])
      }
   } catch (err) {
      res.status(400).send(err)
   }
}

exports.update = async (req, res) => {
   const { updatedBy, updates } = req.body
   const tenantId = req.params.tenantId
   const spaceId = req.params.id

   // Safeguard from saving authorizations
   delete updates.authorizations

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
      await db.delete(payload)
      res.status(204).send()
   } catch(err) {
      console.error('firebase/spaces', 'delete', err)
      res.status(400).send('Bad Request')
   }
}

const getAllSpaces = async () => {
   let payload = {
      collectionGroup: 'spaces'
   }
   try {
      return await db.get(payload)
   } catch (err) {
      return false
   }
}
