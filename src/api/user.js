import request from '../network/request.js';
// 登录
export const login = function (data) {
    return request({
        url: '/apiv1/login',
        method: 'post',
        params: data
    });
};
// 回答
export const getAvailableQn = function (data) {
    return request({
        url: '/apiv1/getAvailableQn',
        method: 'GET',
        params: data
    });
};
// 2.2、问卷参与用户登录接口
// 地址：/apiv1/userLogin
// 参数：qnCode-问卷编号
//           username-用户名
//           password-密码
export const userLogin = function (data) {
    return request({
        url: '/apiv1/getAnswerStatus',
        method: 'GET',
        params: data
    });
};