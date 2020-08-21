import request from '../network/request.js';
//获取问卷列表
export const GetQuestionInfo = function (data) {
    return request({
        url: '/apiv1/getQuestionInfo',
        params: data
    });
};

//1.3、问卷保存接口
export const UpdateQsSetting = function (data) {
    return request({
        url: '/apiv1/insertOrUpdateQuestionnaire',
        params: data,
        method: 'POST',
    });
};
// 1.6、题目保存接口
export const UpdateQsInfo = function (data) {
    return request({
        url: '/apiv1/insertOrUpdateQuestion',
        params: data,
        method: 'POST',
    });
};
// 1.7、题目删除接口
// 地址：/apiv1/deleteQuestion
// 参数：qnCode - 问卷编号
// code - 题目编号
// 返回：json字符串
export const DeleteQsItems = function (data) {
    return request({
        url: '/apiv1/deleteQuestion',
        params: data
    });
};