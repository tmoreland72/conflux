<script>
export default {
   methods: {
      mxOnKey(e) {
         const TAB = '   '
         let start = e.target.selectionStart
         let end = e.target.selectionEnd
         let value = e.target.value
         //console.log('key', e.key, 'shift', e.shiftKey, 'ctrl', e.ctrlKey)

         // Tab
         if (e.key === 'Tab' && !e.shiftKey) {
            e.target.setRangeText(TAB, start, end)
            let cursorPos = start + TAB.length
            e.target.setSelectionRange(cursorPos, cursorPos)
         }

         // Shift-Tab
         if (e.key === 'Tab' && e.shiftKey) {
            if (value.substring(start - TAB.length, end) !== TAB) return false
            e.target.setRangeText('', start - TAB.length, end)
            let cursorPos = start - TAB.length
            e.target.setSelectionRange(cursorPos, cursorPos)
         }

         // Ctrl-S
         if (e.key === 's' && e.ctrlKey) {
            this.onSave()
         }
      },
   }
}
</script>
