<template>
  <div class>
    <div class="upload">
      <el-form ref="form" label-width="80px">
        <el-input v-model="url" class="ipt"></el-input>
        <div class="upload" style="margin:0 0 10px">
          <el-upload
            class="upload-demo"
            action
            :file-list="formFileList"
            :http-request="handleUploadForm"
            :before-upload="beforeUploadForm"
            accept=".jpg, .jpeg, .png, .JPG, .JPEG"
          >
            <el-button type="primary" plain>上传</el-button>
          </el-upload>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { uploadMedia } from "../api/QS-edit";

export default {
  model: {
    prop: "fillUrl",
    event: "change"
  },
  props: {
    qnCode: {
      type: String,
      default: ''
    },
    fillUrl: {
      type: String,
      default: ''
    }
  },
  name: "importUser",
  data() {
    return {
      headersObj: {
        Authorization: window.sessionStorage.getItem("token")
      }, //携带的请求头
      url: "",
      code: "", //问卷code
      formMaxSize: 10, // 上传文件大小
      formFileList: [], // 显示上传文件
      uploadFormFileList: [], // 确定上传文件
      uploadUrl: "", //服务器返回的地址
    };
  },
  watch: {
    url(newVal,oldVal) {
      this.$emit("change", newVal);
    },
    fillUrl(newVal,oldVal) {
      this.url=newVal;
    }
  },
  created() {
    this.code = this.$route.params.code;
  },
  mounted() {},
  methods: {
    onChangeUrl(e) {
      this.$emit("change", e.target.value);
    },
    // 开始上传前验证
    beforeUploadForm(file) {
      // 验证文件大小
      if (file.size / 1024 / 1024 > this.formMaxSize) {
        this.$message({
          message: `上传文件大小不能超过${this.formMaxSize}M!`,
          type: "warning"
        });
        return false;
      }
      // 中文乱码处理
      if (file.raw) {
        let reader = new FileReader(); // 读取文件内容
        reader.readAsText(file.raw, "gb2312"); // 防止中文乱码问题，不加reader.onload方法都不会触发
        reader.onload = function(e) {
          this.contentHtml = e.target.result; // txt文本内容，接下来就可以对其进行校验处理了
        };
      }
      // 验证文件类型
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension =
        testmsg === "jpg" ||
        testmsg === "jpeg" ||
        testmsg === "png" ||
        testmsg === "JPGng" ||
        testmsg === "png";
      if (!extension) {
        this.$message({
          message: "上传文件只能是视频音频图片!",
          type: "warning"
        });
      }
      return extension;
    },
    // 上传文件
    handleUploadForm(param) {
      let _this = this;
      let formData = new FormData();
      formData.append("qnCode", this.code); // 额外参数
      formData.append("files", param.file);
      let loading = _this.$loading({
        lock: true,
        text: "上传中，请稍候...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      uploadMedia(formData).then(res => {
        console.log(res);
        // this.$emit('uploadUrl',"https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1089874897,1268118658&fm=26&gp=0.jpg")
        if (res.data.code === 200) {
          _this.$message.success("上传文件成功，" + res.data.msg);
          _this.url=res.data.obj.filepath;
          // this.$emit("change", res.data.obj.filepath);
          loading.close();
        } else {
          _this.$message.warning("上传文件失败，");
          loading.close();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../style/import-user.scss";

/deep/ .el-select .select-type {
  width: 50% !important;
}

.el-input {
  width: 80% !important;
  height: 50% !important;
}

.el-input-group__prepend {
  .el-select {
    display: block;
    width: 120px !important;
  }
}

.el-table .success-row {
  background: #f0f9eb !important;
}
</style>
