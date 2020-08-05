<template>
  <transition name="slide">
    <div class="modal" v-show="showModals">
      <div class="mask"></div>
      <div class="modal-dialog">
        <div class="modal-header">
          <span>单选题</span>
          <a href="JavaScript:;" class="icon-close" @click="$emit('cancel')">x</a>
        </div>
        <div class="modal-body">
          <div class="form">
            <el-form :model="formData" ref="formData" label-width="100px" class="demo-dynamic">
              <el-form-item
                prop="title"
                label="题目"
                :rules="[{ required: true, message: '题目不能为空', trigger: 'blur' }]"
              >
                <el-input v-model="formData.title"></el-input>
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
                label="多媒体链接"
              >
                <el-input v-model="formData.titleUrl "></el-input>
                <el-select v-model="formData.titleType" placeholder="选择类型" class="select-type">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <!-- <el-button @click.prevent="removeTitleUrl()">删除</el-button> -->
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
              <div >
                <el-form-item
                  v-for="(option, index) in formData.options"
                  :label="'选项' +`${index+1}`"
                  :key="option.key"
                  :prop="'options.' + index + '.name'"
                  :rules="[{ required: true, message: '选项不能为空', trigger: 'blur' }]"
                >
                  <el-input v-model="option.name"></el-input>
                  <el-button @click.prevent="removeDomain(index)">删除</el-button>
                </el-form-item>
              </div>
              <el-form-item>
                <el-button type="primary" @click="submitForm('formData')">提交</el-button>
                <el-button @click="addDomain" v-if="types==='radio'||types==='checkbox'">新增选项</el-button>

                <el-button @click="resetForm('formData')">重置</el-button>
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
    editData: {
      type: Object,
      default() {
        return {};
      }
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
      this.showModals = newVal;
    },
    types(newVal) {
      this.formData.type = this.types;
    },
    editData(newVal) {
      this.formData = newVal;
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
      showVido: false,
      showAddVido: false,
      showModals: false,
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
      formData: {
        titleType: "",
        title: "",
        titleUrl: "",
        type: this.types,
        options: [{ name: "" }, { name: "" }, { name: "" }]
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
    //删除多媒体链接
    removeTitleUrl() {
      console.log(this);
    },
    //提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.formData);
          this.$emit("formData", this.formData);
          this.$refs[formName].resetFields();
          this.creatGroup = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.creatGroup = false;
    },
    removeDomain(item) {
      var types = this.types;
      let numOption = this.formData.options.length;
      console.log(item);
      console.log(numOption);
      if (types === "radio" || types === "checkbox") {
        if (numOption >= 3) {
          this.formData.options.splice(item, 1);
        } else {
          this.$message.error("选项至少有两项");
          return;
        }
      }
      console.log(item);
      // this.formData.options.splice(item, 1);
    },
    addDomain() {
      this.formData.options.push({
        name: "",
        key: Date.now()
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