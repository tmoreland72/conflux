<template>
   <q-page padding>
      <q-splitter v-model="split">
         <!-- Left Menu -->
         <template v-slot:before>
            <div class="q-pa-sm text-grey-9 text-body2">
               <q-list padding>
                  <q-item-label header>Space</q-item-label>
                  <q-item>
                     <q-item-section avatar>
                        <q-avatar square rounded :color="handleIconColor()" :icon="space.icon" size="md" text-color="white" />
                     </q-item-section>
                     <q-item-section>
                        <q-item-label class="text-subtitle1">{{space.name}}</q-item-label>
                     </q-item-section>
                  </q-item>

                  <q-item
                     :active="selectedMenu === index"
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
                     <q-item-label header>Pages</q-item-label>
                  </div>

                  <q-item
                     :active="selectedMenu === p.id"
                     active-class="text-bold text-primary"
                     clickable
                     :key="p.id"
                     v-for="p in pages"
                     v-ripple
                     @click="() => onClickPage(p.id)"
                  >
                     <q-item-section>
                        <q-item-label>{{ p.name }}</q-item-label>
                     </q-item-section>
                  </q-item>

               </q-list>
            </div>
         </template>

         <!-- Page -->
         <template v-slot:after>
            <template v-if="selectedMenu === 0">
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
         selectedMenu: 0,
         split: 20,
         space: {},
         pages: [],
         page: null,
      }
   },

   computed: {
      ...mapState('spaces', ['spaces']),
      ...mapGetters([
         'pages/sorted',
         'pages/page'
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
         let spaceId = this.$route.params.spaceId
         let pageId = this.$route.params.pageId
         this.space = this.spaces[spaceId]
         this.pages = this['pages/sorted'](spaceId)
         this.page = null
         this.selectedMenu = 0
         if (pageId) {
            this.selectedMenu = pageId
            this.pages.map(page => {
               if (page.id === pageId) {
                  this.page = this.pages[page]
                  return false
               }
            })
         }
      },

      onClickMenu(index) {
         this.selectedMenu = index
         this.$router.push(this.menu[index].to)
      },

      onClickPage(id) {
         this.selectedMenu = id
         let spaceId = this.$route.params.spaceId
         this.$router.push({ name: 'page', params: { spaceId, pageId: id } })
      }
   },

   watch: {
      '$route': function() {
         this.initData()
      }
   },

   components: {
      SpaceOverview: require("components/Spaces/Overview.vue").default,
   },

   beforeMount() {
      this.initData()
   }
}
</script>
