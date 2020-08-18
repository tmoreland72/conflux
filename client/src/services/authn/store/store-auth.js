import * as authn from 'src/services/authn'
import * as storage from 'src/services/storage'
import * as verify from 'src/helpers/verify'
import { fireBase } from 'boot/firebase'

const state = {
   isAuthenticated: false,
   loggedIn: null,
}

const mutations = {
   SET_IS_AUTHENTICATED: (state, value) => {
      state.isAuthenticated = value
   },

   SET_LOGGED_IN: (state, value) => {
      state.loggedIn = value
   },
}

const getters = {}

const actions = {
   login: ({ commit }, { plugin = 'firebase', method, credentials }) => {
      try {
         storage.set('session', 'session', 'pending')
         return authn.login(plugin, { method, credentials })
      } catch (err) {
         console.error('store-auth login', 'err', err)
         return err
      }
   },

   logout: async ({ commit }) => {
      await authn.logout('firebase')
      return true
   },

   handleAuthStateChange: async ({ commit, dispatch }) => {
      return new Promise(async (resolve, reject) => {
         await fireBase.auth().onAuthStateChanged(async session => {
            if (session) {
               //let v = await verify.emailAddress(session.email)
               let v = {
                  "email":"troy@morelands.net",
                  "did_you_mean":"",
                  "user":"troy",
                  "domain":"morelands.net",
                  "format_valid":true,
                  "mx_found":true,
                  "smtp_check":true,
                  "catch_all":null,
                  "role":false,
                  "disposable":false,
                  "free":false,
                  "score":0.96
               }
               let domain
               if (v.format_valid && v.mx_found && !v.disposable) {
                  if (v.free) {
                     domain = session.uid
                  } else {
                     let emailParts = session.email.split('@')
                     domain = emailParts[1]
                  }
               } else {
                  reject('Invalid email address')
               }
               //TODO Link to User and pull in User properties
               //TODO Create User & Tenant if they don't exist
               let user = {
                  displayName: session.displayName ?
                     session.displayName : session.email ?
                        session.email : session.phoneNumber ?
                           session.phoneNumber : session.uid,
                  email: session.email,
                  phoneNumber: session.phoneNumber,
                  photoUrl: session.photoURL,
                  uid: session.uid,
                  token: session.refreshToken,
                  tenantId: domain,
               }
               storage.set('session', 'session', user)
               commit('SET_IS_AUTHENTICATED', true)
               commit('SET_LOGGED_IN', user)
               let sessionExists = storage.has('session', 'session')
               if (sessionExists) {
                  resolve('loggedIn')
               } else {
                  resolve('login')
               }
            } else {
               await storage.removeAll('session')
               commit('SET_IS_AUTHENTICATED', false)
               commit('SET_LOGGED_IN', null)
               resolve('logout')
            }
         })
         console.groupEnd()
      })
   },
}

export default {
   namespaced: true,
   state,
   mutations,
   getters,
   actions,
}
