<template>
  <div>
    <a-modal
      title="上报字段"
      v-model="visible"
      @ok="cancelModal"
      class="testItem-reportFieldsModal-modal"
    >
      <a-button type="primary" style="margin-bottom:10px;" @click="()=>{
          this.$refs.AddReportFields.showModal()
        }">添加</a-button>
      <a-table :columns="columns" :dataSource="data" :loading="loading" :scroll="{ y: 160 }" rowKey="id" bordered>
        <template v-for="col in ['columnName', 'columnType']" :slot="col" slot-scope="text, record">
          <div :key="col">
            <a-input
              v-if="record.editable && col!='columnType'"
              style="margin: -5px 0"
              :value="text"
              @change="e => handleChange(e.target.value, record.id, col)"
            />
            <a-select
              v-if="record.editable && col=='columnType'"
              style="margin: -5px 0"
              :value="contentType.filter(item=>item.value==text)[0].name"
              @select="e => handleChange(e, record.id, col)"
            >
              <a-select-option v-for="(item, index) in contentType" :value="item.value" :key="index">
                {{ item.name }}
              </a-select-option>
            </a-select>
            <template v-if="!record.editable">{{ col=='columnName'?text:contentType.filter(item=>item.value==text)[0].name }}</template>
          </div>
        </template>
        <template slot="operation" slot-scope="text, record">
          <div class='editable-row-operations'>
            <span v-if="record.editable">
              <a @click="() => save(record)">保存</a>
              <a-popconfirm title='确定取消吗？' @confirm="() => cancel(record.id)">
                <a>取消</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a @click="() => edit(record.id)">编辑</a>
              <a href="javascript:;" @click="deleteRow(record)">删除</a>
            </span>
          </div>
        </template>
      </a-table>
    </a-modal>

    <AddReportFields ref="AddReportFields" :contentType="contentType" :callback="getFields" />
  </div>
</template>

<script>

import { message, Modal } from "ant-design-vue";
import AddReportFields from "./addReportFields";
import { getQueryVariable } from "@common/utils";

const columns = [{
  title: '序号',
  dataIndex: 'columnIndex',
  width: '15%'
}, {
  title: '标题',
  dataIndex: 'columnName',
  width: '40%',
  scopedSlots: { customRender: 'columnName' },
}, {
  title: '内容类型',
  dataIndex: 'columnType',
  width: '20%',
  scopedSlots: { customRender: 'columnType' },
},{
  title: '操作',
  dataIndex: 'operation',
  width: '25%',
  scopedSlots: { customRender: 'operation' }
}];

export default {
  data (){
    return {
      id: getQueryVariable("id"),
      data: [],
      columns,
      loading: false,
      visible: false,
      isEdit: false
    }
  },
  created (){
    console.log(this.contentType)
  },
  components:{
    AddReportFields
  },
  props: ['contentType'],
  methods: {
    // 获取自定义字段
    getFields (){
      this.loading = true;
      this.$ajax({
        url: `${this.$api.testItem.getFields}/${this.id}`,
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
      }).then(res => {
        if(res && res.data){
          this.data = res.data;
          this.cacheData = this.data.map(item => ({...item}));
          this.loading = false;
          this.isEdit = false;
        }
      });
    },
    showModal: function(){
      this.getFields();
      this.visible = true;
    },
    cancelModal: function(){
      if(this.isEdit){
        message.warn("请先保存或取消当前正在编辑项");
        return;
      }
      this.visible = false;
    },
    handleChange (value, id, column) {
      const newData = [...this.data]
      const target = newData.filter(item => id === item.id)[0]
      if (target) {
        target[column] = value
        this.data = newData
      }
    },
    // 编辑
    edit (id) {
      const newData = [...this.data]
      const target = newData.filter(item => id === item.id)[0]
      if (target) {
        target.editable = true
        this.data = newData
        this.isEdit = true;
      }
    },
    // 保存
    save (data) {

      delete data.isDelete;
      delete data.editable;

      this.loading = true;
      this.$ajax({
        method: "PUT",
        url: this.$api.testItem.column,
        data
      }).then(res => {
        if(res && res.code){
          if(res.code === 23000){
            message.success("修改成功");
            this.getFields();
          }
        }
        this.loading = false;
      });
    },
    // 取消
    cancel (id) {
      const newData = [...this.data]
      const target = newData.filter(item => id === item.id)[0]
      if (target) {
        Object.assign(target, this.cacheData.filter(item => id === item.id)[0])
        delete target.editable
        this.data = newData
        this.isEdit = false
      }
    },
    // 删除
    deleteRow (data){
      Modal.confirm({
        title: '删除',
        content: `确认删除 ${data.columnName} 吗？`,
        okText: '确认',
        cancelText: '取消',
        onOk: ()=>{
          this.$ajax.delete(`${this.$api.testItem.column}/${data.id}`).then(res=>{
            if(res && res.code){
              if(res.code === 23000){
                message.success("删除成功");
                this.getFields();
              }else{
                message.error(res.msg || "操作失败");
              }
            }
          });
        }
      });   
    },
  }
}
</script>

<style lang="less">
  .testItem-reportFieldsModal-modal{
    .ant-modal-body {
      height: 380px;
      overflow-y: auto;
    }
  }
</style>