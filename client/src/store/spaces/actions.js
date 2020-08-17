import { LocalStorage } from 'quasar'

import * as api from 'src/helpers/api'
import * as derive from 'src/helpers/derive'
import * as time from 'src/helpers/time'

export default {
   getSpaces: async ({ commit }) => {
      try {
         let spaces = await api.getItems('0NyxKqBtD37vYqLlkDfa', 'spaces')
         if (spaces.success) {
            let data = {}
            spaces.data.map(space => {
               data[space.id] = space
            })
            commit('SET_SPACES', data)
         } else {
            commit('SET_SPACES', {})
         }
      } catch (err) {
         console.error('store-spaces', 'actions-getSpaces', err)
      }
   },

   addSpace: async ({ commit, dispatch, state }, item) => {
      item.key = await derive.key({...state.spaces}, item, 'name')
      item.id = item.key
      item.active = true
      item.starred = true
      item.created = time.currentTime()
      item.overview = 'Overview\n==='
      let payload = {
         tenantId: '0NyxKqBtD37vYqLlkDfa',
         collection: 'spaces',
         createdBy: '1234ABCD',
         item,
      }
      try {
         await api.createItem(payload)
         await commit('ADD_SPACE', item)
         return true
      } catch (err) {
         console.error('store-spaces', 'actions-addSpace', err)
         return false
      }
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

   deleteSpace: async ({ commit, dispatch, state }, id) => {
      // TODO: Delete space pages

      let spaces = {...state.spaces}
      let payload = {
         tenantId: '0NyxKqBtD37vYqLlkDfa',
         collection: 'spaces',
         collectionId: id,
      }

      try {
         await api.deleteItem(payload)
         spaces = delete spaces[id]
         await commit('SET_SPACES', spaces)
         return true
      } catch (err) {
         console.error('store-spaces', 'actions-addSpace', err)
         return false
      }

   },
}
