<template>
  <div class="edit-container">
    <set-drawer></set-drawer>
    <h2 @click="titleClick" v-if="!titleChange" ref="a">{{ qsItem.title }}</h2>
    <input
      type="text"
      name="qsTitle"
      v-if="titleChange"
      v-model="titleValue"
      @blur="onblur"
      @keyup.enter="onsubmit"
      ref="titleInput"
    />
    <!--渲染数据-->
    <div class="content">
      <div class="questions" v-for="(qs, index) in datas" :key="index">
        <div class="qs-left">
          <div class="demo-image__placeholder">
            <div class="block">
              <p class="qs-title">{{ qs.title }}&nbsp;{{ qs.content}}&nbsp;{{ getMsg(qs) }}</p>
              <el-image class="titleImg" v-if="qs.type==='1'" :src="qs.titleUrl"></el-image>
              <vido-player v-if="qs.type===3||qs.type===2"></vido-player>
            </div>
          </div>
          <p v-for="(item, index) in qs.items" class="option" :key="index">
            <label>
              <div v-if="qs.answerType === 0">
                <input type="radio" :name="`${qs.title}`" />
                {{item.content}}
              </div>
              <div v-if="qs.answerType === 1">
                <input type="checkbox" :name="`${qs.title}`" />
                {{item.content}}
              </div>
            </label>
          </p>
          <textarea v-if="qs.answerType === 2"></textarea>
          <!-- 矩阵题-->
          <div class="wjdc_list">
            <table
              width="100%"
              border="0"
              cellspacing="0"
              cellpadding="0"
              class="tswjdc_table"
              v-if="qs.answerType === 4"
            >
              <tr>
                <td class="lefttd_qk">&nbsp;</td>
                <td
                  class="lefttd_tit"
                  v-for="(jzOption,jzIndex) in qs.subTitles"
                  :key="jzIndex"
                >{{jzOption.title}}</td>
              </tr>
              <!-- 渲染的矩阵的radio-->
              <tr class="os_bjqk" v-for="(jzTitle,jztIndex) in qs.items" :key="jztIndex">
                <td class="lefttd_qk">{{jzTitle.content}}</td>
                <td v-for="(jzOption,jzIndex) in qs.subTitles" :key="jzIndex">
                  <input type="radio" :name="`${jzIndex}`" />
                </td>
              </tr>
            </table>
          </div>
        </div>

        <div class="qs-right">
          <label>
            <input type="checkbox" :value="qs.isNeed" v-model="qs.isNeed" />
            此题是否必填
          </label>
          <p id="edit-btn-box-top">
            <el-button
              v-if="index !== 0"
              @click="goUp(index)"
              type="success"
              plain
              icon="el-icon-upload2"
            ></el-button>
            <!-- v-if="index !== qsItem.question.length - 1" -->
            <el-button @click="goDown(index)" plain type="success" icon="el-icon-download "></el-button>
          </p>
          <p id="edit-btn-box">
            <!-- <el-button @click="copy(index, qs)" type="success"  plain>复用</el-button> -->
            <el-button @click="del(index)" type="warning" plain>删除</el-button>
            <el-button @click="editTitle(qs,index)" type="success" plain>编辑</el-button>
          </p>
        </div>
      </div>
      <div class="add">
        <transition name="slide">
          <div class="add-option" v-if="showBtn">
            <el-button @click="addRadio" type="info" plain>单选</el-button>
            <el-button @click="addCheckbox" type="info" plain>多选</el-button>
            <el-button @click="addTextarea" type="info" plain>文本框</el-button>
            <el-button @click="addJz" type="info" plain class="btn_add_text">矩阵</el-button>
          </div>
        </transition>
        <div class="add-item" @click="addItemClick">
          <span class="add-icon">
            <i class="el-icon-circle-plus-outline" style="font-size:20px "></i>
          </span>
          <span>添加问题</span>
        </div>
      </div>
    </div>
    <!-- 编辑text radio checkbox渲染模板 -->
    <div class="shadow" v-if="showAddQsDialog">
      <div class="add-qs-dialog">
        <header>
          <span>提示</span>
          <span class="close-btn" @click="showAddQsDialog = false ;qsInputOptions=[]">X</span>
        </header>
        <p>{{ info }}</p>
        <div class="shadow-body">
          <label>
            输入题目标题
            <el-input v-model="qsInputTitle" placeholder="请输入标题"></el-input>
            <label v-if="qsTitleUrl!=''">
              多媒体链接
              <el-input v-model="qsTitleUrl" placeholder="请输入标题"></el-input>
            </label>
          </label>
          <label v-if="showAddOptionInput" id="edit-box">
            <div v-for="(qsOptions,optionsIndex) in qsInputOptions " :key="optionsIndex">
              <span>选项{{optionsIndex+1}}</span>
              <el-input v-model="qsOptions.name" placeholder="请输入内容"></el-input>
              <el-button
                @click="delItemOption(qsOptions,optionsIndex)"
                el-icon-circle-plus
                type="warning"
                plain
              >删除</el-button>
              <el-button @click="addItemOption(qsOptions,optionsIndex)" type="success" plain>增加</el-button>
            </div>
          </label>
        </div>
        <div class="btn-box">
          <button class="yes" @click="validateAddQs()">确定</button>
          <button @click="showAddQsDialog = false;qsInputOptions=[];">取消</button>
        </div>
      </div>
    </div>
    <!-- 编辑矩阵渲染模板 -->
    <div class="shadowTwo" v-if="showAddQsDialogJz">
      <div class="add-qs-dialog">
        <header>
          <span>提示</span>
          <span class="close-btn" @click="showAddQsDialogJz= false ;qsInputOptions=[]">X</span>
        </header>
        <p>{{info}}</p>
        <div class="shadow-body">
          <label>
            输入题目标题
            <el-input v-model="qsJzTitle" placeholder="请输入标题"></el-input>
          </label>
          <div id="edit-box">
            <label class="edit-jzItemOptions-box edit-box">
              <h3>横标题</h3>
              <div v-for="(rowOptions,roptionsIndex) in jzItemOptions" :key="roptionsIndex">
                <span>选项{{roptionsIndex+1}}</span>
                <el-input v-model="rowOptions.name" placeholder="请输入内容"></el-input>
                <el-button
                  @click="delJzItemOption(rowOptions,roptionsIndex)"
                  el-icon-circle-plus
                  type="warning"
                  plain
                >删除</el-button>
                <el-button
                  @click="addJzItemOption(rowOptions,roptionsIndex)"
                  type="success"
                  plain
                >增加</el-button>
              </div>
            </label>
            <label class="edit-jzTitleOptions-box edit-box">
              <h3>竖标题</h3>
              <div v-for="(colOptions,coptionsIndex) in jzTitleOptions " :key="coptionsIndex">
                <span>选项{{coptionsIndex+1}}</span>
                <el-input v-model="colOptions.title" placeholder="请输入内容"></el-input>
                <el-button
                  @click="delJzTitleOptions(colOptions,coptionsIndex)"
                  el-icon-circle-plus
                  type="warning"
                  plain
                >删除</el-button>
                <el-button
                  @click="addJzTitleOptions(colOptions,coptionsIndex)"
                  type="success"
                  plain
                >增加</el-button>
              </div>
            </label>
          </div>
        </div>
        <div class="btn-box">
          <button class="yes" @click="validateAddQsJz()">确定</button>
          <button
            @click="showAddQsDialogJz = false;  qsInputOptions=[];  jzItemOptions=[], jzTitleOptions=[];"
          >取消</button>
        </div>
      </div>
    </div>

    <div class="shadow" v-if="showDialog">
      <div class="dialog">
        <header>
          <span>提示</span>
          <span class="close-btn" @click="cancel">X</span>
        </header>
        <p>{{ info }}</p>
        <div class="btn-box">
          <button class="yes" @click="iterator.next()">确定</button>
          <button @click="cancel">取消</button>
        </div>
      </div>
    </div>

    <div class="shadow" v-if="showDialog">
      <div class="dialog">
        <header>
          <span>提示</span>
          <span class="close-btn" @click="cancel">X</span>
        </header>
        <p>{{ info }}</p>
        <div class="btn-box">
          <button class="yes" @click="iterator.next()">确定</button>
          <button @click="cancel">取消</button>
        </div>
      </div>
    </div>

    <!--对应添加问题 新增radio、checkbox、textarea模板 -->
    <v-radio
      @formData="qsData"
      :showModal="showModal"
      :types="addOptionType"
      :editData="dataObj"
      @cancel="showModal=false"
    ></v-radio>
    <!--对应添加问题 新增checkbox模板 -->
    <v-checkbox
      @formDataC="qsDataC"
      :showModal="AddshowModalC"
      :types="addOptionType"
      @cancel="AddshowModalC=false"
    ></v-checkbox>
    <!--对应添加问题 新增textarea模板 -->
    <v-textarea
      @formDataT="qsDataT"
      :showModal="AddshowModalT"
      :types="addOptionType"
      @cancel="AddshowModalT=false"
    ></v-textarea>
    <!--对应添加问题 新增矩阵模板 -->
    <v-jztemp
      :showModal="AddshowModalJz"
      @formDataJz="fDataJz"
      @cancel="AddshowModalJz=false"
      :types="addOptionType"
    ></v-jztemp>
    <footer>
      <div class="btn-box">
        <el-button type="text" class="save" @click="iterator = save();iterator.next();">保存问卷</el-button>
        <button class="issue" @click="iterator = issueQs();iterator.next();">发布问卷</button>
      </div>
    </footer>
  </div>
