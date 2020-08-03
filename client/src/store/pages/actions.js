import { LocalStorage } from 'quasar'

import * as derive from 'src/helpers/derive'
import * as time from 'src/helpers/time'

export default {
   getPages: async ({ commit }) => {
      let pages = await LocalStorage.getItem('pages')
      if (pages) commit('SET_PAGES', pages)
   },

   addPage: async ({ commit, state }, item) => {
      let keys = Object.keys(item)

      item.key = await derive.key({...state.pages}, item, 'name', item.spaceId)

      // Conditions support importing new pages
      if (!keys.includes('id')) item.id = derive.uuid({})
      if (!keys.includes('content')) item.content = item.name + '\n' + '==='
      if (!keys.includes('active')) item.active = true
      if (!keys.includes('starred')) item.starred = true
      if (!keys.includes('created')) item.created = time.currentTime()
      if (keys.includes('created')) item.updated = time.currentTime()

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
