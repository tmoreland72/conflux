import Vue from 'vue'
import { Platform, LocalStorage, SessionStorage } from 'quasar'

const storage = Platform.is.mobile ? LocalStorage : SessionStorage

Vue.prototype.$storage = storage
export { storage }
