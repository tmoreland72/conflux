<template>
   <div class="q-pa-md">
      <page-header
         :pageName.sync="pageName"
         :editMode.sync="editMode"
         :onSave="() => onSave()"
         :onDelete="() => onDelete()"
      />

      <div class="q-mt-lg">
         <template v-if="editMode">
            <div class="q-pa-lg row justify-end">
               <q-toggle label="Show Preview" v-model="preview" />
            </div>

            <div class="q-pa-lg full-width">
               <template v-if="preview">
               <q-splitter :value="50">
                  <template v-slot:before>
                     <div class="q-mr-md">
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

                  <template v-slot:after>
                     <div class="q-ml-md">
                        <markdown :src="content" />
                     </div>
                  </template>
               </q-splitter>
               </template>

               <template v-else>
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
               </template>

            </div>
         </template>

         <template v-else>
            <div class="q-pa-lg full-width">
               <markdown :src="page.content" />
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
         pageName: '',
         preview: false,
         space: {}
      }
   },

   computed: {
      ...mapGetters([
         'pages/page'
      ]),
   },

   mixins: [ mxKeyActions ],

   methods: {
      ...mapActions([
         'spaces/getSpace',
         'pages/updatePage',
         'pages/deletePage'
      ]),

      initData() {
         let spaceId = this.$route.params.spaceId
         this.space = this['spaces/getSpace'](spaceId)
         let pageId = this.$route.params.pageId
         this.page = this['pages/page'](pageId)
      },

      async onSave() {
         let page = {
            ...this.page,
            name: this.pageName,
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
               if (this.page.parent === 0) {
                  await this.$router.push({ name: 'space-overview', params: { spaceId }})
               } else {
                  await this.$router.push({ name: 'page', params: { spaceId, pageId: this.page.parent }})
               }
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

      page: function(value) {
         this.pageName = value.name
      }
   },

   components: {
      PageHeader: require("./Header.vue").default,
      Markdown: require("components/Markdown.vue").default,
   },

   beforeMount() {
      this.initData()
   }
}
</script>
