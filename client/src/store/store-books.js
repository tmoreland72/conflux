import Vue from 'vue'

import { firestore } from 'boot/firebase'
import { storage } from 'boot/storage'
import lib from 'src/lib'

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
   all: (state) => {
      let arr = []
      const collection = { ...state.collection }
      Object.keys(collection).map((key) => {
         arr.push(collection[key])
      })
      return arr
   },

   byId: (state, getters) => (id) => {
      let result = getters.all.filter((f) => f.id === id)
      if (result && result.length === 1) return result[0]
      return {}
   },

   sorted: (state, getters) => ({ includeArchived = false }) => {
      const sorted = lib.sortObjectArray({ arr: getters.all, field: 'title' })
      if (includeArchived) {
         return sorted
      } else {
         return sorted.filter((f) => !f.archived)
      }
   },

   bookOptions: (state, getters) => {
      const books = getters.all
      const options = []
      books.forEach((b) => options.push({ label: b.title, value: b.id }))
      return options
   },
}

const actions = {
   bind: async ({ commit, dispatch }) => {
      return new Promise(async (res, rej) => {
         try {
            const profile = storage.getItem('profile')
            let ref = await firestore
               .collection('books')
               .where('collaborators', 'array-contains', profile.id)
               .onSnapshot(async (snapshot) => {
                  snapshot.docChanges().forEach((change) => {
                     if (change.type === 'added') {
                        if (!change.doc.metadata.hasPendingWrites) {
                           commit('setItem', {
                              id: change.doc.id,
                              ...change.doc.data(),
                           })
                        }
                     }
                     if (change.type === 'modified') {
                        commit('setItem', {
                           id: change.doc.id,
                           ...change.doc.data(),
                        })
                     }
                     if (change.type === 'removed') {
                        commit('deleteItem', change.doc.id)
                     }
                  })
               })
            commit('setUnsubscribe', ref)
            res()
         } catch (err) {
            console.error('bind', err.message)
            rej()
         }
      })
   },

   unbind: async ({ commit, dispatch, getters }) => {
      const books = getters.all
      commit('execUnsubscribe')
      books.forEach((book) => {
         dispatch('chapters/unbind', book.id)
         dispatch('pages/unbind', book.id)
      })
   },

   clear: ({ commit }) => {
      commit('clearItems')
   },
}

export default {
   namespaced: true,
   state,
   mutations,
   getters,
   actions,
}