</template>

<script>
import storage from "../store/seesion.js";
import vRadio from "@/components/v-radio";
import vJztemp from "@/components/v-jztemp";
import vTextarea from "@/components/v-textarea";
import vCheckbox from "@/components/v-checkbox";
import SetDrawer from "@/components/SetDrawer";
import vidoPlayer from "@/components/vido";
import { editQuestionInfo } from "../api/QS-edit";
import { getList } from "../api/QS-list";

export default {
  name: "qsEdit",
  components: { vRadio, vJztemp, vTextarea, vCheckbox, SetDrawer, vidoPlayer },
  data() {
    return {
      qsItem: {},
      qsList: {},
      isError: false,
      showBtn: false,
      titleChange: false,
      titleValue: "",
      showAddQsDialog: false,
      showAddQsDialogJz: false,
      showAddOptionInput: true,
      AddshowModalJz: false, //矩阵的增加modal
      AddshowModalT: false, //textarea的增加modal
      AddshowModalC: false, //checkbox的增加modal
      qsInputTitle: "",
      qsTitleUrl: "", //用户上传的链接
      qsJzTitle: "",
      qsInputOptions: [],
      jzTitleOptions: [],
      jzItemOptions: [],
      starTime: "",
      endTime: "",
      info: "",
      addOptionType: "", //增加的类型
      limit: {},
      showDialog: false,
      iterator: {},
      isGoIndex: false,
      numID: 0,
      currEditIndex: -1,
      showModal: false,
      dataObj: {},
      datas: []
    };
  },
  created() {
    this.fetchData();
  },
  mounted() {
    let nums = this.$route.params.num;
    // 获取列表数据接口
    editQuestionInfo({
      qncode: nums
    }).then(res => {
      // console.log(res.data.obj);
      this.datas = res.data.obj;
      console.log(this.datas);
    });
  },
  methods: {
    // radio单选子组件传递过来的数据
    qsData(e) {
      console.log(e);
      this.showModal = false;
      let res = JSON.stringify(e);
      console.log("子组件传过来的值：" + res);
      this.qsItem.question.push(JSON.parse(JSON.stringify(e)));

      // this.qsList.push(this.qsItem);
    },
    // checkbox单选子组件传递过来的数据
    qsDataC(e) {
      console.log(e);
      this.AddshowModalC = false;
      let res = JSON.stringify(e);
      console.log("子组件传过来的值：" + res);
      this.qsItem.question.push(JSON.parse(JSON.stringify(e)));
      // this.qsList.push(this.qsItem);
    },
    // Textarea单选子组件传递过来的数据
    qsDataT(e) {
      console.log(e);
      this.AddshowModalT = false;
      let res = JSON.stringify(e);
      console.log("子组件传过来的值：" + res);
      this.qsItem.question.push(JSON.parse(JSON.stringify(e)));
    },
    // 矩阵子组件传递过来的数据
    fDataJz(e) {
      this.AddshowModalJz = false;
      let res = JSON.stringify(e);
      console.log("子组件传过来的值：" + res);
      this.qsItem.question.push(JSON.parse(JSON.stringify(e)));
      console.log(e);
    },
    fetchData() {
      if (this.$route.params.num == 0) {
        let item = {};
        item.num = this.qsList.length + 1;
        item.title = "这里是标题";
        item.starTime = "";
        item.endTime = "";
        item.state = "noissue";
        item.question = [];
        item.stateTitle = "未发布";
        item.checked = false;
        this.qsItem = item;
        this.qsList.push(this.qsItem);
      }
      // else {
      //   let i = 0;
      //   for (let length = this.qsList.length; i < length; i++) {
      //     if (this.qsList[i].num == this.$route.params.num) {
      //       this.qsItem = this.qsList[i];
      //       break;
      //     }
      //   }
      //   if (i === this.qsList.length) this.isError = true;
      // }
    },
    getMsg(item) {
      let msg = "";
      if (item.type === "radio") {
        msg = "(单选题)";
      } else if (item.type === "checkbox") {
        msg = "(多选题)";
      }
      if (item.type === "jz") {
        msg = "(矩阵题)";
      } else {
        msg = "(文本题)";
      }
      return item.isNeed ? `${msg} *` : msg;
    },
    onblur() {
      this.titleValue = this.titleValue.trim();
      this.qsItem.title =
        this.titleValue === "" ? this.qsItem.title : this.titleValue;
      this.titleChange = false;
    },
    onsubmit() {
      this.titleValue = this.titleValue.trim();
      this.qsItem.title =
        this.titleValue === "" ? this.qsItem.title : this.titleValue;
      this.titleChange = false;
    },
    titleClick() {
      console.log(this.$refs.a.innerHTML);
      this.titleChange = !this.titleChange;
      setTimeout(() => {
        this.$refs.titleInput.focus();
        // console.log(this.$refs.titleInput);
      }, 150);
    },
    swapItems(oldIndex, newIndex) {
      let [newVal] = this.qsItem.question.splice(
        newIndex,
        1,
        this.qsItem.question[oldIndex]
      );
      this.qsItem.question.splice(oldIndex, 1, newVal);
    },
    goUp(index) {
      this.swapItems(index, index - 1);
      console.log("index :>> ", index);
    },
    goDown(index) {
      this.swapItems(index, index + 1);
    },
    del(index) {
      this.qsItem.question.splice(index, 1);
    },
    addItemClick() {
      if (this.showBtn === false) {
        this.questionLength === 20
          ? alert("问卷已满！")
          : (this.showBtn = !this.showBtn);
      } else {
        this.showBtn = !this.showBtn;
      }
    },
    editTitle(qs, index) {
      this.qsInputTitle = "";
      this.qsJzTitle = "";
      this.qsInputOptions = [];
      this.jzTitleOptions = [];
      this.jzItemOptions = [];
      console.log("yyb=" + JSON.stringify(qs));
      console.log(qs.type);
      let typeOne =
        qs.type === "checkbox" || qs.type === "radio" || qs.type === "textarea";
      let typeTwo = qs.type === "checkbox" || qs.type === "radio";
      this.qsTitleUrl = qs.titleUrl;
      if (typeOne) {
        if (typeOne) {
          this.qsInputTitle = qs.title;
          this.currEditIndex = index;
          if (typeTwo) {
            this.qsInputOptions = qs.options;
            this.showAddQsDialog = true;
          }
        }
        this.showAddQsDialog = true;
      } else {
        if (qs.type === "jz") {
          this.showAddQsDialogJz = true;
          this.qsJzTitle = qs.title;
          this.currEditIndex = index;
          this.jzTitleOptions = qs.jzTitle;
          this.jzItemOptions = qs.jzOptions;
        }
        this.showAddQsDialogJz = true;
      }

      // console.log(qs);
      // if (qs.type === "radio") {
      //   this.showModal = true;
      //   this.dataObj = qs;
      // }
    },
    addRadio() {
      if (this.questionLength === 20) return alert("问卷已满！");
      this.showModal = true;
      this.addOptionType = "radio";
    },
    addCheckbox() {
      if (this.questionLength === 20) return alert("问卷已满！");
      this.AddshowModalC = true;
      this.addOptionType = "checkbox";
    },
    addTextarea() {
      if (this.questionLength === 20) return alert("问卷已满！");
      this.AddshowModalT = true;
      this.addOptionType = "textarea";
    },
    addJz() {
      if (this.questionLength === 20) return alert("问卷已满！");
      this.AddshowModalJz = true;
      this.addOptionType = "jz";
    },
    // 增加删除矩阵类型
    delJzItemOption(rowOptions, roptionsIndex) {
      let rownum = this.jzItemOptions.length;
      console.log(rownum);
      if (rownum >= 4) {
        this.jzItemOptions.splice(rowOptions, 1);
      } else this.$message.error("至少保留三项");
    },
    delJzTitleOptions(colOptions, coptionsIndex) {
      let cowNum = this.jzTitleOptions.length;
      console.log(cowNum);
      if (cowNum >= 4) {
        this.jzTitleOptions.splice(coptionsIndex, 1);
      } else this.$message.error("至少保留三项");
    },
    addJzItemOption(rowOptions, roptionsIndex) {
      let rowNumT = this.jzItemOptions.length;
      console.log(rowNumT);
      if (rowNumT < 8) {
        let jzItemOptions = { name: "" };
        this.jzItemOptions.push(rowOptions);
      } else this.$message.error("最多只能有八项");
    },
    addJzTitleOptions(colOptions, coptionsIndex) {
      let rowNumO = this.jzTitleOptions.length;
      if (rowNumO < 8) {
        let jzTitleOptions = { name: "" };
        this.jzTitleOptions.push(colOptions);
      } else this.$message.error("最多只能有八项");
    },
    // 增加删除checkbox radio text类型
    delItemOption(qsOptions, optionsIndex) {
      this.qsInputOptions.splice(optionsIndex, 1);
    },
    addItemOption() {
      let qsOptions = { name: "" };
      this.qsInputOptions.push(qsOptions);
    },
    validateAddQs() {
      let qsTitle = this.qsInputTitle.trim();
      if (this.currEditIndex >= 0) {
        //編輯
        let Types = this.qsItem.question[this.currEditIndex];
        console.log(Types);
        this.qsItem.question[this.currEditIndex].title = qsTitle;
        if (Types === "checkbox" || Types === "radio") {
          this.qsItem.question[this.currEditIndex].options.name = JSON.parse(
            JSON.stringify(this.qsInputOptions)
          );
          let qsOptionss = this.qsInputOptions;
          qsOptionss.forEach((item, index) => {
            if (item.name === "") {
              this.$message.error("选项为空");
            }
          });
        }
      }
      if (qsTitle === "") {
        this.$message.error("题目为空");
      } else {
        this.showAddQsDialog = false;
        this.currEditIndex = -1;
        this.qsInputOptions = {};
      }
    },
    validateAddQsJz() {
      if (this.qsJzTitle === "") {
        this.$message.error("题目不能为空");
      } else {
        this.showAddQsDialog = false;
      }
    },
    // 保存问卷
    *save() {
      this.showDialog = true;
      this.info = "确认保存?";
      let str = "这里是标题";
      yield;
      // debugger
      if (this.qsItem.question.length === 0) {
        this.showDialog = false;
        this.$message.error("问卷为空，不能保存");
      } else if (this.qsItem.title === str) {
        this.showDialog = false;
        this.$message.error("问卷标题为空，不能保存");
      } else {
        storage.save(this.qsList);
        this.info = "是否发布?";
        this.isGoIndex = true;
      }
      yield;
      this.qsItem.state = "inissue";
      this.qsItem.stateTitle = "发布中";

      storage.save(this.qsList);
      this.showDialog = false;
      this.$router.push({
        path: "/"
      });
    },
    //发布问卷
    *issueQs() {
      this.showDialog = true;
      this.info = "确认发布?";
      yield;
      if (this.qsItem.question.length === 0) {
        console.log(this.qsItem.question.length);
        this.showDialog = false;
        alert("问卷为空无法保存");
      } else {
        this.qsItem.state = "inissue";
        this.qsItem.stateTitle = "发布中";
        storage.save(this.qsList);
        this.showDialog = false;
        this.$router.push({
          path: "/"
        });
      }
    },
    cancel() {
      this.showDialog = false;
      if (this.isGoIndex === true) {
        this.$router.push({
          path: "/"
        });
      }
    }
  },
  computed: {
    questionLength() {
      return this.qsItem.question.length;
    }
  },
  watch: {
    $route: "fetchData",
    qsItem: {
      handler(newVal) {
        newVal.question.forEach((item, index) => {
          item.num = `Q${index + 1}`;
        });
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../style/QS-edit";
#edit-box {
  width: 80%;
  margin: 0 auto;
}
.btn_add_text {
  display: inline-block;
  width: 9.5rem !important;
  text-align: center !important;
}
</style>
