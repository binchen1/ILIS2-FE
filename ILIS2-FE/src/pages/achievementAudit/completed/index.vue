<template>
  <div>
    <div class="achievementAudit-search" style="padding-bottom:10px;">
      <a-row>
        <a-col :span="12">
          <a-input v-model="achievementName" placeholder="请输入文件名称" style="width:300px;" @pressEnter="getData" />
          <a-button @click="getData">查询</a-button>
        </a-col>
      </a-row>
    </div>
    <a-table 
      :columns="columns"
      :dataSource="data"
      bordered
      :pagination="pagination"
      :loading="loading"
      rowKey="id"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio'}"
    >
      <template slot="operation" slot-scope="text, record">
        <span>
          <a href="javascript:;" @click="viewLog(record)">日志</a>
        </span>
      </template>
    </a-table>
    <Logs ref="Logs" />
  </div>
</template>

<script>

import { message } from "ant-design-vue";
import Logs from "../auditing/components/logs";

let typeData= [
    { name: "综合检测大纲", value: "10011" },
    { name: "综合检测方案", value: "10010" },
    { name: "检测细则", value: "10086" },
    { name: "其它", value: "10000" }
  ],
  statusData = {
    audit: "审核中",
    approval: "审核通过",
    not_approve: "审核不通过"
  }

export default {
  data () {
    return {
      data: [],
      achievementName:"",
      columns: [{
        title: '单位工程',
        dataIndex: 'projectName',
        width: '15%'
      }, {
        title: '文件名称',
        dataIndex: 'achievementName',
        width: '15%'
      }, {
        title: '成果类型',
        dataIndex: 'achievementType',
        width: '10%',
        customRender: (text)=>(typeData.find(item=>item.value == text).name)
      }, {
        title: '状态',
        dataIndex: 'status',
        width: '15%',
        customRender: (text)=>(statusData[text])
      }, {
        title: '上传人员',
        dataIndex: 'createName',
        width: '15%'
      }, {
        title: '创建时间',
        dataIndex: 'createDate',
        width: '15%'
      }, {
        title: '操作',
        dataIndex: 'operation',
        width: '15%',
        scopedSlots: { customRender: 'operation' }
      }],
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
      selectedRowKeys: [],
      status: "approve",
      person: localStorage.getItem("userId")
    }
  },
  created(){
    this.getData();
  },
  components: {
    Logs
  },
  methods: {
    getData() {
      let { page, size, achievementName, person } = this;
      this.loading = true;
      this.$ajax.get(`${this.$api.testItem.auditAchieve}/${this.status}`, {
        params: {
          page,
          size,
          achievementName,
          person
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
    // 日志
    viewLog (data){
      console.log(data);
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
  },
}
</script>
