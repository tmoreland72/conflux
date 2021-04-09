<template>
   <q-menu>
      <q-item class="bg-secondary text-accent">
         <q-item-section avatar>
            <q-avatar size="64px">
               <template v-if="profile.picture">
                  <q-img :src="profile.picture" />
               </template>
               <template v-else>
                  <q-icon :name="icons.account" />
               </template>
            </q-avatar>
         </q-item-section>
         <q-item-section>
            <q-item-label class="text-body1">{{ profile.name }}</q-item-label>
            <q-item-label class="text-italic">{{ profile.email }}</q-item-label>
         </q-item-section>
      </q-item>

      <q-item clickable v-close-popup @click="showChangePasswordDialog = true">
         <q-item-section avatar>
            <q-icon :name="icons.password" color="primary" flat />
         </q-item-section>
         <q-item-section>
            <q-item-label>{{ $t('changepassword') }}</q-item-label>
         </q-item-section>
      </q-item>

      <q-item clickable v-close-popup>
         <q-item-section avatar>
            <q-icon :name="icons.account" color="primary" flat />
         </q-item-section>
         <q-item-section>
            <q-item-label>{{ $t('editprofile') }}</q-item-label>
         </q-item-section>
      </q-item>

      <q-item clickable v-close-popup @click="onLogout">
         <q-item-section avatar>
            <q-icon :name="icons.logout" color="primary" flat />
         </q-item-section>
         <q-item-section>
            <q-item-label>{{ $t('logout') }}</q-item-label>
         </q-item-section>
      </q-item>
   </q-menu>
</template>

<script>
import Core from 'src/mixins/Core'

export default {
   name: 'ProfileMenu',

   props: {
      profile: {
         type: Object,
         required: true,
      },
   },

   methods: {
      onLogout() {
         this.$router.push({ name: 'logout' })
      },
   },

   mixins: [Core],
}
</script>

<style></style>
