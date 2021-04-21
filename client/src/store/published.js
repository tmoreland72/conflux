import { instance as axios } from 'boot/axios'

const state = {
   book: {},
   chapters: [],
   pages: [],
}

const mutations = {
   setItem: (state, { collection, item }) => {
      state[collection] = item
   },

   clear: (state) => {
      state.book = {}
      state.chapter = []
      state.pages = []
   },
}

const getters = {
   book: (state) => {
      return { ...state.book }
   },

   chapters: (state) => {
      return [...state.chapters]
   },

   pages: (state) => {
      return [...state.pages]
   },

   page: (state, pages) => (id) => {
      return pages.find((f) => f.id === id)
   },
}

const actions = {
   getBook: async ({ commit }, id) => {
      try {
         let bookResult = await axios.get(`/published/${id}`)
         if (bookResult.data.success) {
            commit('setItem', { collection: 'book', item: bookResult.data.data })
            commit('setItem', {
               collection: 'chapters',
               item: bookResult.data.data.chapters,
            })
            commit('setItem', { collection: 'pages', item: bookResult.data.data.pages })
            return true
         } else {
            commit('clear')
            return false
         }
      } catch (error) {
         console.error('published', 'getBook', error)
         return false
      }
   },
}

export default {
   namespaced: true,
   state,
   mutations,
   getters,
   actions,
}
