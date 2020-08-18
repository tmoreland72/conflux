<template>
   <q-page class="flex flex-center">
         <q-form class="q-gutter-md" @submit="onSubmit" style="width: 320px;">
            <q-btn class="full-width text-italic text-orange" flat label="Need an account?" no-caps :to="{ name: 'register' }"/>
            <q-input label="Email Address" autofocus filled v-model="email"/>
            <q-input label="Password" filled type="password" v-model="password"/>
            <div class="row justify-end q-gutter-md">
               <q-btn flat label="back" :to="{ name: 'login' }"/>
               <q-btn color="primary" label="login" type="submit"/>
            </div>
            <div class="q-mb-md text-negative" v-if="errorMsg.length">{{ errorMsg }}</div>
         </q-form>
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

      async onSubmit() {
         try {
            this.errorMsg = ''
            let payload = {
               method: 'EmailPassword',
               credentials: {
                  email: this.email,
                  password: this.password,
               },
            }
            let result = await this['auth/login'](payload)
            if (result.error) {
               this.errorMsg = result.message
            } else {
               await this.$router.replace({ name: 'private' })
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
