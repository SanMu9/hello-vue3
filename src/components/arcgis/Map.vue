<!--
 * @Author: your name
 * @Date: 2021-05-25 13:34:07
 * @LastEditTime: 2021-05-25 13:58:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /hello-vue3/src/components/arcgis/Map.vue
-->
<template>
  <div id="arcgis-map"></div>
  <button v-if="viewloaded" class="btn" @click="changeView()">{{viewType}}</button>
</template>

<script>
import esriConfig from "@arcgis/core/config";
import Map from "@arcgis/core/Map";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Camera from "@arcgis/core/Camera";
import SceneView from "@arcgis/core/views/SceneView";
import MapView from '@arcgis/core/views/MapView';

export default {
  data() {
    return {
      viewType:'2D',
      cameraInfo: {
        global: {
          position: [112.9824, 32.8662, 12908164.47184],
          heading: 0.0,
          tilt: 0.5,
        },
        shanXiOutline: {
          position: {
            longitude: 114.3428,
            latitude: 30.4496,
            z: 1146558.2339,
          },
          heading: 353.484,
          tilt: 34.3822,
        },
        JSArea: {
          position: {
            longitude: 116.1524,
            latitude: 30.7766,
            z: 1085163.5798,
          },
          heading: 338.6368,
          tilt: 39.4037,
        },
        JCJArea: {
          position: {
            longitude: 117.8505,
            latitude: 33.6516,
            z: 659496.2959,
          },
          heading: 339.7401,
          tilt: 43.2274,
        },
        JJYArea: {
          position: {
            longitude: 115.4975,
            latitude: 30.855,
            z: 638692.7655,
          },
          heading: 338.4943,
          tilt: 43.3873,
        },
      },
      viewParams:{},
      viewloaded:false,
    };
  },
  methods: {
    initMap() {
      esriConfig.apiKey =
        "AAPK61f6f52d4b02426599021d91e57a1fe9WW3kg9ffvxjv6bZLkbgQJ9RmqOzybiNyygRjCxQhZXFeMF-7fpmkua4jWoiKBJOB";

      const _this = this;

      var map = new Map({
        // 几个无需使用api key的basemap satellite dark-gray	national-geographic terrain dark-gray-vector	topo-vector
        // 更多查看 https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html#basemap
        basemap: "satellite",
        ground: "world-elevation", //world-topobathymetry world-elevation
      });
      const view = new SceneView({
        container: "arcgis-map",
        map: map,
        qualityProfile: "high",
        environment: {
          lighting: {
            directShadowsEnabled: true,
            ambientOcclusionEnabled: true,
          },
          atmosphere: {
            quality: "high",
          },
        },
        camera: _this.cameraInfo["global"],
      });
      window.view = view;
      window.arcgisMap = map;

      view.when(() => {
        
        this.goToCamera("JCJArea").then(() => {
            this.viewloaded = true;
        });
      });
    },
    goToCamera(type) {
      const camera = this.cameraInfo[type];
      let cam = new Camera(camera);
      return window.view.goTo(cam, {
        speedFactor: 0.5,
        duration: 2000,
      });
    },
    changeView(){
        let view = window.view;
        let activeViewpoint = view.viewpoint.clone();
        let viewParams = {
            container: "arcgis-map",
            map: window.arcgisMap,
            viewpoint:activeViewpoint
        };
        if(this.viewType == '2D'){
            viewParams.viewpoint.rotation = 0;
            view - new MapView(viewParams);
            this.viewType = '3D'
        }else {
            view = new SceneView(viewParams)
            this.viewType = '2D'
        }
        
    }
  },
  mounted() {
    this.initMap();
  },
};
</script>

<style>
@import "https://js.arcgis.com/4.19/@arcgis/core/assets/esri/themes/dark/main.css";
#arcgis-map {
  height: 100%;
}
.esri-ui .esri-attribution{
  display: none;
}
</style>
<style scoped>
.btn{
    position: fixed;
    top: 20px;
    left: 60px;
    cursor: pointer;
    width: 100px;
}
</style>