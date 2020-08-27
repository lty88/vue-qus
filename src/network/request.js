import axios from 'axios';
let request = axios.create({
    baseURL: '/api'
});
// // 携带token
request.defaults.timeout = 5000;
request.interceptors.request.use(config => {
    // console.log(config);
    if (config.url != "/apiv1/login") {
        if (window.sessionStorage.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.Authorization = window.sessionStorage.getItem('token')
        }
    }
    return config;

})

export default request;
