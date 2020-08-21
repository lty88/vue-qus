import request from '../network/request.js';
//获取问卷列表
export const getList = function (data) {
    return request({
        url: '/apiv1/getQuestionnaire',
        params: data
    });
};
export const delList = function (data) {
    return request({
        url: '/apiv1/deleteQuestionnaire',
        params: data
    });
};

