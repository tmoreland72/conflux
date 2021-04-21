<template>
   <div id="q-app">
      <template v-if="processing">
         <q-inner-loading color="primary" :showing="true" />
      </template>
      <template v-else>
         <router-view />
      </template>
   </div>
</template>

<script>
import { storage } from 'boot/storage'
import Core from 'src/mixins/Core'

export default {
   name: 'App',

   data() {
      return {
         processing: false,
      }
   },

   methods: {
      initializing() {
         const interval = setInterval(() => {
            if (storage.has('profile') && !storage.has('initializing')) {
               this.processing = false
               clearInterval(interval)
            }
         }, 500)
      },
   },

   mixins: [Core],

   async mounted() {
      // Anonymous Requests
      const urlPath = window.location.pathname.split('/')
      if (urlPath[1] === 'published') {
         if (urlPath[3] === 'page') {
            this.$router.push({
               name: 'public-book-page',
               params: { id: urlPath[2], pageId: urlPath[4] },
            })
         } else {
            this.$router.push({ name: 'public-book', params: { id: urlPath[2] } })
         }
         return false
      }

      // Authenticated Requests
      if (storage.has('accessToken')) {
         this.$axios.defaults.headers.common.Authorization = `Bearer ${storage.getItem(
            'accessToken'
         )}`
      }
      await this.initData()
      // this.initializing()
   },
}
</script>
