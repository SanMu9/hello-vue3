<!--
 * @Author: your name
 * @Date: 2021-05-20 15:01:40
 * @LastEditTime: 2021-05-20 15:50:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /hello-vue3/src/components/mapbox/Clustor.vue
-->
<!--
 * @Author: your name
 * @Date: 2021-05-17 10:37:02
 * @LastEditTime: 2021-05-19 11:01:19
 * @LastEditors: Please set LastEditors
 * @Description: mapbox 打点
 * @FilePath: /hello-vue3/src/components/mapbox/Points.vue
-->
<template>
  <div id="map" class="map-wrapper"></div>
</template>

<script>
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
        zoom: 8,
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
          this.drawPoints3(geojson);
     
    },
    
    /**
     * @description: 绘制icon
     * @param {*} data
     * @return {*}
     */
    drawPoints3(data) {
      const map = window.Mapbox;

      map.addSource("points_source", {
          ...data,
          cluster:true,
          clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 //
      });
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
                filter:['!', ['has', 'point_count']],
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
              
              map.addLayer({
                  id:"clusters_layer",
                  type:"symbol",
                  source:'points_source',
                  filter: ['has', 'point_count'],
                  layout: {
                    "icon-image": [
                        'match',
                        ['get','is_has_station'],
                        1,
                        ['image','green_circle'],
                        ['image','red_circle'],
                    ],
                    "icon-size": [
                        'step',
                        ['get', 'point_count'],
                        1,
                        20,
                        1.5,
                        50,
                        2
                    ],
                    // 'text-color': "#ffffff",
                    'text-field': '{point_count_abbreviated}',
                },
                paint:{
                    'text-color':"#ffffff"
                }
              })
              
            //   map.addLayer({
            //     id: 'cluster-count',
            //     type: 'symbol',
            //     source: 'points_source',
            //     filter: ['has', 'point_count'],
            //     layout: {
            //         'text-field': '{point_count_abbreviated}',
            //         // 'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            //         'text-size': 12
            //     }
            // });
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
