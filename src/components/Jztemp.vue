<template>
  <transition name="slide">
    <div class="modal" v-show="showModals">
      <div class="mask"></div>
      <div class="modal-dialog">
        <div class="modal-header">
          <span>{{types}}</span>
          <a href="JavaScript:;" class="icon-close" @click="$emit('cancel')">x</a>
        </div>
        <div class="modal-body">
          <div class="form">
            <el-form :model="formData" ref="formData" label-width="100px" class="demo-dynamic">
              <!-- 矩阵题目标题 -->
              <el-form-item
                prop="title"
                label="题目标题"
                :rules="[{ required: true, message: '题目题目不能为空', trigger: 'blur' }]"
              >
                <el-input v-model="formData.title"></el-input>
              </el-form-item>
              <!-- 矩阵行标题 -->
              <div class="title-box">
              <div class="rowTitle Tbox">
               <h2 class="hTit">行标题</h2>
                <el-form-item
                  v-for="(option, index) in formData.options"
                  :label="'选项' +`${index+1}`"
                  :key="option.key"
                  :prop="'options.' + index + '.name'"
                  :rules="[{ required: true, message: '选项不能为空', trigger: 'blur' }]">
                  <el-input v-model="option.name"></el-input>
                  <el-button @click.prevent="removeDomain(index)">删除</el-button>
                </el-form-item>
              </div>
              <div class="CluTitle Tbox">
              <h2 class="hTit">竖选项</h2>
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
              </div>
              <el-form-item>
                <el-button type="primary" @click="submitForm('formData')">提交</el-button>
                <el-button @click="addDomain">新增选项</el-button>
                <!--<el-button @click="resetForm('formData')">重置</el-button> /-->
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
      this.showModals = newVal;
    },
    types(newVal) {
      this.formData.type = this.types;
    }
  },
  data() {
    return {
      showModals: false,
      formData: {
        num: "",
        title: "",
        type: this.types,
        isNeed: true,
        options: [{ name: "" }, { name: "" }, { name: "" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.formData);
          this.$emit("formData", this.formData);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    removeDomain(item) {
      var types = this.types;
      console.log(item);
      console.log(types);
      if (types === "radio" || types === "checkbox") {
        if (item >= 2) {
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
.hTit{
    margin: 0 auto 15px;
}
.title-box{
     margin: 0 auto !important;
    width: 90%;
    border: 1px solid pink;
    display: flex;
    .Tbox{
        border: 1px springgreen solid;
        display: flex;
        flex-direction: column;
    }
}
</style>