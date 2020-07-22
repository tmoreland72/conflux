<template>
   <q-markdown
      :extend="extendMarkdown"
      :src="src"
   />
</template>

<script>
import markdownItMermaid from '@liradb2000/markdown-it-mermaid'

export default {
   props: {
      src: {
         type: String,
         required: true,
      }
   },

   methods: {
      extendMarkdown(md) {
         md.use(markdownItMermaid)
      },
   }
}
</script>
