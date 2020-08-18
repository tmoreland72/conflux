<template>
   <q-page class="flex flex-center">
      <div class="column q-gutter-md">
         <div class="text-h6">Register</div>
         <q-form class="q-gutter-md" @submit="onSubmit">
            <q-input label="Email Address" autofocus filled v-model="email"/>
            <q-input label="Password" filled type="password" v-model="password"/>
            <div class="row q-gutter-md">
               <q-btn flat label="cancel" :to="{ name: 'home' }"/>
               <q-btn label="login" :to="{ name: 'login' }"/>
               <q-btn color="primary" label="register" type="submit"/>
            </div>
            <div class="q-mb-md text-negative" v-if="errorMsg.length">{{ errorMsg }}</div>
         </q-form>
      </div>
   </q-page>
</template>

<script>
import * as authn from 'src/services/authn'

export default {
   data() {
      return {
         email: '',
         password: '',
         errorMsg: '',
      }
   },

   methods: {
      async onSubmit() {
         this.errorMsg = ''
         authn.register('firebase', this.email, this.password)
         .then(result => {
            console.log('Register', 'result', result)
            this.$router.replace({ name: 'private' })
         })
         .catch(err => {
            console.log('Register', 'err', err)
            this.errorMsg = err.message
         })
      }
   }
}
</script>

<style scoped>

</style>
