<template>
    <div class="cesium-map">
        <div id="cesium-container"></div>
    </div>
</template>
<script setup>
import { onMounted } from 'vue';
// Geocoder : 查找位置工具，查找到之后会将镜头对准找到的地址，默认使用bing地图
// Home Button :视角返回初始位置.
// Scene Mode Picker : 选择视角的模式，有三种：3D，2D，哥伦布视图(CV)
// Base Layer Picker : 图层选择器，选择要显示的地图服务和地形服务.
// Navigation Help Button :导航帮助按钮，显示默认的地图控制帮助.
// Animation : 动画器件，控制视图动画的播放速度.
// Timeline :时间线,指示当前时间，并允许用户跳到特定的时间.
// Credits Display :版权显示，显示数据归属，必选
// Fullscreen Button :全屏按钮.

onMounted(() => {
    const viewer = new Cesium.Viewer('cesium-container', {
        // 以3D模式启动
        sceneMode: Cesium.SceneMode.SCENE3D,
        // 使用Cesium世界地形
        terrainProvider: Cesium.createWorldTerrain(),
        // 隐藏基础图层选择器
        baseLayerPicker: false,
        // 隐藏时间轴组件
        timeline: false,
        // 隐藏动画组件
        animation: false,
        // 隐藏场景模式选择组件
        sceneModePicker: false,
        // 隐藏全屏按钮
        fullscreenButton: false,
        // 隐藏VR按钮
        vrButton: false,
        // 隐藏地名查找组件
        geocoder: false,
        // 隐藏投影切换组件
        projectionPicker: false,
        // 隐藏导航帮助按钮
        navigationHelpButton: false,
        // 隐藏主页按钮 
        homeButton: false,

        // 显示天空大气并启用阴影
        skyAtmosphere: new Cesium.SkyAtmosphere(),
        shadows: true,
        // skyBox : new Cesium.SkyBox({
        //     sources : {
        //     positiveX : 'stars/TychoSkymapII.t3_08192x04096_80_px.jpg',
        //     negativeX : 'stars/TychoSkymapII.t3_08192x04096_80_mx.jpg',
        //     positiveY : 'stars/TychoSkymapII.t3_08192x04096_80_py.jpg',
        //     negativeY : 'stars/TychoSkymapII.t3_08192x04096_80_my.jpg',
        //     positiveZ : 'stars/TychoSkymapII.t3_08192x04096_80_pz.jpg',
        //     negativeZ : 'stars/TychoSkymapII.t3_08192x04096_80_mz.jpg'
        //     }
        // })
    });
viewer.cesiumWidget.creditContainer.style.display = "none";//去除logo和版权信息
})


</script>
<style lang="">

</style>