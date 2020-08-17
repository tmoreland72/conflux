<template>
   <q-btn dense flat round icon="more_vert">
      <q-menu>
         <q-btn
            align="left"
            class="full-width"
            color="grey-9"
            flat
            :label="space.active ? 'Archive Space' : 'Restore Space'"
            no-caps
            v-close-popup
            @click="onClickArchive"
         />
         <q-btn
            align="left"
            class="full-width"
            color="grey-9"
            flat
            label="Delete Space"
            no-caps
            v-close-popup
            @click="onClickDelete"
         />
      </q-menu>
   </q-btn>
</template>

<script>

import { mapActions } from 'vuex'

export default {
   props: {
      space: {
         type: Object,
         required: true
      },
      onArchive: {
         type: Function,
         required: true,
      },
      onDelete: {
         type: Function,
         required: true,
      },
   },

   methods: {
      async onClickArchive() {
         await this.onArchive()
         await this.initData()
      },

      async onClickDelete() {
         await this.onDelete()
      },
   },

}
</script>

<style scoped>

</style>
