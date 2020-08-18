<template>
   <q-btn color="grey-9" flat round icon="account_circle">
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
export default {
}
</script>

<style scoped>

</style>
