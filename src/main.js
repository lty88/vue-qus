import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import './plugins/element.js'



// 若是没有开启Devtools工具，在开发环境中开启，在生产环境中关闭
if (process.env.NODE_ENV == 'development') {
  Vue.config.devtools = true;
} else {
  Vue.config.devtools = false;
}
Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
// //axios
// axios.defaults.baseURL = '/api';
// axios.defaults.timeout = 8000;

router.beforeEach(({ name }, from, next) => {
  // 获取 JWT Token
  if (window.sessionStorage.getItem('token')) {
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
      next({ name: 'login' });
    }
  }
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
