<template>
  <a-locale-provider :locale="locale">
    <div class="achievementAudit">
        <div class="achievementAudit-tab">
        <div class="achievementAudit-tab-btn">
            <router-link :to="`/`">审核中</router-link>
            <router-link :to="`/completed`">审核完成</router-link>
        </div>
        </div>
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
