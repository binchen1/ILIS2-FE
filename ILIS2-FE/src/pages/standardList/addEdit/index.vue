<template>
  <a-locale-provider :locale="zhCN">
  <a-form :form="form">
    <a-form-item label="规格名称" v-bind="formItemLayout">
      <a-input :disabled="isDetail" v-decorator="['standardName',
          {initialValue: editData.standardName ,rules: [{ required: true, message: '请输入规格名称' }]}
        ]" />
    </a-form-item>
    <a-form-item v-bind="formItemLayout" label="颁布号">
      <a-input :disabled="isDetail" v-decorator="['publishCode',{initialValue: editData.publishCode}]"/>
    </a-form-item>
    <a-form-item  v-bind="formItemLayout"  label="执行时间" >
      <a-date-picker :disabled="isDetail" v-decorator="['executeDate',{initialValue: moment(formatTime(editData.executeDate || new Date(),fmt) , fmt)}]"/>
    </a-form-item>
    <a-form-item v-bind="formItemLayout" label="过期时间" >
      <a-date-picker :disabled="isDetail"  v-decorator="['expireDate',{initialValue: moment(formatTime(editData.expireDate || new Date(), fmt),fmt)}]"/>
    </a-form-item>
    <a-form-item v-bind="formItemLayout" label="规程文件" >
      <a-upload
          v-decorator="['upload', {
              valuePropName: 'fileList',
              getValueFromEvent: normFile,
            }]"
          :action="uploadAPI"
          accept=".xls,.xlsx, .doc, .docx, .pdf, .jpg"
      >
        <a-button v-show="!isDetail">
          <a-icon type="upload"  /> 上传文件
        </a-button>
        <p v-if="fileName?false:true"> {{ editData.fileName}}</p>
      </a-upload>
    </a-form-item>
  </a-form>
  </a-locale-provider>
</template>

<script>
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
  import moment from 'moment';
  import { formatTime,ajaxRequest } from '@common/utils.js';

  export default {
    name: "addEdit",
    props:['standardTypeId','standardId','callback','isDetail'],
    // props:['standardTypeId','standardId'],
    data () {
      return {
        zhCN,
        fmt:'YYYY-MM-DD',
        standardTypeIdEdit:'',
        // disabled: true,
        formItemLayout: {
          labelCol: {
            xs: { span: 5 },
            sm: { span: 5 },
          },
          wrapperCol: {
            xs: { span: 12 },
            sm: { span: 12 },
          },
        },
        editData:{},
        fileName: "",
        fileId: "",
        uploadAPI: `${window.location.origin}/ilis2/uploadController.do?upload`
      };
    },
    beforeCreate () {
      this.form = this.$form.createForm(this);
    },
    created(){
      this.standardId ? this.getData() : '';
    },
    watch:{
      standardId:function(){
        console.log('this.standardId', this.standardId);
        if(this.standardId){
          this.getData()
        }else{
          this.editData = {};
        }
      }
    },
    methods: {
      moment,
      formatTime,
      ajaxRequest,
      getData() {
        // var self = this;
        var data = {
          id: this.standardId
        };
        ajaxRequest(this.$api.standard.standardGetById, this.qs.stringify(data), this.getDataCall);
      },
      getDataCall(res){
        if(res.success) {
          this.editData = res.obj || {};
          this.standardTypeIdEdit = res.obj.standardTypeId;
        }
      },
      normFile  (e) {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
          return e;
        }
        this.fileId = e.file.response && e.file.response.obj && e.file.response.obj[0].id;
        this.fileName = e.file.response && e.file.response.obj && e.file.response.obj[0].attachmenttitle;

        if(e.fileList && e.fileList.length > 1){
          e.fileList.shift();
          return e && e.fileList;
        }else{
          return e && e.fileList;
        }
      },
      handleSubmit () {
        this.form.validateFields((err, fieldsValue) => {
          if (err) {
            return;
          }
          const executeDate = fieldsValue['executeDate'] ? fieldsValue['executeDate'].format('YYYY-MM-DD') : "";
          const expireDate = fieldsValue['expireDate'] ? fieldsValue['expireDate'].format('YYYY-MM-DD') : '';
          const data = {
            ...fieldsValue,
            'executeDate': executeDate,
            'expireDate': expireDate,
          };
          if(this.standardId){
            data.standardTypeId = this.standardTypeIdEdit;
            data.id = this.standardId;
          }else{
            data.standardTypeId = this.standardTypeId;
          }
          data.fileId = this.fileId;
          console.log('data', data);
          console.log('this.fileId', this.fileId);
          delete data['upload'];
          ajaxRequest(this.$api.standard.standardSave,this.qs.stringify(data),this.saveCall)
        });
      },
      saveCall(res){
        console.log('res', res);
        res.success ? this.callback(res) : "";
      }
    },
  }
</script>

<style scoped>

</style>