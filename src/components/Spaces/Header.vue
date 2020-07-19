<template>
   <div class="row justify-between items-center text-grey-9">
      <div class="text-h5">{{space.name}}</div>

      <div class="row q-gutter-md">
         <template v-if="editMode">
            <q-btn flat label="Cancel" no-caps @click="onClickCancel()"/>
            <q-btn color="primary" label="Save" :loading="loading.save" no-caps @click="onClickSave()"/>
         </template>

         <template v-else>
            <q-btn dense flat round icon="edit" @click="onClickEdit()"/>
            <q-btn dense flat round icon="visibility" @click="onClickVisibility()"/>
            <q-btn color="primary" label="Share" no-caps @click="onClickShare()" />
            <q-btn :label="starBtnLabel" :loading="loading.star" no-caps @click="onClickStar()"/>
         </template>
      </div>
   </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { Notify } from 'quasar'

export default {
   props: {
      editMode: {
         type: Boolean,
      },
      onSave: {
         type: Function,
         required: true,
      }
   },

   data() {
      return {
         loading: {
            save: false,
            star: false,
         },
         space: {},
         starBtnLabel: 'Unstar this space',
      }
   },

   computed: {
      ...mapState('spaces', ['spaces']),
   },

   methods: {
      ...mapActions(['spaces/updateSpace']),

      initData() {
         let spaceId = this.$route.params.spaceId
         this.space = this.spaces[spaceId]
      },

      onClickCancel() {
         this.$emit('update:editMode', false)
      },

      onClickEdit() {
         this.$emit('update:editMode', true)
      },

      async onClickSave() {
         this.loading.save = true
         await this.onSave()
         this.loading.save = false
      },

      async onClickStar() {
         this.loading.star = true
         let space = {
            id: this.space.id,
            starred: !this.space.starred
         }
         await this['spaces/updateSpace'](space)
         .then(() => {
            Notify.create('Update successful')
         })
         .catch(() => {
            Notify.create('Update failed')
         })
         .finally(() => {
            this.initData()
            this.loading.star = false
         })
      },

      onClickShare() {
         Notify.create('Coming soon...')
      },

      onClickVisibility() {
         Notify.create('Coming soon...')
      }
   },

   watch: {
      'space.starred': function(value) {
         if (value) {
            this.starBtnLabel = 'Unstar this space'
         } else {
            this.starBtnLabel = 'Star this space'
         }
      }
   },

   beforeMount() {
      this.initData()
   }
}
</script>
