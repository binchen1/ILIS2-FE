<template>
  <div>
    <a-modal
      title="更新进度"
      v-model="uploadVisible"
      :confirmLoading="confirmLoading"
      @ok="handleSubmit"
    >
      <a-form :form="form">
        <a-form-item
          label="工程名称"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-input
            v-decorator="[
              'name',
              { initialValue: data.name }
            ]"
            :disabled="true"
          />
        </a-form-item>
        <a-form-item
          label="整体进度百分比"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-slider
            v-decorator="[
              'rateOfProgress',
              { initialValue: data.rateOfProgress || 0 }
            ]"
          />
        </a-form-item>
        <a-form-item
          v-for="(item, index) in fieldsData"
          :key="index"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
          :label="item.columnName"
        >
          <a-input
            v-if="item.columnType==2"
            v-decorator="[
              item.id,
              { initialValue: data[item.id] }
            ]"
            :placeholder="`请输入${item.columnName}`"
          />
          <a-input-number
            style="width:100%"
            v-if="item.columnType==1"
            v-decorator="[
              item.id,
              { initialValue: data[item.id] }
            ]"
            :placeholder="`请输入${item.columnName}`"
          />
          <a-radio-group
            v-if="item.columnType==3"
            v-decorator="[
              item.id,
              { initialValue: data[item.id] }
            ]"
          >
            <a-radio value="是">是</a-radio>
            <a-radio value="否">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          label="附件"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-upload
            v-decorator="[
              'upload',
              {
                valuePropName: 'fileList',
                getValueFromEvent: normFile,
              }
            ]"
            :action="uploadApi"
            accept=".xls,.xlsx, .doc, .docx"
          >
            <a-button>
              <a-icon type="upload" /> 上传文件
            </a-button>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>

import { message } from "ant-design-vue";
import { setTimeout } from 'timers';
import TreeComponent from "../../testReport/components/tree";

export default {
  data (){
    return {
      id: this.$route.params.id,
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
      data: {},
      uploadApi: `${window.location.origin}${this.$api.common.upload}`,
      attachmentId: "",
      attachmenttitle: ""
    }
  },
  components: {
    TreeComponent
  },
  props: ['fieldsData', 'callback'],
  methods: {
    showModal: function(data){
      this.data = data;
      this.uploadVisible = true;
    },
    cancelModal: function(){
      this.form.resetFields();
      this.uploadVisible = false;
    },
    handleSubmit (e) {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading =  true;

          let formData = { ...values },
            customKeyValues = [];
          delete formData.upload;
          delete formData.name;
          delete formData.rateOfProgress;

          for(let key in formData){
            customKeyValues.push({
              customColumnId: key,
              customColumnValue: formData[key] || ""
            })
          }

          let data = {
            unitProjectId: "",
            contractPartId: "",
            rateOfProgress: values.rateOfProgress,
            attachmentId: this.attachmentId,
            attachmentName: this.attachmenttitle,
            customKeyValues
          }

          if(this.data.type == "contract"){
            data.contractPartId = this.data.key
          }else if(this.data.type == "unit"){
            data.unitProjectId = this.data.key
          }

          this.$ajax({
            method: "POST",
            url: this.$api.testItem.updateProgress,
            data
          }).then(res => {
            if(res && res.code){
              if(res.code === 21000){
                message.success("操作成功");
                this.form.resetFields();
                this.cancelModal();
                this.callback();
              }
            }
            this.confirmLoading =  false;
          });
        }
      });
    },
    normFile (e) {
      console.log('Upload event:', e);
      if (Array.isArray(e)) {
        return e;
      }
      this.attachmentId = e.file.response && e.file.response.obj && e.file.response.obj[0].id;
      this.attachmenttitle = e.file.response && e.file.response.obj && e.file.response.obj[0].attachmenttitle;

      if(e.fileList && e.fileList.length > 1){
        e.fileList.shift();
        return e && e.fileList;
      }else{
        return e && e.fileList;
      }
    }
  }
}
</script>

<style>

</style>