<template>
  <a-tree
    @expand="onExpand"
    :expandedKeys="expandedKeys"
    :autoExpandParent="autoExpandParent"
    @select="onSelect"
    :selectedKeys="selectedKeys"
    :treeData="treeData"
  />
</template>
<script>

import { getQueryVariable } from "@common/utils";

function getTreeData(data){
  let obj = {},
      children = [];

  if(data.hasOwnProperty("children")){
    for(let i=0;i<data.children.length;i++){
      children.push(getTreeData(data.children[i]));
    }
  }

  obj = {
    ...data,
    key: data.id,
    title: data.name,
    children
  }

  return obj;
}

export default {
  data () {
    return {
      id: getQueryVariable("id") || "",
      expandedKeys: [],
      autoExpandParent: true,
      selectedKeys: [],
      treeData: []
    }
  },
  created (){
    this.getData();
  },
  props:['treeSelect', 'rootData'],
  watch: {
    checkedKeys(val) {
      console.log('onCheck', val)
    }
  },
  methods: {
    getData (){
      this.$ajax.get(`${this.$api.testItem.getTree}/${this.id}`, {
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        },
        dataType: "JSON"
      }).then(res => {
        if(res && res.data){
          this.treeData = [getTreeData(res.data)];
          this.rootData && this.rootData(this.treeData[0])
        }
      })
    },
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onSelect (selectedKeys, info) {
      console.log('onSelect', info)
      this.selectedKeys = selectedKeys
      this.treeSelect(selectedKeys, info);
    },
  },
}

</script>