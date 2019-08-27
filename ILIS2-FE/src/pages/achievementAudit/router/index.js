import Vue from 'vue'
import Router from 'vue-router'
import pageAuth from "@config/pageAuth";
import store from "../store";

// 审核中
import Auditing from "../auditing";
// 审核完成
import Completed from "../completed";

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Auditing',
      component: Auditing
    },
    {
      path: '/completed',
      name: 'Completed',
      component: Completed
    },
    // {
    //   path: '/form',
    //   name: 'FormPage',
    //   component: FormPage,
    //   meta:{
    //     id: "4028822069c78f410169c7fcb26a0019",
    //     functionCode: "goConsignInfoPage,completeConsignById,consignCommonPrint1"
    //   }
    // }
  ]
});



router.beforeEach((to, from, next)=>{
  pageAuth(to, from, next, store)
});

export default router;