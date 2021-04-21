<template>
   <q-card
      class="cursor-pointer shadow-7 bg-accent text-secondary"
      clickable
      bordered
      v-ripple
      style="width: 320px; height: 160px;"
      @click="onClickBook(book)"
   >
      <template v-if="deleting"><q-inner-loading color="primary" :spinning="true"/></template>
      <template v-else>
         <q-card-section class="bg-secondary" style="height: 24px;"></q-card-section>
         <q-card-section style="padding: 0px;">
            <q-avatar
               :color="book.archived ? 'dark' : 'primary'"
               text-color="accent"
               :icon="book.icon ? book.icon : 'book'"
               class="absolute"
               size="48px"
               style="top: -24px; left: 8px;"
            />
         </q-card-section>
         <q-card-section style="padding-top: 0px; padding-bottom: 0px; padding-right: 8px;">
            <div class="row justify-end q-gutter-sm">
               <!-- <q-btn color="secondary" dense flat :icon="icons.bookmark_off" round @click.stop="onBookmark" /> -->
               <q-btn color="secondary" dense flat :icon="icons.more" round @click.stop="">
                  <q-menu>
                     <q-list bordered separator>
                        <q-item v-if="!book.archived" clickable v-close-popup @click="onArchiveBook">
                           <q-item-section avatar>
                              <q-icon :name="icons.archive" color="primary" flat />
                           </q-item-section>
                           <q-item-section>
                              <q-item-label>{{ `${$t('archive')} ${$t('book')}` }}</q-item-label>
                           </q-item-section>
                        </q-item>
                        <q-item v-if="book.archived" clickable v-close-popup @click="onRestoreBook">
                           <q-item-section avatar>
                              <q-icon :name="icons.restore" color="primary" flat />
                           </q-item-section>
                           <q-item-section>
                              <q-item-label>{{ `${$t('restore')} ${$t('book')}` }}</q-item-label>
                           </q-item-section>
                        </q-item>
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
         </q-card-section>
         <q-card-section class="column" style="padding-top: 0px;">
            <span class="q-ml-xs text-h6 text-weight-medium ellipsis" style="max-width: 95%">{{ book.title }}</span>
            <span v-if="book.subtitle" class="q-ml-xs text-caption text-italic ellipsis" style="max-width: 95%">{{
               book.subtitle
            }}</span>
            <span v-else class="q-mb-md"></span>
         </q-card-section>
         <q-card-section class="column" style="padding-top: 0px;">
            <span class="q-ml-xs ellipsis" style="max-width: 95%; font-size: .7em;">{{
               prettyDate(book.created)
            }}</span>
         </q-card-section>
      </template>
   </q-card>
</template>

<script>
import { Notify } from 'quasar'

import Core from 'src/mixins/Core'

export default {
   name: 'BookCard',

   props: {
      book: {
         type: Object,
         required: true,
      },
   },

   data() {
      return {
         deleting: false,
      }
   },

   methods: {
      async onArchiveBook() {
         try {
            await this.$axios.patch(`/books/${this.book.id}`, { archived: true })
         } catch (error) {
            console.error('BookCard', 'onArchiveBook', error)
            Notify.create({ color: 'negative', message: this.$t('failed') })
         }
      },

      async onRestoreBook() {
         try {
            await this.$axios.patch(`/books/${this.book.id}`, { archived: false })
         } catch (error) {
            console.error('BookCard', 'onRestoreBook', error)
            Notify.create({ color: 'negative', message: this.$t('failed') })
         }
      },

      onClickBook() {
         this.$router.push({ name: 'book', params: { id: this.book.id } })
      },

      prettyDate(timestamp) {
         return `Created ${new Date(timestamp).toLocaleDateString()}`
      },
   },

   mixins: [Core],
}
</script>

<style></style>
