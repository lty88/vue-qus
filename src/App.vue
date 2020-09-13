<template>
  <div
    id="app"
    :style="{backgroundImage: 'url(' + bgcUrl + ')',backgroundPosition:'fixed',backgroundRepeat:'repeat'}"
  >
    <div v-if="$route.meta.keepAlive">
      <v-header></v-header>
      <router-view :style="{minHeight:minHeight+'px'}"></router-view>
      <!-- <router-view></router-view> -->
      <v-footer></v-footer>
    </div>
    <router-view v-if="!$route.meta.keepAlive" :style="{minHeight:minHeight+'px'}"> </router-view>
    <!-- <router-view v-if="!$route.meta.keepAlive"></router-view> -->
   
  </div>
</template>

<script>
import vFooter from "@/components/public/v-footer";
import vHeader from "./components/public/header";
export default {
  name: "app",
  data() {
    return {
      minHeight: 0, //设置footer高
      bgcUrl: require("./assets/img/bgc.jpg")
    };
  },
  components: {
    vHeader,
    vFooter
  },
  mounted() {
    this.minHeight = document.documentElement.clientHeight - 60;
    let _this = this;
    window.onresize = function() {
      _this.minHeight = document.documentElement.clientHeight - 60;
    };
  }
};
</script>

<style lang="scss">


@import "./style/app.scss";
@import "./assets/normalize.css";
</style>
