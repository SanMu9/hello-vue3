<!--
 * @Author: your name
 * @Date: 2021-05-17 10:02:48
 * @LastEditTime: 2021-05-17 10:52:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /hello-vue3/src/views/Mapbox.vue
-->
<template>
  <div class="mapbox-container">
      <Points></Points>
  </div>
</template>

<script>
import Points from '@/components/mapbox/Points.vue'
export default {
    components:{
        Points,
    }
}
</script>

<style scoped>
.mapbox-container{
    width: 100%;
    height: 100%;
    position: relative;
}
</style>