<template>
  <div class="edit-container">
    <router-link to="/" tag="span" class="back">
      <i class="el-icon-arrow-left" style="font-size:25px;font-weight: bold"></i>
    </router-link>
    <set-drawer></set-drawer>
    <div class="set-user"></div>
    <!--渲染数据-->
    <div class="content">
      <div class="questions" v-for="(qs, index) in qsItem" :key="index">
        <div class="qs-left">
          <div class="demo-image__placeholder">
            <div class="block">
              <p class="qs-title">{{qs.title}}.&nbsp;{{ getMsg(qs)}}&nbsp;&nbsp;{{ qs.content}}</p>
              <div class="title-meida">
                <imgPreview v-if="qs.type===1" :imgUrl="qs.url"></imgPreview>
              </div>
              <div class="audio title-meida" v-if="qs.type===2">
                <audio controls :src="qs.url">
                  <source type="audio/ogg" />Your browser does not support this audio format.
                </audio>
              </div>
              <div class="vido title-meida" v-if="qs.type===3">
                <video-player :vidoUrl="qs.url"></video-player>
              </div>
            </div>
          </div>
          <p v-for="(item, index) in qs.items" class="option" :key="index">
            <label>
              <div v-if="qs.answerType === 0">
                <imgPreview v-if="item.type===1" :imgUrl="item.url"></imgPreview>
                <div class="audio" v-if="item.type===2">
                  <audio controls :src="item.url">
                    <source type="audio/ogg" />Your browser does not support this audio format.
                  </audio>
                </div>
                <div class="vido" v-if="item.type===3">
                  <video-player :vidoUrl="item.url"></video-player>
                </div>
                <div class="content-box">
                  <input type="radio" :name="`${qs.title}`" />
                  <span class="t-content">{{item.content}}</span>
                </div>
              </div>
              <div v-if="qs.answerType === 1">
                <imgPreview v-if="item.type===1" :imgUrl="item.url"></imgPreview>
                <div class="audio" v-if="item.type===2">
                  <audio controls>
                    <source :src="item.url" type="audio/ogg" />Your browser does not support this audio format.
                  </audio>
                </div>
                <div class="vido" v-if="item.type===3">
                  <video-player :vidoUrl="item.url"></video-player>
                </div>
                <div class="content-box">
                  <input type="checkbox" :name="`${qs.title}`" />
                  <span class="t-content">{{item.content}}</span>
                </div>
              </div>
            </label>
          </p>
          <textarea class="text" placeholder="请填写你的答案" v-if="qs.answerType === 2"></textarea>
          <!-- 单选矩阵题-->
          <div class="wjdc_list">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" class="tswjdc_table"
              v-if="qs.answerType === 3">
              <tr>
                <td class="lefttd_qk">&nbsp;</td>
                <td class="lefttd_tit" v-for="(jzOption,jzIndex) in qs.items" :key="jzIndex">{{jzOption.content}}</td>
              </tr>
              <!-- 渲染的矩阵的radio-->
              <tr class="os_bjqk" v-for="option in qs.subTitles" :key="option.code">
                <td class="lefttd_qk">{{option.title}}</td>
                <td v-for="jzOption in qs.items" :key="jzOption.code">
                  <input type="radio" :value="jzOption.code" :name="jzOption.code" />
                  <!-- {{jzOption.code}} -->
                </td>
              </tr>
            </table>
          </div>
          <div class="wjdc_list">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" class="tswjdc_table"
              v-if="qs.answerType === 4">
              <tr>
                <td class="lefttd_qk">&nbsp;</td>
                <td class="lefttd_tit" v-for="(jzOption,jzIndex) in qs.items" :key="jzIndex">{{jzOption.content}}</td>
              </tr>
              <!-- 渲染的矩阵的radio-->
              <tr class="os_bjqk" v-for="subTitles in qs.subTitles" :key="subTitles.code">
                <td class="lefttd_qk">{{subTitles.title}}</td>
                <td v-for="jzOption in qs.items" :key="jzOption.code">
                  <input type="checkbox" :value="jzOption.code" :name="subTitles.code" />
                </td>
              </tr>
            </table>
          </div>
          <div v-if="qs.answerType === 5">
            <upload-ipt :uploadType="uploadTypeImg" :answerType="qs.answerType" :Isdisabled="true"></upload-ipt>
          </div>
          <div v-if="qs.answerType === 6">
            <upload-ipt :uploadType="uploadTypeAudio" :answerType="qs.answerType" :Isdisabled="true"></upload-ipt>
          </div>
          <div v-if="qs.answerType === 7">
            <upload-ipt :uploadType="uploadTypeVideo" :answerType="qs.answerType" :Isdisabled="true"></upload-ipt>
          </div>
        </div>
        <div class="qs-right">
          <p id="edit-btn-box">
            <el-button @click="del(qs,index)" type="warning" plain>删除</el-button>
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
            <el-button @click="addMedia" type="info" plain class="btn_add_text">多媒体</el-button>
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

    <!-- 编辑radio、checkbox、textarea组件 -->
    <v-edit-radio :showModal="showM" :formData="editQs" :formDataJz="editQsJz" @cancel="showmo"
      @EditShowModal="EditShowModals"></v-edit-radio>
    <!-- 编辑矩阵组件 -->
    <v-edit-jz :showModal="showMJz" :formDataJz="editQsJz" @canceljz="showjz" @EditShowModalJz="EditShowModalJzs">
    </v-edit-jz>
    <!--对应添加问题 新增radio模板 -->
    <v-radio :show="showModal" :types="addOptionType" :changeList="changeList" @isChangeList="Changed"
      @shows="showmoalR" @cancel="showModal=false"></v-radio>
    <!--对应添加问题 新增checkbox模板 -->
    <v-checkbox @isChangeList="Changed" @showModalC="showModalCb" :changeList="changeList" :showModal="AddshowModalC" :types="addOptionType"
      @cancel="AddshowModalC=false"></v-checkbox>
    <!--对应添加问题 新增textarea模板 -->
    <v-textarea @isChangeList="Changed" @showModalT="showModalTx" :changeList="changeList" :showModal="AddshowModalT"
      :types="addOptionType" @cancel="AddshowModalT=false"></v-textarea>
    <!--对应添加问题 新增矩阵模板 -->
    <v-jztemp @isChangeList="Changed" @showjz="showmoalJ" :changeList="changeList" :showModal="AddshowModalJz" @cancel="AddshowModalJz=false"
      :types="addOptionType"></v-jztemp>
    <!--对应添加问题 新增多媒体回答模板 -->
    <v-media @isChangeList="Changed" @showModalMedia="showModalMedia" :changeList="changeList" :showModal="addMediaModal"
      @cancel="addMediaModal=false"></v-media>
  </div>
