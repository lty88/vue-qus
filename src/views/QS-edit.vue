<template>
<div class="edit-container">
    <router-link to="/" tag="span" class="back">
        <i class="el-icon-arrow-left" style="font-size:25px;font-weight: bold"></i>
    </router-link>
    <set-drawer></set-drawer>
    <div class="set-user"></div>
    <!--渲染数据-->
    <div class="content">
        <div class="questions" v-for="(qs, index) in qsItem" :key="index">
            <div class="qs-left">
                <div class="demo-image__placeholder">
                    <div class="block">
                        <p class="qs-title">{{`${index+1}`}}.&nbsp;{{ getMsg(qs)}}&nbsp;&nbsp;{{ qs.content}}</p>
                        <el-image class="titleImg" v-if="qs.type===1" :src="qs.url"></el-image>
                        <vido-player v-if="qs.type===3||qs.type===2"></vido-player>
                    </div>
                </div>
                <p v-for="(item, index) in qs.items" class="option" :key="index">
                    <label>
                        <div v-if="qs.answerType === 0">
                            <input type="radio" :name="`${qs.title}`" />
                            {{item.content}}
                            <el-image class="titleImg" v-if="item.type===1" :src="qs.url"></el-image>
                            <vido-player v-if="item.type===3||item.type===2"></vido-player>
                        </div>
                        <div v-if="qs.answerType === 1">
                            <input type="checkbox" :name="`${qs.title}`" />
                            {{item.content}}
                            <el-image class="titleImg" v-if="item.type===1" :src="qs.url"></el-image>
                            <vido-player v-if="item.type===3||item.type===2"></vido-player>
                        </div>
                    </label>
                </p>
                <textarea v-if="qs.answerType === 2"></textarea>
                <!-- 矩阵题-->
                <div class="wjdc_list">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" class="tswjdc_table" v-if="qs.answerType === 4||qs.answerType === 3">
                        <tr>
                            <td class="lefttd_qk">&nbsp;</td>
                            <td class="lefttd_tit" v-for="(jzOption,jzIndex) in qs.subTitles" :key="jzIndex">{{jzOption.title}}</td>
                        </tr>
                        <!-- 渲染的矩阵的radio-->
                        <tr class="os_bjqk" v-for="(jzTitle,jztIndex) in qs.items" :key="jztIndex">
                            <td class="lefttd_qk">{{jzTitle.content}}</td>
                            <td v-for="(jzOption,jzIndex) in qs.subTitles" :key="jzIndex">
                                <input type="radio" :value="`${jzOption.code}`" :name="`${jzIndex}`" />
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="qs-right">
                <!-- <label>
            <input type="checkbox" :value="qs.isNeed" v-model="qs.isNeed" />
            此题是否必填
          </label>-->
                <p id="edit-btn-box">
                    <el-button @click="del(qs,index)" type="warning" plain>删除</el-button>
                    <el-button @click="editTitle(qs,index)" type="success" plain>编辑</el-button>
                </p>
            </div>
        </div>
        <div class="add">
            <transition name="slide">
                <div class="add-option" v-if="showBtn">
                    <el-button @click="addRadio" type="info" plain>单选</el-button>
                    <el-button @click="addCheckbox" type="info" plain>多选</el-button>
                    <el-button @click="addTextarea" type="info" plain>文本框</el-button>
                    <el-button @click="addJz" type="info" plain class="btn_add_text">矩阵</el-button>
                </div>
            </transition>
            <div class="add-item" @click="addItemClick">
                <span class="add-icon">
                    <i class="el-icon-circle-plus-outline" style="font-size:20px "></i>
                </span>
                <span>添加问题</span>
            </div>
        </div>
    </div>
    <div class="shadow" v-if="showDialog">
        <div class="dialog">
            <header>
                <span>提示</span>
                <span class="close-btn" @click="cancel">X</span>
            </header>
            <p>{{ info }}</p>
            <div class="btn-box">
                <button class="yes" @click="iterator.next()">确定</button>
                <button @click="cancel">取消</button>
            </div>
        </div>
    </div>

    <div class="shadow" v-if="showDialog">
        <div class="dialog">
            <header>
                <span>提示</span>
                <span class="close-btn" @click="cancel">X</span>
            </header>
            <p>{{ info }}</p>
            <div class="btn-box">
                <button class="yes" @click="iterator.next()">确定</button>
                <button @click="cancel">取消</button>
            </div>
        </div>
    </div>
    <!-- 编辑radio、checkbox、textarea组件 -->
    <v-edit-radio :showModal="showM" :formData="editQs" :formDataJz="editQsJz" @cancel="showmo" @EditShowModal="EditShowModals"></v-edit-radio>
    <!-- 编辑矩阵组件 -->
    <v-edit-jz :showModal="showMJz" :formDataJz="editQsJz" @canceljz="showjz" @EditShowModalJz="EditShowModalJzs"></v-edit-jz>
    <!--对应添加问题 新增radio模板 -->
    <v-radio :show="showModal" :types="addOptionType" :editData="dataObj" @isChangeList="wList" @shows="showmoalR" @cancel="showModal=false"></v-radio>
    <!--对应添加问题 新增checkbox模板 -->
    <v-checkbox @isChangeList="wList" @showModalC="showModalCb" :showModal="AddshowModalC" :types="addOptionType" @cancel="AddshowModalC=false"></v-checkbox>
    <!--对应添加问题 新增textarea模板 -->
    <v-textarea @isChangeList="wList" @showModalT="showModalTx" :showModal="AddshowModalT" :types="addOptionType" @cancel="AddshowModalT=false"></v-textarea>
    <!--对应添加问题 新增矩阵模板 -->
    <v-jztemp @isChangeList="wList" @showjz="showmoalJ" :showModal="AddshowModalJz" @cancel="AddshowModalJz=false" :types="addOptionType"></v-jztemp>
