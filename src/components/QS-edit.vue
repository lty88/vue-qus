<template>
  <div class="edit-container">
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
    
    <div class="content">
    
      <div class="questions" v-for="(qs, index) in qsItem.question" :key="index">
        <div class="qs-left">
          <p class="qs-title">{{ qs.num }}&nbsp;{{ qs.title }}&nbsp;{{ getMsg(qs) }}</p>
          <p v-for="(option, index) in qs.options" class="option" :key="index">
            <label>
              <input type="radio" :name="`${qs.num}-${qs.title}`" v-if="qs.type === 'radio'" />
              <input type="checkbox" :name="`${qs.num}-${qs.title}`" v-if="qs.type === 'checkbox'" />
              {{ option.name }}
            </label>
          </p>
          <textarea v-if="qs.type === 'textarea'"></textarea>
          <div class="jz"></div>
        </div>
        <!-- <div class="wjdc_list">
        <p class="title_wjht"><i class="nmb">4</i>. 对目前的工作哪方面不满意？</p>
        <table width="100%" border="0" cellspacing="0" cellpadding="0" class="tswjdc_table">
          <tr>
            <td class="lefttd_qk">&nbsp;</td>
            <td>非常喜欢</td>
            <td>喜欢</td>
            <td>一般</td>
            <td>不喜欢</td>
            <td>非常不喜欢</td>
          </tr>
          <tr class="os_bjqk">
            <td class="lefttd_qk">CCTV1</td>
            <td><input name="c1" type="radio" value=""></td>
            <td><input name="c2" type="radio" value=""></td>
            <td><input name="c3" type="radio" value=""></td>
            <td><input name="c4" type="radio" value=""></td>
            <td><input name="c5" type="radio" value=""></td>
          </tr>
          <tr>
            <td class="lefttd_qk">CCTV2</td>
            <td><input name="c1" type="radio" value=""></td>
            <td><input name="c2" type="radio" value=""></td>
            <td><input name="c3" type="radio" value=""></td>
            <td><input name="c4" type="radio" value=""></td>
            <td><input name="c5" type="radio" value=""></td>
          </tr>
          <tr class="os_bjqk">
            <td class="lefttd_qk">CCTV3</td>
            <td><input name="c1" type="radio" value=""></td>
            <td><input name="c2" type="radio" value=""></td>
            <td><input name="c3" type="radio" value=""></td>
            <td><input name="c4" type="radio" value=""></td>
            <td><input name="c5" type="radio" value=""></td>
          </tr>
        </table>
      </div> -->
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
            <el-button
              v-if="index !== qsItem.question.length - 1"
              @click="goDown(index)"
              plain
              type="success"
              icon="el-icon-download "
            ></el-button>
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
            <el-button type="info" plain>矩阵</el-button>
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
    <!-- 编辑渲染模板 -->
    <div class="shadow" v-if="showAddQsDialog">
      <div class="add-qs-dialog">
        <header>
          <span>提示</span>
          <span class="close-btn" @click="showAddQsDialog = false ;qsInputOptions={}" >X</span>
        </header>
        <p>{{ info }}</p>
        <div class="shadow-body">
          <label>
            输入题目标题
            <el-input v-model="qsInputTitle" placeholder="请输入标题"></el-input>
          </label>
          <label v-if="showAddOptionInput" id="edit-box">
            输入选项
            <div v-for="(qsOptions,optionsIndex) in qsInputOptions " :key="optionsIndex">
              <span>选项{{optionsIndex+1}}</span>
              <el-input v-model="qsOptions.name" placeholder="请输入内容"></el-input>
              <el-button
                @click="delItemOption(qsOptions,optionsIndex)"
                el-icon-circle-plus
                type="warning"
                plain
              >删除</el-button>
              <el-button @click="addItemOption(qs,index)" type="success" plain>增加</el-button>
            </div>
          </label>
        
        </div>
        <div class="btn-box">
          <button class="yes" @click="validateAddQs()">确定</button>
          <button @click="showAddQsDialog = false;qsInputOptions={};">取消</button>
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

    <!-- 新增radio与checkbox模板 -->
    <Rctemp @formData='qsData'  :showModal="showModal" :types='addOptionType'  @cancel="showModal=false"></Rctemp>

    <footer>
      <div class="block">
        <span class="demonstration">开始日期</span>
        <el-date-picker
          v-model="selectTime"
          value-format="yyyy-MM-dd"
          align="center"
          type="date"
          size="small"
          placeholder="选择日期"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </div>
      <div class="btn-box">
        <el-button type="text" class="save" @click="iterator = save();iterator.next();">保存问卷</el-button>
        <button class="issue" @click="iterator = issueQs();iterator.next();">发布问卷</button>
      </div>
       <div class="block">
        <span class="demonstration">截止日期</span>
        <el-date-picker
          v-model="selectTime"
          value-format="yyyy-MM-dd"
          align="center"
          type="date"
          size="small"
          placeholder="选择日期"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </div>
     
      <!-- <p>{{selectTime}}</p> -->
    </footer>
  </div>
</template>

