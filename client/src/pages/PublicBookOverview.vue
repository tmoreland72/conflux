<template>
   <q-page class="q-pa-lg bg-white text-dark container">
      <template v-if="loading"
         ><q-inner-loading color="primary" :showing="loading"
      /></template>

      <template v-else>
         <div class="row items-center">
            <div class="column q-gutter-sm">
               <div class="text-h5">{{ book.title }}</div>
               <div class="text-body2 ellipsis-3-lines">{{ book.subtitle }}</div>
            </div>
         </div>

         <section class="q-mt-lg">
            <content-viewer :content="book.overview" />
         </section>
      </template>
   </q-page>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
   name: 'PublicBookOverview',

   data() {
      return {
         loading: true,
         book: {},
      }
   },

   computed: {
      ...mapGetters(['published/book']),
   },

   methods: {
      init() {
         const interval = setInterval(() => {
            if (this['published/book'] && Object.keys(this['published/book']).length) {
               const book = {
                  ...this['published/book'],
               }
               this.book = book
               this.loading = false
               clearInterval(interval)
            }
         }, 500)
      },
   },

   watch: {
      $route: async function() {
         this.init()
      },
   },

   components: {
      ContentViewer: () => import('components/ContentViewer.vue'),
   },

   async mounted() {
      this.init()
   },
}
</script>
