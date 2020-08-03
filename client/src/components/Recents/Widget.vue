<template>
   <div class="q-pa-md">
      <div class="row items-center q-gutter-sm">
         <div class="text-h6 text-grey-9">Recent Pages</div>
      </div>

      <recents />
   </div>
</template>

<script>
export default {
   components: {
      Recents: require("components/Recents/Content.vue").default,
   }
}
</script>

<style scoped>

</style>
