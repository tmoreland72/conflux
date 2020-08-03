export function ADD_PAGE( state , item) {
   let pages = {...state.pages}
   pages[item.id] = item
   state.pages = pages
}

export function UPDATE_PAGE(state, item) {
   Object.assign(state.pages[item.id], item)
}

export function SET_PAGES(state, value) {
   state.pages = value
}
