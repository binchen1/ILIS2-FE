import Vue from 'vue'
import Router from 'vue-router'
import About from '../about';
import Comment from '../comment';

import { Drawer, Button, List, Card } from "ant-design-vue";

Vue.use(Drawer);
Vue.use(Button);
Vue.use(List);
Vue.use(Card);

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'about',
      component: About
    },
    {
      path: '/comment/:id',
      props: true,
      name: 'comment',
      component: Comment
    }
  ]
})
