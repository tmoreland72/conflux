<template>
   <q-page class="flex flex-center page-anon">
      <div class="column justify-center items-center q-gutter-md">
         <q-avatar :icon="icons.conflux" color="primary" text-color="white" size="180px" />
         <div class="text-h2 text-white text-uppercase text-weight-thin">conflux</div>
         <div class="text-h6 text-white text-weight-thin">{{ $t('quote') }} -- C.S. Lewis</div>
         <q-btn class="q-mt-xl full-width" color="primary" :label="$t('go')" no-caps size="lg" @click="onLogin()" />
         <div class="text-caption text-grey-3">
            {{ `Version ${version}` }}
         </div>
      </div>
   </q-page>
</template>

<script>
import { version as client } from '../../package.json'
import Core from 'src/mixins/Core'

export default {
   name: 'Anonymous',

   computed: {
      version() {
         return client
      },
   },

   methods: {
      onLogin() {
         this.$router.push({ name: 'login' })
      },
   },

   mixins: [Core],
}
</script>

<style lang="sass">
.page-anon
      background: linear-gradient( rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8) ), url('../assets/cover.jpg')
      background-size: cover
</style>
