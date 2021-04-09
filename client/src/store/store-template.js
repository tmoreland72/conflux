import { firestore } from 'boot/firebase'

const state = {
   collection: {}
}

const mutations = {
   setItem: (store, value) => {
      Vue.set(state.collection, value.id, value)
   },

   deleteItem: (store, id) => {
      Vue.delete(state.collection, id)
   }
}

const getters = {
   all: (state) => {
      let arr = []
      Object.keys(state.collection).map(key => {
         arr.push(state.collection[key])
      })
   },

   byId: (state, getters) => (id) => {
      let result = getters.all.filter(f => f.id === id)
      if (result && result.length === 1) return result[0]
      return {}
   }
}

const actions = {
   bind: async ({ dispatch }) => {
      try {
         let ref = firestore.collection('users')
            await ref.onSnapshot(snapshot => {
               snapshot.docChanges().forEach(change => {
                  if (change.type === 'added') {
                     if (!change.doc.metadata.hasPendingWrites) {
                        commit('SET', {
                           id: change.doc.id,
                           ...change.doc.data()
                        })
                     }
                  }
                  if (change.type === 'modified') {
                     commit('SET', {
                        id: change.doc.id,
                        ...change.doc.data()
                     })
                  }
                  if (change.type === 'removed') {
                     commit('DELETE', change.doc.id)
                  }
               })
         })
      } catch (err) {
         console.error('bind', err.message)
      }
   },

   add: async ({}, data) => {
      try {
         let result = await <add_api_call>
         if (!result) {
            console.error('add', 'fail', result)
            return false
         }
         return result
      } catch (err) {
         console.error('add', err.message)
      }
   }
}

export default {
   namespaced: true,
   state,
   mutations,
   getters,
   actions
}