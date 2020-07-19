<template>
   <q-btn color="grey-9" dense flat icon-right="arrow_drop_down" label="Spaces" no-caps>
      <q-menu>
         <spaces view="list" getter="starred"/>
         <q-separator />
         <q-btn
            class="full-width"
            color="grey-9"
            flat
            label="View all spaces"
            no-caps
            :to="{ name: 'spaces' }"
         />
      </q-menu>
   </q-btn>
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
