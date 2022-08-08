<template>
  <div id="map"></div>
</template>

<script>
import Map from "ol/Map";
import View from 'ol/View.js';
import VectorSource from "ol/source/Vector";
import GeoJSON from 'ol/format/GeoJSON';

import VectorLayer from "ol/layer/Vector";
import TileLayer from 'ol/layer/Tile';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import 'ol/ol.css';
import XYZ from 'ol/source/XYZ.js';
import {Raster as RasterSource} from 'ol/source';
import ImageLayer from 'ol/layer/Image';
import Projection from 'ol/proj/Projection';
import {get} from 'ol/proj'
const NBGeoJson = require('/public/json/宁波市.json')
export default {
  data() {
    return {}
  },
  methods:{
    initMap(){
      console.log(NBGeoJson)

      const vectorSource = new VectorSource({
        // url:'/public/json/宁波市.geojson',
        features:new GeoJSON().readFeatures(NBGeoJson),
      })
      const layer = new VectorLayer({
          source: vectorSource,
          style: new Style({
              fill: new Fill({
                  color: 'rgba(6, 47, 103, 0.7)',
              }),
              stroke: new Stroke({
                  color: '#2EA4F4',
                  width: 3,
              }),
              image: new CircleStyle({
                  radius: 7,
                  fill: new Fill({
                      color: '#ffcc33',
                  }),
              }),
          }),
      })
      let map = new Map({
          target: 'map',
          layers: [
              new TileLayer({
                  title: "天地图卫星影像",
                  source: new XYZ({
                      url: "http://t7.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=926da4893299639547a460a3202028ad"
                  })
              }),
              new TileLayer({
                  source: new XYZ({
                      title: "天地图文字标注1",
                      url: "http://t7.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=926da4893299639547a460a3202028ad"
                  })
              }),
              layer

          ],
          view: new View({
              center: [121.34951529441747,29.80807136573414],
              projection: 'EPSG:4326',
              // center: ol.proj.transform([117.2465980052948, 29.286389535399945],'EPSG:4326',"EPSG:3857"),
              zoom: 9,
              maxZoom: 18,
          }),
      });

      // 鼠标事件
      const selectStyle = new Style({
        fill: new Fill({
          color: '#2D8AFA',
        }),
        stroke: new Stroke({
          color: '#2EA4F4',
          width: 2,
        }),
      });
      const normalStyle = new Style({
          fill: new Fill({
              color: 'rgba(6, 47, 103, 0.7)',
          }),
          stroke: new Stroke({
              color: '#2EA4F4',
              width: 3,
          }),
          image: new CircleStyle({
              radius: 7,
              fill: new Fill({
                  color: '#ffcc33',
              }),
          }),
      });
      map.on('click',function(ev){
        console.log('当前中心点:',map.getView().getCenter())
        console.log('当前zoom:',map.getView().getZoom())
        console.log(ev)
      })

      let areaSelected = null
      map.on('pointermove',function(ev){
        if(map.hasFeatureAtPixel(ev.pixel)){
          let features = map.getFeaturesAtPixel(ev.pixel)
          // console.log(features)
          for(let i=0;i<features.length;i++){
            const feature = features[i]
            if(feature.get('level')){
              if(areaSelected){
                areaSelected.setStyle(normalStyle)
              }
              feature.setStyle(selectStyle)
              areaSelected = feature
              break
            }
          }
        }
      })
    }
  },
  mounted() {
    this.initMap()
  }
}
</script>
<style scoped>
#map {
  height: 100%;
}
</style>