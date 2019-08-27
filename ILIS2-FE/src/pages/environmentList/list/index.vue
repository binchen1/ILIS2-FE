<template>
  <div>
    <div class="table-operations">
      <a-button style="margin: 10px 0px 10px 10px;" type="primary" @click="showModalAddEdit"><a-icon type="edit" />添加</a-button>
      <a-modal :title="editId?'编辑环境记录':'新增环境记录'"
               :maskClosable="false"
               :visible="visibleRules"
               @ok="handleOkAddEdit"
               :confirmLoading="false"
               width="90%"
               height="80%"
               @cancel="()=>{ this.visibleRules = false }" >
        <AddEdit ref="addeditchild" :editId="editId"  :callback="handleOkAddEditCall" />
      </a-modal>
    </div>
    <a-locale-provider :locale="zhCN">
      <a-table bordered :dataSource="data" rowKey="id" :columns="columns" :pagination="pagination">
        <template slot="temperature" slot-scope="text, record, index">
          <template v-if="record.minTemperature  && !record.maxTemperature"> >={{record.minTemperature}} </template>
          <template v-else-if="!record.minTemperature  && record.maxTemperature"> <={{record.maxTemperature}} </template>
          <template v-else-if="record.minTemperature  && record.maxTemperature">{{record.minTemperature}} - {{record.maxTemperature}}</template>
          <template v-else> / </template>
        </template>
        <template slot="humidity"  slot-scope="text, record, index">
          <template v-if="record.minHumidity  && !record.maxHumidity"> >={{record.minHumidity}} </template>
          <template v-else-if="!record.minHumidity  && record.maxHumidity"> <={{record.maxHumidity}} </template>
          <template v-else-if="record.minHumidity  && record.maxHumidity">{{record.minHumidity}} - {{record.maxHumidity}}</template>
          <template v-else> / </template>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a @click="() => editRow(record.id)"><a-icon title="编辑" type="edit" /></a>
          <a-popconfirm
              v-if="data.length"
              title="确定要删除?"
              @confirm="() => deleteRow(record.id,record.key)">
            <a href="javascript:;"> <a-icon style="color: red"  title="删除" type="delete" /></a>
          </a-popconfirm>
        </template>
      </a-table>
    </a-locale-provider>
  </div>
</template>

<script>
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
  import AddEdit from '../addEdit';
  import { formatTime,ajaxRequest } from '@common/utils.js';
  /*
  * EditableCell Code https://github.com/vueComponent/ant-design-vue/blob/master/components/table/demo/EditableCell.vue
  */
  function formatTimeHtml(text) {
    return text ? formatTime(text, 'YYYY-MM-DD') : '';
  }
  const columns = [{title: '开始使用时间', dataIndex: 'beginUseTime', customRender:formatTimeHtml },
    {title: '截止使用时间', dataIndex: 'endUseTime', customRender:formatTimeHtml },
    {title: '记录时间', dataIndex: 'recordTime', customRender:formatTimeHtml },
    {title: '记录人', dataIndex: 'createName' },
    {title: '检测室名称', dataIndex: 'laboratoryName' },
    {title: '温度要求(°C)', dataIndex: 'temperature',scopedSlots: {customRender: 'temperature'} },
    {title: '试验时温度(°C)', dataIndex: 'temperatureWhenTest'},
    {title: '湿度要求(RH%)', dataIndex: 'humidity', scopedSlots: {customRender: 'humidity'} },
    {title: '试验时湿度(RH%)', dataIndex: 'humidityWhenTest'},
    {
      title: '操作', dataIndex: 'operation', width: 100,
      scopedSlots: {customRender: 'operation'},
    }];
  export default {
    components: {
      AddEdit,
    },
    created(){
      this.getData();
    },
    data () {
      return {
        zhCN,
        columns,
        data: [],
        visibleRules: false,
        editId:'', // 环境记录id
        pagination: {
          pageNo: 1,
          pageSize: 10, // 默认每页显示数量
          showSizeChanger: true, // 显示可改变每页数量
          pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
          // showTotal: total => `共 ${total} 页`, // 显示总数
          onShowSizeChange: (current, pageSize) => this.pageSize = pageSize, // 改变每页数量时更新显示
          onChange: (page, pageSize) => self.handleTableChange(page, pageSize),//点击页码事件
          total: 0 //总条数
        }
      }
    },
    methods: {
      formatTime,
      ajaxRequest,
      getData(pages) {
        console.log('getData', pages);
        const data = {
          page: pages || 1,
          rows: 10,
        };
        const formData = {...data};
        ajaxRequest(this.$api.environment.tableUrl, this.qs.stringify(formData), this.getDataCall);
      },
      getDataCall(res){
        console.log('getDataCall', res);
        this.data = res.rows;
        this.pagination.total = res.total;
      },
      handleTableChange(page) {
        this.getData(page)
      },
      showModalAddEdit(){
        this.visibleRules = true;
        this.editId = '';
      },
      handleOkAddEdit(){
        this.$refs.addeditchild.handleSubmit();
      },
      handleOkAddEditCall(res){
        if(res.success) {
          this.visibleRules = false;
          this.getData();
        }
      },
      editRow (did) {
        this.editId = did;
        this.visibleRules = true;
        console.log('this.editId ', this.editId);
      },
      deleteRow (did) {
        if (did) {
          ajaxRequest(this.$api.environment.delUrl, this.qs.stringify({id:did}), this.deleteRowCall);
        }
      },
      deleteRowCall(res){
        if(res.success){
          this.getData();
        }else{
          this.$message.error(res.msg);
        }
      },
    },
  }
</script>

<style scoped>

</style>