<script>
import storage from "../store/index";
import Rctemp from '@/components/Rctemp'
export default {
  name: "qsEdit",
  components: {Rctemp},
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "一天后",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周后",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一月后",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      qsItem: {
          num: 1,
          title: "第一份问卷",
          time: "2030-1-1",
          state: "noissue",
          stateTitle: "发布中",
          checked: false,
          question: [
            {
              num: "Q1",
              title: "单选题",
              type: "radio",
              isNeed: true,
              options: [{name:'选项一'},{name:'选项二'},{name:'选项三'}]
            }
          ]
      },
      qsList: storage.get(),
      isError: false,
      showBtn: false,
      titleChange: false,
      titleValue: "",
      showAddQsDialog: false,
      showAddOptionInput: true,
      qsInputTitle: "",
      qsInputOptions: [],
      info: "",
      selectTime: "",
      addOptionType: "",
      limit: {},
      showDialog: false,
      iterator: {},
      isGoIndex: false,
      numID: 0,
      currEditIndex: -1,
     showModal:false
    };
  },
  beforeRouteEnter(to, from, next) {
    // console.log(to);
    let num = to.params.num;
    let theItem = {};
    let length = storage.get().length;
    // console.log(num);
    // console.log(length);
    next(vm => {
      // console.log(vm);
    });
    if (num != 0) {
      let length = storage.get().length;
      if (num < 0 || num > length) {
        alert("非法路由!");
        next("/");
      } else {
        for (let i = 0; i < length; i++) {
          if (storage.get()[i].num == num) {
            theItem = storage.get()[i];
            break;
          }
        }
      }
      if (theItem.state === "noissue") {
        next();
      } else {
        alert("非法路由");
        next("/");
      }
    } else {
      next();
    }
  },
  created() {
    this.fetchData();
    // console.log(storage.get());
  },
  mounted() {
    if (this.$route.params.num != 0) {
      //console.log(typeof this.$route.params)
      let numID = this.$route.params.num - 1;
      // console.log(numID);
      let fir = this.qsList[numID];
      // console.log(this.qsList[numID]);
      // console.log(fir);
      this.selectTime = fir.time;
    }
  },
  methods: {
    // 子组件传递过来的数据
    qsData(e){
      console.log(e);
      this.showModal=false
       this.qsItem.question.push(JSON.parse(JSON.stringify(e)));
       this.qsList.push(this.qsItem);
    },
    fetchData() {
      if (this.$route.params.num == 0) {
        let item = {};
        item.num = this.qsList.length + 1;
        item.title = "这里是标题";
        item.time = "";
        item.state = "noissue";
        item.question = [];
        item.stateTitle = "未发布";
        item.checked = false;
        this.qsItem = item;
        this.qsList.push(this.qsItem);
        console.log(item.time);
      } else {
        let i = 0;
        for (let length = this.qsList.length; i < length; i++) {
          if (this.qsList[i].num == this.$route.params.num) {
            this.qsItem = this.qsList[i];
            break;
          }
        }
        if (i === this.qsList.length) this.isError = true;
      }
    },
    getMsg(item) {
      let msg = "";
      if (item.type === "radio") {
        msg = "(单选题)";
      } else if (item.type === "checkbox") {
        msg = "(多选题)";
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
    // copy(index, qs) {
    //   // if (this.questionLength === 10) return alert('问卷已满！')
    //   qs = Object.assign({}, qs);
    //   this.qsItem.question.splice(index, 0, qs);
    // },
    del(index) {
      this.qsItem.question.splice(index, 1);
    },
    addItemClick() {
      if (this.showBtn === false) {
        this.questionLength === 10
          ? alert("问卷已满！")
          : (this.showBtn = !this.showBtn);
      } else {
        this.showBtn = !this.showBtn;
      }
    },
    showAddDialog(msg, showOption) {
      this.showAddQsDialog = true;
      this.showAddOptionInput = showOption;
      this.info = msg;
      this.qsInputTitle = "";
      this.qsInputOptions = "";
    },
    editTitle(qs, index) {
      console.log("yyb=" + JSON.stringify(qs))
      this.qsInputTitle = qs.title;
      this.currEditIndex = index;
      if (qs.type === "checkbox" || qs.type === "radio") {
        this.qsInputOptions = qs.options;
        this.showAddQsDialog = true;
      }
       this.showAddQsDialog = true;
    },
    addRadio() {
      if (this.questionLength === 10) return alert("问卷已满！");
      this.showModal=true
      this.addOptionType = "radio";
    },
    addCheckbox() {
      if (this.questionLength === 10) return alert("问卷已满！");
      this.showModal=true
      this.addOptionType = "checkbox";
    },
    addTextarea() {
      if (this.questionLength === 10) return alert("问卷已满！");
      this.showModal=true
      this.addOptionType = "textarea";
    },
    delItemOption(qsOptions, optionsIndex) {
      this.qsInputOptions.splice(optionsIndex, 1);
    },
    addItemOption() {
      let qsOptions = {
        name: ""
      };
      this.qsInputOptions.push(qsOptions);
    },
    validateAddQs() {
      let qsTitle = this.qsInputTitle.trim();
      if (this.currEditIndex >= 0) {
        //編輯
     let Types=this.qsItem.question[this.currEditIndex]
        this.qsItem.question[this.currEditIndex].title = qsTitle;
        if(Types==='checkbox'||Types==='radio'){
        this.qsItem.question[this.currEditIndex].options.name = JSON.stringify(
         this.qsInputOptions
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
      }
      // this.qsInputOptions.forEach;
      this.showAddQsDialog = false;
      this.currEditIndex = -1;
      this.qsInputOptions={};
    },
    *save() {
      this.showDialog = true;
      this.info = "确认保存?";
      this.qsItem.time = this.selectTime;
      yield;
      if (this.qsItem.question.length === 0) {
        this.showDialog = false;
        this.$message.error("问卷为空，不能保存");
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
        this.qsItem.time = this.selectTime;
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
</style>
