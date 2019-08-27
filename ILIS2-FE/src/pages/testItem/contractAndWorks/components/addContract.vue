<template>
  <div>
    <a-modal
      title="新增合同段"
      v-model="visible"
      :confirmLoading="confirmLoading"
      @ok="handleSubmit"
      @cancel="cancelModal"
    >
      <a-form :form="form">
        <a-form-item
          label="合同段类型"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 15 }"
        >
          <a-select
            v-decorator="[
              'contractPartType',
              { initialValue: data.contractPartType }
            ]"
            placeholder="请选择合同段类型"
          >
            <a-select-option v-for="(item, index) in contractType" :key="index" :value="item.value">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
            label="合同段名称"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 15 }"
        >
          <a-input
            v-decorator="[
              'contractPartName',
              { initialValue: data.contractPartName }
            ]"
            placeholder="请输入合同段名称"
          />
        </a-form-item>
        <a-form-item
            label="合同段编号"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 15 }"
        >
          <a-input
            v-decorator="[
              'contractPartCode',
              { initialValue: data.contractPartCode }
            ]"
            placeholder="请输入合同段编号"
          />
        </a-form-item>
        <a-form-item
            label="施工单位"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 15 }"
        >
          <a-input
            v-decorator="[
              'constructionUnit',
              { initialValue: data.constructionUnit }
            ]"
            placeholder="请输入施工单位"
          />
        </a-form-item>
        <a-form-item
            label="监理单位"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 15 }"
        >
          <a-input
            v-decorator="[
              'supervisingUnit',
              { initialValue: data.supervisingUnit }
            ]"
            placeholder="请输入监理单位"
          />
        </a-form-item>
        <a-form-item
            label="说明"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 15 }"
        >
          <a-textarea
            v-decorator="[
              'description',
              { initialValue: data.description }
            ]"
            placeholder="请输入说明"
            :rows="4"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>

import { message } from "ant-design-vue";
import { setTimeout } from 'timers';

export default {
  data (){
    return {
      id: this.$route.params.id,
      form: this.$form.createForm(this),
      visible: false,
      confirmLoading: false,
      data:{
        contractPartType: undefined,
        contractPartName: "",
        contractPartCode: "",
        constructionUnit: "",
        supervisingUnit: "",
        description: ""
      }
    }
  },
  props: ['contractType', 'callback'],
  watch: {
    checkedKeys(val) {
      console.log('onCheck', val)
    }
  },
  methods: {
    showModal: function(data){
      if(data){
        this.data = data;
      }else{
        this.data = {
          contractPartType: undefined,
          contractPartName: "",
          contractPartCode: "",
          constructionUnit: "",
          supervisingUnit: "",
          description: ""
        }
      }
      this.visible = true;
    },
    cancelModal: function(){
      this.visible = false;
      this.form.resetFields();
    },
    handleSubmit (e) {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading =  true;

          this.$ajax({
            method: "POST",
            url: `${this.$api.testItem.contract}`,
            data:{
              ...values,
              projectId: this.id
            }
          }).then(res => {
            if(res && res.code){
              if(res.code === 21000){
                message.success("操作成功")
                this.cancelModal();
                this.form.resetFields();
                this.callback();
              }else{
                message.warn("操作失败")
              }
            }
            this.confirmLoading =  false;
          }, (err)=>{
            this.confirmLoading =  false;
          });
        }
      });
    }
  }
}
</script>

<style>

</style>