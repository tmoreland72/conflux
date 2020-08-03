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

import { mapState } from 'vuex'

export default {
   props: {
      onArchive: {
         type: Function,
         required: true,
      },
      onDelete: {
         type: Function,
         required: true,
      },
   },

   data() {
      return {
         space: {},
      }
   },

   computed: {
      ...mapState('spaces', ['spaces']),
   },

   methods: {
      initData() {
         let spaceId = this.$route.params.spaceId
         this.space = this.spaces[spaceId]
      },

      async onClickArchive() {
         await this.onArchive()
         this.initData()
      },

      async onClickDelete() {
         await this.onDelete()
      },
   },

   beforeMount() {
      this.initData()
   }

}
</script>

<style scoped>

</style>
