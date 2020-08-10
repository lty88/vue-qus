import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'

import { Button, DatePicker, Message, MessageBox, Form, FormItem, Input, Drawer, Select, option, Loading, table, Radio, Image, Upload, Progress, Switch,Popover, TableColumn } from 'element-ui';
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
Vue.use(TableColumn);
Vue.prototype.$message = Message;
Vue.prototype.$MessageBox = MessageBox;
Vue.config.productionTip = false;


Vue.use(VueAxios, axios);
//axios
// axios.defaults.baseURL = '/api';
// axios.defaults.timeout = 5000;
// 判断是否有token 
router.beforeEach(({name}, from, next) => {
  // 获取 JWT Token
  if (localStorage.getItem('token')) {
    // 如果用户在login页面
    if (name === 'login') {
      next('/');
    } else {
      next();
    }
  } else {
    if (name === 'login') {
      next();
    } else {
      next({name: 'login'});
    }
  }
});
// 携带token
// axios.interceptors.request.use(config => {
//     console.log(config);
//     if (config.url != "/apiv1/login") {
//         if (localStorage.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
//             config.headers.Authorization = `token ${localStorage.token}`;
//         }
//         return config;
//     }
//     err => {
//         console.log(err);
//         // return Promise.reject(err);
//     }
// })
  
import VideoPlayer from 'vue-video-player'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.use(VideoPlayer)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
