<template>
  <div class="three-container">
    <router-view></router-view>
    <!-- <my-router-nav></my-router-nav> -->
    <div class="nav">
        <!-- <button @click="jump">!!!!</button> -->
        <router-link :to="{name:'three-models'}">模型载入</router-link>
        <router-link :to="{name:'three-addImages'}">addImage</router-link>
        <router-link :to="{name:'three-lakeScene'}">场景-湖泊</router-link>
    </div>
    </div>
</template>

<script>
import MyRouterNav from '../components/custom/MyRouterNav.vue'

export default {
  components: { MyRouterNav },
  methods:{
    //   jump(){
    //       this.$router.push({name:'three-addImages'})
    //   }
  }

}
</script>

<style lang="scss" scoped>
.three-container{
    width: 100%;
    height: 100%;
    position: relative;
}
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
</style>