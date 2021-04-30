const state = {
    themeColor:{
        bgColor:"#fff",
        fontColor:"#000"
    },
    fontSize:18,
    
}
const mutations = {
    SET_THEME_COLOR:(state,param) => {
        state.themeColor = {
            bgColor:param.bgColor,
            fontColor:param.fontColor
        }
    },
    SET_FONT_SIZE(state,param){
        state.fontSize = param
    }
}
const actions = {
    setThemeColor:({commit},param) => {
        commit("SET_THEME_COLOR",param)
    },
    setFontSize(context,param){
        context.commit("SET_FONT_SIZE",param)
    }
}

export default {
    namespaced:true,
    state,
    mutations,
    actions
}