<template>
   <q-btn color="grey-9" flat round icon="notifications">
      <q-menu>
         <div class="q-pa-lg" style="min-width: 300px;">
            <div class="text-h6 text-grey-9">Notifications</div>
            <q-space />
            <q-toggle v-model="mute">Mute Notifications</q-toggle>

            <q-separator class="q-my-lg"/>

            <div>
               <div class="text-caption">No notifications right now</div>
            </div>
         </div>
      </q-menu>
   </q-btn>
</template>

<script>
export default {
   data() {
      return {
         mute: false
      }
   }
}
</script>

<style scoped>

</style>
