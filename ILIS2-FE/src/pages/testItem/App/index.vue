<template>
  <a-locale-provider :locale="locale">
    <div class="testItem">
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
        
    }
}
</script>

<style lang="less">
    @import "./index.less";
</style>
