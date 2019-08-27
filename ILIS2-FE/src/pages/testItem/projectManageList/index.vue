<template>
    <div class="projectManageList">
        <div class="projectManageList-search">
            <a-input v-model="projectName" placeholder="请输入项目名称" />
            <a-button @click="getData">查询</a-button>
        </div>
        <div class="projectManageList-btn">
            <a-button @click="showModal">新增</a-button>
            <a-button @click="deleteData">删除</a-button>
            <a-button @click="closeServer">结束服务</a-button>
        </div>
        <a-table :rowSelection="rowSelection" :columns="columns" :dataSource="data" bordered :pagination="pagination" :loading="loading" rowKey="id">
            <template slot="percent" slot-scope="text">
                <div class="projectManageList-percent">
                  <div :class="`projectManageList-percent-bar ${text==100?'active':''}`" :style="`width:${text}%`"></div>
                </div>
                <span style="vertical-align: middle;" v-if="(text||0) < 100">{{ (text||0) + '%' }}</span>
                <span style="vertical-align: middle;" v-else><a-icon type="check-circle" /></span>
            </template>
            <template slot="operation" slot-scope="text, record">
                <span>
                    <a @click="() => editModal(record)" v-if="record.isCompleted!=1">编辑</a>
                    <a @click="openTab(record)">打开</a>
                </span>
            </template>
        </a-table>
        <AddModal ref="AddModal" :isAdd="isAdd" :callback="getData" />
    </div>
</template>

<script>

import qs from "qs";
import { message, Modal } from 'ant-design-vue';
import AddModal from './components/addModal';

const columns = [{
  title: '名称',
  dataIndex: 'name',
  width: '20%'
}, {
  title: '状态',
  dataIndex: 'isCompleted',
  width: '35%',
  customRender: function(text){
    return text == 1 ? '已结束':'检测中';
  }
}, {
  title: '创建人',
  dataIndex: 'createName',
  width: '15%'
}, {
  title: '进度',
  dataIndex: 'percent',
  width: '15%',
  scopedSlots: { customRender: 'percent' }
}, {
  title: '操作',
  dataIndex: 'operation',
  width: '15%',
  scopedSlots: { customRender: 'operation' }
}]

export default {
  data () {
    return {
      data: [],
      columns,
      selectedRowKeys: [],
      selectedRows: [],
      isAdd: true,
      page: 1,
      size: 10,
      projectName: "",
      loading: false,
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
  components:{
    AddModal
  },
  computed: {
    rowSelection() {
      return {
        type: "radio",
        hideDefaultSelections: false,
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys;
          this.selectedRows = selectedRows;
        }
      }
    }
  },
  methods: {
    getData() {
      let { page, size, projectName } = this;
      this.loading = true;
      this.$ajax.get(this.$api.testItem.list, {
        params: {
          page,
          size,
          projectName
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
          this.loading = false;
        }
      });
    },
    // 新增弹窗
    showModal (){
      this.isAdd = true;
      this.$refs.AddModal.showModal();
    },
    // 编辑弹窗
    editModal (data){
      this.isAdd = false;
      this.$refs.AddModal.showModal(data);
    },
    // 删除
    deleteData (){

      if(this.selectedRows.length == 0){
        message.warn("请选择需要删除的项目");
        return;
      }

      Modal.confirm({
        title: '删除',
        content: `确认删除 ${this.selectedRows[0].name} 吗？`,
        okText: '确认',
        cancelText: '取消',
        onOk: ()=>{
          this.$ajax.post(this.$api.testItem.deleteProject, qs.stringify({ id:this.selectedRowKeys[0] })).then(res=>{
            if(res && res.success){
              message.success(res.msg);
              this.selectedRowKeys = [];
              this.getData();
            }else{
              message.error(res.msg);
            }
          });
        }
      });
    },
    // 结束服务
    closeServer (){
      if(this.selectedRows.length == 0){
        message.warn("请选择需要结束服务的项目");
        return;
      }

      if(this.selectedRows[0].isCompleted === 1){
        message.warn("当前项目已结束服务");
        return;
      }

      Modal.confirm({
        title: '结束服务',
        content: `确认结束 ${this.selectedRows[0].name} 服务吗？`,
        okText: '确认',
        cancelText: '取消',
        onOk: ()=>{
          let data = this.selectedRows[0];
          data.isCompleted = 1;

          this.$ajax.post(this.$api.testItem.updateProject, qs.stringify(data)).then(res=>{
              if(res && res.success){
                message.success("操作成功!");
                this.getData();
              }else{
                message.error(res.msg);
              }
          })
        }
      });
    },
    openTab (data){
      top.addTabs && top.addTabs({
        "id": data.id,
        "title": "项目检测详情",
        "close": false,
        "url": `itemController.do?goTab&id=${data.id}&status=${data.isCompleted||0}`
      })
    }
  },
}
</script>

<style lang="less">
    @import "./index.less";
</style>


