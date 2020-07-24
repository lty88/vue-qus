import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { Button, DatePicker,Message,MessageBox,Form,FormItem,Input} from 'element-ui';
Vue.use(DatePicker);
Vue.component(Button.name, Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.prototype.$message = Message;
Vue.prototype.$MessageBox = MessageBox;
Vue.config.productionTip = false;

// router.beforeEach((to,from,next)=>{
//   document.title=to.meta.title
//   // console.log(to.params.num);
//   let num = to.params.num;
//   let theItem = {};
//    let length = storage.get().length;
//   console.log(num)
//   console.log(length);
//   if(num!=0){
//     if(num<0||num>length){
//       alert('非法路径')
//     }
//   }
//   next(vm=>{
//     console.log(vm);
//   }) 
// })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
