<template>
    <div class="cesium-wrapper">
        <router-view></router-view>
        <div class="nav">
            <router-link :to="{name:'cesium-tileset'}">倾斜摄影-苏相</router-link>
            <router-link :to="{name:'cesium-hideWidget'}">隐藏控件</router-link>
            <router-link :to="{name:'cesium-pointCloud'}">点云</router-link>
        </div>
    </div>
</template>
<script setup>
const defaultToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4NmE4YmYwMy0wODg4LTQwNzktYmQ1Yy1kZjRmM2Y3ZTY1YjMiLCJpZCI6Mjk5MjksInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1OTI4OTY0NDJ9.ZtxbnNm5otCZUh_vOG8QepzMOQ8_jijXcQvBwP5IjXI";
Cesium.Ion.defaultAccessToken = defaultToken;
</script>
<style lang="scss" scoped>
.cesium-wrapper{
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
<style lang="scss">
.cesium-wrapper{
    .cesium-map {
        width: 100%;
        height: 100%;
        user-select: none;
    }

    #cesium-container {
        width: 100%;
        height: 100%;
        position: relative;
    }
}
</style>