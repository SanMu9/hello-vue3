<!--
 * @Author: your name
 * @Date: 2021-01-06 15:13:48
 * @LastEditTime: 2021-05-13 18:04:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \hello-vue3\src\App.vue
-->
<template>
  <!-- <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/setup">Setup</router-link> |
    <router-link to="/teleport">Teleport</router-link> |
    <router-link to="/vmodel">v-model</router-link> |
    <router-link to="/provide">Provide</router-link> |
    <router-link to="/vuex">Vuex</router-link> |
  </div> -->
  <router-view/>
</template>

<style>


  html,body{
    margin: 0;
    height: 100%;
  }
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
