<template>
  <div>
    <a-modal
      title="日志"
      v-model="visible"
      @ok="cancelModal"
      :width="600"
    >
      <a-table :columns="columns" :dataSource="data" :loading="loading" :scroll="{ y: 160 }" rowKey="id" bordered>
      </a-table>
    </a-modal>
  </div>
</template>

<script>

const columns = [{
  title: '内容',
  dataIndex: 'content',
  width: '30%',
}, {
  title: '处理意见',
  dataIndex: 'opinion',
  width: '20%',
},{
  title: '对象编号',
  dataIndex: 'sysCompanyCode',
  width: '20%',
},{
  title: '处理人',
  dataIndex: 'createName',
  width: '10%',
},{
  title: '时间',
  dataIndex: 'createDate',
  width: '20%',
}];

export default {
  data (){
    return {
      data: [],
      columns,
      loading: false,
      visible: false,
      isEdit: false
    }
  },
  methods: {
    // 获取自定义字段
    getData (id){
      this.loading = true;
      this.$ajax({
        url: `${this.$api.testItem.auditLog}/${id}`,
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
      }).then(res => {
        if(res && res.data){
          this.data = res.data;
          this.loading = false;
        }
      });
    },
    showModal: function(id){
      this.getData(id);
      this.visible = true;
    },
    cancelModal: function(){
      this.visible = false;
    }
  }
}
</script>