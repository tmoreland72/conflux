<template></template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { Notify } from 'quasar'

import { storage } from 'boot/storage'

export default {
   name: 'Core',

   data() {
      return {
         showBookCreateDialog: false,
         showChapterCreateDialog: false,
         showPageCreateDialog: false,
         showChangePasswordDialog: false,
      }
   },

   computed: {
      ...mapGetters(['store/all', 'store/byId']),

      icons() {
         return {
            conflux: 'library_books',
            add: 'add_circle',
            edit: 'edit',
            delete: 'delete_forever',
            archive: 'archive',
            restore: 'restore',
            import: 'upload',
            export: 'download',
            more: 'more_vert',
            filter: 'filter_list',
            addPage: 'note_add',
            addChapter: 'playlist_add',
            addBook: 'library_add',
            bookmarks: 'bookmarks',
            bookmark_off: 'bookmark_border',
            bookmark_on: 'bookmark',
            notifications: 'notifications',
            help: 'help',
            account: 'account_circle',
            search: 'search',
            menu: 'menu',
            home: 'home',
            book: 'menu_book',
            page: 'description',
            chapter: 'library_books',
            password: 'lock',
            logout: 'logout',
         }
      },
   },

   methods: {
      ...mapActions(['store/bind', 'store/unbind']),

      async initData() {
         return new Promise(async (res, rej) => {
            storage.set('initializing', true)
            try {
               if (!storage.has('profile')) {
                  storage.remove('initializing')
                  res()
                  return false
               }
               await this['store/bind']('users')
               await this['store/bind']('books')
               await this['store/bind']('chapters')
               await this['store/bind']('pages')
               res()
            } catch (error) {
               console.error('Core', 'initData', error)
               rej()
            } finally {
               storage.remove('initializing')
            }
         })
      },

      destroyData() {
         this['store/unbind']('users')
         this['store/unbind']('books')
         this['store/unbind']('chapters')
         this['store/unbind']('pages')
      },

      onBookmark(book) {
         Notify.create('Maybe later...')
      },

      onDeleteBook() {
         this.$q
            .dialog({
               title: this.$t('warning'),
               message: `
               <img src='/images/warning.svg' width='200px' style='display: block; margin-left: auto; margin-right: auto;'>
               <br/>
               <p>${this.$t('bookdeletewarningmsg')}</p>
               `,
               html: true,
               cancel: true,
               persistent: true,
            })
            .onOk(async () => {
               try {
                  this.deleting = true
                  const book = this.book
                  const result = await this.$axios.delete(`/books/${book.id}`)
                  if (!result.data.success) {
                     Notify.create({
                        color: 'negative',
                        message: this.$t(result.data.message),
                     })
                     return false
                  }
                  Notify.create(this.$t(result.data.message))
                  if (this.$route.params.id === book.id) {
                     this.$router.push({ name: 'home' })
                  }
               } catch (err) {
                  console.error('Core', 'onDeleteBook', err)
                  Notify.create({ color: 'negative', message: 'Delete failed' })
               } finally {
                  this.deleting = false
               }
            })
            .onCancel(() => {
               Notify.create(this.$t('noactiontaken'))
            })
      },

      async onDeleteChapter() {
         this.$q
            .dialog({
               title: this.$t('warning'),
               message: `
               <img src='/images/warning.svg' width='200px' style='display: block; margin-left: auto; margin-right: auto;'>
               <br/>
               <p>${this.$t('chapterdeletewarningmsg')}</p>
               `,
               html: true,
               cancel: true,
               persistent: true,
            })
            .onOk(async () => {
               try {
                  this.deleting = true
                  const chapter = this.chapter
                  const result = await this.$axios.delete(`/chapters/${chapter.id}`)
                  if (!result.data.success) {
                     Notify.create({
                        color: 'negative',
                        message: this.$t(result.data.message),
                     })
                     return false
                  }
                  Notify.create(this.$t(result.data.message))
                  if (this.$route.params.id === chapter.id) {
                     this.$router.push({ name: 'home' })
                  }
               } catch (err) {
                  console.error('Core', 'onDeleteBook', err)
                  Notify.create({ color: 'negative', message: 'Delete failed' })
               } finally {
                  this.deleting = false
               }
            })
            .onCancel(() => {
               Notify.create(this.$t('noactiontaken'))
            })
      },

      onDeletePage() {
         this.$q
            .dialog({
               title: this.$t('warning'),
               message: `
               <img src='/images/warning.svg' width='200px' style='display: block; margin-left: auto; margin-right: auto;'>
               <br/>
               <p>${this.$t('pagedeletewarningmsg')}</p>
               `,
               html: true,
               cancel: true,
               persistent: true,
            })
            .onOk(async () => {
               try {
                  this.deleting = true
                  const page = this.page
                  const result = await this.$axios.delete(`/pages/${page.id}`, {
                     data: page,
                  })
                  if (!result.data.success) {
                     Notify.create({
                        color: 'negative',
                        message: this.$t(result.data.message),
                     })
                     return false
                  }
                  Notify.create(this.$t(result.data.message))
                  this.$router.push({
                     name: 'book',
                     params: { id: this.$route.params.id },
                  })
               } catch (err) {
                  console.error('Core', 'onDeletePage', err)
                  Notify.create({ color: 'negative', message: 'Delete failed' })
               } finally {
                  this.deleting = false
               }
            })
            .onCancel(() => {
               Notify.create(this.$t('noactiontaken'))
            })
      },
   },

   watch: {
      showBookCreateDialog: function(show) {
         if (show) {
            this.$q
               .dialog({
                  component: () => import('src/components/CreateBook.vue'),
                  parent: this,
               })
               .onOk(() => {})
               .onCancel(() => {})
               .onDismiss(() => {
                  this.showBookCreateDialog = false
               })
         }
      },
      showChapterCreateDialog: function(show) {
         if (show) {
            this.$q
               .dialog({
                  component: () => import('src/components/CreateChapter.vue'),
                  parent: this,
               })
               .onOk(() => {})
               .onCancel(() => {})
               .onDismiss(() => {
                  this.showChapterCreateDialog = false
               })
         }
      },
      showPageCreateDialog: function(show) {
         if (show) {
            this.$q
               .dialog({
                  component: () => import('src/components/CreatePage.vue'),
                  parent: this,
               })
               .onOk(() => {})
               .onCancel(() => {})
               .onDismiss(() => {
                  this.showPageCreateDialog = false
               })
         }
      },
      showChangePasswordDialog: function(show) {
         if (show) {
            this.$q
               .dialog({
                  component: () => import('src/components/ChangePassword.vue'),
                  parent: this,
               })
               .onOk(() => {})
               .onCancel(() => {})
               .onDismiss(() => {
                  this.showChangePasswordDialog = false
               })
         }
      },
   },
}
</script>

<style></style>
