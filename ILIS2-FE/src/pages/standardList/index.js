import Vue from 'vue';
import List from './list';
import router from './router';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import api from '@common/api';
import ajax from "@common/ajax";
import qs from "qs";




// 引入全局样式
import "@common/global.less";

Vue.config.productionTip = false;
Vue.use(Antd);

Vue.prototype.$api = api;
Vue.prototype.$ajax = ajax;
Vue.prototype.qs = qs;
Vue.prototype.$message.config({
  top: `300px`,
  duration: 3
});

new Vue({
  el: '#app',
  router,
  components: {List},
  template: '<List/>'
});
