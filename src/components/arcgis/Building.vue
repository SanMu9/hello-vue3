<template>
  <div id="arcgis-map"></div>
</template>

<script>
import Map from "@arcgis/core/Map";
import SceneView from "@arcgis/core/views/SceneView";
import BuildingSceneLayer from "@arcgis/core/layers/BuildingSceneLayer"
import esriConfig from "@arcgis/core/config";
import SceneLayer from "@arcgis/core/layers/SceneLayer";
import LayerList from "@arcgis/core/widgets/LayerList"
export default {
  data () {
    return {

    }
  },
  methods: {
    initMap() {
      esriConfig.apiKey =
        "AAPK61f6f52d4b02426599021d91e57a1fe9WW3kg9ffvxjv6bZLkbgQJ9RmqOzybiNyygRjCxQhZXFeMF-7fpmkua4jWoiKBJOB";
      const buildingLayer = new BuildingSceneLayer({
        url:"https://tiles.arcgis.com/tiles/V6ZHFr6zdgNZuVG0/arcgis/rest/services/BSL__4326__US_Redlands__EsriAdminBldg_PublicDemo/SceneServer",
        // url:"https://tiles.arcgis.com/tiles/V6ZHFr6zdgNZuVG0/arcgis/rest/services/BSL__4326__US_Redlands__EsriAdminBldg_PublicDemo/SceneServer"
        title: "Administration Building, Redlands - Building Scene Layer",
      })
      var map = new Map({
        // 几个无需使用api key的basemap satellite dark-gray	national-geographic terrain dark-gray-vector	topo-vector
        // 更多查看 https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html#basemap
        basemap: "satellite",
        ground: "world-elevation", //world-topobathymetry world-elevation
        layers: [
          buildingLayer
        ]
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
        camera: {
          position: [-117.184, 34.058, 270],
          tilt: 82,
          heading: 304,
        }
      });
      console.log('buildingLayer：',buildingLayer)
      buildingLayer.when(() => {
        buildingLayer.allSublayers.forEach((layer) => {
          layer.visible = true
          console.log(layer)
          // switch(layer.modelName){

          // }
        })
      })

      // Add a layer list widget
      const layerList = new LayerList({
        view: view
      });
      view.ui.empty("top-left");
      view.ui.add(layerList, "top-left");
      // layer.on('click',function(ev){
      //   console.log(ev)
      // })
      // view.popup.autoOpenEnabled = false;
      // view.on('click',function(ev) {
      //   console.log(ev)
      // })
    },
  },
  mounted () {
    this.initMap()
  }
}
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