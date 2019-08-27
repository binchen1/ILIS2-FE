<template>
  <div class="projectDetail">
    <div class="projectDetail-title">
      <strong>贵州省兴义环城高速公路</strong>
      <span class="projectDetail-title-tag">已结束</span>
    </div>
    <div class="projectDetail-info">
      项目简介：撒大苏打大撒大撒大撒大苏打
    </div>
    <div class="projectDetail-info">
      项目负责人：<span>{{ person1 }}</span> <a-button size="small" @click="setPersonnel('person1', 'person1Ids', person1Ids, 'radio')">设置人员</a-button>
    </div>
    <div class="projectDetail-info">
      项目参与人：<span>{{ person2 }}</span> <a-button size="small" @click="setPersonnel('person2', 'person2Ids', person2Ids)">设置人员</a-button>
    </div>
    <div class="projectDetail-info">
      默认审核人：<span>{{ person3 }}</span> <a-button size="small" @click="setPersonnel('person3', 'person3Ids', person3Ids, 'radio')">设置人员</a-button>
    </div>
    <div class="projectDetail-info">
      默认签发人：<span>{{ person4 }}</span> <a-button size="small" @click="setPersonnel('person4', 'person4Ids', person4Ids, 'radio')">设置人员</a-button>
    </div>
    <div class="projectDetail-tab">
      <div class="projectDetail-tab-btn">
        <router-link :to="`/detail/${id}`">检测报告</router-link>
        <router-link :to="`/detail/${id}/otherAchievement`">其它成果</router-link>
        <router-link :to="`/detail/${id}/appendix`">附录</router-link>
        <router-link :to="`/detail/${id}/contractAndWorks`">合同段/单位工程</router-link>
        <router-link :to="`/detail/${id}/progressManage`">进度管理</router-link>
        <router-link :to="`/detail/${id}/contacts`">联系人</router-link>
      </div>
      <router-view></router-view>
    </div>
    <SelectPersonnel ref="SelectPersonnel" :callback="setData" />
  </div>
</template>

<script>

import { message } from "ant-design-vue";
import SelectPersonnel from "./components/selectPersonnel";

export default {
  data () {
    return {
      id: this.$route.params.id,
      person1: "",
      person1Ids: [],
      person2: "",
      person2Ids: [],
      person3: "",
      person3Ids: [],
      person4: "",
      person4Ids: [],
      resCode: {
        "20000": "请求成功",
        "20010": "请求失败",
        "21000": "新增成功",
        "22000": "修改成功",
        "23000": "删除成功"
      }
    }
  },
  created(){
    this.getPersonInfo();
  },
  components: {
    SelectPersonnel
  },
  methods: {
    getPersonInfo (){
      this.$ajax.get(`${this.$api.testItem.setPerson}/${this.id}`).then(res=>{
        if(res && res.code){
          if(res.code == "20000" || res.code == "21000" || res.code == "22000" || res.code == "23000"){
            if(res.data && Array.isArray(res.data)){
              res.data.map(item => {
                if(item.personType == 1){
                  this.person1 += `${item.personName}; `;
                  this.person1Ids.push(item.personId);
                }else if(item.personType == 2){
                  this.person2 += `${item.personName}; `;
                  this.person2Ids.push(item.personId);
                }else if(item.personType == 3){
                  this.person3 += `${item.personName}; `;
                  this.person3Ids.push(item.personId);
                }else if(item.personType == 4){
                  this.person4 += `${item.personName}; `;
                  this.person4Ids.push(item.personId);
                }
              });
            }
          }else{
            message.error(res.msg || "操作失败");
          }
        }
      });
    },
    setPersonnel (field, ids, data, type){
      this.$refs.SelectPersonnel.showModal(field, ids, data, type);
    },
    setData (field, ids, nameArr, idArr, data){

      let personType;

      if(field == "person1"){
        personType = 1;
      }else if(field == "person2"){
        personType = 2;
      }else if(field == "person3"){
        personType = 3;
      }else if(field == "person4"){
        personType = 4;
      }
      
      data = data.map(item => ({
        personType,
        projectId: this.id,
        personName: item.name,
        personId: item.value
      }));

      this.$ajax.post(this.$api.testItem.setPerson, data).then(res=>{
        if(res && res.code){
          if(res.code == "20000" || res.code == "21000" || res.code == "22000" || res.code == "23000"){
            message.success(this.resCode[res.code]);

            if(nameArr.length > 0){
              field && (this[field] = nameArr.join(";"));
              field && (this[ids] = idArr);
            }
          }else{
            message.error(res.msg || "操作失败");
          }
        }
      });
    }
  },
}
</script>

<style lang="less">
    @import "./index.less";
</style>


