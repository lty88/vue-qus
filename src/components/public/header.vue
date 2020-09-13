<template>
  <el-header>
    <div class="logo-box">
      <img class="logo-img" :src="logo" alt />
      <router-link to="/" class="logo-title">乐培生问卷管理系统</router-link>
      <router-link to="/" class="my-qs">我的问卷</router-link>
      <router-link to="/AvailableQn" class="AvailableQn">查看有效问卷</router-link>
    </div>
    <div class="logout">
      <a @click="logout" class="userName">退出</a>
    </div>
  </el-header>
</template>

<script>
export default {
  name: "Vheader",
  data() {
    return {
      logo: require("../../../public/logo.png")
    };
  },
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
