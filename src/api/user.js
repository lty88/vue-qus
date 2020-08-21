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