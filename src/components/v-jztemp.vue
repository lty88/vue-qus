<template>
  <transition name="slide">
    <div class="modal" v-show="showModals">
      <div class="mask"></div>
      <div class="modal-dialog">
        <div class="modal-header">
          <span>矩阵题目</span>
          <a href="JavaScript:;" class="icon-close" @click="$emit('cancel')">x</a>
        </div>
        <div class="modal-body">
          <div class="form">
            <el-form :model="formDataJz" ref="formDataJz" label-width="100px" class="demo-dynamic">
              <!-- 矩阵题目标题 -->
              <el-form-item
                prop="title"
                label="题目标题"
                :rules="[{ required: true, message: '题目题目不能为空', trigger: 'blur' }]"
              >
                <el-input v-model="formDataJz.title"></el-input>
                <!-- 多媒体标题 -->
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
                :rules="[{ required: true, message: '链接不能为空', trigger: 'blur' }]"
              >
                <el-input v-model="formDataJz.titleUrl "></el-input>
                <el-select v-model="formDataJz.titleType" placeholder="选择类型" class="select-type">
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

              <!-- 矩阵行标题 -->
              <div class="title-box">
                <div class="rowTitle Tbox">
                  <h2 class="hTit">行标题</h2>
                  <el-form-item
                    v-for="(Rowoption, Rowindex) in formDataJz.jzOptions"
                    :label="'选项' +`${Rowindex+1}`"
                    :key="Rowoption.key"
                    :prop="'jzOptions.' + Rowindex + '.name'"
                    :rules="[{ required: true, message: '选项不能为空', trigger: 'blur' }]"
                  >
                    <el-input v-model="Rowoption.name"></el-input>
                    <el-button @click.prevent="removeRowTitle(Rowindex)">删除</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button @click.prevent="addRowTitle">新增选项</el-button>
                  </el-form-item>
                </div>
                <!-- 矩阵行标题 -->
                <div class="CluTitle Tbox">
                  <h2 class="hTit">竖选项</h2>
                  <el-form-item
                    v-for="(Cluoption, Cluindex) in formDataJz.jzTitle"
                    :label="'选项' +`${Cluindex+1}`"
                    :key="Cluoption.key"
                    :prop="'jzTitle.' + Cluindex + '.title'"
                    :rules="[{ required: true, message: '选项不能为空', trigger: 'blur' }]"
                  >
                    <el-input v-model="Cluoption.title"></el-input>
                    <el-button @click.prevent="removeCluTitle(Cluindex)">删除</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button @click.prevent="addCluTitle">新增选项</el-button>
                  </el-form-item>
                </div>
              </div>
              <el-form-item>
                <el-button id="submitFormBtn" type="primary" @click="submitForm('formDataJz')">提交</el-button>
                <el-button id="restFormBtn" @click="resetForm('formDataJz')">重置</el-button>
              </el-form-item>
              <el-switch @click.native="sa" v-model="formDataJz.isCheckboxJz" active-text="多选矩阵" inactive-text="单选矩阵"></el-switch>
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
      this.showModals = newVal;
    },
    types(newVal) {
      this.formDataJz.type = this.types;
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
      showModals: false,
      formDataJz: {
        titleType: "",
        title: "",
        type: this.types,
        isNeed: true,
        isCheckboxJz: false,
        jzOptions: [{ name: "" }, { name: "" }, { name: "" }],
        jzTitle: [{ title: "" }, { title: "" }, { title: "" }]
      }
    };
  },
  methods: {
    sa(){
      console.log(this.formDataJz.isCheckboxJz);
    },
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
          //   console.log(this.formDataJz);
          this.$emit("formDataJz", this.formDataJz);
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
    removeRowTitle(Rowitem) {
      // debugger
      let numLength = this.formDataJz.jzOptions.length;
      console.log(numLength);
      if (numLength > 2) {
        this.formDataJz.jzOptions.splice(Rowitem, 1);
      } else {
        this.$message.error("选项至少有两项");
        return;
      }
    },
    removeCluTitle(item) {
      let numLength = this.formDataJz.jzTitle.length;
      if (item >= 2) {
        this.formDataJz.jzTitle.splice(item, 1);
      } else {
        this.$message.error("选项至少有两项");
        return;
      }
    },
    addRowTitle() {
      this.formDataJz.jzOptions.push({
        name: "",
        key: Date.now()
      });
    },
    addCluTitle() {
      this.formDataJz.jzTitle.push({
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
@import "../assets/button.scss";
@import "../style/Jztemp.scss";
.el-input {
  width: 88% !important;
}
.select-type {
  width: 120px !important;
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
.title-box{
  max-height: 40.5rem;
  overflow-y: auto;
}
</style>