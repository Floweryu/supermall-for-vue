import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import store from "./store";
import VueLazyload from "vue-lazyload";

import FastClick from 'fastclick'

Vue.config.productionTip = false

Vue.prototype.$bus = new Vue()

// 解决移动段点击延迟
FastClick.attach(document.body)

Vue.use(VueLazyload, {
  loading: require('./assets/img/common/placeholder.png')
})

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')

