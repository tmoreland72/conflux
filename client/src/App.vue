<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { Loading } from 'quasar'

export default {
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
            spinnerSize: '140'
         })
         await Promise.all([
            this['spaces/getSpaces'](),
            this['pages/getPages'](),
         ])
            .finally(() => {
               Loading.hide()
               this.loading = false
            })
      }
   },

   async beforeMount() {
      await this.onAuthStateChange()
      await this.initData()
   }
}
</script>
