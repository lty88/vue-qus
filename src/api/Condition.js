import request from '../network/request.js';
// 1.8、获取问卷控制流程
export const getCondition = function (data) {
    return request({
        url: '/apiv1/getCondition',
        method: 'get',
        params: data
    });
};
// 1.9、添加问卷控制流程
export const addCondition = function (data) {
    return request({
        url: '/apiv1/addCondition',
        method: 'post',
        params: data
    });
};
// 1.10、删除问卷控制流程
// 地址：/apiv1/deleteCondition
// 参数：id-流程id
// 返回：json字符串
export const deleteCondition = function (data) {
    return request({
        url: '/apiv1/deleteCondition',
        method: 'post',
        params: data
    });
};