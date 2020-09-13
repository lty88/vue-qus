<template>
  <el-container
    id="fill-container"
    :style="{backgroundImage: 'url(' + coverImgUrl + ')', backgroundSize:'cover',backgroundPosition:'center',backgroundRepeat:'no-repeat'}"
  >
    <el-header>
      <el-button class="viewResults el-icon-back" @click.native="goBack" type="text">返回</el-button>
      <!-- <el-button class="viewResults" @click="viewResults" type="text">查看已回答结果</el-button> -->
    </el-header>
    <!--渲染数据-->
    <el-main class="content">
      <h1 class="title">{{qsTitle}}</h1>
      <div class="questions" v-for="(qs, index) in qsItem" :key="index">
        <div class="qs-left">
          <div class="demo-image__placeholder">
            <div class="block">
              <p class="qs-title">{{qs.title}}.&nbsp;{{ getMsg(qs)}}&nbsp;&nbsp;{{ qs.content}}</p>
              <!-- {{qs.code}} -->
              <el-image class="titleImg" v-if="qs.type===1" :src="qs.url"></el-image>
              <div class="vido" v-if="qs.type===3||qs.type===2">
                <vido-player :vidoUrl="qs.url"></vido-player>
              </div>
            </div>
          </div>
          <form>
            <p v-for="item in qs.items" class="option" :key="item.code">
              <label>
                <div v-if="qs.answerType === 0">
                  <div v-if="item.type===1">
                    <el-image class="titleImg" :src="item.url"></el-image>
                  </div>
                  <div class="content-box">
                    <input
                      type="radio"
                      disabled
                      :name="qs.code"
                      :value="item.code"
                      v-model="qs.answerCode"
                    />
                    <span class="t-content">{{item.content}}</span>
                    {{item.code}}
                  </div>
                </div>
                <div v-if="qs.answerType === 1">
                  <div v-if="item.type===1">
                    <el-image class="titleImg" :src="item.url"></el-image>
                  </div>
                  <div class="content-box">
                    <input type="checkbox" v-model="item.answerCode" />
                    <span class="t-content">{{item.content}}</span>
                    {{item.code}}
                  </div>
                </div>
              </label>
            </p>
            <textarea v-if="qs.answerType === 2" v-model="qs.answerCode"></textarea>
            <!-- 多媒体回答题型 -->
            <div v-if="qs.answerType === 5">
              <el-input v-model="qs.answerCode" placeholder></el-input>
            </div>
            <!-- 单选矩阵题-->
            <div class="wjdc_list">
              <table
                width="100%"
                border="0"
                cellspacing="0"
                cellpadding="0"
                class="tswjdc_table"
                v-if="qs.answerType === 3"
              >
                <tr>
                  <td class="lefttd_qk">&nbsp;</td>
                  <td
                    class="lefttd_tit"
                    v-for="(jzOption,jzIndex) in qs.items"
                    :key="jzIndex"
                  >{{jzOption.content}}</td>
                </tr>
                <!-- 渲染的矩阵的radio-->
                <tr class="os_bjqk" v-for="subTitle in qs.subTitles" :key="subTitle.code">
                  <td class="lefttd_qk">{{subTitle.title}}{{subTitle.code}}</td>
                  <td v-for="jzOption in qs.items" :key="jzOption.code">
                    <input type="radio" :value="jzOption.code" :name="jzOption.code" v-model="jzOption.answerCode" />
                    {{jzOption.code}}
                  </td>
                </tr>
              </table>
            </div>
            <!-- 多选矩阵 -->
            <div class="wjdc_list">
              <table
                width="100%"
                border="0"
                cellspacing="0"
                cellpadding="0"
                class="tswjdc_table"
                v-if="qs.answerType === 4"
              >
                <tr>
                  <td class="lefttd_qk">&nbsp;</td>
                  <td
                    class="lefttd_tit"
                    v-for="(jzOption,jzIndex) in qs.items"
                    :key="jzIndex"
                  >{{jzOption.content}}</td>
                </tr>
                <!-- 渲染的矩阵的radio-->
                <tr class="os_bjqk" v-for="subTitle in qs.subTitles" :key="subTitle.code">
                  <td class="lefttd_qk">{{subTitle.title}} {{subTitle.code}}</td>
                  <td v-for="jzOption in qs.items" :key="jzOption.code">
                    <input type="checkbox" :value="jzOption.code" v-model="jzOption.answerCode" :name="subTitle.code" />
                    {{jzOption.code}}
                  </td>
                </tr>
              </table>
            </div>
          </form>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import vidoPlayer from "@/components/vido";
