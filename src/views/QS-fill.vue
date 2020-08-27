<template>
<el-container id="fill-container">
    <!--渲染数据-->
    <el-main class="content">
        <el-page-header @click.native="goBack"></el-page-header>
        <div class="questions" v-for="(qs, index) in qsItem" :key="index">
            <div class="qs-left">
                <div class="demo-image__placeholder">
                    <div class="block">
                        <p class="qs-title">{{`${index+1}`}}.&nbsp;{{ getMsg(qs)}}&nbsp;&nbsp;{{ qs.content}}</p>
                        <el-image class="titleImg" v-if="qs.type===1" :src="qs.url"></el-image>
                        <!-- <vido-player v-if="qs.type===3||qs.type===2"></vido-player> -->
                        <div class="video-bg" @click="showSlide='slideDown'" v-if="qs.type===3||qs.type===2"></div>
                        <div class="video-box" v-show="showSlide" v-if="qs.type===3||qs.type===2">
                            <div class="overlay"></div>
                            <div class="video" :class="showSlide">
                                <span class="icon-close" @click="closeVideo">x</span>
                                <video :src="`${qs.url}`" muted autoplay controls="controls"></video>
                            </div>
                        </div>
                    </div>
                </div>
                <p v-for="item in qs.items" class="option" :key="item.code">
                    <label>
                        <div v-if="qs.answerType === 0">
                            <input type="radio" :name="qs.code" :value="item.code" v-model="qs.answer" />
                            <span class="item-content">{{item.content}}</span>
                        </div>
                        <div v-if="qs.answerType === 1">
                            <input type="checkbox" :value="item.code" v-model="qs.answer" />
                            <span class="item-content">{{item.content}}</span>
                        </div>
                    </label>
                </p>
                <textarea v-if="qs.answerType === 2" v-model="qs.answer"></textarea>

                <!-- 矩阵题-->
                <div class="wjdc_list">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" class="tswjdc_table" v-if="qs.answerType === 4||qs.answerType === 3">
                        <tr>
                            <td class="lefttd_qk">&nbsp;</td>
                            <td class="lefttd_tit" v-for="jzOption in qs.subTitles" :key="jzOption.code">{{jzOption.title}}</td>
                        </tr>
                        <!-- 渲染的矩阵的radio-->
                        <tr class="os_bjqk" v-for="jzTitle in qs.items" :key="jzTitle.code">
                            <td class="lefttd_qk">{{jzTitle.content}}</td>
                            <td v-for="jzOption in qs.subTitles" :key="jzOption.code">
                                <input type="radio" :name="jzTitle.code" :value="`${jzOption.code}`" />
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <el-button type="primary" class="submit" style="with:100%" plain @click="next">提交</el-button>
    </el-main>
    <modal-tips title="提示" btnType="3" sureText="确定" cancelText="取消" modalType="small" :showModal="showModal" @submit="close" @cancel="showModal=false">
        <template v-slot:body>
            <div>{{info}}</div>
        </template>
    </modal-tips>
</el-container>
</template>

<script>
import vidoPlayer from "@/components/vido";
import ModalTips from "@/components/ModalTips";
import {
    GetQuestionInfo
} from "../api/QS-edit";
import {
    getList
} from "../api/QS-list";
import {
    getAvailableQn
} from "../api/user";
import {
    getCondition
} from "../api/Condition";
import request from "@/network/request";
export default {
    name: "fill",
    components: {
        ModalTips
    },
    data() {
        return {
            showSlide: "", //控制动画效果
            qsItem: [], //保存题
            questionList: [], //保存所有题
            TapNext: false, //用户点击状态
            conditionList: [], //控制流程
            NewconditionInfo: [],
            condition: 0,
            answerList: [],
            showModal: false,
            code: "",
            info: "",
            jzVal: [],
            textVal: '',
            radioVal: '',
            checkboxVal: '',
            result1: null
        };
    },
    created() {
        let _this = this;
        _this.code = _this.$route.params.code;
        //1.获取条件
        getList({
            qnCode: this.code
        }).then(res => {
            _this.conditionList = res.data.obj;
            _this.condition = res.data.obj[0].condition;
            //2.获取流程
            getCondition({
                qnCode: _this.code
            }).then(res => {
                _this.conditionList = res.data.obj;
                //3.获取题目
                GetQuestionInfo({
                    qncode: _this.code
                }).then(res => {
                    if (res.data.code == 200) {
                        _this.questionList = res.data.obj;
                    } else {
                        _this.$message.info("暂无题目信息，请联系管理员");
                    }
                    //判断逻辑
                    _this.handle();
                });
            });

        });
    },
    methods: {
        handle() {
            let _this = this;
            //1.静态展示全部，动态展示1题
            console.log(_this.conditionList)
            console.log(_this.questionList)
            //组装数据
            _this.questionList.forEach((qs, index) => {
                //1.先找题目对应的流程
                let tmpCond = _this.conditionList.filter(c => {
                    return c.questionCode == qs.code;
                });
                if (tmpCond.length != 0) {
                    let condition = tmpCond[0];
                    //跳转方式（0：选项跳转，1：累计得分跳转）
                    qs.controlType = condition.type;
                    if (condition.type === 1) {
                        qs.controlPoint = condition.point;
                    } else {
                        qs.items.forEach((item) => {
                            if (item.code == condition.itemCode) {
                                item.nextQuestionCode = condition.nextQuestionCode;
                            }
                        })
                    }
                }
            })
            if (_this.condition == 1) {
                _this.qsItem.push(_this.questionList[0]);
            } else {
                _this.qsItem = _this.questionList;
            }
        },

        closeVideo() {
            this.showSlide = "slideUp";
            setTimeout(() => {
                this.showSlide = "";
            }, 600);
        },
        goBack() {
            {
                this.showDialogMsg("答题状态中，若退出已做答案将会丢失, 是否继续?");
            }
        },
        close() {
            this.showModal = false;
            this.$router.push("/AvailableQn");
        },
        next() {
            let _this = this;
            //1.保存答案
            //2.找下一题

            //3.提交
        },
        //获取动态问卷的方法=》 动态问卷遍历每题加载
        dynamicQnMethdos(resInfo, conditions, next, point) {
            let _this = this;
            //  debugger
            if (next == undefined && point == undefined) {
                //先默认展示第一条出来
                _this.qsItem.push(resInfo[0]);
                console.log(_this.qsItem);
            }
        },

        showDialogMsg(info) {
            this.showModal = true;
            this.info = info;
        },
        //处理类型
        getMsg(item) {
            let msg = "";
            if (item.answerType === 0) {
                msg = "(单选题)";
            } else if (item.answerType === 1) {
                msg = "(多选题)";
            } else if (item.answerType === 3 || item.answerType === 4) {
                msg = "(矩阵题)";
            } else {
                msg = "(文本题)";
            }
            return item.isNeed ? `${msg} *` : msg;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../assets/base.scss";
@import "../assets/config.scss";
@import "../assets/vido.scss";
@import "../style/QS-fill.scss";
</style>
