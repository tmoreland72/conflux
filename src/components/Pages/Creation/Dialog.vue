<template>
   <q-dialog ref="createPage" @hide="onDialogHide">
      <q-card>
         <q-stepper
            animated
            color="primary"
            ref="stepper"
            v-model="step"
         >
            <q-step
               :name="1"
               title="Select space"
               :done="step > 1"
            >
               <div class="row items-center q-gutter-md">
                  <div class="text-grey-9">Space</div>
                  <q-select
                     color="primary"
                     emit-value
                     map-options
                     :options="options"
                     outline
                     v-model="selectedSpace"
                  />
               </div>

            </q-step>

            <q-step
               :name="2"
               :done="step > 2"
               title="Select a Page Template"
            >
               <page-templates :template.sync="template"/>
            </q-step>

            <q-step
               :name="3"
               title="Provide Page details"
            >
               <page-form :onAdd="onAdd"/>
            </q-step>

            <template v-slot:navigation>
               <q-stepper-navigation>
                  <div class="row justify-end q-gutter-sm">
                     <q-btn
                        v-if="step === 1"
                        color="primary"
                        flat
                        label="Cancel"
                        @click="onCancelClick"
                     />
                     <q-btn
                        v-if="step > 1"
                        color="primary"
                        flat
                        label="Back"
                        @click="$refs.stepper.previous()"
                     />
                     <q-btn
                        v-if="step < 3"
                        color="primary"
                        label="Next"
                        @click="$refs.stepper.next()"
                     />
                  </div>
               </q-stepper-navigation>
            </template>
         </q-stepper>
      </q-card>
   </q-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { Notify } from 'quasar'

export default {
   data() {
      return {
         options: [],
         selectedSpace: null,
         step: 1,
         template: {},
      }
   },

   computed: {
      ...mapGetters(['spaces/sorted']),

   },

   methods: {
      ...mapActions('pages', ['addPage']),

      async initData() {
         let options = []
         let spaces = [...this['spaces/sorted']]
         spaces.map(space => {
            let option = {
               label: space.name,
               value: space.key
            }
            options.push(option)
         })
         this.options = options

         if (this.$route.params.spaceId) {
            this.selectedSpace = this.$route.params.spaceId
         } else {
            this.selectedSpace = options[0].value
         }
      },

      async onAdd(formData) {
         let spaceId = this.selectedSpace
         formData.spaceId = spaceId
         formData.type = this.template.type
         await this.addPage(formData)
         .then(result => {
            Notify.create('Page added')
            this.$router.push({ name: 'page', params: { spaceId, pageId: result.id } })
         })
         .catch(err => {
            console.error("Error occurred in Dialog", err)
            Notify.create('Error: ' + err)
         })
         .finally(() => {
            this.$emit('hide')
         })
      },

      show() {
         this.$refs.createPage.show()
      },

      hide() {
         this.$refs.createPage.hide()
      },

      onDialogHide() {
         this.$emit('hide')
      },

      onCancelClick() {
         this.hide()
      }
   },

   components: {
      PageTemplates: require("./Templates.vue").default,
      PageForm: require("./Form.vue").default,
   },

   beforeMount() {
      this.initData()
   }
}
</script>

<style scoped>

</style>
