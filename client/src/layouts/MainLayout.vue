<template>
   <q-layout view="hHh Lpr lFf">
      <template v-if="isAuthenticated">
         <q-header elevated>
            <q-toolbar class="bg-grey-3">
               <q-icon color="accent" name="topic" size="md"/>

               <div class="q-mx-md text-h6 text-grey-9">Conflux</div>

               <div class="q-mx-md row q-gutter-sm">
                  <q-btn color="grey-9" dense flat label="Home" no-caps :to="{ name: 'home' }"/>
                  <recent/>
                  <spaces/>
                  <q-btn color="primary" :disable="!mxAuthorized('create')" label="Create" no-caps @click="showCreatePage = true"/>
               </div>

               <q-space/>

               <div class="row q-gutter-sm">
                  <search/>
                  <notifications/>
                  <help-menu/>
                  <q-btn color="grey-9" flat round icon="settings_applications"/>
                  <profile-menu/>
               </div>
            </q-toolbar>
         </q-header>
      </template>

      <q-page-container>
         <router-view/>
      </q-page-container>

   </q-layout>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

import Dialog from 'components/Pages/Creation/Dialog'
import mxAuthorizations from 'src/mixins/mxAuthorizations'

export default {
   data() {
      return {
         showCreatePage: false,
      }
   },

   computed: {
      ...mapGetters(['spaces/space']),
      ...mapState('auth', ['isAuthenticated']),
   },

   mixins: [mxAuthorizations],

   watch: {
      showCreatePage: function(value) {
         if (value) {
            this.$q.dialog({
                  component: Dialog,
                  parent: this,
               })
               .onOk(() => {
               })
               .onCancel(() => {
               })
               .onDismiss(() => {
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

}
</script>
