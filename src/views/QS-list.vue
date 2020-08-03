<template>
  <div class="qs-list">
    <ul v-if="qsList.length == 0 ? false : true">
      <li></li>
      <li>标题</li>
      <li>开始时间</li>
      <li>截止时间</li>
      <li>状态</li>
      <li>
        操作
        <span @click="$router.push({ name: 'qsEdit', params: { num: 0 } })">+新建问卷</span>
      </li>
    </ul>
    <div v-for="(item, index) in qsList" :key="index">
      <ul>
        <li>
          <input style="cursor: pointer;" type="checkbox" v-model="item.checked" />
        </li>
        <li>{{ item.title }}</li>
        <li>{{ item.starTime }}</li>
        <li>{{ item.endTime }}</li>
        <li :class="item.state === 'inissue' ? 'inissue' : ''">{{ item.stateTitle}}</li>
        <li>
          <button @click="iterator = edit(item);iterator.next();">编辑</button>
          <button @click="iterator = delItem(item.num);iterator.next();">删除</button>
          <router-link :to="`/fill/${item.num}`" tag="button">查看问卷</router-link>
          <button @click="iterator = watchData(item);iterator.next();">查看数据</button>
        </li>
      </ul>
    </div>
    <div class="list-bottom" v-if="qsList.length == 0 ? false : true">
      <label style="cursor: pointer;">
        <input style="cursor: pointer;" type="checkbox" id="all-check" v-model="selectAll" />
        全选
      </label>
      <button @click="iterator = delItems();iterator.next();">删除</button>
    </div>
    <div class="add-qs" v-if="qsList.length === 0">
      <button
        class="add-btn"
        @click="$router.push({ name: 'qsEdit', params: { num: 0 } })"
      >+&nbsp;&nbsp;新建问卷</button>
    </div>
    <Dialog
      title="提示"
      btnType="3"
      sureText="确定"
      cancelText="取消"
      modalType="middle"
      :showModal="showModal"
      @submit="iterator.next()"
      @cancel="showModal=false"
    >
      <template v-slot:body>
        <p>{{info}}</p>
      </template>
    </Dialog>
  </div>
</template>

