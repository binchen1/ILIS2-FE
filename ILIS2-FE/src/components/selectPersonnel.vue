<template>
  <div>
    <a-modal
      title="选择人员"
      v-model="visible"
      @ok="handleSubmit"
      class="components-selectPersonnel"
    >
      <a-tree
        :checkable="multiple"
        @expand="onExpand"
        :expandedKeys="expandedKeys"
        :autoExpandParent="autoExpandParent"
        v-model="checkedKeys"
        :selectedKeys = "selectedKeys"
        :treeData="treeData"
        @check="onCheck"
        @select="select"
        :multiple="multiple"
        :treeDefaultExpandAll="true"
      />
    </a-modal>
  </div>
</template>

<script>

// 整理数据
function getTree(data){
  if(!Array.isArray(data)){
    return;
  }
  let arr = [];
  for(let i=0;i<data.length;i++){
    let children = [];
    if(data[i].children && data[i].children.length != 0){
      children = getTree(data[i].children);
    }
    arr.push({
      ...data[i],
      value: data[i].id,
      title: data[i].name,
      key: data[i].id,
      children
    })
  }
  return arr;
}

function getName(data){
  if(!Array.isArray(data)){
    return;
  }
  let arr = [];
  for(let i=0;i<data.length;i++){
    let arr2 = [];
    if(data[i].children && data[i].children.length != 0){
      arr2 = getName(data[i].children);
      arr = arr.concat(arr2);
    }
    arr.push({
      value: data[i].id,
      name: data[i].name
    })
  }
  return arr;
}

export default {
  data (){
    return {
      visible: false,
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      treeData: [],
      field: "",
      multiple: true,
      nameData: [],
      select: ()=>{}
    }
  },
  created() {
    this.getPersonData();
  },
  props:['callback'],
  methods: {
    getPersonData: function(){
      this.$ajax({
          url: this.$api.common.getPersonsForChoose,
          method: "POST",
          headers:{
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          }
      }).then(res => {
        if(res && res.rows){
          this.treeData = getTree(res.rows);
          this.nameData = getName(this.treeData);
        }
      });
    },
    showModal: function(field, ids, data, type){

      if(type && type === 'radio'){
        this.multiple = false;
        this.selectedKeys = data || [];
        this.select = this.onSelect;
      }else{
        this.multiple = true;
        this.checkedKeys = data || [];
        this.select = ()=>{};
      }

      this.field = field;
      this.ids = ids;
      this.visible = true;
    },
    cancelModal: function(){
      this.expandedKeys = [];
      this.autoExpandParent = true,
      this.checkedKeys = [];
      this.selectedKeys = [];
      this.visible = false;
    },
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck (checkedKeys, info) {
      this.checkedKeys = checkedKeys
    },
    onSelect (selectedKeys, info) {
      this.selectedKeys = selectedKeys
    },
    handleSubmit (){
      let nameArr = [],
          data = [];

      if(this.multiple === true){
        data = this.checkedKeys;
      }else {
        data = this.selectedKeys;
      }

      if(data.length > 0){
        nameArr = this.nameData.filter(item=>{
          for(let i=0;i<data.length;i++){
            if(data[i] == item.value){
              return item;
            }
          }
        }).map(item=>item.name);
      }


      this.callback(this.field, this.ids, nameArr, data);
      this.expandedKeys = [];
      this.autoExpandParent = true,
      this.checkedKeys = [];
      this.selectedKeys = [];
      this.visible = false;
    }
  }
}
</script>

<style lang="less">
  .components-selectPersonnel {
    .ant-modal-body {
      height: 300px;
      overflow-y: auto;

      .ant-tree > li {
        & > .ant-tree-checkbox {
          display: none;
        }

        .ant-tree-title {
          color: rgba(0, 0, 0, 0.65)!important;
        }
      }
    }
  }
</style>