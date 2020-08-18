<template>
   <div class="q-pa-md">
      <overview-header
         :spaceName.sync="spaceName"
         :spaceDescription.sync="spaceDescription"
         :space="space"
         :editMode.sync="editMode"
         :onSave="() => onSave()"
         :onArchive="() => onArchive()"
         :onDelete="() => onDelete()"
      />

      <div class="q-mt-lg">
         <template v-if="editMode">
            <div class="q-pa-lg full-width">
               <q-input
                  autocorrect="off"
                  autocapitalize="off"
                  autocomplete="off"
                  spellcheck="false"
                  autofocus
                  autogrow
                  borderless
                  filled
                  style="font-family: dm,Roboto,monospace;"
                  v-model="content"
                  @keydown.ctrl.s.exact.prevent="() => {}"
                  @keydown.shift.tab.exact.prevent="() => {}"
                  @keydown.tab.exact.prevent="() => {}"
                  @keydown="(e) => mxOnKey(e)"
               />
            </div>
         </template>

         <template v-else>
            <div class="q-pa-lg full-width">
               <q-markdown :src="space.overview"/>
            </div>
         </template>
      </div>
   </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { Notify } from 'quasar'

import mxKeyActions from 'src/mixins/mxKeyActions'

export default {
   data() {
      return {
         editMode: false,
         content: '',
         space: {},
         spaceName: '',
         spaceDescription: '',
      }
   },

   computed: {
      ...mapGetters(['spaces/space']),
   },

   mixins: [mxKeyActions],

   methods: {
      ...mapActions([
         'spaces/getSpaces',
         'spaces/updateSpace',
         'spaces/deleteSpace',
      ]),

      async initData() {
         let spaceId = this.$route.params.spaceId
         let space = await this['spaces/space'](spaceId)
         if (space) {
            this.space = space
         } else {
            return false
         }
      },

      async onSave() {
         let space = {...this.space}
         space.overview = this.content
         space.name = this.spaceName
         space.description = this.spaceDescription
         await this['spaces/updateSpace'](space)
            .then(async () => {
               Notify.create('Update successful')
               this.editMode = false
               await this.initData()
            })
            .catch(err => {
               console.error('onSave', err)
               Notify.create('Update failed')
               return false
            })
      },

      async _toggleArchive() {
         let space = {
            ...this.space,
            active: !this.space.active,
         }
         await this['spaces/updateSpace'](space)
            .then(() => {
               Notify.create('Update successful')
               this.editMode = false
               this.initData()
            })
            .catch(err => {
               console.error('onSave', err)
               Notify.create('Update failed')
               return false
            })
      },

      async onArchive() {
         if (this.space.active) {
            this.$q.dialog({
                  title: 'Confirmation',
                  message: 'Archiving a space will remove it from view but will NOT delete anything.  You can restore a space at any time. Are you sure?',
                  ok: {
                     color: 'negative',
                     label: 'Yes, Continue Archive',
                     noCaps: true,
                  },
                  cancel: {
                     flat: true,
                     label: 'No',
                     noCaps: true,
                  },
               })
               .onOk(async () => {
                  await this._toggleArchive()
               })
               .onCancel(() => {
                  return false
               })
         } else {
            await this._toggleArchive()
         }
      },

      onDelete() {
         this.$q.dialog({
               title: 'Confirmation',
               message: 'Deleting a space will permanently delete it and all Pages within. Are you sure?',
               ok: {
                  color: 'negative',
                  label: 'Continue Delete',
                  noCaps: true,
               },
               cancel: {
                  flat: true,
                  label: 'No',
                  noCaps: true,
               },
            })
            .onOk(async () => {
               try {
                  await this['spaces/deleteSpace'](this.space.id)
                  await this['spaces/getSpaces']()
                  Notify.create('Delete successful')
                  this.editMode = false
                  this.$router.replace({ name: 'home' })
               } catch (err) {
                  console.error('Spaces-Overview', 'onDelete', err)
                  Notify.create('Update failed')
               }
            })
            .onCancel(() => {
               return false
            })
      },
   },

   watch: {
      editMode: function(value) {
         if (value) {
            if (this.space.overview) this.content = this.space.overview
         } else {
            this.content = ''
         }
      },

      "$route": async function() {
         await this.initData()
      },

      space: function(value) {
         this.spaceName = value.name
         this.spaceDescription = value.description
      },
   },

   components: {
      OverviewHeader: require('./Header.vue').default,
   },

   async beforeMount() {
      await this.initData()
   },
}
</script>
