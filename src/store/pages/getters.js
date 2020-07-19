import filter from 'lodash/filter'

import { sortArray} from 'src/helpers/sort'

export default {
   page: (state) => (pageId) => {
      return state.pages[pageId]
   },

   sorted: (state) => (spaceId) => {
      let pages = {...state.pages}
      if (!pages) return []
      let sorted = []
      Object.keys(pages).map(key => {
         let active = pages[key].active !== false
         let inSpace = true
         if (spaceId) {
            inSpace = pages[key].spaceId === spaceId
         }
         if (active && inSpace) {
            sorted.push(pages[key])
         }
      })
      return sortArray(sorted, ['name'])
   },

   starred: (state, getters) => (spaceId) => {
      let personal = []
      getters.sorted(spaceId).map(item => {
         if (item.starred) {
            personal.push(item)
         }
      })
      return personal
   },

   archived: (state) => {
      let pages = {...state.pages}
      if (!pages) return []
      let sorted = []
      Object.keys(pages).map(key => {
         if (pages[key].active === false) {
            sorted.push(pages[key])
         }
      })
      return sortArray(sorted, ['name'])
   }

}
