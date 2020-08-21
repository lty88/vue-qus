<template>
  <div class="edit-container">
    <router-link to="/" tag="span" class="back">
      <i class="el-icon-arrow-left" style="font-size:25px;font-weight: bold"></i>
    </router-link>
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
              </div>
              <div v-if="qs.answerType === 1">
                <input type="checkbox" :name="`${qs.title}`" />
                {{item.content}}
              </div>
            </label>
          </p>
          <textarea v-if="qs.answerType === 2"></textarea>
          <!-- 矩阵题-->
          <div class="wjdc_list">
            <table
              width="100%"
              border="0"
              cellspacing="0"
              cellpadding="0"
              class="tswjdc_table"
              v-if="qs.answerType === 4||qs.answerType === 3"
            >
              <tr>
                <td class="lefttd_qk">&nbsp;</td>
                <td
                  class="lefttd_tit"
                  v-for="(jzOption,jzIndex) in qs.subTitles"
                  :key="jzIndex"
                >{{jzOption.title}}</td>
              </tr>
              <!-- 渲染的矩阵的radio-->
              <tr class="os_bjqk" v-for="(jzTitle,jztIndex) in qs.items" :key="jztIndex">
                <td class="lefttd_qk">{{jzTitle.content}}</td>
                <td v-for="(jzOption,jzIndex) in qs.subTitles" :key="jzIndex">
                  <input type="radio" :name="`${jzIndex}`" />
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
    <footer>
      <div class="btn-box">
        <button class="issue">提交问卷</button>
      </div>
    </footer>
  </div>
</template>

<script>
import vidoPlayer from "@/components/vido";
import { GetQuestionInfo, UpdateQsInfo, DeleteQsItems } from "../api/QS-edit";
import { getList } from "../api/QS-list";
import { getAvailableQn } from "../api/user";

export default {
  name: "qsEdit",
  components: { vidoPlayer },
  data() {
    return {
      qsItem: [],

      code: 1
    };
  },
  mounted() {
    this.fetchData();
    this.fetchAvailableQn();
  },
  methods: {
    fetchData() {
      this.code = this.$route.params.code;
      // 获取列表数据信息接口
      if (this.code != 0) {
        GetQuestionInfo({
          qncode: this.code
        }).then(res => {
          console.log(res);
          this.qsItem = res.data.obj;
          console.log(this.qsItem);
        });
      }
    },
    fetchAvailableQn() {
      getAvailableQn().then(res => {
        console.log(res);
      });
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
@import "../style/QS-edit";
</style>
