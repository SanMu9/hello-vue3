<!--
 * @Author: your name
 * @Date: 2021-05-13 15:58:37
 * @LastEditTime: 2021-05-20 17:40:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \hello-vue3\src\views\Arcgis.vue
-->
<template>
  <div id="arcgis-map"></div>
  <teleport to="body">
    <div v-show="infoPanelShow" id="panel" class="esri-widget">
      <div id="events" class="container">
        <a
          class="title"
          href="https://developers.arcgis.com/javascript/latest/api-reference/esri-views-View.html#events-summary"
          target="_blank"
          >Class View Events:</a
        >
      </div>
      <div id="properties" class="container">
        <a
          class="title"
          href="https://developers.arcgis.com/javascript/latest/api-reference/esri-views-View.html#properties-summary"
          target="_blank"
          >Class View Properties:</a
        >
      </div>
    </div>
  </teleport>
</template>

<script>
import esriConfig from "@arcgis/core/config";
import Map from "@arcgis/core/Map";
import Basemap from "@arcgis/core/Basemap";

import WebMap from "@arcgis/core/WebMap";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import WebTileLayer from "@arcgis/core/layers/WebTileLayer";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";

import SceneView from "@arcgis/core/views/SceneView";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Camera from "@arcgis/core/Camera";
import LineSymbol3D from "@arcgis/core/symbols/LineSymbol3D";
import PathSymbol3DLayer from "@arcgis/core/symbols/PathSymbol3DLayer";

// import ElevationLayer from "@arcgis/core/views/ElevationLayer"

