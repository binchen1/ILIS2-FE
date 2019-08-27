<template>
  <div>
    <a-modal
      :title="isAdd?'新增':'编辑'"
      v-model="uploadVisible"
      :confirmLoading="confirmLoading"
      @ok="handleSubmit"
    >
      <a-form :form="form">
        <a-form-item
          label="文件"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 15 }"
        >
          <a-button icon="upload" @click="upload">上传文件</a-button>
          <div v-for="(item, index) in fileLists" :key="index">
            {{ item.name }}
          </div>
        </a-form-item>
        <a-form-item
          label="备注"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 15 }"
        >
          <a-input
            v-decorator="[
              'remarks',
              { initialValue: remarks }
            ]"
            placeholder="请输入备注"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <UploadComponent ref="UploadComponent" :max="1" :uploadcall="uploadcall" :fileLists="fileLists" />
  </div>
</template>

<script>

import { message } from "ant-design-vue";
import { setTimeout } from 'timers';
import TreeComponent from "../../testReport/components/tree";
import UploadComponent from "@components/uploadComponent";

export default {
  data (){
    return {
      selectTreeVisible: false,
      uploadVisible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      typeData: [
        { name: "综合检测大纲", value: 0 },
        { name: "综合检测方案", value: 1 },
        { name: "检测细则", value: 2 },
        { name: "其它", value: 3 }
      ],
      fileLists: [],
      remarks: "",
      data: {}
    }
  },
  props: ["treeInfo", "callback", "node", "isAdd"],
  components: {
    TreeComponent,
    UploadComponent
  },
  methods: {
    showModal: function(data){
      if(data) {
        this.remarks = data.remarks;
        this.data = data;
        this.fileLists = [{
          uid: data.attachmentId,
          name: data.attachmentName,
          status: 'done',
          url: ""
      }]
      }else {
        this.data = {};
        this.remarks = "";
        this.fileLists = [];
      }
      this.uploadVisible = true;
    },
    cancelModal: function(){
      this.uploadVisible = false;
    },
    handleSubmit (e) {

      if(this.fileLists.length == 0){
        message.warn("请上传文件");
        return;
      }

      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading =  true;

          let { uid, name } = this.fileLists[0],
            method = this.isAdd ? "POST":"PUT";

          let treeInfo = {...this.treeInfo} || {};
          if(!this.isAdd){
            this.data.contractPartId ? (
              treeInfo.contractPartId = this.data.contractPartId
            ):(
              treeInfo.unitProjectId = this.data.unitProjectId
            )
            treeInfo.projectId = this.data.projectId
            treeInfo.id = this.data.id
          }

          this.$ajax(this.$api.testItem.appendixByFile, {
            method,
            data: {
              attachmentId: uid,
              attachmentName: name,
              ...treeInfo,
              ...values
            },
            headers: {
              "X-Requested-With": "XMLHttpRequest"
            }
          }).then(res => {
            this.confirmLoading =  false;
            if(res.code && ( res.code === 21000 || res.code === 22000)){
              message.success("操作成功")
              this.cancelModal();
              if(this.isAdd){
                this.callback(this.node.type, this.node.id);
              }else{
                let type = treeInfo.contractPartId ? "contract" : "unit";
                this.callback(type, treeInfo.id);
              }
            }else{
              message.warn(res.msg || "操作失败");
            }
          });
        }
      });
    },
    upload (){
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