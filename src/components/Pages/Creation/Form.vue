<template>
   <div class="q-pa-sm column q-gutter-md" style="min-height: 240px;">
      <q-form class="q-gutter-md" @submit="onAdd(formData)">
         <q-input
            autofocus
            color="primary"
            label="Name"
            outlined
            v-model="formData.name"
         />

         <q-btn
            color="primary"
            label="Create"
            type="submit"

         />
      </q-form>
   </div>
</template>

<script>
export default {
   props: {
      onAdd: {
         type: Function,
         required: true,
      }
   },

   data() {
      return {
         formData: {
            name: '',
         }
      }
   },
}
</script>

<style scoped>

</style>
