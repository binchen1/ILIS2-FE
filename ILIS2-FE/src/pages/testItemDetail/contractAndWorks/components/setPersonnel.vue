<template>
  <div>
    <a-modal
      title="流程人员设置"
      v-model="visible"
      :confirmLoading="confirmLoading"
      @ok="handleSubmit"
      class="testItem-setPersonnel-modal"
    >
      <a-form :form="form">
        <a-form-item
            label="设置工程"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 19 }"
        >
          <a-input
            v-decorator="[
              'unitName',
              { initialValue: data.name }
            ]"
            class="testItem-setPersonnel-modal-input"
            :disabled="true"
          />
        </a-form-item>
        <a-form-item
            label="负责人"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 19 }"
        >
          <a-tree-select
            :treeData="treeData"
            @change="onChange"
            dropdownClassName="testItem-setPersonnel-modal-tree"
            :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
            :allowClear="true"
            :showCheckedStrategy="SHOW_PARENT"
            searchPlaceholder='请选择负责人'
            v-decorator="[
              'principalPersonId',
              { initialValue: data.principalPersonId }
            ]"
          />
        </a-form-item>
        <a-form-item
            label="试验人员"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 19 }"
        >
          <a-tree-select
            :treeData="treeData"
            @change="onChange"
            treeCheckable
            :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
            dropdownClassName="testItem-setPersonnel-modal-tree"
            :showCheckedStrategy="SHOW_PARENT"
            searchPlaceholder='请选择试验人员'
            v-decorator="[
              'testPersonIds',
              { initialValue: data.testPersonIds }
            ]"
          />
        </a-form-item>
        <a-form-item
            label="审核人员"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 19 }"
        >
          <a-tree-select
            :treeData="treeData"
            @change="onChange"
            :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
            dropdownClassName="testItem-setPersonnel-modal-tree"
            :showCheckedStrategy="SHOW_PARENT"
            searchPlaceholder='请选择审核人员'
            v-decorator="[
              'auditPersonId',
              { initialValue: data.auditPersonId }
            ]"
          />
        </a-form-item>
        <a-form-item
            label="签发人员"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 19 }"
        >
          <a-tree-select
            :treeData="treeData"
            @change="onChange"
            :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
            dropdownClassName="testItem-setPersonnel-modal-tree"
            :showCheckedStrategy="SHOW_PARENT"
            searchPlaceholder='请选择签发人员'
            v-decorator="[
              'approvePersonId',
              { initialValue: data.approvePersonId }
            ]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>

import { setTimeout } from 'timers';
import { TreeSelect, message } from 'ant-design-vue'
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

export default {
  data (){
    return {
      form: this.$form.createForm(this),
      visible: false,
      confirmLoading: false,
      treeData: [],
      SHOW_PARENT,
      nameData: [],
      data: {}
    }
  },
  created (){
    this.getPersonData();
  },
  props: ['selectedRowKeys', 'callback'],
  methods: {
    getPersonData: function(){
      this.$ajax({
          url: this.$api.common.getPersonsForChoose,
          method: "POST",
          headers:{
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          }
      }).then(res => {
        if(res && res.rows){
          this.treeData = this.getTree(res.rows);
          this.nameData = this.getName(this.treeData);
        }
      });
    },
    // 整理数据
    getTree(data){
      if(!Array.isArray(data)){
        return;
      }
      let arr = [];
      for(let i=0;i<data.length;i++){
        let children = [];
        if(data[i].children && data[i].children.length != 0){
          children = this.getTree(data[i].children);
        }
        arr.push({
          ...data[i],
          value: data[i].id,
          title: data[i].name,
          key: data[i].id,
          children
        })
      }
      return arr;
    },
    getName (data){
      if(!Array.isArray(data)){
        return;
      }
      let arr = [];
      for(let i=0;i<data.length;i++){
        let arr2 = [];
        if(data[i].children && data[i].children.length != 0){
          arr2 = this.getName(data[i].children);
          arr = arr.concat(arr2);
        }
        arr.push({
          value: data[i].id,
          name: data[i].name
        })
      }
      return arr;
    },
    onChange (value, data1, data2) {
      console.log('onChange ', value)
      console.log(data1);
      console.log(data2);
      this.value = value
    },
    showModal: function(data){
      this.visible = true;
      this.data = data[0];
      console.log(this.data);

    },
    cancelModal: function(){
      this.visible = false;
    },
    handleSubmit (e) {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading =  true;

          console.log('提交数据:', values);

          let data = {
            person: []
          };

          if(this.data.type == "contract") {
            data.contractPartId = this.data.key;
          }else if(this.data.type == "unit") {
            data.unitProjectId = this.data.key;
          }

          for(let key in values){
            if(values[key]){
              switch (key){
                case "principalPersonId":
                  data.person.push({
                    personId: values[key],
                    personName: this.nameData.filter(item=>item.value == values[key])[0].name,
                    personType: 100
                  })
                  break;
                case "auditPersonId":
                  data.person.push({
                    personId: values[key],
                    personName: this.nameData.filter(item=>item.value == values[key])[0].name,
                    personType: 111
                  })
                  break;
                case "approvePersonId":
                  data.person.push({
                    personId: values[key],
                    personName: this.nameData.filter(item=>item.value == values[key])[0].name,
                    personType: 112
                  })
                  break;
                case "testPersonIds":
                  let _testPersonIds = values[key] || [];
                  _testPersonIds.map(testPersonId => {
                    data.person.push({
                      personId: testPersonId,
                      personName: this.nameData.filter(item=>item.value == testPersonId)[0].name,
                      personType: 110
                    });
                  });
                  break;
              }
            }
          }

          this.$ajax({
            method: "POST",
            url: this.$api.testItem.setCUPerson,
            data,
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            }
          }).then(res => {
            this.confirmLoading =  false;
            if(res && res.code){
              if(res.code === 21000){
                message.success("操作成功");
                this.callback();
                this.cancelModal();
                this.form.resetFields();
              }else{
                message.success("操作失败");
              }
            }
          },(err)=>{
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