<template>
  <div class="Test">
    <button @click="tap">点击我，跳出Dailog</button>
    <button @click="tapt">点击我展示Jztem</button>
    <h1>{{msg}}</h1>
    <v-Jztemp  :showModal="showModalJz" @formDataJz="fDataJz"></v-Jztemp>
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
    <p v-for='(item,index) in jzOptions' :key="index">
        <input type="checkbox" :name="index">
    </p>
  </div>
</template>

<script>
import Dialog from "@/components/Dialog";
import  vJztemp from '@/components/v-jztemp'
export default {
  name: "Test",
  components: { Dialog,vJztemp},
  data() {
    return {
      msg: "测试",
      showModal: false,
      showModalJz:false,
      jzOptions: [{name: "非常喜欢"}, {name: "喜欢"}, {name: "一般"}, {name: "不喜欢"}]
    };
  },
  methods: {
    tap() {
      this.showModal = true;
     
    },
     tapt() {
       this.showModalJz=true
    },
    fDataJz(e){
      console.log(e)
    },
    goIndex() {
      // this.$router.push('/')
    }
  }
};
</script>

<style lang="scss" scoped>
</style>