<!--
 * @Author: your name
 * @Date: 2021-05-13 15:58:37
 * @LastEditTime: 2021-05-17 17:59:35
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
          position: [112.9824, 32.8662, 1226725.3277],
          heading: 352.5302,
          tilt: 22.4034,
        },
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
        this.goToCamera("shanXiOutline").then(() => {
          this.drawoShanXiOutline();
        });
      }, 1500);
      // this.showArcgisInfo();
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
      console.log(outlinePath);
      const graphic = new Graphic({
        attributes: {
          name: "山西省轮廓",
        },
        geometry: {
          type: "polyline",
          // paths: outlinePath,
          hasM: true,
          hasZ: true,
          paths: [
            [110.761296, 34.653515, 10000],
            [111.843667, 35.072052, 10000],
          ],
        },
        // symbol: {
        //   type: "simple-line",
        //   color: [255, 255, 255],
        //   width: 4,
        // },

        // symbol: {
        //   type: "line-3d",
        //   // color: [255, 255, 255],

        //   symbolLayers: [
        //     {
        //       type: "path",
        //       profile: "quad",
        //       material: {
        //         color: [100, 100, 100],
        //       },
        //       width: 5, // the width in m
        //       height: 30, // the height in m
        //       anchor: "bottom", // the vertical anchor is set to the lowest point of the wall
        //       profileRotation: "heading",
        //     },
        //   ],
        // },
      });
      const layer = new FeatureLayer({
        source: [
          {
            attributes: {
              name: "山西省轮廓",
            },
            geometry: {
              type: "polyline",
              paths: outlinePath,
              // paths: [
              //   [110.761296, 34.653515],
              //   [111.843667, 35.072052],
              // ],
              // hasZ: true,
              // hadM: true,
            },
            // symbol: {
            //   type: "simple-line",
            //   color: [255, 255, 255],
            //   width: 5,
            // },
          },
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
              // {
              //   type: "line", // autocasts as new LineSymbol3DLayer()
              //   size: 20, // points
              //   material: { color: "#ffffff" },
              //   cap: "round",
              //   join: "round",
              // },
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
      console.log(layer.queryFeatures());
      console.log(graphic);
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
        "camera.position.z",
        "camera.tilt",
        "camera.heading",
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