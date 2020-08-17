import Vue from 'vue'
import axios from 'axios'

const http = axios.create({
   baseUrl: process.env.API_BASEURL
})

Vue.prototype.$axios = axios

export { http }
