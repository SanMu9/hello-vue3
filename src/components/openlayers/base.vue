<template>
    <div class="map" id="map"></div>
    <div class="display">
        <p>中心点：{{lnglat.join(',')}}</p>
        <p>缩放级别：{{zoom}}</p>

    </div>
</template>

<script>
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector'
import XYZ from 'ol/source/XYZ';
import OSM from 'ol/source/OSM'
import TileArcGISRest from 'ol/source/TileArcGISRest'
import TileWMS from 'ol/source/TileWMS'
import {Icon, Style} from 'ol/style';
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';
import 'ol/ol.css';
import VectorSource from 'ol/source/Vector';
// import gifler from 'gifler'
import Overlay from 'ol/Overlay';
import { fromLonLat } from "ol/proj";
export default {
    data(){
        return {
            lnglat:[0,0],
            zoom:2
        }
    },
    methods:{
        initMap(){
            const mapDom = document.getElementById('map')
            const baseMap = new Map({
                target: 'map',
                layers: [
                    // new TileLayer({
                    //     source: new XYZ({
                    //         url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    //     })
                    // }),
                    // new TileLayer({
                    //     source: new OSM()
                    // }),
                    new TileLayer({
                        source: new XYZ({
                        // url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                        url: 'http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=8bfada5703c95699d1e4ab3ce48a26ed'
                        })
                    }),
                    new TileLayer({
                        source: new XYZ({
                        // url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                        url: 'http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=8bfada5703c95699d1e4ab3ce48a26ed'
                        })
                    }),
                    new TileLayer({
                        source: new TileWMS({
                            url:'http://10.10.10.231:6080/arcgis/services/mingxiaoling/mingxiaoling/MapServer/WMSServer',
                            params:{
                                
                                LAYERS:'0,1,2,3,4,5,6,8,9,10,11,12,13,14,15'
                            }
                        })
                    })
                ],
                view: new View({
                    center: [118.84637863560364,32.06483473828754],
                    zoom: 14,
                    projection:"EPSG:4326"
                })
            })
            console.log(baseMap)
            const _this = this
            baseMap.on('moveend',function(ev){
                console.log(ev)
                _this.lnglat = baseMap.getView().getCenter()
                _this.zoom = baseMap.getView().getZoom()
                // console.log(baseMap.getView().getCenter())
                // console.log(baseMap.getView().getCenter())
            })
            baseMap.on('singleclick',function(ev){
                console.log(ev.coordinate)
                
            })
            const img = require('@/assets/images/BJ.gif')
            const iconStyle = new Style({
                image:new Icon({
                    src:img
                })
            })
            const iconFeture = new Feature({
                geometry:new Point([118.84594042970583, 32.068014832350826]),
                name:"报警设备"
            })
            iconFeture.setStyle(iconStyle)
            const vectorSource = new VectorSource({
                features:[iconFeture]
            })
            const pointLayer = new VectorLayer({
                source:vectorSource
            })
            const pointDom = document.createElement('span')
            pointDom.id = 'ol-point-overlay'
            mapDom.appendChild(pointDom)
            const pointOverlay = new Overlay({
                position:[118.85804054512427, 32.07025347104988],
                // position:fromLonLat([118.85804054512427, 32.07025347104988]),
                positioning:'center-center',
                autoPan:true,
                className:'ol-point-overlay',
                // element:document.getElementById('ol-point-overlay')
                element:pointDom
            })
            baseMap.addLayer(pointLayer)
            baseMap.addOverlay(pointOverlay)
        }
    },
    mounted(){
        this.initMap();
        // console.log(gifler)
    },
}
</script>

<style scoped>
.map{
    width: 100%;
    height: 100%;
}
.display{
    position: fixed;
    bottom: 0;
    left: 0;
    text-align: left;
}

</style>
<style>
.ol-point-overlay{
    width: 20px;
    height: 20px;
    display: block;
    background: url('../../assets/images/BJ.gif');
    cursor: pointer;
}
</style>