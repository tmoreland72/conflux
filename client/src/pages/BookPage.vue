<template>
   <q-page class="q-pa-lg bg-white text-dark container">
      <template v-if="loading"><q-inner-loading color="primary" :showing="loading"/></template>

      <template v-else>
         <!-- View Mode -->
         <template v-if="mode === 'view'">
            <div class="row justify-between items-center">
               <div class="column q-gutter-sm">
                  <div class="text-h5">{{ page.title }}</div>
                  <div class="text-body2 ellipsis-3-lines">{{ page.subtitle }}</div>
               </div>

               <div class="row q-gutter-md">
                  <q-btn color="primary" no-caps @click="mode = 'edit'">
                     <q-icon :name="icons.edit" size="12px" />
                     <div class="q-ml-xs text-caption">{{ $t('update') }}</div>
                  </q-btn>

                  <!-- <q-btn color="secondary" dense flat round :icon="icons.bookmark_off" :loading="loading" no-caps /> -->

                  <q-btn color="secondary" dense flat :icon="icons.more" no-caps round @click.stop="">
                     <q-menu>
                        <q-list bordered separator>
                           <q-item clickable v-close-popup @click="onDeletePage(page)">
                              <q-item-section avatar>
                                 <q-icon :name="icons.delete" color="primary" flat />
                              </q-item-section>
                              <q-item-section>
                                 <q-item-label>{{ `${$t('delete')} ${$t('page')}` }}</q-item-label>
                              </q-item-section>
                           </q-item>
                        </q-list>
                     </q-menu>
                  </q-btn>
               </div>
            </div>

            <section class="q-mt-lg">
               <content-viewer :content="page.content" />
            </section>
         </template>

         <!-- Edit Mode -->
         <template v-else>
            <div class="row q-gutter-md">
               <q-btn color="primary" :label="$t('save')" :loading="processing" no-caps @click="onSubmit" />
               <q-btn flat :label="$t('cancel')" no-caps @click="mode = 'view'" />
            </div>

            <div class="q-mt-sm column q-gutter-md">
               <q-input color="primary" filled :label="$t('title')" v-model="page.title" />
               <q-input color="primary" filled :label="$t('subtitle')" v-model="page.subtitle" />
            </div>

            <section class="q-mt-md column">
               <div class="row justify-end text-caption">
                  <q-toggle :label="$t('showpreview')" left-label v-model="showPreview" />
               </div>
               <div>
                  <template v-if="showPreview">
                     <q-splitter v-model="splitter">
                        <template v-slot:before>
                           <content-editor class="q-pa-xs editor-container" :content.sync="page.content" />
                        </template>
                        <template v-slot:after>
                           <content-viewer class="q-pa-xs editor-container" :content="page.content" />
                        </template>
                     </q-splitter>
                  </template>
                  <template v-else>
                     <content-editor class="editor-container" :content.sync="page.content" />
                  </template>
               </div>
            </section>
         </template>
      </template>
   </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
import { Notify } from 'quasar'

import Core from 'src/mixins/Core'

export default {
   name: 'BookPage',

   data() {
      return {
         loading: true,
         processing: false,
         showPreview: false,
         splitter: 100,
         mode: 'view',
         page: {},
      }
   },

   computed: {
      ...mapGetters(['store/byId']),

      // page() {
      //    return this['store/byId']({ collection: 'pages', id: this.$route.params.pageId })
      // },
   },

   methods: {
      init() {
         const interval = setInterval(() => {
            if (this['store/byId']({ collection: 'pages', id: this.$route.params.pageId })) {
               this.page = { ...this['store/byId']({ collection: 'pages', id: this.$route.params.pageId }) }
               this.loading = false
               clearInterval(interval)
            }
         }, 500)
      },

      async onSubmit() {
         this.processing = true
         try {
            const page = this.page
            await this.$axios.patch(`/pages/${page.id}`, { id: page.id, changes: { ...page } })
            this.mode = 'view'
         } catch (error) {
            console.error('BookPage', 'onSubmit', error)
            Notify.create({ color: 'negative', message: 'There was a problem updating this page.' })
         } finally {
            this.processing = false
         }
      },
   },

   mixins: [Core],

   watch: {
      $route: function() {
         this.init()
      },

      showPreview: function(value) {
         if (value) {
            this.splitter = 50
         } else {
            this.splitter = 100
         }
      },
   },

   components: {
      ContentViewer: () => import('components/ContentViewer.vue'),
      ContentEditor: () => import('components/ContentEditor.vue'),
   },

   mounted() {
      this.init()
   },
}
</script>
