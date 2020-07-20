<template>
   <div class="q-pa-md">
      <page-header
         :editMode.sync="editMode"
         :onSave="() => onSave()"
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
               <q-markdown
                  :task-lists-enable="page.type === 'todo'"
                  :src="page.content"
               />
            </div>
         </template>
      </div>
   </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { Notify } from 'quasar'

import mxKeyActions from 'src/mixins/mxKeyActions'

export default {
   data() {
      return {
         editMode: false,
         content: '',
         page: {},
         space: {}
      }
   },

   computed: {
      ...mapState('spaces', ['spaces']),
      ...mapGetters(['pages/page']),
   },

   mixins: [ mxKeyActions ],

   methods: {
      ...mapActions([
         'pages/updatePage',
         'pages/deletePage'
      ]),

      initData() {
         let spaceId = this.$route.params.spaceId
         this.space = this.spaces[spaceId]
         let pageId = this.$route.params.pageId
         this.page = this['pages/page'](pageId)
      },

      async onSave() {
         let page = {
            ...this.page,
            content: this.content
         }
         await this['pages/updatePage'](page)
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
      },

      async onDelete() {
         let spaceId = this.$route.params.spaceId
         let pageId = this.$route.params.pageId
         await this['pages/deletePage'](pageId)
            .then(async () => {
               Notify.create('Delete successful')
               this.editMode = false
               await this.$router.push({ name: 'space', params: { spaceId }})
            })
            .catch(err => {
               console.error("onDelete", err)
               Notify.create('Delete failed')
               return false
            })
      },

   },

   watch: {
      '$route': function() {
         this.initData()
      },

      editMode: function(value) {
         if (value) {
            this.content = this.page.content
         } else {
            this.content = ''
         }
      },
   },

   components: {
      PageHeader: require("./Header.vue").default,
   },

   beforeMount() {
      this.initData()
   }
}
</script>
