import Vue from 'vue'
import Vuex from 'vuex'

import pages from './pages'
import spaces from './spaces'

Vue.use(Vuex)

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      pages,
      spaces
    },

    strict: process.env.DEV
  })

  return Store
}
