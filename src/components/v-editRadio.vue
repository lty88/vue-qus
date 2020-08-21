<template>
  <transition
    name="slide"
    v-if="formData.answerType===0||formData.answerType===1||formData.answerType===2"
  >
    <div class="modal" v-show="showModal">
      <div class="mask"></div>
      <div class="modal-dialog">
        <div class="modal-header">
          <span>{{getMsg(formData.answerType)}}</span>
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
                <el-input v-model="formData.content"></el-input>
                <el-input placeholder="请输入题号" v-model="formData.title">
                  <template slot="prepend">题号:</template>
                </el-input>
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
                <el-alert title="如果不需要做流程控制，编号和分数可以不用填写" type="info" show-icon></el-alert>
              </el-form-item>
              <!-- 上传图片视频 -->
              <el-form-item v-if="showVido" label="多媒体链接">
                <el-input v-model="formData.url "></el-input>
                <el-select v-model="formData.type" placeholder="选择类型" class="select-type">
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
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
              <!-- 选项内容radio跟CheckBox的选项内容的修改 -->

              <div v-if="formData.answerType===0||formData.answerType===1">
                <el-form-item
                  v-for="(option, index) in formData.items"
                  :label="'选项' +`${index+1}`"
                  :key="option.key"
                  :prop="'items.' + index + '.content'"
                  :rules="[{ required: true, message: '选项不能为空', trigger: 'blur' }]"
                >
                  <el-input v-model="option.content" placeholder="请输入选项内容"></el-input>
                  <el-button class="del" @click.prevent="removeDomain(index)">删除选项</el-button>
                  <el-input placeholder="请输入选项编号" v-model="option.title">
                    <template slot="prepend">选项号:</template>
                  </el-input>
                  <el-input
                    placeholder="需要流程控制请输入分值"
                    type="number"
                    oninput="if(value.length>2)value=value.slice(0,2)"
                    v-model="option.point"
                  >
                    <template slot="prepend">分值:</template>
                  </el-input>
                  <!-- 选项多媒体 -->
                  <el-input placeholder="请输入链接" v-model="option.url" class="input-with-select">
                    <el-select v-model="option.type" slot="prepend" placeholder="请选择类型">
                      <el-option label="文本" value="0"></el-option>
                      <el-option label="图片" value="1"></el-option>
                      <el-option label="视频" value="2"></el-option>
                      <el-option label="音频" value="3"></el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
              </div>
              <el-form-item class="modal-footer">
                <el-button type="primary" @click="submitForm('formData')">提交</el-button>
                <el-button @click="addDomain">新增选项</el-button>
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
import { UpdateQsInfo } from "../api/QS-edit";
export default {
  props: {
    showModal: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  mounted() {},
  data() {
    return {
      options: [
        {
          value: 0,
          label: "文本"
        },
        {
          value: 1,
          label: "图片"
        },
        {
          value: 2,
          label: "视频"
        },
        {
          value: 3,
          label: "音频"
        }
      ],
      showVido: false,
      showAddVido: false,
      code: 1
      //   formData: {
      //     title: "", //题号
      //     content: "", //题目
      //     order: 100,
      //     Types: 0, //题目类型（0：文本，1：图片，2：音频，3：视频）
      //     url: "", //多媒体内容链接
      //     options: [
      //       { code: "", title: "", content: "", point: 1, order: 100 },
      //       { code: "", title: "", content: "", point: 1, order: 200 },
      //       { code: "", title: "", content: "", point: 1, order: 300 }
      //     ]
      //   }
    };
  },
  mounted() {
    this.code = this.$route.params.code;
    console.log(this.code);
  },
  computed: {
    EditShowModals() {
      return this.showModal;
    }
  },
  methods: {
    //   处理题目类型
    getMsg(answerType) {
      let msg = "";
      if (answerType === 0) {
        msg = "单选题";
      } else if (answerType === 1) {
        msg = "多选题";
      } else if (answerType === 3 || answerType === 4) {
        msg = "矩阵题";
      } else {
        msg = "文本题";
      }
      return msg;
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
          let obj = {
            qnCode: this.code,
            code: this.formData.code,
            answerType: this.formData.answerType, //在radio组件里面
            title: this.formData.title,
            content: this.formData.content,
            type: this.formData.type,
            url: this.formData.url,
            item: JSON.stringify(this.formData.items)
          };
          console.log(obj);
          //保存题目
          UpdateQsInfo(obj).then(res => {
            console.log(res);
            if (res.data.code === 200) {
              console.log(res.data.msg);
            }
            this.$emit("EditShowModal", this.showModal);
          });
          // this.$emit("formData", this.formData);
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
      //   var types = this.types;
      let numOption = this.formData.items.length;
      console.log(item);
      console.log(numOption);

      if (numOption >= 3) {
        this.formData.items.splice(item, 1);
      } else {
        this.$message.error("选项至少有两项");
        return;
      }
      console.log(item);
    },
    addDomain() {
      this.formData.items.push({
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
  width: 80% !important;
}
.select-type {
  width: 110px !important;
}
.el-input-group__prepend {
  .el-select {
    display: block;
    width: 120px !important;
  }
}
</style>