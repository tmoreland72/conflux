<template>
   <div class="q-pa-sm column q-gutter-md" style="min-height: 240px;">
      <q-scroll-area  class="bg-grey-1" style="height: 200px;">
         <div class="row q-gutter-md">
            <q-list padding style="width: 100%;">
               <q-item
                  :active="selected === index"
                  active-class="bg-grey-4 text-grey-9"
                  clickable
                  :key="index"
                  v-for="(t, index) in templates"
                  v-ripple
                  @click="() => onClick(index)"
               >
                  <q-item-section avatar>
                     <q-icon :name="t.icon" />
                  </q-item-section>
                  <q-item-section>
                     <q-item-label class="text-grey-7" overline>{{t.name|toUpper}}</q-item-label>
                     <q-item-label class="text-grey-9">{{ t.description }}</q-item-label>
                  </q-item-section>
               </q-item>
            </q-list>
         </div>
      </q-scroll-area>
   </div>
</template>

<script>
export default {
   data() {
      return {
         templates: [
            {
               icon: "folder_open",
               name: "Blank",
               description: "Create an empty space",
               type: "shared"
            },
            {
               icon: "folder_shared",
               name: "Personal",
               description: "Create a personal space",
               type: "private"
            },
         ],
         selected: 0
      }
   },

   filters: {
      toUpper(value) {
         return value.toUpperCase()
      }
   },

   methods: {
      onClick(index) {
         this.selected = index
         this.$emit('update:template', this.templates[index])
      },
   },

   mounted() {
      this.$emit('update:template', this.templates[0])
   }
}
</script>

<style scoped>

</style>
