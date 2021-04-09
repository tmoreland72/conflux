const routes = [
   {
      path: '/',
      component: () => import('layouts/EmptyLayout.vue'),
      children: [
         { name: 'anonymous', path: '', component: () => import('pages/Anonymous.vue') },
         { name: 'login', path: 'login', component: () => import('pages/Login.vue') },
         { name: 'register', path: 'register', component: () => import('pages/Register.vue') },
         { name: 'reset-password', path: 'reset-password', component: () => import('pages/ResetPassword.vue') },
         { name: 'logout', path: 'logout', component: () => import('pages/Logout.vue') },
      ],
   },

   {
      path: '/main',
      component: () => import('layouts/MainLayout.vue'),
      children: [
         { name: 'home', path: '', component: () => import('pages/Index.vue') },
         { name: 'books', path: '/books', component: () => import('src/pages/Books.vue') },
      ],
   },

   {
      path: '/books',
      component: () => import('layouts/BookLayout.vue'),
      children: [
         { name: 'book', path: ':id/overview', component: () => import('src/pages/BookOverview.vue') },
         { name: 'book-settings', path: ':id/settings', component: () => import('src/pages/BookSettings.vue') },
         {
            name: 'book-page',
            path: ':id/page/:pageId',
            component: () => import('src/pages/BookPage.vue'),
         },
         { path: ':id', redirect: { name: 'book' } },
      ],
   },

   // Always leave this as last one,
   // but you can also remove it
   {
      path: '*',
      component: () => import('pages/Error404.vue'),
   },
]

export default routes
