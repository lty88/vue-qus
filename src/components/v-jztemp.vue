<template>
  <transition name="slide">
    <div class="modal" v-show="showModalJz">
      <div class="mask"></div>
      <div class="modal-dialog">
        <div class="modal-header">
          <span>矩阵题目</span>
          <a href="JavaScript:;" class="icon-close" @click.self="close" @click="$emit('cancel')">x</a>
        </div>
        <div class="modal-body">
          <div class="form">
            <el-form :model="formDataJz" ref="formDataJz" label-width="100px" class="demo-dynamic">
              <!-- 矩阵题目标题 -->
              <el-form-item prop="content" label="题目标题"
                :rules="[{ required: true, message: '题目题目不能为空', trigger: 'blur' }]">
                <el-input v-model="formDataJz.content"></el-input>
              </el-form-item>
              <el-form-item prop="title" :rules="[{ required: true, message: '题目题号不能为空', trigger: 'blur' }]">
                <el-input placeholder="请输入题号" v-model="formDataJz.title">
                  <template slot="prepend">题号:</template>
                </el-input>
              </el-form-item>
              <el-form-item prop="order" :rules="[{ required: true, message: '题目序号不能为空', trigger: 'blur' }]">
                <el-input placeholder="请输入序号" v-model="formDataJz.order" type="number"
                  oninput="if(value.length>2)value=value.slice(0,2)" :min="0">
                  <template slot="prepend">题目序号:</template>
                </el-input>
              </el-form-item>
              <!-- 多媒体标题 -->

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
                <el-input v-model="formDataJz.url " :disabled="isdisabled"></el-input>
                <el-select v-model="formDataJz.type" placeholder="选择类型" class="select-type">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <upload-vido @uploadUrl="handlUploadUrl"></upload-vido>
              </el-form-item>
              <el-form-item label="矩阵类型">
                <el-radio v-model="formDataJz.answerType" :label="3" border size="medium">单选矩阵</el-radio>
                <el-radio v-model="formDataJz.answerType" :label="4" border size="medium">多选矩阵</el-radio>
              </el-form-item>
              <!-- 矩阵行标题 -->
              <div class="title-box">
                <!-- 矩阵行标题 -->
                <div class="CluTitle Tbox">
                  <h2 class="hTit">左标题</h2>
                  <div class="CluTitle" v-for="(Cluoption, Cluindex) in formDataJz.subTitles" :key="Cluindex">
                    <el-form-item :prop="'subTitles.' + Cluindex + '.title'"
                      :rules="[{ required: true, message: '选项内容不能为空', trigger: 'blur' }]"
                      :label="'标题' +`${Cluindex+1}`">
                      <el-input v-model="Cluoption.title"></el-input>
                      <el-button @click.prevent="removeCluTitle(Cluindex)">删除</el-button>
                    </el-form-item>
                  </div>
                  <el-form-item>
                    <el-button @click.prevent="addCluTitle">新增选项</el-button>
                  </el-form-item>
                </div>
                <!-- 右选项 -->
                <div class="rowTitle Tbox">
                  <h2 class="hTit">右选项</h2>
                  <div class="listData" v-for="(Rowoption,Rowindex) in formDataJz.items" :key="Rowindex">
                    <el-form-item :prop="'items.' + Rowindex + '.content'" :label="'选项' +`${Rowindex+1}`"
                      :rules="[{ required: true, message: '选项内容不能为空', trigger: 'blur' }]">
                      <el-input v-model="Rowoption.content" placeholder="请输入选项内容"></el-input>
                      <el-button @click.prevent="removeRowTitle(Rowindex)">删除</el-button>
                    </el-form-item>

                    <el-form-item :prop="'items.' + Rowindex + '.title'"
                      :rules="[{ required: true, message: '选项内容不能为空', trigger: 'blur' }]">
                      <el-input placeholder="请输入选项号" v-model="Rowoption.title">
                        <template slot="prepend">选项号:</template>
                      </el-input>
                    </el-form-item>
                    <el-form-item :prop="'items.' + Rowindex + '.order'"
                      :rules="[{ required: true, message: '题目序号不能为空', trigger: 'blur' }]">
                      <el-input placeholder="请输入选项序号" v-model="Rowoption.order" type="number"
                        oninput="if(value.length>2)value=value.slice(0,2)" :min="0">
                        <template slot="prepend">选项序号:</template>
                      </el-input>
                    </el-form-item>
                    <el-form-item :prop="'items.' + Rowindex + '.point'">
                      <el-input placeholder="需要流程控制请输入分值" type="number" :min="0" v-model="Rowoption.point">
                        <template slot="prepend">分值:</template>
                      </el-input>
                    </el-form-item>
                  </div>

                  <el-form-item>
                    <el-button @click.prevent="addRowTitle">新增选项</el-button>
                  </el-form-item>
                </div>
              </div>
              <el-form-item class="modal-footer">
                <el-button id="submitFormBtn" type="primary" @click="submitForm('formDataJz')">提交</el-button>
                <el-button id="restFormBtn" @click="resetForm('formDataJz')">重置</el-button>
              </el-form-item>
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
      }
    },
    mounted() { },
    watch: {
      showModal(newVal, o) {
        console.log(newVal);
        console.log(o);
        this.showModalJz = newVal;
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
        showModalJz: false,
        showVido: false,
        showAddVido: false,
        showModals: false,
        code: 1, //问卷的code
        formDataJz: {
          code: "", //题号
          title: "", //题号
          content: "", //题目
          order: 1,
          type: 0, //题目类型（0：文本，1：图片，2：音频，3：视频）
          answerType: 3, //题目回答类型（0：单选，1：多选，2：文本录，3：单选矩阵，4：多选矩阵）
          url: "", //多媒体内容链接
          // 行选项
          items: [
            {
              code: "",
              title: "",
              content: "",
              point: 0,
              order: 1,
              type: 0,
              url: ""
            },
            {
              code: "",
              title: "",
              content: "",
              point: 0,
              order: 2,
              type: 0,
              url: ""
            },
            {
              code: "",
              title: "",
              content: "",
              point: 0,
              order: 3,
              type: 0,
              url: ""
            }
          ],
          subTitles: [
            {
              code: "",
              title: ""
            },
            {
              code: "",
              title: ""
            },
            {
              code: "",
              title: ""
            }
          ]
        }
      };
    },
    mounted() {
      this.code = this.$route.params.code;
    },
    methods: {
      handlUploadUrl(e) {
        console.log(e);
        this.formDataJz.url = e;
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
      //退出时候清重置表单
      close() {
        this.$refs.formDataJz.resetFields();
        this.creatGroup = false;
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
            let obj = {
              code: this.formDataJz.code,
              qnCode: this.code,
              order: this.formDataJz.order,
              title: this.formDataJz.title,
              content: this.formDataJz.content,
              type: this.formDataJz.type,
              url: this.formDataJz.url,
              answerType: this.formDataJz.answerType,
              subTitles: JSON.stringify(this.formDataJz.subTitles),
              item: JSON.stringify(this.formDataJz.items)
            };
            console.log(obj);
            UpdateQsInfo(obj).then(res => {
              console.log(res);
              if (res.data.code === 200) {
                this.changeNList = true;
                this.$emit("isChangeList", this.changeNList)
              }
            });
          } else {
            console.log("error submit!!");
            this.$message.info("有必填字段未填写，请完善！")
            return false;
          }
          this.showVido = false;
          this.$emit("showjz", this.showModalJz);
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.creatGroup = false;
      },
      removeRowTitle(Rowitem) {
        // debugger
        let numLength = this.formDataJz.items.length;
        console.log(numLength);
        if (numLength > 3) {
          this.formDataJz.items.splice(Rowitem, 1);
        } else {
          this.$message.error("选项至少有三项");
          return;
        }
      },
      removeCluTitle(item) {
        let numLength = this.formDataJz.subTitles.length;
        if (numLength > 3) {
          this.formDataJz.subTitles.splice(item, 1);
        } else {
          this.$message.error("选项至少有三项");
          return;
        }
      },
      addRowTitle() {
        this.formDataJz.items.push({
          code: "",
          title: "",
          content: "",
          point: 0,
          order: 4,
          type: 0,
          url: ""
        });
      },
      addCluTitle() {
        this.formDataJz.subTitles.push({
          code: "",
          title: ""
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
  @import "../style/v-jztemp.scss";
</style>