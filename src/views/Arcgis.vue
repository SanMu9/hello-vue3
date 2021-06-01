<!--
 * @Author: your name
 * @Date: 2021-05-13 15:58:37
 * @LastEditTime: 2021-05-28 16:03:51
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
    <div v-if="popupShow" class="popup">
      <area-info-popup :info="info"></area-info-popup>
    </div>
  </teleport>
</template>

<script>
// arcgis 
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
import {GetPointsListReq} from '@/assets/request/shanxi.js';

import { ShanXiGeoJson } from "@/assets/js/argisPublicValue.js";
import AreaInfoPopup from '../components/arcgis/AreaInfoPopup.vue';
export default {
  components:{
    AreaInfoPopup
  },
  data() {
    return {
      infoPanelShow: false,
      popupShow:false,
      popupInfo:{
        'js':{
          title:"晋绥片区",
          content:[
            "晋绥，即晋绥边区，是抗日战争时期中国共产党领导、八路军120师主力创建的以大青山为依托的抗日根据地，辖绥西、绥南、绥中三区，包括今山西省和内蒙古自治区内东起平绥路、同蒲路，西至黄河，南迄汾(阳)离(石)公路，北达绥远之包头、百灵庙、武川、陶林等广大地区，是在陕甘宁边区门户上竖起一道钢铁屏障，迫使日军始终未能越过黄河，坚强保卫了延安和党中央。",
            "晋绥，晋即今山西省；绥指绥远省，为1928年改名的旧省级行政区，简称“绥”，省会为归绥(今呼和浩特市)，1954年废设，并入内蒙古自治区。",
            "山西省纳入晋绥片区的共45个县（市、区）：吕梁市离石区、兴县、岚县、临县、柳林县、孝义市、汾阳市、交城县、石楼县、方山县、中阳县、交口县；大同市平城区、云冈区、新荣区；朔州市朔城区、平鲁区、右玉县；宁武县、静乐县、神池县、五寨县、岢岚县、河曲县、保德县、偏关县、原平市；太原市晋源区、清徐县、娄烦县、古交市；平遥县、灵石县、介休市；襄汾县、吉县、乡宁县、大宁县、隰县、汾西县；河津市、临猗县、万荣县、永济市、芮城县。"
          ]
        },
        'jcj':{
          title:'晋察冀片区',
          content:[
            '晋察冀，即晋察冀边区，是抗日战争时期中国共产党领导、八路军115师主力创建的敌后抗日根据地，包括今山西省、河北省和内蒙古自治区内同蒲路以东，津浦路以西，正太、石德路以北，张家口、承德以南等广大地区，是中国抗战的第一个重要根据地、后勤给养地，中共中央和毛泽东誉之为“敌后模范的抗日根据地及统一战线的模范区”，为抗日战争胜利做出了重要贡献。',
            '晋察冀，晋即今山西省，冀即今河北省；察指察哈尔省，为1912年设的旧省级行政区，简称“察”，省会为张北（今张家口市），1952年废设，分别划归山西省、河北省、内蒙古自治区等。',
            '山西省纳入晋察冀片区的共14个县（市、区）：五台县、繁峙县、定襄县、代县、应县、原平市；大同市云州区、灵丘县、广灵县、天镇县、浑源县；盂县；寿阳县；阳曲县。'
          ]
        },
        'jjy':{
          title:'晋冀豫片区',
          content:[
            '晋冀豫，即晋冀豫边区，是抗日战争时期中国共产党领导、八路军129师主力创建的以太行山为依托的抗日根据地，辖太行、太岳、冀南三区，包括今山西省、河北省、河南省内西起同蒲铁路，东至平汉铁路，北接正太铁路，南临黄河北岸等广大地区，是中共中央北方局和八路军总部机关所在地晋冀鲁豫抗日根据地的重要组成部分。',
            '山西省纳入晋冀豫片区的共54个县（市、区）：长治市潞州区、上党区、屯留区、潞城区、武乡县、黎城县、襄垣县、平顺县、壶关县、长子县、沁县、沁源县；晋城市城区、沁水县、阳城县、陵川县、泽州县、高平市；晋中市的榆次区、左权县、和顺县、榆社县、昔阳县、寿阳县、太谷县、祁县、平遥县、灵石县、介休市；清徐县；平定县；曲沃县、翼城县、襄汾县、洪洞县、古县、安泽县、浮山县、乡宁县、蒲县、汾西县、侯马市、霍州市；临猗县、万荣县、闻喜县、稷山县、新绛县、绛县、垣曲县、夏县、永济市、平陆县、芮城县。'
          ]
        }
        
      },
      info:{
        title:"晋绥片区",
        content:[
          "晋绥，即晋绥边区，是抗日战争时期中国共产党领导、八路军120师主力创建的以大青山为依托的抗日根据地，辖绥西、绥南、绥中三区，包括今山西省和内蒙古自治区内东起平绥路、同蒲路，西至黄河，南迄汾(阳)离(石)公路，北达绥远之包头、百灵庙、武川、陶林等广大地区，是在陕甘宁边区门户上竖起一道钢铁屏障，迫使日军始终未能越过黄河，坚强保卫了延安和党中央。",
          "晋绥，晋即今山西省；绥指绥远省，为1928年改名的旧省级行政区，简称“绥”，省会为归绥(今呼和浩特市)，1954年废设，并入内蒙古自治区。",
          "山西省纳入晋绥片区的共45个县（市、区）：吕梁市离石区、兴县、岚县、临县、柳林县、孝义市、汾阳市、交城县、石楼县、方山县、中阳县、交口县；大同市平城区、云冈区、新荣区；朔州市朔城区、平鲁区、右玉县；宁武县、静乐县、神池县、五寨县、岢岚县、河曲县、保德县、偏关县、原平市；太原市晋源区、清徐县、娄烦县、古交市；平遥县、灵石县、介休市；襄汾县、吉县、乡宁县、大宁县、隰县、汾西县；河津市、临猗县、万荣县、永济市、芮城县。"
        ]
      },
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

      view.when(()=>{
        this.goToCamera('shanXiOutline').then(() => {
          this.drawoShanXiOutline();
          // this.drawPointsCluster();
        })
      })

      // setTimeout(()=>{
      //     this.goToCamera('shanXiOutline').then(()=>{
      //     this.drawoShanXiOutline();
      //     this.showArcgisInfo();
      //     window.view.goTo({
      //       position: {
      //         longitude:112.5078,
      //         latitude:35.9879,
      //         z:5119.7153
      //       },
      //       heading: 346.6963,
      //       tilt: 66.2351,
      //     }, {
      //       speedFactor: 0.5,
      //       duration: 2000,
      //     }).then(()=>{
      //       window.view.goTo({
      //         position:{
      //           longitude:112.4906,
      //           latitude:36.1521,
      //           z:3753.1139
      //         },
      //         heading: 345.0575,
      //         tilt: 75.6222,
      //       },{
      //         duration:10000,
      //         speedFactor: 0.5,

      //       })
      //     });
      //   })
      // },1000)
      
      // return;

      // setTimeout(() => {
      //   this.goToCamera("JSArea").then(() => {

      //     const jsLayer = this.drawJSOutline();
      //     this.drawJSOuterArea();
      //     setTimeout(()=>{
      //       this.goToCamera("JCJArea").then(()=>{
      //         const jcjLayer = this.drawJCJOutline();
      //         this.drawJCJOuterArea();

      //         setTimeout(()=>{
      //           this.goToCamera("JJYArea").then(()=>{
      //             const jjyLayer = this.drawJJYOutline();
      //             this.drawJJYOuterArea();
      //             setTimeout(()=>{
      //               this.goToCamera("shanXiOutline").then(()=>{
      //                 this.drawoShanXiOutline();

      //                 setTimeout(()=>{

      //                   this.goToCamera('JSArea').then(()=>{
      //                     this.info = this.popupInfo['js']
      //                     this.popupShow = true;
      //                     this.highlightArea(jsLayer,[255,0,0])

      //                     setTimeout(()=>{
      //                       this.popupShow = false;
      //                       this.unhighligheArea(jsLayer,[255,0,0])
      //                       this.goToCamera('JCJArea').then(()=>{
      //                         this.info = this.popupInfo['jcj']
      //                         this.popupShow = true;
      //                         this.highlightArea(jcjLayer,[218,175,99])

      //                         setTimeout(()=>{
      //                           this.popupShow = false;
      //                           this.unhighligheArea(jcjLayer,[218,175,99])
      //                           this.goToCamera('JJYArea').then(()=>{
      //                             this.info = this.popupInfo['jjy'];
      //                             this.popupShow = true;
      //                             this.highlightArea(jjyLayer,[249,221,74])
      //                           })

      //                         },2000)
      //                       })

      //                     },2000)
      //                   })
      //                 },2000)

      //               })
      //             },1000)

      //          })
      //         },1000)
            
      //       })
      //     },1000)
          

          
          
      //     view.on('click',function(event){
      //       view.hitTest(event).then(res => {
      //         console.log(res)
      //       })
      //     })
      //   });
      // }, 1500);

    },

    /**
     * @description: 自动显示片区和其介绍
     * @param {*}
     * @return {*}
     */    
    areaShowAutoplay(){

    },

    /**
     * @description: 绘制景点聚合点
     * @param {*}
     * @return {*}
     */    
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
          // outFields:['id','city','level','name','district'],

          // ! Point clustering only applies to layers with Point geometries in a MapView 
         // featureReduction:{
          //   type: "cluster",
          //   clusterRadius: '10px',
          //   clusterMinSize: "24px",
          //   clusterMaxSize: "60px",
          //   labelingInfo: [{
          //     deconflictionStrategy: "none",
          //     labelExpressionInfo: {
          //       expression: "$feature.cluster_count"
          //     },
          //     symbol: {
          //       type: "text",
          //       color: "#004a5d",
          //       font: {
          //         weight: "bold",
          //         family: "Noto Sans",
          //         size: "12px"
          //       }
          //     },
          //     labelPlacement: "center-center",
          //   }]
          // },
          renderer:{
            type:"simple",
            // field:'name',
            symbol: {
              type: "simple-marker",
              size: 4,
              color: "#69dcff",
              outline: {
                color: "rgba(0, 139, 174, 0.5)",
                width: 5
              }
            }
            
          }
        })
        window.view.map.add(layer)
      })
    },

    goToCamera(type) {
      const camera = this.cameraInfo[type];
      let cam = new Camera(camera);
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

    /**
     * @description: 
     * @param {*} layer arcgis layer实例对象
     * @param {*} colorArr 颜色值数组 [255,255,255]
     * @return {*}
     */    
    highlightArea(layer,colorArr){
      layer.renderer = {
        type:'simple',
        symbol:{
          type:'polygon-3d',
          symbolLayers:[
            {
              // type:"fill",
              // material: { color: [255,0,0,0.3] },
              // outline: { color: "red" },
              type:'extrude',
              size:10000,
              material: { color: [...colorArr,0.8] },
              edges:{
                type:'solid',
                color:[...colorArr,0.8],
                size:2
              }

            }
          ]
        }
      }
    },
    unhighligheArea(layer,colorArr){
      layer.renderer = {
        type:'simple',
        symbol:{
          type:'polygon-3d',
          symbolLayers:[
            {
              type:"fill",
              material: { color: [...colorArr,0.3] },
              outline: { color: [...colorArr] },
            }
          ]
        }
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
      return layer;
      
    },
    drawJCJOutline() {
      const geojson = require('../../public/json/晋察冀片区_outline.json');
      const coords = geojson.features[0].geometry.coordinates;
      const rings = [];
      coords.forEach(item => {
        rings.push(item[0].reverse())
      })
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
      return layer;
    },
    drawJJYOutline() {
      const geojson = require('../../public/json/晋冀豫片区_outline.json');
      const coords = geojson.features[0].geometry.coordinates;
      const rings = [];
      coords.forEach(item => {
        rings.push(item.reverse())
      })
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
      return layer;
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
        rings.push(item[0].reverse())
        // rings = rings.concat(...item)
      })
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
.esri-ui .esri-attribution{
  display: none;
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
.popup{
  position: fixed;
  top: 50%;
  right: 20px;
  transform: translate(0,-50%);
  animation: fadeIn 1.5s forwards;
}
@keyframes fadeIn {
  0%{
    transform: translate(100%,-50%);
    top: 50%;
    opacity: 0;
  }
  100%{
    top: 50%;
    transform: translate(0,-50%);
  }
}
</style>