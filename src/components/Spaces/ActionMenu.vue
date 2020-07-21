<template>
   <q-btn dense flat round icon="more_vert">
      <q-menu>
         <q-btn
            class="full-width"
            color="grey-9"
            flat
            label="Delete"
            no-caps
            @click="onClickDelete()"
         />
      </q-menu>
   </q-btn>
</template>

<script>
export default {
   props: {
      onDelete: {
         type: Function,
         required: true,
      }
   },

   methods: {
      async onClickDelete() {
         await this.onDelete()
      },
   }
}
</script>

<style scoped>

</style>
