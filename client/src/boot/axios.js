import Vue from 'vue'
import axios from 'axios'

const instance = axios.create({})

instance.defaults.baseURL = process.env.API_BASEURL
instance.defaults.headers.common['Accept'] = 'application/json'
instance.defaults.headers.post['Content-Type'] = 'application/json'
instance.defaults.headers.patch['Content-Type'] = 'application/json'

Vue.prototype.$axios = instance
export { instance }