import { ShanXiGeoJson } from "@/assets/js/argisPublicValue.js";
export default {
  data() {
    return {
      infoPanelShow: false,
      cameraInfo: {
        global: {
          position: [112.9824, 32.8662, 12908164.47184],
          heading: 0.0,
          tilt: 0.5,
        },
        shanXiOutline: {
          position: {
            longitude:114.3428,
            latitude:30.4496,
            z:1146558.2339
          },
          heading: 353.4840,
          tilt: 34.3822,
        },
        JSArea:{
          position:{
            longitude:116.1524,
            latitude:30.7766,
            z:1085163.5798
          },
          heading:338.6368,
          tilt:39.4037,
        },
        JCJArea:{
          position:{
            longitude:117.8505,
            latitude:33.6516,
            z:659496.2959
          },
          heading:339.7401,
          tilt:43.2274
        },
        JJYArea:{
          position:{
            longitude:115.4975,
            latitude:30.8550,
            z:638692.7655
          },
          heading:338.4943,
          tilt:43.3873
        }
      },
    };
  },
  methods: {
    initMap() {
      esriConfig.apiKey =
        "AAPK61f6f52d4b02426599021d91e57a1fe9WW3kg9ffvxjv6bZLkbgQJ9RmqOzybiNyygRjCxQhZXFeMF-7fpmkua4jWoiKBJOB";

      const _this = this;
      const mapBaseLayer = new WebTileLayer({
        urlTemplate:
          "https://stamen-tiles-{subDomain}.a.ssl.fastly.net/terrain/{level}/{col}/{row}.png",
        subDomains: ["a", "b", "c", "d"],
        copyright:
          'Map tiles by <a href="http://stamen.com/">Stamen Design</a>, ' +
          'under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. ' +
          'Data by <a href="http://openstreetmap.org/">OpenStreetMap</a>, ' +
          'under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
      });

      // Create a Basemap with the WebTileLayer. The thumbnailUrl will be used for
      // the image in the BasemapToggle widget.
      const stamen = new Basemap({
        baseLayers: [mapBaseLayer],
        title: "Terrain",
        id: "terrain",
        thumbnailUrl:
          "https://stamen-tiles.a.ssl.fastly.net/terrain/10/177/409.png",
      });

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

      const graphics_layer = new GraphicsLayer();
      map.add(graphics_layer);
      window.ArcgisLayers = {
        graphicsLayer: graphics_layer,
      };
      setTimeout(() => {
        this.goToCamera("JSArea").then(() => {

          this.drawJSOutline();
          this.drawJSOuterArea();
          setTimeout(()=>{
            this.goToCamera("JCJArea").then(()=>{
              this.drawJCJOutline();
              this.drawJCJOuterArea();

              setTimeout(()=>{
                this.goToCamera("JJYArea").then(()=>{
                  this.drawJJYOutline();
                  this.drawJJYOuterArea();
                  setTimeout(()=>{
                    this.goToCamera("shanXiOutline").then(()=>{
                      this.drawoShanXiOutline();
                    })
                  },1000)

               })
              },1000)
            
            })
          },1000)
          

          
          
          view.on('click',function(event){
            view.hitTest(event).then(res => {
              console.log(res)
            })
          })
        });
      }, 1500);
      // this.showArcgisInfo();
    },

    goToCamera(type) {
      const camera = this.cameraInfo[type];
      let cam = new Camera(camera);
      console.log(cam)
      return window.view.goTo(cam, {
        speedFactor: 0.5,
        duration: 2000,
      });
    },
    /**
     * @description: 绘制山西省轮廓
     * @param {*}
     * @return {*}
     */
    drawoShanXiOutline() {
      const outlinePath = ShanXiGeoJson.features[0].geometry.coordinates[0];
      console.log(outlinePath);
      const graphic = new Graphic({
        attributes: {
          name: "山西省轮廓",
        },
        geometry: {
          type: "polyline",
          paths: outlinePath,
        }
      });
      const layer = new FeatureLayer({
        source: [
          graphic
          // {
          //   attributes: {
          //     name: "山西省轮廓",
          //   },
          //   geometry: {
          //     type: "polyline",
          //     paths: outlinePath,
          //   },
          // },
        ],
        title: "shanXiOutline",
        objectIdField: "name",
        // fields: [ {
        //   name: "name",
        //   type: "string"
        // }],
        outFields:['*'],
        geometryType: "polyline",
        // hasM: true,
        // hasZ: false,
        renderer: {
          type: "simple",
          // symbol: {
          //   type: "simple-line",
          //   color: [255, 255, 255],
          //   width: 5,
          // },
          symbol: {
            type: "line-3d",
            // color: [255, 255, 255],

            symbolLayers: [
              {
                type: "path",  // autocasts as new PathSymbol3DLayer()
                profile: "quad",  // creates a rectangular shape
                width: 1000,  // path width in meters
                height: 1000,  // path height in meters
                anchor:'bottom',
                material: { color: "#ffffff" },
                profileRotation: "heading"
              }
            ],
          },
        },
      });
      window.view.map.add(layer);
      // setTimeout(()=>{
      //   layer.renderer = {
      //      type: "simple",
      //     // symbol: {
      //     //   type: "simple-line",
      //     //   color: [255, 255, 255],
      //     //   width: 5,
      //     // },
      //     symbol: {
      //       type: "line-3d",
      //       // color: [255, 255, 255],

      //       symbolLayers: [
      //         {
      //           type: "path",  // autocasts as new PathSymbol3DLayer()
      //           profile: "quad",  // creates a rectangular shape
      //           width: 1000,  // path width in meters
      //           height: 1000,  // path height in meters
      //           anchor:'bottom',
      //           material: { color: "#000000" },
      //           profileRotation: "heading"
      //         }
      //       ],
      //     },
      //   }
      // },3000)
      console.log(layer.queryFeatures());
      // window.ArcgisLayers.graphicsLayer.add(graphic);
    },
    /**
     * @description: 监听地图时间并显示地图实时信息
     * @param {*}
     * @return {*}
     */
    showArcgisInfo() {
      this.infoPanelShow = true;
      const events = [
        "pointer-enter",
        "pointer-leave",
        "pointer-move",
        "pointer-down",
        "pointer-up",
        "immediate-click",
        "click",
        "immediate-double-click",
        "double-click",
        "mouse-wheel",
        "drag",
        "hold",
        "key-down",
        "key-up",
        "focus",
        "blur",
        "resize",
      ];
      // for the purpose of the sample, this is only a selection of properties,
      // but any properties on the View can be watched for
      const properties = [
        "focused",
        "interacting",
        "updating",
        "resolution",
        "scale",
        "zoom",
        "stationary",
        "camera.position.longitude",
        "camera.position.latitude",
        "camera.position.x",
        "camera.position.y",
        "camera.position.z",
        "camera.tilt",
        "camera.heading",
        "camera.fov",
      ];
      function createTables() {
        const eventsTable = document.getElementById("events");
        let content = eventsTable.innerHTML;
        for (let i = 0; i < events.length; i++) {
          content += '<div class="event" id="' + events[i] + '">' + events[i];
          content += "</div>";
        }
        eventsTable.innerHTML = content;
        const propertiesTable = document.getElementById("properties");
        content = propertiesTable.innerHTML;
        for (let i = 0; i < properties.length; i++) {
          content +=
            '<div class="property" id="' +
            properties[i] +
            '">' +
            properties[i] +
            " = </div>";
        }
        propertiesTable.innerHTML = content;
      }

      function setupEventListener(view, name) {
        const eventRow = document.getElementById(name);
        view.on(name, (value) => {
          eventRow.className = "event active";
          if (eventRow.highlightTimeout) {
            clearTimeout(eventRow.highlightTimeout);
          }
          eventRow.highlightTimeout = setTimeout(() => {
            // after a timeout of one second disable the highlight
            eventRow.className = "event inactive";
          }, 1000);
        });
      }

      function setupPropertiesListener(view, name) {
        const propertiesRow = document.getElementById(name);
        view.watch(name, (value) => {
          propertiesRow.className = "property active";
          propertiesRow.innerHTML = propertiesRow.innerHTML.substring(
            0,
            propertiesRow.innerHTML.indexOf(" = ")
          );
          // set the text to the received value
          const formattedValue =
            typeof value === "number" ? value.toFixed(4) : value;
          propertiesRow.innerHTML += " = " + formattedValue.toString();
          if (propertiesRow.highlightTimeout) {
            clearTimeout(propertiesRow.highlightTimeout);
          }
          propertiesRow.highlightTimeout = setTimeout(() => {
            // after a timeout of one second disable the highlight
            propertiesRow.className = "property inactive";
          }, 1000);
        });
      }

      // create the tables for the events and properties
      createTables();

      // Setup all view events defined in the array
      for (let i = 0; i < events.length; i++) {
        setupEventListener(window.view, events[i]);
      }
      // Setup all watch properties defined in the array
      for (let i = 0; i < properties.length; i++) {
        setupPropertiesListener(window.view, properties[i]);
      }
    },

    drawJSOutline (){
      const geojson = require("../../public/json/晋绥片区_outline.json");
      const coords = geojson.features[0].geometry.coordinates;
      const rings = [];
      coords.forEach(item => {
        rings.push(item[0].reverse())
      })
      const graphic = new Graphic({
        attributes:{
          OBJECTID:1,
          name:"晋绥片区_山西",
          title:"晋绥片区",
          inShanxi:0,
        },
        geometry:{
          type:"polygon",
          rings:rings
        }
      })
      const layer = new FeatureLayer({
        source:[graphic],
        title:"晋绥片区_山西",
        objectIdField:"OBJECTID",
        fields:[
          {name:'title',type:'string'},
        ],
        // outFields:['*'],
        renderer:{
          type:'simple',
          symbol:{
            type:'polygon-3d',
            symbolLayers:[
              {
                type:"fill",
                material: { color: [255,0,0,0.3] },
                outline: { color: "red" },
                // type:'extrude',
                // size:10000,
                // material: { color: [255,0,0,0.8] },
                // edges:{
                //   type:'solid',
                //   color:[255,0,0,0.8],
                //   size:2
                // }

              }
            ]
          }
          
        },
        labelsVisible:true,
        labelingInfo:[
          {
            labelPlacement: "above-center",
            symbol:{
              type:'label-3d',
              verticalOffset: {
                screenLength: 8000,
                maxWorldLength: 10000,
                minWorldLength: 30
              },
              callout:{
                type:'line',
                size:1,
                color:[255,255,255],
                
              },
              symbolLayers:[
                {
                  type:'text',
                  material:{
                    color:[255,255,255,1]
                  },
                  size:12,
                  text:"晋绥片区"
                }
              ]
            },
            labelExpressionInfo:{
              expression:"$feature.title"
            }
          }
        ]
      })
      // setTimeout(()=>{
      //   layer.renderer = {
      //     type:'simple',
      //     symbol:{
      //       type:'polygon-3d',
      //       symbolLayers:[
      //         {
      //           // type:"fill",
      //           // material: { color: [255,0,0,0.3] },
      //           // outline: { color: "red" },
      //           type:'extrude',
      //           size:10000,
      //           material: { color: [255,0,0,0.8] },
      //           edges:{
      //             type:'solid',
      //             color:[255,0,0,0.8],
      //             size:2
      //           }

      //         }
      //       ]
      //     }
          
      //   }
      // },5000)
      // // console.log()
      window.view.map.add(layer)
      
    },
    drawJCJOutline() {
      const geojson = require('../../public/json/晋察冀片区_outline.json');
      const coords = geojson.features[0].geometry.coordinates;
      const rings = [];
      coords.forEach(item => {
        rings.push(item[0].reverse())
      })
      console.log(rings)
      const graphic = new Graphic({
        attributes:{
          OBJECTID:"",
          name:"晋察冀片区_山西",
          title:"晋察冀片区",
          inShanxi:true,
        },
        geometry:{
          type:"polygon",
          rings:rings
        }
      })
      const layer = new FeatureLayer({
        source:[graphic],
        title:"晋察冀片区_山西",
        objectIdField:"OBJECTID",
        fields:[
          {name:"title",type:'string'}
        ],
        outFields:["*"],
        renderer:{
          type:"simple",
          symbol:{
            type:"polygon-3d",
            symbolLayers:[
            {
              type:"fill",
              material: { color: [218,175,99,0.3] },
              outline: { color: [218,175,99] },
              // type:'extrude',
              // size:3000,
              // material: { color: [218,175,99,0.3] },
              // edges:{
              //   type:'solid',
              //   color:[218,175,99,0.8],
              //   size:2
              // } 
            }
          ]
          }
        },
        labelsVisible:true,
        labelingInfo:[
          {
            labelPlacement: "above-center",
            symbol:{
              type:'label-3d',
              verticalOffset: {
                screenLength: 8000,
                maxWorldLength: 10000,
                minWorldLength: 30
              },
              callout:{
                type:'line',
                size:1,
                color:[255,255,255],
                
              },
              symbolLayers:[
                {
                  type:'text',
                  material:{
                    color:[255,255,255,1]
                  },
                  size:12,
                  text:"晋绥片区"
                }
              ]
            },
            labelExpressionInfo:{
              expression:"$feature.title"
            }
          }
        ]
      })
      window.view.map.add(layer);
    },
    drawJJYOutline() {
      const geojson = require('../../public/json/晋冀豫片区_outline.json');
      const coords = geojson.features[0].geometry.coordinates;
      const rings = [];
      coords.forEach(item => {
        rings.push(item.reverse())
      })
      console.log(rings)
      const graphic = new Graphic({
        attributes:{
          OBJECTID:"",
          name:"晋冀豫片区_山西",
          title:"晋冀豫片区",
          inShanxi:true,
        },
        geometry:{
          type:"polygon",
          rings:rings
        }
      })
      const layer = new FeatureLayer({
        source:[graphic],
        title:"晋冀豫片区_山西",
        objectIdField:"OBJECTID",
        fields:[
          {name:"title",type:'string'}
        ],
        outFields:["*"],
        renderer:{
          type:"simple",
          symbol:{
            type:"polygon-3d",
            symbolLayers:[
            {
              type:"fill",
              material: { color: [249,221,74,0.3] },
              outline: { color: [249,221,74] },
              // type:'extrude',
              // size:3000,
              // material: { color: [218,175,99,0.3] },
              // edges:{
              //   type:'solid',
              //   color:[218,175,99,0.8],
              //   size:2
              // } 
            }
          ]
          }
        },
        labelsVisible:true,
        labelingInfo:[
          {
            labelPlacement: "above-center",
            symbol:{
              type:'label-3d',
              verticalOffset: {
                screenLength: 8000,
                maxWorldLength: 10000,
                minWorldLength: 30
              },
              callout:{
                type:'line',
                size:1,
                color:[255,255,255],
                
              },
              symbolLayers:[
                {
                  type:'text',
                  material:{
                    color:[255,255,255,1]
                  },
                  size:12,
                  text:"晋绥片区"
                }
              ]
            },
            labelExpressionInfo:{
              expression:"$feature.title"
            }
          }
        ]
      })
      window.view.map.add(layer);
    },
    drawJSOuterArea() {
      const geojson = require('../../public/json/晋绥片区_outer_outline.json')
      const coords = geojson.features[0].geometry.coordinates;
      const rings = [];
      coords.forEach(item => {
        rings.push(item.reverse())
      })
      const graphic = new Graphic({
        attributes:{
          OBJECTID:"",
          name:"晋绥片区_outer",
          title:"晋绥片区",
          inShanxi:0,
        },
        geometry:{
          type:"polygon",
          rings:rings
        }
      })
      const layer = new FeatureLayer({
        source:[graphic],
        title:"晋绥片区-外省",
        objectIdField:"OBJECTID",
        fields:[
          {name:'title',type:'string'},
          {name:'inShanxi',type:'integer'}
        ],
        renderer:{
          type:'simple',
          symbol:{
            type:'polygon-3d',
            symbolLayers:[
              {
                type:"fill",
                material: { color: [255,0,0,0.3] },
                outline: { color: [255,0,0,0] },
              }
            ]
          }
          
        },
      })
      layer.queryFeatures().then(res => {
        console.log(res)
      })
      window.view.map.add(layer)

    },
    drawJCJOuterArea() {
      const geojson = require('../../public/json/晋察冀片区_outer_outline.json')
      const coords = geojson.features[0].geometry.coordinates;
      const rings = [];
      coords.forEach(item => {
        rings.push(item)
      })
      const graphic = new Graphic({
        attributes:{
          OBJECTID:"",
          name:"晋察冀片区_outer",
          title:"晋察冀片区",
          inShanxi:0,
        },
        geometry:{
          type:"polygon",
          rings:rings
        }
      })
      const layer = new FeatureLayer({
        source:[graphic],
        title:"晋察冀片区-外省",
        objectIdField:"OBJECTID",
        fields:[
          {name:'title',type:'string'},
          {name:'inShanxi',type:'integer'}
        ],
        renderer:{
          type:'simple',
          symbol:{
            type:'polygon-3d',
            symbolLayers:[
              {
                type:"fill",
                material: { color: [218,175,99,0.3] },
                outline: { color: [218,175,99,0] },
              }
            ]
          }
          
        },
      })
      window.view.map.add(layer)
    },
    drawJJYOuterArea() {
      const geojson = require('../../public/json/晋冀豫片区_outer_outline.json')
      const coords = geojson.features[0].geometry.coordinates;
      let rings = [];
      coords.forEach(item => {
        console.log(item)
        rings.push(item[0].reverse())
        // rings = rings.concat(...item)
      })
      console.log(rings)
      const graphic = new Graphic({
        attributes:{
          OBJECTID:"",
          name:"晋冀豫片区_outer",
          title:"晋冀豫片区",
          inShanxi:0,
        },
        geometry:{
          type:"polygon",
          rings:rings
        }
      })
      const layer = new FeatureLayer({
        source:[graphic],
        title:"晋冀豫片区-外省",
        objectIdField:"OBJECTID",
        fields:[
          {name:'title',type:'string'},
          {name:'inShanxi',type:'integer'}
        ],
        renderer:{
          type:'simple',
          symbol:{
            type:'polygon-3d',
            symbolLayers:[
              {
                type:"fill",
                material: { color: [249,221,74,0.3] },
                outline: { color: [249,221,74,0] },
              }
            ]
          }
          
        },
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
#panel .active {
  opacity: 1;
  background-color: #99ccff;
}

#panel .inactive {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
<style scoped>
#arcgis-map {
  height: 100%;
}
.info-panel {
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  display: fixed;
  top: 20px;
  left: 20px;
}

#panel {
  background-color: rgba(0, 0, 0, 0.3);
  position: fixed;
  right: 0;
  top: 0;
  height: 100%;
  width: 250px;
  font-size: 12px;
}

.title {
  font-weight: bold;
  color: #0079c1;
}

.container {
  background-color: rgba(0, 0, 0, 0.3);
  color: #fff;
  margin: 10px;
  padding: 5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
}

.event,
.property {
  transition: background-color 0.5s ease-out;
  padding-bottom: 2px;
  opacity: 0.2;
}
</style>