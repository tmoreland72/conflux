<template>
   <q-page class="flex flex-center bg-dark text-accent">
      <div class="column justify-center items-center q-gutter-sm" style="width: 340px; max-width: 90%">
         <q-avatar color="primary" size="160px">
            <q-icon color="accent" :name="icons.conflux" size="88px" />
         </q-avatar>

         <div class="text-center text-h3 text-weight-thin">Conflux</div>

         <div class="q-mt-xl column full-width">
            <q-form class="q-gutter-md" @submit.prevent="onSubmit">
               <q-input dark filled hide-bottom-space :label="$t('email')" v-model="form.email" />
               <div class="q-mt-xl column">
                  <q-btn
                     class="text-capitalize"
                     color="primary"
                     :label="$t('submit')"
                     :loading="processing"
                     no-caps
                     type="submit"
                  />
               </div>
            </q-form>

            <q-btn class="q-mt-md" color="secondary" :label="$t('login')" no-caps :to="{ name: 'login' }" />
         </div>
      </div>
   </q-page>
</template>

<script>
import validator from 'validator'
import { Notify } from 'quasar'

import Core from 'src/mixins/Core'

export default {
   name: 'ResetPassword',

   data() {
      return {
         processing: false,
         form: {
            email: '',
         },
      }
   },

   methods: {
      async onSubmit() {
         try {
            this.processing = true
            let result = await this.$axios.post('/public/reset', {
               email: this.form.email,
            })
            if (!result.data.success) {
               Notify.create({ color: 'negative', message: this.$t(result.data.message) })
               return false
            }
            Notify.create('You should receive an email shortly with your new password')
            this.$router.push({ name: 'login' })
         } catch (error) {
            console.error('Register', 'onSubmit', error)
            Notify.create({ color: 'negative', message: 'There was a problem registering.' })
         } finally {
            this.processing = false
         }
      },
   },

   mixins: [Core],
}
</script>

<style></style>
