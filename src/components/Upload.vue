<template>
  <el-upload
    class="upload-demo"
    action="https://jsonplaceholder.typicode.com/posts/"
    :on-change="handleChange"
  >
    <el-button class="auto" size="small" type="primary">点击上传</el-button>
    <div slot="tip" class="el-upload__tip auto">只能上传jpg/png/mp4/mp3文件，且不超过50M</div>
  </el-upload>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    handleChange(file, fileList) {}
  }
};
</script>

<style lang="scss" scoped>
</style>