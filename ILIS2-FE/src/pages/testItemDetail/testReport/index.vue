<template>
  <div class="testReport">
    <div class="testReport-left">
      <TreeComponent :treeSelect="treeSelect" />
    </div>
    <div class="testReport-right">
      <div class="testReport-search">
        <div v-if="allSearch">
        <a-form
            :form="form"
        >
          <a-form-item
              label="报告编号"
              :label-col="{ span: 2 }"
              :wrapper-col="{ span: 10 }"
          >
            <a-input
                v-decorator="[
                  'taskCode'
                ]"
            />
          </a-form-item>
          <a-form-item
              label="单位工程"
              :label-col="{ span: 2 }"
              :wrapper-col="{ span: 10 }"
          >
            <a-input
                v-decorator="[
                  'program'
                ]"
            />
          </a-form-item>
          <a-form-item
              label="检测内容"
              :label-col="{ span: 2 }"
              :wrapper-col="{ span: 10 }"
          >
            <a-input
                v-decorator="[
                  'testContent'
                ]"
            />
          </a-form-item>
          <a-form-item
              label="报告状态"
              :label-col="{ span: 2 }"
              :wrapper-col="{ span: 10 }"
          >
            <a-input
                v-decorator="[
                  'reportStatus'
                ]"
            />
          </a-form-item>
          <a-form-item
              label="试验人员"
              :label-col="{ span: 2 }"
              :wrapper-col="{ span: 10 }"
          >
            <a-input
                v-decorator="[
                  'testPeople'
                ]"
            />
          </a-form-item>
          <a-form-item
              label="签发"
              :label-col="{ span: 2 }"
              :wrapper-col="{ span: 10 }"
          >
            <a-input
                v-decorator="[
                  'issue'
                ]"
            />
          </a-form-item>
          <a-form-item
              label="创建时间"
              :label-col="{ span: 2 }"
              :wrapper-col="{ span: 10 }"
          >
            <a-date-picker v-decorator="[
                'time'
              ]" />
          </a-form-item>
          <a-form-item
              :wrapper-col="{ span: 10, offset: 2 }"
          >
            <a-button @click="search">查询</a-button>
            <a-button @click="()=>{ searchType(false) }">切换普通查询</a-button>
            <a-button type="primary">创建任务</a-button>
          </a-form-item>
        </a-form>
      </div>
        <div v-else>
          <a-input v-model="searchText" placeholder="请输入报告编号" class="testReport-search-all" />
          <a-button @click="search">查询</a-button>
          <a-button @click="()=>{ searchType(true) }">切换高级查询</a-button>
          <a-button type="primary">创建任务</a-button>
        </div>
      </div>
      <a-table :columns="columns" :dataSource="data" bordered>
        <template slot="name" slot-scope="text">
          <a href="javascript:;">{{text}}</a>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>

import TreeComponent from "./components/tree";

const columns = [
  {
    title: '任务编号',
    dataIndex: 'taskCode'
  }, {
    title: '报告编号',
    dataIndex: 'reportCode',
  }, {
    title: '单位工程',
    dataIndex: 'program',
  }, {
    title: '检测内容',
    dataIndex: 'testContent',
  }, {
    title: '报告状态',
    dataIndex: 'reportStatus',
  }, {
    title: '试验人员',
    dataIndex: 'testPeople',
  }, {
    title: '报告编制',
    dataIndex: 'report',
  }, {
    title: '审核',
    dataIndex: 'examine',
  }, {
    title: '签发',
    dataIndex: 'issue',
  }, {
    title: '创建时间',
    dataIndex: 'time',
  }
];

const data = [];
for(let i=0;i<100;i++){
  data.push({
    key:i,
    taskCode: `taskCode ${i}`,
    reportCode: `reportCode ${i}`,
    program: `program ${i}`,
    testContent: `testContent ${i}`,
    reportStatus: `reportStatus ${i}`,
    testPeople: `testPeople ${i}`,
    report: `report ${i}`,
    examine: `examine ${i}`,
    issue: `issue ${i}`,
    time: `time ${i}`,
  })
}

export default {
  data () {
    return {
      data,
      columns,
      searchText: "",
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      allSearch: false,
      loading: false
    }
  },
  created(){
    this.getData();
  },
  components: {
    TreeComponent
  },
  methods: {
    getData: function(){
      let { page, size, projectName } = this;
      this.loading = true;
      this.$ajax.get(this.$api.testItem.reportList, {
        params: {
          page,
          size,
          projectName
        },
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        }
      }).then(res => {
        if(res && res.data){
          this.data = res.data.rows;
          this.pagination.total = res.data.count;
          this.pagination.current = page;
          this.pagination.pageSize = size;
          this.loading = false;
        }
      });
    },
    search: function(e){
      e.preventDefault();
      let data = {};
      if(this.allSearch){
        this.form.validateFields((err, values) => {
          if (!err) {
            data = {
              ...values,
              time: values['time'].format('YYYY-MM-DD'),
            }
          }
        });
      }else{
        data.text = this.searchText
      }

      console.log("查询数据", data);
    },
    searchType: function(bool){
      this.allSearch = bool;
    },
    treeSelect: function(data){
      console.log(data)
    }
  },
}
</script>

<style lang="less">
    @import "./index.less";
</style>


