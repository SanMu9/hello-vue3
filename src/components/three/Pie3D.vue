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
})

</script>
<style lang="">
    
</style>