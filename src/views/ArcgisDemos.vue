<!--
 * @Author: your name
 * @Date: 2021-05-25 10:18:09
 * @LastEditTime: 2021-06-08 16:39:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /hello-vue3/src/views/ArcgisDemos.vue
-->
<template>
  <div class="arcgis-container">
      <router-view>
      </router-view>
      <div class="nav">
          <router-link to="polygon3d">Polygon3D</router-link>
          <router-link to="cluster">聚合点</router-link>
          <router-link to="viewChange">视图切换</router-link>
          <router-link to="points">点</router-link>
          <router-link to="geojson">交互</router-link>
          <router-link to="polygonAnimation">polygon动画</router-link>

      </div>
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
.arcgis-container{
    width: 100%;
    height: 100%;
    position: relative;
    background: #000;
}
</style>