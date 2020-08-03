<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
   computed: {
      ...mapGetters([
         'pages/sorted',
         'spaces/sorted',
      ]),
   },

   methods: {
      ...mapActions([
         'pages/getPages',
         'spaces/getSpaces',
      ]),

      async initData() {
         if (!this['pages/sorted']().length) {
            await this['pages/getPages']()
         }
         if (!this['spaces/sorted'].length) {
            await this['spaces/getSpaces']()
         }
      }
   },

   beforeMount() {
      this.initData()
   }
}
</script>
