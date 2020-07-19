import { LocalStorage } from 'quasar'

import * as derive from 'src/helpers/derive'
import * as time from 'src/helpers/time'

export default {
   getSpaces: async ({ commit }) => {
      let spaces = await LocalStorage.getItem('spaces')
      if (spaces.undefined) delete spaces.undefined
      if (spaces) commit('SET_SPACES', spaces)
   },

   addSpace: async ({ commit, dispatch, state }, item) => {
      item.key = await derive.key({...state.spaces}, item, 'name')
      item.id = item.key
      item.active = true
      item.starred = true
      item.created = time.currentTime()
      item.overview = '# Overview'
      let spaces = { ...state.spaces }
      spaces[item.key] = item
      await Promise.all([
         await LocalStorage.set('spaces', spaces),
         await commit('ADD_SPACE', item),
      ])
         .then(() => {
            return item
         })
         .catch(() => {
            return false
         })
   },

   updateSpace: async ({ commit, dispatch, state }, item) => {
      item.updated = time.currentTime()
      let spaces = { ...state.spaces }
      let space = {
         ...spaces[item.id],
         ...item,
         updated: time.currentTime()
      }
      spaces[space.id] = space
      await Promise.all([
         await LocalStorage.set('spaces', spaces),
         await commit('UPDATE_SPACE', space),
      ])
      .then(async () => {
         await dispatch('getSpaces')
         return item
      })
      .catch(err => {
         console.error('updateSpace', err)
         return false
      })
   },

   deleteSpace: async ({ commit, dispatch }, id) => {
      // Delete pages

      // Delete space
   },
}
