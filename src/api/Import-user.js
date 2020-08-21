import request from '../network/request.js';
// 1.11、获取问卷参与人员信息
// 地址：/apiv1/getUser
// 参数：qnCode-问卷编号
// 返回：json字符串
export const getUser = function (data) {
    return request({
        url: '/apiv1/getUser',
        params: data
    });
};
// 1.12、删除问卷参与人员
// 地址：/apiv1/deleteUser
// 参数：qnCode-问卷编号
//  uid-用户编号
export const deleteUser = function (data) {
    return request({
        url: '/apiv1/deleteUser',
        params: data
    });
};

// 1.13、上传问卷参与人员
// 地址：/apiv1/uploadUser
// 参数：qnCode-问卷编号
// 返回：json字符串
export const uploadUser = function (data) {
    return request({
        url: '/apiv1/uploadUser',
        data: data,
        headers: {
            "Content-type": "multipart/form-data"
        },
        method: 'POST',
    });
};
// 1.14、删除全部问卷参与人员
// 地址：/apiv1/deleteAllUser
// 参数：qnCode-问卷编号
// 返回：json字符串
export const deleteAllUser = function (data) {
    return request({
        url: '/apiv1/deleteAllUser',
        params: data
    });
};
