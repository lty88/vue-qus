<template>
<transition name="slide">
    <div class="modal" v-show="showR">
        <div class="mask"></div>
        <div class="modal-dialog">
            <div class="modal-header">
                <span>单选题</span>
                <a href="JavaScript:;" class="icon-close" @click.self="close" @click="$emit('cancel')">x</a>
            </div>
            <div class="modal-body">
                <div class="form">
                    <el-form :model="formData" ref="formData" label-width="100px" class="demo-dynamic">
                        <el-form-item prop="content" label="题目" :rules="[{ required: true, message: '题目不能为空', trigger: 'blur' }]">
                            <el-input v-model="formData.content"></el-input>
                        </el-form-item>
                        <el-form-item prop="title" :rules="[{ required: true, message: '题号不能为空', trigger: 'blur' }]">
                            <el-input placeholder="请输入题号" v-model="formData.title">
                                <template slot="prepend">题号:</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="order" :rules="[{ required: true, message: '题目序号不能为空', trigger: 'blur' }]">
                            <el-input placeholder="请输入题目序号" v-model="formData.order" type="number" oninput="if(value.length>2)value=value.slice(0,2)" min="0">
                                <template slot="prepend">题目序号:</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label>
                            <el-popover class="btn-vido" placement="top-start" width="200" trigger="hover" content="这是切换为多媒体的题目">
                                <el-button slot="reference" @click="changeVido">多媒体题目</el-button>
                            </el-popover>
                            <el-popover class="btn-vido" placement="top-start" width="200" trigger="hover" content="这是切换为多媒体的题目">
                                <el-button slot="reference" @click="addVido">上传多媒体</el-button>
                            </el-popover>
                        </el-form-item>

                        <!-- 上传图片视频 -->
                        <el-form-item v-if="showVido" label="多媒体链接" prop="url">
                            <el-input v-model="formData.url "></el-input>
                            <el-select v-model="formData.Types" placeholder="选择类型" class="select-type">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                            <!-- <el-button @click.prevent="removeTitleUrl()">删除</el-button> -->
                        </el-form-item>
                        <el-upload v-if="showAddVido" class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-change="handleChange" :headers="headerObj">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                        <!-- 选项内容 -->
                        <div v-for="(option, index) in formData.options" :key="option.key">
                            <el-form-item :label="'选项' +`${index+1}`" :prop="'options.' + index + '.content'" :rules="[{ required: true, message: '选项内容不能为空', trigger: 'blur' }]">
                                <el-input v-model="option.content" placeholder="请输入选项内容"></el-input>
                                <el-button class="del" @click.prevent="removeDomain(index)">删除选项</el-button>
                            </el-form-item>

                            <el-form-item :prop="'options.' + index + '.title'" :rules="[{ required: true, message: '选项号不能为空', trigger: 'blur' }]">
                                <el-input placeholder="请输入选项号" v-model="option.title">
                                    <template slot="prepend">选项号:</template>
                                </el-input>
                            </el-form-item>
                            <el-form-item :prop="'options.' + index + '.order'" :rules="[{ required: true, message: '选项序号不能为空', trigger: 'blur' }]">
                                <el-input placeholder="请输入选项序号" type="number" v-model="option.order">
                                    <template slot="prepend">选项序号:</template>
                                </el-input>
                            </el-form-item>
                            <el-form-item :prop="'options.' + index + '.point'">
                                <el-input placeholder="需要流程控制请输入分值" type="number" v-model="option.point" oninput="if(value.length>2)value=value.slice(0,3)" min="0">
                                    <template slot="prepend">分值:</template>
                                </el-input>
                            </el-form-item>
                            <!-- 选项多媒体 -->
                            <el-form-item :prop="'options.' + index + '.url'">
                                <el-input placeholder="请输入链接" v-model="option.url" class="input-with-select">
                                    <el-select v-model="option.type" slot="prepend" placeholder="请选择类型" class="select-type">
                                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </el-input>
                            </el-form-item>
                        </div>
                        <el-form-item class="modal-footer">
                            <el-button type="primary" @click="submitForm('formData')">提交</el-button>
                            <el-button @click="addDomain" v-if="types==='radio'||types==='checkbox'">新增选项</el-button>
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
import {
    UpdateQsInfo
} from "../api/QS-edit";
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        watchList: {
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
        show(newVal, o) {
            console.log(newVal);
            console.log(o);
            this.showR = newVal;
        },
        types(newVal) {
            this.formData.type = this.types;
        },
        wlist(newValue) {
            this.$emit("isChangeList", this.wlist, this.showR);
        }
    },
    data() {
        return {
            itemsAddVidoShow: false,
            wlist: this.watchList,
            showR: false,
            headerObj: {
                Authorization: window.sessionStorage.getItem("token")
            }, //图片上传时手动设置请求头请求对象
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
                    label: "音频"
                },
                {
                    value: 3,
                    label: "视频"
                }
            ],
            showVido: false,
            showAddVido: false,
            showModals: false,
            code: 1,
            formData: {
                title: "", //题号
                content: "", //题目
                order: 0,
                Types: 0, //题目类型（0：文本，1：图片，2：音频，3：视频）
                url: "", //多媒体内容链接
                options: [{
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
                        title: " 3",
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
    methods: {
        //删除文件
        handleChange(file, fileList) {
            this.fileList = fileList.slice(-3);
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
        //取消按钮重置表单
        close() {
            this.$refs.formData.resetFields();
            this.creatGroup = false;
        },
        //提交表单
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    console.log(this.formData);
                    let obj = {
                        qnCode: this.code,
                        code: "",
                        order: this.formData.order,
                        title: this.formData.title,
                        content: this.formData.content,
                        type: this.formData.Types,
                        url: this.formData.url,
                        answerType: 0, //在radio组件里面
                        item: JSON.stringify(this.formData.options)
                    };
                    console.log(obj);
                    UpdateQsInfo(obj).then(res => {
                        console.log(res);
                        if (res.data.code === 200) {
                            this.wlist = true;
                        }
                        this.resetForm(formName);
                    });
                } else {
                    console.log("error submit!!");
                    return false;
                    this.resetForm(formName);
                }
                this.$emit("shows", this.showR);
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.creatGroup = false;
        },
        removeDomain(item) {
            var types = this.types;
            let numOption = this.formData.options.length;
            console.log(item);
            console.log(numOption);
            if (types === "radio" || types === "checkbox") {
                if (numOption >= 3) {
                    this.formData.options.splice(item, 1);
                } else {
                    this.$message.error("选项至少有两项");
                    return;
                }
            }
            console.log(item);
        },
        addDomain() {
            this.formData.options.push({
                code: "",
                title: "4",
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
// .modal-dialog {
//   width: 100rem !important;

// }
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
