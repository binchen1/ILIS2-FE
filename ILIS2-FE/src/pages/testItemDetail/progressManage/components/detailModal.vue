<template>
  <div>
    <a-modal
      title="详情"
      v-model="visible"
      @ok="cancelModal"
      width="90%"
    >
      <div style="font-size:16px;font-weight:bold;margin-bottom:15px;">{{ apiData.title }}</div>
      <a-table :columns="columns" :dataSource="data" :pagination="pagination" :loading="loading" :scroll="{ y: 300 }" />
    </a-modal>
  </div>
</template>

<script>

import { setTimeout } from 'timers';

export default {
  data (){
    return {
      data: [],
      apiData:{},
      loading: false,
      visible: false,
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
        title: '上报人员',
        dataIndex: 'createName',
      }, {
        title: '查看附件',
        dataIndex: 'attachment',
        key: 'attachment',
        customRender: (item)=>(item?item.attachmentName:"")
      }, {
        title: '上报时间',
        dataIndex: 'updateDate',
        key: 'updateDate'
      }]
    }
  },
  props: ['fieldsData', 'contentType'],
  methods: {
    getData (type, id){
      this.loading = true;

      let { page, size } = this;

      this.$ajax({
        url: `${this.$api.testItem.progressDetail}/${this.apiData.type}/${this.apiData.id}`,
        params: {
          page,
          size
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

          this.pagination.total = res.data.count;
          this.pagination.current = page;
          this.pagination.pageSize = size;
          this.loading = false;
          this.data = res.data.rows;
        }
      });
    },
    showModal: function(data){
      this.visible = true;
      this.apiData = {
        type: data.type,
        id: data.key,
        title: data.name
      }
      this.getData();
    },
    cancelModal: function(){
      this.visible = false;
    }
  }
}
</script>

<style lang="less">

</style>