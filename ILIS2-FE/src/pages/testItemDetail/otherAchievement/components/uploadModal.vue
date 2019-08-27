<template>
  <div>
    <a-modal
      :title="isAdd?'上传成果':'编辑成果'"
      v-model="uploadVisible"
      :confirmLoading="confirmLoading"
      @ok="handleSubmit"
      class="otherAchievement-uploadModal"
    >
      <a-form :form="form">
        <a-form-item
          label="成果范围"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 15 }"
        >
          <a-input
            class="otherAchievement-uploadModal-input"
            v-decorator="[
              'name',
              { initialValue: this.name || data.name },
              {rules: [{ required: true, message: '请选择成果范围！' }]}
            ]"
            :disabled="true"
            placeholder="请选择成果范围"
          />
          <a-button @click="()=> this.selectTreeVisible = true">选择</a-button>
        </a-form-item>
        <a-form-item
          label="成果类型"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 15 }"
        >
          <a-select
            v-decorator="[
              'achievementType',
              { initialValue: data.achievementType },
              {rules: [{ required: true, message: '请选择成果类型！' }]}
            ]"
            placeholder="请选择成果类型"
          >
            <a-select-option v-for="(item, index) in typeData" :key="index" :value="item.value">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="成果文件"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 15 }"
        >
          <a-button icon="upload" @click="upload">上传文件</a-button>
          <div v-for="(item, index) in fileLists" :key="index">
            {{ item.name }}
          </div>
        </a-form-item>

      </a-form>
    </a-modal>

    <a-modal
      title="选择成果范围"
      v-model="selectTreeVisible"
    >
      <TreeComponent :treeSelect="treeSelect" />
    </a-modal>

    <UploadComponent ref="UploadComponent" :max="1" :uploadcall="uploadcall" :fileLists="fileLists" />
  </div>
</template>

<script>

import qs from "qs";
import { message } from "ant-design-vue";
import TreeComponent from "../../testReport/components/tree";
import UploadComponent from "@components/uploadComponent";
import { getQueryVariable } from "@common/utils";

export default {
  data (){
    return {
      id: getQueryVariable("id"),
      selectTreeVisible: false,
      uploadVisible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      contractPartId: "",
      unitProjectId: "",
      name: "",
      data:{
        name: "",
        achievementType: undefined,
        upload: ""
      },
      typeData: [
        { name: "综合检测大纲", value: "10011" },
        { name: "综合检测方案", value: "10010" },
        { name: "检测细则", value: "10086" },
        { name: "其它", value: "10000" }
      ],
      fileLists: [],
    }
  },
  props: ["treeInfo", "callback", "node", "isAdd"],
  components: {
    TreeComponent,
    UploadComponent
  },
  methods: {
    showModal: function(data){
      console.log(this.node)
      if(data){
        this.data = data;
        this.contractPartId = data.contractPartId;
        this.unitProjectId = data.unitProjectId;
        this.fileLists = [{
          uid: data.attachmentId,
          name: data.achievementName,
          status: 'done',
          url: ""
        }]
      }else{
        this.contractPartId= this.treeInfo.contractPartId || null
        this.unitProjectId= this.treeInfo.unitProjectId || null
        this.data = {
          name:  this.node.type ? (this.node.title || ""):"",
          achievementType: undefined
        }
        this.fileLists = []
      }
      this.uploadVisible = true;
    },
    cancelModal: function(){
      this.form.resetFields();
      this.uploadVisible = false;
    },
    handleSubmit (e) {

      if(this.fileLists.length == 0){
        message.warn("请先上传文件");
        return;
      }

      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading =  true;

          let { uid, name } = this.fileLists[0],
            method = this.isAdd ? "POST":"PUT";

          let data = {
            ...values,
            unitProjectId: this.unitProjectId || null,
            contractPartId: this.contractPartId || null,
            projectId: this.id,
            attachmentId: this.fileLists[0].uid,
            achievementName: this.fileLists[0].name
          };

          if(!this.isAdd){
            data.id = this.data.id
          }

          // 删除多余字段
          delete data.name;

          this.$ajax({
            method,
            url: this.$api.testItem.achievement, 
            data,
            headers: {
              "Content-Type": "application/json",
              "X-Requested-With": "XMLHttpRequest"
            }
          }).then(res => {
            if(res && res.code){
              if(this.isAdd){
                this.callback(this.node.type, this.node.id);
              }else{
                let type = data.contractPartId ? "contract" : "unit";
                this.callback(type, data.contractPartId || data.contractPartId);
              }
            }
            this.form.resetFields();
            this.cancelModal();
            this.confirmLoading =  false;
            this.loading = false;
          });
        }
      });
    },
    treeSelect (data, info){
      let type = info.node.dataRef.type,
          name = info.node.dataRef.name;

      this.unitProjectId = "";
      this.contractPartId = "";

      if(data.length == 0){
        return;
      }

      if(type){
        if(type === "unit"){
          this.unitProjectId = data[0];
          this.name = name;
        }else if(type === "contract"){
          this.contractPartId = data[0];
          this.name = name;
        }
      }

      this.selectTreeVisible = false;
    },
    upload(){
      this.$refs.UploadComponent.showModal();
    },
    uploadcall (res){
      this.fileLists = res.map(item=>({
        uid: item.id,
        name: item.attachmenttitle,
        status: 'done',
        url: item.realpath,
      }));
    }
  }
}
</script>

<style>

</style>