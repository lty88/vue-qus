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
              </el-form-item>
              <div v-if="types==='radio'||types==='checkbox'">
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
        title: "",
        type: this.types,
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
      let numOption=this.formData.options.length
      console.log(item);
      console.log(numOption);
      if (types === "radio" || types === "checkbox") {  
        if (numOption>= 3) {
          this.formData.options.splice(item, 1);
        } else {
          this.$message.error('选项至少有两项')
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
</style>