<template>
  <div>
    <a-table :columns="columns" :dataSource="data" bordered rowKey="id" >
      <template slot="name" slot-scope="text">
        <a href="javascript:;">{{text}}</a>
      </template>
      <template slot="title">
        Header {{ this.$store.state.count }}
      </template>
      <template slot="footer">
        Footer
      </template>
    </a-table>
    <button @click="addFun">点击</button>
  </div>
</template>
<script>
const columns = [{
  title: 'Name',
  dataIndex: 'consignUnitName'
}, {
  title: 'Cash Assets',
  dataIndex: 'sampleAcceptor',
}, {
  title: 'Address',
  dataIndex: 'consignCode',
}];

export default {
  data() {
    return {
      data: [],
      columns,
    }
  },
  created(){
    this.getData();
  },
  methods:{
    addFun(){
      this.$store.dispatch("add2");
    },
    getData(){
      var self = this;
      this.$ajax({
        method: "post",
        url: this.$api.home.test,
        data: {
          consignStatus: 10,
          page: 1,
          rows: 10,
          sort: "createDate",
          order: "desc"
        }
      })
        .then(res => {
          self.data = res.rows;
        })
        .catch(error => console.log(error, "error"));
    }
  }
}
</script>
<style>
th.column-money,
td.column-money {
  text-align: right !important;
}
</style>