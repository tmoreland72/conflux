<template>
   <div class="q-pa-md text-grey-9">
      <div class="q-pl-md text-h5">Space Settings</div>

      <template v-if="!mxAuthorized('settings')">
         <div class="flex flex-center">
            You are not authorized
         </div>
      </template>

      <template v-else>
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
               <q-tab name="permissions" label="Permissions"/>
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
                           <!-- Import Space -->
                           <q-tab-panel name="content_import">
                              <div class="text-h6 q-mb-md">Import Space</div>
                              <div class="q-mt-md text-body2">
                                 <p>Imports a previous space export.</p>
                                 <p class="text-negative text-weight-bold">NOTE:</p>
                                 <p class="text-negative">This will overwrite the current space, overwrite any matching
                                    pages and create any pages that don't exist. Existing pages that are not in the
                                    export
                                    will not be modified.</p>
                                 <q-file v-model="importFile" label="File" hint="Click here to open a file dialog"
                                         filled/>
                                 <q-btn
                                    class="q-mt-md"
                                    :disabled="!importFile"
                                    label="Start Import"
                                    no-caps
                                    @click="() => onClickImport()"
                                 />
                              </div>
                           </q-tab-panel>

                           <!-- Export Space -->
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

               <q-tab-panel name="permissions" class="q-pa-none">

                  <q-splitter v-model="splitter">

                     <template v-slot:before>
                        <q-tabs
                           v-model="tabInner"
                           vertical
                           class="text-grey-7"
                           active-color="primary"
                           indicator-color="primary"
                        >
                           <q-tab name="permissions_domain" icon="domain" label="Domain"/>
                           <q-tab name="permissions_public" icon="public" label="Public"/>
                        </q-tabs>
                     </template>

                     <template v-slot:after>
                        <q-tab-panels
                           v-model="tabInner"
                           animated
                           transition-prev="slide-down"
                           transition-next="slide-up"
                        >
                           <!-- Domain Permissions -->
                           <q-tab-panel name="permissions_domain">
                              <div class="text-h6 q-mb-md">Domain Permissions</div>
                              <div class="q-mt-md text-body2">
                                 <p>Permissions for users in your domain (based on email address).</p>
                                 <p class="text-negative text-weight-bold">NOTE:</p>
                                 <p class="text-negative">This is only meant for people using custom email domains. Do
                                    NOT
                                    use these permissions when using public email domains (e.g. gmail.com, hotmail.com,
                                    etc.)</p>
                              </div>

                              <div class="q-mt-lg column q-gutter-md">
                                 <q-checkbox label="Admin" v-model="permissions.domain.admin"/>
                                 <q-checkbox label="Read" v-model="permissions.domain.read"/>
                                 <q-checkbox label="Create" v-model="permissions.domain.create"/>
                                 <q-checkbox label="Update" v-model="permissions.domain.update"/>
                                 <q-checkbox label="Delete" v-model="permissions.domain.delete"/>

                                 <div class="row q-gutter-md">
                                    <q-btn outline label="Reset" no-caps @click="handleResetDomainPermissions()"/>
                                    <q-btn color="primary" label="Save" no-caps @click="handleSaveSettings()"/>
                                 </div>
                              </div>
                           </q-tab-panel>

                           <!-- Public Permissions -->
                           <q-tab-panel name="permissions_public">
                              <div class="text-h6 q-mb-md">Public Permissions</div>
                              <div class="q-mt-md text-body2">
                                 <p>Permissions can be granted to any email address.</p>
                                 <p class="text-negative text-weight-bold">NOTE:</p>
                                 <p class="text-negative">This requires the user to be logged in with the exact email
                                    address used here. You may need to have duplicate entries for people who user more
                                    than
                                    one email to log in.</p>
                              </div>

                              <template v-if="!showAddPublicPermission">
                                 <div class="q-mt-lg">
                                    <q-btn
                                       color="primary"
                                       label="Add"
                                       icon="add_circle"
                                       @click="showAddPublicPermission = true"
                                    />
                                 </div>
                              </template>

                              <template v-if="showAddPublicPermission">
                                 <transition>
                                    <div class="q-mt-lg">
                                       <q-form @submit="() => handleAddPublicPermission()">
                                          <div class="column q-gutter-md">
                                             <q-input filled label="Email" v-model="formData.email"/>
                                             <q-checkbox label="Admin" v-model="formData.admin"/>
                                             <q-checkbox label="Read" v-model="formData.read"/>
                                             <q-checkbox label="Create" v-model="formData.create"/>
                                             <q-checkbox label="Update" v-model="formData.update"/>
                                             <q-checkbox label="Delete" v-model="formData.delete"/>

                                             <div class="row q-gutter-md">
                                                <q-btn
                                                   outline
                                                   label="Cancel"
                                                   no-caps
                                                   @click="showAddPublicPermission = false"
                                                />
                                                <q-btn
                                                   color="primary"
                                                   outline
                                                   label="Add"
                                                   no-caps
                                                   type="submit"
                                                />
                                             </div>
                                          </div>
                                       </q-form>
                                    </div>
                                 </transition>
                              </template>

                              <template v-else>
                                 <div class="q-mt-lg column q-gutter-md">
                                    <q-list bordered separator>
                                       <q-item
                                          v-for="(item, idx) in permissions.public"
                                          :key="idx"
                                       >
                                          <q-item-section>
                                             <div class="text-body2">{{ item.email }}</div>
                                          </q-item-section>

                                          <q-item-section>
                                             <div class="row q-gutter-md">
                                                <template v-if="item.admin">
                                                   <div class="text-body2">ADMIN</div>
                                                </template>
                                                <template v-if="item.read">
                                                   <div class="text-body2">READ</div>
                                                </template>
                                                <template v-if="item.create">
                                                   <div class="text-body2">CREATE</div>
                                                </template>
                                                <template v-if="item.update">
                                                   <div class="text-body2">UPDATE</div>
                                                </template>
                                                <template v-if="item.delete">
                                                   <div class="text-body2">DELETE</div>
                                                </template>
                                             </div>
                                          </q-item-section>

                                          <q-item-section>
                                             <div class="q-pa-sm row justify-end q-gutter-sm">
                                                <q-btn
                                                   color="negative"
                                                   icon="delete"
                                                   round
                                                   @click="() => handleDeletePublicPermission(idx)"
                                                />
                                             </div>
                                          </q-item-section>
                                       </q-item>
                                    </q-list>

                                    <div class="row q-gutter-md">
                                       <q-btn outline label="Reset" no-caps
                                              @click="() => handleResetDomainPermissions()"/>
                                       <q-btn color="primary" label="Save" no-caps @click="() => handleSaveSettings()"/>
                                    </div>
                                 </div>
                              </template>
                           </q-tab-panel>

                        </q-tab-panels>
                     </template>

                  </q-splitter>
               </q-tab-panel>
            </q-tab-panels>

         </div>
      </template>

   </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { Notify } from 'quasar'

