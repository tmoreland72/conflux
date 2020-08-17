<template>
   <div>
      <template v-if="spaces().length">
         <template v-if="view === 'card'">
            <div class="q-pa-md row items-start q-gutter-md">
               <q-card
                  class="cursor-pointer shadow-1 space-card"
                  clickable
                  :key="s.id"
                  style="min-width: 160px;"
                  v-ripple
                  v-for="s in spaces()"
                  @click="onClick(s)"
               >
                  <q-card-section class="bg-grey-3">
                     <div class="row justify-between">
                        <q-avatar square rounded :color="handleIconColor(s)" :icon="s.icon" size="md" text-color="white"/>
                        <template v-if="handleStarIcon(s)">
                           <q-icon color="yellow-8" :name="handleStarIcon(s)" size="xs"/>
                        </template>
                     </div>
                  </q-card-section>
                  <q-card-section>
                     <div class="row justify-between items-center">
                        <div class="text-body2 text-grey-9">{{s.name}}</div>
                     </div>
                     <div class="text-caption text-grey-7">{{s.description}}</div>
                  </q-card-section>
               </q-card>
            </div>
         </template>

         <template v-else>
            <q-list>
               <q-item
                  clickable
                  :key="s.id"
                  style="min-width: 160px;"
                  v-for="s in spaces()"
                  v-ripple
                  :to="{ name: 'space-overview', params: { spaceId: s.id } }"
               >
                  <q-item-section avatar>
                     <q-avatar square rounded :color="handleIconColor(s)" :icon="s.icon" size="md" text-color="white" />
                  </q-item-section>
                  <q-item-section>
                        <q-item-label class="text-body2 text-grey-9">{{s.name}}</q-item-label>
                        <q-item-label class="text-caption text-grey-7">{{s.description}}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                     <template v-if="handleStarIcon(s)">
                        <q-icon color="yellow-9" :name="handleStarIcon(s)" size="xs"/>
                     </template>
                  </q-item-section>
               </q-item>
            </q-list>
         </template>
      </template>

      <template v-else>
         <div class="flex flex-center column bg-grey-1 full-width" style="height: 200px;">
            <div class="q-pa-md text-grey-7">Spaces appear here after you create or view them.</div>
            <q-btn color="primary" flat label="Create Space" no-caps :to="{ name: 'createSpace' }"/>
         </div>
      </template>
   </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
   props: {
      view: {
         type: String,
         default: 'card',
      },
      getter: {
         type: String,
         default: 'sorted',
      },
   },

   computed: {
      ...mapGetters([
         'spaces/sorted',
         'spaces/starred',
         'spaces/personal',
         'spaces/shared',
         'spaces/archived',
      ])
   },

   methods: {
      handleIconColor(s) {
         if (s.private) {
            return 'secondary'
         } else {
            return 'primary'
         }
      },

      handleStarIcon(s) {
         if (s.starred) {
            return 'star'
         } else {
            return null
         }
      },

      onClick(s) {
         this.$router.push({ name: 'space-overview', params: { spaceId: s.id } })
      },

      spaces() {
         return this['spaces/' + this.getter]
      }
   }
}
</script>

<style lang="scss" scoped>
.space-card:hover {
   box-shadow: $shadow-2
}
</style>
