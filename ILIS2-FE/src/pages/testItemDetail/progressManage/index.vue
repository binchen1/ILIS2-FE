<template>
  <div class="contacts">
    <div class="contacts-search ">
      <a-input v-model="searchText" placeholder="请输入工程名称" class="contacts-search-all" />
      <a-button @click="getFields">查询</a-button>
      <a-button type="primary" @click="()=>{ this.$refs.ReportFiledsModal.showModal() }">设置上报字段</a-button>
    </div>
    <a-table :columns="columns" :dataSource="data" :loading="loading" bordered>
      <template slot="operation" slot-scope="text, record">
        <a @click="updateProgress(record)">更新进度</a>
        <a @click="viewDetail(record)">查看详情</a>
      </template>
    </a-table>
    <ReportFiledsModal ref="ReportFiledsModal" :contentType="contentType" />
    <UpdateProgressModal ref="UpdateProgressModal" :fieldsData="fieldsData" :callback="getFields" />
    <DetailModal ref="DetailModal" :fieldsData="fieldsData" :contentType="contentType" />
  </div>
</template>

<script>

import { setTimeout } from 'timers';
import ReportFiledsModal from "./components/reportFiledsModal";
import UpdateProgressModal from "./components/updateProgressModal";
import DetailModal from "./components/detailModal";
import { getQueryVariable } from "@common/utils";

export default {
  data () {
    return {
      id: getQueryVariable("id"),
      data: [],
      fieldsData: [],
      searchText: "",
      loading: true,
      columns: [{
        title: '工程名称',
        dataIndex: 'name',
        key: 'name'
      }, {
        title: '进度比例',
        dataIndex: 'rateOfProgress',
        key: 'rateOfProgress',
        customRender: (text, record)=>(`${text||0}% (+${record.rateIncrease||0})`)
      },{
        title: '最近更新人员',
        dataIndex: 'createName',
      }, {
        title: '最近更新时间',
        dataIndex: 'updateDate',
        key: 'updateDate'
      }, {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        scopedSlots: { customRender: 'operation' }
      }],
      contentType:[
        { name: "数字", value: "1" },
        { name: "文本", value: "2" },
        { name: "是/否", value: "3" }
      ],
      loading: false
    }
  },
  created(){
    this.getFields();
  },
  components: {
    ReportFiledsModal,
    UpdateProgressModal,
    DetailModal
  },
  methods: {
    // 获取自定义字段
    getFields (){
      this.$ajax({
        url: `${this.$api.testItem.getFields}/${this.id}`,
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
      }).then(res => {
        if(res && res.data){
          this.fieldsData = res.data;
          this.getData();
        }
      });
    },
    getData (){
      this.loading = true;
      this.$ajax({
        method: "get",
        url: `${this.$api.testItem.progressList}/${this.id}`,
        params:{
          name: this.searchText || null
        },
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
      }).then(res => {
        if(res && res.data){
          this.columns = this.columns.filter(item=>!item._isCustom);
          this.columns.splice(2, 0, ...this.fieldsData.map(item=>({
            title: item.isDelete == "0"? item.columnName:`${item.columnName}(已删除)`,
            key: item.id,
            dataIndex: item.id,
            _isCustom: true,
            columnType: item.columnType
          })));
          this.data = this.formatData(res.data);
          this.loading = false;
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
          createName: item.progressInfo.createName,
          updateDate: item.progressInfo.updateDate,
          rateIncrease: item.progressInfo.rateIncrease,
          rateOfProgress: item.progressInfo.rateOfProgress,
          attachment: item.progressInfo.attachment || {},
          type: item.type
        },
        children = null;

        if(item.progressInfo.keyValueList && item.progressInfo.keyValueList.length != 0){
          item.progressInfo.keyValueList.map(field => {
            obj[field.customColumnId] = field.customColumnValue
          })
        }

        if(item.children && item.children.length != 0){
          children = this.formatData(item.children);
        }

        obj.children = children;
        arr.push(obj);
      });

      return arr;
    },
    // 更新进度
    updateProgress: function(data){
      this.$refs.UpdateProgressModal.showModal(data)
    },
    viewDetail: function(data){
      this.$refs.DetailModal.showModal(data);
    }
  },
}
</script>

<style lang="less">
    @import "./index.less";
</style>