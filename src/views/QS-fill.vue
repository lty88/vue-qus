<template>
  <el-container
    id="fill-container"
    :style="{backgroundImage: 'url(' + coverImgUrl + ')', backgroundSize:'contain',backgroundPosition:'center',backgroundRepeat:'no-repeat'}"
  >
    <el-header>
      <!-- <div class="goback">
        <el-page-header @click.native="goBack"></el-page-header>
      </div>-->
      <!-- <span></span> -->
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
                    <input type="radio" :name="qs.code" :value="item.code" v-model="qs.answer" />
                    <span class="t-content">{{item.content}}</span>
                    <!-- {{item.code}} -->
                  </div>
                </div>
                <div v-if="qs.answerType === 1">
                  <div v-if="item.type===1">
                    <el-image class="titleImg" :src="item.url"></el-image>
                  </div>
                  <div class="content-box">
                    <input type="checkbox" :value="item.code" v-model="qs.answer" />
                    <span class="t-content">{{item.content}}</span>
                    <!-- {{item.code}} -->
                  </div>
                </div>
              </label>
            </p>
            <textarea v-if="qs.answerType === 2" v-model="qs.answer"></textarea>
            <!-- 多媒体回答题型 -->
            <div v-if="qs.answerType === 5">
              <upload-fill v-model="qs.answer"></upload-fill>
            </div>
            <!-- 矩阵题-->
            <v-matrix-radio v-if="qs.answerType==3" :qustion="qs" v-model="qs.answer"></v-matrix-radio>
            <v-matrix-ckb v-if="qs.answerType==4" :qustion="qs" v-model="qs.answer"></v-matrix-ckb>
          </form>
        </div>
      </div>
      <modal-tips
        title="提示"
        btnType="3"
        sureText="确定"
        cancelText="取消"
        modalType="small"
        :showModal="showModal"
        @submit="close"
        @cancel="showModal=false"
      >
        <template v-slot:body>
          <div>{{info}}</div>
        </template>
      </modal-tips>
      <el-button type="primary" class="submit" style="with:100%" plain @click="next">提交</el-button>
    </el-main>
  </el-container>
</template>

