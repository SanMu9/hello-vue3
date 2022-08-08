<template>
  <div class="container">
    <div id="map"></div>
    <div v-if="isCultural" class="back-btn" @click="backToNB">返回上级</div>
  </div>
</template>

<script>
import Map from "ol/Map";
import View from 'ol/View.js';
import VectorSource from "ol/source/Vector";
import GeoJSON from 'ol/format/GeoJSON';

import VectorLayer from "ol/layer/Vector";
import TileLayer from 'ol/layer/Tile';
import {Circle ,Icon, Fill, Stroke, Style, Text} from 'ol/style';
import 'ol/ol.css';
import XYZ from 'ol/source/XYZ.js';
import {Raster as RasterSource} from 'ol/source';
import ImageLayer from 'ol/layer/Image';
import Projection from 'ol/proj/Projection';
import {get} from 'ol/proj'
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';

const NBGeoJson = require('./libs/宁波市.json')
const areaImages = [
  require('./libs/blue_point.png'),
  require('./libs/yellow_point.png'),
  require('./libs/red_point.png'),
]
const culturalImages = [
  require('./libs/blue_1.png'),
  require('./libs/yellow_1.png'),
  require('./libs/red_1.png')
]
export default {
  data() {
    return {
      map:null,
      culturalLayer:null,
      geojsonLayer:null,
      areaLayer:null,
      areaData:[
        {name:'海曙区',coordinate:[121.37959580283409, 29.83679660098829],level_1:0,level_2:0,level_3:7,type:1},
        {name:'江北区',coordinate:[121.559282,29.888361],level_1:0,level_2:0,level_3:8,type:1},
        {name:'北仑区',coordinate:[121.831303,29.90944],level_1:0,level_2:0,level_3:8,type:1},
        {name:'镇海区',coordinate:[121.713162,29.952107],level_1:0,level_2:0,level_3:5,type:1},
        {name:'鄞州区',coordinate:[121.74079879538854, 29.727286308477495],level_1:0,level_2:0,level_3:5,type:1},
        {name:'奉化区',coordinate:[121.41089,29.662348],level_1:0,level_2:0,level_3:5,type:1},
        {name:'象山县',coordinate:[121.877091,29.470206],level_1:0,level_2:0,level_3:4,type:1},
        {name:'宁海县',coordinate:[121.432606,29.299836],level_1:0,level_2:0,level_3:4,type:1},
        {name:'余姚市',coordinate:[121.156294,30.045404],level_1:0,level_2:0,level_3:4,type:1},
        {name:'慈溪市',coordinate:[121.248052,30.177142],level_1:0,level_2:0,level_3:4,type:1},
      ],
      culturalData:{
        '海曙区':[
          {name:'XXX文保单位',type:1,coordinate:[121.27493534763425, 29.805897011347337]},
          {name:'XXX文保单位',type:2,coordinate:[121.36692843094202, 29.796694668443468]},
          {name:'XXX文保单位',type:3,coordinate:[121.45008332011705, 29.87681498452571]},
        ],
        '江北区':[
          {name:'XXX文保单位',type:1,coordinate:[121.44132857674435, 30.008022338624972]},
          {name:'XXX文保单位',type:2,coordinate:[121.46459616593329, 29.94422043934918]},
          {name:'XXX文保单位',type:3,coordinate:[121.54511097651758, 29.934183588844796]},
        ],
        '北仑区':[
          {name:'XXX文保单位',type:1,coordinate:[121.7582214583911, 29.907471759195563]},
          {name:'XXX文保单位',type:2,coordinate:[121.88244929437695, 29.804319033339087]},
          {name:'XXX文保单位',type:3,coordinate:[122.00064591634091, 29.857697174041167]},
        ],
        '镇海区':[
          {name:'XXX文保单位',type:1,coordinate:[121.54071084553304, 30.022315177891986]},
          {name:'XXX文保单位',type:2,coordinate:[121.63752890005833, 29.945320472095315]},
          {name:'XXX文保单位',type:3,coordinate:[121.645972599689, 30.03439277880127]},
        ],
        '鄞州区':[
          {name:'XXX文保单位',type:1,coordinate:[121.56294667987042, 29.793447675234187]},
          {name:'XXX文保单位',type:2,coordinate:[121.67423964804829, 29.682518855827457]},
          {name:'XXX文保单位',type:1,coordinate:[121.81392863394188, 29.733310022967935]},
        ],
        '奉化区':[
          {name:'XXX文保单位',type:1,coordinate:[121.21444113302961, 29.676389018180032]},
          {name:'XXX文保单位',type:2,coordinate:[121.32404232670824, 29.547336210976646]},
          {name:'XXX文保单位',type:3,coordinate:[121.49262803487788, 29.65035238104394]},
        ],
        '象山县':[
          {name:'XXX文保单位',type:1,coordinate:[121.73319381680835, 29.489072407595184]},
          {name:'XXX文保单位',type:2,coordinate:[121.94806435107569, 29.56206906334211]},
          {name:'XXX文保单位',type:3,coordinate:[121.89130266137516, 29.181943264874477]},
        ],
        '宁海县':[
          {name:'XXX文保单位',type:1,coordinate:[121.33377571990334, 29.40162359749387]},
          {name:'XXX文保单位',type:2,coordinate:[121.30815633656752, 29.20261629406907]},
          {name:'XXX文保单位',type:1,coordinate:[121.65487907171632, 29.25812622236883]},
        ],
        '余姚市':[
          {name:'XXX文保单位',type:1,coordinate:[120.99828849163057, 30.19924596206678]},
          {name:'XXX文保单位',type:2,coordinate:[121.19336602290022, 29.962723748782434]},
          {name:'XXX文保单位',type:3,coordinate:[121.10314816485173, 29.742474433708143]},
        ],
        '慈溪市':[
          {name:'XXX文保单位',type:1,coordinate:[121.49672470855313, 30.183982059410074]},
          {name:'XXX文保单位',type:2,coordinate:[121.19590747786542, 30.332630622360117]},
          {name:'XXX文保单位',type:3,coordinate:[121.29022959602189, 30.114148946112373]},
        ],
      },
      isCultural:false
    }
  },
  methods:{
    initMap(){
      console.log(NBGeoJson)
      const that = this
      // 宁波市范围geojson ===========
      const vectorSource = new VectorSource({
        // url:'/public/json/宁波市.geojson',
        features:new GeoJSON().readFeatures(NBGeoJson),
      })
      const geojsonlayer = new VectorLayer({
          source: vectorSource,
          style: function(feature){
            return that.setNormalStyle(feature)
          }
      })
      this.geojsonLayer = geojsonlayer
      console.log(this.geojsonLayer)

      // ===================================

      // 蓝色地图 start ====================================================
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
      let blueLayer = new ImageLayer({
          name: "天地图矢量图层",
          source: raster
      });
      //============================= 蓝色底图END =========================

      // 区域点位
      const areaLayer = new VectorLayer({
        source:new VectorSource({
          features:that.createAreaPointsFeatures()
        })
      })
      this.areaLayer = areaLayer
      // ================

      let map = new Map({
          target: 'map',
          layers: [
              // new TileLayer({
              //     title: "天地图卫星影像",
              //     source: new XYZ({
              //         url: "http://t7.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=926da4893299639547a460a3202028ad"
              //     })
              // }),
              blueLayer,
              new TileLayer({
                  source: new XYZ({
                      title: "天地图文字标注1",
                      url: "http://t7.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=926da4893299639547a460a3202028ad"
                  })
              }),
              geojsonlayer,
              areaLayer

          ],
          view: new View({
              center: [121.59210892729209, 29.771477366042426],
              projection: 'EPSG:4326',
              // center: ol.proj.transform([117.2465980052948, 29.286389535399945],'EPSG:4326',"EPSG:3857"),
              zoom: 9.5,
              maxZoom: 18,
          }),
      });
      this.map = map

     // 地图点击事件
      map.on('click',function(ev){
        // console.log('当前中心点:',map.getView().getCenter())
        console.log('当前zoom:',map.getView().getZoom())
        console.log('点击位置坐标:',ev.coordinate)
        if(map.hasFeatureAtPixel(ev.pixel)){
          let features = map.getFeaturesAtPixel(ev.pixel)
          for(let i=0;i<features.length;i++){
            const feature = features[i]
            if(feature.get('level')) {
              const name = feature.get('name')
              console.log('点击的区域:',name)
              that.geojsonLayer.setVisible(false)
              that.areaLayer.setVisible(false)
              that.showCulturalPointsLayer(name)
              // 地图视角移动到 点击的该区域范围
              map.getView().fit(feature.getGeometry())
              that.isCultural = true // 显示返回上级按钮
            }
            

          }
        }
      })

      // 当前鼠标hover的geojson图层的feature
      let areaSelected = null

      map.on('pointermove',function(ev){
        if(map.hasFeatureAtPixel(ev.pixel)){
          let features = map.getFeaturesAtPixel(ev.pixel)
          for(let i=0;i<features.length;i++){
            const feature = features[i]
            // 判断是否为geojson图层,宁波geojson数据中有level属性,通过该属性来判断
            if(feature.get('level')){
              if(areaSelected){
                areaSelected.setStyle(that.setNormalStyle)
              }
              feature.setStyle(that.setSelectedStyle)
              areaSelected = feature
              break
            }
          }
        }else{
          if(areaSelected){
            areaSelected.setStyle(that.setNormalStyle)
          }
        }
      })
    },

    // geojson normal style
    setNormalStyle(feature){
      // geojson 正常样式
      const normalStyle = new Style({
          fill: new Fill({
              color: 'rgba(6, 47, 103, 0.7)',
          }),
          stroke: new Stroke({
              color: '#2EA4F4',
              width: 3,
          }),
          text: new Text({
            font: '13px Calibri,sans-serif',
            fill: new Fill({
              color: '#fff',
            }),
            // stroke: new Stroke({
            //   color: '#fff',
            //   width: 4,
            // }),
          })
      });
      // geojson中具有宁波市各个区县的名字的属性 name
      normalStyle.getText().setText(feature.get('name'))
      return normalStyle
    },
    // geojson hover style
    setSelectedStyle(feature){
       const selectStyle = new Style({
        fill: new Fill({
          color: '#2D8AFA',
        }),
        stroke: new Stroke({
          color: '#2EA4F4',
          width: 2,
        }),
        text: new Text({
          font: '13px Calibri,sans-serif',
          fill: new Fill({
            color: '#fff',
          }),
        })
      });
      selectStyle.getText().setText(feature.get('name'))
      return selectStyle
    },
    showCulturalPointsLayer(name){
      const that = this
      const data = this.culturalData[name]
      if(this.culturalLayer){
        this.culturalLayer.getSource().clear()
        this.culturalLayer.getSource().addFeatures(that.createCulturalFeatures(data))
        this.culturalLayer.setVisible(true)
      }else{
        const source = new VectorSource({
          features:that.createCulturalFeatures(data)
        })
        const layer = new VectorLayer({
          source:source
        })
        this.culturalLayer = layer
        this.map.addLayer(layer)
      }
    },
    createCulturalFeatures(data){
      const features = []
      for(let i=0;i<data.length;i++){
        const feature = new Feature({
          geometry: new Point(data[i].coordinate)
        })
        feature.set('type','cultural')
        feature.set('extraData',data[i])
        let img = ''
        let text = ''
        switch(data[i].type){
          case 1:
            img = culturalImages[0]
            text = '市'
            break
          case 2:
            img = culturalImages[1]
            text = '省'
            break
          case 3:
            img = culturalImages[2]
            text = '国'
            break
          default:
            break
        }
        feature.setStyle(
          new Style({
            image:new Icon({
              src:img,
              anchor:[0.5,0.5]
            }),
            text:new Text({
              text:text,
              font:'14px sans-serif',
              fill: new Fill({
                color: '#fff',
              }),
            })
          })
        )
        features.push(feature)
      }
      return features
    },
    createAreaPointsFeatures(){
      const data = this.areaData;
      const features = []
      
      for(let i=0;i<data.length;i++){
        const feature = new Feature({
          geometry: new Point(data[i].coordinate)
        })
        // 添加自定义属性,用于判断该feature为 区域点位
        feature.set('type','areaPoint')
        feature.set('extraData',data[i]) // 保存数据
        feature.setStyle(
          new Style({
            image: new Icon({
              src: areaImages[0], //  默认都用蓝色点位
              anchor: [0.5, 1]
            })
          })
        );
        features.push(feature)
      }
      return features
    },
    backToNB(){
      this.culturalLayer.setVisible(false)
      this.geojsonLayer.setVisible(true)
      this.areaLayer.setVisible(true)
      this.map.getView().setCenter([121.59210892729209, 29.771477366042426])
      this.map.getView().setZoom(9.5)
      this.isCultural = false
    }
  },
  mounted() {
    this.initMap()
  }
}
</script>
<style scoped>
.container{
  height: 100%;
  position: relative;
}
#map {
  height: 100%;
}
.back-btn{
  position: absolute;
  padding: 2px 5px;
  color: #2EA4F4;
  border: 1px solid #2EA4F4;
  border-radius: 3px;
  left: 300px;
  top: 100px;
  cursor: pointer;
}
</style>