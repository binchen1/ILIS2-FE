import Vue from 'vue'
import App from './App'
import router from './router'

// 引入全局样式
import "@common/global.less";

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
