<template>
   <div class="q-pa-md">
      <overview-header :space="space" :editMode.sync="editMode" :onSave="() => onSave()"/>

      <div class="q-mt-lg">
         <template v-if="editMode">
            <div class="q-pa-lg full-width">
               <q-input
                  autofocus
                  autogrow
                  borderless
                  filled
                  style="font-family: dm,Roboto,monospace;"
                  v-model="content"
               />
            </div>
         </template>

         <template v-else>
            <div class="q-pa-lg full-width">
               <q-markdown :src="space.overview" />
            </div>
         </template>
      </div>
   </div>
</template>

<script>
import { mapActions } from 'vuex'
import { Notify } from 'quasar'

export default {
   props: {
      space: {
         type: Object,
         required: true,
      },
   },

   data() {
      return {
         editMode: false,
         content: '',
      }
   },

   methods: {
      ...mapActions(['spaces/updateSpace']),

      async onSave() {
         let space = {
            id: this.space.id,
            overview: this.content
         }
         await this['spaces/updateSpace'](space)
            .then(() => {
               Notify.create('Update successful')
               this.editMode = false
               return true
            })
            .catch(err => {
               console.error("onSave", err)
               Notify.create('Update failed')
               return false
            })
      }
   },

   watch: {
      editMode: function(value) {
         if (value) {
            this.content = this.space.overview
         } else {
            this.content = ''
         }
      }
   },

   components: {
      OverviewHeader: require("./Header.vue").default,
   }
}
</script>
