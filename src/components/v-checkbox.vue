<template>
  <transition name="slide">
    <div class="modal" v-show="showModalC">
      <div class="mask"></div>
      <div class="modal-dialog">
        <div class="modal-header">
          <span>多选题</span>
          <a href="JavaScript:;" class="icon-close" @click.self="close" @click="$emit('cancel')">x</a>
        </div>
        <div class="modal-body">
          <div class="form">
            <el-form :model="formDataC" ref="formDataC" label-width="100px" class="demo-dynamic">
              <el-form-item prop="content" label="题目" :rules="[{ required: true, message: '题目不能为空', trigger: 'blur' }]">
                <el-input v-model="formDataC.content"></el-input>
              </el-form-item>
              <el-form-item prop="title" :rules="[{ required: true, message: '题号不能为空', trigger: 'blur' }]">
                <el-input placeholder="请输入题号" v-model="formDataC.title">
                  <template slot="prepend">题号:</template>
                </el-input>
              </el-form-item>
              <el-form-item prop="order" :rules="[{ required: true, message: '题目序号不能为空', trigger: 'blur' }]">
                <el-input placeholder="请输入题目序号" v-model="formDataC.order" type="number"
                  oninput="if(value.length>2)value=value.slice(0,2)" min="0">
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
                <el-input v-model="formDataC.url " :disabled="isdisabled"></el-input>
                <el-select v-model="formDataC.Types" placeholder="选择类型" class="select-type">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <upload-vido @uploadUrl="handlUploadUrl"></upload-vido>
              </el-form-item>

              <!-- 选项内容 -->
              <div v-for="(option, index) in formDataC.options" :key="option.key">
                <el-form-item :label="'选项' +`${index+1}`" :prop="'options.' + index + '.content'"
                  :rules="[{ required: true, message: '选项不能为空', trigger: 'blur' }]">
                  <el-input v-model="option.content" placeholder="请输入选项内容"></el-input>
                  <el-button class="del" @click.prevent="removeDomain(index)">删除选项</el-button>
                </el-form-item>

                <el-form-item :prop="'options.' + index + '.title'"
                  :rules="[{ required: true, message: '选项编号不能为空', trigger: 'blur' }]">
                  <el-input placeholder="请输入选项编号" v-model="option.title">
                    <template slot="prepend">编号:</template>
                  </el-input>
                </el-form-item>
                <el-form-item :prop="'options.' + index + '.order'"
                  :rules="[{ required: true, message: '选项序号不能为空', trigger: 'blur' }]">
                  <el-input placeholder="请输入选项序号" type="number" :min="0" v-model="option.order">
                    <template slot="prepend">选项序号:</template>
                  </el-input>
                </el-form-item>

                <el-form-item :prop="'options.' + index + '.point'">
                  <el-input placeholder="需要流程控制请输入分值" type="number" v-model="option.point"
                    oninput="if(value.length>2)value=value.slice(0,3)" :min="0">
                    <template slot="prepend">分值:</template>
                  </el-input>
                </el-form-item>

                <!-- 选项多媒体 -->
                <!-- <el-form-item>
                  <el-popover
                    v-if="showVidoW"
                    class="btn-vido"
                    placement="top-start"
                    width="200"
                    trigger="hover"
                    content="这是切换为多媒体的为外链地址"
                  >
                    <el-button slot="reference" @click="changeWVido">切换为外链</el-button>
                  </el-popover>
                </el-form-item>-->

                <!-- 上传图片视频 -->
                <el-form-item label="多媒体链接" :prop="'options.' + index + '.url'">
                  <upload-fill v-model="option.url"></upload-fill>
                  <el-select v-model="option.type" placeholder="选择类型" class="select-type selecte-op">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item :prop="'options.' + index + '.url'">
                  <el-input placeholder="请输入链接" v-model="option.url" class="input-with-select">
                    <el-select
                      v-model="option.type"
                      slot="prepend"
                      placeholder="请选择类型"
                      class="select-type"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-input>
                </el-form-item>-->
              </div>
              <div class="modal-footer">
                <el-button type="primary" @click="submitForm('formDataC')">提交</el-button>
                <el-button @click="addDomain" v-if="types==='radio'||types==='checkbox'">新增选项</el-button>
                <el-button @click="resetForm('formDataC')">重置</el-button>
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
  import UploadFill from "@/components/UploadFill";
  import { UpdateQsInfo, GetQuestionInfo } from "../api/QS-edit";

  export default {
    components: { UploadVido, UploadFill },
    props: {
      showModal: {
        type: Boolean,
        default: false
      },
      types: {
        type: String
      },
      watchList: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      console.log(this.types);
    },
    watch: {
      showModal(newVal) {
        console.log(newVal);
        this.showModalC = newVal;
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
        showVido: false,
        showAddVido: false,
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
        showModalC: false,

        code: 1, //问卷的code
        formDataC: {
          title: "", //题号
          content: "", //题目
          order: 1,
          Types: 0, //题目类型（0：文本，1：图片，2：音频，3：视频）
          url: "", //多媒体内容链接
          options: [
            {
              code: "",
              title: "1",
              content: "",
              point: 0,
              order: 1,
              type: 0,
              url: ""
            },
            {
              code: "",
              title: "2",
              content: "",
              point: 0,
              order: 2,
              type: 0,
              url: ""
            },
            {
              code: "",
              title: "3",
              content: "",
              point: 0,
              order: 3,
              type: 0,
              url: ""
            }
          ]
        }
      };
    },
    mounted() {
      this.code = this.$route.params.code;
    },
    computed: {},
    methods: {
      close() {
        this.$refs.formDataC.resetFields();
        this.creatGroup = false;
        this.showVido = false;
      },
      handlUploadUrl(e) {
        console.log(e);
        this.formDataC.url = e;
        this.isdisabled = true;
        this.showVidoW = true;
      },
      //删除文件
      handleChange(file, fileList) {
        this.fileList = fileList.slice(-3);
      },
      //新增多媒体题目

      changeVido() {
        this.showVido = !this.showVido;
      },
      changeWVido() {
        this.isdisabled = false;
        this.showVidoW = false;
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let obj = {
              qnCode: this.code,
              code: "",
              order: this.formDataC.order,
              title: this.formDataC.title,
              content: this.formDataC.content,
              type: this.formDataC.Types,
              url: this.formDataC.url,
              answerType: 1, //在radio组件里面
              item: JSON.stringify(this.formDataC.options)
            };
            console.log(obj);
            UpdateQsInfo(obj).then(res => {
              console.log(res);
              if (res.data.code === 200) {
                this.changeNList = true;
                this.$emit("isChangeList", this.changeNList);
              }
            });
          } else {
            this.$message.info("有必填字段未填写，请完善！")
            return false;
          }
          this.showVido = false;
          this.$emit("showModalC", this.showModalC);
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.creatGroup = false;
      },
      removeDomain(item) {
        var types = this.types;
        let numOption = this.formDataC.options.length;
        console.log(item);
        console.log(numOption);
        if (types === "radio" || types === "checkbox") {
          if (numOption >= 3) {
            this.formDataC.options.splice(item, 1);
          } else {
            this.$message.error("选项至少有两项");
            return;
          }
        }
        console.log(item);
        // this.formDataC.options.splice(item, 1);
      },
      addDomain() {
        this.formDataC.options.push({
          code: "",
          title: "",
          content: "",
          point: 0,
          order: 4,
          type: 0,
          url: ""
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