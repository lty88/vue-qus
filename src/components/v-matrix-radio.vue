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
        <tr class="os_bjqk" v-for="subTitlItem in qustion.subTitles" :key="subTitlItem.code">
          <td class="lefttd_qk">{{subTitlItem.title}}{{subTitlItem.code}}</td>

          <td v-for="jzOption in qustion.items" :key="jzOption.code">
            <input
            class="cursor"
              type="radio"
              :value="jzOption.code"
              :name="subTitlItem.code"
              @change="onChange($event,jzOption.code,subTitlItem.code)"
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
      // debugger
      let checked = event.target.checked;
      if (checked) {
          //首先删掉某个key对应的json，然后再加
        for (let i = 0; i < _this.answerList.length; i++) {
            if (_this.answerList[i][subTitleCode]) {
                _this.answerList.splice(i, 1);
                break;
            }
        }
        let obj ={};
        obj[subTitleCode]=optionCode;
        _this.answerList.push(obj);
      }
      _this.$emit("change", _this.answerList);
    }
    // onChange(optionCode, subTitleCode) {
    //   let _this = this;
    //   //首先删掉某个key对应的json，然后再加
    //   // for (let i = 0; i < _this.answerList.length; i++) {
    //   //     if (_this.answerList[i][optionCode]) {
    //   //         _this.answerList.splice(i, 1);
    //   //         break;
    //   //     }
    //   // }
    //   // let answer = {};
    //   // answer[optionCode] = subTitleCode;
    //   // _this.answerList.push(answer);

    //   for (let i = 0; i < _this.answerList.length; i++) {
    //     if (_this.answerList[i]) {
    //       _this.answerList.splice(i, 1);
    //       break;
    //     }
    //   }
    //   _this.answerList.push(optionCode);
    //   _this.$emit("change", _this.answerList);
    // }
  }
};
</script>

<style lang="scss" scoped>
@import "../style/QS-edit";
@import "../style/QS-fill.scss";
.cursor{
  cursor: pointer;
  padding: 15px;
}
.el-form-item__content{
    margin: 0 !important;
}
</style>
