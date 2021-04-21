import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations } from 'vuexfire'

import published from './published'
import store from './store'

Vue.use(Vuex)

const Store = new Vuex.Store({
   mutations: {
      ...vuexfireMutations,
   },

   modules: {
      published,
      store,
   },

   strict: process.env.DEBUGGING,
})

export default function() {
   return Store
}

export { Store }
