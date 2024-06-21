<template>
    <div>
        <input v-model="inputVal0" type="number"/>
        <input v-model="inputVal1.count" type="number"/>
        <input v-model="inputVal1.sum" type="number"/>
        <br/>
        <div>
            <span>watch:</span>
            <span>{{watchVal}}</span>
        </div>
        <div>
            <span>watchEffect:</span>
            <span>{{watchVal2}}</span>
        </div>
    </div>
</template>
<script setup>
import { ref,watch,watchEffect,reactive } from 'vue'
const inputVal0 = ref(0)
const inputVal1 = reactive({count:1,sum:10})
const watchVal = ref(0)
const watchVal2 = ref(0)
// 对于这种只有一个依赖项的例子来说，watchEffect() 的好处相对较小。
// 但是对于有多个依赖项的侦听器来说，使用 watchEffect() 可以消除手动维护依赖列表的负担。
// 此外，如果你需要侦听一个嵌套数据结构中的几个属性，watchEffect() 可能会比深度侦听器更有效，
// 因为它将只跟踪回调中被使用到的属性，而不是递归地跟踪所有的属性。
watch([inputVal0,inputVal1],([newVal0,newVal1]) => {
    console.log(newVal0,newVal1)
    watchVal.value = newVal1.count + newVal0
},{
    immediate:true
})
watchEffect(()=>{
    watchVal2.value = inputVal1.sum + watchVal.value
})
</script>
<style lang="">
    
</style>