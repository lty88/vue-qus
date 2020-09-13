import axios from 'axios';
let request = axios.create({
    baseURL: '/api'
});
// // 携带token
request.defaults.timeout = 8000;
request.interceptors.request.use(config => {
    // console.log(config);
    if (config.url != "/apiv1/login"||config.url != "/apiv1/getAvailableQn" || config.url != "/apiv1/saveAnswer" ) {
        if (window.sessionStorage.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.Authorization = window.sessionStorage.getItem('token')
        }
    }
    return config;

})

export default request;
