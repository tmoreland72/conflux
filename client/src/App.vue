<template>
   <div>
      <template v-if="loading"></template>
      <template v-else>
         <div id="q-app">
            <router-view/>
         </div>
      </template>
   </div>
</template>

<script>
import { mapActions } from 'vuex'
import { Loading } from 'quasar'

import * as storage from 'src/services/storage'

export default {
   data() {
      return {
         loading: false,
      }
   },

   methods: {
      ...mapActions([
         'auth/handleAuthStateChange',
         'pages/getPages',
         'spaces/getSpaces',
      ]),

      async onAuthStateChange() {
         Loading.show({ message: 'Logging in...' })
         await this['auth/handleAuthStateChange']()
         Loading.hide()
      },

      async initData() {
         Loading.show({
            spinnerColor: 'white',
            messageColor: 'white',
            backgroundColor: 'primary',
            message: 'Loading data...',
            spinnerSize: '140',
         })
         await Promise.all([
               await this['spaces/getSpaces'](),
               await this['pages/getPages'](),
            ])
            .then(() => {
               if (storage.has('local', 'redirect') && storage.has('session', 'session')) {
                  let redirect = storage.get('local', 'redirect')
                  storage.remove('local', 'redirect')
                  this.$router.replace(redirect)
               }
               Loading.hide()
               this.loading = false
            })
      },
   },

   async beforeMount() {
      this.loading = true
      await this.onAuthStateChange()
      await this.initData()
   },
}
</script>
