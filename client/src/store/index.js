import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations } from 'vuexfire'

import store from './store'

Vue.use(Vuex)

const Store = new Vuex.Store({
   mutations: {
      ...vuexfireMutations,
   },

   modules: {
      store,
   },

   strict: process.env.DEBUGGING,
})

export default function() {
   return Store
}

export { Store }
