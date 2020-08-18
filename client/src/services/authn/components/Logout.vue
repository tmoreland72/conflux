<template>
   <q-page class="flex flex-center">
      <q-spinner-pie color="primary" size="4em" :thickness="2" />
   </q-page>
</template>

<script>
import { mapActions } from 'vuex'

export default {
   methods: {
      ...mapActions(['auth/logout']),
   },

   async mounted() {
      await this['auth/logout']('firebase')
      await this.$router.replace({ name: 'home' })
   }
}
</script>

<style scoped>

</style>
