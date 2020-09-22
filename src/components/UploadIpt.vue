<template>
  <div class>
    <div class="upload">
      <el-form ref="form" label-width="80px">
        <el-input v-model="url" class="ipt hidIpt"></el-input>
        <div class="upload" style="margin:0 0 10px">
          <el-upload class="upload-demo" ref="upload" :disabled="Isdisabled" action :file-list="formFileList"
            :http-request="handleUploadForm" :on-remove="fileRemove" :before-upload="beforeUploadForm">
            <el-button :disabled="Isdisabled" type="primary" plain>上传</el-button>
            <div slot="tip" class="el-upload__tip">
              此题为 <span class="anserType">{{getMsg()}}</span>
              多媒体回答，请选择相应的<span class="anserType">{{getMsg()}}</span>文件上传</div>
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
      event: "change",
    },
    props: {
      qnCode: {
        type: String,
        default: ""
      },
      fillUrl: {
      
      },
      MaxSize: {
        type: Number,
        default: 50,
      },
      uploadType: {
        type: String,
        default: ""
      },
      answerType: {
        type: Number,
        default: 5
      },
      Isdisabled: {
        type: Boolean,
        default: false
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
        formMaxSize: this.MaxSize, // 上传文件大小
        formFileList: [], // 显示上传文件
        uploadFormFileList: [], // 确定上传文件
        uploadUrl: "",//服务器返回的地址
        uploadTypes: this.uploadType
      };
    },
    watch: {
      url(newVal, oldVal) {
        this.$emit("change", newVal);
      },
      fillUrl(newVal, oldVal) {
        this.url = newVal;
      },
    },
    created() {
      // console.log(this.uploadTypes);
      this.code = this.$route.params.code;
    },
    mounted() {
      console.log(this.fillUrl);
    },
    methods: {
      getMsg() {
        let msg = "";
        if (this.answerType == 5) {
          msg = "图片";
        } else if (this.answerType == 6) {
          msg = "音频";
        } else {
          msg = "视频";
        }
        return msg;
      },
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
          reader.onload = function (e) {
            this.contentHtml = e.target.result; // txt文本内容，接下来就可以对其进行校验处理了
          };
        }
        // 验证文件类型
        let testmsg = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
        console.log(testmsg);
        let extension = this.uploadType.indexOf(testmsg) != -1
        if (!extension) {
          this.$message({
            message: `上传文件只能是${this.uploadType}相关${this.getMsg()}格式的类型!`,
            type: "warning",
            duration: 5000
          });
        }
        return extension;
      },
      fileRemove(file, fileList) {
        console.log(file);
        console.log(fileList);
        this.$refs.upload.clearFiles()
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
            _this.url = res.data.obj.filepath;
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

  .hidIpt {
    opacity: 0;
  }

  .anserType {
    color: blue;
  }
</style>