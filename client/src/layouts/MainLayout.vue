<template>
   <q-layout class="bg-dark" view="hHh LpR fFf">
      <main-header />
      <q-page-container>
         <router-view />
      </q-page-container>
   </q-layout>
</template>

<script>
export default {
   name: 'MainLayout',

   components: {
      MainHeader: () => import('components/MainHeader.vue'),
   },
}
</script>
