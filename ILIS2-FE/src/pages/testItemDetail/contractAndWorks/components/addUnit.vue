<template>
  <div>
    <a-modal
      title="新增单位工程"
      v-model="visible"
      :confirmLoading="confirmLoading"
      @ok="handleSubmit"
    >
      <a-form :form="form">
        <a-form-item
          label="所属合同段"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 15 }"
        >
          <a-tree-select
            v-decorator="[
              'contractPartId'
            ]"
            placeholder="请选择所属合同段"
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="treeData"
            :showCheckedStrategy="SHOW_PARENT"
            @change="onChange"
          />
        </a-form-item>
        <a-form-item
            label="单位工程类型"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 15 }"
        >
          <a-select
            v-decorator="[
              'unitProjectType'
            ]"
            placeholder="请选择单位工程类型"
          >
            <a-select-option v-for="(value, index) in unitData" :key="index" :value="value">
              {{ value }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
            label="单位工程名称"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 15 }"
        >
          <a-input
            v-decorator="[
              'unitProjectName'
            ]"
            placeholder="请输入单位工程名称"
          />
        </a-form-item>
        <a-form-item
            label="说明"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 15 }"
        >
          <a-textarea
            v-decorator="[
              'description'
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

import { TreeSelect, message } from 'ant-design-vue'
import { setTimeout } from 'timers';
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
import { getQueryVariable } from "@common/utils";

export default {
  data (){
    return {
      id: getQueryVariable("id"),
      form: this.$form.createForm(this),
      visible: false,
      confirmLoading: false,
      unitData: [
        "路基工程",
        "路面工程",
        "桥梁工程",
        '隧道工程',
        '绿化工程',
        '声屏障工程',
        '交通安全设施',
        '交通机电工程',
        "附属设施",
        "(JTG F80/1-2004)环保工程",
        "(JTG F80/1-2004)互通立交工程",
        "(特大斜拉桥、特大悬索桥)塔及辅助、过渡墩",
        "(特大斜拉桥、特大悬索桥)锚碇",
        "(特大斜拉桥、特大悬索桥)上部钢结构制作与防护",
        "(特大斜拉桥、特大悬索桥)上部结构浇筑与安装",
        "(特大斜拉桥、特大悬索桥)桥面系、附属工程及桥梁总体",
        "其它"
      ],
      treeData: [],
      SHOW_PARENT
    }
  },
  props: ['callback'],
  watch: {
    checkedKeys(val) {
      console.log('onCheck', val)
    }
  },
  methods: {
    showModal: function(){
      this.visible = true;
      this.getTree();
    },
    cancelModal: function(){
      this.visible = false;
    },
    getTree (){
      this.$ajax.get(`${this.$api.testItem.getTree}/${this.id}`, {
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        },
        dataType: "JSON"
      }).then(res => {
        if(res && res.data){
          let data = res.data;
          data.children = data.children.filter(item=>(item.type == "contract"));
          this.treeData = [this.getTreeData(data)];
        }
      })
    },
    getTreeData (data){
      let obj = {},
          children = [];

      if(data.hasOwnProperty("children")){
        for(let i=0;i<data.children.length;i++){
          children.push(this.getTreeData(data.children[i]));
        }
      }

      obj = {
        ...data,
        key: data.id,
        title: data.name,
        value: data.id,
        children,
        disabled: data.type === "unit" 
      }

      return obj;
    },
    onChange (value) {
      this.value = value
    },
    handleSubmit (e) {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading =  true;

          let data = { ...values };
          if(data.contractPartId === this.treeData[0].id){
            data.projectId = this.id;
          }else {
            data.projectId = "";
          }

          this.$ajax({
            method: "POST",
            url: `${this.$api.testItem.unit}`,
            data,
            headers: {
                "X-Requested-With": "XMLHttpRequest"
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