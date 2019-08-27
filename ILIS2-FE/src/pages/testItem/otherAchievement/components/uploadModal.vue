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
              { initialValue: this.name },
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
          <a-upload
            v-decorator="['upload', {
              valuePropName: 'fileList',
              getValueFromEvent: normFile,
            }]"
            :action="uploadAPI"
            accept=".xls,.xlsx, .doc, .docx, .pdf, .jpg"
          >
            <a-button>
              <a-icon type="upload" /> 上传文件
            </a-button>
          </a-upload>
        </a-form-item>
      </a-form>
      <a-button @click="upload">上传</a-button>
    </a-modal>

    <a-modal
      title="选择成果范围"
      v-model="selectTreeVisible"
    >
      <TreeComponent :treeSelect="treeSelect" />
    </a-modal>

    <UploadComponent ref="UploadComponent" :max="1" :callback="uploadFile" />
  </div>
</template>

<script>

import qs from "qs";
import { setTimeout } from 'timers';
import TreeComponent from "../../testReport/components/tree";
import UploadComponent from "@components/uploadComponent";

export default {
  data (){
    return {
      id: this.$route.params.id,
      selectTreeVisible: false,
      uploadVisible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      contractPartId: "",
      unitProjectId: "",
      achievementName: "",
      attachmentId: "",
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
      uploadAPI: `${window.location.origin}/ilis2/uploadController.do?upload`
    }
  },
  props: ['callback', 'isAdd'],
  components: {
    TreeComponent,
    UploadComponent
  },
  methods: {
    showModal: function(data){
      if(data){
        this.data = data;
        this.contractPartId = data.contractPartId;
        this.unitProjectId = data.unitProjectId;
        this.achievementName = data.achievementName;
        this.attachmentId = data.attachmentId;
      }else{
        this.contractPartId= ""
        this.unitProjectId= ""
        this.achievementName= ""
        this.attachmentId= ""
        this.data = {
          name: "",
          achievementType: undefined,
          upload: ""
        }
      }
      this.uploadVisible = true;
    },
    cancelModal: function(){
      this.uploadVisible = false;
    },
    handleSubmit (e) {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading =  true;

          let data = {
            ...values,
            unitProjectId: this.unitProjectId,
            contractPartId: this.contractPartId,
            projectId: this.id,
            attachmentId: this.attachmentId,
            achievementName: this.achievementName
          };

          // 删除多余字段
          delete data.upload;
          delete data.name;

          this.$ajax({
            method: "POST",
            url: this.$api.testItem.achievement, 
            data,
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
          }).then(res => {
            if(res && res.code){
              this.callback();
            }
            this.cancelModal();
            this.confirmLoading =  false;
            this.loading = false;
          });
        }
      });
    },
    normFile (e) {
      if (Array.isArray(e)) {
        return e;
      }

      this.attachmentId = e.file.response && e.file.response.obj && e.file.response.obj[0].id;
      this.achievementName = e.file.response && e.file.response.obj && e.file.response.obj[0].attachmenttitle;

      if(e.fileList && e.fileList.length > 1){
        e.fileList.shift();
        return e && e.fileList;
      }else{
        return e && e.fileList;
      }
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
    uploadFile(data){
      console.log("上传后获取到的文件", data);
    }
  }
}
</script>

<style>

</style>