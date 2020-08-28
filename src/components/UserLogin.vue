<template>
<transition name="slide">
    <div class="modal" v-show="NewShow">
        <div class="mask"></div>
        <div class="modal-dialog">
            <div class="modal-header">
                <span>登录</span>
                <a href="JavaScript:;" class="icon-close" @click.self="close" @click="$emit('cancel')">x</a>
            </div>
            <div class="modal-body">
                <section class="form">
                    <el-form>
                        <el-form-item>
                            <el-input placeholder="用户名" v-model.trim="userName">
                                <template slot="prepend">
                                    <span class="el-icon-user"></span>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-input placeholder="密码" type="password" v-model.trim="password">
                                <template slot="prepend">
                                    <span class="el-icon-lock"></span>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item class="item">
                            <el-button @click="loginAjax" class="full" type="primary">登录</el-button>
                        </el-form-item>
                    </el-form>
                </section>
            </div>
        </div>
    </div>
</transition>
</template>

<script>
import {
    userLogin
} from "../api/user";
export default {
    name: "login",
    props: {
        show: {
            type: Boolean,
            default: false
        },
        qnCode: {
            type: String,
            default: () => {
                "";
            }
        }
    },
    data() {
        return {
            userName: "",
            password: "",
            code: "",
            NewShow: false
        };
    },
    watch: {
        show(newVal, o) {
            this.NewShow = newVal;
        },
        qnCode(newVal, o) {
            this.code = newVal;
        }
    },
    methods: {
        loginAjax() {
            if (this.userName === "") {
                this.$message({
                    type: "warning",
                    message: "请填用户名"
                });
                return false;
            }

            if (this.password === "") {
                this.$message({
                    type: "warning",
                    message: "请填写密码"
                });
                return false;
            }
            userLogin({
                qnCode: this.code,
                username: this.userName,
                password: this.password
            }).then(res => {
                console.log(res);
                if (res.data.code === 200) {
                    this.$message.success("登录成功！")
                    this.$router.push({
                        name: "fill",
                        params: {
                            code: this.code
                        }
                    });
                    return true;
                }
                this.$message({
                    type: "warning",
                    message: res.data.msg
                });
            });
        },

        close() {
            this.$emit("close", this.NewShow);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../assets/config.scss";
@import "../assets/mixin.scss";
@import "../style/UserLogin.scss";
@import "../assets/button.scss";
</style>
