<template>
  <div class="AvailableQn">
    <el-container>
      <el-main v-if="noData">
        <div class="bb" v-for="item in dataList" :key="item.code">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="title">{{item.title}}</span>
              <el-button
                style="float: right; padding: 3px 5px"
                @click="fillQs(item)"
                type="text"
              >进入问卷</el-button>
            </div>
            <div class="text item">
              <h3>有效期：</h3>
              <div class="timer menue">{{item.startTime}}&nbsp;&nbsp;至&nbsp;&nbsp;{{item.endTime}}</div>
              <h3>发起单位：</h3>
              <div class="unitName menue">{{item.unitName}}</div>
              <h3>简要说明：</h3>
              <div class="des menue">{{item.desc}}</div>
            </div>
          </el-card>
          <user-login :show="showLogin" @close="showLogin=false" :qnCode="code"></user-login>
        </div>
      </el-main>
      <div class="noData" v-else>目前暂无开放的问卷</div>
    </el-container>
  </div>
</template>

<script>
import { getAvailableQn, getResults } from "../api/user";
import UserLogin from "@/components/UserLogin";
export default {
  name: "AvailableQn",
  components: {
    UserLogin
  },
  data() {
    return {
      dataList: [], //有效问卷调查列表
      showLogin: false,
      code: "1",
      noData: false
    };
  },
  created() {
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
      if (item.type == 2) {
        this.$router.push({
          name: "fill",
          params: {
            code: item.code
          }
        });
      }
      if (item.type == 1) {
        this.code = item.code;
        this.showLogin = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.AvailableQn {
//   background: url(../assets/img/bgc.jpg) fixed repeat;
}
.el-main {
  display: flex;
  align-items: center;
  flex-direction: column;
  color: #333;
  padding: 0;
  margin-top: 3z0px;
//   background-color: #909399;

  @media screen and (min-width: 768px) {
    padding: 2rem;
  }

  .el-card /deep/ .el-card__header {
    padding: 10px 20px;
    border-bottom: 1px solid #ebeef5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    font-size: 16px;
    background-color: lightgrey;
  }

  .text {
    font-size: 14px;
  }

  .title {
    font-size: 1.5rem;
    font-weight: 600;
  }

  .item {
    padding: 15px;
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both;
  }

  .box-card {
    display: flex;
    flex-direction: column;
    line-height: 2.875rem;
    min-height: 31.25rem;
    width: 90rem;

    .menue {
      text-indent: 2rem;
    }
  }

  /***************************** 媒体查询****************************/
  @media screen and(min-width: 375px) and(max-width: 392px) {
    .box-card {
      padding: 0 !important;
      margin: 0 !important;
      box-sizing: border-box;
      width: 100%;
    }
  }

  @media screen and(min-width: 401px) and(max-width: 500px) {
    .box-card {
      padding: 0 !important;
      margin: 0 !important;
      box-sizing: border-box;
      width: 412px;
    }
  }

  @media screen and (min-width: 500px) and (max-width: 760px) {
    .box-card {
      width: 100%;
      padding: 0 !important;
      margin: 0 !important;
    }
  }

  @media screen and (min-width: 768px) {
    .el-main {
      padding: 20px;
    }

    .box-card {
      width: 750px;
    }
  }
}

.noData {
  width: 100%;
  padding: 30px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>
