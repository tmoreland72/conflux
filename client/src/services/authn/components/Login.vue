<template>
   <q-page class="flex flex-center">
      <q-card style="width: 100%; max-width: 320px;">
         <q-img
            src="https://cdn.quasar.dev/img/parallax2.jpg"
            basic
         >
            <div class="absolute-bottom text-h6 text-center">
               Log In
            </div>
         </q-img>
         <q-card-section class="bg-grey-2">
            <div class="q-mt-sm text-body2 text-grey-5">Application Login</div>
            <div class="q-mt-xs row items-center q-gutter-md">
<!--
               <q-btn
                  icon="fab fa-facebook"
                  padding="md"
                  round
                  style="background-color: #3b5998; color: white;"
                  @click="onClick('Facebook')"
               >
                  <q-tooltip max-width="168px" content-class="text-caption">
                     Facebook
                  </q-tooltip>
               </q-btn>
-->

               <q-btn
                  icon="fab fa-github"
                  padding="md"
                  round
                  style="background-color: #333; color: #fafafa;"
                  @click="onClick('GitHub')"
               >
                  <q-tooltip max-width="168px" content-class="text-caption">
                     GitHub
                  </q-tooltip>
               </q-btn>

               <q-btn
                  class="text-white"
                  icon="fab fa-google"
                  padding="md"
                  round
                  style="background-color: #34a853;"
                  @click="onClick('Google')"
               >
                  <q-tooltip max-width="168px" content-class="text-caption">
                     Google
                  </q-tooltip>
               </q-btn>

<!--
               <q-btn
                  icon="fab fa-twitter"
                  padding="md"
                  round
                  style="background-color: #1da1f2; color: #f5f8fa;"
                  @click="onClick('Twitter')"
               >
                  <q-tooltip max-width="168px" content-class="text-caption">
                     Twitter
                  </q-tooltip>
               </q-btn>
-->
            </div>
         </q-card-section>

         <q-separator/>

         <q-card-section class="bg-grey-1">
            <div class="q-mt-sm text-body2 text-grey-5">Device Login</div>
            <div class="q-mt-xs row items-center q-gutter-md">
               <q-btn
                  class="bg-orange text-white"
                  icon="fas fa-sms"
                  padding="md"
                  round
                  :to="{ name: 'login-phone'} "
               >
                  <q-tooltip max-width="168px" content-class="text-caption">
                     SMS Code
                  </q-tooltip>
               </q-btn>
            </div>
         </q-card-section>

         <q-separator/>

         <q-card-section class="bg-grey-2">
            <div class="q-mt-sm text-body2 text-grey-5">Other</div>
            <div class="q-mt-xs row items-center q-gutter-md">
               <q-btn
                  color="negative"
                  icon="fas fa-asterisk"
                  padding="md"
                  round
                  :to="{ name: 'login-password'} "
               >
                  <q-tooltip max-width="168px" content-class="text-caption">
                     Username/Password
                  </q-tooltip>
               </q-btn>

               <q-btn
                  color="accent"
                  icon="fas fa-user-plus"
                  padding="md"
                  round
                  :to="{ name: 'register'} "
               >
                  <q-tooltip max-width="168px" content-class="text-caption">
                     Register Account
                  </q-tooltip>
               </q-btn>
            </div>
         </q-card-section>
      </q-card>
   </q-page>
</template>

<script>
import { mapActions } from 'vuex'

export default {
   data() {
      return {
         email: '',
         password: '',
         errorMsg: '',
      }
   },

   methods: {
      ...mapActions(['auth/login']),

      async onClick(method) {
         try {
            this.errorMsg = ''
            let payload = { method }
            let result = await this['auth/login'](payload)
            if (result.error) {
               this.errorMsg = result.message
            }
         } catch (err) {
            console.log('Login', 'err', err)
            this.errorMsg = err
         }
      },
   },
}
</script>

<style scoped>

</style>
