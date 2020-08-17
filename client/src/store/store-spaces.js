import Vue from 'vue'
import merge from 'lodash/merge'

import * as api from 'src/helpers/api'
import * as time from 'src/helpers/time'
import * as derive from 'src/helpers/derive'
import * as sort from 'src/helpers/sort'

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
   sorted: (state) => {
      return sort.sortObject({...state.items}, ['name'])
   },

   starred: (state, getters) => {
      let personal = []
      getters.sorted.map(item => {
         if (item.starred) {
            personal.push(item)
         }
      })
      return personal
   },

   personal: (state, getters) => {
      let personal = []
      getters.sorted.map(item => {
         if (item.private) {
            personal.push(item)
         }
      })
      return personal
   },

   shared: (state, getters) => {
      let personal = []
      getters.sorted.map(item => {
         if (!item.private) {
            personal.push(item)
         }
      })
      return personal
   },

   archived: (state) => {
      let items = {...state.items}
      if (!items) return []
      let sorted = []
      Object.keys(items).map(key => {
         if (items[key].active === false) {
            sorted.push(items[key])
         }
      })
      return sorted
   }
}

const actions = {
   async getSpaces({ commit }) {
      try {
         let items = await api.getItems('0NyxKqBtD37vYqLlkDfa', 'spaces')
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

   async getSpace({ state }, id) {
      try {
         let item = await api.getItem('0NyxKqBtD37vYqLlkDfa', 'spaces', id)
         if (item.success) {
            return item.data
         } else {
            return {}
         }
      } catch (err) {
         console.error('store-spaces', 'actions-getSpace', err)
      }
   },

   async addSpace({ commit, dispatch, state }, item) {
      item.key = await derive.key({...state.items}, item, 'name')
      item.id = derive.uuid({})
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

   async updateSpace({ commit, dispatch, state }, item) {
      let payload = {
         tenantId: '0NyxKqBtD37vYqLlkDfa',
         collection: 'spaces',
         collectionId: item.id,
         updatedBy: '1234ABCD',
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

   async deleteSpace({ commit, dispatch, state }, id)  {
      // TODO: Delete space pages

      let payload = {
         tenantId: '0NyxKqBtD37vYqLlkDfa',
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
