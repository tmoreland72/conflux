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
               <q-tab name="publish" :label="$t('publish')" no-caps />
               <!-- <q-tab name="permissions" :label="$t('permissions')" no-caps /> -->
            </q-tabs>

            <q-separator />

            <q-tab-panels class="q-mt-md" v-model="tab" animated>
               <!-- Content Panel -->
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

               <!-- Publish Panel -->
               <q-tab-panel name="publish">
                  <template v-if="published">
                     <div class="column">
                        <span class="text-subtitle1">Published Link:</span>
                        <div class="row items-center q-gutter-sm">
                           <span class="text-h6 text-weight-light">
                              {{ publishedBook.link.url }}
                           </span>
                           <q-icon
                              name="content_copy"
                              color="grey-5"
                              size="xs"
                              @click="onCopyLink"
                           />
                           <q-icon
                              name="launch"
                              color="grey-5"
                              size="xs"
                              @click="onLaunchLink"
                           />
                        </div>
                        <div class="q-mt-lg">
                           <q-btn
                              :label="$t('unpublishbook')"
                              :loading="processing"
                              color="primary"
                              no-caps
                              @click="onUnpublish"
                           />
                        </div>
                     </div>
                  </template>
                  <template v-else>
                     <q-btn
                        :label="$t('publishbook')"
                        :loading="processing"
                        color="primary"
                        no-caps
                        @click="onPublish"
                     />
                  </template>
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
import { mapActions, mapGetters } from 'vuex'
import { copyToClipboard, openURL, Notify } from 'quasar'

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
         published: false,
         publishedBook: {},
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
      ...mapActions(['published/getBook']),

      init() {
         const interval = setInterval(async () => {
            if (this['store/byId']({ collection: 'books', id: this.$route.params.id })) {
               await this.getPublished()
               this.loading = false
               clearInterval(interval)
            }
         }, 500)
      },

      async getPublished() {
         try {
            let publishedResult = await this.$axios.get(`/published/${this.book.id}`)
            if (publishedResult.data.success) {
               this.published = true
               this.publishedBook = publishedResult.data.data
            } else {
               this.published = false
               this.publishedBook = {}
            }
         } catch (error) {
            console.error('getPublished', error)
            this.published = false
         }
      },

      async onPublish() {
         this.processing = true
         try {
            await this.$axios.post(`/published/${this.book.id}`, {})
            this.init()
         } catch (error) {
            console.error('onPublish', error)
         } finally {
            this.processing = false
         }
      },

      async onUnpublish() {
         this.processing = true
         try {
            await this.$axios.delete(`/published/${this.book.id}`, {})
            this.init()
         } catch (error) {
            console.error('onUnpublish', error)
         } finally {
            this.processing = false
         }
      },

      async onCopyLink() {
         try {
            await copyToClipboard(this.publishedBook.link.url)
            Notify.create(this.$t('copied'))
         } catch (error) {
            console.error('onCopyLink', error)
            Notify.create({ color: 'negative', message: this.$t('failed') })
         }
      },

      onLaunchLink() {
         openURL(this.publishedBook.link.url)
      },
   },

   mixins: [Core],

   watch: {
      $route: function() {
         this.init()
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
