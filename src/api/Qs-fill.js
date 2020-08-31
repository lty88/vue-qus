import request from '../network/request.js';
// 问卷回答保存接口
// 地址：/apiv1/saveAnswer
// 参数：qnCode-问卷编号
// uid-用户uid, 开放性问卷值为
// answer-回答结果，json字符串
export const saveAnswerAxios = function (data) {
    return request({
        url: '/apiv1/saveAnswer',
        params: data,
        method: 'POST',
    });
}
