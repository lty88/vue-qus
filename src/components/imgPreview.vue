<template>
  <div>
    <div class="demo-image__preview">
      <el-image style="max-width: 60rem;" :src="imgUrl" :preview-src-list="srcList"></el-image>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      imgUrl: {
        type: String,
        default: ""
      }
    },
    //   watch: {
    //     imgUrl(newVal, o) {
    //       console.log(newVal);
    //       console.log(o);
    //       this.newImgUrl = imgUrl;
    //     }
    //   },
    mounted() {
      // console.log(this.imgUrl);
      this.srcList.push(this.imgUrl);
    },
    destroyed() {
      this.srcList = [];
    },
    data() {
      return {
        newImgUrl: "",
        srcList: []
      };
    }
  };
</script>

<style lang="scss" scoped>
@import "../style/imgPreview.scss";
</style>