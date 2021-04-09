<template>
   <q-card
      class="cursor-pointer bg-accent text-secondary"
      flat
      style="width: 400px; max-width: 95%;"
      clickable
      v-ripple
      @click="onClick()"
   >
      <q-card-section class="column" style="padding-top: 0px;">
         <span class="q-ml-xs text-h6 text-weight-medium ellipsis" style="max-width: 95%">
            {{ page.pageTitle }}
         </span>
         <span class="q-ml-xs text-caption text-italic ellipsis" style="max-width: 95%">
            {{ page.pageSubtitle }}
         </span>
         <section class="q-mt-md column">
            <span>{{ `Book: ${page.bookTitle}` }}</span>
            <span>{{ `Chapter: ${page.chapterTitle}` }}</span>
         </section>
      </q-card-section>
   </q-card>
</template>

<script>
import Core from 'src/mixins/Core'

export default {
   name: 'PageCard',

   props: {
      page: {
         type: Object,
         required: true,
      },
   },

   methods: {
      onClick() {
         this.$router.push(this.page.route)
      },
   },

   mixins: [Core],
}
</script>

<style></style>
