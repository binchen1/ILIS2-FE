<template>
  <div class="otherAchievement">
    <div class="otherAchievement-left">
      <TreeComponent :treeSelect="treeSelect" />
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
              <a-button type="primary" @click="()=> {
                this.isAdd = true;
                this.$refs.UploadModal.showModal();
              }">上传成果</a-button>
            </a-form-item>
          </a-form>
        </div>
        <div v-else>
          <a-input v-model="searchText" placeholder="请输入成果名称" class="otherAchievement-search-all" />
          <a-button @click="search">查询</a-button>
          <a-button @click="()=>{ searchType(true) }">切换高级查询</a-button>
          <a-button type="primary" @click="()=> {
            this.isAdd = true;
            this.$refs.UploadModal.showModal();
          }">上传成果</a-button>
        </div>
      </div>
      <template>
        <a-table :columns="columns" :dataSource="data" :loading="loading" bordered :pagination="pagination">
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

    <a-modal
      title="查看日志"
      v-model="logVisible"
      @ok="()=> this.logVisible = false"
    >
      <div>
        <ul>
          <li v-for="(item, index) in logData" :key="index">
            {{ item }}
          </li>
        </ul>
      </div>
    </a-modal>
    <UploadModal ref="UploadModal" :callback="getData" :isAdd="isAdd" />
  </div>
</template>

<script>

import qs from "qs";
import TreeComponent from "../testReport/components/tree";
import UploadModal from "./components/uploadModal";
import { Modal, message } from "ant-design-vue";
import { setTimeout } from 'timers';

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
  dataIndex: 'program',
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
      id: this.$route.params.id,
      isAdd: true,
      data: [],
      columns,
      searchText: "",
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      allSearch: false,
      loading: false,
      logData: [],
      logVisible: false,
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
          this.getData();
        },
        onShowSizeChange: (page, size)=> {
          this.size = size;
          this.getData();
        }
      }
    }
  },
  created(){
    this.getData();    
  },
  components: {
    TreeComponent,
    UploadModal
  },
  methods: {
    getData: function(data = {}){
      let { page, size, id, contractPartId, unitProjectId } = this;
      this.loading = true;

      this.$ajax.get(this.$api.testItem.achievementList, {
        params: {
          page,
          size,
          projectId: id,
          contractPartId,
          unitProjectId,
          ...data
        }
      }).then(res => {
        if(res && res.data){
          this.data = res.data.rows;
          this.pagination.total = res.data.count;
          this.pagination.current = page;
          this.pagination.pageSize = size; 
        }
        this.loading = false;
      }, error=>{
        this.loading = false;
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
        data.text = this.searchText
      }
      
      this.getData(data);

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
                this.getData();
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

      console.log(data);

      this.logVisible = true;

      let logData = [1, 2, 3, 4, 5];
      this.logData = logData;
    },
    // 编辑
    edit (data){
      this.isAdd = false;
      this.$refs.UploadModal.showModal(data);
    },
    treeSelect (data, info){
      let type = info.node.dataRef.type;

      this.unitProjectId = "";
      this.contractPartId = "";

      if(data.length == 0){
        this.getData();
        return;
      }

      if(type){
        if(type === "unit"){
          this.unitProjectId = data[0];
        }else if(type === "contract"){
          this.contractPartId = data[0];
        }
      }
      this.getData();

    }
  },
}
</script>

<style lang="less">
    @import "./index.less";
</style>


