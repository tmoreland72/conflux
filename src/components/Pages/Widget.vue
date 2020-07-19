<template>
   <div class="q-pa-md">
      <div class="row items-center q-gutter-sm">
         <div class="text-h6 text-grey-9">Spaces</div>
         <q-btn class="text-grey-7" icon="add" round size="xs" :to="{ name: 'createSpace' }"/>
         <q-space />
         <q-btn class="text-grey-9" dense flat label="View All" no-caps :to="{ name: 'spaces' }"/>
      </div>

      <spaces />
   </div>
</template>

<script>
export default {
   components: {
      Spaces: require("./List.vue").default,
   }
}
</script>

<style scoped>

</style>
