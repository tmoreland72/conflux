import { sortArray} from 'src/helpers/sort'

export default {
   sorted: (state) => {
      let spaces = {...state.spaces}
      if (!spaces) return []
      let sorted = []
      Object.keys(spaces).map(key => {
         if (spaces[key].active !== false) {
            sorted.push(spaces[key])
         }
      })
      return sortArray(sorted, ['name'])
   },

   starred: (state, getters) => {
      let personal = []
      getters.sorted.map(item => {
         if (item.starred) {
            personal.push(item)
         }
      })
      return personal
   },

   personal: (state, getters) => {
      let personal = []
      getters.sorted.map(item => {
         if (item.private) {
            personal.push(item)
         }
      })
      return personal
   },

   shared: (state, getters) => {
      let personal = []
      getters.sorted.map(item => {
         if (!item.private) {
            personal.push(item)
         }
      })
      return personal
   },

   archived: (state) => {
      let spaces = {...state.spaces}
      if (!spaces) return []
      let sorted = []
      Object.keys(spaces).map(key => {
         if (spaces[key].active === false) {
            sorted.push(spaces[key])
         }
      })
      return sorted
   }

}
