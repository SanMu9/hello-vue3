<template>
    <div class="cesium-map">
        <div id="cesium-container"></div>
    </div>
</template>
<script setup>
import { onMounted } from 'vue';
let tileset = null
let viewer = null
onMounted(()=>{
    initMap()
})
function initMap(){
    const viewerOptions = {
        fullscreenButton: false,
        homeButton: false,
        animation: false,
        baseLayerPicker: false,
        geocoder: false,
        // homeButton: false,
        // skyBox: new Cesium.skyBox(),
        skyAtmosphere: false,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: true,
        timeline: false,
        navigationHelpButton: false,
        selectionIndicator: false,
    }
    viewer = new Cesium.Viewer("cesium-container", {
        ...viewerOptions,
    });
    viewer.cesiumWidget.creditContainer.style.display = "none";//去除logo和版权信息
    viewer.imageryLayers.removeAll();
    viewer.scene.sun.show = true
    viewer.scene.globe.enableLighting = true; //关闭光照
    viewer.shadows = false;//关闭阴影
    // viewer.scene.globe.show = false
    // viewer.scene.globe.baseColor = new Cesium.Color(0, 0, 0, 0);
    // viewer.scene.backgroundcolor = new Cesium.Color(0, 0, 0, 0);
    viewer.scene.globe.baseColor = new Cesium.Color(28 / 255, 50 / 255, 77 / 255, 1);
    viewer.scene.backgroundcolor = new Cesium.Color(28 / 255, 50 / 255, 77 / 255, 1);

    const bloom = viewer.scene.postProcessStages.bloom
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(120.6227517591869, 31.463969185956977, 70.39510737684795),
        orientation: {
            heading: 4.413773339026679,
            pitch: -0.08361230869049896,
            roll: 0.000010168937138566037
        },
        complete:function(){

        }
    })

    addMain3dtiles(viewer)
}

function addMain3dtiles(viewer) {
    const URL = "/tileset/suxiang/main/tileset.json"
    // const URL = "/screen/tileset/suxiang/sx_ds/tileset.json"
    // Cesium.ExperimentalFeatures.enableModelExperimental = true;

    tileset = new Cesium.Cesium3DTileset({
        url: URL,
        maximumScreenSpaceError: 1,
        show: true,
        // shadows:Cesium.ShadowMode.DISABLED,
        // lightColor:new Cesium.Cartesian3 (0,0,0)

    })
    // this.tileset = tileset

    tileset.readyPromise.then(function (ts) {
        viewer.scene.primitives.add(ts) //添加tileset
        var params = {
            tx: 120.619283,  //模型中心X轴坐标（经度，单位：十进制度）
            ty: 31.462566,    //模型中心Y轴坐标（纬度，单位：十进制度）
            tz: 0,    //模型中心Z轴坐标（高度，单位：米）
            rx: 0,    //X轴（经度）方向旋转角度（单位：度）圆心应该是在地心，改动其中一个值的时候，不止变化了该变量，比如改动ry，模型的高度也有了显著上升
            ry: 0,    //Y轴（纬度）方向旋转角度（单位：度）
            rz: 258.1     //Z轴（高程）方向旋转角度（单位：度）
        };
        update3dtilesMaxtrix(ts, params) // 更新tileset位置
        // viewer.zoomTo(ts, new Cesium.HeadingPitchRange(0.0, -0.3, 0.0));//视角移动
    })
    // 初始化颜色
    tileset.allTilesLoaded.addEventListener(function (tile) {
        tileset.style = new Cesium.Cesium3DTileStyle({
            // show: "${name} !== 'Mesh2989'",
            color: {
               
                conditions: [
                    // ["true", "rgba(108, 162, 249,0.0)"],
                    // ["true", "rgba(93,201,246,0.3)"],
                    // ["true", "rgba(108, 162, 249,0.3)"],
                    ["${building} ==='north'","rgba(135, 206, 250, 0.3)"],
                    ["${building} ==='south'","rgba(127, 255, 212	,0.3)"],
                    ["true","rgba(255, 255, 255, 0.3)"]
                ],
            },
        });
    })

}
function update3dtilesMaxtrix(tileset, params) {
    params = params || {
        tx: 120.616859,  //模型中心X轴坐标（经度，单位：十进制度）
        ty: 31.461681,    //模型中心Y轴坐标（纬度，单位：十进制度）
        tz: -0.1,    //模型中心Z轴坐标（高度，单位：米）
        rx: 0,    //X轴（经度）方向旋转角度（单位：度）圆心应该是在地心，改动其中一个值的时候，不止变化了该变量，比如改动ry，模型的高度也有了显著上升
        ry: 0,    //Y轴（纬度）方向旋转角度（单位：度）
        rz: 258.5     //Z轴（高程）方向旋转角度（单位：度）
    };
    //旋转
    var mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(params.rx));
    var my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(params.ry));
    var mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(params.rz));
    var rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
    var rotationY = Cesium.Matrix4.fromRotationTranslation(my);
    var rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);
    //平移
    var position = Cesium.Cartesian3.fromDegrees(params.tx, params.ty, params.tz);

    var m = Cesium.Transforms.eastNorthUpToFixedFrame(position);
    //旋转、平移矩阵相乘
    Cesium.Matrix4.multiply(m, rotationX, m);
    Cesium.Matrix4.multiply(m, rotationY, m);
    Cesium.Matrix4.multiply(m, rotationZ, m);
    //赋值给tileset
    tileset._root.transform = m;
}
</script>
<style lang="">

</style>