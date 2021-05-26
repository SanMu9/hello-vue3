<!--
 * @Author: your name
 * @Date: 2021-05-25 11:13:18
 * @LastEditTime: 2021-05-25 17:02:18
 * @LastEditors: Please set LastEditors
 * @Description: arcgis 聚合点 似乎只能在MapView中显示（2d）
 * @FilePath: /hello-vue3/src/components/arcgis/Cluster.vue
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
import MapView from '@arcgis/core/views/MapView';
import {GetPointsListReq} from '@/assets/request/shanxi.js';

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

      var map = new Map({
        // 几个无需使用api key的basemap satellite dark-gray	national-geographic terrain dark-gray-vector	topo-vector
        // 更多查看 https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html#basemap
        basemap: "satellite",
        ground: "world-elevation", //world-topobathymetry world-elevation
      });
      const view = new MapView({
        container: "arcgis-map",
        map: map,
        center:[112.549717,37.87046],
        zoom:8,
        
      });
      window.view = view;

      view.when(() => {
        this.drawPointsCluster();
        view.on('click',(e)=>{
          console.log(e)
          view.hitTest(e).then(res => {
            console.log(res)
            console.log(res.results[0].graphic.attributes)
          })
        })
      });
    },
    drawPointsCluster(){
      GetPointsListReq().then(res => {
        console.log(res)
        let data = res.data.result;
        const graphicArr = [];
        data.forEach(item => {
          if(item.lat&&item.lng){
            graphicArr.push({
              attributes:{
                id:item.id,
                city:item.city,
                level:item.level,
                name:item.name,
                district:item.district
              },
              geometry:{
                longitude:item.lng,
                latitude:item.lat,
                type:'point'
              }
            })
          }
          
        });

        const layer = new FeatureLayer({
          source:graphicArr,
          title:"shanXi_points",
          objectIdField:'id',
          fields:[
            {name:'city',type:'string'},
            {name:'level',type:'string'},
            {name:'name',type:'string'},
            {name:'district',type:'string'},
            {name:'id',type:'oid'},
          ],
          outFields:['id','city','level','name','district'],

          // ! Point clustering only applies to layers with Point geometries in a MapView 
         featureReduction:{
            type: "cluster",
            clusterRadius: '100px',
            clusterMinSize: "24px",
            clusterMaxSize: "60px",
            labelingInfo: [{
              deconflictionStrategy: "none",
              labelExpressionInfo: {
                expression: "$feature.cluster_count"
              },
              symbol: {
                type: "text",
                color: "#004a5d",
                font: {
                  weight: "bold",
                  family: "Noto Sans",
                  size: "12px"
                }
              },
              labelPlacement: "center-center",
            }]
          },
          renderer:{
            type:"simple",
            // field:'name',
            symbol: {
              type: "simple-marker",
              size: 10,
              color: "#69dcff",
              outline: {
                color: "rgba(0, 139, 174, 0.5)",
                width: 5
              }
            },
            visualVariables:[
              {
                type:'color',
                // field:'city',
                valueExpression:`
                var value=0;
                if($feature.city == '太原市'){
                  value = 1;
                }
                return value
                `,
                stops:[
                  {value:0,color:"#000000"},
                  {value:1,color:"#69dcff"}
                ]
                // normalizationField:'city',

              }
            ]
            
          }
        })
        console.log(layer)
        window.view.map.add(layer)
        // window.view.whenLayerView(layer).then(layerView => {
        //   console.log(layerView)
        //   layerView.filter = {
        //     where:`city='太原市'`
        //   }
        // })

      })
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
}
.esri-ui .esri-attribution{
  display: none;
}
</style>
