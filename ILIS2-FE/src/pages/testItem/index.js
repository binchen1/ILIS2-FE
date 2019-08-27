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

import { Slider, InputNumber, Button, Table, LocaleProvider, Input, Popconfirm, Modal, Form, Select, Checkbox, Row, Col, Tree, DatePicker, Upload, Icon, TreeSelect, Radio } from 'ant-design-vue';
Vue.use(LocaleProvider);
Vue.use(Button);
Vue.use(Table);
Vue.use(Input);
Vue.use(Popconfirm);
Vue.use(Modal);
Vue.use(Form);
Vue.use(Select);
Vue.use(Checkbox);
Vue.use(Row);
Vue.use(Col);
Vue.use(Tree);
Vue.use(DatePicker);
Vue.use(Upload);
Vue.use(Icon);
Vue.use(TreeSelect);
Vue.use(Radio);
Vue.use(InputNumber);
Vue.use(Slider);

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
