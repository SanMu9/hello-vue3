<!--
 * @Author: your name
 * @Date: 2021-04-28 16:13:55
 * @LastEditTime: 2021-04-28 16:52:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \hello-vue3\src\views\MapboxDemo.vue
-->
<template>
    <div class="map-wrapper">
        <div id="map" class="map-layer"></div>
    </div>
</template>

<script>
const mapboxgl = window.mapboxgl;
export default {
    data() {},
    methods: {
        initMap() {
            mapboxgl.accessToken =
                "pk.eyJ1Ijoic2FubXU5IiwiYSI6ImNrbzE3MnZkajBtb24yeG9ibmxjMHE1ZDYifQ.9mVkYRsx-tj0MZeMowE3MA";
            const map = new mapboxgl.Map({
                container: "map",
                zoom: 13.1,
                center: [-114.34411, 32.6141],
                pitch: 85,
                bearing: 80,
                style:
                    "mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y", // style URL
            });
            window.Mapbox = map;
            map.on("load", function () {
                map.addSource("mapbox-dem", {
                    type: "raster-dem",
                    url: "mapbox://mapbox.mapbox-terrain-dem-v1",
                    tileSize: 512,
                    maxzoom: 14,
                });
                // add the DEM source as a terrain layer with exaggerated height
                map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

                // add a sky layer that will show when the map is highly pitched
                map.addLayer({
                    id: "sky",
                    type: "sky",
                    paint: {
                        "sky-type": "atmosphere",
                        "sky-atmosphere-sun": [0.0, 0.0],
                        "sky-atmosphere-sun-intensity": 15,
                    },
                });
            });
        },
    },
    created() {},

    mounted() {
        console.log(mapboxgl);
        this.initMap();
    },
};
</script>

<style scoped>
.map-wrapper {
    height: 100%;
}
.map-layer {
    width: 100%;
    height: 100%;
}
</style>