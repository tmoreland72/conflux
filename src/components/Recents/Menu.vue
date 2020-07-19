<template>
   <q-btn color="grey-9" dense flat icon-right="arrow_drop_down" label="Recent" no-caps>
      <q-menu>
         <recent />
      </q-menu>
   </q-btn>
</template>

<script>
export default {
   components: {
      Recent: require("components/Recents/Content.vue").default,
   }
}
</script>

<style scoped>

</style>
