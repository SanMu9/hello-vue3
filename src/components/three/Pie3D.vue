<template>
    <div id="container" style="width: 100%;height: 100%;">
    </div>
</template>
<script setup>
import { onMounted, onBeforeUnmount } from 'vue';

import ThreePie3d from './lib/ThreePie3d'
let container
let chart

// 先绘制THREE场景
onMounted(()=>{
    container = document.getElementById('container')
    chart = new ThreePie3d(container)
    let option = {
        colors:['#FFCA27','#00BFFF','#DC143C','#42b983'],
        maxHeight:100,
        innerRadius:50,
        outerRadius:100,
        startAngle:0,
        data:[
            {name:"A",value:45},
            {name:"B",value:90},
            {name:"C",value:20},
            {name:"D",value:80},
        ]
    }
    chart.setOption(option)
})

</script>
<style lang="">
    
</style>