<template>
  <div>
    <div id="tempChart" :style="{width: '100%', height: '300px'}"></div>
    <div id="humChart" :style="{width: '100%', height: '300px'}"></div>
  </div>
</template>

<script>
  // import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
  // import moment from 'echarts';
  import { formatTime,ajaxRequest } from '@common/utils.js';

  export default {
    name: "chartDetail",
    props:['queryParams'],
    mounted(){
      // this.drawLine();
      console.log('mounted')
    },
    data () {
      return {
        option:{
          title: {
            text: '',
            x:'center'
          },
          xAxis: {
            type: 'category',
            data: []
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: [],
            type: 'line'
          }]
        },
      };
    },
    methods: {
      ajaxRequest,
      formatTime,
      getData() {
        console.log('chasr', this.queryParams);
        if (this.queryParams.laboratoryId) {
          ajaxRequest(this.$api.environmentStatistics.chartUrl, this.qs.stringify(this.queryParams), this.getDataCall);
        }
      },
      getDataCall(res) {
        console.log('getDataCall', res);
        if(res.obj && res.obj.length>0){
          for(let i=0;i<res.obj.length;i++){
            this.drawLine(res.obj[i])
          }
        }

      },
      drawLine(resData){
        console.log('optionsData', resData);
        let arrY=[],arrX=[];
        let option = {...this.option};
        option.title.text=resData.dataTitle;
        for(let i=0;i<resData.data.length;i++){
          arrY.push(resData.data[i].chartDataValue);
          arrX.push(formatTime(resData.data[i].chartDataKey, 'YYYY-MM-DD HH:mm:ss'));
        }
        option.series[0].data = arrY;
        option.xAxis.data = arrX;
        let chartEle = 'tempChart';
        if(resData.dataTitle.indexOf('湿度')>-1){
          chartEle='humChart'
        }
        let tempChart = this.$echarts.init(document.getElementById(chartEle));
        // 绘制图表
        tempChart.setOption(option);
      }

    },
  }
</script>

<style  lang="less">
  @import "./index.less";
</style>