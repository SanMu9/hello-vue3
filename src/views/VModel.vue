<template>
    <p>My Name is {{lastName + " " + firstName}}</p>
    <p>My favourite game is {{hobby.game}}</p>
    <p>My age is {{age}}</p>
    <p>My height is {{detail.height}}</p>

    <!-- 不同于组件和 prop，事件名不会被用作一个 JavaScript 变量名或 property 名，
    所以就没有理由使用 camelCase 或 PascalCase 了。
    并且 v-on 事件监听器在 DOM 模板中会被自动转换为全小写 (因为 HTML 是大小写不敏感的)，
    所以 @myEvent 将会变成 @myevent——导致 myEvent 不可能被监听到。
    因此，我们推荐你始终使用 kebab-case 的事件名。 -->
    <v-model-test :detail="detail" v-model:first-name="firstName" v-model:last-name="lastName" v-model:age="age" v-model:game="hobby.game" @custom-submit="submitHandler"></v-model-test>
</template>

<script>
import VModelTest from '@/components/VModelTest.vue'
export default {
    components:{VModelTest},
    data(){
        return {
            firstName:"Sen",
            lastName:"Wang",
            age:1,
            hobby:{
                game:"Total War WarHammmer",
            },
            detail:{
                height:170
            }
        }
    },
    methods:{
        submitHandler(age){
            console.log(age)
            console.log(this.detail)
        }
    }
}
</script>

<style>

</style>