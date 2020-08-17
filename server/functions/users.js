const functions = require('firebase-functions')
const moment = require('moment')
const uid = require('uid')
const merge = require('lodash/merge')

const gravatar = require('./gravatar')
const auth = require('./auth')
const db = require('./db')

exports.getByTenant = async (req, res) => {
   const tenantId = req.params.tenantId
   let payload = {
      collection: 'users',
      where: ['tenantId', '==', tenantId],
   }
   let result = await db.get(payload)

   if (result) {
      res.status(200).send(result)
   } else {
      res.status(404)
   }
}

exports.getByUserId = async (req, res) => {
   const tenantId = req.params.tenantId
   const userId = req.params.userId
   let payload = {
      collection: 'users',
      collectionId: userId,
   }
   let result = await db.get(payload)

   if (result) {
      if (tenantId === 'all' || result.tenantId === tenantId) {
         res.status(200).send(result)
      } else {
         res.status(404).send({})
      }
   } else {
      res.status(404).send({})
   }
}

exports.getUserId = async (req, res) => {
   const email = req.query.email ? req.query.email : null
   const mobile = req.query.mobile ? req.query.mobile : null

   let where
   if (email) where = ['email', '==', email]
   if (mobile) where = ['mobile', '==', mobile]

   let payload = {
      collection: 'users',
      where,
   }
   let result = await db.get(payload)
   if (result && result.length === 1) {
      res.status(200).send(result[0].id)
   } else {
      res.status(404).send({})
   }
}

exports.create = async (req, res) => {
   const {
      createdBy,
      item,
   } = req.body
   const tenantId = req.params.tenantId ? req.params.tenantId : uid()
   const userId = item.id
   const password = item.id
   const creator = createdBy ? createdBy : userId

   let user = {
      ...item,
      tenantId,
      userId,
      password,
      image: gravatar.generate(item),
   }

   await _createAuthUser(user)
      .then(async () => {
         !req.params.tenantId ? await _createTenant(tenantId, creator) : true
      })
      .then(async () => {
         await _createUser(tenantId, creator, user)
      })
      .then(() => {
         res.status(201).send(user)
      })
      .catch(err => {
         console.error('firebase/users.js', 'create', 'err', err)
         res.status(200).send(err)
      })
}

exports.update = async (req, res) => {
   const { updatedBy, updates } = req.body
   const userId = req.params.userId
   let current = await db.get({ collection: 'users', collectionId: userId })

   let metadata = {
      updatedBy,
      updatedOn: moment().format('X'),
   }
   updates.metadata = merge(current.metadata, metadata)

   let payload = {
      collection: 'users',
      collectionId: userId,
      updates,
   }
   let result = await db.update(payload)
      .then(async () => {
         return await db.get({ collection: 'users', collectionId: userId })
      })
      .catch(err => {
         console.error('firebase/users.js', 'update', 'err', err)
         return false
      })

   if (result) {
      res.status(200).send(result)
   } else {
      res.status(400).send('Bad Request')
   }
}

exports.delete = async (req, res) => {
   const tenantId = req.params.tenantId
   const userId = req.params.userId
   let result = await auth.delete(userId)
      .then(() => {
         return true
      })
      .catch(err => {
         console.error('firebase/users.js', 'delete', 'err', err)
         return false
      })

   if (result) {
      res.status(204).send()
   } else {
      res.status(400).send('Bad Request')
   }
}

exports.getSubcollectionItems = async (req, res) => {
   const userId = req.params.userId
   const subcollection = req.params.subcollection
   let payload = {
      collection: 'users',
      collectionId: userId,
      subcollection,
   }
   let items = await db.get(payload)
   if (items) {
      res.status(200).send(items)
   } else {
      res.status(404).send({})
   }
}

exports.addSubcollectionItem = async (req, res) => {
   console.log('addSubcollectionItem')
   const { createdBy, item } = req.body
   const userId = req.params.userId
   const subcollection = req.params.subcollection

   let payload = {
      collection: 'users',
      collectionId: userId,
      subcollection,
      subcollectionId: item.id,
      item: {
         ...item,
         metadata: {
            createdBy,
            createdOn: moment().format('X'),
         },
      },
   }
   let result = await db.add(payload)

   if (result) {
      res.status(200).send(result)
   } else {
      res.status(400).send({})
   }
}

exports.deleteSubcollectionItem = async (req, res) => {
   const userId = req.params.userId
   const subcollection = req.params.subcollection
   const subcollectionId = req.params.subcollectionId
   let payload = {
      collection: 'users',
      collectionId: userId,
      subcollection: subcollection,
      subcollectionId: subcollectionId,
   }
   let result = await db.delete(payload)

   if (result) {
      res.status(200).send(result)
   } else {
      res.status(400).send({})
   }
}

const _createTenant = async (tenantId, createdBy) => {
   return new Promise(async (resolve, reject) => {
      let payload = {
         collection: 'tenants',
         collectionId: tenantId,
         item: {
            tenantId,
            metadata: {
               createdBy,
               createdOn: moment().format('X'),
            },
         },
      }
      let result = await db.add(payload)

      if (result) {
         resolve(result)
      } else {
         reject(result)
      }
   })
}

const _createUser = async (tenantId, createdBy, user) => {
   return new Promise(async (resolve, reject) => {
      let payload = {
         collection: 'users',
         collectionId: user.userId,
         item: {
            ...user,
            metadata: {
               createdBy,
               createdOn: moment().format('X'),
            },
         },
      }

      try {
         await db.add(payload)
         resolve(payload.item)
      } catch(err) {
         console.error("createUser", "err", err)
         reject(err)
      }
   })
}

const _createAuthUser = async (user) => {
   return new Promise(async (resolve, reject) => {
      if (!user.mobile.length) delete user.mobile
      let payload = {
         userId: user.userId,
         item: user,
      }
      try {
         let result = await auth.add(payload)
         resolve(result)
      } catch(err) {
         console.error('_createAuthUser', 'err', err)
         reject(err)
      }
   })
}
