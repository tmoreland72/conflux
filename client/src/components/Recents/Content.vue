<template>
   <div class="q-pa-lg" style="min-width: 300px;">
      <q-input color="grey-9" dense outlined v-model="filter">
         <template v-slot:prepend>
            <q-icon name="filter_list" />
         </template>
      </q-input>

      <div class="q-mt-lg">
         <template v-if="recents.length">
         </template>

         <template v-else>
            <div class="text-caption">No recent pages to show</div>
         </template>
      </div>
   </div>

</template>

<script>
export default {
   data() {
      return {
         filter: '',
         recents: []
      }
   },
}
</script>

<style scoped>

</style>
