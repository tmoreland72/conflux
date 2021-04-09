<template>
   <q-card class="cursor-pointer shadow-7 bg-accent text-secondary" bordered style="width: 240px; height: 160px;">
      <template v-if="deleting"><q-inner-loading color="primary" :spinning="true"/></template>
      <template v-else>
         <!-- <q-card-section class="bg-secondary" style="height: 24px;"></q-card-section>
         <q-card-section style="padding: 0px;">
            <q-avatar
               color="primary"
               text-color="accent"
               :icon="chapter.icon ? chapter.icon : 'chapter'"
               class="absolute"
               size="48px"
               style="top: -24px; left: 8px;"
            />
         </q-card-section> -->
         <q-card-section style="padding-top: 0px; padding-bottom: 0px; padding-right: 8px;">
            <div class="row justify-end q-gutter-sm">
               <q-btn color="secondary" dense flat :icon="icons.more" round @click.stop="">
                  <q-menu>
                     <q-list bordered separator>
                        <q-item clickable v-close-popup @click="onDeleteChapter">
                           <q-item-section avatar>
                              <q-icon :name="icons.delete" color="primary" flat />
                           </q-item-section>
                           <q-item-section>
                              <q-item-label>{{ `${$t('delete')} ${$t('chapter')}` }}</q-item-label>
                           </q-item-section>
                        </q-item>
                     </q-list>
                  </q-menu>
               </q-btn>
            </div>
         </q-card-section>
         <q-card-section class="column" style="padding-top: 0px;">
            <span class="q-ml-xs text-h6 text-weight-medium ellipsis" style="max-width: 95%">{{ chapter.title }}</span>
            <span class="q-ml-xs text-caption text-italic ellipsis" style="max-width: 95%">{{ chapter.subtitle }}</span>
         </q-card-section>
      </template>
   </q-card>
</template>

<script>
import Core from 'src/mixins/Core'

export default {
   name: 'ChapterCard',

   props: {
      chapter: {
         type: Object,
         required: true,
      },
   },

   data() {
      return {
         deleting: false,
      }
   },

   mixins: [Core],
}
</script>

<style></style>
