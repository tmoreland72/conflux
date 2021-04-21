<template>
   <q-header class="row justify-between items-center q-gutter-sm bg-dark text-accent">
      <q-toolbar>
         <q-toolbar-title>
            <q-btn color="primary" flat round :icon="icons.menu" @click="onToggleMenu" />
         </q-toolbar-title>

         <div class="row q-gutter-xs">
            <!-- <q-input color="grey-9" dark dense outlined v-model="search">
               <template v-slot:prepend>
                  <q-icon :name="icons.search" />
               </template>
            </q-input> -->

            <q-btn color="grey-5" flat :icon="icons.help" round>
               <q-menu>
                  <div class="row no-wrap q-pa-md">
                     <div class="column q-gutter-sm">
                        <div class="text-overline">Help</div>
                        <q-btn
                           align="left"
                           flat
                           color="grey-9"
                           label="Online Help"
                           no-caps
                        />
                        <q-btn
                           align="left"
                           flat
                           color="grey-9"
                           label="What's New"
                           no-caps
                        />
                        <q-btn
                           align="left"
                           flat
                           color="grey-9"
                           label="About Conflux"
                           no-caps
                        />

                        <q-separator />

                        <div class="text-overline">Legal</div>
                        <q-btn
                           align="left"
                           flat
                           color="grey-9"
                           label="Terms of Service"
                           no-caps
                        />
                        <q-btn
                           align="left"
                           flat
                           color="grey-9"
                           label="Privacy Policy"
                           no-caps
                        />
                     </div>
                  </div>
               </q-menu>
            </q-btn>

            <q-btn
               color="grey-5"
               flat
               :icon="icons.account"
               round
               :to="{ name: 'login' }"
            />
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
