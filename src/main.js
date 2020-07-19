// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vant,{Lazyload} from 'vant'
import 'vant/lib/index.css'
import Cookie from 'vue-cookie'
import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:8888/'
Vue.prototype.axios = axios
Vue.config.productionTip = false
Vue.prototype.cookie = Cookie
Vue.use(Lazyload);
Vue.use(Vant)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
