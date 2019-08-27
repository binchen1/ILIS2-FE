<template>
  <div class="otherAchievement">
    <div class="otherAchievement-left">
      <a-tree
        @expand="onExpand"
        :expandedKeys="expandedKeys"
        :autoExpandParent="autoExpandParent"
        @select="onSelect"
        :selectedKeys="selectedKeys"
        :treeData="treeData"
      />
    </div>
    <div class="otherAchievement-right">
      <div class="otherAchievement-search">
        <div v-if="allSearch">
          <a-form
            :form="form"
          >
            <a-form-item
              label="成果类型"
              :label-col="{ span: 2 }"
              :wrapper-col="{ span: 10 }"
            >
              <a-select
                v-decorator="[
                  'achievementTypeCode'
                ]"
                placeholder="请选择成果类型"
              >
                <a-select-option v-for="(item, index) in typeData" :key="index" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              label="状态"
              :label-col="{ span: 2 }"
              :wrapper-col="{ span: 10 }"
            >
              <a-select
                v-decorator="[
                  'status'
                ]"
                placeholder="请选择状态"
              >
                <a-select-option v-for="(item, index) in statusData" :key="index" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              label="上传人员"
              :label-col="{ span: 2 }"
              :wrapper-col="{ span: 10 }"
            >
              <a-input
                v-decorator="[
                  'auditPerson'
                ]"
                placeholder="请选择上传人员"
              />
            </a-form-item>
            <a-form-item
              label="创建日期"
              :label-col="{ span: 2 }"
              :wrapper-col="{ span: 10 }"
            >
              <a-range-picker v-decorator="[
                'stamp'
              ]" />
            </a-form-item>
            <a-form-item
              :wrapper-col="{ span: 22, offset: 2 }"
            >
              <a-button @click="search">查询</a-button>
              <a-button @click="()=>{ searchType(false) }">切换普通查询</a-button>
              <a-button @click="()=>{ this.form.resetFields() }">重置</a-button>
              <a-button type="primary" @click="uploadFile">上传成果</a-button>
            </a-form-item>
          </a-form>
        </div>
        <div v-else>
          <a-input v-model="attachmentName" placeholder="请输入成果名称" class="otherAchievement-search-all" />
          <a-button @click="search">查询</a-button>
          <a-button @click="()=>{ searchType(true) }">切换高级查询</a-button>
          <a-button type="primary" @click="uploadFile">上传成果</a-button>
        </div>
      </div>
      <template>
        <a-table :columns="columns" :dataSource="data" :loading="loading" bordered :pagination="pagination" rowKey="id">
          <template slot="achievementName" slot-scope="text, record">
            <div class='editable-row-operations'>
              <span>{{ text }}</span>
            </div>
          </template>
          <template slot="operation" slot-scope="text, record">
            <div class='editable-row-operations'>
              <span>
                <a @click="() => edit(record)">编辑</a>
                <a href="javascript:;" @click="deleteRow(record)">删除</a>
                <a @click="()=> viewLog(record)">日志</a>
              </span>
            </div>
          </template>
        </a-table>
      </template>
    </div>

    <UploadModal ref="UploadModal" :isAdd="isAdd" :callback="getDataByTree" :treeInfo="treeInfo" :node="node" />
    <Logs ref="Logs" />
  </div>
</template>

<script>

import qs from "qs";
import UploadModal from "./components/uploadModal";
import Logs from "./components/logs";
import { Modal, message } from "ant-design-vue";
import { getQueryVariable } from "@common/utils";

let typeData = [
    { name: "综合检测大纲", value: "10011" },
    { name: "综合检测方案", value: "10010" },
    { name: "检测细则", value: "10086" },
    { name: "其它", value: "10000" }
  ],
  statusData = [
    { name: "审核中", value: "audit" },
    { name: "审核通过", value: "approval" },
    { name: "审核未通过", value: "not_approve" }
  ];

const columns = [{
  title: '单位工程',
  dataIndex: 'projectName',
  width: '15%',
}, {
  title: '文件名称',
  dataIndex: 'achievementName',
  width: '15%',
  scopedSlots: { customRender: 'achievementName' }
}, {
  title: '成果类型',
  dataIndex: 'achievementType',
  width: '15%',
  customRender: (text)=>{
    return typeData.filter(item=>item.value == text)[0].name
  }
}, {
  title: '状态',
  dataIndex: 'status',
  width: '10%',
  customRender: (text)=>{
    return statusData.filter(item=>item.value == text)[0].name
  }
}, {
  title: '上传人员',
  dataIndex: 'createName',
  width: '10%'
}, {
  title: '创建时间',
  dataIndex: 'createDate',
  width: '20%',
},{
  title: '操作',
  dataIndex: 'operation',
  width: '15%',
  scopedSlots: { customRender: 'operation' }
}]

