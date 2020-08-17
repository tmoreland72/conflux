import Vue from 'vue'

import * as api from 'src/helpers/api'
import { currentTime } from 'src/helpers/time'
import { customid } from 'src/helpers/uid'
import { filterArchived, filterArray, groupArray, sortObject } from 'src/helpers/sort'

const state = {
   items: {},
   groupBy: '',
   sortFields: ['name'],
   filterBy: '',
   showArchives: false,
   listView: 'list',
}

const mutations = {
   addUser: (state, item) => {
      Vue.set(state.items, item.id, item)
   },

   updateUser: (state, item) => {
      Object.assign(state.items[item.id], item)
   },

   setUsers: (state, value) => {
      state.items = value
   },

   setSortFields: (state, value) => {
      state.sortFields = value
   },

   setFilterBy: (state, value) => {
      state.filterBy = value
   },

   setGroupBy: (state, value) => {
      state.groupBy = value
   },

   setShowArchives: (state, value) => {
      state.showArchives = value
   },

   setListView: (state, value) => {
      state.listView = value
   },

   addUserDoctor: (state, value) => {

   }
}

const getters = {
   me: (state, getters, rootState) => {
      let loggedIn = {...rootState.auth.loggedIn}
      return state.items[loggedIn.id]
   },

   sorted: (state) => {
      return sortObject({ ...state.items }, state.sortFields)
   },

   filtered: (state, getters) => {
      let items = getters.sorted
      if (!state.showArchives) {
         items = filterArchived(items)
      }
      return filterArray(items, state.filterBy)
   },

   grouped: (state, getters) => {
      let items = getters.filtered
      return groupArray(items, state.groupBy)
   },

   userList: (state, getters) => {
      let items = getters.sorted
      let res = []
      items.map(item => {
         if (!item.archived) {
            res.push(item)
         }
      })
      return res
   },

   pageSettings: (state) => {
      return {
         showArchives: state.showArchives,
         listView: state.listView
      }
   }
}

const actions = {
   async getUsers({ commit, rootState }) {
      let loggedIn = { ...rootState.auth.loggedIn }
      let result = await api.getItems(loggedIn.tenantId, 'users')
      if (result.success) {
         let payload = {}
         result.data.map(item => {
            payload[item.id] = item
         })
         commit('setUsers', payload)
      } else {
         return false
      }
   },

   async addUser({ commit, rootState }, item) {
      let loggedIn = { ...rootState.auth.loggedIn }
      item.id = customid({})
      item.creationTime = currentTime()

      try {
         let result = await api.createItem(loggedIn.tenantId, 'users', loggedIn.userId, item)
         if (result.success) {
            commit('addUser', result.data)
         }
         return result
      } catch (err) {
         console.error('store-addUser', 'err', err)
         return err
      }
   },

   async updateUser({ state, commit, rootState }, item) {
      let loggedIn = { ...rootState.auth.loggedIn }
      item.updateTime = currentTime()

      try {
         let result = await api.updateItem(loggedIn.tenantId, 'users', item.id, loggedIn.userId, item)
         if (result.success) {
            commit('updateUser', item)
         }
         return result
      } catch (err) {
         return err
      }
   },

   async deleteUser({ commit, rootState }, id) {
      let loggedIn = { ...rootState.auth.loggedIn }
      let result = await api.deleteItem(loggedIn.tenantId, 'users', id)
      if (result.success) {
         let users = {...state.items}
         delete users[id]
         commit('setUsers', users)
         return true
      } else {
         return false
      }
   },

   async getUserDoctors({ commit, getters }, userId) {
      let me = getters.me
      let result = await api.getItems(me.tenantId, 'users', userId, 'doctors')
      if (result.success) {
         return result.data
      } else {
         return false
      }
   },

   async addUserDoctor({ commit, getters }, props) {
      const { userId, doctor } = props
      let me = getters.me

      try {
         let result = await api.createItem(me.tenantId, 'users', userId, 'doctors', doctor)
         if (result.success) {
            commit('addUserDoctor', result.data)
         }
         return result
      } catch (err) {
         return err
      }
   },

   async updateUserDoctor({}, props) {},

   async removeUserDoctor({}, props) {},


   async getUserTrackerEvents({ commit, getters }, {tracker, userId}) {
      let me = getters.me
      let result = await api.getItems(me.tenantId, 'users', userId, tracker)
      if (result.success) {
         return result.data
      } else {
         return false
      }
   },

   async addUserTrackerEvent({ commit, getters }, props) {
      const { tracker, userId, item } = props
      let me = getters.me
      item.id = customid({})

      try {
         return await api.createItem({
            tenantId: me.tenantId,
            collection: 'users',
            collectionId: userId,
            subcollection: tracker,
            createdBy: me.id,
            item,
         })
      } catch (err) {
         return err
      }
   },

   async deleteUserTrackerEvent({ commit, getters }, props) {
      const { tracker, userId, id } = props
      let me = getters.me

      try {
         return await api.deleteItem({
            tenantId: me.tenantId,
            collection: 'users',
            collectionId: userId,
            subcollection: tracker,
            subcollectionId: id,
         })
      } catch (err) {
         return err
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
