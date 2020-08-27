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
                            <el-input placeholder="用户名" v-model.trim="phone">
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
            method: "pwd",
            type: "login",
            phone: "",
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
            if (this.phone === "") {
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
            //   login({
            //     method: this.method,
            //     code: this.code,
            //     phone: this.phone,
            //     password: this.password
            //   }).then(res => {
            //     if (res.code === 200) {
            //       this.$router.push({ path: "/index" });
            //       return true;
            //     }
            //     this.$message({ type: "warning", message: res.message });
            //   });
            this.$router.push({
                name: "fill",
                params: {
                    code: this.code
                }
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