export default {
  data () {
    return {
      id: getQueryVariable("id"),
      expandedKeys: [],
      autoExpandParent: true,
      selectedKeys: [],
      isAdd: true,
      data: [],
      columns,
      attachmentName: "",
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      allSearch: false,
      loading: false,
      page: 1,
      size: 10,
      contractPartId: "",
      unitProjectId: "",
      typeData,
      statusData,
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper:true,
        pageSizeOptions:['10', '20', '30', '40', '50'],
        onChange: (page)=> {
          this.page = page;
          if (this.type == 1){
            this.getDataByTree();
          }else {
            this.getDataByFile();
          }
        },
        onShowSizeChange: (page, size)=> {
          this.size = size;
          if (this.type == 1){
            this.getDataByTree();
          }else {
            this.getDataByFile();
          }
        }
      },
      attachmentName: "",
      rootData: "",
      type: 1,
      treeInfo: {},
      node: {},
      treeData: [],
      params: {}
    }
  },
  created(){
    this.requestTreeData();    
  },
  components: {
    UploadModal,
    Logs
  },
  methods: {
    getRootData (data){
      if(data){
        this.rootData = data;
        this.params = {
          type: "project",
          id: data.id
        }
        this.getDataByTree();
      }
    },
    getDataByTree (){

      let { type, id } = this.params;

      if(this.type != 1){
        this.type == 1;
        this.page = 1;
        this.pageSize = 10;
      }

      let { page, size } = this;
      this.loading = true;
      this.$ajax.get(`${this.$api.testItem.achievement}/${type}/${id}`, {
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
    getDataByFile (data = {}){

      if(!this.attachmentName.trim()){
        return;
      }

      if(this.type != 2){
        this.type == 2;
        this.page = 1;
        this.pageSize = 10;
        this.selectedKeys = [];
      }

      let { page, size, id, contractPartId, unitProjectId, attachmentName } = this;

      this.loading = true;
      this.$ajax.get(`${this.$api.testItem.achievementList}/${id}`, {
        params: {
          page,
          size,
          attachmentName: attachmentName || null,
          ...data
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
    // 搜索
    search: function(e){
      e.preventDefault();
      let data = {};
      if(this.allSearch){
        this.form.validateFields((err, values) => {
          if (!err) {
            let stamp = [];
            if(values.stamp && Array.isArray(values.stamp)){
              stamp = values.stamp.map(item => {
                return new Date(item.format('YYYY-MM-DD')).getTime()
              });
            }
            data = {
              ...values,
              stamp: stamp.toString()
            }
          }
        });
      }else{
        data.text = this.attachmentName
      }
      
      this.getDataByFile(data);

      console.log("查询数据", data);
    },
    // 切换搜索类型
    searchType: function(bool){
      this.allSearch = bool;
    },
    // 删除
    deleteRow (data){

      Modal.confirm({
        title: '删除',
        content: `确认删除这条数据吗？`,
        okText: '确认',
        cancelText: '取消',
        onOk: ()=>{
          this.loading = true;
          this.$ajax.delete(`${this.$api.testItem.achievement}/${data.id}`).then(res=>{
            if(res && res.code){
              if(res.code == "20000" || res.code == "21000" || res.code == "22000" || res.code == "23000"){
                message.success("操作成功");
                if(this.type == 1){
                  this.getDataByTree()
                }else if(this.type == 2){
                  this.getDataByFile();
                }
              }else{
                message.error(res.msg || "操作失败");
              }
              this.loading = false;
            }
          });
        }
      });
    },
    // 查看日志
    viewLog (data){
      this.$refs.Logs.showModal(data.id);
    },
    // 编辑
    edit (data){
      this.isAdd = false;
      this.$refs.UploadModal.showModal(data);
    },
    uploadFile (){
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
        this.params = {
          type: node.type,
          id: node.id
        }
        this.getDataByTree();
      }else{
        this.treeInfo = {};
        this.params = {
          type: "project",
          id: "this.rootData.id"
        }
        this.getDataByTree();
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
  }
}
</script>

<style lang="less">
    @import "./index.less";
</style>


