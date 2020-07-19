<template>
   <q-page padding>
      <spaces/>
      <recents/>
   </q-page>
</template>

<script>
export default {
   components: {
      Spaces: require('components/Spaces/Widget.vue').default,
      Recents: require('components/Recents/Widget.vue').default,
   },
}
</script>
