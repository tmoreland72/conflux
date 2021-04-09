<template>
   <div>
      <monaco-editor
         width="100%"
         height="100%"
         theme="vs-dark"
         language="markdown"
         :options="options"
         :value="content"
         @change="onChange"
      />
   </div>
</template>

<script>
import MonacoEditor from 'monaco-editor-vue'

export default {
   name: 'ContentEditor',

   props: {
      content: {
         type: String,
         required: true,
      },
   },

   data() {
      return {
         options: {
            automaticLayout: true,
            colorDecorators: true,
            columnSelection: true,
            cursorStyle: 'line',
            foldingStrategy: 'indentation',
            fontFamily: 'dm,Roboto,monospace',
            fontLigatures: true,
            fontSize: 16,
            formatOnPaste: true,
            formatOnType: true,
            lineNumbers: false,
            links: true,
            minimap: {
               enabled: false,
            },
            showFoldingControls: 'always',
            wordWrap: 'on',
         },
      }
   },

   methods: {
      onChange(value) {
         this.$emit('update:content', value)
      },
   },

   components: {
      MonacoEditor,
   },
}
</script>

<style></style>
