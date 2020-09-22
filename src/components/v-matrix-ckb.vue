<template>
  <transition name="slide">
    <div class="wjdc_list">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" class="tswjdc_table">
        <tr>
          <td class="lefttd_qk">&nbsp;</td>
          <td
            class="lefttd_tit"
            v-for="(jzOption,jzIndex) in qustion.items"
            :key="jzIndex"
          >{{jzOption.content}}</td>
        </tr>
        <!-- 渲染的矩阵的radio-->
        <tr class="os_bjqk" v-for="subTitles in qustion.subTitles" :key="subTitles.code">
          <td class="lefttd_qk">{{subTitles.title}}{{subTitles.code}}</td>
          <td v-for="jzOption in qustion.items" :key="jzOption.code">
            <input
              type="checkbox"
              class="cursor"
              required
              :value="jzOption.code"
              :name="subTitles.code"
              @change="onChange($event,jzOption.code,subTitles.code)"
            />
            {{jzOption.code}}
          </td>
        </tr>
      </table>
      <!-- <h2>{{answerList}}</h2> -->
    </div>
  </transition>
</template>

<script>
export default {
  model: {
    prop: "answerList",
    event: "change"
  },
  props: {
    qustion: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  mounted() {},
  data() {
    return {
      answerList: []
    };
  },
  methods: {
    onChange(event, optionCode, subTitleCode) {
      let _this = this;
      let checked = event.target.checked;
      if (checked) {
        //选中 则添加
        let answer = {};
        answer[subTitleCode] = optionCode;
        _this.answerList.push(answer);
      } else {
        //未选中，则删除
        for (let i = 0; i < _this.answerList.length; i++) {
            if (_this.answerList[i][subTitleCode] == optionCode) {
                _this.answerList.splice(i, 1);
                break;
            }
        }
      }
      _this.$emit("change", _this.answerList);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../style/QS-edit";
@import "../style/QS-fill.scss";
.cursor {
  cursor: pointer;
  padding: 15px;
}
.el-form-item__content{
    margin: 0 !important;
}
</style>
