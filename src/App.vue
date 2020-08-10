<template>
  <div id="app">
    <div v-if="$route.meta.keepAlive">
      <v-header></v-header>
      <router-view></router-view>
    </div>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
import vHeader from "./components/public/header";
export default {
  name: "app",
  components: {
    vHeader
  }
};
</script>

<style lang="scss">
@import "./style/app.scss";
@import "./assets/normalize.css"
</style>
