import Vue from 'vue'
import { vuexfireMutations, firestoreAction } from 'vuexfire'

import { firestore } from 'boot/firebase'
import { storage } from 'boot/storage'

const state = {
   collection: {},
   subscription: null,
}

const mutations = {
   setItem: (state, value) => {
      Vue.set(state.collection, value.id, value)
   },

   deleteItem: (state, id) => {
      Vue.delete(state.collection, id)
   },

   clearItems: (state) => {
      state.collection = {}
   },

   setUnsubscribe: (state, fn) => {
      state.subscription = fn
   },

   execUnsubscribe: (state) => {
      state.subscription.fn()
   },
}

const getters = {
   me: (state) => {
      const keys = Object.keys(state.collection)
      let user = state.collection[keys[0]]
      delete user.password
      return user
   },
}

const actions = {
   bind: firestoreAction(({ bindFirestoreRef }) => {
      const profile = storage.getItem('profile')
      return bindFirestoreRef('users', firestore.collection('users').where('id', '==', profile.id))
   }),
   // bind: async ({ commit }) => {
   //    try {
   //       const profile = storage.getItem('profile')
   //       let ref = await firestore
   //          .collection('users')
   //          .where('id', '==', profile.id)
   //          .onSnapshot((snapshot) => {
   //             snapshot.docChanges().forEach((change) => {
   //                if (change.type === 'added') {
   //                   if (!change.doc.metadata.hasPendingWrites) {
   //                      commit('setItem', {
   //                         id: change.doc.id,
   //                         ...change.doc.data(),
   //                      })
   //                   }
   //                }
   //                if (change.type === 'modified') {
   //                   commit('setItem', {
   //                      id: change.doc.id,
   //                      ...change.doc.data(),
   //                   })
   //                }
   //                if (change.type === 'removed') {
   //                   commit('deleteItem', change.doc.id)
   //                }
   //             })
   //          })
   //       commit('setUnsubscribe', ref)
   //    } catch (err) {
   //       console.error('bind', err.message)
   //    }
   // },

   unbind: firestoreAction(({ unbindFirestoreRef }) => {
      unbindFirestoreRef('users')
   }),
   // unbind: async ({ commit }) => {
   //    commit('execUnsubscribe')
   // },

   // clear: ({ commit }) => {
   //    commit('clearItems')
   // },
}

export default {
   namespaced: true,
   state,
   mutations,
   getters,
   actions,
}
