<template>
<div id="login">
    <el-form class="form demo-ruleForm" ref="formLogin" :rules="rules" :label-position="labelPosition" :model="formLogin" status-icon>
        <div class="login-title">乐培生问卷管理系统</div>
        <el-form-item label="用户名" prop="account">
            <el-input v-model.trim="formLogin.account" placeholder="Username" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input type="password" placeholder="Password" show-password v-model.trim="formLogin.password" autocomplete="off" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <div class="login-btn" @click="submitForm('formLogin')">Log  In</div>
    </el-form>
</div>
</template>

<script>
import {
    login
} from "../api/user.js";

export default {
    name: "",
    props: [""],
    data() {
        var validatePass = (rule, value, callback) => {
            let reg = /^[a-zA-Z0-9]{6,16}$/;
            if (value === "") {
                return callback(new Error("请输入密码"));
            }
            setTimeout(() => {
                if (!reg.test(value)) {
                    callback(new Error("请输入6-16位的密码"));
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
                account: [{
                    validator: validateUsername,
                    trigger: "blur"
                }],
                password: [{
                    validator: validatePass,
                    trigger: "blur"
                }]
            }
        };
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    login({
                            account: this.formLogin.account,
                            password: this.formLogin.password
                        })
                        .then(res => {
                            console.log(res);
                            if (res.data.code === 200) {
                                const token = res.data.obj.token;
                                console.log(token);
                                window.sessionStorage.setItem("token", token);
                                this.$router.push({
                                    name: "qsList",
                                    params: {
                                        from: "/"
                                    }
                                });
                            }
                            if (res.data.code === 503) {
                                console.log(res.data.code);
                                this.$message.error(res.data.msg);
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            this.$message.error("服务器异常，请联系客服");
                        });
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

<style lang="scss" scoped>
 @import "../assets/base.scss";
 @import "../style/login.scss";
</style>