import vMatrixRadio from "@/components/v-matrix-radio";
import vMatrixCkb from "@/components/v-matrix-ckb";
import { GetQuestionInfo } from "../api/QS-edit";
import { getList } from "../api/QS-list";
import { getAvailableQn, getResults } from "../api/user";
export default {
  name: "fill",
  components: {
    vidoPlayer
  },
  data() {
    return {
      qsTitle: "", //问卷标题
      coverImgUrl: "", //背景图片
      loading: "", //控制最后提交答案的遮罩
      showSlide: "", //控制动画效果
      condition: 0,
      showModal: false,
      code: "",
      info: "",
      uid: "",
      qsItem: [], //后端获取问卷所有题目信息
      questionList: [],
      resultsList: [], //后端获取问卷所有题目与答案
      handledQsList: [] //匹配过后答案与题目
    };
  },
  created() {
    //取UId
    if (window.sessionStorage.uid) {
      this.uid = window.sessionStorage.getItem("uid");
    }
    console.log(this.uid);
    let _this = this;
    _this.code = _this.$route.params.code;
    //1.获取所有获取题目信息
    getList({
      code: _this.code
    }).then(res => {
      _this.coverImgUrl = res.data.obj[0].bgUrl;
      _this.qsTitle = res.data.obj[0].title;
    }),
      GetQuestionInfo({
        qncode: _this.code
      }).then(res => {
        if (res.data.code == 200) {
          _this.qsItem = res.data.obj;
          console.log(_this.qsItem);
          // 2.获取答案与题目
          getResults({
            qnCode: _this.code,
            uid: _this.uid
          }).then(res => {
            _this.resultsList = res.data.obj;
            console.log(_this.resultsList);
            _this.handleData();
          });
        } else {
          _this.$message({
            message: "暂无题目信息，请联系管理员",
            duration: 2000
          });
        }
      });

    //2.获取题目
  },
  mounted() {},
  methods: {
    handleData() {
      let _this = this;
      //组装后的数据放到新数组  handledQsList=>组合了要展示被控制的题目信息和没有展示的题目
      _this.handledQsList = _this.qsItem.map((qs, index) => {
        //answerType 0：单选，1：多选，2：文本录，3：单选矩阵，4：多选矩阵 ,5:多媒体上传题
        qs.answerCode = [0, 2, 5].indexOf(qs.answerType) > -1 ? "" : [];
        //1.先找题目对应的答案
        let tmpCond=[];
        _this.resultsList.forEach(c => {
          if(c.questionCode == qs.code){
              tmpCond.push(c.itemCode);
          }
        });
        if(tmpCond.length>1){
          qs.items.forEach(c1=>{
            c1.answerCode='';
            let index = tmpCond.indexOf(c1.code);
            if(index>-1){
               c1.answerCode=tmpCond[index];
            }
          })
         }else{
          qs.answerCode = tmpCond[0];
        }
        return qs;
      });
      console.log(_this.handledQsList);
      this.qsItem = this.handledQsList;
    },
    closeVideo() {
      this.showSlide = "slideUp";
      setTimeout(() => {
        this.showSlide = "";
      }, 600);
    },
    goBack() {
      if (window.sessionStorage.uid) {
        // 关闭回答页面时 判断是否存在uid，如果存在的话清除
        window.sessionStorage.removeItem("uid");
        this.uid = "";
      }
      console.log(this.uid);
      this.showModal = false;
      this.$router.push("/AvailableQn");
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
      } else if (item.answerType === 3) {
        msg = "(单选矩阵)";
      } else if (item.answerType === 4) {
        msg = "(多选矩阵)";
      } else {
        msg = "(文本题)";
      }
      return item.isNeed ? `${msg} *` : msg;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-header {
  width: 100%;
  display: flex !important;
  justify-content: space-between;
  border-bottom: 0.2rem solid #ccc !important;
}
input:checked + span {
  background-color: #eeeeee;
  color: #337ab7;
  font-weight: bold;
}
@import "../style/QS-fill.scss";
</style>
