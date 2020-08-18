<template>
   <q-layout view="hHh Lpr lFf">
      <q-header elevated>
         <q-toolbar class="bg-grey-3">
            <q-icon color="accent" name="topic" size="md"/>

            <div class="q-mx-md text-h6 text-grey-9">Conflux</div>

            <div class="q-mx-md row q-gutter-sm">
               <template v-if="isAuthenticated">
                  <q-btn color="grey-9" dense flat label="Home" no-caps :to="{ name: 'home' }"/>
                  <recent/>
                  <spaces/>
                  <q-btn color="primary" label="Create" no-caps @click="showCreatePage = true"/>
               </template>
            </div>

            <q-space/>

            <div class="row q-gutter-sm">
               <template v-if="isAuthenticated">
                  <search/>
                  <notifications/>
                  <help-menu/>
                  <q-btn color="grey-9" flat round icon="settings_applications"/>
                  <profile-menu/>
               </template>
            </div>
         </q-toolbar>
      </q-header>

      <q-page-container>
         <router-view/>
      </q-page-container>

   </q-layout>
</template>

<script>
import { mapState } from 'vuex'

import Dialog from 'components/Pages/Creation/Dialog'

export default {
   data() {
      return {
         showCreatePage: false,
         spaceId: null,
      }
   },

   computed: {
      ...mapState('auth', ['isAuthenticated']),
   },

   watch: {
      showCreatePage: function(value) {
         if (value) {
            this.$q.dialog({
                  component: Dialog,
                  parent: this,
               })
               .onOk(() => {
                  console.log('ok')
               })
               .onCancel(() => {
                  console.log('cancel')
               })
               .onDismiss(() => {
                  console.log('ok or cancel')
                  this.showCreatePage = false
               })
         }
      },
   },

   components: {
      Recent: require('components/Recents/Menu.vue').default,
      Spaces: require('components/Spaces/Menu.vue').default,
      Search: require('components/Toolbar/Search.vue').default,
      Notifications: require('components/Toolbar/Notifications.vue').default,
      HelpMenu: require('components/Toolbar/HelpMenu.vue').default,
      ProfileMenu: require('components/Toolbar/ProfileMenu.vue').default,
   },

   beforeMount() {
      this.spaceId = this.$route.params.spaceId
   },
}
</script>
