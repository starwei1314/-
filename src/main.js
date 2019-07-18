// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import "@/assets/css/reset.css"
// import "@/assets/js/rem.js"
import Vant from 'vant';
import Vuex from 'vuex'
import wx from 'weixin-jsapi'
import 'vant/lib/index.css';
import MyPlugin from '@/plugin/index'
import HttpService from '@/utils/http'
import 'lib-flexible/flexible'
Vue.use(wx)
Vue.use(MyPlugin)
Vue.prototype.$HttpService = HttpService
Vue.config.productionTip = false
Vue.use(Vant)
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    active: 0,
    selectedCate:0
  },
  mutations: {
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
