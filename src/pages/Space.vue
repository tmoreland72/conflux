<template>
   <q-page padding>
      <q-splitter v-model="split">
         <!-- Left Menu -->
         <template v-slot:before>
            <div class="q-pa-sm text-grey-9 text-body2">
               <q-list padding>
                  <q-item>
                     <q-item-section avatar>
                        <q-avatar square rounded :color="handleIconColor()" :icon="space.icon" size="md" text-color="white" />
                     </q-item-section>
                     <q-item-section>
                        <q-item-label class="text-subtitle1">{{space.name}}</q-item-label>
                     </q-item-section>
                  </q-item>

                  <q-item
                     :active="menuSelected === index"
                     active-class="text-bold text-primary"
                     clickable
                     :key="index"
                     v-for="(m, index) in menu"
                     v-ripple
                     @click="() => onClickMenu(index)"
                  >
                     <template v-if="m.icon">
                        <q-item-section avatar>
                           <q-icon :name="m.icon" size="sm" />
                        </q-item-section>
                     </template>
                     <q-item-section>
                        <q-item-label>{{ m.label }}</q-item-label>
                     </q-item-section>
                  </q-item>

                  <div class="q-mt-lg">
                     <q-tree
                        default-expand-all
                        no-nodes-label="No pages found"
                        no-results-label="No matches found"
                        :nodes="pageTree"
                        node-key="label"
                        selected-color="primary"
                        :selected.sync="pageSelected"
                     />
                  </div>
               </q-list>
            </div>
         </template>

         <!-- Page -->
         <template v-slot:after>
            <template v-if="menuSelected === 0">
               <space-overview :space="space" />
            </template>

            <template v-else>
               <router-view />
            </template>
         </template>
      </q-splitter>
   </q-page>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

import { arrayToTree } from 'src/helpers/sort'

export default {
   data() {
      return {
         menu: [
            {
               label: 'Overview',
               icon: 'sort',
               to: {
                  name: 'space',
                  params: { spaceId: this.$route.params.spaceId }
               }
            },
            {
               label: 'Settings',
               icon: 'settings',
               to: {
                  name: 'space-settings',
                  params: { spaceId: this.$route.params.spaceId }
               }
            },
         ],
         menuSelected: 0,
         split: 20,
         space: {},
         pages: [],
         pageTree: [],
         pageSelected: null,
         page: null,
      }
   },

   computed: {
      ...mapState('spaces', ['spaces']),
      ...mapGetters([
         'pages/sorted',
         'pages/page',
         'pages/pageByName',
      ]),

   },

   methods: {
      // mixin candidate
      handleIconColor(s) {
         if (this.space.private) {
            return 'secondary'
         } else {
            return 'primary'
         }
      },

      initData() {
         this.menuSelected = 0
         let spaceId = this.$route.params.spaceId
         this.space = { ...this.spaces[spaceId] }

         let pages = [...this['pages/sorted'](spaceId)]
         this.pages = pages
         if (pages.length) {
            let tree = arrayToTree(pages, 0)
            this.pageTree = [{ id: 0, label: 'Pages', icon: 'account_tree', selectable: false, children: tree }]
         } else {
            this.pageTree = []
         }

         let pageId = this.$route.params.pageId
         if (pageId) {
            this.page = null
            this.pages.map(page => {
               if (page.id === pageId) {
                  this.page = page
                  this.menuSelected = page.id
                  this.pageSelected = page.name
                  return false
               }
            })
         }
      },

      onClickMenu(index) {
         this.menuSelected = index
         this.$router.push(this.menu[index].to)
      },
   },

   watch: {
      '$route': function() {
         this.initData()
      },

      pageSelected: function(after, before) {
         if (!after) {
            this.pageSelected = before
            return false
         }

         let pageId = this.$route.params.pageId
         let spaceId = this.$route.params.spaceId
         let page = this['pages/pageByName'](spaceId, after)
         if (pageId !== page.id) {
            this.menuSelected = page.id
            this.$router.push({ name: 'page', params: { spaceId, pageId: page.id } })
         }
      },
   },

   components: {
      SpaceOverview: require("components/Spaces/Overview.vue").default,
   },

   beforeMount() {
      this.initData()
   }
}
</script>

<style lang="scss">
.q-tree__node--selected > div {
   font-weight: bolder;
}
</style>
