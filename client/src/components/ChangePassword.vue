<template>
   <q-dialog ref="changePassword" @hide="onHide">
      <q-card style="width: 300px;">
         <q-card-section>
            <q-form class="q-gutter-md" @submit.prevent="onSubmit">
               <q-input
                  filled
                  hide-bottom-space
                  :label="$t('password')"
                  type="password"
                  lazy-rules
                  :rules="[() => validPassword || $t('invalidpassword')]"
                  v-model="form.password"
               />

               <div class="q-mt-xl row justify-end q-gutter-md">
                  <q-btn
                     class="text-capitalize"
                     color="primary"
                     :label="$t('cancel')"
                     outline
                     no-caps
                     @click="onCancel"
                  />

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
         </q-card-section>
      </q-card>
   </q-dialog>
</template>

<script>
import { Notify } from 'quasar'
import validator from 'validator'

import { storage } from 'boot/storage'
import Core from 'src/mixins/Core'

export default {
   name: 'ChangePassword',

   data() {
      return {
         processing: false,
         form: {
            password: '',
         },
      }
   },

   computed: {
      validPassword() {
         return validator.isLength(this.form.password, { min: 8 }) && validator.isAlphanumeric(this.form.password)
      },
   },

   methods: {
      show() {
         this.$refs.changePassword.show()
      },

      hide() {
         this.$refs.changePassword.hide()
      },

      onCancel() {
         this.hide()
      },

      onHide() {
         this.$emit('hide')
      },

      async onSubmit() {
         try {
            this.processing = true
            const profile = storage.getItem('profile')
            const password = this.form.password
            const result = await this.$axios.patch(`/users/${profile.id}`, { password })
            if (!result.data.success) {
               Notify.create({ color: 'negative', message: this.$t(result.data.message) })
               return false
            }
            Notify.create(this.$t(result.data.message))
         } catch (error) {
            console.error('ChangePassword', 'onSubmit', error)
            Notify.create({ color: 'negative', message: 'There was a problem change the password' })
         } finally {
            this.processing = false
            this.hide()
         }
      },
   },

   mixins: [Core],
}
</script>

<style></style>
