<template>
  <transition name="slide">
    <div class="modal" v-show="showModalT">
      <div class="mask"></div>
      <div class="modal-dialog">
        <div class="modal-header">
          <span>文本题目</span>
          <a href="JavaScript:;" class="icon-close" @click.self="close" @click="$emit('cancel')">x</a>
        </div>
        <div class="modal-body">
          <div class="form">
            <el-form :model="formDataT" ref="formDataT" label-width="100px" class="demo-dynamic">
              <el-form-item prop="content" label="题目" :rules="[{ required: true, message: '题目不能为空', trigger: 'blur' }]">
                <el-input v-model="formDataT.content"></el-input>
              </el-form-item>
              <el-form-item prop="title" :rules="[{ required: true, message: '题号不能为空', trigger: 'blur' }]">
                <el-input placeholder="请输入题号" v-model="formDataT.title">
                  <template slot="prepend">题号:</template>
                </el-input>
              </el-form-item>
              <el-form-item prop="order" :rules="[{ required: true, message: '题目序号不能为空', trigger: 'blur' }]">
                <el-input placeholder="请输入序号" v-model="formDataT.order" type="number"
                  oninput="if(value.length>2)value=value.slice(0,2)" :min="0">
                  <template slot="prepend">题目序号:</template>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-popover class="btn-vido" placement="top-start" width="200" trigger="hover" content="这是切换为多媒体的题目">
                  <el-button slot="reference" @click="changeVido">多媒体题目</el-button>
                </el-popover>
                <el-popover v-if="showVidoW" class="btn-vido" placement="top-start" width="200" trigger="hover"
                  content="这是切换为多媒体的为外链地址">
                  <el-button slot="reference" @click="changeWVido">切换为外链</el-button>
                </el-popover>
              </el-form-item>

              <!-- 上传图片视频 -->
              <el-form-item v-if="showVido" label="多媒体链接" prop="url">
                <el-input v-model="formDataT.url " :disabled="isdisabled"></el-input>
                <el-select v-model="formDataT.Types" placeholder="选择类型" class="select-type" prop="Types">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <upload-vido @uploadUrl="handlUploadUrl"></upload-vido>
              </el-form-item>

              <div class="modal-footer">
                <el-button type="primary" @click="submitForm('formDataT')">提交</el-button>
                <el-button @click="resetForm('formDataT')">重置</el-button>
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import UploadVido from "@/components/UploadVido";
  import { UpdateQsInfo } from "../api/QS-edit";
  export default {
    components: { UploadVido },
    props: {
      showModal: {
        type: Boolean,
        default: false
      },
      types: {
        type: String
      },
      changeList: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      this.code = this.$route.params.code;
    },
    watch: {
      showModal(newVal) {
        this.showModalT = newVal;
      },
      types(newVal) {
        this.formDataT.type = this.types;
      },
      changeList(newValue) {
        this.changeNList = newValue
      }
    },

    data() {
      return {
        showVidoW: false,
        isdisabled: false,
        changeNList: false,
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
        fileList: [],
        showVido: false,
        showAddVido: false,
        showModalT: false,
        formDataT: {
          title: "", //题号
          content: "", //题目
          order: 1,
          Types: 0, //题目类型（0：文本，1：图片，2：音频，3：视频）
          url: "" //多媒体内容链接
        }
      };
    },
    methods: {
      //新增多媒体题目
      handlUploadUrl(e) {
        console.log(e);
        this.formDataT.url = e;
        this.isdisabled = true;
        this.showVidoW = true;
      },
      changeWVido() {
        this.isdisabled = false;
        this.showVidoW = false;
      },
      close() {
        this.$refs.formDataT.resetFields();
        this.creatGroup = false;
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.creatGroup = false;
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
        this.$refs[formName].validate((valid, object) => {
          if (valid) {
            let obj = {
              qnCode: this.code,
              code: "",
              title: this.formDataT.title,
              order: this.formDataT.order,
              content: this.formDataT.content,
              type: this.formDataT.Types,
              url: this.formDataT.url,
              answerType: 2 //在radio组件里面
            };
            UpdateQsInfo(obj).then(res => {
              console.log(res);
              if (res.data.code === 200) {
                this.changeNList = true;
                this.$emit("isChangeList", this.changeNList);
              }
            });
          } else {
            this.$message.info("有必填字段未填写，请完善！")
            return false
          }
          this.resetForm(formName);
          this.showVido = false;
          this.$emit("showModalT", this.showModalT);
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
  @import "../style/v-addStyle.scss";
</style>