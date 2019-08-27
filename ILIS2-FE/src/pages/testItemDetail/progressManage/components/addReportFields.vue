<template>
  <div>
    <a-modal
      title="新增上报字段"
      v-model="visible"
      :confirmLoading="confirmLoading"
      @ok="handleSubmit"
    >
      <a-form :form="form">
        <a-form-item
          label="序号"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 15 }"
        >
          <a-input
            v-decorator="[
              'columnIndex'
            ]"
            placeholder="请输入单位工程名称"
          />
        </a-form-item>
        <a-form-item
            label="字段类型"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 15 }"
        >
          <a-select
            v-decorator="[
              'columnType'
            ]"
            placeholder="请选择字段类型"
          >
            <a-select-option v-for="(item, index) in contentType" :key="index" :value="item.value">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="字段名称"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 15 }"
        >
          <a-input
            v-decorator="[
              'columnName'
            ]"
            placeholder="请输入字段名称"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>

import { message } from "ant-design-vue";
import { getQueryVariable } from "@common/utils";

export default {
  data (){
    return {
      id: getQueryVariable("id"),
      form: this.$form.createForm(this),
      visible: false,
      confirmLoading: false,
    }
  },
  props: ['contentType', 'callback'],
  methods: {
    showModal: function(){
      this.visible = true;
    },
    cancelModal: function(){
      this.visible = false;
    },
    handleSubmit (e) {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading =  true;

          this.$ajax({
            method: "POST",
            url: this.$api.testItem.column,
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            },
            data: {
              ...values,
              projectId: this.id
            }
          }).then(res => {
            if(res && res.code){
              if(res.code === 21000){
                message.success("新增成功");
                this.cancelModal();
                this.form.resetFields();
                this.callback();
              }
            }
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