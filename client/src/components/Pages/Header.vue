<template>
   <div class="row justify-between items-center text-grey-9">
      <div v-if="editMode">
         <q-input :value="pageName" outlined label="Name" @input="(value) => onInput(value)" />
      </div>
      <div v-else class="q-pl-lg text-h5">{{pageName}}</div>

      <div class="row q-gutter-md">
         <template v-if="editMode">
            <q-btn flat label="Cancel" no-caps @click="onClickCancel()"/>
            <q-btn color="primary" label="Save" :loading="loading.save" no-caps @click="onClickSave()"/>
         </template>

         <template v-else>
            <q-btn dense flat round icon="edit" @click="onClickEdit()"/>
            <q-btn dense flat round :icon="handleStarIcon()" :loading="loading.star" no-caps @click="onClickStar()"/>
            <q-btn dense flat round icon="visibility" @click="onClickVisibility()"/>
            <q-btn color="primary" label="Share" no-caps />
            <action-menu :onDelete="() => onDelete()"/>
         </template>
      </div>
   </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { Notify } from 'quasar'

export default {
   props: {
      pageName: {
         type: String,
         required: true,
      },
      editMode: {
         type: Boolean,
      },
      onSave: {
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
         page: {}
      }
   },

   computed: {
      ...mapGetters(['pages/page'])
   },

   methods: {
      ...mapActions([
         'pages/updatePage'
      ]),

      handleStarIcon() {
         if (this.page.starred) {
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
         let page = {
            ...this.page,
            starred: !this.page.starred,
         }
         try {
            await this['pages/updatePage'](page)
            Notify.create('Update successful')
            this.loading.star = false
         } catch (err) {
            Notify.create('Update failed')
         }
      },

      onClickVisibility() {
         Notify.create('Coming soon...')
      },

      onInput(value) {
         this.$emit('update:pageName', value)
      }
   },

   components: {
      ActionMenu: require("./ActionMenu.vue").default
   },
}
</script>
