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
              </el-form-item>
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
      this.formDataJz.type = this.types;
    }
  },
  data() {
    return {
      showModals: false,
      formDataJz: {
        num: "",
        title: "",
        type: this.types,
        isNeed: true,
        isRadioJz: true,
        jzOptions: [{ name: "" }, { name: "" }, { name: "" }],
        jzTitle: [{ title: "" }, { title: "" }, { title: "" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //   console.log(this.formDataJz);
          this.$emit("formDataJz", this.formDataJz);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
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
@import "../assets/modal.scss";
@import "../assets/button.scss";
@import "../style/Jztemp.scss";
</style>