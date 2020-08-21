import request from '../network/request.js';
//获取问卷列表
export const uploadUser = function (data) {
    return request({
        url: '/apiv1/uploadUser',
        params: data
    });
};


