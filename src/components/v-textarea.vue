<template>
  <transition name="slide">
    <div class="modal" v-show="showModalT">
      <div class="mask"></div>
      <div class="modal-dialog">
        <div class="modal-header">
          <span>文本题目</span>
          <a href="JavaScript:;" class="icon-close" @click="$emit('cancel')">x</a>
        </div>
        <div class="modal-body">
          <div class="form">
            <el-form :model="formDataT" ref="formDataT" label-width="100px" class="demo-dynamic">
              <el-form-item
                prop="title"
                label="题目"
                :rules="[{ required: true, message: '题目不能为空', trigger: 'blur' }]"
              >
                <el-input v-model="formDataT.title"></el-input>
                <br />
                <el-popover
                  class="btn-vido"
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  content="这是切换为多媒体的题目"
                >
                  <el-button slot="reference" @click="changeVido">多媒体题目</el-button>
                </el-popover>
                <el-popover
                  class="btn-vido"
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  content="这是切换为多媒体的题目"
                >
                  <el-button slot="reference" @click="addVido">上传多媒体</el-button>
                </el-popover>
              </el-form-item>
              <!-- 上传图片视频 -->
              
              <el-form-item
                v-if="showVido"
                prop="titleUrl"
                label="多媒体链接">
                <el-input v-model="formDataT.titleUrl "></el-input>
                <el-select v-model="formDataT.titleType" placeholder="选择类型" class="select-type">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-button @click.prevent="removeTitleUrl()">删除</el-button>
              </el-form-item>
              <el-upload
                v-if="showAddVido"
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-change="handleChange"
                :file-list="fileList"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
              <el-form-item>
                <el-button type="primary" @click="submitForm('formDataT')">提交</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    showModal: {
      type: Boolean,
      default: false
    },
    types: {
      type: String
    }
  },
  mounted() {
    console.log(this.types);
  },
  watch: {
    showModal(newVal) {
      console.log(newVal);
      this.showModalT = newVal;
    },
    types(newVal) {
      this.formDataT.type = this.types;
    }
  },
  data() {
    return {
      options: [
        {
          value: "img",
          label: "图片"
        },
        {
          value: "vido",
          label: "视频"
        },
        {
          value: "mp3",
          label: "音频"
        }
      ],
      fileList: [
        {
          name: "food.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        },
        {
          name: "food2.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        }
      ],
      showVido: false,
      showAddVido: false,
      showModalT: false,
      formDataT: {
        titleType: "",
        title: "",
        type: this.types
      }
    };
  },
  methods: {
    //删除文件
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
    },
    //新增多媒体题目
    changeVido() {
      this.showVido = !this.showVido;
    },
    //上传多媒体题目
    addVido() {
      this.showAddVido = !this.showAddVido;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit("formDataT", this.formDataT);
          this.$refs[formName].resetFields();
          this.creatGroup = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/config.scss";
@import "../assets/mixin.scss";
@import "../assets/modal.scss";
@import "../assets/button.scss";
.modal-dialog {
  width: 90rem !important;
}
.form {
  margin: 0 auto !important;
}
  .upload-demo {
    width: 614px;
    border: 1px solid;
    margin: 20px auto;
  }
  .el-input {
    width: 88% !important;
  }
  .select-type {
    width: 120px !important;
  }
</style>