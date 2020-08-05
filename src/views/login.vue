<template>
  <div id="login">
    <el-form
      class="form demo-ruleForm"
      ref="formLogin"
      :rules="rules"
      :label-position="labelPosition"
      :model="formLogin"
      status-icon
    >
      <div class="login-title">账号登录</div>
      <el-form-item label="用户名" prop="account">
        <el-input v-model="formLogin.account"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="formLogin.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-button type="success" class="login-btn" @click="submitForm('formLogin')">登录</el-button>
    </el-form>
  </div>
</template>

<script>
import seesion from "../store/seesion.js";
export default {
  name: "",
  props: [""],
  data() {
    var validatePass = (rule, value, callback) => {
      let reg = /^[a-zA-Z0-9_-]{6,16}$/;
      if (value === "") {
        return callback(new Error("请输入密码"));
      }
      setTimeout(() => {
        if (!reg.test(value)) {
          callback(new Error("请输入6-16位（字母，数字，下划线，减号）"));
        } else {
          callback();
        }
      }, 1000);
    };
    var validateUsername = (rule, value, callback) => {
      let reg = /^[a-zA-Z0-9_-]{5,16}$/;
      if (value === "") {
        return callback(new Error("请输入用户名"));
      }
      setTimeout(() => {
        if (!reg.test(value)) {
          callback(new Error("请输入5-16位（字母，数字，下划线，减号）"));
        } else {
          callback();
        }
      }, 1000);
    };
    return {
      labelPosition: "top",
      formLogin: {
        account: "",
        password: "",
        userId: ""
      },
      rules: {
        account: [{ validator: validateUsername, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.axios
            .post("/apiv1/login", {
              account: this.formLogin.account,
              password: this.formLogin.password
            }).then(res => {
             console.log(res);
              const token = res.data.obj.token;
              window.localStorage.setItem("token", token);
              if (res.data.code === 200) {
                this.$router.push({
                  name: "qsList",
                  params: {
                    from: "/"
                  }
                });
              }
            })
            // .catch(err=>{
            //   this.$message.error(err.data.msg);
            // });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  components: {},

  computed: {},

  beforeMount() {},

  mounted() {},

  watch: {}
};
</script>
<style lang='scss' >
// @import "../assets/base.scss";

#login {
  background-image: url("../assets/img/login_wps图片.png");
  height: 100%;
  .form {
    box-sizing: border-box;
    padding-left: 31px;
    padding-right: 31px;
    width: 410px;
    height: 400px;
    background-color: #ffffff;
    width: 40.5rem;
    font-size: 20px;
    border: 1px solid pink;
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    .login-title {
      font-size: 24px;
      text-align: center;
      margin: 20px auto 30px;
      color: #ff6600;
      font-weight: bold;
    }
    .login-btn {
      background-color: #ff6600;
      width: 60%;
      position: relative;
      left: 50%;
      top: 50%;
      transform: translate(-50%, 0%);
    }
  }
}
</style>