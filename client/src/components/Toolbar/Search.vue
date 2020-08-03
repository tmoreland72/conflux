<template>
   <q-input color="grey-9" dense outlined v-model="search">
      <template v-slot:prepend>
         <q-icon name="search" />
      </template>
   </q-input>
</template>

<script>
export default {
   data() {
      return {
         search: ''
      }
   }
}
</script>

<style scoped>

</style>
