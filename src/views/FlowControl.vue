<template>
    <div class="modal">
        <div class="mask"></div>
        <div class="modal-dialog">
            <div class="modal-header">
                <span>问卷流程控制</span>
                <a href="JavaScript:;" class="icon-close" @click="cancel">x</a>
            </div>
            <div class="modal-body">
                <div class="form">
                    <el-form :model="formData" ref="formData" label-width="100px" class="demo-dynamic">
                        <el-form-item label="跳转方式：" :label-width="formLabelWidth">
                            <el-radio-group v-model="formData.methodsControl" @change.native="ChangeMethods">
                                <el-radio :label="0" border size="medium">选项跳转</el-radio>
                                <el-radio :label="1" border size="medium">累计得分跳转</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <!-- 题目 -->
                        <el-form-item label="题目：" :label-width="formLabelWidth" prop="fromTitle">
                            <el-select @change="showItems" v-model="formData.fromTitle" placeholder="请选择">
                                <el-option v-for="(item,index) in formData.dataOption" :key="index" :label="item.title"
                                    :value="item.code">
                                    <span style="float: left">{{item.title}}</span>
                                    <span style="float: right;" class="desc-title"
                                        :title="item.content">{{ item.content }}</span></el-option>
                            </el-select>
                        </el-form-item>
                        <!-- 选项跳转 分数跳转 -->
                        <el-form-item v-if="flagT==0" label="选项：" :label-width="formLabelWidth" prop="ItemTitle">
                            <el-select v-model="formData.ItemTitle" placeholder="请选择要跳转到的选项" @change="$forceUpdate()">
                                <el-option v-for="item in formData.itemCode" :key="item.code" :label="item.title"
                                    :value="item.code">
                                    <span style="float: left">{{item.title}}</span>
                                    <span style="float: right;" class="desc-title" :title="item.content">{{ item.content }}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="flagT==1" label="分数：" :label-width="formLabelWidth" prop="score">
                            <el-input class="ipt" placeholder="请选择累计分数" type="number" v-model="formData.score">
                            </el-input>
                        </el-form-item>
                        <!-- 跳转到 -->
                        <el-form-item label="跳转到：" prop="toTitle">
                            <el-select v-model="formData.toTitle" placeholder="跳转到" @change="$forceUpdate()">
                                <el-option v-for="(item,index) in formData.dataOption" :key="index" :label="item.title"
                                    :value="item.code">
                                    <span style="float: left">{{item.title}}</span>
                                    <span style="float: right;" class="desc-title"
                                        :title="item.content">{{ item.content }}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('formData')">提交</el-button>
                            <el-button @click="resetForm('formData')">重置</el-button>
                        </el-form-item>
                    </el-form>
                    <!-- 表格 -->
                    <el-table :data="tableData" height="250" border align="center" style="width: 100%">
                        <el-table-column type="index" label="序号"></el-table-column>
                        <el-table-column align="center" prop="type" label="跳转方式">
                            <template
                                slot-scope="scope">{{ scope.row.type === 0 ? '选项跳转' : scope.row.type == 1?'累计得分跳转': '' }}</template>
                        </el-table-column>
                        <el-table-column align="center" prop="questionTitle" label="题目"></el-table-column>
                        <el-table-column align="center" prop="itemTitle" label="题目选项"></el-table-column>
                        <el-table-column align="center" prop="point" label="累计分数">
                            <template slot-scope="scope">{{ scope.row.point/100}}</template>
                        </el-table-column>
                        <el-table-column align="center" prop="nextQuestionTitle" label="下一题目"></el-table-column>
                        <el-table-column align="center" prop="address" label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">
                                    Delete</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        getCondition,
        addCondition,
        deleteCondition
    } from "../api/Condition";
    import {
        GetQuestionInfo
    } from "../api/QS-edit";

    export default {
        mounted() { },
        data() {
            return {
                flagT: 0,
                flagP: false,
                formLabelWidth: "100px",
                ShowControlModal: this.ControlModal,
                code: 1,
                tableData: [],
                toTitle: "",
                fromTitle: "",
                formData: {
                    methodsControl: 0, //跳转方式
                    score: 1, //累计分数
                    dataOption: [], //题目title
                    fromTitle: 1, //跳转题目
                    ItemTitle: '', //跳转选项
                    itemCode: [], //选项title
                    toTitle: 1 //跳转到
                }
            };
        },

        created() {
            this.code = this.$route.params.code;
        },
        mounted() {
            console.log(this.code);
            this.fetchControlData();
            this.fetchQuestionInfo();
        },
        methods: {
            //控制跳转方式
            ChangeMethods(e) {
                console.log(e.target.value);
                this.flagT = e.target.value;
            },
            //计算选项跳转
            showItems(code) {
                let questions = this.formData.dataOption.filter(item => {
                    return item.code == code;
                });
                console.log(questions[0].items);
                this.formData.itemCode = questions[0].items;
            },
            // 获取流程控制的数据并展示到table里面
            fetchControlData() {
                getCondition({
                    qnCode: this.code
                }).then(res => {
                    console.log(res.data.obj);
                    this.tableData = res.data.obj;
                });
            },
            //获取问卷题目信息
            fetchQuestionInfo() {
                GetQuestionInfo({
                    qnCode: this.code
                }).then(res => {
                    this.formData.dataOption = res.data.obj;
                    console.log(this.formData.dataOption);
                });
            },
            //删除table里面流程
            handleDelete(id, row) {
                console.log(id, row);
                deleteCondition({
                    id: row.id
                }).then(res => {
                    this.fetchControlData();
                    console.log(res);
                });
            },
            //提交表单
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        //选项跳转
                        if (this.formData.methodsControl == 0) {
                            let obj0 = {
                                qnCode: this.code,
                                conditionType: this.formData.methodsControl,
                                questionCode: this.formData.fromTitle,
                                score: "",
                                itemCode: this.formData.ItemTitle,
                                nextQuestionCode: this.formData.toTitle
                            };
                            addCondition(obj0).then(res => {
                                if (res.data.code == 200) {
                                    this.$message.success(res.data.msg);
                                    this.fetchControlData();
                                } else {
                                    this.$message.errror(res.data.msg);
                                }
                                console.log(res);
                            });
                        } //分数跳转
                        else {
                            let obj1 = {
                                qnCode: this.code,
                                conditionType: this.formData.methodsControl,
                                questionCode: this.formData.fromTitle,
                                itemCode: "",
                                score: this.formData.score,
                                nextQuestionCode: this.formData.toTitle
                            };
                            addCondition(obj1).then(res => {
                                if (res.data.code == 200) {
                                    this.$message.success(res.data.msg);
                                    this.fetchControlData();
                                } else {
                                    this.$message.errror(res.data.msg);
                                }
                                console.log(res);
                            });
                        }
                    }
                });
            },
            resetForm(formName) {
                console.log("resetForm");
                this.$refs[formName].resetFields();
                this.creatGroup = false;
            },
            cancel() {
                this.$router.push("/");
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../assets/config.scss";
    @import "../assets/mixin.scss";
    @import "../assets/modal.scss";
    @import "../assets/button.scss";

    .modal {
        position: fixed;
        top: 65px !important;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10;
        transition: all 0.5s;
        transition: all 0.5s;
    }

    .modal-dialog {
        width: 98.9rem !important;
    }

    .modal-body {
        max-height: 700px !important;
        overflow-y: auto !important;
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

    .ipt {
        width: 40% !important;
    }

    .desc-title {
        margin-left: 10px;
        width: 300px;
        color: #8492a6;
        font-size: 13px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
</style>