<!--
 * @Author: your name
 * @Date: 2021-05-17 10:37:02
 * @LastEditTime: 2021-05-18 18:37:47
 * @LastEditors: Please set LastEditors
 * @Description: mapbox 打点
 * @FilePath: /hello-vue3/src/components/mapbox/Points.vue
-->
<template>
  <div id="map" class="map-wrapper"></div>
</template>

<script>
import axios from 'axios';
import { GetCityOrgPointsReq } from "@/assets/request/ztbr.js";
const mapboxgl = window.mapboxgl;
export default {
  data() {
    return {};
  },
  methods: {
    initMap() {
      mapboxgl.accessToken =
        "pk.eyJ1Ijoic2FubXU5IiwiYSI6ImNrbzE3MnZkajBtb24yeG9ibmxjMHE1ZDYifQ.9mVkYRsx-tj0MZeMowE3MA";
      const map = new mapboxgl.Map({
        container: "map",
        zoom: 6,
        center: [116.385068, 39.901329],
        pitch: 0,
        bearing: 0,
        style: "mapbox://styles/mapbox/dark-v10",
      });
      window.Mapbox = map;
      const _this = this;
      map.on("load", function () {
        _this.getCityOrgPoints();
      });
    },
    getCityOrgPoints() {
      let params = {
        duration: "daily",
        start_date: "2021-05-17",
        end_date: "2021-05-17",
        area_coding: "",
        street_coding: "",
        org_type_id: "d74a392ec02911eaa8a9000c29d3cc31",
        org_sub_type_id: "",
      };
          const data = require('../../../public/json/points.json').data;
          console.log(data)
          const features = data.map((item) => {
            return {
              type: "Feature",
              properties: {
                ...item,
              },
              geometry: {
                type: "Point",
                coordinates: [item.longitude, item.latitude],
              },
            };
          });
          const geojson = {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: features,
            },
          };
          // this.drawPoints(geojson)
          // this.drawPoints2(geojson)
          this.drawPoints3(geojson);
     
    },
    /**
     * @description: 绘制点到同一个layer 通过expression控制paint样式
     * @param {*} data
     * @return {*}
     */
    drawPoints(data) {
      console.log(data);
      const map = window.Mapbox;
      map.addSource("points_source", data);
      map.addLayer({
        id: "points_test",
        type: "circle",
        source: "points_source",
        paint: {
          "circle-color": [
            "match",
            ["get", "is_has_station"],
            0,
            "#b10e0e",
            1,
            "#0ce613",
            "#ffffff",
          ],
          "circle-opacity": 0.8,
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],

            6,
            1,
            // ['match',['get','is_has_station'],1],
            12,
            ["match", ["get", "is_has_station"], 1, 24, 10],
          ],
        },
      });
    },
    /**
     * @description: 通过filter将点绘制在不同的图层
     * @param {*} data
     * @return {*}
     */
    drawPoints2(data) {
      const map = window.Mapbox;
      map.addSource("points_source", data);
      map.addLayer({
        id: "points_1",
        type: "circle",
        source: "points_source",
        paint: {
          "circle-color": "#b10e0e",
          "circle-opacity": 0.8,
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            8,
            1,
            10,
            3,
            12,
            8,
          ],
        },
        filter: ["==", "is_has_station", 0],
      });
      map.addLayer({
        id: "points_2",
        type: "circle",
        source: "points_source",
        paint: {
          "circle-color": "#0ce613",
          "circle-opacity": 0.8,
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            8,
            1,
            10,
            5,
            12,
            20,
          ],
        },
        filter: ["==", "is_has_station", 1],
      });
    },
    /**
     * @description: 绘制icon
     * @param {*} data
     * @return {*}
     */
    drawPoints3(data) {
      const map = window.Mapbox;
      map.addSource("points_source", data);
      map.loadImage(
        require("../../../public/images/red_circle.png"),
        function (err, image) {
          map.addImage("red_circle", image);
          map.loadImage(
            require("../../../public/images/green_circle.png"),
            function (err, img) {
              map.addImage("green_circle", img);
              const layer = map.addLayer({
                id: "symbol_1",
                source: "points_source",
                type: "symbol",
                layout: {
                  "icon-image": [
                      'match',
                      ['get','is_has_station'],
                      1,
                      ['image','green_circle'],
                      ['image','red_circle'],
                  ],
                  "icon-size": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    8,
                    0.1,
                    10,
                    0.2,
                    12,
                    ['match',["get", "is_has_station"],0,0.5,0.8]
                  ],
                },
                // filter:['==','is_has_station',0]
              });
              map.on("mouseenter", "symbol_1", function () {
                map.getCanvas().style.cursor = "pointer";
              });
              map.on("mouseleave", "symbol_1", function () {
                map.getCanvas().style.cursor = "";
              });
              map.on("click", "symbol_1", function (ev) {
                console.log(ev.features[0].properties);
              });
            }
          );
        }
      );
    },
  },
  mounted() {
    this.initMap();
    console.log("!!!");
    // this.getCityOrgPoints();
  },
};
</script>

<style scoped>
.map-wrapper {
  width: 100%;
  height: 100%;
}
</style>
