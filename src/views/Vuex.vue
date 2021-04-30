<template>
    <div class="vuex-container" :style="{'background-color':themeColor.bgColor,'color':themeColor.fontColor}">
      
        <p>userName:{{userName}}</p>

        <button @click="changeName">修改userName</button><br>
        <button @click="changeTheme">修改主题</button><br>
    </div>
</template>

<script>
import {useStore} from 'vuex'
import {mapActions} from 'vuex'
import {computed} from 'vue'

// import { createNamespacedHelpers } from 'vuex'
// 使用 createNamespacedHelpers 创建基于某个命名空间辅助函数
// const {mapActions} = createNamespacedHelpers('user');
export default {
    setup(){
        const store = useStore();
        // console.log(store.getters.userName)
        // console.log(store.state.user.userName)

        const userName = computed(()=>store.getters.userName)

        const themeColor = computed(()=>store.getters.themeColor)
        console.log(themeColor)
        return {
            userName,
            themeColor,
            ...mapActions({
                'setUserName':'user/setUserName', //将user模块下的action setUserName映射到setUserName中
                'setThemeColor':'theme/setThemeColor',
            })
        }
    },
    data(){
        return {
        }
    },
    methods:{
        // ...mapActions(['setUserName']),
        changeName(){
            // this.$store.state.user.userName = "QQQ" // 可行，但是是邪教
            // this.setUserName('sen') //可行
            this.$store.dispatch('user/setUserName',"wangs") //可行
            // this.setUserName("use createNamespacedHelpers")
           
        },
        changeTheme(){
            this.setThemeColor({'bgColor':"#000","fontColor":"#fff"})
        }
    }

}
</script>

<style>

</style>