<template> </template>

<script>
import { mapActions } from 'vuex'
import { Loading, LocalStorage, SessionStorage } from 'quasar'

import Core from 'src/mixins/Core'

export default {
   name: 'Logout',

   methods: {
      ...mapActions(['user/clear', 'books/clear']),
   },

   mixins: [Core],

   async mounted() {
      Loading.show({ message: 'Closing session...' })
      setTimeout(() => {
         LocalStorage.clear()
         SessionStorage.clear()
         this.destroyData()
         delete this.$axios.defaults.headers.common.Authorization
         this.$router.push({ name: 'anonymous' })
         Loading.hide()
      }, 1000)
   },
}
</script>

<style></style>
