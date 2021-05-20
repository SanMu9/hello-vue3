<!--
 * @Author: your name
 * @Date: 2021-05-18 18:10:46
 * @LastEditTime: 2021-05-19 13:45:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /hello-vue3/src/components/mapbox/Polygon.vue
-->
<template>
  <div id="map" class="map-wrapper"></div>
</template>

<script>
const mapboxgl = window.mapboxgl;
export default {
    data() {
        return {
           currentRegionName:"北京市",
           regionCamera:{
             "北京市":{
               center:[116.49280249064753,40.15046423844018],
               zoom:7.5,
             },
             "西城区":{
               center:[116.36457330194537,39.90972256752556],
               zoom:11.5,
             },
             "东城区":{
               center:[116.41650530509145,39.909730982644845],
               zoom:11.5,
             },
             "丰台区":{
               center:[116.25816396713805,39.84712255604154],
               zoom:10,
             },
             "石景山区":{
               center:[116.1661676452402,39.933336524355184],
               zoom:11,
             },
             "海淀区":{
               center:[116.25186046949602,40.01508209703769],
               zoom:10,
             },
             "朝阳区":{
               center:[116.52202344718927,39.94530783147576],
               zoom:10,
             },
             "顺义区":{
               center:[116.7180386847408,40.14622299884712],
               zoom:10,
             },
             "昌平区":{
               center:[116.20900718336378,40.22514641639893],
               zoom:9.5,
             },
             "门头沟区":{
               center:[115.81416871612873,39.99871870750047],
               zoom:9,
             },
             "房山区":{
               center:[115.81416871612873,39.99871870750047],
               zoom:9,
             },
             "大兴区":{
               center:[116.42365581740665,39.64408282504772],
               zoom:10,
             },
             "通州区":{
               center:[116.74984959964479,39.7910714047722],
               zoom:10,
             },
             "怀柔区":{
               center:[116.62574715272888,40.63758560663837],
               zoom:9,
             },
             "延庆区":{
               center:[116.15833726326997,40.514122218749264],
               zoom:9,
             },
             "密云区":{
               center:[116.9659530682485,40.51081679969346],
               zoom:9,
             },
             "平谷区":{
               center:[117.1487514093347,40.2027942839417],
               zoom:10,
             },
           }
        }
    },
    methods:{
      initMap() {
        mapboxgl.accessToken = "pk.eyJ1Ijoic2FubXU5IiwiYSI6ImNrbzE3MnZkajBtb24yeG9ibmxjMHE1ZDYifQ.9mVkYRsx-tj0MZeMowE3MA";
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
          _this.drawMap('北京市')
        });
        map.on('zoomend',function(ev){
          console.log(ev.target.getZoom())
        })
      },
      drawMap(name){
        const map = window.Mapbox;
        this.currentRegionName = name;
        let geojson = require('../../../public/json/'+name+'.json');

        if(!map.getSource('source_region')){
          console.log(geojson)
          map.addSource('source_region',{
            type:'geojson',
            data:geojson
          })
        }else {
          map.getSource('source_region').setData(geojson)
        }
        if(!map.getLayer('layer_region')){
          map.addLayer({
            id:"layer_region",
            type:'fill',
            source:'source_region',
            paint:{
              'fill-color':"blue",
              'fill-opacity':0.3,
              'fill-outline-color':'#ffffff'
            }
          });
          const _this = this;
          map.on('click','layer_region',function(e){
            console.log(e.lngLat.lng+','+e.lngLat.lat)
            const name = e.features[0].properties.name;
            console.log(name);
            if(_this.currentRegionName === name){
              _this.drawMap('北京市')
            }else {
              _this.drawMap(name)
            }
          })
        }
        map.flyTo(this.regionCamera[name])
      }
    },
    mounted() {
      this.initMap();
    }
}
</script>

<style scoped>
.map-wrapper {
  width: 100%;
  height: 100%;
}
</style>
