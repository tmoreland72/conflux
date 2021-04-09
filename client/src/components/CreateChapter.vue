<template>
   <q-dialog ref="createChapter" @hide="onHide">
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
                  v-model="form.bookId"
               /> -->
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

export default {
   name: 'CreateChapter',

   data() {
      return {
         processing: false,
         form: {
            bookId: this.$route.params.id,
            title: '',
            subtitle: '',
         },
      }
   },

   computed: {
      ...mapGetters(['store/bookOptions', 'store/all']),

      bookOptions() {
         return this['store/bookOptions']
      },
   },

   methods: {
      show() {
         this.$refs.createChapter.show()
      },

      hide() {
         this.$refs.createChapter.hide()
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
            const chapter = {
               ...this.form,
            }
            const countBefore = this['store/all']({ collection: 'chapters' }).length
            console.log('chapterCount before', countBefore)
            const result = await this.$axios.post(`/chapters`, chapter)
            if (!result.data.success) {
               Notify.create({ color: 'negative', message: this.$t(result.data.message) })
               return false
            }
            const interval = setInterval(() => {
               const countAfter = this['store/all']({ collection: 'chapters' }).length
               console.log('chapterCount after', countAfter)
               if (countAfter > countBefore) {
                  clearInterval(interval)
               }
            }, 500)
         } catch (error) {
            console.error('ChapterCreate', 'onSubmit', error)
            Notify.create({ color: 'negative', message: 'There was a problem creating the chapter.' })
         } finally {
            this.processing = false
            this.hide()
         }
      },
   },
}
</script>

<style></style>
