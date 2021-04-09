<template>
   <q-dialog ref="createBook" @hide="onHide">
      <q-card>
         <q-card-section>
            <q-form class="q-gutter-md" @submit.prevent="onSubmit">
               <!-- Icon Picker -->
               <div class="column">
                  <div class="text-subtitle1">{{ $t('selecticon') }}</div>

                  <div>
                     <q-input filled v-model="picker.filter" style="width: 300; max-width: 95%;">
                        <template v-slot:append>
                           <q-icon :name="icons.filter" />
                        </template>
                     </q-input>
                  </div>

                  <div class="q-mt-md bg-accent" style="width: 300px; max-width: 95%;">
                     <q-icon-picker
                        :filter="picker.filter"
                        icon-set="material-icons"
                        :pagination.sync="picker.pagination"
                        v-model="form.icon"
                        style="height: 320px;"
                     />
                  </div>
               </div>

               <q-input autofocus filled hide-bottom-space :label="$t('title')" v-model="form.title" />

               <q-input filled hide-bottom-space :label="$t('subtitle')" v-model="form.subtitle" />

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

import { storage } from 'boot/storage'
import Core from 'src/mixins/Core'

export default {
   name: 'BookCreate',

   data() {
      return {
         processing: false,
         form: {
            icon: null,
            title: '',
            subtitle: '',
         },
         picker: {
            pagination: {
               filter: '',
               itemsPerPage: 49,
               page: 0,
            },
         },
      }
   },

   methods: {
      show() {
         this.$refs.createBook.show()
      },

      hide() {
         this.$refs.createBook.hide()
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
            const book = {
               ...this.form,
               owner: profile.id,
               collaborators: [profile.id],
            }
            const result = await this.$axios.post('/books', book)
            if (!result.data.success) {
               Notify.create({ color: 'negative', message: this.$t(result.data.message) })
               return false
            }
            Notify.create(this.$t(result.data.message))
            this.$router.push({ name: 'book', params: { id: result.data.data.id } })
         } catch (error) {
            console.error('BookCreate', 'onSubmit', error)
            Notify.create({ color: 'negative', message: 'There was a problem creating the book.' })
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
