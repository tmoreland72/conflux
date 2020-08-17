import Vue from 'vue'
import Vuex from 'vuex'

import app from './app'
import auth from './store-auth'
import pages from './store-pages'
import spaces from './store-spaces'

Vue.use(Vuex)

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      app,
      auth,
      pages,
      spaces
    },

    strict: process.env.DEV
  })

  return Store
}
