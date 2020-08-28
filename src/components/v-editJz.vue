<template>
<transition name="slide" v-if="formDataJz.answerType===3||formDataJz.answerType===4">
    <div class="modal" v-show="showModal">
        <div class="mask"></div>
        <div class="modal-dialog">
            <div class="modal-header">
                <span>{{getMsg(formDataJz.answerType)}}</span>
                <a href="JavaScript:;" class="icon-close" @click="$emit('canceljz')">x</a>
            </div>
            <div class="modal-body">
                <div class="form">
                    <el-form :model="formDataJz" ref="formDataJz" label-width="100px" class="demo-dynamic">
                        <!-- 矩阵题目标题 -->
                        {{this.formDataJz}}
                        <el-form-item prop="title" label="题目标题" :rules="[{ required: true, message: '题目题目不能为空', trigger: 'blur' }]">
                            <el-input v-model="formDataJz.content"></el-input>
                            <el-input placeholder="请输入题号" v-model="formDataJz.title">
                                <template slot="prepend">题号:</template>
                            </el-input>
                            <el-input placeholder="请输入题号" v-model="formDataJz.order">
                                <template slot="prepend">题目序号:</template>
                            </el-input>
                            <!-- 多媒体标题 -->
                            <br />
                            <el-popover class="btn-vido" placement="top-start" width="200" trigger="hover" content="这是切换为多媒体的题目">
                                <el-button slot="reference" @click="changeVido">多媒体题目</el-button>
                            </el-popover>
                            <el-popover class="btn-vido" placement="top-start" width="200" trigger="hover" content="这是切换为多媒体的题目">
                                <el-button slot="reference" @click="addVido">上传多媒体</el-button>
                            </el-popover>
                        </el-form-item>
                        <!-- 上传图片视频 -->
                        <el-form-item v-if="showVido" prop="titleUrl" label="多媒体链接">
                            <el-input v-model="formDataJz.url"></el-input>
                            <el-select v-model="formDataJz.type" placeholder="选择类型" class="select-type">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                            <el-button @click.prevent="removeTitleUrl()">删除</el-button>
                        </el-form-item>

                        <el-upload v-if="showAddVido" class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-change="handleChange">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>

                        <!-- 矩阵行标题 -->
                        <div class="title-box">
                            <div class="title-box">
                                <!-- 矩阵行标题 -->
                                <div class="CluTitle Tbox">
                                    <h2 class="hTit">左标题</h2>
                                    <div class="CluTitle" v-for="(Cluoption, Cluindex) in formDataJz.subTitles" :key="Cluindex">
                                        <el-form-item :prop="'subTitles.' + Cluindex + '.title'" :rules="[{ required: true, message: '选项内容不能为空', trigger: 'blur' }]" :label="'标题' +`${Cluindex+1}`">
                                            <el-input v-model="Cluoption.title"></el-input>
                                            <el-button @click.prevent="removeCluTitle(Cluindex)">删除</el-button>
                                        </el-form-item>
                                    </div>
                                    <el-form-item>
                                        <el-button @click.prevent="addCluTitle">新增选项</el-button>
                                    </el-form-item>
                                </div>
                                <div class="rowTitle Tbox">
                                    <h2 class="hTit">右选项</h2>
                                    <div class="listData" v-for="(Rowoption,Rowindex) in formDataJz.items" :key="Rowindex">
                                        <el-form-item :prop="'items.' + Rowindex + '.content'" :label="'选项' +`${Rowindex+1}`" :rules="[{ required: true, message: '选项内容不能为空', trigger: 'blur' }]">
                                            <el-input v-model="Rowoption.content" placeholder="请输入选项内容"></el-input>
                                            <el-button @click.prevent="removeRowTitle(Rowindex)">删除</el-button>
                                        </el-form-item>

                                        <el-form-item :prop="'items.' + Rowindex + '.title'" :rules="[{ required: true, message: '选项内容不能为空', trigger: 'blur' }]">
                                            <el-input placeholder="请输入选项号" v-model="Rowoption.title">
                                                <template slot="prepend">选项号:</template>
                                            </el-input>
                                        </el-form-item>
                                        <el-form-item :prop="'items.' + Rowindex + '.order'" :rules="[{ required: true, message: '题目序号不能为空', trigger: 'blur' }]">
                                            <el-input placeholder="请输入选项序号" v-model="Rowoption.order" type="number" oninput="if(value.length>2)value=value.slice(0,2)" min="0">
                                                <template slot="prepend">选项序号:</template>
                                            </el-input>
                                        </el-form-item>
                                        <el-form-item :prop="'items.' + Rowindex + '.point'" :rules="[{ required: true, message: '选项内容不能为空', trigger: 'blur' }]">
                                            <el-input placeholder="需要流程控制请输入分值" type="number" v-model="Rowoption.point">
                                                <template slot="prepend">分值:</template>
                                            </el-input>
                                        </el-form-item>
                                        <!-- 选项多媒体 -->
                                        <el-form-item :prop="'items.' + Rowindex + '.url'">
                                            <el-input placeholder="请输入链接" v-model="Rowoption.url" class="input-with-select">
                                                <el-select v-model="Rowoption.type" slot="prepend" placeholder="请选择类型">
                                                    <el-option label="文本" value="0"></el-option>
                                                    <el-option label="图片" value="1"></el-option>
                                                    <el-option label="视频" value="2"></el-option>
                                                    <el-option label="音频" value="3"></el-option>
                                                </el-select>
                                            </el-input>
                                        </el-form-item>
                                    </div>

                                    <el-form-item>
                                        <el-button @click.prevent="addRowTitle">新增选项</el-button>
                                    </el-form-item>
                                </div>
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
import {
    UpdateQsInfo
} from "../api/QS-edit";
export default {
    props: {
        showModal: {
            type: Boolean,
            default: false
        },
        formDataJz: {
            type: Object,
            default: function () {
                return {};
            }
        }
    },
    mounted() {},
    data() {
        return {
            dataList: this.editQsList,
            // showModal:this.show,
            options: [{
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
            showModals: this.showModal,
            code: 1
            //   formDataJz: {
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
        console.log(this.showModal);
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
                        code: this.formDataJz.code,
                        answerType: this.formDataJz.answerType,
                        title: this.formDataJz.title,
                        content: this.formDataJz.content,
                        type: this.formDataJz.type,
                        url: this.formDataJz.url,
                        subTitles: JSON.stringify(this.formDataJz.subTitles),
                        items: JSON.stringify(this.formDataJz.items)
                    };
                    console.log(obj);
                    UpdateQsInfo(obj).then(res => {
                        console.log(res);
                        if (res.data.code === 200) {
                            console.log(res.data.msg);
                        }
                        this.$emit("EditShowModalJz", this.showModal);
                    });
                    // this.$emit("formDataJz", this.formDataJz);
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
            console.log(numLength);
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
                order: "",
                title: "",
                content: "",
                url: "",
                type: "",
                point: ""
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
