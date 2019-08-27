<template>
  <div class="home">
    <div class="home-btns">
      <router-link to="/comment/1">
        <a-button>列表页</a-button>
      </router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less" scoped>
    @import "./index.less";
</style>
