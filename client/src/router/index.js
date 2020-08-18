import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'
import * as storage from 'src/services/storage'

Vue.use(VueRouter)

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  Router.beforeEach(async (to, from, next) => {
    const isPrivate = to.matched.some(record => record.meta.isPrivate)
    const session = storage.get('session', 'session')
    console.log('router', 'session', session)

    if (isPrivate && !session) {
      next({ name: 'login' })

    } else if (session && (to.name === 'login' || to.name === 'register')) {
      next({ name: 'home' })

    } else {
      next()
    }
  })

  return Router
}
