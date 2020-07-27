<template>
  <div class="Test">
    <button @click="tap">点击我，跳出Dailog</button>
    <button @click="tapt">点击我展示Jztem</button>
    <h1>{{msg}}</h1>
    <Jztemp  :showModal="showModalS"></Jztemp>
    <Dialog
      title="提示"
      btnType="3"
      sureText="确定"
      cancelText="取消"
      modalType="middle"
      :showModal="showModal"
      @submit="goIndex"
      @cancel="showModal=false"
    >
      <template v-slot:body>
        <p>成功！</p>
      </template>
    </Dialog>
  </div>
</template>

<script>
import Dialog from "@/components/Dialog";
import Jztemp from '@/components/Jztemp'
export default {
  name: "Test",
  components: { Dialog,Jztemp},
  data() {
    return {
      msg: "测试",
      showModal: false,
      showModalS:false
    };
  },
  methods: {
    tap() {
      this.showModal = true;
     
    },
     tapt() {
       this.showModalS=true
    },
    goIndex() {
      // this.$router.push('/')
    }
  }
};
</script>

<style lang="scss" scoped>
</style>