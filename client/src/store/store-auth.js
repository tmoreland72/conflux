import { fireBase } from 'boot/firebase'
//TODO set last login time
import * as time from 'src/helpers/time'

const state = {
   isAuthenticated: false,
   loggedIn: null,
}

const mutations = {
   setIsAuthenticated: (state, value) => {
      state.isAuthenticated = value
   },

   setLoggedIn: (state, value) => {
      state.loggedIn = value
   }
}

const getters = {
}

const actions = {
/*
   login: ({ commit }, { plugin = 'firebase', method, credentials }) => {
      try {
         storage.set('session', 'session', 'pending')
         return authn.login(plugin, { method, credentials })
      } catch (err) {
         console.log('store-auth login', 'err', err)
         return err
      }
   },

   logout: async ({ commit }) => {
      await authn.logout('firebase')
      return true
   },
*/

   handleAuthStateChange: async ({ commit }) => {
      return new Promise(async (resolve, reject) => {

         // MOCK
         let user = {
            id: '1234ABCD',
            tenantId: '0NyxKqBtD37vYqLlkDfa',
            userId: '1234ABCD',
         }
         //let user = {
         //   id: '6p5pd8zp1mo',
         //   tenantId: '6of24k8njr6',
         //   userId: '6p5pd8zp1mo',
         //}

         //storage.set('session', 'session', user)
         commit('setIsAuthenticated', true)
         commit('setLoggedIn', user)
         resolve(true)

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
