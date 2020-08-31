<template>
<div class="container">
    <div class="btn">
        <div class="goback">
            <el-button @click="goback" type="primary" plain>
                <i style="font-size:20px" class="el-icon-back"></i> 返回
            </el-button>
        </div>
        <div class="title">
            <h3>{{qsTitle}}</h3>
        </div>
        <div class="Dowlaod-template">
            <el-button type="primary" plain>
                <i style="font-size:20px" class="el-icon-s-promotion"></i>
                <a style="color:blue;font-style:none" :href="`${publicPath}Template/user.xlsx`" target="_blank" download="模板.xls">下载模板</a>
            </el-button>
        </div>
        <div class="upload">
            <el-button type="primary" plain>
                <i style="font-size:20px" class="el-icon-upload"></i> 批量导入
                <el-upload class="upload-demo" action :limit="1" :file-list="formFileList" :http-request="handleUploadForm" :on-exceed="formHandleExceed" :on-remove="formHandleRemove" :before-upload="beforeUploadForm" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
                    <el-button type="primary">上传文件</el-button>
                </el-upload>
            </el-button>
        </div>
        <div class="del-all">
            <el-button type="primary" @click="deleteAllUser" plain>
                <i style="font-size:20px" class="el-icon-delete"></i>全部删除
            </el-button>
        </div>
    </div>
    <div class="table">
        <!-- 表格 -->
        <el-table :data="tableData" style="width: 100%" :row-class-name="tableRowClassName">
            <el-table-column type="index" align="center" prop="methods" label="序号"></el-table-column>
            <el-table-column align="center" prop="username" label="用户名"></el-table-column>
            <el-table-column align="center" prop="password" label="密码"></el-table-column>
            <el-table-column align="center" prop="realName" label="姓名"></el-table-column>
            <el-table-column align="center" prop="cityName" label="市"></el-table-column>
            <el-table-column align="center" prop="areaName" label="区县"></el-table-column>
            <el-table-column align="center" prop="schoolName" label="学校"></el-table-column>
            <el-table-column align="center" prop="gradeName" label="年级"></el-table-column>
            <el-table-column align="center" prop="className" label="班级"></el-table-column>
            <el-table-column align="center" prop="artsci" label="文理属性">
                <template slot-scope="scope">{{ scope.row.artsci === 0 ? '不分科' : scope.row.artsci == 1?'文科':2?'理科': '' }}</template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">
                        <i class="el-icon-delete"></i>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</div>
</template>

<script>
import {
    getUser,
    deleteUser,
    uploadUser,
    deleteAllUser
} from "../api/Import-user";
import {
    getList
} from "../api/QS-list";
export default {
    name: "importUser",
    data() {
        return {
            headersObj: {
                Authorization: window.sessionStorage.getItem("token")
            }, //携带的请求头
            code: 1, //问卷code
            qsTitle: "", //问卷题目
            tableData: [], //参与人员表
            formMaxSize: 10, // 上传文件大小
            formFileList: [], // 显示上传文件
            uploadFormFileList: [], // 确定上传文件
            publicPath: process.env.BASE_URL
        };
    },
    created() {
        this.code = this.$route.params.code;
    },
    mounted() {
        this.fetchDataQs();
        this.fetchUserList();
    },
    methods: {
        //删除单个
        handleDelete(index, row) {
            let _this = this
            console.log(index, row);
            deleteUser({
                qnCode: _this.code,
                uid: row.uid
            }).then(res => {
                _this.fetchUserList();
                console.log(res);
            });
        },
        //删除全部
        deleteAllUser() {
            this.$confirm("此操作将删除全部参与人员, 是否继续?", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                .then(() => {
                    deleteAllUser({
                        qnCode: this.code
                    }).then(res => {
                        console.log(res);
                        this.fetchUserList();
                    });
                    this.$message({
                        type: "success",
                        message: "删除成功!"
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        //表格样式变化
        tableRowClassName({
            row,
            rowIndex
        }) {
            if (rowIndex === 1) {
                return "warning-row";
            } else if (rowIndex === 3) {
                return "success-row";
            }
            return "";
        },
        goback() {
            this.$router.push("/");
        },
        //获取问卷名称
        fetchDataQs() {
            getList({
                code: this.code
            }).then(res => {
                console.log(res);
                this.qsTitle = res.data.obj[0].title;
            });
        },
        //获取问卷参与人员信息
        fetchUserList() {
            getUser({
                qnCode: this.code
            }).then(res => {
                console.log(res);
                this.tableData = res.data.obj;
            });
        },

        // 开始上传前验证
        beforeUploadForm(file) {
            // 验证文件大小
            if (file.size / 1024 / 1024 > this.formMaxSize) {
                this.$message({
                    message: `上传文件大小不能超过${this.formMaxSize}M!`,
                    type: "warning"
                });
                return false;
            }
            // 中文乱码处理
            if (file.raw) {
                let reader = new FileReader(); // 读取文件内容
                reader.readAsText(file.raw, "gb2312"); // 防止中文乱码问题，不加reader.onload方法都不会触发
                reader.onload = function (e) {
                    this.contentHtml = e.target.result; // txt文本内容，接下来就可以对其进行校验处理了
                };
            }
            // 验证文件类型
            var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
            const extension =
                testmsg === "xlsx" || testmsg === "xls" || testmsg === "csv";
            if (!extension) {
                this.$message({
                    message: "上传文件只能是xlsx/xls/csv格式!",
                    type: "warning"
                });
            }
            return extension;
        },
        // 移除上传列表中文件
        formHandleRemove(file, formFileList) {
            let _this = this;
            for (let i = 0; i < _this.uploadFormFileList.length; i++) {
                if (_this.uploadFormFileList[i].pname === file.name) {
                    _this.uploadFormFileList.splice(i, 1);
                    break;
                }
            }
        },
        // 允许上传文件个数验证
        formHandleExceed(files, formFileList) {
            this.$message.warning(
                `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + formFileList.length} 个文件`
            );
        },
        // 上传文件
        handleUploadForm(param) {
            let _this = this;
            let formData = new FormData();
            formData.append("qnCode", this.code); // 额外参数
            formData.append("files", param.file);
            let loading = _this.$loading({
                lock: true,
                text: "上传中，请稍候...",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            uploadUser(formData).then(res => {
                console.log(res);
                if (res.data.code === 200) {
                    _this.$message("上传文件成功，" + res.data.msg);
                    _this.formFileList = [];
                    _this.uploadFormFileList = [];
                    this.fetchUserList();
                    loading.close();
                } else {
                    _this.formFileList = [];
                    _this.uploadFormFileList = [];
                    _this.$message("上传文件失败，" + res.data.msg);
                    this.fetchUserList();
                    loading.close();
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../style/import-user.scss";

.el-table .warning-row {
    background: oldlace !important;
}

.el-table .success-row {
    background: #f0f9eb !important;
}
</style>
