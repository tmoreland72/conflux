import Vue from 'vue'

import { firestore } from 'boot/firebase'
import lib from 'src/lib'

const state = {
   collection: {},
   subscriptions: null,
}

const mutations = {
   setItem: (state, page) => {
      Vue.set(state.collection[page.bookId], page.id, page)
   },

   deleteItem: (state, page) => {
      Vue.delete(state.collection[page.bookId], page.id)
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
         Object.keys(collection[bookId]).map((pageId) => {
            arr.push(collection[bookId][pageId])
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

   byChapter: (state, getters) => ({ chapterId, includeArchived = false }) => {
      let result = getters.sorted({ includeArchived }).filter((f) => f.chapterId === chapterId)
      if (result && result.length === 1) return result[0]
      return []
   },

   pageOptions: (state, getters) => {
      const pages = getters.all
      const options = []
      pages.forEach((p) => options.push({ label: p.title, value: p.id }))
      return options
   },
}

const actions = {
   bind: async ({ commit }) => {
      try {
         let ref = await firestore
            .collection('pages')
            // .where('books', 'array-contains', bookId)
            .onSnapshot((snapshot) => {
               snapshot.docChanges().forEach((change) => {
                  const page = {
                     id: change.doc.id,
                     ...change.doc.data(),
                  }
                  if (change.type === 'added') {
                     if (!change.doc.metadata.hasPendingWrites) {
                        commit('setItem', page)
                     }
                  }
                  if (change.type === 'modified') {
                     commit('setItem', page)
                  }
                  if (change.type === 'removed') {
                     commit('deleteItem', page)
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
