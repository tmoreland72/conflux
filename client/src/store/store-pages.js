import Vue from 'vue'
import merge from 'lodash/merge'

import * as api from 'src/helpers/api'
import * as time from 'src/helpers/time'
import * as derive from 'src/helpers/derive'
import * as sort from 'src/helpers/sort'
import filter from 'lodash/filter'

const state = {
   items: {},
}

const mutations = {
   ADD_PAGE: ( state , item) => {
      Vue.set(state.items, item.id, item)
   },

   UPDATE_PAGE: (state, item) => {
      Object.assign(state.items[item.id], item)
   },

   SET_PAGES: (state, value) => {
      state.items = value
   },
}

const getters = {
   page: (state) => (pageId) => {
      return state.items[pageId]
   },

   sorted: (state) => (spaceId) => {
      let pages = {...state.items}
      if (!pages) return []
      let sorted = []
      Object.keys(pages).map(key => {
         let active = pages[key].active !== false
         let inSpace = true
         if (spaceId) {
            inSpace = pages[key].spaceId === spaceId
         }
         if (active && inSpace) {
            sorted.push(pages[key])
         }
      })
      return sort.sortArray(sorted, ['name'])
   },

   pageByName: (state, getters) => (spaceId,name) => {
      let pages = filter(getters.sorted(spaceId), { name })
      return pages[0]
   },

   starred: (state, getters) => (spaceId) => {
      let personal = []
      getters.sorted(spaceId).map(item => {
         if (item.starred) {
            personal.push(item)
         }
      })
      return personal
   },

   personal: (state, getters) => (spaceId) => {
      let personal = []
      getters.sorted(spaceId).map(item => {
         if (item.private) {
            personal.push(item)
         }
      })
      return personal
   },

   shared: (state, getters) => (spaceId) => {
      let personal = []
      getters.sorted(spaceId).map(item => {
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
      return sort.sortArray(sorted, ['name'])
   }
}

const actions = {
   async getPages({ commit }) {
      try {
         let items = await api.getItems('0NyxKqBtD37vYqLlkDfa', 'pages')
         if (items.success) {
            let data = {}
            items.data.map(page => {
               data[page.id] = page
            })
            commit('SET_PAGES', {...data})
         } else {
            commit('SET_PAGES', {})
         }
      } catch (err) {
         console.error('store-pages', 'actions-getPages', err)
      }
   },

   async getPage({ state }, id) {
      try {
         let item = await api.getItem('0NyxKqBtD37vYqLlkDfa', 'pages', id)
         if (item.success) {
            return item.data
         } else {
            return {}
         }
      } catch (err) {
         console.error('store-pages', 'actions-getPage', err)
      }
   },

   async addPage({ commit, dispatch, state }, item) {
      let keys = Object.keys(item)
      item.key = await derive.key({...state.items}, item, 'name')
      if (!keys.includes('id')) item.id = derive.uuid({})
      if (!keys.includes('content')) item.content = item.name + '\n' + '==='
      if (!keys.includes('active')) item.active = true
      if (!keys.includes('starred')) item.starred = true
      let payload = {
         tenantId: '0NyxKqBtD37vYqLlkDfa',
         collection: 'pages',
         createdBy: '1234ABCD',
         item,
      }
      try {
         await api.createItem(payload)
         await commit('ADD_PAGE', item)
         return item
      } catch (err) {
         console.error('store-pages', 'actions-addPage', err)
         return false
      }
   },

   async updatePage({ commit, dispatch, state }, item) {
      let payload = {
         tenantId: '0NyxKqBtD37vYqLlkDfa',
         collection: 'pages',
         collectionId: item.id,
         updatedBy: '1234ABCD',
         updates: item
      }
      await Promise.all([
            await api.updateItem(payload),
            await commit('UPDATE_PAGE', item),
         ])
         .then(async () => {
            return true
         })
         .catch(err => {
            console.error('updatePage', err)
            return false
         })
   },

   async deletePage({ commit, dispatch, state }, id)  {
      // TODO: Delete space pages

      let payload = {
         tenantId: '0NyxKqBtD37vYqLlkDfa',
         collection: 'pages',
         collectionId: id,
      }

      try {
         await api.deleteItem(payload)

         let items = {...state.items}
         items = delete items[id]
         await commit('SET_PAGES', items)
         return true
      } catch (err) {
         console.error('store-pages', 'actions-addPage', err)
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
