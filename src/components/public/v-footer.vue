<template>
  <footer class="footer">
    <div>
      Copyright@
      <span >{{Years}}</span> 成都乐培生科技有限公司 蜀ICP备15018125号
    </div>
  </footer>
</template>

<script>
export default {
  name: "Vfooter",
  data() {
    return {
      Years: ""
    };
  },
  mounted() {
    this.Years = new Date().getFullYear();
  }
};
</script>

<style lang="scss" scoped>
.footer {
  // background-color: #dbe3f3;
  width: 100%;
  // height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #333;
  text-align: center;
  line-height: 60px;
}
</style>
