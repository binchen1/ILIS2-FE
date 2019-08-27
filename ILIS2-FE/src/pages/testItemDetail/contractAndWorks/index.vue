<template>
  <div class="contractAndWorks">
    <div class="contractAndWorks-search ">
      <a-input v-model="searchText" placeholder="请输入报告编号" class="contractAndWorks-search-all" />
      <a-button @click="getData">查询</a-button>
      <a-button type="primary" @click="()=>{ this.$refs.AddContract.showModal() }">添加合同段</a-button>
      <a-button type="primary" @click="()=>{ this.$refs.AddUnit.showModal() }">添加单位工程</a-button>
      <a-button type="primary" @click="setPeople">流程人员设置</a-button>
    </div>
    <a-table 
      :columns="columns"
      :dataSource="data"
      :loading="loading"
      bordered
      :pagination="false"
      :rowSelection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
        type: 'radio'
      }"
    >
      <template v-for="col in ['name', 'type', 'programName', 'explain', 'test', 'auditor', 'issuer', 'operation']" :slot="col" slot-scope="text, record">
        <div :key="col">
          <a-input
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            @change="e => handleChange(e.target.value, record.key, col)"
          />
          <template v-else>{{text}}</template>
        </div>
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class='editable-row-operations'>
          <span>
            <a @click="()=>{
              // $refs.AddContract.showModal(record);
            }">编辑</a>
            <a @click="deleteRow(record)">删除</a>
          </span>
        </div>
      </template>
    </a-table>

    <AddContract ref="AddContract" :contractType="contractType" :callback="getData" />
    <AddUnit ref="AddUnit" :callback="getData" />
    <SetPersonnel ref="SetPersonnel" :selectedRowKeys="selectedRowKeys" :callback="getData" />
  </div>
</template>

<script>

import { message } from "ant-design-vue";
import { setTimeout } from 'timers';
import AddContract from "./components/addContract";
import AddUnit from "./components/addUnit";
import SetPersonnel from "./components/setPersonnel";
import { getQueryVariable } from "@common/utils";

const columns = [{
  title: '合同段名称',
  dataIndex: 'name',
  width: '15%'
}, {
  title: '单位工程类型',
  dataIndex: 'type',
  width: '10%'
}, {
  title: '单位工程名称',
  dataIndex: 'programName',
  width: '15%'
}, {
  title: '说明',
  dataIndex: 'description',
  width: '20%'
},{
  title: '试验人员',
  dataIndex: 'testPersons',
  width: '10%',
  customRender: (item)=>{
    return item.toString();
  }
},{
  title: '审核人员',
  dataIndex: 'auditPerson',
  width: '10%'
},{
  title: '签发人员',
  dataIndex: 'approvePerson',
  width: '10%'
},{
  title: '操作',
  dataIndex: 'operation',
  width: '10%',
  scopedSlots: { customRender: 'operation' }
}]

export default {
  data () {
    return {
      id: getQueryVariable("id"),
      data: [],
      columns,
      searchText: "",
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      loading: false,
      contractType: [
        { name: "路基", value: "001" },
        { name: "路面", value: "002" },
        { name: "交安", value: "003" },
        { name: "机电", value: "004" },
        { name: "绿化", value: "005" },
        { name: "房建", value: "006" },
        { name: "综合", value: "007" }
      ],
      selectedRowKeys: [],
      rowData: []
    }
  },
  created(){
    this.getData();
  },
  components: {
    AddContract,
    AddUnit,
    SetPersonnel
  },
  methods: {
    getData(){
      this.loading = true;
      this.$ajax({
        url: `${this.$api.testItem.contractUnit}/${this.id}`,
        params: {
          name: this.searchText
        },
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
      }).then(res => {
        if(res && res.data){
          this.data = this.formatData(res.data);
          this.loading = false;
          this.selectedRowKeys = [];
          this.rowData = [];
        }
      });
    },
    // 整理获取的数据
    formatData (data){
      if(!Array.isArray(data)){
        return;
      }
      let arr = [];
      data.map(item => {
        let obj = {
          key: item.id,
          name: item.name,
          approvePerson: item.approvePerson,
          approvePersonId: item.approvePersonId,
          auditPerson: item.auditPerson,
          auditPersonId: item.auditPersonId,
          testPersons: item.testPersons,
          testPersonIds: item.testPersonIds,
          description: item.description,
          type: item.type
        },
        children = null;

        if(item.children && item.children.length != 0){
          children = this.formatData(item.children);
        }

        obj.children = children;
        arr.push(obj);
      });

      return arr;
    },
    handleChange (value, key, column) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.data = newData
      }
    },
    // 编辑
    edit (key) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target.editable = true
        this.data = newData
      }
    },
    // 删除
    deleteRow (data){
      console.log("delete", data);
      this.loading = true;
      setTimeout(()=>{
        this.loading = false;
      }, 2000);      
    },
    onSelectChange (selectedRowKeys, row) {
      this.selectedRowKeys = selectedRowKeys
      this.rowData = row;
    },
    setPeople(){
      if(this.rowData.length == 0){
        message.warn("请先选择要设置流程人员的合同段");
        return;
      }
      this.$refs.SetPersonnel.showModal(this.rowData);
    }
  },
}
</script>

<style lang="less">
    @import "./index.less";
</style>


