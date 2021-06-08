<!--
 * @Author: your name
 * @Date: 2021-05-31 15:46:36
 * @LastEditTime: 2021-06-07 14:21:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /hello-vue3/src/components/arcgis/Geojson.vue
-->
<template>
  <div id="arcgis-map"></div>

</template>

<script>
import esriConfig from "@arcgis/core/config";
import Map from "@arcgis/core/Map";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Camera from "@arcgis/core/Camera";
import SceneView from "@arcgis/core/views/SceneView";

import { GetPointsListReq } from "@/assets/request/shanxi.js";

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
        this.goToCamera("shanXiOutline").then(() => {
            this.drawGeoJson()
            this.drawPoints();
            view.on('click',(e)=>{
                view.hitTest(e).then(res => {
                    console.log(res)
                    let tar = res.results[0];
                    if(tar){
                        console.log(tar)
                        const layer = tar.graphic.layer;
                        if(layer.id == 'layer_shanxi'){
                            const city = tar.graphic.attributes.name;
                            view.goTo(tar.graphic)
                            const pointLayer = map.findLayerById('layer_points');
                            console.log(pointLayer)
                            view.whenLayerView(layer).then(layerView => {
                                console.log(layerView)
                                layerView.filter = {
                                    where:"name = '" + city +"'"
                                }
                            })
                            view.whenLayerView(pointLayer).then(layerView => {
                                layerView.filter = {
                                    where:"city = '"+ city +"'"
                                }
                            })
                        }
                    }
                })
            })
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
    drawGeoJson(){
        console.log(window.location)
        // const layer = new GeoJSONLayer({
        //     // url:require('/public/json/山西省.json')
        //     url:'http://172.26.1.128:8092/shanxi_0.geojson',
        //     // url:'/public/json/shanxi_0.json',
        //     outFields:["*"],
        //     id:"layer_shanxi",
        // })

        const layer = new FeatureLayer({
            url:"https://services3.arcgis.com/5Z5DSAn76ElDv7tg/arcgis/rest/services/%E5%B1%B1%E8%A5%BF%E7%9C%81/FeatureServer",
            // url:'http://172.26.1.128:8092/shanxi_0.geojson',
            // url:'../../../public/json/山西省_0.json',

            outFields:["*"],
            id:"layer_shanxi",
            renderer:{
                type:"simple",
                symbol:{
                    type:'polygon-3d',
                    
                    symbolLayers:[
                    {
                        type:'extrude',
                        material:{
                            color:[0,0,0,0.5]
                        },
                        size:1000,
                        edge:{
                            type:"solid",
                            color:"#ffffff",
                            size:2
                        }
                    }
                    ]
                }
            }
        })
        window.view.map.add(layer);
    },
    drawPoints() {
      GetPointsListReq().then((res) => {
        let data = res.data.result;
        const graphicArr = [];
        data.forEach((item) => {
          if (item.lat && item.lng) {
            graphicArr.push({
              attributes: {
                id: item.id,
                city: item.city,
                level: item.level,
                name: item.name,
                district: item.district,
              },
              geometry: {
                longitude: item.lng,
                latitude: item.lat,
                type: "point",
              },
            });
          }
        });
        const img = require('/public/images/red_circle.png');
        const layer = new FeatureLayer({
          source: graphicArr,
          id:"layer_points",
          title: "shanxi_points",
          objectIdField: "id",
          fields: [
            { name: "city", type: "string" },
            { name: "level", type: "string" },
            { name: "name", type: "string" },
            { name: "district", type: "string" },
            { name: "id", type: "oid" },
          ],
          outFields: ["id", "city", "level", "name", "district"],
          renderer: {
            type: "simple",
            symbol: {
              type: "point-3d",
              symbolLayers: [
                {
                  type: "icon",
                  resource: {
                      href:img
                    // href: require('/public/images/icon.png'),
                    // href: require('/public/images/icon.svg')
                  },
                //   size: 15,
                //   resource: { primitive: "circle" },
                //   material: { color: "red" },
                },
              ],
                
                // type:"picture-marker",
                // symbolLayers:[
                //     {
                //         type:'picture-marker',
                //         url:'/public/images/red_circle.png',
                //         width:'15px',
                //         height:'15px'
                //     }
                // ]
            },
          },
        });

        window.view.map.add(layer);
      });
    },
    
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
  position: relative;
}
.esri-ui .esri-attribution{
  display: none;
}
</style>