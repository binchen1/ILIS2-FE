<template>
  <div>
    <a-modal
      :title="isAdd?'新建联系人':'编辑联系人'"
      v-model="visible"
      :confirmLoading="confirmLoading"
      @ok="handleSubmit"
      class="createContact-modal"
    >
      <a-form :form="form">
        <a-form-item
          label="姓名"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 15 }"
        >
          <a-input
            v-decorator="[
              'name',
              { initialValue: data.name },
              {rules: [{ required: true, message: '请输入姓名！' }]}
            ]"
            placeholder="请输入姓名"
          />
        </a-form-item>
        <a-form-item
          label="职位"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 15 }"
        >
          <a-input
            v-decorator="[
              'position',
              { initialValue: data.position }
            ]"
            placeholder="请输入职位"
          />
        </a-form-item>
        <a-form-item
          label="电话"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 15 }"
        >
          <a-input
            v-decorator="[
              'phone',
              { initialValue: data.phone },
              {rules: [{ required: true, message: '请输入电话！' }]}
            ]"
            placeholder="请输入电话"
          />
        </a-form-item>
        <a-form-item
          label="邮箱"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 15 }"
        >
          <a-input
            v-decorator="[
              'mail',
              { initialValue: data.mail },
              {rules: [{ required: true, message: '请输入邮箱！' }]}
            ]"
            placeholder="请输入邮箱"
          />
        </a-form-item>
        <a-form-item
          label="所属单位"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 15 }"
        >
          <a-tree
            @expand="onExpand"
            :expandedKeys="expandedKeys"
            :autoExpandParent="autoExpandParent"
            v-model="checkedKeys"
            @select="onSelect"
            :selectedKeys="selectedKeys"
            :treeData="treeData"
            v-decorator="[
              'belongUnit',
              { initialValue: data.belongUnit },
              { rules: [{ required: true, message: '请选择所属单位！' }]}
            ]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>

import { message } from "ant-design-vue";
import qs from "qs";
import { setTimeout } from 'timers';

function getTreeData(data){
  let obj = {},
      children = [];

  if(data.hasOwnProperty("children")){
    for(let i=0;i<data.children.length;i++){
      children.push(getTreeData(data.children[i]));
    }
  }

  obj = {
    ...data,
    key: data.id,
    title: data.name,
    children
  }

  return obj;
}

export default {
  data (){
    return {
      form: this.$form.createForm(this),
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      visible: false,
      confirmLoading: false,
      data:{
        name: "",
        position: "",
        phone: "",
        mail: "",
        belongUnit: []
      },
      treeData: [],
      id: this.$route.params.id || ""
    }
  },
  created() {
    this.getTreeData();
  },
  props: ['isAdd', 'callback', 'resCode'],
  watch: {
    checkedKeys(val) {
      console.log('onCheck', val)
    }
  },
  methods: {
    getTreeData: function(){
      this.$ajax.get(`${this.$api.testItem.getTree}/${this.id}`, {
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        },
        dataType: "JSON"
      }).then(res => {
        if(res && res.data){
          this.treeData = [getTreeData(res.data)];
        }
      })
    },
    showModal: function(data){
      if(data){
        this.data = data;
      }else{
        this.data = {
          name: "",
          position: "",
          phone: "",
          mail: "",
          belongUnit: ""
        }
      }
      this.visible = true;
    },
    cancelModal: function(){
      this.visible = false;
    },
    handleSubmit (e) {
      this.form.validateFields((err, values) => {
        if (!err) {
          let data = values,
              method = "POST";
          if(this.isAdd ===  false){
            data.id = this.data.id;
            method = "PUT";
          }
          this.confirmLoading =  true;
          this.$ajax({
            method,
            url: this.$api.testItem.addContact,
            data,
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            }
          }).then(res=>{
            if(res && res.code){
              if(res.code == "20000" || res.code == "21000" || res.code == "22000" || res.code == "23000"){
                message.success(this.resCode[res.code]);
                this.confirmLoading =  false;
                this.callback();
                this.cancelModal();
                this.form.resetFields();
              }else{
                message.error(res.msg || "操作失败");
              }
            }
          });
        }
      });
    },
    onExpand (expandedKeys) {
      console.log('onExpand', expandedKeys)
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck (checkedKeys) {
      console.log('onCheck', checkedKeys)
      this.checkedKeys = checkedKeys
    },
    onSelect (selectedKeys, info) {
      console.log('onSelect', selectedKeys)
      this.selectedKeys = selectedKeys;
      this.form.setFieldsValue({ belongUnit: info.node.title });
    }
  }
}
</script>

<style>

</style>