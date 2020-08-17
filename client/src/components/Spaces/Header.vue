<template>
   <div class="row justify-between items-center text-grey-9">
      <div class="q-pl-lg text-h5">{{space.name}}</div>

      <div class="row q-gutter-md">
         <template v-if="editMode">
            <q-btn flat label="Cancel" no-caps @click="onClickCancel()"/>
            <q-btn color="primary" label="Save" :loading="loading.save" no-caps @click="onClickSave()"/>
         </template>

         <template v-else>
            <q-btn dense flat round icon="edit" @click="onClickEdit()"/>
            <q-btn dense flat round :icon="handleStarIcon()" :loading="loading.star" no-caps @click="onClickStar()"/>
            <q-btn dense flat round icon="visibility" @click="onClickVisibility()"/>
            <q-btn color="primary" label="Share" no-caps @click="onClickShare()" />
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
import { mapActions } from 'vuex'
import { Notify } from 'quasar'

export default {
   props: {
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
         },
      }
   },

   methods: {
      ...mapActions([
         'spaces/updateSpace'
      ]),

      handleStarIcon() {
         if (this.space.starred) {
            return 'star'
         } else {
            return 'star_border'
         }
      },

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

      async onClickStar() {
         this.loading.star = true
         let space = {
            id: this.space.id,
            starred: !this.space.starred
         }
         await this['spaces/updateSpace'](space)
         .then(() => {
            Notify.create('Update successful')
         })
         .catch(() => {
            Notify.create('Update failed')
         })
         .finally(() => {
            this.initData()
            this.loading.star = false
         })
      },

      onClickShare() {
         Notify.create('Coming soon...')
      },

      onClickVisibility() {
         Notify.create('Coming soon...')
      }
   },

   components: {
      ActionMenu: require("./ActionMenu.vue").default,
   },

}
</script>
