<template>
  <div class="appendix">
    <div class="appendix-left">
      <a-tree
        @expand="onExpand"
        :expandedKeys="expandedKeys"
        :autoExpandParent="autoExpandParent"
        @select="onSelect"
        :selectedKeys="selectedKeys"
        :treeData="treeData"
      />
    </div>
    <div class="appendix-right">
        <div class="appendix-search ">
          <a-input v-model="attachmentName" placeholder="请输入文件名称" class="appendix-search-all" />
          <a-button @click="getDataByFile">查询</a-button>
          <a-button type="primary" @click="uploadFile">上传文件</a-button>
        </div>
        <a-table :columns="columns" :dataSource="data" :loading="loading" bordered rowKey="id">
          <template slot="operation" slot-scope="text, record">
            <div class='editable-row-operations'>
                <a @click="edit(record)">编辑</a>
                <a @click="deleteRow(record)">删除</a>
            </div>
          </template>
        </a-table>
    </div>
    <UploadModal ref="UploadModal" :isAdd="isAdd" :callback="getDataByTree" :treeInfo="treeInfo" :node="node" />
  </div>
</template>

<script>

import { message } from "ant-design-vue";
import UploadModal from "./components/uploadModal";
import { setTimeout } from 'timers';
import { getQueryVariable } from "@common/utils";

const columns = [{
  title: '文件名称',
  dataIndex: 'attachmentName',
  width: '30%'
}, {
  title: '备注',
  dataIndex: 'remarks',
  width: '20%'
}, {
  title: '上传人员',
  dataIndex: 'createName',
  width: '15%'
}, {
  title: '创建时间',
  dataIndex: 'createDate',
  width: '15%'
},{
  title: '操作',
  dataIndex: 'operation',
  width: '20%',
  scopedSlots: { customRender: 'operation' }
}]

export default {
  data () {
    return {
      id: getQueryVariable("id") || "",
      expandedKeys: [],
      autoExpandParent: true,
      selectedKeys: [],
      treeData: [],
      data: [],
      columns,
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      loading: false,
      page: 1,
      size: 10,
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper:true,
        pageSizeOptions:['10', '20', '30', '40', '50'],
        onChange: (page)=> {
          this.page = page;
          this.getData();
        },
        onShowSizeChange: (page, size)=> {
          this.size = size;
          this.getData();
        }
      },
      attachmentName: "",
      rootData: "",
      type: 1,
      treeInfo: {},
      node: {},
      isAdd: true
    }
  },
  created (){
    this.requestTreeData();
  },
  components: {
    UploadModal
  },
  methods: {
    getRootData (data){
      if(data){
        this.rootData = data;
        this.getDataByTree("project", data.id);
      }
    },
    getDataByTree (type, id){

      if(this.type != 1){
        this.type == 1;
        this.page = 1;
        this.pageSize = 10;
      }

      let { page, size } = this;
      this.loading = true;
      this.$ajax.get(`${this.$api.testItem.appendixByField}/${type}/${id}`, {
        params: {
          page,
          size
        },
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        }
      }).then(res => {
        if(res && res.data){
          this.type = 1;
          this.data = res.data.rows;
          this.pagination.total = res.data.count;
          this.pagination.current = page;
          this.pagination.pageSize = size;
          this.selectedRowKeys = [];
          this.loading = false;
        }
      });
    },
    getDataByFile (){

      if(!this.attachmentName.trim()){
        return;
      }

      if(this.type != 2){
        this.type == 2;
        this.page = 1;
        this.pageSize = 10;
        this.selectedKeys = [];
      }

      let { page, size, attachmentName } = this;

      this.loading = true;
      this.$ajax.get(this.$api.testItem.appendixByFile, {
        params: {
          page,
          size,
          attachmentName: attachmentName || null
        },
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        }
      }).then(res => {
        if(res && res.data){
          this.data = res.data.rows;
          this.pagination.total = res.data.count;
          this.pagination.current = page;
          this.pagination.pageSize = size;
          this.selectedRowKeys = [];
          this.loading = false;
        }
      });
    },
    // 删除
    deleteRow (data){
      console.log("delete", data);
      this.loading = true;
      setTimeout(()=>{
        this.loading = false;
      }, 2000);      
    },
    uploadFile (){
      if(JSON.stringify(this.treeInfo) == "{}"){
        message.warn("请先选择左侧的合同段或单位工程");
        return;
      }
      this.isAdd = true;
      this.$refs.UploadModal.showModal();
    },
    requestTreeData (){
      this.$ajax.get(`${this.$api.testItem.getTree}/${this.id}`, {
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        },
        dataType: "JSON"
      }).then(res => {
        if(res && res.data){
          this.treeData = [this.getTreeData(res.data)];
          this.getRootData(this.treeData[0])
        }
      })
    },
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onSelect (selectedKeys, info) {
      console.log('onSelect', info)
      this.selectedKeys = selectedKeys

      let node = info.node.dataRef;
      this.node = node;

      if(info.selected){
        if(node.type == "contract"){
          this.treeInfo = {
            contractPartId: node.id,
            projectId: this.rootData.id
          }
        }else if(node.type == "unit"){
          this.treeInfo = {
            unitProjectId: node.id,
            projectId: this.rootData.id
          }
        }
        this.getDataByTree(node.type, node.id);
      }else{
        this.treeInfo = {};
        this.getDataByTree("project", this.rootData.id);
      }

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
        children
      }

      return obj;
    },
    edit (data){
      this.isAdd = false;
      this.$refs.UploadModal.showModal(data);
    }
  },
}
</script>

<style lang="less">
    @import "./index.less";
</style>


