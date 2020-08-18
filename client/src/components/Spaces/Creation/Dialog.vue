<template>
   <q-dialog v-model="open">
      <q-card>
         <q-stepper
            v-model="step"
            ref="stepper"
            color="primary"
            animated
            alternative-labels
            style="min-width: 320px;"
         >
            <q-step
               icon="create_new_folder"
               :name="1"
               title="Template"
               :done="step > 1"
            >
               <space-templates :template.sync="template"/>
            </q-step>

            <q-step
               icon="folder"
               :name="2"
               title="Details"
            >
               <space-form :onAdd="onAdd"/>
            </q-step>

            <template v-slot:navigation>
               <q-stepper-navigation>
                  <div class="row justify-end q-gutter-sm">
                     <q-btn
                        v-if="step === 1"
                        color="primary"
                        flat
                        label="Cancel"
                        :to="{ name: 'home' }"
                     />
                     <q-btn
                        v-if="step > 1"
                        color="primary"
                        flat
                        label="Back"
                        @click="$refs.stepper.previous()"
                     />
                     <q-btn
                        v-if="step === 1"
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
import { mapActions, mapState } from 'vuex'
import { Notify } from 'quasar'

export default {
   data() {
      return {
         open: true,
         step: 1,
         template: {},
      }
   },

   methods: {
      ...mapActions('spaces', ['addSpace']),

      async onAdd(formData) {
         formData.private = this.template.type === 'private'
         await this.addSpace(formData)
         .then(result => {
            Notify.create('Spaced added')
            this.$router.replace({ name: 'space-overview', params: { spaceId: result } })
         })
         .catch(err => {
            console.error("Error occurred in Dialog", err)
            Notify.create('Error: ' + err)
         })
      }
   },

   components: {
      SpaceTemplates: require("./Templates.vue").default,
      SpaceForm: require("./Form.vue").default,
   }
}
</script>

<style scoped>

</style>
