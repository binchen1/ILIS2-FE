<template>
  <a-locale-provider :locale="zhCN">
    <a-form :form="form" class="form-box">
      <a-row class="form-box-row">
        <a-col :span="12">
          <a-form-item >
            <span>检测室: &nbsp; &nbsp;</span>
            <a-tree-select
                style="width: 50%"
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                :treeData="treeData"
                placeholder='请选择规程'
                treeDefaultExpandAll
                @change="onChangeType"
            ></a-tree-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item  v-bind="formItemLayout"  label="记录时间" >
            <a-range-picker @change="timeOKChange" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-box-row select-html">
        <a-col :span="12">
          <span>{{selectHtml}}</span>
        </a-col>
      </a-row>
      <a-row class="form-box-row switch-btn">
        <a-button type="primary" @click="switchDisplay(true)">
          <a-icon type="swap" /> {{isTable?'图表查看':'表格查看'}}
        </a-button>
      </a-row>
      <TableDetail v-show="isTable" ref="tableChild" :queryParams="queryParams"  />
      <ChartDetail v-show="!isTable" ref="chartChild" :queryParams="queryParams"  />

    </a-form>

  </a-locale-provider>
</template>

<script>
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
  import TableDetail from '../tableDetail';
  import ChartDetail from '../chartDetail';
  import { formatTime,ajaxRequest } from '@common/utils.js';
  /*
  * EditableCell Code https://github.com/vueComponent/ant-design-vue/blob/master/components/table/demo/EditableCell.vue
  */

  export default {
    components: {
      TableDetail,
      ChartDetail
    },
    created(){
      this.getTreeData();
    },
    beforeCreate () {
      this.form = this.$form.createForm(this);
    },
    data () {
      return {
        zhCN,
        queryParams:{},
        treeData: [],
        fmt:'YYYY-MM-DD HH:mm:ss',
        isTable:true,
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
        selectHtml:'',
        // editData:{},
      }
    },
    methods: {
      formatTime,
      ajaxRequest,
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
      // 时间变化后获取数据
      timeOKChange(date, dateString){
        console.log('timeOKChange', date, dateString);
        this.queryParams.recordTimeBegin = dateString[0];
        this.queryParams.recordTimeEnd = dateString[1];
        console.log('timeOKChange', this.queryParams);
        this.switchDisplay();
      },

      laboratoryHtml(data){
        let  temperature = '/', humidity = '/';
        if(data.minTemperature  && !data.maxTemperature){
          temperature =`>=${data.minTemperature}`
        }
        if(!data.minTemperature  && data.maxTemperature){
          temperature =`<=${data.maxTemperature}`
        }
        if(data.minTemperature  && data.maxTemperature){
          temperature=`${data.minTemperature} - ${data.maxTemperature}`
        }
        if(data.minHumidity  && !data.maxHumidity){
          humidity=`>=${data.minHumidity}`
        }
        if(!data.minHumidity  && data.maxHumidity){
          humidity=`<=${data.maxHumidity}`
        }
        if(data.minHumidity  && data.maxHumidity){
          humidity=`${data.minHumidity} - ${data.maxHumidity}`
        }

        this.selectHtml = `温度要求(℃): ${temperature} ；湿度要求(RH%): ${humidity} ;备注：${data.remark || ''}`;
      },
      onChangeType(value, label, extra){
        const laboratoryData = extra.triggerNode.$vnode.data.props;
        this.laboratoryHtml(laboratoryData);

        this.queryParams.laboratoryId = value;
        console.log('onChangeType', this.queryParams);
        this.switchDisplay();
      },
      switchDisplay(isSwitch){
        console.log('isSwitch', isSwitch);
        if(isSwitch){
          this.isTable = !this.isTable;
        }
        if(this.isTable){
          console.log('this.$refs.tableChild',this.$refs.tableChild)
          this.$refs.tableChild.getData();
        }else{
          console.log('this.$refs.chartChild',this.$refs.chartChild)
          this.$refs.chartChild.getData();
        }
      },
      handleOkAddEditCall(){
        console.log('handleOkAddEditCall');
      },
    },
  }
</script>

<style scoped>

  .form-box-row {
    margin-left: 10px;
  }
  .select-html,.switch-btn {
    margin-bottom: 10px;
  }
</style>