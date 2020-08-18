import Vue from 'vue'

import * as api from 'src/helpers/api'
import * as time from 'src/helpers/time'
import * as derive from 'src/helpers/derive'
import * as sort from 'src/helpers/sort'
import * as storage from 'src/services/storage'

const state = {
   items: {},
}

const mutations = {
   ADD_SPACE: ( state , item) => {
      Vue.set(state.items, item.id, item)
   },

   UPDATE_SPACE: (state, item) => {
      Object.assign(state.items[item.id], item)
   },

   SET_SPACES: (state, value) => {
      state.items = value
   },
}

const getters = {
   space: (state) => (spaceId) => {
      return state.items[spaceId]
   },

   sorted: (state) => {
      return sort.sortObject({...state.items}, ['name'])
   },

   noArchives: (state, getters) => {
      let items = getters.sorted
      return sort.filterArchived(items)
   },

   starred: (state, getters, rootState) => {
      let loggedIn = rootState.auth.loggedIn
      let personal = []
      getters.noArchives.map(item => {
         if (item.starred && item.starred.includes(loggedIn.uid)) {
            personal.push(item)
         }
      })
      return personal
   },

   personal: (state, getters) => {
      let personal = []
      getters.noArchives.map(item => {
         if (item.private) {
            personal.push(item)
         }
      })
      return personal
   },

   shared: (state, getters) => {
      let personal = []
      getters.noArchives.map(item => {
         if (!item.private) {
            personal.push(item)
         }
      })
      return personal
   },

   archives: (state, getters) => {
      let items = getters.sorted
      return sort.filterArchived(items, 'only')
   },

}

const actions = {
   async getSpaces({ commit }) {
      if (!storage.has('session', 'session')) return false
      let loggedIn = storage.get('session', 'session')
      try {
         let items = await api.getSpaces(loggedIn)
         if (items.success) {
            let data = {}
            items.data.map(space => {
               data[space.id] = space
            })
            commit('SET_SPACES', {...data})
         } else {
            commit('SET_SPACES', {})
         }
      } catch (err) {
         console.error('store-spaces', 'actions-getSpaces', err)
      }
   },

   async getSpace({ state, rootState }, props) {
      const { tenantId, id } = props
      try {
         let item = await api.getItem(tenantId, 'spaces', id)
         if (item.success) {
            return item.data
         } else {
            return {}
         }
      } catch (err) {
         console.error('store-spaces', 'actions-getSpace', err)
      }
   },

   async addSpace({ dispatch, state, rootState }, item) {
      let loggedIn = rootState.auth.loggedIn
      let tenantId = loggedIn.tenantId
      let createdBy = loggedIn.uid
      item.key = await derive.key({...state.items}, item, 'name')
      item.id = derive.uuid({})
      item.active = true
      item.starred = []
      item.starred.push(loggedIn.uid)
      item.created = time.currentTime()
      item.overview = 'Overview\n==='
      item.tenantId = tenantId
      item.ownerId = createdBy
      let payload = {
         tenantId,
         collection: 'spaces',
         createdBy,
         item,
      }
      try {
         await api.createItem(payload)
         await dispatch('getSpaces')
         return item.id
      } catch (err) {
         console.error('store-spaces', 'actions-addSpace', err)
         return false
      }
   },

   async updateSpace({ commit, dispatch, state, rootState }, item) {
      let loggedIn = rootState.auth.loggedIn
      let tenantId = loggedIn.tenantId
      let updatedBy = loggedIn.uid
      let payload = {
         tenantId,
         collection: 'spaces',
         collectionId: item.id,
         updatedBy,
         updates: item
      }
      await Promise.all([
            await api.updateItem(payload),
            await commit('UPDATE_SPACE', item),
         ])
         .then(async () => {
            return true
         })
         .catch(err => {
            console.error('updateSpace', err)
            return false
         })
   },

   async deleteSpace({ commit, dispatch, state, rootState }, id)  {
      // TODO: Delete space pages
      let loggedIn = rootState.auth.loggedIn
      let tenantId = loggedIn.tenantId

      let payload = {
         tenantId,
         collection: 'spaces',
         collectionId: id,
      }

      try {
         await api.deleteItem(payload)

         let items = {...state.items}
         items = delete items[id]
         await commit('SET_SPACES', items)
         return true
      } catch (err) {
         console.error('store-spaces', 'actions-addSpace', err)
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
