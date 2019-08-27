import Vue from 'vue'
import Router from 'vue-router'
import Article from '../list';
import FormPage from '../form';
// import Report from '../report';
import Home from '../../home/App';
import NoAuth from "@components/common/noAuthPage";
import pageAuth from "@config/pageAuth";
import store from "../store";

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Article',
      component: Article
    },
    {
      path: '/form',
      name: 'FormPage',
      component: FormPage,
      meta:{
        id: "4028822069c78f410169c7fcb26a0019",
        functionCode: "goConsignInfoPage,completeConsignById,consignCommonPrint1"
      }
    },
    {
      path: '/report',
      name: 'Report',
      component: Article,
      meta:{
        id:"123456"
      }
    },
    {
      path: "/noAuth",
      name: "noAuth",
      component: NoAuth
    }
  ]
});



router.beforeEach((to, from, next)=>{
  pageAuth(to, from, next, store)
});

export default router;