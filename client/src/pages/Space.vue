<template>
   <q-page padding>
      <template v-if="loading"></template>
      <template v-else>
         <q-splitter v-model="split">
            <!-- Left Menu -->
            <template v-slot:before>
               <div class="q-pa-sm text-grey-9 text-body2">
                  <q-list padding>
                     <q-item>
                        <q-item-section avatar>
                           <q-avatar square rounded :color="handleIconColor(space)" :icon="handleIcon(space)" size="md"
                                     text-color="white"/>
                        </q-item-section>
                        <q-item-section>
                           <q-item-label class="text-subtitle1" :class="handleText(space)">{{ space.name }}</q-item-label>
                        </q-item-section>
                     </q-item>

                     <!-- Space Menu -->
                     <template>
                        <q-item
                           :active="menuSelected === 0"
                           active-class="text-bold text-primary"
                           clickable
                           v-ripple
                           @click="() => onClickMenu(0)"
                        >
                           <q-item-section avatar>
                              <q-icon name="sort" size="sm"/>
                           </q-item-section>
                           <q-item-section>
                              <q-item-label>Overview</q-item-label>
                           </q-item-section>
                        </q-item>

                        <q-item
                           :active="menuSelected === 1"
                           active-class="text-bold text-primary"
                           clickable
                           :disable="!mxAuthorized('settings')"
                           v-ripple
                           @click="() => onClickMenu(1)"
                        >
                           <q-item-section avatar>
                              <q-icon name="settings" size="sm"/>
                           </q-item-section>
                           <q-item-section>
                              <q-item-label>Settings</q-item-label>
                           </q-item-section>
                        </q-item>
                     </template>

                     <!-- Page Tree -->
                     <template v-if="mxAuthorized('read')">
                     <div class="q-mt-lg">
                        <q-tree
                           ref="pageTree"
                           default-expand-all
                           no-nodes-label="No pages found"
                           no-results-label="No matches found"
                           :nodes="pageTree"
                           node-key="label"
                           selected-color="primary"
                           :selected.sync="pageSelected"
                        />
                     </div>
                     </template>

                     <template v-else>
                        <div class="q-mt-lg text-italic">No Page Access</div>
                     </template>
                  </q-list>
               </div>
            </template>

            <!-- Page -->
            <template v-slot:after>
               <router-view/>
            </template>
         </q-splitter>
      </template>
   </q-page>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

import { arrayToTree } from 'src/helpers/sort'
import mxAuthorizations from 'src/mixins/mxAuthorizations'

import * as derive from 'src/helpers/derive'

export default {
   data() {
      return {
         loading: false,
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
      ...mapGetters([
         'spaces/space',
         'spaces/sorted',
         'pages/sorted',
         'pages/page',
         'pages/pageByName',
      ]),
      ...mapState('spaces', ['items']),

      menu() {
         let spaceId = this.$route.params.spaceId

         return [
            {
               label: 'Overview',
               icon: 'sort',
               to: {
                  name: 'space-overview',
                  params: { spaceId },
               },
            },
            {
               label: 'Settings',
               icon: 'settings',
               to: {
                  name: 'space-settings',
                  params: { spaceId },
               },
            },
         ]
      },
   },

   mixins: [mxAuthorizations],

   methods: {
      async initData() {
         this.loading = true
         let spaceId = this.$route.params.spaceId

         this.menu.map((item, idx) => {
            if (item.to.name === this.$route.name) {
               this.menuSelected = idx
               this.loading = false
               return false
            }
         })
         this.pageSelected = null

         let space = await this['spaces/space'](spaceId)
         if (space) {
            this.space = space
         } else {
            this.loading = false
            await this.$router.replace('/invalid')
            return false
         }

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
                  this.loading = false
                  return false
               }
            })
         }
         this.loading = false
      },

      handleText(s) {
         let properties = derive.itemProperties(s)
         return properties.text
      },

      handleIcon(s) {
         let properties = derive.itemProperties(s)
         return properties.icon
      },

      handleIconColor(s) {
         let properties = derive.itemProperties(s)
         return properties.bgColor
      },

      onClickMenu(index) {
         this.menuSelected = index
         this.pageSelected = null
      },
   },

   watch: {
      '$route': async function() {
         await this.initData()
      },

      menuSelected: function(value) {
         let spaceId = this.$route.params.spaceId

         if (typeof value === 'number') {
            let route = this.menu[value].to
            this.$router.push(route)
         } else {
            this.$router.push({ name: 'page', params: { spaceId, pageId: value } })
         }
      },

      pageSelected: function(value) {
         if (!value) {
            return false
         }
         let pageId = this.$route.params.pageId
         let spaceId = this.$route.params.spaceId
         let page = this['pages/pageByName'](spaceId, value)
         if (pageId !== page.id) {
            this.menuSelected = page.id
         }
      },
   },

   async beforeMount() {
      await this.initData()
   },
}
</script>

<style lang="scss">
.q-tree__node--selected > div {
   font-weight: bolder;
}
</style>
