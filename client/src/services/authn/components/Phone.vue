<template>
   <q-page class="flex flex-center">
      <template v-if="enterNumber">
         <q-form class="q-gutter-md" @submit.prevent="onRequest">
            <q-input
               placeholder="+17775551212"
               label="Mobile Number"
               autofocus
               filled
               v-model="number"
            />
            <div class="row q-gutter-md">
               <q-btn flat label="back" :to="{ name: 'login' }"/>
               <q-btn id="request-code" color="primary" label="Request Code" no-caps type="submit"/>
            </div>
            <div class="q-mb-md text-negative" v-if="errorMsg.length">{{ errorMsg }}</div>
         </q-form>
      </template>

      <template v-if="enterCode">
         <q-form class="q-gutter-md" @submit="onSubmit">
            <q-input
               label="Enter Code"
               autofocus
               filled
               v-model="code"
            />
            <div class="row q-gutter-md">
               <q-btn flat label="back" :to="{ name: 'login' }"/>
               <q-btn color="primary" label="Submit" no-caps type="submit"/>
            </div>
            <div class="q-mb-md text-negative" v-if="errorMsg.length">{{ errorMsg }}</div>
         </q-form>
      </template>

   </q-page>
</template>

<script>
import { mapActions } from 'vuex'

import { firebase } from 'boot/firebase'

export default {
   data() {
      return {
         number: '',
         code: '',
         errorMsg: '',
         enterNumber: true,
         enterCode: false,
         confirmation: null,
      }
   },

   methods: {
      ...mapActions(['auth/login']),

      async handleRequest(recaptcha) {
         this.enterNumber = false
         this.enterCode = true
         try {
            this.errorMsg = ''
            let payload = {
               method: 'Phone',
               credentials: {
                  number: this.number,
                  recaptcha,
               },
            }
            let result = await this['auth/login'](payload)
            if (result.error) {
               this.errorMsg = result.message
            } else {
               this.confirmation = result
            }

         } catch (err) {
            console.error('Login', 'err', err)
            this.errorMsg = err
         }
      },

      onRequest() {

      },

      async onSubmit() {
         try {
            await this.confirmation.confirm(this.code)
            await this.$router.replace({ name: 'private' })
         } catch (err) {
            window.recaptchaVerifier.render().then(function(widgetId) {
               recaptchaVerifier.reset(widgetId)
            })
         }
      },

   },

   mounted() {
      // Start Firebase invisible reCAPTCHA verifier
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('request-code', {
         size: 'invisible',
         callback: result => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            this.handleRequest(recaptchaVerifier)
         },
      })

      recaptchaVerifier.render().then(widgetId => {
         window.recaptchaWidgetId = widgetId
      })
   },
}
</script>

<style scoped>

</style>
