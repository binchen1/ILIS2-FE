import Vue from 'vue'
import App from './App'
import router from './router'
import store from "./store";
import api from "@common/api";
import ajax from "@common/ajax";
import directives from "@common/directives";

// 引入全局样式
import "@common/global.less";

Vue.config.productionTip = false

import { Button, Table, Form, DatePicker, TimePicker, LocaleProvider } from 'ant-design-vue';
Vue.use(LocaleProvider);
Vue.use(Button);
Vue.use(Table);
Vue.use(Form);
Vue.use(DatePicker);
Vue.use(TimePicker);

Vue.prototype.$api = api;
Vue.prototype.$ajax = ajax;

// 按钮权限校验
Vue.directive("btn-auth", directives.btnAuth);

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
