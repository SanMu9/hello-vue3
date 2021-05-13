<!--
 * @Author: your name
 * @Date: 2021-05-13 15:58:37
 * @LastEditTime: 2021-05-13 18:27:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \hello-vue3\src\views\Arcgis.vue
-->
<template>
  <div id="arcgis-map"></div>
</template>

<script>
import Map from "@arcgis/core/Map"

import WebMap from "@arcgis/core/WebMap";
import MapView from "@arcgis/core/views/MapView"
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import SceneView from "@arcgis/core/views/SceneView"
// import ElevationLayer from "@arcgis/core/views/ElevationLayer"
export default {
  data() {
    return {

    }
  },
  mounted(){
    console.log(FeatureLayer)
    var map = new Map({
      basemap: "topo-vector",
      ground: "world-elevation",
      // layers: [ new ElevationLayer({
      //   url: "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
      // })]
    })
    new SceneView({
          container: "arcgis-map", 
          map: map,              
          qualityProfile: "high",
          camera: {
            position: [
              -118.80714018,
              33.96144206,
              1574.65501
            ],
            heading: 0.51,
            tilt: 78.99
          }
        });
  }
}
</script>

<style>
@import "https://js.arcgis.com/4.19/@arcgis/core/assets/esri/themes/dark/main.css";
#arcgis-map{
  height: 100%;
}
</style>