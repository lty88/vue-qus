<template>
<div class="qs-list">
    <ul v-if="qsList == 0 ? false : true">
        <li class="color">标题</li>
        <li class="color">开始时间</li>
        <li class="color">截止时间</li>
        <li class="color">状态</li>
        <li class="color">
            操作
            <span @click="$router.push({ name: 'Add-Qs', params: { code: 0 } })">+新建问卷</span>
        </li>
    </ul>
    <div v-for="(item, index) in qsList" :key="index">
        <ul id="list-item">
            <li>{{ item.title }}</li>
            <li style="font-size:15px">{{item.startTime}}</li>
            <li style="font-size:15px">{{item.endTime}}</li>
            <li :class="item.status ==1 ? 'inissue' : 'noissue'">{{getStatus(item.status)}}</li>
            <li>
                <button @click="iterator = edit(item.code);iterator.next();">编辑</button>
                <button @click="iterator = delItem(item);iterator.next();">删除</button>
                <router-link v-if="item.type===1" :to="`/importUser/${item.code}`" tag="button">参与控制</router-link>
                <!-- <button @click="iterator = watchData(item);iterator.next();">查看数据</button> -->
                <router-link v-if="item.condition===1" :to="`/condition/${item.code}`" tag="button">流程控制</router-link>
            </li>
        </ul>
    </div>
    <!-- <flow-control :ControlModal="showControlModal" @cancel="showControlModal=false" :qnCode="code"></flow-control> -->
    <div class="add-qs" v-if="qsList === 0">
        <button class="add-btn" @click="$router.push({ name: 'Add-Qs', params: { code: 0 } })">+&nbsp;&nbsp;新建问卷</button>
    </div>
    <modal-tips title="提示" btnType="3" sureText="确定" cancelText="取消" modalType="small" :showModal="showModal" @submit="iterator.next()" @cancel="showModal=false">
        <template v-slot:body>
            <div>{{info}}</div>
        </template>
    </modal-tips>
</div>
</template>

<script>
import storage from "../store/seesion.js";
import {
    getList,
    delList
} from "../api/QS-list";
// import FlowControl from "@/components/FlowControl";
import ModalTips from "@/components/ModalTips";
export default {
    name: "qsList",
    components: {
        ModalTips
    },
    data() {
        return {
            qsList: [],
            showDialog: false,
            showModal: false,
            iterator: {},
            info: "",
            showControlModal: false,
            code: "1" //问卷的qncode
        };
    },
    created() {},
    mounted() {
        this.fetchList();
    },
    comments: {},
    methods: {
        showControl(code) {
            console.log(code);
            this.code = code;
            this.showControlModal = true;
        },
        fetchList() {
            getList().then(res => {
                console.log(res);
                this.qsList = res.data.obj;
                // console.log(this.qsList);
                if (this.qsList == undefined) {
                    this.$message.info("暂无问卷！");
                    this.qsList = 0;
                }
            });
        },
        showDialogMsg(info) {
            this.showModal = true;
            this.info = info;
            console.log(info);
        },
        //处理状态
        getStatus(Status) {
            let msg = "";
            if (Status === 0) {
                return (msg = "禁用");
            } else if (Status === 1) {
                return (msg = "启用");
            } else {
                return (msg = "测试");
            }
        },
        //删除单个问卷
        * delItem(item) {
            console.log(item);
            yield this.showDialogMsg("确认要删除此问卷吗？");
            yield(() => {
                delList({
                    code: item.code
                }).then(res => {
                    console.log(res);
                    if (res.data.code === 200) {
                        this.fetchList();
                        this.showModal = false;
                        this.$message.success("刪除成功！");
                    }
                });
            })();
        },
        //编辑问卷
        * edit(code) {
            this.showModal = false;
            this.$router.push({
                name: "qsEdit",
                params: {
                    code
                }
            });
        },
        // 查看问卷
        * watchData(item) {
            yield(() => {
                if (item.state === "noissue") {
                    this.showDialogMsg("未发布的问卷无数据可查看");
                } else {
                    this.$router.push({
                        name: "qsData",
                        params: {
                            code: item.code
                        }
                    });
                }
            })();
            yield(this.showModal = false);
        }
    },
    computed: {},
    watch: {}
};
</script>

<style lang="scss" scoped>
@import "../style/QS-list";
</style>
