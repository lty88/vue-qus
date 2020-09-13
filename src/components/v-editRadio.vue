<template>
<transition name="slide" v-if="formData.answerType===0||formData.answerType===1||formData.answerType===2">
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
                        <!-- {{formData}} -->
                        <el-form-item prop="content" label="题目" :rules="[{ required: true, message: '题目不能为空', trigger: 'blur' }]">
                            <el-input v-model="formData.content"></el-input>
                        </el-form-item>
                        <el-form-item prop="title" :rules="[{ required: true, message: '题目不能为空', trigger: 'blur' }]">
                            <el-input placeholder="请输入题号" v-model="formData.title">
                                <template slot="prepend">题号:</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="order" :rules="[{ required: true, message: '题目序号不能为空', trigger: 'blur' }]">
                            <el-input placeholder="请输入题目序号" v-model="formData.order" type="number" oninput="if(value.length>2)value=value.slice(0,2)" min="0">
                                <template slot="prepend">题目序号:</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-popover class="btn-vido" placement="top-start" width="200" trigger="hover" content="这是切换为多媒体的题目">
                                <el-button slot="reference" @click="changeVido">多媒体题目</el-button>
                            </el-popover>
                            <el-popover class="btn-vido" placement="top-start" width="200" trigger="hover" content="这是切换为多媒体的题目">
                                <el-button slot="reference" @click="addVido">上传多媒体</el-button>
                            </el-popover>
                        </el-form-item>

                        <!-- 上传图片视频 -->
                        <el-form-item prop="url" v-if="showVido" label="多媒体链接">
                            <el-input placeholder="请输入链接" v-model="formData.url" class="input-with-select"></el-input>
                            <el-form-item label="选择类型" style="margin-top:20px ;">
                                <el-radio v-model="formData.type" :label="0" border size="medium">文本</el-radio>
                                <el-radio v-model="formData.type" :label="1" border size="medium">图片</el-radio>
                                <el-radio v-model="formData.type" :label="2" border size="medium">音频</el-radio>
                                <el-radio v-model="formData.type" :label="3" border size="medium">视频</el-radio>
                            </el-form-item>
                        </el-form-item>

                        <!-- 选项内容radio跟CheckBox的选项内容的修改 -->

                        <div v-if="formData.answerType===0||formData.answerType===1">
                            <div class="list" v-for="(option, index) in formData.items" :key="option.key">
                                <el-form-item :label="'选项' +`${index+1}`" :prop="'items.' + index + '.content'" :rules="[{ required: true, message: '选项不能为空', trigger: 'blur' }]">
                                    <el-input v-model="option.content" placeholder="请输入选项内容"></el-input>
                                    <el-button class="del" @click.prevent="removeDomain(index)">删除选项</el-button>
                                </el-form-item>
                                <el-form-item :prop="'items.' + index + '.title'" :rules="[{ required: true, message: '选项号不能为空', trigger: 'blur' }]">
                                    <el-input placeholder="请输入选项号" v-model="option.title">
                                        <template slot="prepend">选项号:</template>
                                    </el-input>
                                </el-form-item>
                                <el-form-item :prop="'items.' + index + '.order'" :rules="[{ required: true, message: '选项序号不能为空', trigger: 'blur' }]">
                                    <el-input placeholder="请输入选项序号" v-model="option.order">
                                        <template slot="prepend">选项序号:</template>
                                    </el-input>
                                </el-form-item>
                                <el-form-item :prop="'items.' + index + '.point'">
                                    <el-input placeholder="需要流程控制请输入分值" type="number" oninput="if(value.length>2)value=value.slice(0,2)" :min="0" v-model="option.point">
                                        <template slot="prepend">分值:</template>
                                    </el-input>
                                </el-form-item>

                                <!-- 选项多媒体 -->
                                <el-form-item>
                                    <el-popover class="btn-vido" placement="top-start" width="200" trigger="hover" content="这是切换为多媒体的题目">
                                        <el-button slot="reference" @click="changeItemVido">多媒体选项</el-button>
                                    </el-popover>
                                </el-form-item>

                                <el-form-item v-show="showItemVido" class="btn-vido">
                                    <el-form-item label="选择类型" style="margin-bottom:20px ;">
                                        <el-radio v-model="option.type" :label="0" border size="medium">文本</el-radio>
                                        <el-radio v-model="option.type" :label="1" border size="medium">图片</el-radio>
                                        <el-radio v-model="option.type" :label="2" border size="medium">音频</el-radio>
                                        <el-radio v-model="option.type" :label="3" border size="medium">视频</el-radio>
                                    </el-form-item>
                                    <el-input placeholder="请输入链接" v-model="option.url" class="input-with-select">
                                        <template slot="prepend">链接:</template>
                                    </el-input>
                                </el-form-item>
                            </div>
                        </div>
                        <el-form-item class="modal-footer">
                            <el-button type="primary" @click="submitForm('formData')">提交</el-button>
                            <el-button @click="addDomain">新增选项</el-button>
                            <!-- <el-button @click="resetForm('formData')">重置</el-button> -->
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
        formData: {
            type: Object,
            default: function () {
                return {};
            }
        },
    },

    data() {
        return {
            // value: "文本",
            showItemVido: false,
            typeOptions: [{
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
            code: 1,
            editFormData: this.formData
            // editFormData: {
            //     title: "", //题号
            //     type: "0",
            //     content: "", //题目
            //     order: 100,
            //     Types: 0, //题目类型（0：文本，1：图片，2：音频，3：视频）
            //     url: "", //多媒体内容链接
            //     options: [{
            //             code: "",
            //             title: "",
            //             content: "",
            //             point: 1,
            //             order: 100
            //         },
            //         {
            //             code: "",
            //             title: "",
            //             content: "",
            //             point: 1,
            //             order: 200
            //         },
            //         {
            //             code: "",
            //             title: "",
            //             content: "",
            //             point: 1,
            //             order: 300
            //         }
            //     ]
            // }
        };
    },
    
    mounted() {
        console.log(this.point());
        this.code = this.$route.params.code;
        console.log(this.code);
      
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
        point() {

            console.log(this.editFormData);
            // this.formData.forEach(q => {
            //     console.log(q);
            //     // if (this.formData.items.length != 0) {
            //     //     this.formData.items.forEach(item => {
            //     //         p = (item.point) / 100
            //     //     })
            //     //     console.log(p);
            //     // }
            // })

        },
        changeVido() {
            this.showVido = !this.showVido;
        },
        //上传多媒体题目
        addVido() {
            this.showAddVido = !this.showAddVido;
        },
        changeItemVido() {
            this.showItemVido = !this.showItemVido;
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
                        order: this.formData.order,
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
                    // this.$refs[formName].resetFields();
                    // this.creatGroup = false;
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        // resetForm(formName) {
        //     this.$refs[formName].resetFields();
        //     this.creatGroup = false;
        // },
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
