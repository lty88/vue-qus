<template>
<el-container id="fill-container">
    <!--渲染数据-->
    <el-main class="content">
        <el-page-header @click.native="goBack"></el-page-header>
        <div class="questions" v-for="(qs, index) in qsItem" :key="index">
            <div class="qs-left">
                <div class="demo-image__placeholder">
                    <div class="block">
                        <p class="qs-title">{{qs.title}}.&nbsp;{{ getMsg(qs)}}&nbsp;&nbsp;{{ qs.content}}</p>
                        {{qs.code}}
                        <el-image class="titleImg" v-if="qs.type===1" :src="qs.url"></el-image>
                        <div class="vido" v-if="qs.type===3||qs.type===2">
                            <vido-player :vidoUrl="qs.url"></vido-player>
                        </div>
                    </div>
                </div>
                <p v-for="item in qs.items" class="option" :key="item.code">
                    <label>
                        <div v-if="qs.answerType === 0">
                            <input type="radio" :name="qs.code" :value="item.code" v-model="qs.answer" />
                            <span class="item-content">{{item.content}}</span>
                            {{item.code}}
                        </div>
                        <div v-if="qs.answerType === 1">
                            <input type="checkbox" :value="item.code" v-model="qs.answer" />
                            <span class="item-content">{{item.content}}</span>
                            {{item.code}}
                        </div>
                    </label>
                </p>
                <textarea v-if="qs.answerType === 2" v-model="qs.answer"></textarea>
                {{qs.answer}}
                {{qs.code}}
                <!-- 矩阵题-->
                <v-matrix-radio v-if="qs.answerType==4" :qustion="qs" v-model="qs.answer"></v-matrix-radio>
                <v-matrix-ckb v-if="qs.answerType==3" :qustion="qs" v-model="qs.answer"></v-matrix-ckb>
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
import vMatrixRadio from "@/components/v-matrix-radio";
import vMatrixCkb from "@/components/v-matrix-ckb";
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
import {
    saveAnswerAxios
} from "../api/Qs-fill";
export default {
    name: "fill",
    components: {
        ModalTips,
        vidoPlayer,
        vMatrixRadio,
        vMatrixCkb
    },
    data() {
        return {
            showSlide: "", //控制动画效果
            qsItem: [], //保存题
            questionList: [], //保存服务器返回来的题
            handledQsList: [], //加工后的题
            conditionList: [], //控制流程
            isLast: false, //用于保存是否为最后一题
            condition: 0,
            answerList: [],
            showModal: false,
            code: "",
            info: "",
            uid: ""
        };
    },
    created() {
        let _this = this;
        _this.code = _this.$route.params.code;
        //1.获取控制条件 condition	问卷属性（0：静态问卷，1：动态问卷）
        getList({
            code: this.code
        }).then(res => {
            console.log(res.data.obj);
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
                    _this.handleData();
                });
            });
        });
    },
    mounted() {
        //取UId
        if (window.sessionStorage.uid) {
            // 判断是否存在token，如果存在的话，则每个http header都加上token
            this.uid = window.sessionStorage.getItem("uid");
        }
        // console.log(this.uid);
    },
    methods: {
        handleData() {
            let _this = this;
            //组装后的数据放到新数组handledQsList=>要展示的被控制的题目信息
            _this.handledQsList = _this.questionList.map((qs, index) => {
                //0：单选，1：多选，2：文本录，3：单选矩阵，4：多选矩阵
                qs.answer = [0, 2].indexOf(qs.answerType) > -1 ? "" : [];
                //1.先找题目对应的流程
                let tmpCond = _this.conditionList.filter(c => {
                    return c.questionCode == qs.code;
                });
                if (tmpCond.length > 0) {
                    let condition = tmpCond[0];
                    //跳转方式（0：选项跳转，1：累计得分跳转）
                    qs.controlType = condition.type;
                    qs.nextQuestionCode = condition.nextQuestionCode;
                    if (condition.type === 1) {
                        qs.controlPoint = condition.point;
                    } else {
                        qs.skipItemCode = condition.itemCode;
                    }
                }
                return qs;
            });
            if (_this.condition == 1) {
                _this.qsItem.push(_this.deepCopy(_this.handledQsList[0]));
            } else {
                _this.qsItem = _this.deepCopy(_this.handledQsList);
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

            if (window.sessionStorage.uid) {
                // 关闭回答页面时 判断是否存在uid，如果存在的话清除
                window.sessionStorage.removeItem("uid");
                this.uid = "";
            }
            console.log(this.uid);
            this.showModal = false;
            this.$router.push("/AvailableQn");
        },
        next() {
            let _this = this;
            if (_this.condition == 1) {
                _this.dynamicSave();
                //动态，提交答案
                if (_this.isLast) {
                    _this.saveAnswer();
                }
            } else {
                //静态，提交答案
                _this.staticSave();
                _this.saveAnswer();
            }
        },
        findNextQs(qs) {
            let _this = this;
            for (let index = 0; index < _this.handledQsList.length; index++) {
                if (_this.handledQsList[index].code == qs.code) {
                    if (index != _this.questionList.length - 1) {
                        _this.qsItem.splice(0, 1, _this.deepCopy(_this.questionList[index + 1]));
                    } else {
                        _this.isLast = true;
                    }
                    break;
                }
            }
        },
        handleDynamic(qs) {
            let _this = this;
            //2.找下一题
            if (qs.controlType == undefined) {
                //没值表示不控制，直接取下一题
                _this.findNextQs(qs);
            } else if (qs.controlType == 0) {
                _this.optionSkip(qs);
            } else if (qs.controlType == 1) {
                _this.pointSkip(qs);
            }
        },
        staticSave() {
            let _this = this;
            for (let i = 0; i < _this.handledQsList.length; i++) {
                let qs = _this.handledQsList[i];
                if (qs.answer instanceof Array) {
                    if (qs.answer.length == 0) {
                        //  提示
                        _this.$message.error("有题尚未作答");
                        return;
                    }
                } else {
                    if (!qs.answer) {
                        _this.$message.error("有题尚未作答");
                        return;
                    }
                }
                _this.answerList.push({
                    questionCode: qs.code,
                    answerCode: qs.answer
                });
            }
        },
        dynamicSave() {
            let _this = this;
            let qs = _this.qsItem[0];
            //0.需要判断有没有答题
            if (qs.answer instanceof Array) {
                if (qs.answer.length == 0) {
                    //  提示
                    _this.$message.error("请答题");
                    return;
                }
            } else {
                if (!qs.answer) {
                    _this.$message.error("请答题");
                    return;
                }
            }
            //1.保存答案
            _this.answerList.push({
                questionCode: qs.code,
                answerCode: qs.answer
            });
            if (_this.condition === 1) {
                //动态
                _this.handleDynamic(qs);
            }
        },
        //跳转方式,选项跳转
        optionSkip(qs) {
            let _this = this;
            //1.判断是否选了要跳转的选项
            let answerList = qs.answer instanceof Array ? qs.answer : [qs.answer];
            let isSkip = answerList.indexOf(qs.skipItemCode) > -1 ? true : false;
            if (isSkip) {
                let nextQsList = _this.handledQsList.filter(item => {
                    return item.code == qs.nextQuestionCode;
                });
                if (nextQsList && nextQsList.length > 0) {
                    _this.qsItem.splice(0, 1, _this.deepCopy(nextQsList[0]));
                    return;
                }
                _this.isLast = true;
            } else {
                //直接取下一题
                _this.findNextQs(qs);
            }
        },
        //累计得分跳转
        pointSkip(qs) {
            let _this = this;
            //找到用户选择的选项，然后计算分值
            let totalPoint = 0;
            let answerList = qs.answer instanceof Array ? qs.answer : [qs.answer];
            answerList.forEach(answer => {
                qs.items.forEach(option => {
                    if (answer == option.code) {
                        totalPoint += option.point;
                    }
                });
            });
            if (totalPoint == qs.controlPoint) {
                let nextQsList = _this.handledQsList.filter(item => {
                    return item.code == qs.nextQuestionCode;
                })[0];
                if (nextQsList && nextQsList.length > 0) {
                    _this.qsItem.splice(0, 1, _this.deepCopy(nextQsList[0]));
                    return;
                }
                _this.isLast = true;
            } else {
                _this.findNextQs(qs);
            }
        },
        deepCopy(obj) {
            return JSON.parse(JSON.stringify(obj));
        },
        saveAnswer() {
            console.log(JSON.stringify(this.answerList));
            let answerList = JSON.stringify(this.answerList);
            //   参数：qnCode-问卷编号
            //   uid-用户uid, 开放性问卷值为空
            //   answer-回答结果，json字符串
            saveAnswerAxios({
                qnCode: this.code,
                uid: this.uid,
                answer: answerList
            }).then(res => {
                console.log(res);
            });
            //动态静态都调用
            // let s=[];
            // this.answerList.forEach(m=>{
            //     let obj={};
            //     obj.XX=m.xx;
            //     s.push(obj);
            // })
            // console.log(this.s);;
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
@import "../style/QS-fill.scss";
</style>
