<template>
   <q-page padding>
      <div class="q-mt-lg row justify-between">
         <div class="text-h5 text-grey-9">Spaces Directory</div>
         <q-btn class="text-grey-7" flat label="Create Space" :to="{ name: 'createSpace' }" no-caps/>
      </div>

      <q-separator class="q-mt-md"/>

      <div class="full-width">
         <q-splitter v-model="split">
            <template v-slot:before>
               <div class="q-pa-md text-grey-9 text-body2">
               <q-list padding>
                  <q-item
                     :active="selectedMenu === index"
                     active-class="text-bold text-primary"
                     clickable
                     :key="index"
                     v-for="(m, index) in menu"
                     v-ripple
                     @click="() => onClickMenu(index)"
                  >
                     <q-item-section>
                        <q-item-label>{{ m.label }}</q-item-label>
                     </q-item-section>
                  </q-item>
               </q-list>
               </div>
            </template>

            <template v-slot:after>
               <div class="q-pa-md text-grey-9">
                  <div class="text-h6">All Spaces</div>
                  <div class="q-mt-lg">
                     <space-list view="list" :getter="menu[selectedMenu].filter" />
                  </div>
               </div>
            </template>
         </q-splitter>
      </div>
   </q-page>
</template>

<script>

export default {
   data() {
      return {
         menu: [
            {
               label: 'All',
               filter: 'sorted',
            },
            {
               label: 'Shared',
               filter: 'shared',
            },
            {
               label: 'Personal',
               filter: 'personal',
            },
            {
               label: 'Archived',
               filter: 'archived',
            },
         ],
         selectedMenu: 0,
         split: 20,
      }
   },

   methods: {
      onClickMenu(index) {
         this.selectedMenu = index
      }
   },

   components: {
      SpaceList: require("components/Spaces/List.vue").default,
   }
}
</script>

<style scoped>

</style>
