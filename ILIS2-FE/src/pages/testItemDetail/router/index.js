import Vue from 'vue'
import Router from 'vue-router'
import pageAuth from "@config/pageAuth";
import store from "../store";

// 业务项目管理详情页
import ProjectDetail from "../projectDetail";
// 业务项目管理详情页 - 检测报告
import TestReport from "../testReport";
// 业务项目管理详情页 - 其他成果
import OtherAchievement from "../otherAchievement";
// 业务项目管理详情页 - 附录
import Appendix from "../appendix";
// 业务项目管理详情页 - 合同段/单位工程
import ContractAndWorks from "../contractAndWorks";
// 业务项目管理详情页 - 进度管理
import ProgressManage from "../progressManage";
// 业务项目管理详情页 - 联系人
import Contacts from "../contacts";

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'ProjectDetail',
      component: ProjectDetail,
      children:[
        {
          path: '',
          component: TestReport
        },
        {
          path: 'otherAchievement',
          component: OtherAchievement
        },
        {
          path: 'appendix',
          component: Appendix
        },
        {
          path: 'contractAndWorks',
          component: ContractAndWorks
        },
        {
          path: 'progressManage',
          component: ProgressManage
        },
        {
          path: 'Contacts',
          component: Contacts
        }
      ]
    }
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