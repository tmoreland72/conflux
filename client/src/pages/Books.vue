<template>
   <q-page class="q-pa-lg bg-dark text-accent container">
      <div class="row justify-between items-center q-gutter-lg">
         <section class="row items-center">
            <span class="text-h5 text-weight-light">{{ $t('books') }}</span>
         </section>

         <section class="row items-center">
            <q-btn
               class="q-mr-md"
               color="primary"
               :label="`${$t('create')} ${$t('book')}`"
               :icon="icons.addBook"
               no-caps
               @click="showBookCreateDialog = true"
            />
            <q-btn color="accent" flat :label="$t('hidearchived')" no-caps :to="{ name: 'home' }" />
         </section>
      </div>

      <div class="q-pa-lg row justify-start items-start q-gutter-lg">
         <template v-if="!books.length"><q-inner-loading color="primary" :spinning="true"/></template>
         <template v-else>
            <book-card v-for="book in books" :key="book.id" :book="book" />
         </template>
      </div>
   </q-page>
</template>

<script>
import Core from 'src/mixins/Core'

export default {
   name: 'PageIndex',

   computed: {
      books() {
         return this['store/all']({ collection: 'books', includeArchived: true })
      },
   },

   methods: {
      init() {
         let books = []
         const interval = setInterval(() => {
            books = this['store/all']({ collection: 'books' })
            if (this['store/all']({ collection: 'books' }).length) {
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
      BookCard: () => import('components/BookCard.vue'),
   },

   mounted() {
      this.init()
   },
}
</script>

<style lang="sass" scoped>

</style>
