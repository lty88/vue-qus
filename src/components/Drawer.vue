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
          <el-form-item label="发起单位" :label-width="formLabelWidth">
            <el-input v-model="form.Sponsor" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="选择日期" :label-width="formLabelWidth">
            <div class="block">
              <el-date-picker
                v-model="form.selectTime"
                type="daterange"
                align="left"
                size="large"
                unlink-panels
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="问卷类型" :label-width="formLabelWidth">
            <el-radio v-model="form.radiodx" label="1">指定调查问卷对象问卷</el-radio>
            <el-radio v-model="form.radiodx" label="2">开放性问卷</el-radio>
          </el-form-item>
          <el-form-item label="问卷属性" :label-width="formLabelWidth">
            <el-radio v-model="form.isActive" label="1">静态问卷</el-radio>
            <el-radio v-model="form.isActive" label="2">动态问卷</el-radio>
          </el-form-item>
          <el-form-item label="问卷状态" :label-width="formLabelWidth">
            <el-radio v-model="form.enabled" label="1">启用</el-radio>
            <el-radio v-model="form.enabled" label="2">测试</el-radio>
            <el-radio v-model="form.enabled" label="3">禁用</el-radio>
          </el-form-item>
          <el-form-item label="活动形式">
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
export default {
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
      form: {
        Sponsor: "",
        selectTime: "",
        radiodx: 1,
        isActive: 1,
        enabled: 1,
        desc: ""
      },
      formLabelWidth: "100px",
      timer: null
    };
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
</style>