import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import './plugins/element.js'
import './common/font.css'
import { userLogin } from "./api/user";
import Element from 'element-ui'



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


router.beforeEach((to, from, next) => {
  let URL = to.fullPath
  //判断是否有username，有则为外链地址 执行下面的请求
  if (URL.indexOf("username") != -1) {
    const url = to.fullPath
    console.log(url);
    // var url = 'http://localhost:8081/fill?qnCode=1598436816773&username=user1&password=123';
    var temp1 = url.split('?');
    var pram = temp1[1];
    var keyValue = pram.split('&');
    var obj = {};
    for (var i = 0; i < keyValue.length; i++) {
      var item = keyValue[i].split('=');
      var key = item[0];
      var value = item[1];
      obj[key] = value;
    }
    console.log(obj);
    userLogin({
      qnCode: obj.qnCode,
      username: obj.username,
      password: obj.password
    }).then(res => {
      console.log(res);
      if (res.data.code == 200) {
        if (res.data.obj.status == 0) {
          Element.Message({
            message: res.data.msg,
            type: 'success'
          })
          const uid = res.data.obj.uid;
          window.sessionStorage.setItem("uid", uid);
          router.push({
            name: "fill",
            params: {
              code: obj.qnCode,
            }
          });
        } else {
          const uid = res.data.obj.uid;
          window.sessionStorage.setItem("uid", uid);
          Element.Message({
            message: "你已经答过此题了，查看结果！",
            type: "info",
            duration: 3000
          });
          router.push({
            name: "viewResults",
            params: {
              code:obj.qnCode
            }
          });
        }
      } else {
        Element.Message({
          message: res.data.msg,
          type: 'error'
        })
      }
    })



  }
  //判断用户是否通过登录携带了uid进入问卷
  // if (to.name == "fill") {

  //   if (window.sessionStorage.getItem('uid')) {
  //     next()
  //   } else {
  //     Element.Message({
  //       message: "该问卷为指定性调查问卷，请先登录",
  //       type: 'error',
  //       duration:3000,
  //     })
  //     next("/AvailableQn")
  //   }
  // }
  // 获取 JWT Token
  if (window.sessionStorage.getItem('token')) {
    debugger
    next();
  } else {
    if (to.name === 'login' || to.name === 'AvailableQn' || to.name === 'fill' || to.name === 'viewResults') {
      next();
    } else {
      next("/login");
    }
  }
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
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
