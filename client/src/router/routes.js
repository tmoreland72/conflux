
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        meta: { isPrivate: true },
        name: 'home',
        path: '',
        component: () => import('pages/Index.vue')
      },

      { name: 'logout', path: 'logout', component: () => import('src/services/authn/components/Logout.vue') },

      {
        name: 'login',
        path: 'login',
        component: () => import('src/services/authn/components/Login.vue')
      },

      {
        name: 'login-password',
        path: 'login/password',
        component: () => import('src/services/authn/components/UsernamePassword.vue')
      },

      {
        name: 'login-phone',
        path: 'login/phone',
        component: () => import('src/services/authn/components/Phone.vue')
      },

      {
        name: 'register',
        path: 'register',
        component: () => import('src/services/authn/components/Register.vue')
      },

      {
        meta: { isPrivate: true },
        name: 'spaces',
        path: 'spaces',
        component: () => import('pages/Spaces.vue'),
      },

      {
        meta: { isPrivate: true },
        path: 'spaces/:spaceId',
        component: () => import('pages/Space.vue'),
        children: [
          {
            name: 'space-overview',
            path: 'overview',
            component: () => import('components/Spaces/Overview.vue')
          },
          {
            name: 'space-settings',
            path: 'settings',
            props: true,
            component: () => import('components/Spaces/Settings.vue')
          },
          {
            name: 'page',
            path: 'page/:pageId',
            component: () => import('components/Pages/Page.vue')
          },
        ]
      },
      { path: ' ', redirect: { name: 'home' }},

      {
        meta: { isPrivate: true },
        name: 'createSpace',
        path: '/create/space',
        component: () => import('components/Spaces/Creation/Dialog.vue')
      },

      {
        meta: { isPrivate: true },
        name: 'createPage',
        path: '/create/page',
        component: () => import('components/Pages/Creation/Dialog.vue')
      },

    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
