import { firestoreAction } from 'vuexfire'

import { firestore } from 'boot/firebase'
import { storage } from 'boot/storage'
import lib from 'src/lib'

const state = {}

const mutations = {}

const getters = {
   me: (state) => {
      return { ...state.users[0] }
   },

   all: (state) => ({ collection, includeArchived = false }) => {
      if (!state[collection]) return false
      if (includeArchived) {
         return state[collection]
         // return lib.sortObjectArray({ arr: [...state[collection]], field: 'title' })
      }
      return lib.sortObjectArray({ arr: [...state[collection].filter((f) => !f.archived)], field: 'title' })
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
      const chapters = getters.all({ collection: 'chapters' }).filter((f) => f.bookId === bookId)
      chapters.forEach((item) => {
         options.push({ label: item.title, value: item.id })
      })
      return options
   },
}

const actions = {
   bindUsers: firestoreAction(async ({ bindFirestoreRef }) => {
      try {
         const profile = storage.getItem('profile')
         return await bindFirestoreRef('users', firestore.collection('users').where('id', '==', profile.id))
      } catch (error) {
         console.error(`store bindUsers error: ${error.message}`)
         throw new Error(error.message)
      }
   }),

   unbindUsers: firestoreAction(({ unbindFirestoreRef }) => {
      unbindFirestoreRef('users')
   }),

   bindBooks: firestoreAction(async ({ bindFirestoreRef }) => {
      try {
         const profile = storage.getItem('profile')
         return await bindFirestoreRef(
            'books',
            firestore.collection('books').where('collaborators', 'array-contains', profile.id)
         )
      } catch (error) {
         console.error(`store bindBooks error: ${error.message}`)
         throw new Error(error.message)
      }
   }),

   unbindBooks: firestoreAction(({ unbindFirestoreRef }) => {
      unbindFirestoreRef('books')
   }),

   bindChapters: firestoreAction(({ bindFirestoreRef }) => {
      const profile = storage.getItem('profile')
      return bindFirestoreRef(
         'chapters',
         firestore.collection('chapters').where('collaborators', 'array-contains', profile.id)
      )
   }),

   unbindChapters: firestoreAction(({ unbindFirestoreRef }) => {
      unbindFirestoreRef('chapters')
   }),

   bindPages: firestoreAction(({ bindFirestoreRef }) => {
      const profile = storage.getItem('profile')
      return bindFirestoreRef(
         'pages',
         firestore.collection('pages').where('collaborators', 'array-contains', profile.id)
      )
   }),

   unbindPages: firestoreAction(({ unbindFirestoreRef }) => {
      unbindFirestoreRef('pages')
   }),
}

export default {
   namespaced: true,
   state,
   mutations,
   getters,
   actions,
}
