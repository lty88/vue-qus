<template>
  <div class="header">
    <router-link to="/">问卷管理</router-link>
    <router-link to="/">我的问卷</router-link>
    <router-link to="/login">退出<span class="userName"></span></router-link>
  </div>
</template>

<script>
export default {
  name: "Vheader"
};
</script>

<style lang="scss" scoped>
@import "../../style/header";
</style>
