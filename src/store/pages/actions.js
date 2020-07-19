import { LocalStorage } from 'quasar'

import * as derive from 'src/helpers/derive'
import * as time from 'src/helpers/time'

export default {
   getPages: async ({ commit }) => {
      let pages = await LocalStorage.getItem('pages')
      if (pages) commit('SET_PAGES', pages)
   },

   addPage: async ({ commit, state }, item) => {
      item.key = await derive.key({...state.pages}, item, 'name', item.spaceId)
      item.id = derive.uuid({})
      item.active = true
      item.starred = true
      item.created = time.currentTime()
      item.content = item.name + '\n' + '==='

      let pages = { ...state.pages }
      pages[item.id] = item
      await LocalStorage.set('pages', pages)
      await commit('ADD_PAGE', item)
      return item
   },

   updatePage: async ({ state, commit }, item) => {
      item.updated = time.currentTime()
      let pages = { ...state.pages }
      pages[item.id] = item
      await Promise.all([
            await LocalStorage.set('pages', pages),
            await commit('UPDATE_PAGE', item),
         ])
         .then(() => {
            return item
         })
         .catch(() => {
            return false
         })
   },

   deletePage: async ({ commit, dispatch, state }, id) => {
      let pages = { ...state.pages }
      delete pages[id]
      await Promise.all([
            await LocalStorage.set('pages', pages),
            await commit('SET_PAGES', pages),
         ])
         .then(() => {
            return true
         })
         .catch(() => {
            return false
         })
   },
}
