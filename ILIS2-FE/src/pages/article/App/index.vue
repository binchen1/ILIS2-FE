<template>
  <a-locale-provider :locale="locale">
    <div class="home">
        <div class="home-nav">
            <router-link to="/">
                <a-button type="primary">列表</a-button>
            </router-link>
            <router-link to="/form">
                <a-button type="primary">表单</a-button>
            </router-link>
            <router-link to="/report">
                <a-button type="primary">报告</a-button>
            </router-link>
        </div>
        <!-- <a-button @click="openTab" >打开</a-button> -->
        <router-view/>
    </div>
  </a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';

export default {
    data() {
        return {
        locale: zhCN,
        }
    },
  name: 'App',
    methods: {
        openTab() {
            top.addTabs &&
            top.addTabs({
                title: 'Home',
                url: 'itemController.do?goTab'
            })
        }
    }
}
</script>

<style lang="less">
    @import "./index.less";
</style>
