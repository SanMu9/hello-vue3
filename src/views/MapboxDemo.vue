<!--
 * @Author: your name
 * @Date: 2021-04-28 16:13:55
 * @LastEditTime: 2021-05-08 15:57:58
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
import { HuangHeCoords } from "@/assets/js/publicValues.js";
const mapboxgl = window.mapboxgl;
export default {
    data() {
        return {
            animate:null,
            animateCount:0,
        }
    },
    methods: {
        initMap() {
            mapboxgl.accessToken =
                "pk.eyJ1Ijoic2FubXU5IiwiYSI6ImNrbzE3MnZkajBtb24yeG9ibmxjMHE1ZDYifQ.9mVkYRsx-tj0MZeMowE3MA";
            const map = new mapboxgl.Map({
                container: "map",
                zoom: 6,
                center: [112.987221, 37.840107],
                pitch: 0,
                bearing: 0,
                style:
                    "mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y", // style URL
            });
            window.Mapbox = map;
            const _this = this;
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

                _this.addLineSource();
                _this.drawLine();
            });
        },
        addLineSource() {
            let geojson = {
                type: "FeatureCollection",
                features: [
                    {
                        type: "Feature",
                        properties: {},
                        geometry: {
                            coordinates: HuangHeCoords,
                            type: "LineString",
                        },
                    },
                ],
            };
            const map = window.Mapbox;
            map.addSource("huanghe", {
                type: "geojson",
                lineMetrics: true,
                data: geojson,
            });
        },
        drawLine() {
            const map = window.Mapbox;
            const _this = this;
            console.log(map)
            map.loadImage(require("../../public/images/movingRiver.png"),function(err,image){
                map.addImage("huanghe_img",image)
                map.addLayer({
                    type: "line",
                    id: "huanghe",
                    source: "huanghe",
                    paint: {
                        // "line-color": "red",
                        "line-dasharray":[0,50],
                        "line-width": [
                            "interpolate",
                            ['linear'],
                            ["zoom"],
                            6,
                            13,
                            22,
                            45
                        ],
                        "line-pattern":"huanghe_img"
                        // 'line-gradient' must be specified using an expression
                        // with the special 'line-progress' property
                        // "line-gradient": [
                        //     "interpolate",
                        //     ["linear"],
                        //     ["line-progress"],
                        //     0,
                        //     "blue",
                        //     0.1,
                        //     "royalblue",
                        //     0.3,
                        //     "cyan",
                        //     0.5,
                        //     "lime",
                        //     0.7,
                        //     "yellow",
                        //     1,
                        //     "red",
                        // ],
                    },
                    layout: {
                        "line-cap": "round",
                        "line-join": "round",
                    },
                });
                console.log(map.getLayer("huanghe"))

                _this.animateHuangHe();
            })
        
        },
        animateHuangHe(){
            const map = window.Mapbox;
            console.log(this.animateCount)
            map.setPaintProperty("huanghe",'line-dasharray',[this.animateCount,0])
            if(this.animateCount===800){
                this.animateCount = 0
            }else{
                this.animateCount = this.animateCount+1;
            }

            requestAnimationFrame(this.animateHuangHe)
        }
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