<script>
import vidoPlayer from "@/components/vido";
import ModalTips from "@/components/ModalTips";
import vMatrixRadio from "@/components/v-matrix-radio";
import vMatrixCkb from "@/components/v-matrix-ckb";
import UploadFill from "@/components/UploadFill";
import { GetQuestionInfo } from "../api/QS-edit";
import { getList } from "../api/QS-list";
import { getAvailableQn, getResults } from "../api/user";
import { getCondition } from "../api/Condition";
import { saveAnswerAxios } from "../api/Qs-fill";
export default {
  name: "fill",
  components: {
    ModalTips,
    vidoPlayer,
    vMatrixRadio,
    vMatrixCkb,
    UploadFill
  },
  data() {
    return {
      qsTitle: "", //问卷标题
      coverImgUrl: "", //背景图片
      loading: "", //控制最后提交答案的遮罩
      showSlide: "", //控制动画效果
      qsItem: [], //保存题
      questionList: [], //保存服务器返回来的题
      handledQsList: [], //加工后的题
      conditionList: [], //控制流程
      isLast: false, //用于保存是否为最后一题
      count: "", // 倒计时
      condition: 0,
      answerList: {},
      totalPoint: 0,
      pramas: {},
      showModal: false,
      code: "",
      info: "",
      uid: "",
      flag: false
    };
  },
  // beforeRouteLeave(to, from, next) {
  //   if (confirm("确定离开吗？") === true) {
  //     next();
  //   } else {
  //     next("aa");
  //   }
  // },
  created() {
    let _this = this;
    _this.code = _this.$route.params.code;
    //1.获取控制条件 condition	问卷属性（0：静态问卷，1：动态问卷）
    getList({
      code: _this.code
    }).then(res => {
      // console.log(res.data.obj[0].bgUrl);
      // let bgUrl=res.data.obj[0].bgUrl
      // if (bgUrl) {
      //   this.coverImgUrl =bgUrl
      // }
       this.coverImgUrl =res.data.obj[0].bgUrl
      this.qsTitle = res.data.obj[0].title;
      _this.conditionList = res.data.obj;
      _this.condition = res.data.obj[0].condition;
      //2.获取流程
      getCondition({
        qnCode: _this.code
      }).then(res => {
        _this.conditionList = res.data.obj;
        console.log(_this.deepCopy(_this.conditionList));
        //3.获取题目
        GetQuestionInfo({
          qnCode: _this.code
        }).then(res => {
          if (res.data.code == 200) {
            _this.questionList = res.data.obj;
            console.log(_this.questionList);
          } else {
            _this.$message({
              message: "暂无题目信息，请联系管理员",
              duration: 2000
            });
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
  // 销毁监听事件
  destroyed() {
    if (window.sessionStorage.uid) {
      // 关闭回答页面时 判断是否存在uid，如果存在的话清除
      window.sessionStorage.removeItem("uid");
      this.uid = "";
    }
    console.log("uid已经被销毁了");
  },
  methods: {
    //判断逻辑
    handleData() {
      let _this = this;
      //组装后的数据放到新数组  handledQsList=>组合了要展示被控制的题目信息和没有展示的题目
      _this.handledQsList = _this.questionList.map((qs, index) => {
        //answerType 0：单选，1：多选，2：文本录，3：单选矩阵，4：多选矩阵 ,5:多媒体上传题
        qs.answer = [0, 2, 5].indexOf(qs.answerType) > -1 ? "" : [];
        //1.先找题目对应的流程
        let tmpCond = _this.conditionList.filter(c => {
          return c.questionCode == qs.code;
        });
        // console.log(_this.deepCopy(tmpCond));
        if (tmpCond.length > 0) {
          let condition = tmpCond[0];
          //跳转方式（0：选项跳转，1：累计得分跳转）
          qs.controlType = condition.type;
          qs.nextQuestionCode = condition.nextQuestionCode;
          if (condition.type === 1) {
            qs.controlPoint = condition.point / 100;
          } else {
            // 选项编号=> 满足选择了此选项就做跳转到下一题 nextQuestionCode
            qs.skipItemCode = condition.itemCode;
          }
        }
        return qs;
      });
      console.log(_this.handledQsList);

      if (_this.condition == 1) {
        // 动态问卷默认先展示第一题
        _this.qsItem.push(_this.deepCopy(_this.handledQsList[0]));
      } else {
        _this.qsItem = _this.handledQsList;
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
      if (_this.condition == 1) {
        _this.dynamicSave();
        //动态，提交答案
        if (_this.isLast) {
          _this.loading = _this.$loading({
            lock: true,
            text: "已是最后一题，正在提交中，请稍候...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          _this.saveAnswer();
        }
      } else {
        if (_this.flag) {
          //静态提交答案
          _this.loading = _this.$loading({
            lock: true,
            text: "正在提交中，请稍候...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          _this.saveAnswer();
        }
        _this.staticSave();
      }
    },
    findNextQs(qs) {
      let _this = this;
      for (let index = 0; index < _this.handledQsList.length; index++) {
        if (_this.handledQsList[index].code == qs.code) {
          if (index != _this.questionList.length - 1) {
            _this.qsItem.splice(
              0,
              1,
              _this.deepCopy(_this.questionList[index + 1])
            );
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
      _this.calcPoint(qs);
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
        _this.flag = true;
        if (qs.answer instanceof Array) {
          _this.answerList[qs.code] = qs.answer.join(",");
        } else {
          _this.answerList[qs.code] = qs.answer;
        }
        if (_this.condition === 1) {
          //动态
          _this.handleDynamic(qs);
        }
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
      if (qs.answer instanceof Array) {
        _this.answerList[qs.code] = qs.answer.join(",");
      } else {
        _this.answerList[qs.code] = qs.answer;
      }
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
      //对分数加总
      if (_this.totalPoint == qs.controlPoint) {
        let nextQsList = _this.handledQsList.filter(item => {
          return item.code == qs.nextQuestionCode;
        });
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
      let _this = this;
      console.log(JSON.stringify(this.answerList));
      let answerList = JSON.stringify(this.answerList);
      //   参数：qnCode-问卷编号
      //   uid-用户uid, 开放性问卷值为空
      //   answer-回答结果，json字符串

      saveAnswerAxios({
        qnCode: this.code,
        uid: this.uid,
        answer: JSON.stringify(this.answerList)
      }).then(res => {
        console.log(res);
        if (res.data.code == 200) {
          if (window.sessionStorage.uid) {
            // 关闭回答页面时 判断是否存在uid，如果存在的话清除
            window.sessionStorage.removeItem("uid");
            this.uid = "";
          }
          console.log(this.uid);
          this.$message({
            type: "success",
            message: "提交成功,即将跳转到首页",
            duration: 5000
          });
          setTimeout(() => {
            _this.loading.close();
          }, 3000);
          const TIME_COUNT = 2;
          if (!this.timer) {
            this.count = TIME_COUNT;
            this.show = false;
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--;
              } else {
                setTimeout(() => {
                  _this.loading.close();
                }, 3000);
                this.show = true;
                clearInterval(this.timer);
                this.timer = null;
                // 跳转到问卷列表界面
                this.$router.push("/AvailableQn");
              }
            }, 1000);
          }
        } else {
          _this.loading.close();
          this.$message({
            type: "warning",
            message: res.data.msg,
            duration: 5000
          });
        }
      });
    },
    calcPoint(qs) {
      let _this = this;
      let totalPoint = 0;
      let answerList = qs.answer instanceof Array ? qs.answer : [qs.answer];
      answerList.forEach(answer => {
        qs.items.forEach(option => {
          if (answer == option.code) {
            totalPoint += option.point;
          }
        });
      });
      _this.totalPoint += totalPoint;
      console.log(_this.totalPoint);
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
      } else if (item.answerType === 5) {
        msg = "(多媒体回答题)";
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
@import "../style/QS-fill.scss";
</style>
