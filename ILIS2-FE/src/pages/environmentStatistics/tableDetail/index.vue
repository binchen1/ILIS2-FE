<template>
      <div>
        <a-table bordered :dataSource="data" rowKey="id" :columns="columns" :pagination="false">
        </a-table>
      </div>
</template>

<script>
  // import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
  // import moment from 'moment';
  import { formatTime,ajaxRequest } from '@common/utils.js';

  function formatTimeHtml(text) {
    return text ? formatTime(text, 'YYYY-MM-DD HH:mm') : '';
  }
  const columns = [
    {title: '记录时间', dataIndex: 'recordTime', customRender:formatTimeHtml },
    {title: '试验时温度(°C)', dataIndex: 'temperatureWhenTest'},
    {title: '试验时湿度(RH%)', dataIndex: 'humidityWhenTest'},
    {title: '记录人', dataIndex: 'createName' },
  ];
  export default {
    name: "tableDetail",
    props:['queryParams'],
    data () {
      return {
        // zhCN,
        columns,
        data: [],
      };
    },
    methods: {
      // moment,
      formatTime,
      ajaxRequest,
      getData() {
        console.log('table', this.queryParams);
        if(this.queryParams.laboratoryId){
          ajaxRequest(this.$api.environmentStatistics.tableUrl, this.qs.stringify(this.queryParams), this.getDataCall);
        }
      },
      getDataCall(res){
        this.data = res.rows;
        console.log('getDataCall', res);
      },
    },
  }
</script>

<style  lang="less">
  @import "./index.less";
</style>