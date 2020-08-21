<template>
  <div class="edit-container">
    <set-drawer></set-drawer>
   
  </div>
</template>

<script>
import SetDrawer from "@/components/SetDrawer";
import { getQuestionInfo, UpdateQsInfo } from "../api/QS-edit";
import { getList } from "../api/QS-list";

export default {
  name: "Add-Qs",
  components: { SetDrawer },
  data() {
    return {
     
    };
  },
  created() {},
  methods: {
      
  },
}
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
