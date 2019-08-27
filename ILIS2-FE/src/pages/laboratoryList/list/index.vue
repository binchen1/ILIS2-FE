<template>
  <div>
    <a-table :columns="columns" :dataSource="data" bordered :pagination="false" rowKey="id">

      <template slot="temperature" slot-scope="text, record, index">
        <template v-if="record.editable">
          <a-input
              style="margin: -5px 0;width: 30%"
              :value="record.minTemperature"
              @change="e => handleChange(e.target.value, record.id, 'minTemperature')"
          />
          -
          <a-input
              style="margin: -5px 0;width: 30%"
              :value="record.maxTemperature"
              @change="e => handleChange(e.target.value, record.id, 'maxTemperature')"
          />
        </template>
        <template v-else-if="record.minTemperature  && !record.maxTemperature"> >={{record.minTemperature}} </template>
        <template v-else-if="!record.minTemperature  && record.maxTemperature"> <={{record.maxTemperature}} </template>
        <template v-else-if="record.minTemperature  && record.maxTemperature">{{record.minTemperature}} - {{record.maxTemperature}}</template>
        <template v-else> / </template>
    </template>
      <template slot="humidity"  slot-scope="text, record, index">
          <template v-if="record.editable">
            <a-input
                style="margin: -5px 0;width: 30%"
                :value="record.minHumidity"
                @change="e => handleChange(e.target.value, record.id, 'minHumidity')"
            />
            -
            <a-input
                style="margin: -5px 0;width: 30%"
                :value="record.maxHumidity"
                @change="e => handleChange(e.target.value, record.id, 'maxHumidity')"
            />
          </template>

          <template v-else-if="record.minHumidity  && !record.maxHumidity"> >={{record.minHumidity}} </template>
          <template v-else-if="!record.minHumidity  && record.maxHumidity"> <={{record.maxHumidity}} </template>
          <template v-else-if="record.minHumidity  && record.maxHumidity">{{record.minHumidity}} - {{record.maxHumidity}}</template>
          <template v-else> / </template>
      </template>
      <template v-for="col in ['name', 'remark']" :slot="col" slot-scope="text, record, index">
        <div :key="col">
          <a-input
              v-if="record.editable"
              style="margin: -5px 0;"
              :value="text"
              @change="e => nameRmkChange(e.target.value, record.id, col)"
          />
          <template v-else>{{text}}</template>
        </div>
      </template>
      <template slot="operation" slot-scope="text, record, index">
        <div class='editable-row-operations'>
        <span v-if="record.editable">
          <a @click="() => saveRow(record.id)"> <a-icon title="保存" type="save" /></a>
          <a-popconfirm title='确定要取消吗?' @confirm="() => cancelRow(record.id)">
            <a> <a-icon title="取消" type="close" /></a>
          </a-popconfirm>
        </span>
          <span v-else>
            <a @click="() => editRow(record.id)"><a-icon title="编辑" type="edit" /></a>
             <a-popconfirm
                 v-if="data.length"
                 title="确定要删除?"
                 @confirm="() => deleteRow(record.id,record.key)">
               <a href="javascript:;"> <a-icon style="color: red"  title="删除" type="delete" /></a>
             </a-popconfirm>
        </span>
        </div>
      </template>
    </a-table>
    <div class="add-box">
      <a @click="handleAdd">  <a-icon title="添加" type="plus-circle" /></a>
    </div>
  </div>
</template>

<script>
  import { ajaxRequest } from '@common/utils.js';
  /*
  * EditableCell Code https://github.com/vueComponent/ant-design-vue/blob/master/components/table/demo/EditableCell.vue
  */
  const columns = [{ title: '检测室名称', dataIndex: 'name', width: '20%', scopedSlots: {customRender: 'name'} },
    {title: '温度要求(°C)', dataIndex: 'temperature', width: '20%', scopedSlots: {customRender: 'temperature'} },
    {title: '湿度要求(RH%)', dataIndex: 'humidity', width: '20%', scopedSlots: {customRender: 'humidity'} },
    {title: '备注', dataIndex: 'remark', width: '20%', scopedSlots: {customRender: 'remark'} },
    {title: '操作', dataIndex: 'operation', width: '20%', scopedSlots: {customRender: 'operation'} }];

  const data = [];
  export default {
    components: {
    },
    data () {
      this.cacheData = data.map(item => ({...item}));
      return {
        data: [],
        columns
      }
    },
    created(){
      this.getData();
    },
    methods: {
      ajaxRequest,
      getData(){
        ajaxRequest(this.$api.laboratory.tableUrl, this.qs.stringify({}), this.getDataCall);
      },
      getDataCall(res){
        this.data = res.rows;
      },
      nameRmkChange (value, did, column) {
        const newData = [...this.data];
        const target = newData.filter(item => did === item.id)[0];
        if (target) {
          target[column] = value;
          this.data = newData
        }
      },
      handleChange(value, did, valueName){
        const newData = [...this.data];
        const target = newData.filter(item => did === item.id)[0];
        if (target) {
          target[valueName] = value;
          this.data = newData
        }
      },
      editRow (did) {
        const newData = [...this.data];
        const target = newData.filter(item => did === item.id)[0];
        if (target) {
          target.editable = true;
          this.data = newData
        }
      },
      deleteRow(did, key) {
        if (did) {
          ajaxRequest(this.$api.laboratory.delUrl, this.qs.stringify({id:did}), this.deleteRowCall);
        } else {
          const newData = [...this.data];
          this.data = newData.filter(item => item.key !== key)
        }
      },
      deleteRowCall(res){
        if(res.success){
          this.getData();
        }else{
          this.$message.error(res.msg);
        }
      },
      saveRow (did) {
        const newData = [...this.data];
        const target = newData.filter(item => did === item.id)[0];
         const data = {name:target.name,
           minTemperature:target.minTemperature,
           maxTemperature:target.maxTemperature,
           minHumidity:target.minHumidity,
           maxHumidity:target.maxHumidity,
           remark:target.remark
        };
        if(target.id){
          data.id = target.id;
        }
        ajaxRequest(this.$api.laboratory.saveUrl, this.qs.stringify(data), this.saveRowCall);
        // ajaxRequest(this.$api.laboratory.saveUrl, this.qs.stringify({name:3,minTemperature:1}), this.saveRowCall);
        // const newData = [...this.data];
        // const target = newData.filter(item => did === item.id)[0];
        // if (target) {
        //   delete target.editable;
        //   this.data = newData;
        //   this.cacheData = newData.map(item => ({ ...item }))
        // }
      },
      saveRowCall(res) {
        console.log('res', res);
        if(res.success){
         this.getData();
        }else{
          this.$message.error(res.msg);
        }
      },
      cancelRow (did) {
        const newData = [...this.data];
        const target = newData.filter(item => did === item.id)[0];
        if (target) {
          Object.assign(target, this.cacheData.filter(item => did === item.id)[0]);
          delete target.editable;
          this.data = newData;
        }
      },

      handleAdd () {
        const newData = {
          key: this.data.length,
          name: '',
          minTemperature: '',
          maxTemperature: '',
          minHumidity: '',
          maxHumidity: '',
          remark: '',
        };
        this.data = [...this.data, newData];
      },
    },
  }
</script>

<style lang="less">
  @import "./index.less";
</style>