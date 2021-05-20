<!--
 * @Author: your name
 * @Date: 2021-05-17 10:02:48
 * @LastEditTime: 2021-05-20 15:03:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /hello-vue3/src/views/Mapbox.vue
-->
<template>
  <div class="mapbox-container">
      <router-view/>
      <div class="nav">
          <router-link :to="{name:'mapbox-points'}">海量点</router-link>
          <router-link to="heatmap">热力图</router-link>
          <router-link to="route">车辆轨迹</router-link>
          <router-link to="polygon">地图下钻</router-link>
          <router-link to="cluster">聚合点</router-link>
      </div>
      <!-- <Route></Route> -->
      <!-- <Points></Points> -->
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.nav{
    position: fixed;
    color: #fff;
    text-align: center;
    top: 0;
    right: 0;
}
.nav a{
    color:#fff;
    padding: 0 5px;
}
.nav a:active{
    color: #fff;
}
.mapbox-container{
    width: 100%;
    height: 100%;
    position: relative;
    background: #000;
}
</style>