<template>
  <div id="map"></div>
</template>

<script>
import Map from "ol/Map";
import View from 'ol/View.js';
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import TileLayer from 'ol/layer/Tile';
import 'ol/ol.css';
import XYZ from 'ol/source/XYZ.js';
import {Raster as RasterSource} from 'ol/source';
import ImageLayer from 'ol/layer/Image';
export default {
  data() {
    return {

    }
  },
  methods: {
    initMap() {
      const layerOrigin = new TileLayer({
        source: new XYZ({
          name: '天地图',
          url: '/tiandi/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=8acb7e97c9233926e7ed9a0bc5ee58dc'
        })
      })

        //定义颜色转换方法 https://openlayers.org/en/latest/examples/color-manipulation.html
      let reverseFunc = function (pixelsTemp) {
            //蓝色
            for (var i = 0; i < pixelsTemp.length; i += 4) {
                var r = pixelsTemp[i];
                var g = pixelsTemp[i + 1];
                var b = pixelsTemp[i + 2];
                //运用图像学公式，设置灰度值
                var grey = r * 0.3 + g * 0.59 + b * 0.11;
                //将rgb的值替换为灰度值
                pixelsTemp[i] = grey;
                pixelsTemp[i + 1] = grey;
                pixelsTemp[i + 2] = grey;

                //基于灰色，设置为蓝色，这几个数值是我自己试出来的，可以根据需求调整
                pixelsTemp[i] = 55 - pixelsTemp[i];
                pixelsTemp[i + 1] = 255 - pixelsTemp[i + 1];
                pixelsTemp[i + 2] = 305 - pixelsTemp[i + 2];
            }
        };
      //openlayer 像素转换类，可以直接当做source使用
      const raster = new RasterSource({
          sources: [
              //传入图层，这里是天地图矢量图或者天地图矢量注记
              layerOrigin,
          ],
          //这里设置为image类型，与官方示例不同，优化速度
          operationType: 'image',
          operation: function (pixels, data) {
            console.log(pixels)
              //执行颜色转换方法，注意，这里的方法需要使用lib引入进来才可以使用
              reverseFunc(pixels[0].data)
              return pixels[0];
          },
          //线程数量
          threads: 10,
          //允许operation使用外部方法
          lib: {
              reverseFunc: reverseFunc,
          }
      });
      //创建新图层，注意，必须使用 ImageLayer
      let layer = new ImageLayer({
          name: "天地图矢量图层",
          source: raster
      });
      const map = new Map({
        layers: [
         layer,
        // layerOrigin,
          // 天地图标注
          new TileLayer({
            source: new XYZ({
              url: '/tiandi/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=706ff36784f0e19742fc835cdf760770'
            })
          }),
        ],
        target: 'map',
        view: new View({
          center: [120.752481, 31.654376],
          zoom: 13.5,
          projection: 'EPSG:4326',
          minZoom: 12,
          maxZoom: 18
        })
      })
    }
  },
  mounted(){
    this.initMap()
  }
}
</script>
<style scoped>
#map {
  height: 100%;
}
</style>
<style>
/* @import 'ol.css'; */
</style>