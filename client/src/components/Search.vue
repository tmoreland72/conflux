<template>
   <div>
      <q-input
         autocorrect="off"
         autocapitalize="off"
         autocomplete="off"
         spellcheck="false"
         :debounce="500"
         input-class="text-right"
         ref="search"
         color="accent"
         dark
         dense
         outlined
         v-model="searchString"
      >
         <template v-slot:prepend>
            <q-spinner :color="!!loading ? 'primary' : 'transparent'" />
         </template>
         <template v-slot:append>
            <q-icon v-if="searchString === ''" :name="icons.search" />
            <q-icon
               v-else
               name="clear"
               class="cursor-pointer"
               @click="searchString = ''"
            />
         </template>
         <q-menu no-focus ref="searchResultsMenu" anchor="bottom end" self="top right">
            <template v-if="searchResults.length">
               <q-list bordered separator>
                  <q-item v-for="page in searchResults" :key="page.id" v-close-popup>
                     <page-result :page="page" />
                  </q-item>
               </q-list>
            </template>
            <template v-if="!!!loading && searchString.length && !searchResults.length">
               <q-item>
                  <q-item-section>
                     <q-item-label>No matches found</q-item-label>
                  </q-item-section>
               </q-item>
            </template>
         </q-menu>
      </q-input>
   </div>
</template>

<script>
import { storage } from 'boot/storage'
import Core from 'src/mixins/Core'

export default {
   name: 'Search',

   data() {
      return {
         searchString: '',
         loading: false,
         searchResults: [],
      }
   },

   methods: {
      async search() {
         try {
            this.loading = true
            const profile = storage.getItem('profile')
            const payload = {
               userId: profile.id,
               searchString: this.searchString,
            }
            const results = await this.$axios.post('/search', payload)
            this.searchResults = results.data.data ? results.data.data : []
         } catch (error) {
            console.error(`Search error: ${error}`)
            this.searchResults = []
         } finally {
            this.loading = false
         }
      },

      updatePosition() {
         this.$refs.searchResultsMenu.updatePosition()
      },
   },

   mixins: [Core],

   watch: {
      searchString: function(value) {
         if (!value.length) {
            this.searchResults = []
         } else {
            this.search()
         }
      },

      loading: function(value) {
         if (value === false) {
            setTimeout(() => {
               this.$refs.searchResultsMenu.updatePosition()
            }, 100)
         }
      },
   },

   components: {
      PageResult: () => import('components/PageSearchResult.vue'),
   },
}
</script>

<style></style>
