<template>
  <div class="qs-list">
    <div class="table">
      <el-button class="addqs" @click="$router.push({ name: 'Add-Qs', params: { code: 0 } })" type="primary" plain>
        <i class="iconfont icon-wenjuantiaocha"></i> +新建问卷
      </el-button>

      <!-- 表格 -->
      <el-table :data="qsList" style="width: 100% "  :stripe="true" :header-cell-style="headClass" :cell-style="rowClass"
        :row-class-name="tableRowClassName">
        <!-- <el-table-column type="index" align="center" prop="methods"  label="序号"></el-table-column> -->
        <el-table-column align="center"  :show-overflow-tooltip="true" max-width="240px"  prop="title" label="问卷名称">
          <template slot-scope="scope"><span :title="scope.row.title">{{scope.row.title}}</span></template>
        </el-table-column>
        <el-table-column align="right" max-width="180px"  :show-overflow-tooltip="true" prop="unitName" label="发起单位">
          <template slot-scope="scope"><span :title="scope.row.unitName">{{scope.row.unitName}}</span></template>
        </el-table-column>
        <el-table-column align="center" max-width="130px"  :show-overflow-tooltip="true" prop="startTime" label="开始时间"></el-table-column>
        <el-table-column align="center" max-width="130px" :show-overflow-tooltip="true" prop="endTime" label="截止时间"></el-table-column>
        <el-table-column align="center"  prop="type" label="问卷类型" width="100px">
          <template slot-scope="scope">{{ scope.row.type === 1 ? '指定性问卷': '开放性问卷' }}</template>
        </el-table-column>
        <el-table-column align="center"  prop="condition " label="问卷属性" width="100px">
          <template slot-scope="scope">{{ scope.row.condition ===0 ? '静态问卷': '动态问卷' }}</template>
        </el-table-column>
        <el-table-column align="center"  prop="status" label="状态" width="60px">
          <template
            slot-scope="scope">{{ scope.row.status === 0 ? '禁用' : scope.row.status == 1?'启用' : '测试' }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="320px">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="edit(scope.$index, scope.row)">
              <i class="el-icon-edit-outline"></i>
              编辑
            </el-button>
            <el-button size="mini" type="danger" @click="iterator = delItem(scope.row);iterator.next();">
              <i class="el-icon-delete"></i>
              删除
            </el-button>
            <el-dropdown size="mini" split-button v-if="scope.row.condition===1 || scope.row.type===1">
              高级设置
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="scope.row.type===1" @click.native="userSetting(scope.row)">
                  <i class="iconfont icon-add-user"></i>参与人员控制
                </el-dropdown-item>
                <el-dropdown-item v-if="scope.row.condition===1" @click.native="condition(scope.row)">
                  <i class="iconfont icon-set"></i> 流程控制
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <span class="erweima">
              <el-popover placement="left" width="230" trigger="hover">
                <erweima :code="scope.row.code"></erweima>
                <i class="iconfont icon-erweima" slot="reference"></i>
              </el-popover>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="add-qs" v-if="qsList === 0">
      <button class="add-btn" @click="$router.push({ name: 'Add-Qs', params: { code: 0 } })">+&nbsp;&nbsp;新建问卷</button>
    </div>
    <modal-tips title="提示" btnType="3" sureText="确定" cancelText="取消" modalType="small" :showModal="showModal"
      @submit="iterator.next()" @cancel="showModal=false">
      <template v-slot:body>
        <div>{{info}}</div>
      </template>
    </modal-tips>
  </div>
</template>

<script>
  import { getList, delList } from "../api/QS-list";
  import QRCode from "qrcodejs2"; //生成二维码插件
  // import FlowControl from "@/components/FlowControl";
  import ModalTips from "@/components/ModalTips";
  import erweima from "@/components/erweima";
  export default {
    name: "qsList",
    components: {
      ModalTips,
      erweima
    },
    data() {
      return {
        qsList: [],
        // publicPath: process.env.BASE_URL,
        // erweimaUrl: require("../assets/img/erweima.png"),
        showDialog: false,
        showModal: false,
        iterator: {},
        info: "",
        code: "1", //问卷的qncode
        minHeight: 0 //设置footer高
      };
    },
    created() { },
    mounted() {
      this.minHeight = document.documentElement.clientHeight - 60;
      let _this = this;
      window.onresize = function () {
        _this.minHeight = document.documentElement.clientHeight - 60;
      };
      this.fetchList();
    },

    methods: {
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
      //表格样式变化
      tableRowClassName({ row, rowIndex }) {
        if (rowIndex === 1) {
          return "warning-row";
        } else if (rowIndex === 3) {
          return "success-row";
        }
        return "";
      },
      // 表头样式设置
      headClass() {
        return "text-align: left;background:#f7f7f7;font-size:16px";
      },
      // 表格样式设置
      rowClass() {
        return "text-align: left;font-size:15px";
      },
      //删除单个问卷
      *delItem(item) {
        console.log(item);
        yield this.showDialogMsg("确认要删除此问卷吗？");
        yield (() => {
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
      edit(index, row) {
        console.log(row);
        this.showModal = false;
        this.$router.push({
          name: "qsEdit",
          params: {
            code: row.code
          }
        });
      },
      // 参与人员控制跳转
      userSetting(user) {
        this.$router.push({
          name: "importUser",
          params: {
            code: user.code
          }
        });
      },
      //流程控制跳转
      condition(condition) {
        console.log(condition);
        this.$router.push({
          name: "FlowControl",
          params: {
            code: condition.code
          }
        });
      },
      // 查看问卷
      *watchData(item) {
        yield (() => {
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
        yield (this.showModal = false);
      }
    },
    computed: {},
    watch: {}
  };
</script>

<style lang="scss" scoped>
  @import "../common/font.css";
  @import "../style/QS-list";
</style>