<template>
  <div>
    <router-link to="/">
      <a-button>返回</a-button>
    </router-link>
    <a-list
      :grid="{ gutter: 16, column: 4 }"
      :dataSource="data"
    >
      <a-list-item slot="renderItem" slot-scope="item, index">
        <a-card :title="item.title" :key="index">{{ item.content }}</a-card>
      </a-list-item>
    </a-list>
  </div>
</template>
<script>
const data = [
  {
    title: '标题 1',
    content: "内容1内容1内容1"
  },
  {
    title: '标题 2',
    content: "内容2内容2内容2"
  },
  {
    title: '标题 3',
    content: "内容3内容3内容3"
  },
  {
    title: '标题 4',
    content: "内容4内容4内容4"
  },
]
export default {
  data () {
    return {
      data,
    }
  },
}
</script>
<style>
  .ant-list {
    margin-top: 15px;
  }
</style>