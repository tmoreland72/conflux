const { uid } = require('uid')
const jwt = require('jsonwebtoken')
const cryptoRandomString = require('crypto-random-string')

const sendgrid = require('../services/sendgrid')
const { admin, firestore } = require('../services/firebase')
const crypt = require('./crypto')
const books = require('./books')
const saveAuditEventToDB = require('./audit')

const get = async (id) => {
   try {
      const doc = await firestore.collection('users').doc(id).get()
      if (!doc) return false
      let user = doc.data()
      delete user.password
      return user
   } catch (error) {
      throw new Error(error.message)
   }
}

const getByEmail = async (email) => {
   try {
      const snapshot = await firestore
         .collection('users')
         .where('email', '==', email)
         .get()
      if (snapshot.empty) return false
      let user = snapshot.docs[0].data()
      return user
   } catch (error) {
      throw new Error(error.message)
   }
}

const login = async (req, { email, password }) => {
   try {
      email = email.toLowerCase()
      let user = await getByEmail(email)
      if (!user) {
         return { success: false, message: 'usernotfound' }
      }

      const verified = await crypt.verify(password, user.password)
      if (!verified) return { success: false, message: 'invalidcredentials' }

      user = await get(user.id)
      req.user = user
      // const token = crypt.createJWT({ payload: user })
      const token = jwt.sign(user, process.env.APP_JWTSECRET)

      saveAuditEventToDB(req, firestore, {
         performedOn: user.id,
         action: 'login',
      })

      return {
         success: true,
         message: 'authenticated',
         data: token,
      }
   } catch (error) {
      console.error('login', error)
      throw new Error(error.message)
   }
}

const register = async (req, user) => {
   try {
      user = {
         ...user,
         id: user.id ? user.id : uid(),
         email: user.email.toLowerCase(),
         created: new Date().valueOf(),
         updated: new Date().valueOf(),
      }
      req.user = user

      const exists = await getByEmail(user.email)
      if (exists) return { success: false, message: 'emailinuse' }

      user.password = await crypt.hash(user.password)
      await firestore.collection('users').doc(user.id).set(user)

      let newUser = await get(user.id)
      const token = jwt.sign(newUser, process.env.APP_JWTSECRET)

      await books.create(req, {
         title: 'Conflux Tips',
         subtitle: 'Auto-created',
         owner: user.id,
         collaborators: [user.id],
      })

      saveAuditEventToDB(req, firestore, {
         performedOn: user.id,
         action: 'register',
         data: user,
      })

      return { success: true, message: 'created', data: token }
   } catch (error) {
      console.error('users', error)
      throw new Error(error.message)
   }
}

const resetPassword = async (req, email) => {
   try {
      const user = await getByEmail(email)
      const password = cryptoRandomString({ length: 10, type: 'url-safe' })
      await update(req, { id: user.id, changes: { password } })
      sendgrid.sendPasswordReset({ to: user.email, name: user.name, password })

      saveAuditEventToDB(req, firestore, {
         performedOn: user.id,
         action: 'resetPassword',
      })

      return { success: true, message: 'sent' }
   } catch (error) {
      console.error('resetPassword', error)
      throw new Error(error.message)
   }
}

const update = async (req, { id, changes }) => {
   try {
      if (changes.password) {
         changes.password = await crypt.hash(changes.password)
      }
      await firestore.collection('users').doc(id).update(changes)
      let updatedUser = await get(id)

      saveAuditEventToDB(req, {
         performedOn: id,
         action: 'updateUser',
         data: changes,
      })

      return { success: true, message: 'updated', data: updatedUser }
   } catch (error) {
      throw new Error(error.message)
   }
}

const del = async (req, id) => {
   try {
      await firestore.collection('users').doc(id).delete()

      saveAuditEventToDB(req, firestore, {
         performedOn: id,
         action: 'deleteUser',
      })

      return { success: true }
   } catch (error) {
      throw new Error(error.message)
   }
}

module.exports = { get, getByEmail, login, register, resetPassword, update, del }
