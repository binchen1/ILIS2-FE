<template>
  <a-layout id="components-layout-demo-top-side-2">
    <a-layout>
      <a-layout-sider width="220" :style="{ overflow: 'auto', padding: '10px', height: '100vh', position: 'fixed', left: 0, background: '#fff' }">
       <div>
        <a-button type="primary" @click="showModal(false)">添加</a-button>
         <a-modal :title="isEdit ? '编辑规程类别':'添加规程类型'"
             :maskClosable="maskClosable"
             :visible="visible"
             @ok="typeOk"
             :confirmLoading="confirmLoading"
             @cancel="typeCancel">

           <a-form-item  :label-col="{ span:8 }" :wrapper-col="{ span: 10 }" label="请输入规程类型名称：" >
             <a-input placeholder="请输入类型名称"  v-model="treeName"/>
           </a-form-item>
         </a-modal>
        <a-button type="primary" @click="showModal(true)">编辑</a-button>
        <a-button type="primary" @click="showConfirm">删除</a-button>
      </div>
      <a-tree  showLine  :treeData="treeData"  @select="onSelect" >
      </a-tree>
      </a-layout-sider>
      <a-layout :style="{ marginLeft:'220px', padding:'0px 10px' }">
        <a-locale-provider :locale="zhCN">
          <a-layout-content :style="{ background: '#fff', padding: '10px', margin: 0, minHeight: '280px', overflow: 'initial'}">
          <div>
            <a-row class="search-header">
              <a-col :span="10" v-show="!allSearch">
                <a-input placeholder="输入规程名称/颁布号后回车即可查询"  v-model="quickQryParam" @pressEnter="quickSearch"/>
              </a-col>
              <a-col :span="2" offset="1" v-show="!allSearch">
                <a-button type="primary" @click="quickSearch()">查询</a-button>
              </a-col>
              <a-col class="search-header-all" :span="12" v-show="allSearch">
                高级查询
                <span  @click="()=>{ this.retractIcon = !this.retractIcon }">
                  <a-icon v-if="retractIcon" type="up-circle" />
                  <a-icon v-else type="down-circle" />
                </span>
              </a-col>
              <a-col :span="4" >
                <a-button icon="search" type="primary"  @click="()=>{ searchType() }"> {{ searchText }}</a-button>
              </a-col>
            </a-row>
            <div v-show="retractIcon && allSearch">
              <a-form :form="form">
                <a-form-item label="规格名称" v-bind="formItemLayout">
                  <a-input v-decorator="['standardName']"/>
                </a-form-item>
                <a-form-item label="颁布号" v-bind="formItemLayout">
                  <a-input v-decorator="['publishCode']"/>
                </a-form-item>
                <a-form-item label="默认规程用途" v-bind="formItemLayout">
                  <a-radio-group v-decorator="['defaultUse']">
                    <a-radio value="1"> 验依据 </a-radio>
                    <a-radio value="2"> 评定标准 </a-radio>
                    <a-radio value="3"> 依据和标准 </a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="是否系统规程" v-bind="formItemLayout">
                  <a-radio-group v-decorator="['sourceType',{initialValue: '1'}]" >
                    <a-radio value="1"> 系统规程 </a-radio>
                    <a-radio value="2"> 用户规程 </a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="是否上传文件" v-bind="formItemLayout">
                  <a-radio-group v-decorator="['isUploadFile']">
                    <a-radio value="0"> 否 </a-radio>
                    <a-radio value="1"> 是 </a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item :wrapper-col="{ span: 10, offset: 3 }">
                  <a-row>
                    <a-col :span="3">
                      <a-button @click="allQuickSearch">查询</a-button>
                    </a-col>
                    <a-col :span="3" offset="1">
                      <a-button @click="()=>{this.form.resetFields()}" offset="1">重置</a-button>
                    </a-col>
                  </a-row>
                </a-form-item>
              </a-form>
            </div>
          </div>
          <div style="margin: 8px 0px;">
            <a-button type="primary" @click="showModalAddEdit">添加规程</a-button>
            <!--<a-modal :title="standardId?'编辑规程':'新增规程'"-->
            <a-modal :title="isDetail?'规程详情':standardId?'编辑规程':'新增规程'"
              :maskClosable="maskClosable"
              :visible="visibleRules"
              @ok="handleOkAddEdit"
              :confirmLoading="confirmLoadingRules"
              @cancel="()=>{ this.visibleRules = false }" >
              <AddEdit :standardTypeId="currentId" :standardId="standardId"  :isDetail="isDetail" ref="addeditchild" :callback="handleOkAddEditCall" />
            </a-modal>
            <a-button type="primary" @click="showModalType">变更规程类型</a-button>
            <a-modal title="变更规程类型"
                :maskClosable="maskClosable"
                :visible="visibleType"
                @ok="editType"
                :confirmLoading="confirmLoadingType"
                @cancel="editCancelType" >
              <a-form-item  :label-col="{ span:8 }" :wrapper-col="{ span: 10 }" label="请输入规程类型名称：" >
                <a-tree-select
                    style="width: 300px"
                    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                    :treeData="treeData"
                    :value="valueType"
                    placeholder='请选择规程'
                    treeDefaultExpandAll
                    @change="onChangeType"
                ></a-tree-select>
              </a-form-item>
            </a-modal>
            <div class="expired-box"> <i></i>表示该规程已过期</div>
          </div>
           <a-table :rowSelection="rowSelection" :columns="columns" :dataSource="data" rowKey="id"
                    :pagination="pagination"
                    >
             <a slot="name" slot-scope="text" href="javascript:;">{{text}}</a>
             <template slot="operation" slot-scope="text, record, index">
               <div class='editable-row-operations'>
                 <a type="primary" title='上传'><a-icon type="upload" @click="upload(record)" /></a>
                  <a type="primary" title='详情' @click="() => detailTable( record, index)"><a-icon type="eye" /></a>
                  <a v-show="record.sourceType==='2'?true:false" @click="() => editTable( record, index)"><a-icon title="编辑" type="edit" /></a>
                  <a-popconfirm v-show="record.sourceType==='2'?true:false" title='确定要删除吗?' @confirm="() => cancelTable(record)">
                    <a-icon title="删除" type="delete" />
                  </a-popconfirm>
               </div>
             </template>
             <template slot="expireDate" slot-scope="text, record, index">
               <a href="javascript:;" v-bind:class="{active: new Date(text).valueOf()<= new Date().valueOf()?true:false}">{{text}}</a>
             </template>
             <template slot="fileName" slot-scope="text, record, index">
               <a :href="record.fileUrl"> <u> {{text}} </u></a>
             </template>
            </a-table>
            <UploadComponent ref="UploadComponent" :max="1" :uploadcall="uploadFile" :fileLists="fileList"/>
        </a-layout-content>
        </a-locale-provider>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script>
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
  import AddEdit from '../addEdit';
  import HelloDemo from '../../../components/HelloDemo';
  import UploadComponent from '@components/uploadComponent';
  import { ajaxRequest } from '@common/utils.js';

  const columns = [{title: '规程名称', dataIndex: 'standardName', scopedSlots: {customRender: 'standardName'}},
    {title: '颁布号', dataIndex: 'publishCode'},
    {title: '执行时间', dataIndex: 'executeDate'},
    {title: '过期时间', dataIndex: 'expireDate',scopedSlots: {customRender: 'expireDate'},},
    {title: '是否系统规程', dataIndex: 'sourceType',customRender:function(text, record){
        return record.sourceType === '1' ? '是' : '否';
      }},
    {title: '规程文件', dataIndex: 'fileName',scopedSlots: {customRender: 'fileName'}},
    {
      title: '操作', dataIndex: 'operation', width: 120,
      scopedSlots: {customRender: 'operation'},
    }];
