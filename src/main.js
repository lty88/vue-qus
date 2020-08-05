import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from './store'
import seesion from '../src/store/seesion.js'
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
axios.defaults.baseURL = '/api';
axios.defaults.timeout = 9090;
//处理axios fordata
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.transformRequest = [function (data) {
    let src = ''
    for (let item in data) {
      src += encodeURIComponent(item) + '=' + encodeURIComponent(data[item]) + '&'
    }
    return src
}]


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
axios.interceptors.request.use(
  config => {
    if (localStorage.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.Authorization = `token ${localStorage.token}`;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  });
  
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
