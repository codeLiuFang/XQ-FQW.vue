import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'
import $ from 'jquery'
import 'bootstrap3/dist/css/bootstrap.css'
import 'bootstrap3/dist/js/bootstrap.js'
import queryBuilder from 'jQuery-QueryBuilder'
import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog' // error log
import './permission' // permission control
// import './mock' // simulation data
import './assets/icon/iconfont.css'
// 引入moment日期格式化组件
import moment from 'moment'
Vue.prototype.$moment = moment

import * as filters from './filters' // global filters

Vue.use(Element, {
  size: 'small', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  $,
  queryBuilder,
  template: '<App/>',
  components: { App }
})
