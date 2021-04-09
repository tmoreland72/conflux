<template>
   <q-page class="q-pa-lg bg-white text-dark container">
      <template v-if="loading"><q-inner-loading color="primary" :showing="loading"/></template>

      <template v-else>
         <!-- View Mode -->
         <template v-if="mode === 'view'">
            <div class="row justify-between items-center">
               <div class="column q-gutter-sm">
                  <div class="text-h5">{{ book.title }}</div>
                  <div class="text-body2 ellipsis-3-lines">{{ book.subtitle }}</div>
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
                           <q-item clickable v-close-popup @click="onDeleteBook">
                              <q-item-section avatar>
                                 <q-icon :name="icons.delete" color="primary" flat />
                              </q-item-section>
                              <q-item-section>
                                 <q-item-label>{{ `${$t('delete')} ${$t('book')}` }}</q-item-label>
                              </q-item-section>
                           </q-item>
                        </q-list>
                     </q-menu>
                  </q-btn>
               </div>
            </div>

            <section class="q-mt-lg">
               <content-viewer :content="book.overview" />
            </section>
         </template>

         <!-- Edit Mode -->
         <template v-else>
            <div class="column q-gutter-md">
               <q-input color="primary" filled :label="$t('title')" v-model="book.title" />
               <q-input color="primary" filled :label="$t('subtitle')" v-model="book.subtitle" />
            </div>

            <div class="q-mt-lg row q-gutter-md">
               <q-btn color="primary" :label="$t('submit')" :loading="processing" no-caps @click="onSubmit()" />
               <q-btn flat :label="$t('cancel')" no-caps @click="mode = 'view'" />
            </div>

            <section class="q-mt-lg">
               <content-editor class="editor-container" :content.sync="book.overview" />
            </section>
         </template>
      </template>
   </q-page>
</template>

<script>
import { mapGetters } from 'vuex'

import Core from 'src/mixins/Core'

export default {
   name: 'BookOverview',

   data() {
      return {
         loading: true,
         processing: false,
         mode: 'view',
         book: {},
      }
   },

   computed: {
      ...mapGetters(['store/byId']),
   },

   methods: {
      init() {
         this.loading = true
         const interval = setInterval(() => {
            const book = this['store/byId']({ collection: 'books', id: this.$route.params.id })
            if (book && book.overview) {
               console.log('book', book)
               this.book = book
               this.loading = false
               clearInterval(interval)
            }
         }, 500)
      },

      async onSubmit() {
         this.processing = true
         try {
            const before = this['store/byId']({ collection: 'books', id: this.$route.params.id })
            const after = this.book
            const changes = {}
            Object.keys(before).forEach((key) => {
               if (before[key] !== after[key]) changes[key] = after[key]
            })
            await this.$axios.patch(`/books/${this.book.id}`, changes)
            this.mode = 'view'
         } catch (error) {
            console.error('BookOverview', 'onSubmit', error)
            Notify.create({ color: 'negative', message: 'There was a problem updating this book.' })
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
