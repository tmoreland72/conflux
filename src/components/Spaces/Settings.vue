<template>
   <div class="q-pa-md text-grey-9">
      <div class="q-pl-md text-h5">Space Settings</div>

      <div class="q-mt-lg">
         <q-tabs
            align="left"
            v-model="tab"
            dense
            class="text-grey-7"
            active-color="primary"
            indicator-color="primary"
         >
            <q-tab name="content" label="Content Tools"/>
         </q-tabs>

         <q-separator/>

         <q-tab-panels class="q-mt-md" v-model="tab" animated>
            <q-tab-panel name="content" class="q-pa-none">

               <q-splitter v-model="splitter">

                  <template v-slot:before>
                     <q-tabs
                        v-model="tabInner"
                        vertical
                        class="text-grey-7"
                        active-color="primary"
                        indicator-color="primary"
                     >
                        <q-tab name="content_import" icon="archive" label="Import"/>
                        <q-tab name="content_export" icon="unarchive" label="Export"/>
                     </q-tabs>
                  </template>

                  <template v-slot:after>
                     <q-tab-panels
                        v-model="tabInner"
                        animated
                        transition-prev="slide-down"
                        transition-next="slide-up"
                     >
                        // Import Space
                        <q-tab-panel name="content_import">
                           <div class="text-h6 q-mb-md">Import Space</div>
                           <div class="q-mt-md text-body2">
                              <p>Imports a previous space export.</p>
                              <p class="text-negative text-weight-bold">NOTE:</p>
                              <p class="text-negative">This will overwrite the current space, overwrite any matching
                                 pages and create any pages that don't exist. Existing pages that are not in the export
                                 will not be modified.</p>
                              <q-file v-model="importFile" label="File" hint="Click here to open a file dialog" filled/>
                              <q-btn
                                 class="q-mt-md"
                                 :disabled="!importFile"
                                 label="Start Import"
                                 no-caps
                                 @click="() => onClickImport()"
                              />
                           </div>
                        </q-tab-panel>

                        // Export Space
                        <q-tab-panel name="content_export">
                           <div class="text-h6 q-mb-md">Export Space</div>
                           <div class="q-mt-md text-body2">
                              <p>Export all contents from this space.</p>
                              <q-btn label="Start Download" no-caps @click="() => onClickExport()"/>
                           </div>
                        </q-tab-panel>

                     </q-tab-panels>
                  </template>

               </q-splitter>
            </q-tab-panel>
         </q-tab-panels>

      </div>

   </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { Notify } from 'quasar'

import { currentTime } from 'src/helpers/time'
import { exportToFile } from 'src/helpers/files'

export default {
   data() {
      return {
         tab: 'content',
         tabInner: 'content_import',
         splitter: 20,
         importFile: null,
         initData: () => {},
         space: {}
      }
   },

   computed: {
      ...mapGetters(['pages/sorted']),
      ...mapState('spaces', ['spaces']),
      ...mapState('pages', ['pages']),
   },

   methods: {
      ...mapActions([
         'spaces/updateSpace',
         'pages/addPage',
         'pages/updatePage',
      ]),

      async onClickImport() {
         const file = this.importFile
         let content = await file.text()
         if (!content) return false

         let spaceImport = JSON.parse(content)
         spaceImport.id = this.space.id
         spaceImport.key = this.space.key
         let pagesImport = spaceImport.pages
         delete spaceImport.pages
         await this['spaces/updateSpace'](spaceImport)
         .then(() => {
            pagesImport.map(async page => {
               page.spaceId = spaceImport.id
               if (this.pages[page.id]) {
                  let upres = await this['pages/updatePage'](page)
                  console.log("update", upres)
               } else {
                  let adres = await this['pages/addPage'](page)
                  console.log("add", adres)
               }
            })
         })
         .then(async () => {
            await this.initData()
         })
         .finally(() => {
            Notify.create('Import complete')
            this.$router.push({ name: 'home' })
         })
      },

      async onClickExport() {
         let space = this.space.name.replace(' ', '_')
         let fileName = 'conflux_export_' + space + '_' + String(currentTime()) + '.json'
         let content = { ...this.space }
         content.pages = await this['pages/sorted'](this.space.id)

         await exportToFile(fileName, JSON.stringify(content, null, 2))
      },
   },

   beforeMount() {
      console.log("Settings", this.$route)
      this.space = this.spaces[this.$route.params.spaceId]
      this.initData = this.$route.params.initData
   }
}
</script>
