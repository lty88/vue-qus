<template>
  <div class="Test">
    <button @click="tap">点击我，跳出Dailog</button>
    <h1>{{msg}}</h1>
    <radio></radio>
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
import Radio from '@/components/Radio';
export default {
  name: "Test",
  components: { Dialog,Radio},
  data() {
    return {
      msg: "测试",
      showModal: false
    };
  },
  methods: {
    tap() {
      this.showModal = true;
    },
    goIndex() {
      // this.$router.push('/')
    }
  }
};
</script>

<style lang="scss" scoped>
</style>