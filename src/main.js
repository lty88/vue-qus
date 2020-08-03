import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { Button, DatePicker, Message, MessageBox, Form, FormItem, Input, Drawer, Select, option, Loading, table, Radio, Image, Upload, Progress, Switch,Popover } from 'element-ui';
Vue.use(DatePicker);
Vue.use(Drawer);
Vue.use(Select);
Vue.use(table);
Vue.use(Radio)
Vue.use(Loading);
Vue.use(option);
Vue.component(Button.name, Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Image);
Vue.use(Upload);
Vue.use(Progress);
Vue.use(Popover);
Vue.use(Switch);
Vue.prototype.$message = Message;
Vue.prototype.$MessageBox = MessageBox;
Vue.config.productionTip = false;
//引入懒加载
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad, {
  error: require('../src/assets/img/u=2305334543,4052052284&fm=26&gp=0.jpg'),
  loading: require('../src/assets/img/loading-spinning-bubbles.svg')
});
import VideoPlayer from 'vue-video-player'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.use(VideoPlayer)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
