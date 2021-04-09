<template>
   <q-header class="row justify-between items-center q-gutter-sm bg-dark text-accent">
      <q-toolbar>
         <q-toolbar-title>
            <div class="row items-center q-gutter-md">
               <q-btn color="primary" flat round :icon="icons.menu" @click="onToggleMenu" />
               <q-btn color="accent" flat round :icon="icons.home" :to="{ name: 'home' }" />
            </div>
         </q-toolbar-title>

         <div class="row q-gutter-xs">
            <!-- <q-input color="grey-9" dark dense outlined v-model="search">
               <template v-slot:prepend>
                  <q-icon :name="icons.search" />
               </template>
            </q-input> -->

            <q-btn color="primary" :icon="icons.add" flat round>
               <q-menu>
                  <q-list bordered separator class="text-caption">
                     <q-item clickable v-close-popup @click="showPageCreateDialog = true">
                        <q-item-section avatar>
                           <q-avatar :icon="icons.addPage" color="primary" text-color="white" size="md" />
                        </q-item-section>
                        <q-item-section>
                           <q-item-label class="text-grey-9">Create a Page</q-item-label>
                        </q-item-section>
                     </q-item>

                     <q-item clickable v-close-popup @click="showChapterCreateDialog = true">
                        <q-item-section avatar>
                           <q-avatar :icon="icons.addChapter" color="primary" text-color="white" size="md" />
                        </q-item-section>
                        <q-item-section>
                           <q-item-label class="text-grey-9">Create a Chapter</q-item-label>
                        </q-item-section>
                     </q-item>

                     <q-item clickable v-close-popup @click="showBookCreateDialog = true">
                        <q-item-section avatar>
                           <q-avatar :icon="icons.addBook" color="primary" text-color="white" size="md" />
                        </q-item-section>
                        <q-item-section>
                           <q-item-label class="text-grey-9">Create a Book</q-item-label>
                        </q-item-section>
                     </q-item>
                  </q-list>
               </q-menu>
            </q-btn>

            <!-- <q-btn color="grey-5" :icon="icons.bookmarks" flat round /> -->

            <!-- <q-btn color="grey-5" :icon="icons.notifications" flat round>
               <q-menu>
                  <div class="q-pa-lg" style="min-width: 300px;">
                     <div class="text-h6 text-grey-9">Notifications</div>
                     <q-space />
                     <q-toggle color="grey-5" v-model="muteNotifications">Mute Notifications</q-toggle>

                     <q-separator class="q-my-lg" />

                     <template v-if="!notifications.length">
                        <div class="text-caption">No notifications right now</div>
                     </template>
                  </div>
               </q-menu>
            </q-btn> -->

            <q-btn color="grey-5" flat :icon="icons.help" round>
               <q-menu>
                  <div class="row no-wrap q-pa-md">
                     <div class="column q-gutter-sm">
                        <div class="text-overline">Help</div>
                        <q-btn align="left" flat color="grey-9" label="Online Help" no-caps />
                        <q-btn align="left" flat color="grey-9" label="What's New" no-caps />
                        <q-btn align="left" flat color="grey-9" label="About Conflux" no-caps />

                        <q-separator />

                        <div class="text-overline">Legal</div>
                        <q-btn align="left" flat color="grey-9" label="Terms of Service" no-caps />
                        <q-btn align="left" flat color="grey-9" label="Privacy Policy" no-caps />
                     </div>
                  </div>
               </q-menu>
            </q-btn>

            <q-btn color="grey-5" flat :icon="icons.account" round>
               <profile-menu :profile="profile" />
            </q-btn>
         </div>
      </q-toolbar>
   </q-header>
</template>

<script>
import Core from 'src/mixins/Core'

export default {
   name: 'PageHeader',

   props: {
      toggleMenu: {
         type: Function,
         required: true,
      },
   },

   data() {
      return {
         muteNotifications: false,
         notifications: [],
         profile: {},
         search: '',
      }
   },

   methods: {
      onToggleMenu() {
         this.toggleMenu()
      },

      onLogout() {
         this.$router.push({ name: 'logout' })
      },
   },

   mixins: [Core],

   components: {
      ProfileMenu: () => import('components/ProfileMenu.vue'),
   },
}
</script>

<style></style>
