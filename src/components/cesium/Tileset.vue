<template>
    <div class="cesium-map">
        <div id="cesium-container"></div>
    </div>
</template>
<script setup>
import { onMounted } from 'vue';
import { limitCameraViewRange } from '@/utils/cesiumUtils.js'
onMounted(() => {
    initMap()
})
const cameraInfo = {
    'overview': {
        destination: Cesium.Cartesian3.fromDegrees(120.6227517591869, 31.463969185956977, 70.39510737684795),
        orientation: {
            heading: 4.413773339026679,
            pitch: -0.08361230869049896,
            roll: 0.000010168937138566037
        },
    },
    'south': {
        destination: Cesium.Cartesian3.fromDegrees(120.62103712814769, 31.460642707780814, 136.2464560896611),
        orientation: {
            heading: 5.540449108595162,
            pitch: -0.41841704356139253,
            roll: 6.283183582026616
        },
    },
    'north': {
        destination: Cesium.Cartesian3.fromDegrees(120.62221309786844, 31.46437034395226, 166.30032587571256),
        orientation: {
            heading: 4.377801111877567,
            pitch: -0.3808943547169388,
            roll: 6.28318173419187
        },
    },
    'middle': {
        destination: Cesium.Cartesian3.fromDegrees(120.6211499712196, 31.46251013095233, 97.12362136703754),
        orientation: {
            heading: 4.907285961079881,
            pitch: -0.4359787005956668,
            roll: 0.000004856322378898881
        },
    }
}
let planeTileset = null
let tileset = null
let viewer = null
let buildingFlowlineEntities = []
let roadFlowlineEntities = []
function initMap() {
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
    // 自定义mapbox图层
    let imageryProvider = new Cesium.MapboxStyleImageryProvider({
        url: "https://api.mapbox.com/styles/v1",
        // username:'wangchao1018',
        styleId: "dark-v10",
        // styleId:'ckimzu44x1kbh17qpxul078as',
        accessToken:
            "pk.eyJ1Ijoic2FubXU5IiwiYSI6ImNrbzE3MnZkajBtb24yeG9ibmxjMHE1ZDYifQ.9mVkYRsx-tj0MZeMowE3MA",
    });
    viewer = new Cesium.Viewer("cesium-container", {
        ...viewerOptions,
        // terrainProvider: Cesium.createWorldTerrain(),// 地形
        // imageryProvider: imageryProvider,
    });
    const scene = viewer.scene
    var utc = Cesium.JulianDate.fromDate(new Date("2022/04/17 01:00:00"));//UTC
    viewer.clockViewModel.currentTime = Cesium.JulianDate.addHours(utc, 8, new Cesium.JulianDate());//北京时间
    viewer.scene.globe.depthTestAgainstTerrain = false //地形检测
    // viewer.scene.skyBox.show = false
    // 自定义天空盒
    viewer.scene.skyBox = new Cesium.SkyBox({
        sources: {
            // positiveX: require('@/assets/images/skybox/00h+00.jpg'),
            // negativeX: require('@/assets/images/skybox/12h+00.jpg'),
            // positiveY: require('@/assets/images/skybox/06h+00.jpg'),
            // negativeY: require('@/assets/images/skybox/18h+00.jpg'),
            // positiveZ: require('@/assets/images/skybox/06h+90.jpg'),
            // negativeZ: require('@/assets/images/skybox/06h-90.jpg')
            // positiveX: require('../../asserts/images/skybox/Version2_dark_px.jpg'),
            // negativeX: require('../../asserts/images/skybox/Version2_dark_mx.jpg'),
            // positiveY: require('../../asserts/images/skybox/Version2_dark_py.jpg'),
            // negativeY: require('../../asserts/images/skybox/Version2_dark_my.jpg'),
            // positiveZ: require('../../asserts/images/skybox/Version2_dark_pz.jpg'),
            // negativeZ: require('../../asserts/images/skybox/Version2_dark_mz.jpg')
            positiveX: require('../../assets/images/skybox/1.jpg'),
            negativeX: require('../../assets/images/skybox/1.jpg'),
            positiveY: require('../../assets/images/skybox/1.jpg'),
            negativeY: require('../../assets/images/skybox/1.jpg'),
            positiveZ: require('../../assets/images/skybox/1.jpg'),
            negativeZ: require('../../assets/images/skybox/1.jpg')
        }
    })
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
    // this.enableMapBloom(viewer)

    // this.addBloomGUI(viewer)

    // bloom.enable = true // 启用bloom
    // bloom.uniforms.glowOnly = true; // 发光
    // bloom.uniforms.contrast = 128.0; // 对比度 [-255.0, 255.0] 
    // bloom.uniforms.brightness = 1 // 光泽亮度 -1.0~1.0
    // bloom.uniforms.delta = 1; // 因子 1~5
    // bloom.uniforms.sigma = 1; // [1,10]
    // bloom.uniforms.stepSize = 1; // [0.s1,10]

    viewer.camera.flyTo({
        ...cameraInfo['overview'],
        complete: function () {
            main3dtilesColorAnimate(0)
        }
    })
    limitCameraViewRange(viewer)
    addAll3dtiles(viewer)
    addRoadFlowlines(viewer)
}
function addAll3dtiles(viewer) {
    addMain3dtiles(viewer)
    addPlane3dtiles(viewer)
    addRoad3dtiles(viewer)
    addOther3dtiles(viewer)
    addBottom3dtiles(viewer)
}
// 加载主建筑
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
    addMain3dtilesCustomShadar(tileset)
    // 初始化颜色
    tileset.allTilesLoaded.addEventListener(function (tile) {
        tileset.style = new Cesium.Cesium3DTileStyle({
            // show: "${name} !== 'Mesh2989'",
            color: {
                // evaluateColor: (feature) => {
                //   // 这边似乎是异步的
                //   //这里收集所有feature
                //   // if(!featureNames.includes(feature.getProperty('name'))){
                //   //   _this.features.push(feature)
                //   //   featureNames.push(feature.getProperty('name'))
                //   //   // if(mesh_shadow_list.includes(feature.getProperty('name'))){
                //   //   //   _this.addCustomShadarToFeature(feature)
                //   //   // }
                //   //   // feature.show = false
                //   // }
                //   _this.features.push(feature)
                //   // if(mesh_shadow_list.includes(feature.getProperty('name'))){
                //     // _this.addCustomShadarToFeature(feature)
                //   //   console.log(feature)
                //   // }
                //   // console.log(feature.color)
                //   // return feature.color.withAlpha(1);
                //   return Cesium.Color(0.24,  0.31, 0.44, 1.0)

                // },
                conditions: [
                    // ["true", "rgba(108, 162, 249,0.0)"],
                    // ["true", "rgba(93,201,246,0.3)"],
                    // ["true", "rgba(108, 162, 249,0.3)"],
                    ["true", "rgba(255, 255, 255,0)"],
                ],
            },
        });
    })

}
function addMain3dtilesCustomShadar(tileset) {
    const _this = this
    tileset.tileVisible.addEventListener(function (tile) {
        // console.log(tile)
        // updateTile(tile);

        let shadar = `
        varying vec3 v_positionEC;
        void main(void){
        vec4 position = czm_inverseModelView * vec4(v_positionEC,1); // 位置
        float glowRange = 100.0; // 光环的移动范围(高度)
        // gl_FragColor = vec4(1.0,  1.0, 1.0, 1.0); // 颜色
        gl_FragColor = vec4(0.4235,  0.6353, 0.9765, 1.0); // 颜色
         //gl_FragColor *= vec4(vec3((position.z + 10.0) / 30.0), 0.8); // 渐变
         //gl_FragColor *= vec4(vec3((position.z + 30.0) / 60.0), 0.8); // 渐变
        // 动态光环
        float time = fract(czm_frameNumber / 180.0);
        time = abs(time - 0.5) * 2.0;
        float diff = step(0.005, abs( clamp(position.z / glowRange, 0.0, 1.0) - time));
         gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - diff);
        }
      `;
        addCustomShadarToTiles(tile, shadar)
    });
}
// 加载地面
function addPlane3dtiles(viewer) {
    // const URL = "/tileset/sx/tileset.json"
    const URL = "/tileset/suxiang/plane/tileset.json"
    // this.get3DtilesScenetree(URL)

    const that = this
    const tileset = new Cesium.Cesium3DTileset({
        url: URL,
        maximumScreenSpaceError: 32,
        show: true,
        // shadows:Cesium.ShadowMode.DISABLED,
        // lightColor:new Cesium.Cartesian3 (0,0,0)
    })

    tileset.readyPromise.then(function (ts) {
        viewer.scene.primitives.add(ts) //添加tileset
        update3dtilesMaxtrix(ts) // 更新tileset位置
    })


    tileset.allTilesLoaded.addEventListener(function () {
        // const mesh_shadow_list = ['Mesh15']
        // const featureNames = []
        planeTileset = tileset
        tileset.style = new Cesium.Cesium3DTileStyle({
            // show: "${name} !== 'polySurface837'",
            color: {
                conditions: [
                    // ["true", "rgba(28, 50, 77,1)"],
                    ["true", "rgba(255, 255, 255,1)"],
                ],
            },
        });
        // setTimeout(()=>{
        //   console.log(toRaw(_this.features))
        //   _this.features.forEach(feature => feature.show = false)
        // },3000)
    })

    tileset.tileVisible.addEventListener(function (tile) {
        let shadar = `
    varying vec3 v_positionEC;
    void main(void){
    vec4 position = czm_inverseModelView * vec4(v_positionEC,1); // 位置
    float glowRange = 100.0; // 光环的移动范围(高度)
    // gl_FragColor = vec4(0.31,  0.74, 0.91, 1.0); // 颜色
    gl_FragColor = vec4(0.11,  0.196, 0.302, 1.0); // 颜色
    }
    `;
        addCustomShadarToTiles(tile, shadar)
    })


}
// 加载路面
function addRoad3dtiles(viewer) {
    // const URL = "/tileset/sx/tileset.json"
    const URL = "/tileset/suxiang/road/tileset.json"
    // this.get3DtilesScenetree(URL)
    const tileset = new Cesium.Cesium3DTileset({
        url: URL,
        maximumScreenSpaceError: 32,
        show: true,
        // shadows:Cesium.ShadowMode.DISABLED,
        // lightColor:new Cesium.Cartesian3 (0,0,0)
    })

    tileset.readyPromise.then(function (ts) {
        viewer.scene.primitives.add(ts) //添加tileset
        var params = {
            tx: 120.617026,  //模型中心X轴坐标（经度，单位：十进制度）
            ty: 31.461589,    //模型中心Y轴坐标（纬度，单位：十进制度）
            tz:-0.1,    //模型中心Z轴坐标（高度，单位：米）
            rx: 0,    //X轴（经度）方向旋转角度（单位：度）圆心应该是在地心，改动其中一个值的时候，不止变化了该变量，比如改动ry，模型的高度也有了显著上升
            ry: 0,    //Y轴（纬度）方向旋转角度（单位：度）
            rz:258.5     //Z轴（高程）方向旋转角度（单位：度）
        };
        update3dtilesMaxtrix(ts,params) // 更新tileset位置
    })


    tileset.allTilesLoaded.addEventListener(function () {
        // const mesh_shadow_list = ['Mesh15']
        // const featureNames = []
        tileset.style = new Cesium.Cesium3DTileStyle({
            // show: "${name} !== 'polySurface837'",
            color: {
                conditions: [
                    ["true", "rgba(0, 0, 0,0.2)"],
                ],
            },
        });
        // setTimeout(()=>{
        //   console.log(toRaw(_this.features))
        //   _this.features.forEach(feature => feature.show = false)
        // },3000)
    })

    //  tileset.tileVisible.addEventListener(function (tile){
    //    let shadar = `
    //   varying vec3 v_positionEC;
    //   void main(void){
    //   vec4 position = czm_inverseModelView * vec4(v_positionEC,1); // 位置
    //   float glowRange = 100.0; // 光环的移动范围(高度)
    //   // gl_FragColor = vec4(0.31,  0.74, 0.91, 1.0); // 颜色
    //   gl_FragColor = vec4(0.059,  0.082, 0.16, 1.0); // 颜色
    //   }
    // `;
    //   _this.addCustomShadarToTiles(tile,shadar)
    //  })

}
// 加载其他建筑
function addOther3dtiles(viewer) {
    const URL = "/tileset/suxiang/buildings/tileset.json"

    var yellowEdge = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
    yellowEdge.uniforms.color = Cesium.Color.WHITE;
    yellowEdge.uniforms.length = 1;
    yellowEdge.selected = [];
    viewer.scene.postProcessStages.add(
        Cesium.PostProcessStageLibrary.createSilhouetteStage([yellowEdge])
    );

    const tileset = new Cesium.Cesium3DTileset({
        url: URL,
        maximumScreenSpaceError: 3,
        show: true,
        // shadows:Cesium.ShadowMode.DISABLED,
        // lightColor:new Cesium.Cartesian3 (0,0,0)
    })

    tileset.tileVisible.addEventListener(function (tile) {
        // console.log(tile)
        // updateTile(tile);
        let shadar = `
        varying vec3 v_positionEC;
        void main(void){
        vec4 position = czm_inverseModelView * vec4(v_positionEC,1); // 位置
        float glowRange = 100.0; // 光环的移动范围(高度)
         gl_FragColor = vec4(0.54,  0.72, 0.98, 1.0); // 颜色
        // gl_FragColor = vec4(0.0,  0.0, 0.0, 1.0); // 颜色
        }
      `
        addCustomShadarToTiles(tile, shadar)

    });

    // const customShader = 

    tileset.readyPromise.then(function (ts) {
        viewer.scene.primitives.add(ts) //添加tileset
        var params = {
            tx: 120.616709,  //模型中心X轴坐标（经度，单位：十进制度）
            ty: 31.461566,    //模型中心Y轴坐标（纬度，单位：十进制度）
            tz: 0,    //模型中心Z轴坐标（高度，单位：米）
            rx: 0,    //X轴（经度）方向旋转角度（单位：度）圆心应该是在地心，改动其中一个值的时候，不止变化了该变量，比如改动ry，模型的高度也有了显著上升
            ry: 0,    //Y轴（纬度）方向旋转角度（单位：度）
            rz: 259.6    //Z轴（高程）方向旋转角度（单位：度）
        }
        update3dtilesMaxtrix(ts, params) // 更新tileset位置
        // viewer.zoomTo(ts, new Cesium.HeadingPitchRange(0.0, -0.3, 0.0));//视角移动
    })

    // tileset.tileLoad.addEventListener(function (tile) {
    //   // console.log(tile)
    //   let content = tile.content;
    //   if (content && content.featuresLength > 0) {
    //     const featuresLength = content.featuresLength;
    //     for (let i = 0; i < featuresLength; ++i) {
    //       const feature = content.getFeature(i);
    //       if (feature) {
    //         yellowEdge.selected = [...yellowEdge.selected,feature]
    //         // console.log(feature)
    //         // console.log(feature.getPropertyNames())
    //         // feature.show = false
    //       }
    //       // let name = SnUtil.getAlias(feature.getProperty('name'));
    //       // if (!tileset.featureMap.get(name)) {
    //       //   let featureEntity = new 3DTileFeatureEntity(feature);
    //       //   tileset.featureMap.set(name, featureEntity);
    //       // }
    //     }
    //   }
    // });

    tileset.allTilesLoaded.addEventListener(function () {
        // const mesh_shadow_list = ['Mesh15']
        // const featureNames = []
        tileset.style = new Cesium.Cesium3DTileStyle({
            // show: "${name} !== 'Mesh2989'",
            color: {
                // evaluateColor: (feature) => {
                //   yellowEdge.selected = [...yellowEdge.selected,feature];
                //    console.log(yellowEdge)

                //   // 这边似乎是异步的
                //   //这里收集所有feature
                //   // if(!featureNames.includes(feature.getProperty('name'))){
                //   //   _this.features.push(feature)
                //   //   featureNames.push(feature.getProperty('name'))
                //   //   // if(mesh_shadow_list.includes(feature.getProperty('name'))){
                //   //   //   _this.addCustomShadarToFeature(feature)
                //   //   // }
                //   //   // feature.show = false
                //   // }
                //   // if(mesh_shadow_list.includes(feature.getProperty('name'))){
                //     // _this.addCustomShadarToFeature(feature)
                //   //   console.log(feature)
                //   // }
                //   // console.log(feature.color)
                //   return feature.color.withAlpha(1);
                // },
                conditions: [
                    ["true", "rgba(255, 255, 255,0.05)"],
                ],
            },
        });
    })

}
// 加载大楼周边
function addBottom3dtiles(viewer) {
    const tileset = new Cesium.Cesium3DTileset({
        url: "/tileset/suxiang/bottom/tileset.json",
        maximumScreenSpaceError: 1,
        show: true,
    })
    tileset.readyPromise.then(function (ts) {
        viewer.scene.primitives.add(ts) //添加tileset
        let params = {
            tx: 120.619178,  //模型中心X轴坐标（经度，单位：十进制度）
            ty: 31.462798,    //模型中心Y轴坐标（纬度，单位：十进制度）
            tz: -998,    //模型中心Z轴坐标（高度，单位：米）
            rx: 0,    //X轴（经度）方向旋转角度（单位：度）圆心应该是在地心，改动其中一个值的时候，不止变化了该变量，比如改动ry，模型的高度也有了显著上升
            ry: 0,    //Y轴（纬度）方向旋转角度（单位：度）
            rz: 348.4     //Z轴（高程）方向旋转角度（单位：度）
        }
        update3dtilesMaxtrix(ts, params)

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
function addCustomShadarToTiles(tile, customShader) {
    // ==================== 光特效 start ============================
    customShader = customShader || `
        varying vec3 v_positionEC;
        void main(void){
        vec4 position = czm_inverseModelView * vec4(v_positionEC,1); // 位置
        float glowRange = 100.0; // 光环的移动范围(高度)
        gl_FragColor = vec4(0.31,  0.74, 0.91, 1.0); // 颜色
        // gl_FragColor = vec4(0.3,  0.85, 0.90, 1.0); // 颜色
        // gl_FragColor = vec4(0.2,  0.5, 1.0, 1.0); // 颜色
        gl_FragColor *= vec4(vec3((position.z + 5.0) / 60.0), 0.8); // 渐变
        // 动态光环
        float time = fract(czm_frameNumber / 180.0);
        time = abs(time - 0.5) * 2.0;
        float diff = step(0.005, abs( clamp(position.z / glowRange, 0.0, 1.0) - time));
        gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - diff);
        }
    `;
    let content = tile.content;
    for (let i = 0; i < content.featuresLength; i++) {
        let feature = content.getFeature(i);
        let model = feature.content._model;
        if (
            customShader &&
            model &&
            model._sourcePrograms &&
            model._rendererResources
        ) {
            Object.keys(model._sourcePrograms).forEach((key) => {
                let program = model._sourcePrograms[key];
                model._rendererResources.sourceShaders[program.fragmentShader] =
                    customShader;
            });
            model._shouldRegenerateShaders = true;
        }
    }
}
function main3dtilesColorAnimate(idx) {
    if (!tileset) {
        setTimeout(() => {
            main3dtilesColorAnimate(0)
        }, 0)
    }

    setTimeout(() => {
        if (idx >= 25) {
            //   this.addLogo3dtiles(this.viewer)
            addBuildingFlowlines(viewer)
            // document.getElementById('cesium-map-mask').style.display = 'none'

            // that.tileset.style = new Cesium.Cesium3DTileStyle({
            //   color:{
            //     conditions:[
            //       // ["${floor}>="+idx, "rgba(108, 162, 249, 0.0)"],
            //       // ["true","rgba(108, 162, 249, 0.3)"]
            //       ["${floor}>="+idx, "rgba(255, 255, 255, 0.0)"],
            //       ["${building}!=='north'","rgba(220, 220, 220,0.7)"],
            //       ["true","rgba(255, 255, 255, 0.3)"]
            //     ]
            //   }
            // })

            return
        }
        tileset.style = new Cesium.Cesium3DTileStyle({
            color: {
                conditions: [
                    // ["${floor}>="+idx, "rgba(108, 162, 249, 0.0)"],
                    // ["true","rgba(108, 162, 249, 0.3)"]
                    ["${floor}>=" + idx, "rgba(255, 255, 255, 0.0)"],
                    ["true", "rgba(255, 255, 255, 0.3)"]
                ]
            }
        })
        main3dtilesColorAnimate(idx + 1)
    }, 80)

}
function addBuildingFlowlines(viewer) {
    viewer = viewer || this.viewer
    if (buildingFlowlineEntities.length) {
        return
    }
    const lines = [
        // 北楼
        [
            [120.61960099715338, 31.46304677236365, 98],
            [120.61924927060328, 31.463118087637547, 98],
            [120.6193335626627, 31.46344483255224, 98],
            [120.61968579013454, 31.463378851146878, 98],
            [120.61960099715338, 31.46304677236365, 98],
        ],
        [
            [120.61960099715338, 31.46304677236365, 2.5],
            [120.61924927060328, 31.463118087637547, 2.5],
            [120.6193335626627, 31.46344483255224, 2.5],
            [120.61968579013454, 31.463378851146878, 2.5],
            [120.61960099715338, 31.46304677236365, 2.5],
        ],
        [
            [120.61960099715338, 31.46304677236365, 0],
            [120.61960099715338, 31.46304677236365, 98],
        ],
        [
            [120.61924927060328, 31.463118087637547, 98],
            [120.61924927060328, 31.463118087637547, 0],
        ],
        [
            [120.6193335626627, 31.46344483255224, 0],
            [120.6193335626627, 31.46344483255224, 98],
        ],
        [
            [120.61968579013454, 31.463378851146878, 98],
            [120.61968579013454, 31.463378851146878, 0],
        ],
        // 南楼
        [
            [120.6193012385419, 31.461806711347535, 69],
            [120.61895024238541, 31.461873480090905, 69],
            [120.61902713203882, 31.462201082363876, 69],
            [120.61938177628103, 31.462138302090327, 69],
            [120.6193012385419, 31.461806711347535, 69],
        ],
        [
            [120.6193012385419, 31.461806711347535, 2.5],
            [120.61895024238541, 31.461873480090905, 2.5],
            [120.61902713203882, 31.462201082363876, 2.5],
            [120.61938177628103, 31.462138302090327, 2.5],
            [120.6193012385419, 31.461806711347535, 2.5],
        ],
        [
            [120.6193012385419, 31.461806711347535, 69],
            [120.6193012385419, 31.461806711347535, 0],
        ],
        [
            [120.61895024238541, 31.461873480090905, 69],
            [120.61895024238541, 31.461873480090905, 0],
        ],
        [
            [120.61902713203882, 31.462201082363876, 69],
            [120.61902713203882, 31.462201082363876, 0],
        ],
        [
            [120.61938177628103, 31.462138302090327, 69],
            [120.61938177628103, 31.462138302090327, 0],
        ],
        // 裙楼
        [
            [120.61941252188561, 31.462647509565492, 39.5],
            [120.61906825057586, 31.462708118048894, 39.5],
            [120.61914580994387, 31.462997727723074, 39.5],
            [120.61948614577017, 31.462937040068976, 39.5],
            [120.61941252188561, 31.462647509565492, 39.5]
        ],
        [
            [120.61941145060156, 31.46226449957329, 28.5],
            [120.61923856692275, 31.462295696591084, 28.5],
            [120.6193097644104, 31.46258854057198, 28.5],
            [120.61948328558601, 31.462552991864975, 28.5],
            [120.61941145060156, 31.46226449957329, 28.5],
        ]
    ]
    const option = {
        width: 5,
        // color: "#00BFFF",
        // color:"#4169e1",
        color: "#6ca2ff",
        // color:"#000000",
        duration: 4000,
        image: require('../../assets/images/map/line4.png')
    }
    for (let i = 0; i < lines.length; i++) {

        let entity = viewer.entities.add({
            polyline: {
                positions: lines[i].map(item => {
                    return new Cesium.Cartesian3.fromDegrees(...item)
                }),
                width: option.width,
                // material: new Cesium.RoadTrailMaterialProperty(Cesium.Color.fromCssColorString(option.color), option.duration,option.image),
                material: new Cesium.PolylineTrailLinkMaterialProperty(Cesium.Color.fromCssColorString(option.color), option.duration, option.image),
            }
        })
        buildingFlowlineEntities.push(entity)
    }

}
function  addRoadFlowlines (viewer) {
      if(roadFlowlineEntities.length){
        return
      }
      const option = {
        width: 5,
        // color: "#00BFFF",
        color:"#4169e1",
        // color:"#000000",
        duration:1000,
        image:require('../../assets/images/map/line6.png')
      }


      // LinkPulse.png
      const lines = [
        [
          [120.61843498550637,31.452339628123337],
          [120.61893260763712,31.455090813173683],
          [120.61935771260336,31.457447059250754],
          [120.61968237089546,31.45941103565733],
          [120.62006706508322,31.461789428182996],
          [120.62044887430865,31.463967611926922],
          [120.62084131511095,31.466841882952455],
          [120.621150678328,31.469161558059316],
          [120.6213422693141,31.470684482732384],
        ],
        [
          [120.62165921886638,31.47064580051874],
          [120.62140826910706,31.46879417884222],
          [120.62112566374363,31.46682912544909],
          [120.6208790265205,31.46512861913634],
          [120.62055791263856,31.46314340370653],
          [120.62023048990486,31.46129658159939],
          [120.61992701675258,31.459513605313337],
          [120.61959419335554,31.457575689501223],
          [120.619198204425,31.455322592676357],
          [120.61892263391447,31.45377649084322],
          [120.61867220047516,31.45230293373811],
        ],
      [
        [120.60752221916923,31.461410937538865],
        [120.61215869403159,31.46102524760006],
        [120.61438675331088,31.45991859197167],
        [120.6168163880603,31.458719392247264],
        [120.61900327228632,31.45763241584612],
        [120.61952783015248,31.457383305138812],
        [120.6201313692786,31.457262295772697],
        [120.62228333037294,31.456871757294476],
        [120.62578033784919,31.456231811580533],
      ],
      [
        [120.62627711253452,31.463059784959857],
        [120.62343718562619,31.463375628199046],
        [120.62090310809724,31.4636537760141],
        [120.61914383103482,31.464361552586716],
        [120.61632454379169,31.465426712967076],
        [120.614109642718,31.466235337314178],
        [120.61246678409437,31.46677353428971],
        [120.60790563416629,31.46717956142558],
      ],


      ]
      for(let i=0;i<lines.length;i++){

        let entity = viewer.entities.add({
          polyline:{
            positions:lines[i].map(item => {
              return new Cesium.Cartesian3.fromDegrees(...item,2)
            }),
            width: option.width,
            material: new Cesium.RoadTrailMaterialProperty(Cesium.Color.fromCssColorString(option.color), option.duration,option.image),
          }
        })
        roadFlowlineEntities.push(entity)
      }
}
</script>
<style lang="scss" scoped>
</style>