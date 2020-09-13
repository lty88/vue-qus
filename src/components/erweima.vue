<template>
  <div class="boxshow">
    <div class="qrcode" ref="qrcodeContainer"></div>
  </div>
</template>

<script>
import QRCode from "qrcodejs2"; // 引入qrcode
import {baseUrl} from "../api/baseUrl"
export default {
  props: {
   code: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },
  mounted() {
    this.$nextTick(() => {
      this.qrcode();
    });
  },
  methods: {
    qrcode() {
      let qrcode = new QRCode(this.$refs.qrcodeContainer, {
        width: 150, // 二维码的宽
        height: 150, // 二维码的高
        text: baseUrl + this.code,
        // 二维码的内容
        colorDark: "#000", // 二维码的颜色
        colorLight: "#fff",
        correctLevel: QRCode.CorrectLevel.H
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>