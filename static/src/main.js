// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'; 
import 'element-ui/lib/theme-chalk/index.css'; 
import axios from 'axios'; 
import qs from 'qs'; 
import $ from 'jquery'; 
import md5 from 'js-md5'; 

import Api from './api/api'; 
import global from './api/global'; 
import Vuex from 'vuex'; 
import store from './store'; 
import domain from './api/domain'; 
// import {VTable, VPagination} from 'vue-easytable'

Vue.use(Vuex); 
Vue.config.productionTip = false; 

Vue.use(ElementUI); 
Vue.use(Api); 



Vue.prototype.$axios = axios; 
Vue.prototype.$qs = qs; 
Vue.prototype.$ = $; 
Vue.prototype.$md5 = md5; 
Vue.prototype.global = global; 
global.domain = domain; 

/* eslint-disable no-new */
// Vue.component(VTable.name, VTable)
// Vue.component(VPagination.name, VPagination)
new Vue( {
el:'#app', 
router, 
store, 
components: {App }, 
template:'<App/>'
})