</div>
</template>

<script>
import storage from "../store/seesion.js";
import vRadio from "@/components/v-radio";
import vJztemp from "@/components/v-jztemp";
import vTextarea from "@/components/v-textarea";
import vCheckbox from "@/components/v-checkbox";
import vEditRadio from "@/components/v-editRadio";
import vEditJz from "@/components/v-editJz";
import SetDrawer from "@/components/SetDrawer";
import vidoPlayer from "@/components/vido";
import {
    GetQuestionInfo,
    UpdateQsInfo,
    DeleteQsItems
} from "../api/QS-edit";
import {
    getList
} from "../api/QS-list";

export default {
    name: "qsEdit",
    components: {
        vRadio,
        vJztemp,
        vTextarea,
        vCheckbox,
        SetDrawer,
        vidoPlayer,
        vEditRadio,
        vEditJz
    },
    data() {
        return {
            editQs: {},
            editQsJz: {},
            showM: false,
            showMJz: false,
            qsItem: [],
            qsList: [],
            isError: false,
            showBtn: false,
            showAddQsDialog: false,
            showAddQsDialogJz: false,
            showAddOptionInput: true,
            AddshowModalJz: false, //矩阵的增加modal
            AddshowModalT: false, //textarea的增加modal
            AddshowModalC: false, //checkbox的增加modal
            info: "",
            addOptionType: "", //增加的类型
            showDialog: false,
            iterator: {},
            isGoIndex: false,
            currEditIndex: -1,
            showModal: false,
            dataObj: {}, //子传给父亲的修改数据
            datas: [], // 获取列表数据信息
            code: 1 //问卷的qncode
        };
    },
    created() {},
    mounted() {
        this.code = this.$route.params.code;
        this.fetchData();
    },
    methods: {
        EditShowModals(e) {
            this.showM = false;
            this.fetchData();
        },
        EditShowModalJzs() {
            this.showMJz = false;
            this.fetchData();
        },
        //取消radio chekbox text编辑遮罩
        showmo(e) {
            this.showM = false;
            // console.log(e);
        },
        showjz() {
            this.showMJz = false;
        },
        showmoalJ() {
            this.AddshowModalJz = false;
            this.fetchData();
        },
        //新增子组件传自定义事件关闭遮罩
        showmoalR() {
            this.showModal = false;
            this.fetchData();
        },
        showModalTx() {
            this.AddshowModalT = false;
            this.fetchData();
        },
        showModalCb() {
            this.AddshowModalC = false;
            this.fetchData();
        },
        //监听子组件改变后重新获取GetQuestionInfo网络请求
        wList(e) {
            if (e === true) {
                this.fetchData();
            }
        },
        fetchData() {
            this.code = this.$route.params.code;
            // 获取列表数据信息接口
            if (this.code != 0) {
                GetQuestionInfo({
                    qncode: this.code
                }).then(res => {
                    console.log(res);
                    if (res.data.code === 503) {
                        this.$message.info(res.data.msg);
                    } else {
                        this.qsItem = res.data.obj;
                    }
                    console.log(this.qsItem);
                });
            }
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
        },
        del(qs, index) {
            console.log(qs.code);
            console.log(index);
            console.log(this.code);
            // 参数：qnCode-问卷编号
            //       code-题目编号
            DeleteQsItems({
                qnCode: this.code,
                code: qs.code
            }).then(res => {
                this.fetchData();
                console.log(res);
            });
        },
        addItemClick() {
            if (this.showBtn === false) {
                this.questionLength === 20 ?
                    alert("问卷已满！") :
                    (this.showBtn = !this.showBtn);
            } else {
                this.showBtn = !this.showBtn;
            }
        },
        editTitle(qs, index) {
            if (qs.answerType === 0 || qs.answerType === 1 || qs.answerType === 2) {
                this.showM = true;
                console.log(this.editQs);
                this.editQs = qs;
            } else {
                this.showMJz = true;
                this.editQsJz = qs;
                console.log(this.editQsJz);
            }

            console.log(this.editQs);
            let answerType = qs.answerType;
            console.log(answerType);
        },
        addRadio() {
            if (this.questionLength === 20) return alert("问卷已满！");
            this.showModal = true;
            this.addOptionType = "radio";
        },
        addCheckbox() {
            if (this.questionLength === 20) return alert("问卷已满！");
            this.AddshowModalC = true;
            this.addOptionType = "checkbox";
        },
        addTextarea() {
            if (this.questionLength === 20) return alert("问卷已满！");
            this.AddshowModalT = true;
            this.addOptionType = "textarea";
        },
        addJz() {
            if (this.questionLength === 20) return alert("问卷已满！");
            this.AddshowModalJz = true;
            this.addOptionType = "jz";
        },
        // 增加删除矩阵类型
        delJzItemOption(rowOptions, roptionsIndex) {
            let rownum = this.jzItemOptions.length;
            console.log(rownum);
            if (rownum >= 4) {
                this.jzItemOptions.splice(rowOptions, 1);
            } else this.$message.error("至少保留三项");
        },
        delJzTitleOptions(colOptions, coptionsIndex) {
            let cowNum = this.jzTitleOptions.length;
            console.log(cowNum);
            if (cowNum >= 4) {
                this.jzTitleOptions.splice(coptionsIndex, 1);
            } else this.$message.error("至少保留三项");
        },
        addJzItemOption(rowOptions, roptionsIndex) {
            let rowNumT = this.jzItemOptions.length;
            console.log(rowNumT);
            if (rowNumT < 8) {
                let jzItemOptions = {
                    name: ""
                };
                this.jzItemOptions.push(rowOptions);
            } else this.$message.error("最多只能有八项");
        },
        addJzTitleOptions(colOptions, coptionsIndex) {
            let rowNumO = this.jzTitleOptions.length;
            if (rowNumO < 8) {
                let jzTitleOptions = {
                    name: ""
                };
                this.jzTitleOptions.push(colOptions);
            } else this.$message.error("最多只能有八项");
        },

        addItemOption() {
            let qsOptions = {
                name: ""
            };
            this.qsInputOptions.push(qsOptions);
        },
        validateAddQs() {
            //修改题目
            // 参数：qnCode-问卷编号
            // code-题目编号，修改题目时必须
            //title-题号
            //order-排序号
            // content-题目内容
            // type - 题目类型（0：文本，1：图片，2：音频，3：视频）
            // url-多媒体内容链接
            // answerType-题目回答类型（0：单选，1：多选，2：文本录入，3：单选矩阵，4：		多选矩阵）
            //Item-选项信息json字符串-[{"code": "3454545","title": "选项1"},{"code": "","title": "选项3"}]
            //subTitles-子标题信息json字符串

            if (this.currEditIndex >= 0) {
                console.log(this.qsItem[this.currEditIndex]);
                let obj = {
                    qnCode: this.code,
                    code: this.qsItem[this.currEditIndex].code,
                    title: this.qsItem[this.currEditIndex].title,
                    content: this.qsItem[this.currEditIndex].content,
                    type: this.qsItem[this.currEditIndex].type,
                    answerType: this.qsItem[this.currEditIndex].answerType,
                    type: this.qsItem[this.currEditIndex].type,
                    items: JSON.stringify(this.qsItem[this.currEditIndex].items)
                };
                console.log(obj);
                UpdateQsInfo(obj).then(res => {
                    console.log(res);
                    this.showAddQsDialog = false;
                });
            }
        },
        validateAddQsJz() {
            if (this.qsJzTitle === "") {
                this.$message.error("题目不能为空");
            } else {
                this.showAddQsDialog = false;
            }
        }
    },
    computed: {
        questionLength() {
            return this.datas.length;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../style/QS-edit";

#edit-box {
    width: 80%;
    margin: 0 auto;
}

.btn_add_text {
    display: inline-block;
    width: 9.5rem !important;
    text-align: center !important;
}
</style>
