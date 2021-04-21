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

   meta() {
      const host = window.location.origin
      return {
         title: 'Conflux',
         meta: {
            description: {
               name: 'description',
               content: 'Document Everything from Anywhere',
            },
            ogTitle: {
               name: 'og:title',
               content: 'Conflux',
            },
            ogType: { name: 'og:type', content: 'website' },
            ogUrl: { name: 'og:url', content: window.location.href },
            ogDescription: {
               name: 'og:description',
               content: 'Document Everything from Anywhere',
            },
            ogImage: {
               name: 'og:image',
               content: `${host}/images/accent-on-primary.png`,
            },
            twitterTitle: {
               name: 'twitter:title',
               content: 'Conflux',
            },
            twitterCard: { name: 'twitter:card', content: 'summary_large_image' },
            twitterUrl: { name: 'twitter:url', content: window.location.href },
            twitterDescription: {
               name: 'twitter:description',
               content: 'Document Everything from Anywhere',
            },
            twitterImage: {
               name: 'twitter:image',
               content: `${host}/images/accent-on-primary.png`,
            },
         },
      }
   },
}
</script>
