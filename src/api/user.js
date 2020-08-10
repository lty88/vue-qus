import request from '../network/request.js';
// 登录
export const login = function (data) {
    return request({
        url: '/apiv1/login',
        method: 'post',
        params: data
    });
};