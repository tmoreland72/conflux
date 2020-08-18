<template>
   <div class="q-pa-md">
      <div class="row items-center q-gutter-sm">
         <div class="text-h6 text-grey-9">Spaces</div>
         <q-btn
            class="q-ml-lg"
            color="primary"
            label="Create Space"
            icon="add"
            no-caps
            rounded
            size="md"
            :to="{ name: 'createSpace' }"
         />

         <q-space />

         <q-btn
            class="text-grey-9"
            label="View All Spaces"
            no-caps
            style="{ border-bottom: 1px dotted; }"
            :to="{ name: 'spaces' }"
         />
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
