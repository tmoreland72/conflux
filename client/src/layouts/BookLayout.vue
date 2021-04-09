<template>
   <q-layout class="bg-dark" view="hHh LpR lff">
      <page-header :toggleMenu="toggleMenu" @initLayout="init" />

      <q-drawer bordered overlay content-class="bg-dark text-accent" dark show-if-above v-model="openDrawer">
         <template v-if="loading"><q-inner-loading dark color="primary" :spinning="true"/></template>

         <template v-else>
            <q-list padding>
               <q-item>
                  <q-item-section avatar>
                     <q-avatar
                        square
                        rounded
                        color="primary"
                        :icon="book.icon ? book.icon : 'book'"
                        size="md"
                        text-color="white"
                     />
                  </q-item-section>
                  <q-item-section>
                     <q-item-label class="text-h5 text-weight-light">{{ book.title }}</q-item-label>
                  </q-item-section>
               </q-item>

               <q-item
                  active-class="bg-secondary text-primary"
                  clickable
                  v-ripple
                  :to="{ name: 'book', params: { id: book.id } }"
               >
                  <q-item-section avatar>
                     <q-icon name="sort" size="sm" />
                  </q-item-section>
                  <q-item-section>
                     <q-item-label class="text-h6 text-weight-light">{{ $t('overview') }}</q-item-label>
                  </q-item-section>
               </q-item>

               <q-item
                  active-class="bg-secondary text-primary"
                  clickable
                  v-ripple
                  :to="{ name: 'book-settings', params: { id: book.id } }"
               >
                  <q-item-section avatar>
                     <q-icon name="settings" size="sm" />
                  </q-item-section>
                  <q-item-section>
                     <q-item-label class="text-h6 text-weight-light">{{ $t('settings') }}</q-item-label>
                  </q-item-section>
               </q-item>

               <div class="q-mt-lg"></div>
               <q-separator dark inset />
               <div class="q-mt-lg"></div>

               <!-- Chapters -->
               <q-item>
                  <q-item-section avatar>
                     <q-icon :name="icons.chapter" color="primary" size="sm" />
                  </q-item-section>
                  <q-item-section>
                     <q-item-label class="text-h6 text-weight-light">{{ $t('chapters') }}</q-item-label>
                  </q-item-section>
               </q-item>

               <q-expansion-item
                  :content-inset-level="0.3"
                  v-for="chapter in chapters"
                  :key="chapter.title"
                  default-opened
               >
                  <template v-slot:header>
                     <q-item-section>
                        <div class="column">
                           <span class="text-subtitle1">{{ chapter.title }}</span>
                           <span v-if="chapter.subtitle" class="text-caption text-grey-6 text-italic ellipsis">{{
                              chapter.subtitle
                           }}</span>
                        </div>
                     </q-item-section>
                  </template>

                  <!-- Pages -->
                  <template v-if="pages.length">
                     <q-list separator class="q-px-sm text-grey-6">
                        <q-item
                           v-for="page in chapterPages(chapter)"
                           :key="page.id"
                           active-class="bg-secondary text-primary"
                           clickable
                           v-ripple
                           :to="{ name: 'book-page', params: { id: book.id, pageId: page.id } }"
                        >
                           <q-item-section>
                              <div class="column" style="width: 100%;">
                                 <span class="text-body1 text-weight-light ellipsis" style="max-width: 100%">
                                    {{ page.title }}
                                 </span>
                                 <span class="text-caption text-italic ellipsis" style="max-width: 100%">{{
                                    page.subtitle
                                 }}</span>
                              </div>
                           </q-item-section>
                        </q-item>
                     </q-list>
                  </template>
                  <template v-else>
                     <q-list dense class="q-px-sm text-grey-6">
                        <q-item>
                           <q-item-section>
                              <q-item-label class="text-body2 text-weight-light text-italic">
                                 {{ $t('emptychapter') }}
                              </q-item-label>
                           </q-item-section>
                        </q-item>
                     </q-list>
                  </template>
               </q-expansion-item>
            </q-list>
         </template>
      </q-drawer>

      <q-page-container>
         <router-view />
      </q-page-container>
   </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'

import Core from 'src/mixins/Core'

export default {
   name: 'BookLayout',

   data() {
      return {
         loading: true,
         openDrawer: true,
      }
   },

   computed: {
      ...mapGetters(['store/all', 'store/byId', 'store/chaptersByBook', 'store/pagesByBook']),

      book() {
         return this['store/byId']({ collection: 'books', id: this.$route.params.id })
      },

      chapters() {
         const chapters = this['store/all']({ collection: 'chapters' })
         return chapters.filter((f) => f.bookId === this.$route.params.id)
      },

      monitorChapters() {
         return this['store/all']({ collection: 'chapters' })
      },

      pages() {
         return this['store/pagesByBook'](this.$route.params.id)
      },
   },

   methods: {
      init() {
         const interval = setInterval(() => {
            if (
               this['store/byId']({ collection: 'books', id: this.$route.params.id }) &&
               this['store/chaptersByBook'](this.$route.params.id) &&
               this['store/pagesByBook'](this.$route.params.id)
            ) {
               this.loading = false
               clearInterval(interval)
            }
         }, 500)
      },

      chapterPages(chapter) {
         return this.pages.filter((f) => f.chapterId === chapter.id)
      },

      toggleMenu() {
         this.openDrawer = !this.openDrawer
      },
   },

   mixins: [Core],

   watch: {
      $route: function() {
         console.log('BookLayout', 'watch', 'route')
         this.init()
      },

      $monitorChapters: function() {
         console.log('BookLayout', 'watch', chapters)
      },
   },

   components: {
      PageHeader: () => import('components/PageHeader.vue'),
   },

   mounted() {
      this.init()
   },
}
</script>
