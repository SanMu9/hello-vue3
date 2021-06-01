<!--
 * @Author: your name
 * @Date: 2021-05-24 14:45:39
 * @LastEditTime: 2021-05-31 15:43:39
 * @LastEditors: Please set LastEditors
 * @Description: 3D buildings mapboxgl
 * @FilePath: /hello-vue3/src/components/mapbox/Buildings.vue
-->
<template>
  <div id="map" class="map-wrapper"></div>
</template>

<script>
const mapboxgl = window.mapboxgl;
import * as turf from "@turf/turf";
import coordtransform from 'coordtransform';
export default {
    data() {
        return {}
    },
    methods: {
        initMap() {
            mapboxgl.accessToken =
                "pk.eyJ1Ijoic2FubXU5IiwiYSI6ImNrbzE3MnZkajBtb24yeG9ibmxjMHE1ZDYifQ.9mVkYRsx-tj0MZeMowE3MA";
            const map = new mapboxgl.Map({
                container: "map",
                zoom: 16,
                center: [116.4024026365147, 39.9257247164378],
                pitch: 48.9384589354883,
                bearing: -35.199999999999946,
                antialias:true,
                style: "mapbox://styles/mapbox/dark-v10",
            });
            window.Mapbox = map;
            map.on("load",  ()=>{
                console.log('mapload')
                this.createBuildingsLayer();
                this.drawMap();

                console.log(map.getSource('source_region'))
                console.log(map.getLayer('layer_region'))
                console.log(map.getSource('composite'))
                // console.log(map.queryRenderedFeatures({layers:['buildings-layer']}))
            });
            map.on('wheel',function(){
                console.log(map.getCenter())
                console.log(map.getBearing());
                console.log(map.getPitch());
                console.log(map.getZoom())
            })
        },
        createBuildingsLayer() {
            const map = window.Mapbox;
            map.addLayer({
                id:"buildings-layer",
                source:'composite',
                'source-layer':'building',
                'filter': ['==', 'extrude', 'true'],
                // 'minzoom': 12,

                'type': 'fill-extrusion',
                'paint': {
                    'fill-extrusion-color': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        'blue',
                        ['boolean', ['feature-state', 'inarea'], false],
                        'yellow',
                        'red'
                    ],

                    // Use an 'interpolate' expression to
                    // add a smooth transition effect to
                    // the buildings as the user zooms in.
                    // 'fill-extrusion-height': [
                    //     'interpolate',
                    //     ['linear'],
                    //     ['zoom'],
                    //     14,
                    //     0,
                    //     15,
                    //     ['get', 'height']
                    // ],
                     'fill-extrusion-height': ['get', 'height'],
                    // 'fill-extrusion-base': [
                    //     'interpolate',
                    //     ['linear'],
                    //     ['zoom'],
                    //     14,
                    //     0,
                    //     15.05,
                    //     ['get', 'min_height']
                    // ],
                    'fill-extrusion-base': ['get', 'min_height'],
                    'fill-extrusion-opacity': 0.6,
                    'fill-extrusion-vertical-gradient':true
                },
                // type:'fill',
                // paint:{
                //          'fill-color': [
                //         'case',
                //         ['boolean', ['feature-state', 'hover'], false],
                //         'blue',
                //         ['boolean', ['feature-state', 'inarea'], false],
                //         'yellow',
                //         'red'
                //     ],
                // }
            })
            
            let hoverId = null;
            map.on('mousemove','buildings-layer',function(ev){
                  
                if(ev.features.length > 0){
                    if(hoverId !== null){
                        map.setFeatureState({
                            source:'composite',
                            id:hoverId,
                            sourceLayer:"building",
                        },{hover:false})
                    }
                    if(ev.features[0].id){
                        hoverId = ev.features[0].id;
                        map.setFeatureState({
                            source:'composite',
                            id:hoverId,
                            sourceLayer:"building",
                        },{hover:true})
                    }

                }
            })
            map.on('mouseleave', 'buildings-layer', function () {
                if (hoverId !== null) {
                    map.setFeatureState(
                        { source: 'composite', sourceLayer:"building",id: hoverId, },
                        { hover: false }
                    );
                }
                hoverId = null;
            });
            // const {clientWidth,clientHeight} = document.body;
            // console.log(clientWidth,clientHeight)
            // map.on('wheel',function(){
            //     const features = map.queryRenderedFeatures({
            //         layers:['building']
            //     });
            //     console.log(features)
            // })
           
        },
       
        drawMap(name){
            const map = window.Mapbox;
            this.currentRegionName = name;
            // let str = '116.46165049,39.93369074;116.46162053,39.93156575;116.46159187,39.92951369;116.46156388,39.92680958;116.45968205,39.92682704;116.45953901,39.92680512;116.45681967,39.92681481;116.45655358,39.92689478;116.45553126,39.92689753;116.45498434,39.92688843;116.45207026,39.92689091;116.45063721,39.92689880;116.45029073,39.92691694;116.44995723,39.92693440;116.44634410,39.92692238;116.44373537,39.92694556;116.44370244,39.92864707;116.44370635,39.92939894;116.44370420,39.93069485;116.44369962,39.93233511;116.44369898,39.93334699;116.44372312,39.93379873;116.44374430,39.93439188;116.44375318,39.93546364;116.44375548,39.93579624;116.44374742,39.93630678;116.44372836,39.93651165;116.44373984,39.93681033;116.44374903,39.93694900;116.44377067,39.93710203;116.44379297,39.93723212;116.44382493,39.93734033;116.44386242,39.93745704;116.44395946,39.93764189;116.44405305,39.93782674;116.44419377,39.93810482;116.44428191,39.93834089;116.44441439,39.93865686;116.44447757,39.93884658;116.44450751,39.93899319;116.44452704,39.93912010;116.44452269,39.93946362;116.44447622,39.94040896;116.44444941,39.94090509;116.44449316,39.94152534;116.44452989,39.94159032;116.44463374,39.94169993;116.44473339,39.94176475;116.44483302,39.94182103;116.44555110,39.94216748;116.44590807,39.94233511;116.44605406,39.94242113;116.44616270,39.94249393;116.44625129,39.94256570;116.44631364,39.94264876;116.44638084,39.94274673;116.44642661,39.94284689;116.44659937,39.94327316;116.44684446,39.94399210;116.44699388,39.94452351;116.44704593,39.94466046;116.44710900,39.94477338;116.44717831,39.94489161;116.44722549,39.94500511;116.44722952,39.94506205;116.44744265,39.94505438;116.44765437,39.94509105;116.44795096,39.94516352;116.44873204,39.94555352;116.44909492,39.94572547;116.44943747,39.94583504;116.45007193,39.94600207;116.45051488,39.94611317;116.45199133,39.94627675;116.45417290,39.94649545;116.45667923,39.94677474;116.45924772,39.94717274;116.46165606,39.94754857;116.46166283,39.94647686;116.46167185,39.94441451;116.46165695,39.94248184;116.46166724,39.94164795;116.46165440,39.94094710;116.46163333,39.93922588;116.46163106,39.93717458;116.46165390,39.93483752;116.46165413,39.93394879;116.46165049,39.93369074';
            const str = "116.40641152,39.92434743;116.41036415,39.92436248;116.41088036,39.92432633;116.41080968,39.92733420;116.40916568,39.92732214;116.40903192,39.92957568;116.40882626,39.93337401;116.40690430,39.93347081;116.40591167,39.93347373;116.40594754,39.93260956;116.40610851,39.92920805;116.40641152,39.92434743";
            const coords = str.split(';').map(item=>{
                const arr = item.split(',');
                return coordtransform.gcj02towgs84(parseFloat(arr[0]),parseFloat(arr[1]))
            });
            let geojson = {
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
            // geojson = turf.toWgs84(geojson,{mutate:true})
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

            // console.log(map.getLayer('layer_region'))
            

                const features = map.queryRenderedFeatures({
                    layers:['building']
                });
                console.log(features)
                console.log(turf)
                const area = turf.polygon([coords]);
                const arr = [];
                features.forEach(item => {
                    const polygon = turf.polygon(item.geometry.coordinates);
                    if(turf.booleanContains(area,polygon)){
                        arr.push(item)
                        map.setFeatureState({
                            source:'composite',
                            id:item.id,
                            sourceLayer:"building",
                        },{inarea:true})
                    }
                })
                console.log(arr)
           
            
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
