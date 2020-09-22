<template>
    <div id="login">
        <el-form class="form demo-ruleForm" ref="formLogin" :rules="rules" :label-position="labelPosition"
            :model="formLogin" status-icon>
            <div class="login-title">{{qsTitle}}</div>
            <el-form-item label="" prop="account">
                <el-input v-model.trim="formLogin.account" placeholder="Username" prefix-icon="el-icon-user-solid">
                </el-input>
            </el-form-item>
            <el-form-item label="" prop="password">
                <el-input type="password" placeholder="Password" show-password v-model.trim="formLogin.password"
                    autocomplete="off" prefix-icon="el-icon-lock"></el-input>
            </el-form-item>
            <span class="goBack" @click="goBack">去查看所有问卷</span>
            <div class="login-btn" @click="submitForm('formLogin')"><span>立即登录</span></div>

        </el-form>
    </div>
</template>

<script>
    import { userLogin } from "../api/user";
    import { getList } from "../api/QS-list";
    export default {
        name: "",
        props: [""],
        data() {
            var validatePass = (rule, value, callback) => {
                let reg = /^[a-zA-Z0-9]{3,16}$/;
                if (value === "") {
                    return callback(new Error("请输入密码"));
                }
                setTimeout(() => {
                    if (!reg.test(value)) {
                        callback(new Error("请输入3-16位的密码"));
                    } else {
                        callback();
                    }
                }, 1000);
            };
            var validateUsername = (rule, value, callback) => {
                let reg = /^[a-zA-Z0-9_-]{3,16}$/;
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
                code: 0,
                qsTitle: "",
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
                        userLogin({
                            qnCode: this.code,
                            username: this.formLogin.account,
                            password: this.formLogin.password
                        })
                            .then(res => {
                                console.log(res);
                                if (res.data.code === 200) {
                                    this.$message({
                                        type: "success",
                                        message: "登录成功",
                                        duration: 3000
                                    })
                                    const uid = res.data.obj.uid;
                                    window.sessionStorage.setItem("uid", uid);
                                    if (res.data.obj.status == 1) {
                                        //已经回答过了 直接跳查看结果
                                        this.$message({
                                            type: "info",
                                            message: "你已经答过此问卷了，快来查看结果吧！",
                                            duration: 3000
                                        });
                                        this.$router.push({
                                            name: "viewResults",
                                            params: {
                                                code: this.code
                                            }
                                        });
                                    } else {
                                        this.$router.push({
                                            name: "fill",
                                            params: {
                                                code: this.code
                                            }
                                        });
                                    }

                                }
                                else {
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
            },
            goBack() {
                this.$router.push("/AvailableQn")
            }
        },
        components: {},

        computed: {},

        beforeMount() { },

        mounted() {
            console.log(this.$route.params.code);
            this.code = this.$route.params.code
            getList({
                code: this.code
            }).then(res => {
                this.qsTitle = res.data.obj[0].title
            });
        },

        watch: {}
    };
</script>

<style lang="scss" scoped>
    @import "../assets/base.scss";
    @import "../style/userLoginPhone.scss";
</style>