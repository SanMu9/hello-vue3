<!--
 * @Author: your name
 * @Date: 2021-05-08 10:14:14
 * @LastEditTime: 2021-07-05 17:44:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \hello-vue3\src\views\Index.vue
-->
<template>
  <div id="nav">
    <router-link :to="{path:'/'}">Home</router-link> |
    <router-link :to="{name:'About'}">About</router-link> |
    <router-link to="/index/setup">Setup</router-link> |
    <router-link to="/index/teleport">Teleport</router-link> |
    <router-link to="/index/vmodel">v-model</router-link> |
    <router-link to="/index/provide">Provide</router-link> |
    <router-link to="/index/vuex">Vuex</router-link> |
  </div>
  <keep-alive>
    <router-view/>
  </keep-alive>
</template>

<script>
export default {
  data(){
    return {
      
    }
  }
}
</script>

<style>

</style>