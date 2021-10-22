<template>
  <div class="three-container">
    <router-view></router-view>
    <div class="nav">
        <!-- <button @click="jump">!!!!</button> -->
        <router-link :to="{name:'three-models'}">模型载入</router-link>
    </div>
    </div>
</template>

<script>

export default {

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