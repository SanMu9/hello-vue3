<!--
 * @Author: your name
 * @Date: 2021-05-24 14:49:47
 * @LastEditTime: 2021-05-24 14:58:23
 * @LastEditors: Please set LastEditors
 * @Description: mapboxgl 基础模版
 * @FilePath: /hello-vue3/src/components/mapbox/Template.vue
-->
<template>
  <div id="map" class="map-wrapper"></div>
</template>

<script>
const mapboxgl = window.mapboxgl;
export default {
    data() {
        return 
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
            map.on("load",  ()=>{
                console.log('mapload')
            });
        },
    },
    mounted() {
        this.initMap();
    },
}
</script>

<style scoped>
.map-wrapper {
  width: 100%;
  height: 100%;
}
</style>