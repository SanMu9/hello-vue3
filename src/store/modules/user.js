/*
 * @Author: your name
 * @Date: 2021-05-14 09:27:52
 * @LastEditTime: 2021-06-27 10:36:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /hello-vue3/src/store/modules/user.js
 */
const state = {
    userName:"sanmu"
}
const mutations = {
    SET_USER_NAME:(state,name)=> {
        state.userName = name;
    }
}
const actions = {
    setUserName({commit},name){
        commit("SET_USER_NAME",name)
    }
}

export default {
    namespaced:true,
    state,
    mutations,
    actions
}