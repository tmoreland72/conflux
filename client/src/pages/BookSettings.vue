<template>
   <q-page class="q-pa-lg bg-white text-dark">
      <template v-if="loading"
         ><q-inner-loading color="primary" :showing="loading"
      /></template>

      <template v-else>
         <div class="text-h5">{{ $t('settings') }}</div>

         <div class="q-mt-lg">
            <q-tabs
               align="left"
               v-model="tab"
               dense
               active-bg-color="accent"
               active-color="primary"
               indicator-color="primary"
            >
               <q-tab name="content" :label="$t('content')" no-caps />
               <q-tab name="permissions" :label="$t('permissions')" no-caps />
            </q-tabs>

            <q-separator />

            <q-tab-panels class="q-mt-md" v-model="tab" animated>
               <q-tab-panel name="content" class="q-pa-none">
                  <q-splitter v-model="tabSplitter">
                     <!-- Submenu -->
                     <template v-slot:before>
                        <q-tabs
                           dense
                           active-bg-color="accent"
                           active-color="primary"
                           indicator-color="primary"
                           vertical
                           v-model="innerTab"
                        >
                           <q-tab
                              class="q-pa-sm"
                              name="chapters"
                              :icon="icons.chapter"
                              :label="$t('chapters')"
                              no-caps
                           />
                           <q-tab
                              name="export"
                              :icon="icons.export"
                              :label="$t('export')"
                              no-caps
                           />
                           <q-tab
                              name="import"
                              :icon="icons.import"
                              :label="$t('import')"
                              no-caps
                           />
                        </q-tabs>
                     </template>

                     <!-- Submenu Panel -->
                     <template v-slot:after>
                        <q-tab-panels
                           animated
                           transition-prev="slide-down"
                           transition-next="slide-up"
                           v-model="innerTab"
                        >
                           <!-- Chapters -->
                           <q-tab-panel name="chapters">
                              <div class="row q-gutter-md">
                                 <chapter-card
                                    v-for="chapter in chapters"
                                    :key="chapter.id"
                                    :chapter="chapter"
                                 />
                              </div>
                           </q-tab-panel>
                        </q-tab-panels>
                     </template>
                  </q-splitter>
               </q-tab-panel>
            </q-tab-panels>
         </div>

         <!-- <ul>
            <li>Book</li>
            <ul>
               <li>Import/Export</li>
               <li>Permissions</li>
               <li>Share</li>
               <li>Archive</li>
            </ul>
            <li>Chapters</li>
            <ul>
               <li>Order</li>
               <li>Remove</li>
               <li>Rename</li>
               <li>Page Order</li>
               <li>Page Remove</li>
               <li>Page Add</li>
            </ul>
         </ul> -->
      </template>
   </q-page>
</template>

<script>
import { mapGetters } from 'vuex'

import Core from 'src/mixins/Core'

export default {
   name: 'BookSettings',

   data() {
      return {
         loading: true,
         processing: false,
         tab: 'content',
         innerTab: 'chapters',
         tabSplitter: 12,
      }
   },

   computed: {
      ...mapGetters([
         'store/all',
         'store/byId',
         'store/chaptersByBook',
         'store/pagesByBook',
      ]),

      book() {
         return this['store/byId']({ collection: 'books', id: this.$route.params.id })
      },

      chapters() {
         return this['store/chaptersByBook'](this.$route.params.id)
      },

      pages() {
         return this['store/pagesByBook'](this.$route.params.id)
      },
   },

   methods: {
      init() {
         const interval = setInterval(() => {
            if (this['store/byId']({ collection: 'books', id: this.$route.params.id })) {
               this.loading = false
               clearInterval(interval)
            }
         }, 500)
      },
   },

   mixins: [Core],

   watch: {
      $route: function() {
         this.init()
      },

      chapters: function() {
         console.log('BookSettings', 'watch', 'chapters')
      },
   },

   components: {
      ChapterCard: () => import('components/ChapterCard.vue'),
   },

   mounted() {
      this.init()
   },
}
</script>

<style></style>
