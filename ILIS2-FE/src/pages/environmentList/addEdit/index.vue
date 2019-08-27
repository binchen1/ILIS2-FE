<template>
  <a-locale-provider :locale="zhCN">
  <a-form :form="form">
    <a-row>
      <a-col :span="12">
        <a-form-item :labelCol="{ span: 7 }" :wrapperCol="{ span: 17 }" label="检测室">
          <a-tree-select
              style="width: 50%"
              :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
              :treeData="treeData"
              placeholder='请选择规程'
              treeDefaultExpandAll
              @change="onChangeType"
              v-decorator="['laboratoryId', {initialValue: editData.laboratoryId } ]"
          ></a-tree-select>
          <span> {{valueRemark}} </span>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item  v-bind="formItemLayout"  label="开始使用时间" >
          <a-date-picker  @ok="timeOKChange" show-time :format="fmt" v-decorator="['beginUseTime', { initialValue: moment(formatTime(editData.beginUseTime || new Date(),fmt), fmt) }]"/>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="12">
        <a-form-item  v-bind="formItemLayout"  label="截止使用时间" >
          <a-date-picker @ok="timeOKChange" show-time :format="fmt" v-decorator="['endUseTime', {initialValue: moment(formatTime(editData.endUseTime || new Date(),fmt), fmt)}]"/>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item  v-bind="formItemLayout"  label="记录时间" >
          <a-date-picker show-time :format="fmt" v-decorator="['recordTime', {initialValue: moment(formatTime(editData.recordTime || new Date(),fmt), fmt) }]"/>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="12">
        <a-form-item  v-bind="formItemLayout"  label="温度要求(°C)" >
          <a-input-number class="inputWith" v-decorator="['minTemperature', {initialValue: editData.minTemperature } ]" />
          -
          <a-input-number class="inputWith" v-decorator="['maxTemperature',  {initialValue: editData.maxTemperature } ]" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item  v-bind="formItemLayout"  label="湿度要求(RH%)" >
          <a-input-number class="inputWith" v-decorator="['minHumidity', {initialValue: editData.minHumidity } ]" />
          -
          <a-input-number class="inputWith"  v-decorator="['maxHumidity',  {initialValue: editData.maxHumidity } ]" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="12">
        <a-form-item  v-bind="formItemLayout"  label="试验时温度(°C)" >
          <!--<a-input :disabled="isDetail" v-decorator="['standardName',-->
          <!--{initialValue: editData.standardName ,rules: [{ required: true, message: '请输入规格名称' }]}-->
        <!--]" />-->
          <a-input-number v-decorator="['temperatureWhenTest', {initialValue: editData.temperatureWhenTest,
          rules: [{ required: true, message: '请输入试验时温度' }]
          }]" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item  v-bind="formItemLayout"  label="试验时湿度(RH%)" >
          <a-input-number v-decorator="['humidityWhenTest', {initialValue: editData.humidityWhenTest,
          rules: [{ required: true, message: '请输入试验时湿度' }] }]" />
        </a-form-item>
      </a-col>
    </a-row>

    <div>
      <div class="table-header">检测室当日环境记录：<span v-if="conflict">注意：当前登记的温湿度与检测室当日记录中温湿度要求有冲突！</span></div>
      <a-table bordered :dataSource="data" rowKey="id" :columns="columns" :pagination="false">
        <template slot="temperature" slot-scope="text, record, index">
          <template  v-if="record.minTemperature  && !record.maxTemperature">
            <span v-bind:class="{active:record.conflictTemp?true:false}"> >={{record.minTemperature}} </span>
          </template>
          <template v-else-if="!record.minTemperature  && record.maxTemperature">
            <span  v-bind:class="{active:record.conflictTemp?true:false}"> <={{record.maxTemperature}} </span>
          </template>
          <template v-else-if="record.minTemperature  && record.maxTemperature">
            <span v-bind:class="{active:record.conflictTemp?true:false}">
              {{record.minTemperature}} - {{record.maxTemperature}}
            </span>
          </template>
          <template  v-else> <span v-bind:class="{active:record.conflictTemp?true:false}"> /  </span></template>
        </template>
        <template slot="humidity"  slot-scope="text, record, index">
          <template   v-if="record.minHumidity  && !record.maxHumidity">
            <span v-bind:class="{active:record.conflictHum?true:false}">
               >={{record.minHumidity}}
            </span>
          </template>
          <template  v-else-if="!record.minHumidity  && record.maxHumidity">
            <span v-bind:class="{active:record.conflictHum?true:false}">
               <={{record.maxHumidity}}
            </span>
          </template>
          <template v-else-if="record.minHumidity  && record.maxHumidity">
            <span  v-bind:class="{active:record.conflictHum?true:false}">
              {{record.minHumidity}} - {{record.maxHumidity}}
            </span>
          </template>
          <template  v-else><span v-bind:class="{active:record.conflictHum?true:false}"> / </span></template>
        </template>
      </a-table>
    </div>
  </a-form>
  </a-locale-provider>
