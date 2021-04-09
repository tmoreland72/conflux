import Vue from 'vue'

import { firestore } from 'boot/firebase'
import lib from 'src/lib'

const state = {
   collection: {},
   subscriptions: null,
}

const mutations = {
   setItem: (state, chapter) => {
      Vue.set(state.collection[chapter.bookId], chapter.id, chapter)
   },

   deleteItem: (state, chapter) => {
      Vue.delete(state.collection[chapter.bookId], chapter.id)
   },

   clearItems: (state) => {
      state.collection = {}
   },

   setUnsubscribe: (state, fn) => {
      Vue.set(state.subscriptions, fn)
   },

   execUnsubscribe: (state) => {
      state.subscriptions.fn()
   },
}

const getters = {
   all: (state) => {
      let arr = []
      const collection = { ...state.collection }
      Object.keys(collection).map((bookId) => {
         Object.keys(collection[bookId]).map((chapterId) => {
            arr.push(collection[bookId][chapterId])
         })
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

   byBook: (state, getters) => ({ bookId, includeArchived = false }) => {
      let result = getters.sorted({ includeArchived }).filter((f) => f.bookId === bookId)
      if (result && result.length === 1) return result[0]
      return []
   },

   chapterOptions: (state, getters) => {
      const chapters = getters.sorted
      const options = []
      chapters.forEach((c) => options.push({ label: c.title, value: c.id }))
      return options
   },
}

const actions = {
   bind: async ({ commit }) => {
      try {
         let ref = firestore.collection('chapters').onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
               const chapter = {
                  id: change.doc.id,
                  ...change.doc.data(),
               }
               if (change.type === 'added') {
                  if (!change.doc.metadata.hasPendingWrites) {
                     commit('setItem', chapter)
                  }
               }
               if (change.type === 'modified') {
                  commit('setItem', chapter)
               }
               if (change.type === 'removed') {
                  commit('deleteItem', chapter)
               }
            })
         })
         commit('setUnsubscribe', ref)
      } catch (err) {
         console.error('bind', err.message)
      }
   },

   unbind: async ({ commit }) => {
      commit('execUnsubscribe')
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