export default {
  name: 'list',
  data () {
    let self = this;
    return {
      zhCN,
      columns,
      searchText: "切换到高级查询",
      quickQryParam: '',
      queryParams: {},
      allSearch: false,
      retractIcon:true,
      formItemLayout: {
        labelCol: {
          xs: { span: 3 },
          sm: { span: 3 },
        },
        wrapperCol: {
          xs: { span: 10 },
          sm: { span: 10 },
        },
      },
      treeName: "",
      parentId: "",
      currentId: "",
      treeRowName: "",
      isEdit: false, // 是否编辑规程类型
      visible: false,
      confirmLoading: false,
      maskClosable: false,
      treeData: [],
      data: [],
      totals: 0,
      visibleRules: false,
      confirmLoadingRules: false,
      visibleType:false,
      confirmLoadingType: false,
      valueType:undefined,
      standardId:'', // 规程id
      isDetail:false,
      standardName:'', // 规程名称
      pages:1,
      pagination: {
        pageNo: 1,
        pageSize: 10, // 默认每页显示数量
        showSizeChanger: true, // 显示可改变每页数量
        pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
        // showTotal: total => `共 ${total} 页`, // 显示总数
        onShowSizeChange: (current, pageSize) => this.pageSize = pageSize, // 改变每页数量时更新显示
        onChange: (page, pageSize) => self.handleTableChange(page, pageSize),//点击页码事件
        total: 0 //总条数
      },
      fileList:[],
    };
  },
  beforeCreate () {
    this.form = this.$form.createForm(this);
  },
  components:{
    AddEdit,
    HelloDemo,
    UploadComponent
  },
  created(){
    this.getData();
    this.getTreeData();
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this;
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.standardId = selectedRowKeys +'';
          // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name,
          }
        }),
      }
    }
  },
  methods: {
    ajaxRequest,
    showModal(isEdit) {
      this.isEdit = isEdit;
      this.treeName = (this.isEdit ? this.treeRowName : '');
      if (this.currentId) {
        this.visible = true
      } else {
        this.$message.info('请选择规程类型');
      }

    },
    typeOk(e) { // 规程类型新增编辑
      this.confirmLoading = true;
      let data = {};
      if(this.isEdit){
        data = {
          "id": this.currentId,
          "name": this.treeName,
          "parent.id": this.parentId
        };
      }else {
        data = {
          "name": this.treeName,
          "parent.id": this.currentId
        };
      }
      ajaxRequest(this.$api.standard.treeSave, this.qs.stringify(data), this.typeOkCall);
    },
    typeOkCall(res){
      this.visible = false;
      this.confirmLoading = false;
      this.getTreeData();
    },
    typeCancel(e) {
      this.visible = false;
    },
    showModalType(){ // 变更规程
      console.log('showModalType',this.standardId)
      if(this.standardId){
        this.visibleType = true;
      }else{
        this.$message.info('请选择规程');
      }
    },
    editType(){ // 变更规程确认
      if(this.valueType){
        const data = {standardId: this.standardId, standardTypeId: this.valueType};
        ajaxRequest(this.$api.standard.standardType, this.qs.stringify(data), this.editTypeCall);
      }
    },
    editTypeCall(res){ // 变更规程确认回调
      if(res.success){
        this.visibleType = false;
        this.getData();
      }

    },
    editCancelType(){ // 变更规程取消
      this.visibleType = false;
    },
    onChangeType(value){
      this.valueType = value
    },
    showModalAddEdit(){
      if(this.currentId){
        this.visibleRules = true;
        this.standardId = '';
      }else {
        this.$message.info('请选择规程类型')
      }


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
    showConfirm() {
      var self = this;
      if(this.currentId) {
        this.$confirm({
          title: '提示',
          content: '确定要删除吗?',
          onOk() {
            var data = {
              id: self.currentId
            };
            ajaxRequest(self.$api.standard.treeDel, self.qs.stringify(data), self.showConfirmCall);
          },
          onCancel() {
          },
        });
      }else{
        this.$message.info('请选择类型');
      }
    },
    showConfirmCall(res){
      console.log('showConfirmCall', res);
      this.visible = false;
      this.confirmLoading = false;
      this.getTreeData();
    },
    handleTableChange(page) {
      this.pages = page;
      this.getData();
    },
    editTable ( record) {
      this.standardId = record.id;
      this.standardId ? this.visibleRules = true : '';
      this.isDetail = false;
      console.log('editTable', this.standardId);
      // this.$refs.addeditchild.getData();
    },
    detailTable(record){
      this.standardId = record.id;
      this.standardId ? this.visibleRules = true : '';
      this.isDetail = true;
      console.log('detailTable', this.standardId);
    },
    cancelTable (data) {
      ajaxRequest(this.$api.standard.standardDel, this.qs.stringify({id:data.id}), this.cancelTableCall);
    },
    cancelTableCall(res){
      if(res.success){
        this.getData()
      }
    },
    getData() {
      const data = {
        page: this.pages || 1,
        rows: 10,
      };
      const formData = {...data, ...this.queryParams};

      ajaxRequest(this.$api.standard.tableUrl, this.qs.stringify(formData), this.getDataCall);
    },
    getDataCall(res){
      this.data = res.rows;
      this.pagination.total = res.total;
    },
    getTreeData(){
      const data = {
        page:1,
        rows: 10,
      };
      ajaxRequest(this.$api.standard.treeUrl, this.qs.stringify(data), this.getTreeDataCall);
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
    onSelect(selectedKeys, info) {
      if(info.selected){
        this.currentId = selectedKeys[0];
        var treeRow = info.selectedNodes[0].data.props;
        this.treeRowName = treeRow.name;
        this.parentId = treeRow.parentId;
      }else{
        this.parentId = this.treeRowName = this.currentId = "";
      }
    },
    searchType(){
      this.allSearch = !this.allSearch;
      if(this.allSearch){
        this.retractIcon = true;
        this.searchText = '切换到普通查询';
      }else{
        this.searchText = '切换到高级查询';
      }
    },
    quickSearch() {
      // 快速查询
      console.log('quickSearch')
      this.queryParams ={ quickQryParam:this.quickQryParam};
      this.getData();
    },
    allQuickSearch(){

      // 高级查询
      let formObj = this.form.getFieldsValue();
      this.queryParams = formObj;
      this.getData();
    },
    upload(record){
      console.log('upload',record);
      this.standardId = record.id;
      this.standardName = record.standardName;
      this.currentId = record.standardTypeId;
      if(record.fileId){
        this.fileList = [{
          uid: '-1',
          name: record.fileName,
          status: 'done',
          url: record.fileUrl,
        }];
      }

      console.log('this.fileList', this.fileList);
      this.$refs.UploadComponent.showModal();
    },
    uploadFile(data){
      console.log("上传后获取到的文件", data);
      // if(data.cancel){ // 点击取消
      //   this.standardId = this.standardName = this.currentId = '';
      //   return;
      // }
      if(data.length>0){ // 直接点击确定
        const formData = {
          id: this.standardId,
          standardName: this.standardName,
          standardTypeId: this.currentId,
          fileId:data[0].id
        };
        console.log('formData', formData);
        ajaxRequest(this.$api.standard.standardSave,this.qs.stringify(formData),this.uploadFileCall)
      }else{
        this.standardId = this.standardName = this.currentId = '';
      }

    },
    uploadFileCall(res){
      console.log('uploadFileCall', res);
      this.standardId = this.standardName = this.currentId = '';
      this.getData()
    }

  }
}
</script>

<style  lang="less">
    @import "./index.less";
</style>
