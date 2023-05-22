<template>
    <p>Inject count is {{countTemp.value}}</p>
</template>

<script>
export default {
    inject:['countTemp'],
    created(){
        // 因为使用组合式 API computed
        // computed 函数返回一个作为 computed 的第一个参数传递的 getter 类回调的输出的一个只读的响应式引用。
        // 为了访问新创建的计算变量的 value，我们需要像使用 ref 一样使用 .value property。
        console.log(this.countTemp)
    },
    watch:{
        // 无效
        // countTemp(){
        //     console.log("!!!")
        // }
        countTemp:{
            handler(){
                console.log(this.countTemp)
            },
            immediate: false,
            deep: true
        }
    }

};
</script>

<style>
</style>