</template>

<script>
  import vRadio from "@/components/v-radio";
  import vJztemp from "@/components/v-jztemp";
  import vTextarea from "@/components/v-textarea";
  import vCheckbox from "@/components/v-checkbox";
  import vMedia from "@/components/v-media";
  import vEditRadio from "@/components/v-editRadio";
  import vEditJz from "@/components/v-editJz";
  import SetDrawer from "@/components/SetDrawer";
  import VideoPlayer from "@/components/Video";
  import UploadIpt from "@/components/UploadIpt";
  import imgPreview from "@/components/imgPreview";
  import { GetQuestionInfo, DeleteQsItems } from "../api/QS-edit";
  import { getList } from "../api/QS-list";

  export default {
    name: "qsEdit",
    components: {
      vRadio,
      vJztemp,
      vTextarea,
      vCheckbox,
      SetDrawer,
      VideoPlayer,
      vEditRadio,
      vEditJz,
      vMedia,
      imgPreview,
      UploadIpt
    },
    data() {
      return {
        uploadTypeImg: ".jpg, .jpeg, .png,.JPG, .JPEG,",
        uploadTypeAudio: ".MP3,.Wav,.Ogg,.mp3,.wav,.ogg",
        uploadTypeVideo: ".avi,.wmv,.mkv,.mp4,.mov,.rm,.3gp,.flv,.mpg,.rmvb",
        options: [
          {
            value: 0,
            label: "文本"
          },
          {
            value: 1,
            label: "图片"
          },
          {
            value: 2,
            label: "音频"
          },
          {
            value: 3,
            label: "视频"
          }
        ],
        uploadType: "",
        editQs: {},
        editQsJz: {},
        showM: false,
        showMJz: false,
        qsItem: [],
        showBtn: false,
        changeList: false,//监听组件网络请求
        addMediaModal: false, //addMedia的增加modal
        AddshowModalJz: false, //矩阵的增加modal
        AddshowModalT: false, //textarea的增加modal
        AddshowModalC: false, //checkbox的增加modal
        addOptionType: "", //增加的类型
        showModal: false,
        datas: [], // 获取列表数据信息
        code: 0 //问卷的qncode
      };
    },
    created() {
      this.code = this.$route.params.code;
    },
    mounted() {
      this.fetchData();
    },
    methods: {
      EditShowModals(e) {
        this.showM = false;
        this.fetchData();
      },
      EditShowModalJzs() {
        this.showMJz = false;
        this.fetchData();
      },
      //取消radio chekbox text编辑遮罩
      showmo(e) {
        this.showM = false;
      },
      showjz() {
        this.showMJz = false;
      },
      showmoalJ() {
        this.AddshowModalJz = false;
        this.fetchData();
      },
      //新增子组件传自定义事件关闭遮罩
      showmoalR() {
        this.showModal = false;
      },
      showModalTx() {
        this.AddshowModalT = false;
      },
      showModalMedia() {
        this.addMediaModal = false;
      },
      showModalCb() {
        this.AddshowModalC = false;
      },
      //监听子组件改变后重新获取GetQuestionInfo网络请求
      Changed(e) {
        if (e == true) {
          console.log(e);
          this.changeList=false
          this.fetchData();
        }
      },
      fetchData() {
        // 获取列表数据信息接口
        if (this.code != 0) {
          GetQuestionInfo({
            qnCode: this.code
          }).then(res => {
            console.log(res);
            if (res.data.code === 200) {
              this.qsItem = res.data.obj || [];
              console.log(this.qsItem);
              this.$forceUpdate();
              return
            } else {
              this.$message.info(res.data.msg);
            }
          });
        }
      },
      //处理类型
      getMsg(item) {
        let msg = "";
        if (item.answerType === 0) {
          msg = "(单选题)";
        } else if (item.answerType === 1) {
          msg = "(多选题)";
        } else if (item.answerType === 3) {
          msg = "(单选矩阵)";
        } else if (item.answerType === 4) {
          msg = "(多选矩阵)";
        } else if (item.answerType === 5) {
          msg = "(图片回答题)";
        }
        else if (item.answerType === 6) {
          msg = "(音频回答题)";
        } else if (item.answerType === 7) {
          msg = "(视频回答题)";
        } else {
          msg = "(文本题)";
        }
        return msg;
      },
      // 删除
      del(qs, index) {
        let _this = this
        this.$confirm("此操作将删除此条信息, 是否继续?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            DeleteQsItems({
              qnCode: _this.code,
              code: qs.code
            }).then(res => {
              if (res.data.code === 200) {
                _this.fetchData();
                this.$forceUpdate();
                _this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.$forceUpdate();
              }
            });
            this.$forceUpdate();
          })
          .catch(() => {
            _this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
        this.$forceUpdate();
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
      editTitle(qsItem, index) {
        let qs = JSON.parse(JSON.stringify(qsItem));
        qs.order = qs.order / 100;
        if (qs.answerType === 0 || qs.answerType === 1 || qs.answerType === 2 || qs.answerType === 5 || qs.answerType === 6 || qs.answerType === 7) {
          this.showM = true;
          this.editQs = qs;
        } else {
          this.showMJz = true;
          this.editQsJz = qs;
        }
        let answerType = qs.answerType;
        console.log(qsItem);
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
      addMedia() {
        if (this.questionLength === 20) return alert("问卷已满！");
        this.addMediaModal = true;
        this.addOptionType = "jz";
      }
    },
    computed: {
      questionLength() {
        return this.datas.length;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../style/QS-edit";
</style>