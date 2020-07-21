
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'home', path: '', component: () => import('pages/Index.vue') },

      {
        name: 'spaces',
        path: 'spaces',
        component: () => import('pages/Spaces.vue'),
      },

      {
        path: 'spaces/:spaceId',
        component: () => import('pages/Space.vue'),
        children: [
          {
            name: 'space',
            path: 'overview',
            component: () => import('components/Spaces/Overview.vue')
          },
          {
            name: 'space-settings',
            path: 'settings',
            component: () => import('pages/Settings.vue')
          },
          {
            name: 'page',
            path: 'page/:pageId',
            component: () => import('components/Pages/Page.vue')
          },
        ]
      },

      { name: 'createSpace', path: '/create/space', component: () => import('components/Spaces/Creation/Dialog.vue') },
      { name: 'createPage', path: '/create/page', component: () => import('components/Pages/Creation/Dialog.vue') },

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
