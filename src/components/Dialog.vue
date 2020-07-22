<template>
<transition name='slide'>
 <div class="modal" v-show="showModal">
    <div class="mask"></div>
    <div class="modal-dialog">
      <div class="modal-header">
        <span>{{title}}</span>
        <a href="JavaScript:;" class="icon-close"  v-if="btnType==1" @click="$emit('cancel')">x</a>
      </div>
      <div class="modal-body">
        <slot name="body" class="content"></slot>
      </div>
      <div class="modal-footer">
      <a href="JavaScript:;" class="btn"    v-if="btnType==1" @click="$emit('submit')">{{sureText}}</a>
        <a href="JavaScript:;" class="btn cancel-btn"  v-if="btnType==2" @click="$emit('cancel')">{{cancelText}}</a>
        <div class="btn-group" v-if="btnType==3">
          <a href="JavaScript:;" class="btn"  @click="$emit('submit')">{{sureText}}</a>
          <a href="JavaScript:;" class="btn cancel-btn"  @click="$emit('cancel')">{{cancelText}}</a>
        </div>
      </div>
    </div>
  </div>
</transition>
 
</template>

<script>
export default {
  name: "Dialog",
  props: {
    //弹框类型：小small 中middle 大large弹框
    modalType: {
      type: String,
      default: "form"
    },
    //弹框标题
    title: String,
    //按钮类型:1：确定按钮 2：取消按钮 3：确定取消
    btnType: String,
    sureText: {
      type: String,
      default: "确定"
    },
    cancelText: {
      type: String,
      default: "取消"
    },
    showModal: Boolean
  },
  data() {
    return {
    //   closeURL:require('../../public/imgs/icon-close.png')
    };
  },

  components: {},

  computed: {},

  beforeMount() {},

  mounted() {},

  methods: {},

  watch: {}
};
</script>
<style lang='scss'>
@import "../assets/config.scss";
@import "../assets/mixin.scss";
@import "../assets/modal.scss";
@import '../assets/button.scss';
</style>