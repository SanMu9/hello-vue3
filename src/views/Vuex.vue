<template>
    <div>
        <p>name:{{name}}</p>
        <input type="text" v-model="name" ><br><br>
        <p>userName:{{userName}}</p>
        <p>userName2:{{userName2}}</p>

        <button @click="changeName">修改userName</button>
    </div>
</template>

<script>
import {useStore,mapActions} from 'vuex'
import {computed} from 'vue'
// import { createNamespacedHelpers } from 'vuex'
// 使用 createNamespacedHelpers 创建基于某个命名空间辅助函数

export default {
    setup(){
        const store = useStore();
        const userName = store.getters.userName;
        console.log(store.getters.userName)
        console.log(store.state.user.userName)

        const userName2 = computed(()=>store.getters.userName)
        return {
            userName,
            userName2,
            ...mapActions({
                'setUserName':'user/setUserName' //将user模块下的action setUserName映射到setUserName中
            })
        }
    },
    data(){
        return {
            name:"1111",
        }
    },
    methods:{
        changeName(){
            // this.$store.state.user.userName = "QQQ" // 可行，但是是邪教
            // this.setUserName('sen') //可行
            this.$store.dispatch('user/setUserName',"wangs") //可行
           
        }
    }

}
</script>

<style>

</style>