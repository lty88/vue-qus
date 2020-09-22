<template>
  <div class="AvailableQn">
    <el-container>
      <el-main v-if="noData">
        <div class="bb" v-for="item in dataList" :key="item.code">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="title">{{item.title}}</span>
              <el-button style="float: right; padding: 3px 5px" @click="fillQs(item)" type="text">
                <i class="iconfont uni-iconfonts icon-custom308"></i>
                进入问卷
              </el-button>
            </div>
            <div class="text item">
              <h3>
                <i class="iconfont uni-iconfonts icon-ico_wupinguanli_wupinyouxiaoqiyujing"></i>有效期：
              </h3>
              <div class="timer menue">{{item.startTime}}&nbsp;&nbsp;至&nbsp;&nbsp;{{item.endTime}}</div>
              <h3>
                <i class="iconfont uni-iconfonts icon-xuexiao"></i>发起单位：
              </h3>
              <div class="unitName menue">{{item.unitName}}</div>
              <h3>
                <i class="iconfont uni-iconfonts icon-wenjianleixingFileTypes11"></i>问卷类型：
              </h3>
              <div class="menue">{{item.type === 1 ? '指定性问卷': '开放性问卷'}}</div>
              <h3>
                <i class="iconfont uni-iconfonts icon-shuxingliebiaoxiangqing"></i>问卷属性：
              </h3>
              <div class="condition menue">{{item.condition ===0 ? '静态问卷': '动态问卷' }}</div>
              <h3>
                <i class="iconfont uni-iconfonts icon-hangchengmiaoshu"></i>简要说明：
              </h3>
              <div class="des menue">{{item.desc}}</div>
            </div>
          </el-card>
          <user-login v-if="isPc" :show="showLogin" @close="showLogin=false" :qnCode="code"></user-login>
        </div>
      </el-main>
      <div class="noData" v-else>目前暂无开放的问卷</div>
    </el-container>
  </div>
</template>

<script>
  import { getAvailableQn, getResults, userLogin } from "../api/user";
  import UserLogin from "@/components/UserLogin";
  export default {
    name: "AvailableQn",
    components: {
      UserLogin,
    },
    data() {
      return {
        dataList: [], //有效问卷调查列表
        showLogin: false,
        code: "1",
        noData: false,
        isPc: false,
        flag: "phone"
      };
    },
    created() {
      //获取用户设备
      this.getMobile()
      getAvailableQn().then(res => {
        if (res.data.obj.length != 0) {
          console.log(res);
          this.dataList = res.data.obj;
          this.noData = true;
        } else {
          this.$message({
            type: "info",
            message: "目前暂无开放的问卷",
            duration: 5000
          });
          this.dataList = [];
          this.noData = false;
        }
      });
    },
    methods: {
      fillQs(item) {
        console.log(item);
        if (item.type == 2) {
          userLogin({
            qnCode: item.code,
            username: "",
            password: ""
          }).then(res => {
            this.$router.push({
              name: "fill",
              params: {
                code: item.code
              }
            });
          });
        } else {
          //type为1=》指定性问卷 需要登录
          this.code = item.code;
          if (this.isPc) {
            //移动端
            this.showLogin = true;
          } else {
            this.$router.push({
              name: "userLoginPhone",
              params: {
                code: item.code
              }
            });
          }

        }
      },
      //监听设备
      getMobile() {
        this.flag = navigator.userAgent.match(
          /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
        );
        if (this.flag === null) {
          console.log("pc端");
          this.isPc = true;
        } else {
          console.log("移动端");
          this.isPc = false;
        }
      },
    }

  };
</script>

<style lang="scss" scoped>
  @import "../style/availableQn.scss"
</style>