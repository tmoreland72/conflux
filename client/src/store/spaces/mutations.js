import Vue from 'vue'

export function ADD_SPACE( state , payload) {
   let spaces = {...state.spaces}
   spaces[payload.id] = payload
   state.spaces = spaces
}

export function UPDATE_SPACE(state, item) {
   Object.assign(state.spaces[item.id], item)
}

export function SET_SPACES(state, value) {
   state.spaces = value
}
