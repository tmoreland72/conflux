<template>
   <div class="row justify-between items-center text-grey-9">
      <template v-if="editMode">
         <div class="column q-gutter-md">
            <q-input
               :value="spaceName"
               outlined
               label="Name"
               @input="(value) => onInput('spaceName', value)"
            />
            <q-input
               :value="spaceDescription"
               outlined
               label="Description"
               @input="(value) => onInput('spaceDescription', value)"
            />
         </div>
      </template>

      <template v-else>
         <div class="column q-gutter-sm">
            <div class="q-pl-lg text-h5">{{ spaceName }}</div>
            <div class="q-pl-lg text-body2 ellipsis">{{ spaceDescription }}</div>
         </div>
      </template>

      <div class="row q-gutter-md">
         <template v-if="editMode">
            <q-btn flat label="Cancel" no-caps @click="onClickCancel()"/>
            <q-btn color="primary" label="Save" :loading="loading.save" no-caps @click="onClickSave()"/>
         </template>

         <template v-else>
            <q-btn
               dense
               :disable="!mxAuthorized('update')"
               flat
               round
               icon="edit"
               @click="onClickEdit()"
            />

            <q-btn
               dense
               flat
               round
               :icon="handleStarIcon()"
               :loading="loading.star"
               no-caps
               @click="onClickStar()"
            />

            <q-btn
               dense
               :disable="!mxAuthorized('admin')"
               flat
               :icon="handleVisibilityIcon()"
               :loading="loading.visibility"
               round
               @click="onClickVisibility()"
            >
               <q-tooltip>{{ handleVisibilityTooltip() }}</q-tooltip>
            </q-btn>

            <action-menu
               :space="space"
               :onArchive="() => onArchive()"
               :onDelete="() => onDelete()"
            />
         </template>
      </div>
   </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { Notify } from 'quasar'
import mxAuthorizations from 'src/mixins/mxAuthorizations'

export default {
   props: {
      spaceName: {
         type: String,
         required: true,
      },
      spaceDescription: {
         type: String,
         require: true,
      },
      space: {
         type: Object,
         required: true,
      },
      editMode: {
         type: Boolean,
      },
      onSave: {
         type: Function,
         required: true,
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

   data() {
      return {
         loading: {
            save: false,
            star: false,
            visibility: false,
         },
      }
   },

   computed: {
      ...mapState('auth', ['loggedIn']),
   },

   mixins: [mxAuthorizations],

   methods: {
      ...mapActions([
         'spaces/updateSpace',
      ]),

      onClickCancel() {
         this.$emit('update:editMode', false)
      },

      onClickEdit() {
         this.$emit('update:editMode', true)
      },

      async onClickSave() {
         this.loading.save = true
         await this.onSave()
         this.loading.save = false
      },

      onInput(field, value) {
         this.$emit('update:' + field, value)
      },

      handleStarIcon() {
         if (this.space.starred && this.space.starred.includes(this.loggedIn.uid)) {
            return 'star'
         } else {
            return 'star_border'
         }
      },

      async onClickStar() {
         let loggedIn = { ...this.loggedIn }
         this.loading.star = true
         let starred = this.space.starred ? [...this.space.starred] : []
         if (starred.includes(loggedIn.uid)) {
            let idx = starred.indexOf(loggedIn.uid)
            starred.splice(idx, 1)
         } else {
            starred.push(loggedIn.uid)
         }

         let space = {
            id: this.space.id,
            starred,
         }
         await this['spaces/updateSpace'](space)
            .then(() => {
               Notify.create('Update successful')
            })
            .catch(() => {
               Notify.create('Update failed')
            })
            .finally(() => {
               this.loading.star = false
            })
      },

      handleVisibilityIcon() {
         if (this.space.private) {
            return 'visibility_off'
         } else {
            return 'visibility'
         }
      },

      handleVisibilityTooltip() {
         if (this.space.private) {
            return 'Click to remove Private.  Manage permissions in Settings.'
         } else {
            return 'Click to make Private. Only Space Owner will have access.'
         }
      },

      async onClickVisibility() {
         this.loading.visibility = true
         let space = {
            id: this.space.id,
            private: !this.space.private,
         }
         await this['spaces/updateSpace'](space)
            .then(() => {
               Notify.create('Update successful')
            })
            .catch(() => {
               Notify.create('Update failed')
            })
            .finally(() => {
               this.loading.visibility = false
            })
      },
   },

   components: {
      ActionMenu: require('./ActionMenu.vue').default,
   },

}
</script>
