<!--
 * @Author: your name
 * @Date: 2021-05-18 16:57:32
 * @LastEditTime: 2021-05-18 17:18:41
 * @LastEditors: Please set LastEditors
 * @Description: mapboxgl 绘制热力图
 * @FilePath: /hello-vue3/src/components/mapbox/Heatmap.vue
-->
<template>
  <div id="map" class="map-wrapper"></div>
</template>

<script>
import { GetCityOrgPointsReq } from "@/assets/request/ztbr.js";
const mapboxgl = window.mapboxgl;
export default {
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
      GetCityOrgPointsReq(params)
        .then((res) => {
          console.log(res);
          const data = res.data.data;
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
          this.drawHeatmap(geojson)
        })
        .catch((err) => {
          console.log(err);
        });
    },
    drawHeatmap(data) {
        const map = window.Mapbox;
        map.addSource('heatmapSource',data);
        map.addLayer({
            id:"heatmap_layer",
            type:"heatmap",
            source:'heatmapSource',
            // maxzoom:9,
            paint:{
                'heatmap-opacity':0.8
            //     'heatmap-intensity':[
            //         'interpolate',
            //         ['linear'],
            //         ['zoom'],
            //         0,
            //         1,
            //         9,
            //         3
            //     ],
            //     'heatmap-color':[
            //         'interpolate',
            //         ['linear'],
            //         0,
            //         'rgba(33,102,172,0)',
            //         0.2,
            //         'rgb(103,169,207)',
            //         0.4,
            //         'rgb(209,229,240)',
            //         0.6,
            //         'rgb(253,219,199)',
            //         0.8,
            //         'rgb(239,138,98)',
            //         1,
            //         'rgb(178,24,43)'
            //     ]
            }
        })
    },
  },
  mounted() {
      this.initMap();
  }
};
</script>

<style>
.map-wrapper {
  width: 100%;
  height: 100%;
}
</style>