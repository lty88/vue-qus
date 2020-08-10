import request from '../network/request.js';
//获取问卷列表
export const editQuestionInfo = function (data) {
    return request({
        url: '/apiv1/getQuestionInfo',
        params: data
    });
};