</template>

<script>
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
  import moment from 'moment';
  import { formatTime,ajaxRequest } from '@common/utils.js';
  import Vue from 'vue';

  function formatTimeHtml(text) {
    // return text ? formatTime(text, 'YYYY-MM-DD HH:mm:ss') : '';
    return text ? formatTime(text, 'YYYY-MM-DD HH:mm:ss') : '';
  }
  const columns = [{title: '开始使用时间', dataIndex: 'beginUseTime', customRender:formatTimeHtml },
    {title: '截止使用时间', dataIndex: 'endUseTime', customRender:formatTimeHtml },
    {title: '记录时间', dataIndex: 'recordTime', customRender:formatTimeHtml },
    {title: '温度要求(°C)', dataIndex: 'temperature',scopedSlots: {customRender: 'temperature'} },
    {title: '试验时温度(°C)', dataIndex: 'temperatureWhenTest'},
    {title: '湿度要求(RH%)', dataIndex: 'humidity', scopedSlots: {customRender: 'humidity'} },
    {title: '试验时湿度(RH%)', dataIndex: 'humidityWhenTest'},
    {title: '记录人', dataIndex: 'createName' },
    {title: '任务编号', dataIndex: 'testTaskSn' },
  ];
  export default {
    name: "addEdit",
    props:['editId','callback'],
    data () {
      return {
        zhCN,
        columns,
        data: [],
        queryParams: {},
        conflict:false,
        fmt:'YYYY-MM-DD HH:mm:ss',
        standardTypeIdEdit:'',
        treeData: [],
        valueRemark:'',
        formItemLayout: {
          labelCol: {
            xs: { span: 7 },
            sm: { span: 7 },
          },
          wrapperCol: {
            xs: { span: 12 },
            sm: { span: 12 },
          },
        },
        editData:{},
      };
    },
    beforeCreate () {
      var that = this;
      this.form = this.$form.createForm(this,{
        onValuesChange (_, values) {
          if(values.laboratoryId && that.queryParams['beginUseTime']){
            that.queryParams['laboratoryId'] = values.laboratoryId;
            that.getData(that.queryParams);
          }
          if(values.temperatureWhenTest || values.humidityWhenTest){
            that.isConflict(values.temperatureWhenTest,values.humidityWhenTest);
          }
        },
      });
    },
    created(){
      if(this.editId) {
        this.getEditData();
      }else{
        this.getTreeData();
      }
    },
    methods: {
      moment,
      formatTime,
      ajaxRequest,
      getData(formData) {
        ajaxRequest(this.$api.environment.tableUrl, this.qs.stringify(formData), this.getDataCall);
      },
      getDataCall(res){
        this.data = res.rows;
        this.isConflict();
      },
      getEditData() {
        var data = {
          id: this.editId
        };
        ajaxRequest(this.$api.environment.editUrl, this.qs.stringify(data), this.getEditDataCall);
      },
      getEditDataCall(res){
        if(res.success) {
          this.editData = res.obj || {};
          const beginUseTime = formatTimeHtml(this.editData['beginUseTime']);
          const endUseTime =  formatTimeHtml(this.editData['endUseTime']);
          this.queryParams = {
            'beginUseTime': beginUseTime,
            'endUseTime': endUseTime,
            'laboratoryId': this.editData['laboratoryId']
          };
          this.getData(this.queryParams);
          this.getTreeData();
        }
      },
      getTreeData(){
        const data = {
          page:1,
          rows: 10,
        };
        ajaxRequest(this.$api.laboratory.tableUrl, this.qs.stringify(data), this.getTreeDataCall);
      },
      getTreeDataCall(res){
        if(res.rows&&res.rows.length>0){
          this.renderTreeNodes(res.rows);
          this.treeData = res.rows;
        }
      },
      renderTreeNodes(data) {
        for (let keys in data) {
          let item = data[keys];
          item.title = item.name;
          item.key = item.id;
          item.value = item.id;
          if (item.children && item.children.length) {
            this.renderTreeNodes(item.children)
          }
        }
      },
      onChangeType(value, label, extra){
        const remark = extra.triggerNode.$vnode.data.props.remark;
        this.valueRemark = remark ? `备注：${remark}` : '';
      },
      // 开始时间与结束时间比对
      timeCompare(){
        if( this.queryParams.beginUseTime || this.queryParams.endUseTime ){
          const beginUseTime2 = new Date(this.queryParams.beginUseTime).valueOf();
          const endUseTime2 = new Date(this.queryParams.endUseTime).valueOf();
          console.log('timeCompare', beginUseTime2, endUseTime2);
          if(beginUseTime2 >= endUseTime2){
            this.$message.error('开始使用时间需要小于截止使用时间');
            return false;
          }else if(endUseTime2 < beginUseTime2){
            this.$message.error('截止使用时间需要大于开始使用时间');
            return false;
          }
        }
        return true;
      },
      // 时间变化后获取数据
      timeOKChange(){
        let listV = this.form.getFieldsValue();
        const beginUseTime = listV['beginUseTime'] ? listV['beginUseTime'].format(this.fmt) : "";
        const endUseTime = listV['endUseTime'] ? listV['endUseTime'].format(this.fmt) : '';
        this.queryParams = {
          'beginUseTime': beginUseTime,
          'endUseTime': endUseTime,
          'laboratoryId': listV['laboratoryId']
        };
        if(this.timeCompare()){
          if(beginUseTime && listV['laboratoryId']){
            this.getData(this.queryParams);
          }
        }
      },
      // 时间冲突
      conflictTimeFun(beginUseTime, endUseTime){
        const newData = [...this.data];
        for (let i=0;i<newData.length;i++) {
          const item = newData[i];
          if(beginUseTime > item.beginUseTime || endUseTime < item.beginUseTime){
            item.conflictTime = true;
          }
        }
        return newData;
      },
      // 温湿度冲突
      degreeConflictFun(newData, temperatureWhenTest, humidityWhenTest){
        this.conflict = false;
        for (let i=0;i<newData.length;i++) {
          const item = newData[i];
          if(item.conflictTime){
            if(temperatureWhenTest < item.minTemperature || temperatureWhenTest > item.maxTemperature){
              Vue.set(item, 'conflictTemp', true);
              this.conflict = true;
            }else{
              Vue.set(item, 'conflictTemp', false);
            }
            if(humidityWhenTest < item.minHumidity || humidityWhenTest > item.maxHumidity){
              Vue.set(item, 'conflictHum', true);
              this.conflict = true;
            }else{
              Vue.set(item, 'conflictHum', false);
            }
          }
        }
        this.data = newData;
      },
      isConflict(temperatureWhenTest,humidityWhenTest){
        let listV = this.form.getFieldsValue();
        const beginUseTime = listV['beginUseTime'] ? new Date(listV['beginUseTime']).valueOf() : "";
        const endUseTime = listV['endUseTime'] ? new Date(listV['endUseTime']).valueOf() : '';
        const newData = this.conflictTimeFun(beginUseTime, endUseTime);

        const temperatureWhenTest2 = temperatureWhenTest ? temperatureWhenTest : listV['temperatureWhenTest'];
        const humidityWhenTest2 = humidityWhenTest ? humidityWhenTest : listV['humidityWhenTest'];
        this.degreeConflictFun(newData,temperatureWhenTest2,humidityWhenTest2);
      },
      handleSubmit () {
        var testTask =JSON.parse( localStorage.getItem("vue_testTask"));
        console.log('testTask', testTask, typeof  testTask);
        this.form.validateFields((err, fieldsValue) => {
          console.log('fieldsValue', fieldsValue);
          if (err) {
            return;
          }
          const beginUseTime = fieldsValue['beginUseTime'] ? fieldsValue['beginUseTime'].format(this.fmt) : "";
          const endUseTime = fieldsValue['endUseTime'] ? fieldsValue['endUseTime'].format(this.fmt) : '';
          const recordTime = fieldsValue['recordTime'] ? fieldsValue['recordTime'].format(this.fmt) : '';
          const data = {
            ...fieldsValue,
            'beginUseTime': beginUseTime,
            'endUseTime': endUseTime,
            'recordTime': recordTime,
            // 'testTaskId': '402882636bcf1906016bcf3c54f70062', // 必填
            'testTaskId': testTask.testTaskId, // 必填
            'testTaskSn': testTask.testTaskSn,
          };
          if(this.editId){
            data.id = this.editId;
          }
          if(this.timeCompare()) {
            console.log('data', data);
            ajaxRequest(this.$api.environment.saveUrl, this.qs.stringify(data), this.saveCall)
          }else{
            console.log('334 else')
          }
        });
      },
      saveCall(res){
        console.log('saveCall', res);
        res.success ? this.callback(res) : "";
      }
    },
  }
</script>

<style  lang="less">
  @import "./index.less";
</style>