<template>
  <div class="Drawer">
    <el-button id="set_btn" type="primary" @click="dialog = true">设置问卷</el-button>
    <el-drawer
      title="设置问卷调查"
      :before-close="handleClose"
      :visible.sync="dialog"
      direction="ltr"
      custom-class="demo-drawer"
      ref="drawer"
    >
      <div class="demo-drawer__content">
        <el-form :model="form">
          <el-form-item label="问卷名称" :label-width="formLabelWidth">
            <el-input v-model="form.title" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="发起单位" :label-width="formLabelWidth">
            <el-input v-model="form.unitName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="选择日期" :label-width="formLabelWidth">
            <div class="block">
              <el-date-picker
                v-model="form.selectTime"
                type="datetimerange"
                align="left"
                size="large"
                unlink-panels
                format="yyyy 年 MM 月 dd 日 HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="问卷类型" :label-width="formLabelWidth">
            <el-radio v-model="form.type" :label="0">指定调查问卷对象问卷</el-radio>
            <el-radio v-model="form.type" :label="1">开放性问卷</el-radio>
          </el-form-item>
          <el-form-item label="问卷属性" :label-width="formLabelWidth">
            <el-radio v-model="form.condition" :label="0">静态问卷</el-radio>
            <el-radio v-model="form.condition" :label="1">动态问卷</el-radio>
          </el-form-item>
          <el-form-item label="问卷状态" :label-width="formLabelWidth">
            <el-radio v-model="form.status" :label="0">启用</el-radio>
            <el-radio v-model="form.status" :label="1">测试</el-radio>
            <el-radio v-model="form.status" :label="2">禁用</el-radio>
          </el-form-item>
          <el-form-item label="问卷描述">
            <el-input type="textarea" v-model="form.desc"></el-input>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button
            type="primary"
            @click="$refs.drawer.closeDrawer()"
            :loading="loading"
          >{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getList } from "../api/QS-list";
export default {
  props: {},
  name: "Drawer",
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24;
        }
      },
      table: false,
      dialog: false,
      loading: false,
      qsItemTitle: "",
      form: {
        title: "",
        code: 2,
        createTime: "2020-08-11",
        unitName: "", //发起单位
        selectTime: "",
        type: 0, //问卷类型（1：指定调查对象问卷，2：开放性问卷）
        condition: 0, //问卷属性（0：静态问卷，1：动态问卷）
        status: 1, //	问卷状态（0：无效，1：有效，2：测试）
        desc: "" //问卷描述
      },
      formLabelWidth: "100px",
      timer: null
    };
  },
  mounted() {
    // console.log(this.$route.params.num);
    let num = this.$route.params.num;
    //获取问卷属性接口
    getList({
      code: num
    }).then(res => {
      // console.log(res.data.obj[0]);
      this.form.code = res.data.obj[0].code;
      this.form.createTime = res.data.obj[0].createTime;
      this.form.unitName = res.data.obj[0].unitName;
      this.form.type = res.data.obj[0].type;
      this.form.condition = res.data.obj[0].condition;
      this.form.status = res.data.obj[0].status;
      this.form.desc = res.data.obj[0].desc;
      this.form.selectTime = [
        res.data.obj[0].startTime,
        res.data.obj[0].endTime
      ];
      this.form.title = res.data.obj[0].title;
    });
  },
  methods: {
    handleClose(done) {
      if (this.loading) {
        return;
      }
      this.$MessageBox
        .confirm("确定要保存设置吗？")
        .then(_ => {
          this.loading = true;
          this.timer = setTimeout(() => {
            done();
            // 动画关闭需要一定的时间
            setTimeout(() => {
              this.loading = false;
            }, 400);
          }, 2000);
        })
        .catch(_ => {});
    },
    cancelForm() {
      this.loading = false;
      this.dialog = false;
      clearTimeout(this.timer);
    }
  }
};
</script>

<style lang="scss" scoped>
#set_btn {
  text-align: center;
  color: #fff;
  border: 1px solid #ee7419;
  border-radius: 0.3rem;
  background-color: #ee7419;
  cursor: pointer;
}
.el-date-editor {
  width: 500px;
}
</style>