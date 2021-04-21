<template>
   <q-dialog ref="createPage" @hide="onHide">
      <q-card>
         <q-card-section>
            <q-form class="q-gutter-md" @submit.prevent="onSubmit">
               <!-- <q-select
                  color="primary"
                  emit-value
                  filled
                  hide-bottom-space
                  :label="$t('book')"
                  map-options
                  :options="bookOptions"
                  v-model="formHelper.bookId"
               /> -->

               <q-select
                  color="primary"
                  emit-value
                  filled
                  hide-bottom-space
                  :label="$t('chapter')"
                  map-options
                  :options="chapterOptions"
                  v-model="form.chapterId"
               />

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
import { mapGetters } from 'vuex'
import { Notify } from 'quasar'

import { storage } from 'boot/storage'

export default {
   name: 'CreatePage',

   data() {
      return {
         loading: true,
         processing: false,
         form: {
            title: '',
            subtitle: '',
            chapterId: '',
         },
         formHelper: {
            bookId: this.$route.params.id,
         },
      }
   },

   computed: {
      ...mapGetters(['store/all', 'store/byId', 'store/bookOptions', 'store/chapterOptions']),

      book() {
         return this['store/byId']({ collection: 'books', id: this.formHelper.bookId })
      },

      bookOptions() {
         return this['store/bookOptions']
      },

      chapterOptions() {
         return this['store/chapterOptions'](this.formHelper.bookId)
      },
   },

   methods: {
      show() {
         this.$refs.createPage.show()
      },

      hide() {
         this.$refs.createPage.hide()
      },

      onCancel() {
         this.hide()
      },

      onHide() {
         this.$emit('hide')
      },

      init() {
         const interval = setInterval(() => {
            if (this.book) {
               this.form.chapterId = this.chapterOptions[0].value
               clearInterval(interval)
            }
         }, 500)
      },

      async onSubmit() {
         try {
            this.processing = true
            const profile = storage.getItem('profile')
            const page = {
               ...this.form,
               author: profile.id,
            }
            const result = await this.$axios.post('/pages', page)

            if (!result.data.success) {
               Notify.create({ color: 'negative', message: this.$t(result.data.message) })
               return false
            }

            this.$router.push({
               name: 'book-page',
               params: { id: this.formHelper.bookId, pageId: result.data.data.id },
            })
            this.processing = false
            this.hide()
         } catch (error) {
            console.error('PageCreate', 'onSubmit', error)
            Notify.create({ color: 'negative', message: 'There was a problem creating the page.' })
         } finally {
         }
      },
   },

   mounted() {
      this.init()
   },
}
</script>

<style></style>
