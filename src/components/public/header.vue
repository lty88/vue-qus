<template>
  <div class="header">
    <router-link to="/">问卷管理</router-link>
    <router-link to="/">我的问卷</router-link>
    <span @click="logout" class="userName">退出</span>
  </div>
</template>

<script>
export default {
  name: "Vheader",
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../style/header";
</style>