<script>
import storage from "../store/index.js";
import Dialog from "@/components/Dialog";
export default {
  name: "qsList",
  components: { Dialog },
  data() {
    return {
      qsList: [],
      showDialog: false,
      showModal: false,
      iterator: {},
      info: ""
    };
  },
  created() {
    document.title = "我的问卷";
  },
  mounted() {
    if (storage.get() !== null) {
      this.qsList = storage.get();
      // this.qsList.forEach(item => {
      //   console.log(item);
      //   let [year, month, day] = item.endTime.split("-");
      //   // 从后台获取时间后判断发布的状态
      //   if (year < new Date().getFullYear()) {
      //     item.state = "issueed";
      //     item.stateTitle = "已发布";
      //   } else if (
      //     year == new Date().getFullYear() &&
      //     month < new Date().getMonth() + 1
      //   ) {
      //     item.state = "issueed";
      //     item.stateTitle = "已发布";
      //   } else if (
      //     year == new Date().getFullYear() &&
      //     month == new Date().getMonth() + 1 &&
      //     day < new Date().getDate()
      //   ) {
      //     item.state = "issueed";
      //     item.stateTitle = "已发布";
      //   }
      // });
    } else {
      storage.save([
        {
          num: 1, //问卷序号 =>第一份问卷
          title: "第一份问卷", //问卷题目
          Sponsor:'成都市第一中学',//发起单位
          OpenTypes:true,//问卷类型  开发性 和指定性
          isActive:false,//问卷属性  静态问卷 动态问卷
          des: "这是一份针对全体教师教学质量的检查", //问卷描述
          starTime: "2030-1-1", //问卷开始时间
          endTime: "2030-1-2", //问卷结束时间
          state: "noissue", //问卷发布状态 noissue未发布 inissue发布中 issueed已发布 test测试
          stateTitle: "未发布",
          checked: false, //是否选中 用于删除
          question: [
            //问卷
            {
              num: "Q1", //第一道题目
              score: 5, //分数
              title: "请辨认出下列动物的名称", //题目
              titleType: "img", //默认为纯文本  题目类型: img：图片题目类型 text vido:视频 mp3：音频
              //链接
              titleUrl:
                "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1596431285883&di=56e98ae5023e06c48e72dffd5daf4f96&imgtype=0&src=http%3A%2F%2Fa2.att.hudong.com%2F86%2F10%2F01300000184180121920108394217.jpg",
              type: "radio", //题目类型 radio checkbox text jz（矩阵）
              isNeed: true, //此题是否为必选
              options: [{ name: "乌龟" }, { name: "癞虾膜" }, { name: "蜻蜓" }] //选项名称 单选 多选有返回options选项数组，文本无，矩阵的选项要做区别名
            },
            {
              num: "Q2",
              title: "看下面視頻回答問題",
              type: "checkbox",
              titleType: "vido",
              titleUrl:
                "https://vdept.bdstatic.com/78396d4e764c44626569794d48476343/57515a47634b6659/8c9244beaac2a568db1bffb234a36dc26adedb2776f3cb4e2ca0b025ce2d57782817553b017416b969a629eacff5a075fdd0d03f2700fb0c94707f84dd0ca66a.mp4?auth_key=1596436591-0-0-6b5446fc80b5555d9f0659f6cf79023b",
              isNeed: true,
              options: [
                { name: "視頻中的主人公叫李磊" },
                { name: "視頻中的主人公叫張三" },
                { name: "視頻中的主人公叫李四" }
              ]
            },
            {
              num: "Q3",
              title: "文本题",
              type: "textarea",
              isNeed: true,
              titleType: "img",
              titleUrl:
                "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1596436448903&di=3fdfebd0f06ba884d6f08883cf897c87&imgtype=0&src=http%3A%2F%2Fpic.paopaoche.net%2Fup%2F2016-8%2F201608101611028121580_1.jpeg"
            }
          ]
        },

        {
          num: 2,
          title: "第二份问卷",
          des: "这是一份针对全体学生的入学考试的调查",
          starTime: "2020-7-31",
          endTime: "2030-8-1",
          state: "noissue",
          stateTitle: "未发布",
          checked: false,
          question: [
            {
              num: "Q1",
              title: "单选题",
              type: "radio",
              isNeed: true,
              options: [
                { name: "选项一" },
                { name: "选项二" },
                { name: "选项三" }
              ]
            },
            {
              num: "Q2",
              title: "多选题",
              type: "checkbox",
              isNeed: true,
              titleType: "img",
              isCheckboxJz: false,
              titleUrl:
                "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1596431285883&di=56e98ae5023e06c48e72dffd5daf4f96&imgtype=0&src=http%3A%2F%2Fa2.att.hudong.com%2F86%2F10%2F01300000184180121920108394217.jpg",
              options: [
                { name: "选项一" },
                { name: "选项二" },
                { name: "选项三" },
                { name: "选项四" }
              ]
            },
            { 
              num: "Q3",
              title: "文本题",
              type: "textarea",
              isNeed: true
            },
            {
              num: "Q4",
              title: "矩阵题目",
              type: "jz",
              isNeed: true,
              titleType: "img",
              titleUrl:
                "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1596431285883&di=56e98ae5023e06c48e72dffd5daf4f96&imgtype=0&src=http%3A%2F%2Fa2.att.hudong.com%2F86%2F10%2F01300000184180121920108394217.jpg",
              jzTitle: [
                { title: "CCTV1" },
                { title: "CCTV2" },
                { title: "CCTV3" }
              ],
              jzOptions: [
                { name: "非常喜欢" },
                { name: "喜欢" },
                { name: "一般" },
                { name: "不喜欢" },
                { name: "非常不喜欢" }
              ]
            },
            {
              num: "Q5",
              title: "你最喜欢的中央频道是？",
              type: "jz",
              isNeed: true,
              jzTitle: [
                { title: "CCTV1" },
                { title: "CCTV2" },
                { title: "CCTV3" },
                { title: "CCTV4" },
                { title: "CCTV5" },
                { title: "CCTV6" }
              ],
              jzOptions: [
                { name: "要的" },
                { name: "阔以" },
                { name: "非常阔以" },
                { name: "不得行" },
                { name: "非常差" },
                { name: "一般般" },
                { name: "阿达萨达" }
              ]
            }
          ]
        },

        {
          num: 3,
          title: "第三份问卷",
          des: "这是一份针对全体学生的入学考试的调查",
          starTime: "2020-8-1",
          endTime: "2030-8-3",
          state: "issueed",
          stateTitle: "已发布",
          checked: false,
          question: [
            {
              num: "Q1",
              title: "单选题",
              type: "radio",
              isNeed: true,
              options: ["选项一", "选项二"]
            },
            {
              num: "Q2",
              title: "多选题",
              type: "checkbox",
              isNeed: true,
              options: ["选项一", "选项二", "选项三", "选项四"]
            },
            {
              num: "Q3",
              title: "文本题",
              type: "textarea",
              isNeed: true
            }
          ]
        }
      ]);
      this.qsList = storage.get();
    }
  },
  methods: {
    showDialogMsg(info) {
      this.showModal = true;
      this.info = info;
    },
    //删除单个问卷
    *delItem(num) {
      yield this.showDialogMsg("确认要删除此问卷");
      yield (() => {
        let index = 0;
        for (let length = this.qsList.length; index < length; index++) {
          if (this.qsList[index].num === num) break;
        }
        this.qsList.splice(index, 1);
        this.showModal = false;
        this.$message.success("刪除成功！");
      })();
    },
    //删除选中的问卷
    *delItems() {
      yield this.showDialogMsg("确认要删除选中的问卷？");
      yield (() => {
        this.showModal = false;
        if (this.selectAll) {
          this.qsList = [];
          return;
        }
        if (this.selectGroup == []) return;

        this.selectGroup.forEach(item => {
          if (this.qsList.indexOf(item) > -1)
            this.qsList.splice(this.qsList.indexOf(item), 1);
        });
      })();
    },
    //编辑问卷
    *edit(item) {
      yield (() => {
        if (item.state === "noissue") {
          this.showDialogMsg("确认要编辑？");
        } else {
          this.showDialogMsg("只有未发布的问卷才能编辑");
        }
      })();
      yield (() => {
        if (item.state !== "noissue") {
          this.showModal = false;
        } else {
          this.showModal = false;
          this.$router.push({
            name: "qsEdit",
            params: {
              num: item.num
            }
          });
        }
      })();
    },
    // 查看问卷
    *watchData(item) {
      yield (() => {
        if (item.state === "noissue") {
          this.showDialogMsg("未发布的问卷无数据可查看");
        } else {
          this.$router.push({
            name: "qsData",
            params: {
              num: item.num
            }
          });
        }
      })();
      yield (this.showModal = false);
    }
  },
  computed: {
    selectAll: {
      get() {
        return (
          this.selectCount === this.qsList.length && this.selectCount !== 0
        );
      },
      set(value) {
        this.qsList.forEach(item => {
          item.checked = value;
        });
        return value;
      }
    },
    selectCount() {
      let i = 0;
      this.qsList.forEach(item => {
        if (item.checked) i++;
      });
      return i;
    },
    selectGroup() {
      let group = [];
      this.qsList.forEach(item => {
        if (item.checked) group.push(item);
      });
      return group;
    }
  },
  watch: {
    qsList: {
      handler(val) {
        val.forEach((item, index) => {
          item.num = index + 1;
        });
        storage.save(val);
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../style/QS-list";
</style>
