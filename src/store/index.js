import Vue from 'vue'
import Vuex from 'vuex'

import app from './app'
import pages from './pages'
import spaces from './spaces'

Vue.use(Vuex)

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      app,
      pages,
      spaces
    },

    strict: process.env.DEV
  })

  return Store
}
