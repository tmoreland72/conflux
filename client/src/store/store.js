import { firestore } from 'boot/firebase'
import { storage } from 'boot/storage'
import lib from 'src/lib'

const state = {
   users: [],
   books: [],
   chapters: [],
   pages: [],
   unsubscribe: {
      users: null,
      books: null,
      chapters: null,
      pages: null,
   },
}

const mutations = {
   setItem: (state, { collection, item }) => {
      const idx = state[collection].findIndex((f) => f.id === item.id)
      if (idx >= 0) {
         state[collection].splice(idx, 1, item)
      } else {
         state[collection].push(item)
      }
   },

   deleteItem: (state, { collection, id }) => {
      const idx = state[collection].findIndex((f) => f.id === id)
      state[collection].splice(idx, 1)
   },

   setUnsubscribe: (state, { collection, fn }) => {
      state.unsubscribe[collection] = fn
   },

   unsubscribe: (state, collection) => {
      state.unsubscribe[collection]()
   },
}

const getters = {
   me: (state) => {
      return { ...state.users[0] }
   },

   all: (state) => ({ collection, includeArchived = false }) => {
      if (!state[collection]) return false
      if (includeArchived) {
         // return state[collection]
         return lib.sortObjectArray({ arr: [...state[collection]], field: 'title' })
      }
      return lib.sortObjectArray({
         arr: [...state[collection].filter((f) => !f.archived)],
         field: 'title',
      })
   },

   byId: (state, getters) => ({ collection, id }) => {
      let result = getters.all({ collection }).filter((f) => f.id === id)
      if (result && result.length === 1) return result[0]
      return {}
   },

   chaptersByBook: (state, getters) => (bookId) => {
      const chapters = getters.all({ collection: 'chapters' })
      return chapters.filter((f) => f.bookId === bookId)
   },

   pagesByBook: (state, getters) => (bookId) => {
      let chapters = getters.chaptersByBook(bookId)
      chapters = chapters.map((chapter) => chapter.id)
      const pages = getters.all({ collection: 'pages' })
      return pages.filter((f) => chapters.includes(f.chapterId))
   },

   bookOptions: (state, getters) => {
      const options = []
      const books = getters.all({ collection: 'books' })
      books.forEach((book) => {
         options.push({ label: book.title, value: book.id })
      })
      return options
   },

   chapterOptions: (state, getters) => (bookId) => {
      const options = []
      const chapters = getters
         .all({ collection: 'chapters' })
         .filter((f) => f.bookId === bookId)
      chapters.forEach((item) => {
         options.push({ label: item.title, value: item.id })
      })
      return options
   },
}

const actions = {
   bind: async ({ commit }, collection) => {
      return new Promise(async (res, rej) => {
         try {
            const profile = storage.getItem('profile')
            console.log('bind', collection, profile)
            let foo = await firestore.collection('books').get()
            console.log('foo', foo.docs[0].data())
            let ref = await firestore
               .collection(collection)
               .where('collaborators', 'array-contains', profile.id)
               .onSnapshot(async (snapshot) => {
                  snapshot.docChanges().forEach((change) => {
                     console.log('bind', collection, change)
                     if (change.type === 'added') {
                        if (!change.doc.metadata.hasPendingWrites) {
                           commit('setItem', {
                              collection,
                              item: change.doc.data(),
                           })
                        }
                     }
                     if (change.type === 'modified') {
                        commit('setItem', {
                           collection,
                           item: change.doc.data(),
                        })
                     }
                     if (change.type === 'removed') {
                        commit('deleteItem', {
                           collection,
                           item: change.doc.id,
                        })
                     }
                  })
               })
            commit('setUnsubscribe', { collection, fn: ref })
            res()
         } catch (err) {
            console.error('bind', err.message)
            rej()
         }
      })
   },

   unbind: async ({ commit }, collection) => {
      commit('unsubscribe', collection)
   },
}

export default {
   namespaced: true,
   state,
   mutations,
   getters,
   actions,
}
