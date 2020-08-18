<template>
   <q-btn color="grey-9" flat round>
      <template v-if="image">
         <q-avatar size="32px">
            <q-img :src="image" />
         </q-avatar>
      </template>
      <template v-else>
         <q-icon name="account_circle" />
      </template>
      <q-menu>
         <div class="row no-wrap q-pa-md">
            <div class="column q-gutter-sm">
               <div class="text-overline">Help Us Improve</div>
               <q-btn align="left" flat color="grey-9" label="Send Feedback" no-caps />

               <q-separator />

               <q-btn align="left" flat color="grey-9" label="Profile" no-caps />
               <q-btn align="left" flat color="grey-9" label="Settings" no-caps />

               <q-separator />

               <q-btn align="left" flat color="grey-9" label="Logout" no-caps :to="{name: 'logout' }"/>
            </div>
         </div>
      </q-menu>
   </q-btn>
</template>

<script>
import * as storage from 'src/services/storage'

export default {
   computed: {
      image() {
         if (storage.has('session', 'session')) {
            let session = storage.get('session', 'session')
            return session.photoUrl
         } else {
            return false
         }
      }
   }
}
</script>

<style scoped>

</style>
