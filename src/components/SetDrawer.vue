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
            <el-radio v-model="form.type" :label="1">指定调查问卷对象问卷</el-radio>
            <el-radio v-model="form.type" :label="2">开放性问卷</el-radio>
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
import { UpdateQsSetting } from "../api/QS-edit";
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
      code: 1, //问卷的code
      form: {
        title: "",
        code: 2,
        createTime: "",
        unitName: "", //发起单位
        selectTime: "",
        type: 2, //问卷类型（1：指定调查对象问卷，2：开放性问卷）
        condition: 0, //问卷属性（0：静态问卷，1：动态问卷）
        status: 1, //	问卷状态（0：无效，1：有效，2：测试）
        desc: "" //问卷描述
      },
      formLabelWidth: "100px",
      timer: null
    };
  },
  created() {},
  mounted() {
    // debugger
    this.code = this.$route.params.code;
    console.log(this.code);
    //获取问卷属性接口
    //问卷不为0表示表示获取这条问卷的属性
    if (this.code != 0 && this.code != undefined) {
      getList({
        code: this.code
      }).then(res => {
        console.log(res.data.obj);
        this.form.title = res.data.obj[0].title;
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
      });
    }
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
            //修改问卷的属性
            if (this.code != 0 && this.code != undefined) {
              UpdateQsSetting({
                code: this.$route.params.code,
                title: this.form.title,
                type: this.form.type,
                startTime: this.form.selectTime[0],
                endTime: this.form.selectTime[1],
                unitName: this.form.unitName,
                desc: this.form.desc,
                createTime: this.form.createTime,
                status: this.form.status,
                condition: this.form.condition
              }).then(res => {
                if (res.data.code === 200) {
                  this.$message.success(res.data.msg);
                }
              });
            } else {
              //没有传code => 新增问卷
              UpdateQsSetting({
                code:"",
                title: this.form.title,
                type: this.form.type,
                startTime: this.form.selectTime[0],
                endTime: this.form.selectTime[1],
                unitName: this.form.unitName,
                desc: this.form.desc,
                createTime: this.form.createTime,
                status: this.form.status,
                condition: this.form.condition
              }).then(res => {
                console.log(res);
                if (res.data.code === 200) {
                  console.log(res);
                  this.$message.success(res.data.msg + ",去编辑这条问卷吧！");
                  this.$router.push({
                    name: "qsList",
                    params: {
                      from: "/"
                    }
                  });
                } else {
                   this.$message.error(res.data.msg + ",请完善问卷内容！");
                }
              });
            }
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
  display: flex;
  margin-left: auto;
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