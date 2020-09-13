<template>
<transition name="slide">
    <div class="wjdc_list">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" class="tswjdc_table" >
            <!-- <tr>
                <td class="lefttd_qk">&nbsp;</td>
                <td class="lefttd_tit" v-for="(jzOption,jzIndex) in qustion.subTitles" :key="jzIndex">{{jzOption.title}}</td>

        </tr>-->
            <!-- 渲染的矩阵的radio-->
            <!-- <tr class="os_bjqk" v-for="option in qustion.items" :key="option.code">
                <td class="lefttd_qk">{{option.content}}</td>
                {{option.code}}
                <td v-for="subTitle in qustion.subTitles" :key="subTitle.code">
                    <input type="checkbox" :value="subTitle.code" :name="option.code" @change="onChange($event,option.code,subTitle.code)" />
                    {{subTitle.code}}
                </td>
        </tr>-->
            <tr>
                <td class="lefttd_qk">&nbsp;</td>
                <td class="lefttd_tit" v-for="(jzOption,jzIndex) in qustion.items" :key="jzIndex">{{jzOption.content}}</td>
            </tr>
            <!-- 渲染的矩阵的radio-->
            <tr class="os_bjqk" v-for="subTitles in qustion.subTitles" :key="subTitles.code">
                <td class="lefttd_qk">{{subTitles.title}}</td>
                <td v-for="jzOption in qustion.items" :key="jzOption.code">
                    <input type="checkbox" required :value="jzOption.code" :name="subTitles.code" @change="onChange($event,jzOption.code,subTitles.code)" />
                    <!-- {{jzOption.code}} -->
                </td>
            </tr>
        </table>
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
                // let answer = {};
                // answer[optionCode] = subTitleCode;
                // _this.answerList.push(answer);
                _this.answerList.push(optionCode);
            } else {
                //未选中，则删除
                // for (let i = 0; i < _this.answerList.length; i++) {
                //     if (_this.answerList[i][optionCode] == subTitleCode) {
                //         _this.answerList.splice(i, 1);
                //         break;
                //     }
                // }
                for (let i = 0; i < _this.answerList.length; i++) {
                    if (_this.answerList[i] == optionCode) {
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
</style>
