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
      if (storage.has('accessToken')) {
         this.$axios.defaults.headers.common.Authorization = `Bearer ${storage.getItem('accessToken')}`
      }
      await this.initData()
      // this.initializing()
   },
}
</script>
