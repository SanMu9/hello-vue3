<!--
 * @Author: your name
 * @Date: 2021-05-25 10:20:07
 * @LastEditTime: 2021-06-16 15:29:35
 * @LastEditors: Please set LastEditors
 * @Description: ArcGIS API for JS FeatureLayer polygon-3d
 * @FilePath: /hello-vue3/src/components/arcgis/Polygon.vue
-->
<template>
  <div id="arcgis-map"></div>
</template>

<script>
import esriConfig from "@arcgis/core/config";
import Map from "@arcgis/core/Map";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Camera from "@arcgis/core/Camera";
import SceneView from "@arcgis/core/views/SceneView";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";

export default {
  data() {
    return {
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

      view.when(() => {
        // this.goToCamera("JCJArea").then(() => {
          this.drawChinaOutline()
          // this.drawJCJOutline();
          // this.drawFromUrl();
        // });
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
    drawYanChenOutline() {
      // const geojson = require("/public/json/盐城市.json");

    },
    drawJCJOutline() {
      const geojson = require("/public/json/晋察冀片区_outline.json");
      const coords = geojson.features[0].geometry.coordinates;
      const rings = [];
      coords.forEach((item) => {
        rings.push(item[0].reverse());
      });
    //   const graphic = new Graphic({});
      const layer = new FeatureLayer({
        source: [
          {
            attributes: {
              OBJECTID: "",
              name: "晋察冀片区_山西",
              title: "晋察冀片区",
              inShanxi: true,
            },
            geometry: {
              type: "polygon",
              rings: rings,
            },
          },
        ],
        title: "晋察冀片区_山西",
        objectIdField: "OBJECTID",
        fields: [{ name: "title", type: "string" }],
        outFields: ["*"],
        renderer: {
          type: "simple",
          symbol: {
            type: "polygon-3d",
            symbolLayers: [
              {
                // type: "fill",
                // material: { color: [218, 175, 99, 0.3] },
                // outline: { color: [218, 175, 99] },

                // 3d
                type:'extrude',
                size:3000,
                material: { color: [218,175,99,0.3] },
                edges:{
                  type:'solid',
                  color:[218,175,99,0.8],
                  size:2
                }
              },
            ],
          },
        },
        labelsVisible: true,
        labelingInfo: [
          {
            labelPlacement: "above-center",
            symbol: {
              type: "label-3d",
              verticalOffset: {
                screenLength: 8000,
                maxWorldLength: 10000,
                minWorldLength: 30,
              },
              callout: {
                type: "line",
                size: 1,
                color: [255, 255, 255],
              },
              symbolLayers: [
                {
                  type: "text",
                  material: {
                    color: [255, 255, 255, 1],
                  },
                  size: 12,
                  text: "晋绥片区",
                },
              ],
            },
            labelExpressionInfo: {
              expression: "$feature.title",
            },
          },
        ],
      });
      window.view.map.add(layer);
      return layer;
    },
    drawFromUrl(){
      const layer = new FeatureLayer({
        url:"https://services3.arcgis.com/5Z5DSAn76ElDv7tg/arcgis/rest/services/shanxi_buildings/FeatureServer",
        renderer: {
          type: "simple",
          symbol: {
            type: "polygon-3d",
            symbolLayers: [
              {
                // type: "fill",
                // material: { color: [218, 175, 99, 0.3] },
                // outline: { color: [218, 175, 99] },

                // 3d
                type:'extrude',
                size:50,
                material: { color: 'blue' },
                edges:{
                  type:'solid',
                  color:'blue',
                  size:2
                }
              },
            ],
          },
        },
      });
      window.view.map.add(layer)
      console.log(layer)
    },
    drawGeoJson(){
      
    },
    drawChinaOutline(){
      const layer = new FeatureLayer({
        // url:"https://services3.arcgis.com/5Z5DSAn76ElDv7tg/arcgis/rest/services/%E7%9B%90%E5%9F%8E%E5%B8%82/FeatureServer",
        url:"https://services3.arcgis.com/5Z5DSAn76ElDv7tg/arcgis/rest/services/yanchen/FeatureServer",
        // url:"https://services3.arcgis.com/5Z5DSAn76ElDv7tg/arcgis/rest/services/chinaoutline/FeatureServer",
        renderer:{
          type:"simple",
          symbol:{
            type:'polygon-3d',
            
            symbolLayers:[
              {
                type:'fill',
                material:{
                  color:[0,0,0,0]
                },
                outline:{
                  color:"#ffffff",
                  size:2
                }
              }
            ]
          }
        }
      })
      window.view.map.add(layer)
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