import { currentTime } from 'src/helpers/time'
import { exportToFile } from 'src/helpers/files'
import mxAuthorizations from 'src/mixins/mxAuthorizations'

export default {
   data() {
      return {
         tab: 'content',
         tabInner: 'content_import',
         splitter: 20,
         importFile: null,
         space: {},
         showAddPublicPermission: false,
         formData: {
            email: '',
            admin: false,
            read: false,
            create: false,
            update: false,
            delete: false,
         },
         permissions: {
            domain: {
               admin: false,
               read: false,
               create: false,
               update: false,
               delete: false,
            },
            public: [],
         },
      }
   },

   computed: {
      ...mapGetters([
         'spaces/space',
         'pages/page',
         'pages/sorted',
      ]),
      ...mapState('auth', ['loggedIn']),

   },

   mixins: [mxAuthorizations],

   methods: {
      ...mapActions([
         'spaces/getSpace',
         'spaces/updateSpace',
         'pages/addPage',
         'pages/updatePage',
      ]),
      ...mapMutations([
         'spaces/UPDATE_SPACE',
      ]),

      async initData() {
         let spaceId = this.$route.params.spaceId
         this.space = await this['spaces/space'](spaceId)
         await this.handleResetDomainPermissions()
      },

      async handleResetDomainPermissions() {
         let space = await this['spaces/getSpace']({ tenantId: this.space.tenantId, id: this.space.id })
         this.permissions = space.permissions ? space.permissions : {
            domain: {
               admin: false,
               read: false,
               create: false,
               update: false,
               delete: false,
            },
            public: [],
         }
      },

      async handleAddPublicPermission() {
         let space = { ...this['spaces/space'](this.space.id) }
         space.permissions.public.push({...this.formData})
         this['spaces/UPDATE_SPACE'](space)
         this.permissions = this['spaces/space'](this.space.id).permissions
         this.showAddPublicPermission = false
         this.formData = {
            email: '',
            admin: false,
            read: false,
            create: false,
            update: false,
            delete: false,
         }
      },

      async handleDeletePublicPermission(idx) {
         let space = { ...this['spaces/space'](this.space.id) }
         space.permissions.public.splice(idx, 1)
         this['spaces/UPDATE_SPACE'](space)
         this.permissions = {...this['spaces/space'](this.space.id).permissions}
      },

      async handleSaveSettings() {
         let space = {...this.space}
         space.permissions = {...this.permissions}
         try {
            await this['spaces/updateSpace'](space)
            await this.initData()
            Notify.create('Settings saved')
         } catch (err) {
            console.error('Settings-handleSaveSettings', err)
            Notify.create('Settings failed to save')
         }
         this.showAddPublicPermission = false
      },

      async onClickImport() {
         const file = this.importFile
         let content = await file.text()

         if (!content) {
            Notify.create('Invalid import file detected')
            return false
         }

         let spaceImport = JSON.parse(content)
         spaceImport.id = this.space.id
         spaceImport.ownerId = this.loggedIn.uid
         spaceImport.tenantId = this.loggedIn.tenantId
         let pagesImport = spaceImport.pages
         delete spaceImport.pages
         await this['spaces/updateSpace'](spaceImport)
            .then(() => {
               pagesImport.map(async page => {
                  page.spaceId = spaceImport.id
                  page.ownerId = this.loggedIn.uid
                  if (this['pages/page'](page.id)) {
                     let update = await this['pages/updatePage'](page)
                  } else {
                     let add = await this['pages/addPage'](page)
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

   watch: {
      tab: function(value) {
         switch (value) {
            case 'content':
               this.tabInner = 'content_import'
               break
            case 'permissions':
               this.tabInner = 'permissions_domain'
         }
      },

      'permissions.domain': {
         deep: true,
         handler(value) {
            if (value.admin) {
               this.permissions.domain.read = true
               this.permissions.domain.create = true
               this.permissions.domain.update = true
               this.permissions.domain.delete = true
            }
            if (value.create) {
               this.permissions.domain.read = true
            }
            if (value.update) {
               this.permissions.domain.read = true
            }
            if (value.delete) {
               this.permissions.domain.read = true
            }
         },
      },

      formData: {
         deep: true,
         handler(value) {
            if (value.admin) {
               this.formData.read = true
               this.formData.create = true
               this.formData.update = true
               this.formData.delete = true
            }
            if (value.create) {
               this.formData.read = true
            }
            if (value.update) {
               this.formData.read = true
            }
            if (value.delete) {
               this.formData.read = true
            }
         },
      },

      '$route': async function() {
         await this.initData()
      },
   },

   beforeMount() {
      this.initData()
   },
}
</script>
