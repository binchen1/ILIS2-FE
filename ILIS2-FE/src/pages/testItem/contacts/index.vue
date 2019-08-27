<template>
  <div class="contacts">
    <div class="contacts-search ">
      <a-input v-model="searchText" placeholder="请输入联系人姓名" class="contacts-search-all" />
      <a-button @click="getData">查询</a-button>
      <a-button type="primary" @click="()=>{
        this.isAdd = true;
        this.$refs.CreateContact.showModal()  
      }">新建</a-button>
    </div>
    <a-table :columns="columns" :dataSource="data" :loading="loading" bordered :pagination="pagination" rowKey="id">
      <template slot="operation" slot-scope="text, record">
        <div class='editable-row-operations'>
          <span>
            <a href="javascript:;" @click="edit(record)">编辑</a>
            <a href="javascript:;" @click="deleteRow(record)">删除</a>
          </span>
        </div>
      </template>
    </a-table>
    <CreateContact ref="CreateContact" :isAdd="isAdd" :callback="getData" :resCode="resCode" />
  </div>
</template>

<script>

import { Modal, message } from "ant-design-vue";
import { setTimeout } from 'timers';
import CreateContact from "./components/createContact";

const columns = [{
  title: '姓名',
  dataIndex: 'name',
  width: '20%'
}, {
  title: '所属单位',
  dataIndex: 'belongUnit',
  width: '20%'
}, {
  title: '职位',
  dataIndex: 'position',
  width: '15%'
}, {
  title: '电话',
  dataIndex: 'phone',
  width: '15%'
},{
  title: '邮箱',
  dataIndex: 'mail',
  width: '20%'
},{
  title: '操作',
  dataIndex: 'operation',
  width: '10%',
  scopedSlots: { customRender: 'operation' }
}]

export default {
  data () {
    return {
      data: [],
      columns,
      searchText: "",
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      loading: false,
      page: 1,
      size: 10,
      isAdd: true,
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
      resCode: {
        "20000": "请求成功",
        "20010": "请求失败",
        "21000": "新增成功",
        "22000": "修改成功",
        "23000": "删除成功"
      }
    }
  },
  created(){
    this.getData();
  },
  components: {
    CreateContact
  },
  methods: {
    getData: function(){
      let { page, size, searchText } = this;
      this.loading = true;
      this.$ajax.get(this.$api.testItem.contactList, {
        params: {
          page,
          size,
          person: searchText
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
    // 搜索
    search: function(e){
      let data = this.searchText;
      console.log("查询数据", data);
    },
    // 编辑
    edit (data) {
      this.isAdd = false;
      this.$refs.CreateContact.showModal(data);
    },
    // 删除
    deleteRow (data){
      Modal.confirm({
        title: '删除',
        content: `确认删除 ${data.name} 吗？`,
        okText: '确认',
        cancelText: '取消',
        onOk: ()=>{
          this.$ajax.delete(`${this.$api.testItem.addContact}/${data.id}`).then(res=>{
            if(res && res.code){
              if(res.code == "20000" || res.code == "21000" || res.code == "22000" || res.code == "23000"){
                message.success(this.resCode[res.code]);
                this.getData();
              }else{
                message.error(res.msg || "操作失败");
              }
            }
          });
        }
      });
    }
  },
}
</script>

<style lang="less">
    @import "./index.less";
</style>