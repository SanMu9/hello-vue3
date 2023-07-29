<template>
  <div class="three-container">
    <router-view></router-view>
    <!-- <my-router-nav></my-router-nav> -->
    <div class="nav">
        <!-- <button @click="jump">!!!!</button> -->
        <router-link :to="{name:'three-models'}">模型载入</router-link>
        <router-link :to="{name:'three-addImages'}">addImage</router-link>
        <router-link :to="{name:'three-lakeScene'}">场景-湖泊</router-link>
        <router-link :to="{name:'three-sky'}">天空盒</router-link>
        <router-link :to="{name:'three-modelAnimate'}">模型动画</router-link>
        <router-link :to="{name:'three-shaderMaterial'}">ShaderMaterial</router-link>
        <router-link :to="{name:'three-city'}">现代服务大厦</router-link>
        <router-link :to="{name:'three-buildingFloor'}">楼栋分层</router-link>
        <router-link :to="{name:'three-multipleScenes'}">多场景</router-link>
        <!-- <router-link :to="{name:'three-deviceDot'}">设备打点</router-link> -->
        <router-link :to="{name:'three-buildingScene'}">大楼场景</router-link>
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
  },
  created(){
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
    // color: #fff;
    color:rgb(36, 247, 247);
    text-align: center;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: auto;
    text-align: left;
    z-index:999;
}
.nav a{
    // color:#fff;
    padding: 0 5px;
    color:rgb(36, 247, 247)
}
.nav a:active{
    color: #fff;
}
</style>