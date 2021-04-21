<template>
   <q-page class="q-pa-lg bg-white text-dark container">
      <template v-if="loading"
         ><q-inner-loading color="primary" :showing="loading"
      /></template>

      <template v-else>
         <div class="row items-center">
            <div class="column q-gutter-sm">
               <div class="text-h5">{{ page.title }}</div>
               <div class="text-body2 ellipsis-3-lines">{{ page.subtitle }}</div>
            </div>
         </div>

         <section class="q-mt-lg">
            <content-viewer :content="page.content" />
         </section>
      </template>
   </q-page>
</template>

<script>
import { mapGetters } from 'vuex'

import Core from 'src/mixins/Core'

export default {
   name: 'PublicBookPage',

   data() {
      return {
         loading: true,
         page: {},
      }
   },

   computed: {
      ...mapGetters(['published/book']),
   },

   methods: {
      init() {
         const interval = setInterval(() => {
            if (this['published/book'] && Object.keys(this['published/book']).length) {
               const book = this['published/book']
               this.page = book.pages.find((f) => f.id === this.$route.params.pageId)
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
   },

   components: {
      ContentViewer: () => import('components/ContentViewer.vue'),
   },

   mounted() {
      this.init()
   },
}
</script>
