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
                :rules="[{ required: true, message: '题目不能为空', trigger: 'blur' }]">
                <el-input v-model="formDataT.title"></el-input>
              </el-form-item>
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
      showModalT: false,
      formDataT: {
        title: "",
        type: this.types
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit("formDataT", this.formDataT);
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
</style>