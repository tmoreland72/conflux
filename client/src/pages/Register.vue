<template>
   <q-page class="flex flex-center bg-dark text-accent">
      <div
         class="column justify-center items-center q-gutter-sm"
         style="width: 340px; max-width: 90%"
      >
         <q-avatar color="primary" size="160px">
            <q-icon color="accent" :name="icons.conflux" size="88px" />
         </q-avatar>

         <div class="text-center text-h3 text-weight-thin">Conflux</div>

         <div class="q-mt-xl column full-width">
            <q-form class="q-gutter-md" @submit.prevent="onSubmit">
               <q-input
                  dark
                  filled
                  hide-bottom-space
                  :label="$t('name')"
                  lazy-rules
                  :rules="[() => validName || $t('invalidname')]"
                  v-model="form.name"
               />
               <q-input
                  dark
                  filled
                  hide-bottom-space
                  :label="$t('email')"
                  lazy-rules
                  :rules="[() => validEmail || $t('invalidemail')]"
                  v-model="form.email"
               />
               <q-input
                  dark
                  filled
                  hide-bottom-space
                  :label="$t('password')"
                  type="password"
                  lazy-rules
                  :rules="[() => validPassword || $t('invalidpassword')]"
                  v-model="form.password"
               />

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

            <q-btn
               class="q-mt-md"
               color="secondary"
               :label="$t('login')"
               no-caps
               :to="{ name: 'login' }"
            />
         </div>
      </div>
   </q-page>
</template>

<script>
import { Notify } from 'quasar'
import validator from 'validator'
import jwt_decode from 'jwt-decode'

import { fireauth } from 'boot/firebase'
import { storage } from 'boot/storage'
import Core from 'src/mixins/Core'

export default {
   name: 'Login',

   data() {
      return {
         processing: false,
         form: {
            name: '',
            email: '',
            password: '',
         },
      }
   },

   computed: {
      validName() {
         return validator.isLength(this.form.name, { min: 2 })
      },
      validEmail() {
         return validator.isEmail(this.form.email)
      },
      validPassword() {
         return (
            validator.isLength(this.form.password, { min: 8 }) &&
            validator.isAlphanumeric(this.form.password)
         )
      },
   },

   methods: {
      async onSubmit() {
         try {
            this.processing = true
            let result = await this.$axios.post('/public/register', {
               name: this.form.name,
               email: this.form.email,
               password: this.form.password,
            })
            if (!result.data.success) {
               Notify.create({ color: 'negative', message: this.$t(result.data.message) })
               return false
            }

            const accessToken = result.data.data
            storage.set('accessToken', accessToken)

            const tokenProfile = jwt_decode(accessToken)
            const { email, name, id } = tokenProfile
            storage.set('profile', { id, name, email })

            this.$axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`

            result = await this.$axios.get(`/users/token/${id}`, {
               headers: { Authorization: `Bearer ${accessToken}` },
            })
            if (!result.data.success) {
               Notify.create({ color: 'negative', message: this.$t(result.data.message) })
               return false
            }

            const fbToken = result.data.data
            result = await fireauth.signInWithCustomToken(fbToken)

            const interval = setInterval(() => {
               if (storage.has('profile')) {
                  this.initData()
                  this.$router.push({ name: 'home' })
                  clearInterval(interval)
               }
            }, 500)
         } catch (error) {
            console.error('Register', 'onSubmit', error)
            Notify.create({
               color: 'negative',
               message: 'There was a problem registering.',
            })
         } finally {
            this.processing = false
         }
      },
   },

   mixins: [Core],
}
</script>

<style></style>
