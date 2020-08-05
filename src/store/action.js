/**
 * 用户名Vuex-mutations
 */
export default {
    saveUserName(context,username){
        context.commit('saveUserName',username)
    },
}