<!--
 * @Author: your name
 * @Date: 2021-05-24 14:45:39
 * @LastEditTime: 2021-05-24 17:54:22
 * @LastEditors: Please set LastEditors
 * @Description: 3D buildings mapboxgl
 * @FilePath: /hello-vue3/src/components/mapbox/Buildings.vue
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
                zoom: 15.5,
                center: [116.40903192, 39.92957568],
                pitch: 0,
                bearing: 0,
                style: "mapbox://styles/mapbox/dark-v10",
            });
            window.Mapbox = map;
            map.on("load",  ()=>{
                console.log('mapload')
                this.createBuildingsLayer();
                this.drawMap();

                console.log(map.getSource('source_region'))
                console.log(map.getLayer('layer_region'))
                map.on('click',function(ev){
                    var features = map.queryRenderedFeatures(ev.point);
                    console.log(features)
                })
                // console.log(map.queryRenderedFeatures({layers:['buildings-layer']}))
            });
        },
        createBuildingsLayer() {
            const map = window.Mapbox;
            map.addLayer({
                id:"buildings-layer",
                source:'composite',
                'source-layer':'building',
                'filter': ['==', 'extrude', 'true'],
                'type': 'fill-extrusion',
                'minzoom': 15,
                'paint': {
                    'fill-extrusion-color': 'blue',

                    // Use an 'interpolate' expression to
                    // add a smooth transition effect to
                    // the buildings as the user zooms in.
                    'fill-extrusion-height': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        15,
                        0,
                        15.05,
                        ['get', 'height']
                    ],
                    'fill-extrusion-base': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        15,
                        0,
                        15.05,
                        ['get', 'min_height']
                    ],
                    'fill-extrusion-opacity': 0.6,
                    'fill-extrusion-vertical-gradient':true
                }
            })
            console.log(map.getSource('composite'))
        },
        drawMap(name){
            const map = window.Mapbox;
            this.currentRegionName = name;
            const str = "116.40641152,39.92434743;116.41036415,39.92436248;116.41088036,39.92432633;116.41080968,39.92733420;116.40916568,39.92732214;116.40903192,39.92957568;116.40882626,39.93337401;116.40690430,39.93347081;116.40591167,39.93347373;116.40594754,39.93260956;116.40610851,39.92920805;116.40641152,39.92434743";
            const coords = str.split(';').map(item=>{
                const arr = item.split(',');
                return [parseFloat(arr[0]),parseFloat(arr[1])]
            });
            const geojson = {
                type: "FeatureCollection",
                    features: [
                        {
                            type: "Feature",
                            properties: {},
                            geometry: {
                                type:"Polygon",
                                coordinates: [coords],
                            },
                        },
                    ]
                };
            

            console.log(geojson)
            map.addSource('source_region',{
                type:'geojson',
                data:geojson
            })
            
        
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
