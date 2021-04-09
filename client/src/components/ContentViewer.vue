<template>
   <div v-if="!content"><q-inner-loading color="primary" :spinning="true" /></div>
   <div v-else>
      <q-markdown class="viewer" :extend="extendMarkdown" :src="content" />
   </div>
</template>

<script>
import markdownItMermaid from '@liradb2000/markdown-it-mermaid'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-firestore-security-rules'
import 'prismjs/components/prism-git'
import 'prismjs/components/prism-graphql'
import 'prismjs/components/prism-lua'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-mongodb'
import 'prismjs/components/prism-perl'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-rest'
import 'prismjs/components/prism-sass'
import 'prismjs/components/prism-scss'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-stylus'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-yaml'

export default {
   props: {
      content: {
         type: String,
         required: true,
      },
   },

   methods: {
      extendMarkdown(md) {
         md.use(markdownItMermaid)
      },
   },
}
</script>

<style lang="sass" scoped>
.viewer
   width: 100%
</style>
