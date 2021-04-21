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
         book: {
            title: '',
            subtitle: '',
            overview: '',
         },
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

   meta() {
      const host = window.location.origin
      return {
         title: `Conflux${this.book ? ' | ' + this.book.title : ''}`,
         meta: {
            description: {
               name: 'description',
               content:
                  this.book && this.book.subtitle && this.book.subtitle.length
                     ? this.book.subtitle
                     : 'Document Everything from Anywhere',
            },
            ogTitle: {
               name: 'og:title',
               content: `Conflux${this.book ? ' | ' + this.book.title : ''}`,
            },
            ogType: { name: 'og:type', content: 'website' },
            ogUrl: { name: 'og:url', content: window.location.href },
            ogDescription: {
               name: 'og:description',
               content:
                  this.book && this.book.subtitle && this.book.subtitle.length
                     ? this.book.subtitle
                     : 'Document Everything from Anywhere',
            },
            ogImage: {
               name: 'og:image',
               content: `${host}/images/accent-on-primary.png`,
            },
            twitterTitle: {
               name: 'twitter:title',
               content: `Conflux${this.book ? ' | ' + this.book.title : ''}`,
            },
            twitterCard: { name: 'twitter:card', content: 'summary_large_image' },
            twitterUrl: { name: 'twitter:url', content: window.location.href },
            twitterDescription: {
               name: 'twitter:description',
               content:
                  this.book && this.book.subtitle && this.book.subtitle.length
                     ? this.book.subtitle
                     : 'Document Everything from Anywhere',
            },
            twitterImage: {
               name: 'twitter:image',
               content: `${host}/images/accent-on-primary.png`,
            },
         },
      }
   },

   components: {
      ContentViewer: () => import('components/ContentViewer.vue'),
   },

   async mounted() {
      this.init()
   },
}
</script>
