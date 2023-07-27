<template>
<div class="cesium-map">
  <!-- <audio id="sx-alarm-cue-audio" :src="require('../../asserts/audio/alarm.mp3')" preload="auto"></audio> -->
  <div id="cesium-container"></div>
  <div>
    <div class="viewer-group" v-if="!currentBuildingFloor" :style="buildingSelectorStyle" >
      <div class="viewer-box" v-for="(item,idx) in buildingData" :class="{cur:viewerSelect === item._type}" @click="buildingViewChange(item._type)" :key="idx">
        <span>{{item.houseName}}</span>
      </div>
      <!-- <div class="viewer-box" :class="{cur:viewerSelect === 'south'}" @click="buildingViewChange('south')">
        <span>南楼</span>
      </div>
      <div class="viewer-box" :class="{cur:viewerSelect === 'middle'}" @click="buildingViewChange('middle')">
        <span>裙楼</span>
      </div>
      <div class="viewer-box" :class="{cur:viewerSelect === 'north'}" @click="buildingViewChange('north')">
        <span>北楼</span>
      </div> -->
    </div>
    
    <device-group ref="device" v-if="currentViewType=='floor'||currentViewType=='under'||currentViewType=='under_device'" @updateDevicePoint="drawDevicesPoints" :typeList="deviceTypeList" :deviceList="deviceList" :style="buildingSelectorStyle"></device-group>
    <alarm-group :alarmData="alarmData" @seriesAlarmHandler="addAlarmPoints" @jzAlarmHandler="realTimeAlarmFunc" :style="alarmGroupStyle" @commonAlarmHandler="commonAlarmHandler"></alarm-group>
    <floor-selector ref="floorSelector" :style="floorSelectorStyle" v-if="currentBuildingFloors.length" :floorsData="currentFloorsData" :currentBuildingFloors="currentBuildingFloors" :currentViewType="currentViewType" @selectFloor="selectFloor" @floorBackToBuilding="floorBackToBuilding" @showLift="showLift" @backToCarPark="backToCarPark"></floor-selector>
    <Modal v-model="alarmModal" class="alarm-modal" width="360">
      <p class="alarm-modal-content" v-if="alarmHandlerType==0">确认消警?</p>
      <p class="alarm-modal-content" v-else>确认生成工单?</p>
      <template #footer>
        <div class="alarm-btn-group">
          <span class="cancel-btn" @click="alarmModal=false">取消</span>
          <span class="confirm-btn" @click="alarmHandler">确认</span>
        </div>
      </template>
    </Modal>
    <!-- <monitor-video></monitor-video> -->
    <!-- <div style="position:absolute;top:50%;left:50%;width:5px;height:5px;background:red;borderRadius:50%;transform:translate(-50%,-50%);pointer-events:none"></div>
    <div class="edit-group">
      <div class="btn" @click="dotEnable">{{enableDot?'关闭打点':'开启打点'}}</div>
      <div class="btn" v-if="tempPointsArr.length" @click="removeLastPoint">删除上一个点</div>
      <div class="btn" @click="finishLine" v-if="tempPointsArr.length>1">完成</div>
      <textarea rows="10" cols="40" v-model="pointsString"></textarea>
      <hr style="margin:5px 0">
      <div class="btn" @click="pointEnable">{{enablePoint?'关闭绘制':'绘制图标'}}</div>
      <div v-if="enablePoint">
        <div>
          <label name="lng">经度:</label><input name="lng" v-model="pointLng"/>
        </div>
        <div>
          <label name="lat">纬度:</label><input name="lat" v-model="pointLat"/>
        </div>
        <div>
          <label name="height" >高度:</label><input name="height" @change="updateTempPointPos" v-model="pointHeight"/>
        </div>
      </div>
      <div>
        <div class="btn" @click="getCameraView">获取当前视角</div>
        <textarea rows="6" cols="40" v-model="currentCameraInfo"></textarea>
      </div>
      <div>
        <label>主楼颜色:</label>
        <input type="color" v-model="tilesetColor" @input="updateBuildingColor">
        <br>
        <label>主楼透明度</label>
        <input type="number" v-model="tilesetColorOpacity" @input="updateBuildingColor" step="0.01" max="1" min="0">
      </div>
    </div> -->

    <!-- <div class="flv-box">
      <video class="demo-video" ref="player" controls muted autoplay></video>
    </div> -->

     <!-- <div style="position:absolute;top:0">
        <div class="sx-warn-pop-wrapper" >
          <div class="pop-line"></div>
          <div class="pop-content">
            <div style="display:flex;align-items:center">
              <img src="../../asserts/images/map/bj.png" alt="">
              <span class="alarm-title">消防类报警</span>
            </div>
            <div class="split-line"></div>
            <div class="alarm-device-info">
              <div>
                <span class="sx-warn-label">设备名称:</span>
                <span class="sx-warn-content">烟感传感器</span>
              </div>
              <div>
                <span class="sx-warn-label">设备位置:</span>
                <span class="sx-warn-content">南楼5层西北1号</span>
              </div>
              <div>
                <span class="sx-warn-label">报警信息:</span>
                <span class="sx-warn-content">烟雾浓度超过上限</span>
              </div>
              <div>
                <span class="sx-warn-label">报警时间:</span>
                <span class="sx-warn-content">2022-3-1 12:23</span>
              </div>
               <div>
                <span class="sx-warn-label">设备状态:</span>
                <span class="sx-warn-content">通讯正常</span>
              </div>
            </div>
            <div style="display:flex;align-items:center;margin-bottom:15px">
              <img src="../../asserts/images/map/arrow.png" alt="">
              <span class="monitor-title">关联场景</span>
            </div>
            <div class="monitor-content"></div>
          </div>
        </div>
    </div> -->

    <!-- <div style="position:absolute;top:0">
      <div  class="sx-device-point red">
         <span class="sx-device-point-name">消防水泵</span>
        <i class="iconfont icon-xiaofangshuiguan"></i>
      </div>
    </div> -->

      <!-- <div style="position:absolute;top:0">
      <div class="sx-park-pop-wrapper">
        <div class="pop-line"></div>
        <div class="pop-content">
          <img class="sx-park-pic" src="" alt="">
          <div class="pop-info-wrapper">
            <div class="park-info">
              <span>地下一层</span>
              <div class="park-no-wrapper">
                <span>9</span>
                <span>5</span>
                <span>2</span>
                <span>7</span>
              </div>
            </div>
            <div class="park-owner-info">
              <div class="sx-pop-info-row">
                <img class="arrow-pic" src="../../asserts/images/arrow_white.png" alt="">
                <span>车位所有人</span>
              </div>
              <span>王三木</span>
            </div>
            <div class="car-no-info">
              <div class="sx-pop-info-row">
                <img class="arrow-pic" src="../../asserts/images/arrow_white.png" alt="">
                <span>车牌号</span>
              </div>
              <span>苏E6Y2Q5</span>
            </div>
            </div>
          </div>
        <img class="close-btn" src="../../asserts/images/close_blue.png" alt="">
        </div>

      </div> -->
    
    <!-- <img :src="require('../../asserts/images/svg/red_car.svg')" style="position:absolute;top:0" alt=""> -->
    <!-- 临时演示用start-->
    <div class="temp-legends" :style="buildingSelectorStyle" v-if="tempLegendShow">
      <div>
        <span class="color-block" style="background:#CAE74B "></span>
        <span>未出租</span>
      </div>
      <div>
        <span class="color-block" style="background:#7FF6AF"></span>
        <span>商洽中</span>
      </div>
      <div>
        <span class="color-block" style="background:#3D9EFF"></span>
        <span>已出租</span>
      </div>
       <div>
        <span class="color-block" style="background:#E3585A"></span>
        <span>即将到期</span>
      </div>
    </div>
    <div class="temp-legends" :style="buildingSelectorStyle" v-if="tempZL">
      <div>
        <span class="color-block" style="background:#eee"></span>
        <span>自用</span>
      </div>
      <div>
        <span class="color-block" style="background:#7fffd4"></span>
        <span>出售</span>
      </div>
      
      <div>
        <span class="color-block" style="background:#87cefa"></span>
        <span>出租</span>
      </div>
    </div>
    <div class="temp-btn" :class="{'cur':tempZL}" :style="alarmGroupStyle" @click="tempZLClick">租赁状态</div>
  <!-- </div> -->
  <!-- 临时演示用end -->

  <div id="cesium-map-mask" style="position:fixed;height:100%;width:100%;top:0;z-index:999"></div>
  </div>

</div>

</template>

<script>
import FloorSelector from './FloorSelector.vue'
import * as echarts from "echarts";
import moment from "moment";

import axios from 'axios'
import { toRaw, ref } from 'vue'
// import * as turf from '@turf/turf'
import cesiumMixin from '../../minxins/cesiumMixin.js'
import utilsMixin from '../../minxins/utilsMixin.js'

// 临时演示用mixins
import tempMixin from '../../minxins/tempMixin.js'

import AlarmGroup from './AlarmGroup.vue'
import DeviceGroup from './DeviceGroup.vue'
// import supermapMixin from '../../minxins/supermapMixin.js'
const Cesium = window.Cesium;
const defaultToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4NmE4YmYwMy0wODg4LTQwNzktYmQ1Yy1kZjRmM2Y3ZTY1YjMiLCJpZCI6Mjk5MjksInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1OTI4OTY0NDJ9.ZtxbnNm5otCZUh_vOG8QepzMOQ8_jijXcQvBwP5IjXI";
Cesium.Ion.defaultAccessToken = defaultToken;
// import carModel from '../../public/gltf/car0.gltf'

import * as dat from 'dat.gui';
import {getMapWarnInfo,getCanLossAssetList,getHouseList,getDevicesInfo,generateOrderReq, getDeviceDetailByIdAndFlagReq,getPhotoInfoByUrl,getDeviceDetailById,getParkPos} from '@/api/screen/screen-map.js'
import MonitorVideo from '../../../../components/hanwin-monitor-video/monitor-video.vue'
import Cesium3dtileLift from '../../util/Cesium3dtileLift.js'
import CesiumLift from '../../util/CesiumLift.js'

import { getToken, getUserInfo } from "@/libs/util";

import {deviceIconsClass,floorsHeight,carSvgURLs, liftsIDMap} from '../../const/map.js'
import flvjs from "flv.js";

export default {
  components:{FloorSelector, AlarmGroup, DeviceGroup, MonitorVideo},
  props:{
    contentLeft:{
      type:Object,
      default:()=>({
        width:'0px'
      })
    },
    contentRight:{
      type:Object,
      default:()=>({
        width:'0px'
      })
    },
    contentWidth:{
      type:Object,
      default:() => (
        {
          left:0,
          right:0
        }
      )
    }
  },
  data () {
    return {
    // 10.10.11.37:9999
      alarmModal:false,
      alarmHandlerType: 0,// 0 消警; 1 生成工单
      alarmHandlerData:null,

      colorSelected:"#ffffff",

      viewer: null,
      tileset: null,
      elementsInfo:null,
      features:[],
      viewerSelect:'overview',
      cameraInfo:{
        'overview':{
          destination: Cesium.Cartesian3.fromDegrees(120.62368234668195,31.464099597716377,160.7683350028597),
          orientation: {
            heading:4.420836073356739,
            roll:6.283170535684183,
            pitch:-0.27930985017014254
          },
        },
        'south':{
          destination: Cesium.Cartesian3.fromDegrees(120.62103712814769,31.460642707780814,136.2464560896611),
          orientation: {
            heading: 5.540449108595162,
            pitch: -0.41841704356139253,
            roll: 6.283183582026616
          },
        },
        'north':{
          destination: Cesium.Cartesian3.fromDegrees(120.62221309786844,31.46437034395226,166.30032587571256),
          orientation: {
            heading: 4.377801111877567,
            pitch: -0.3808943547169388,
            roll: 6.28318173419187
          },
        },
        'middle':{
          destination: Cesium.Cartesian3.fromDegrees(120.6211499712196,31.46251013095233,97.12362136703754),
          orientation: {
            heading: 4.907285961079881,
            pitch: -0.4359787005956668,
            roll: 0.000004856322378898881
          },
        },
        lift:{
          destination: Cesium.Cartesian3.fromDegrees(120.6227006690138,31.46206430888303,313.6943233122262),
          orientation: {
            heading:4.926677949651772,
            roll:0.0000035616801570270695,
            pitch:-0.6954672209647819
          },
        }
      },
      currentBuildingFloors:[],
      currentFloorsData:[],
      currentBuildingFloor:0,
      currentViewType:'init',// 当前模型页面显示的功能类型: init 初始视角;building 楼栋视角;floor 楼层视角;under 地下车库视角;under_device 地下设备;lift 电梯视角
      // floors:{
      //   'north':21,
      //   'middle':8,
      //   'south':15
      // },
      floors:{
        'north':[21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,-1,-2],
        'middle':[8,7,6,5,4,3,2,1,-1,-2],
        'south':[15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,-1,-2],
        // 'under':[-1,-2]
      },
      floorTileset:null,//楼层的倾斜摄影
      logoTileset:null,// logo的倾斜摄影
      planeTileset:null,
      under1FloorTileset:null,//负一楼倾斜摄影
      under2FloorTileset:null,//负二楼倾斜摄影
      liftTileset:null,
      bottomTileset:null,// 大楼周界倾斜摄影

      liftsTileset:null,// 电梯3dtiles保存,类型为OBJECT
      // floor_1_tileset:null, // 电梯

      devicesBillboardCollection:null, // 设备图层
      // devicesDataSource:null, // 设备dataSource

      // 实时报警弹窗部分功能变量 BEGIN
      realTimeAlarmIds:[],// 时实报警的id集合
      alarmPopShowMaxCount:5, // 页面最多同时显示的报警弹窗数量
      alarmPopAutoHideTime:10, /// 事实报警弹窗自动消失时间 /秒
      // 实时报警功能部分功能变量 END

      // 报警
      alarms:[
        // { id:'sx-alarm-point-0',position:[120.61915286702484,31.461897032815536,50]},
        // { id:'sx-alarm-point-1',position:[120.61949753790935,31.463204089075568,65]},
      ],

      curPopId:'',

      // 电梯 

      // 每层楼的高度位置
      floorsHeight:{
        '-2':-10,
        '-1':-5,
        1:1,
        2:5.4,
        3:9.9,
        4:14.4,
        5:18.6,
        6:22.8,
        7:27.0,
        8:31.2,
        9:35.4,
        10:39.6,
        11: 43.8,
        12: 48,
        13:52.2,
        14:56.4,
        15:60.6,
        16:64.8,
        17:69,
        18:73.2,
        19:77.4,
        20:81.6,
        21:85.8,
        22:90
      },

      // 编辑用......
      enableDot:false,
      tempDataSource: null,
      tempPointsArr:[],
      pointsString:'',
      tempLinesArr:[

      ],
      currentCameraInfo:'',
      enablePoint:false,
      tempDataCollection:null,
      pointLng:null,
      pointLat:null,
      pointHeight:null,
      tempPoint:null,
      tilesetColor:'#3180FF',
      tilesetColorOpacity:0.6,
      // ..........

      alarmSocket:null,
      alarmData:new Array(3).fill({count:0,deviceList:[]}),

      parkSocket:null, // 停车位websocket

      // houseData:[],
      buildingData:[],
      houseData:{
        south:null,
        north:null,
        middle:null,
        under:null
      },
      floorsData:{
        south:null,
        north:null,
        middle:null,
        under:null
      },
      // 楼层设备
      deviceTypeList:[],
      deviceList:[],
      devicePointIds:[],// 设备点位id集合

      // 停车点位
      carPointsIds:[],// 当前停车点位id集合
      carParkSocketDataAll:[],//socket推送过来的停车位数据
      carData:[],// 当前停车点位数据集合

      liftSocket:null,

      alarmCircleEntities:[],// 告警光圈entity集合
      roadFlowlineEntities:[],// 道路光线entity集合
      buildingFlowlineEntities:[],//大楼光线entity集合
      wallEntities:[],// 墙体光线entity集合

      buildingLabel:null,

      carParkPosData:{
        '-1':null,
        '-2':null
      }
    }
  },
  computed:{
    alarmGroupStyle(){
      return {
        left:this.contentLeft.width,
        marginLeft:'20px',
        top:'90px'
      }
    },
    floorSelectorStyle(){
      return {
        right:this.contentRight.width,
        marginRight:"45px",
      }
    },
    buildingSelectorStyle(){
      const cw = document.body.clientWidth;
      const leftW = this.contentWidth.left
      const rightW = this.contentWidth.right
      console.log(cw,leftW,rightW)
      const center = (cw-rightW-leftW)/2+leftW
      return {
        left:center+'px'
      }
    }
  },
  mixins:[cesiumMixin, utilsMixin,tempMixin],
  methods: {
    initMap() {
      const _this = this

      // let orginMatrixInverse

      // Cesium地球页面初始化的一些配置
      const viewerOptions = {
        fullscreenButton: false,
        homeButton: false,
        animation: false,
        baseLayerPicker: false,
        geocoder: false,
        // homeButton: false,
        // skyBox: new Cesium.skyBox(),
        skyAtmosphere:false,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: true,
        timeline: false,
        navigationHelpButton: false,
        selectionIndicator: false,
      }
      // 自定义mapbox图层
      let imageryProvider = new Cesium.MapboxStyleImageryProvider({
        url: "https://api.mapbox.com/styles/v1",
        // username:'wangchao1018',
        styleId: "dark-v10",
        // styleId:'ckimzu44x1kbh17qpxul078as',
        accessToken:
          "pk.eyJ1Ijoic2FubXU5IiwiYSI6ImNrbzE3MnZkajBtb24yeG9ibmxjMHE1ZDYifQ.9mVkYRsx-tj0MZeMowE3MA",
      });
      const viewer = new Cesium.Viewer("cesium-container", {
        ...viewerOptions,
        // terrainProvider: Cesium.createWorldTerrain(),// 地形
        // imageryProvider: imageryProvider,
      });
      const scene = viewer.scene
      var utc=Cesium.JulianDate.fromDate(new Date("2022/04/17 01:00:00"));//UTC
      viewer.clockViewModel.currentTime = Cesium.JulianDate.addHours(utc,8,new Cesium.JulianDate());//北京时间
      // viewer.clock.currentTime = Cesium.JulianDate.addHours(Cesium.JulianDate.now(new Date()), 8, new Cesium.JulianDate());
      viewer.scene.globe.depthTestAgainstTerrain = false //地形检测
      // viewer.scene.skyBox.show = false
      // 自定义天空盒
      viewer.scene.skyBox = new Cesium.SkyBox({
        sources:{
          // positiveX: require('@/assets/images/skybox/00h+00.jpg'),
          // negativeX: require('@/assets/images/skybox/12h+00.jpg'),
          // positiveY: require('@/assets/images/skybox/06h+00.jpg'),
          // negativeY: require('@/assets/images/skybox/18h+00.jpg'),
          // positiveZ: require('@/assets/images/skybox/06h+90.jpg'),
          // negativeZ: require('@/assets/images/skybox/06h-90.jpg')
          // positiveX: require('../../asserts/images/skybox/Version2_dark_px.jpg'),
          // negativeX: require('../../asserts/images/skybox/Version2_dark_mx.jpg'),
          // positiveY: require('../../asserts/images/skybox/Version2_dark_py.jpg'),
          // negativeY: require('../../asserts/images/skybox/Version2_dark_my.jpg'),
          // positiveZ: require('../../asserts/images/skybox/Version2_dark_pz.jpg'),
          // negativeZ: require('../../asserts/images/skybox/Version2_dark_mz.jpg')
          positiveX: require('../../asserts/images/skybox/1.jpg'),
          negativeX: require('../../asserts/images/skybox/1.jpg'),
          positiveY: require('../../asserts/images/skybox/1.jpg'),
          negativeY: require('../../asserts/images/skybox/1.jpg'),
          positiveZ: require('../../asserts/images/skybox/1.jpg'),
          negativeZ: require('../../asserts/images/skybox/1.jpg')
        }
      })
      viewer.cesiumWidget.creditContainer.style.display = "none";//去除logo和版权信息

      viewer.imageryLayers.removeAll();
      viewer.scene.sun.show = true
      viewer.scene.globe.enableLighting = true; //关闭光照
      viewer.shadows = false;//关闭阴影

      // viewer.scene.globe.show = false
      // viewer.scene.globe.baseColor = new Cesium.Color(0, 0, 0, 0);
      // viewer.scene.backgroundcolor = new Cesium.Color(0, 0, 0, 0);
      viewer.scene.globe.baseColor = new Cesium.Color(28/255, 50/255, 77/255, 1);
      viewer.scene.backgroundcolor = new Cesium.Color(28/255, 50/255, 77/255, 1);

      

      const bloom = viewer.scene.postProcessStages.bloom

      // this.enableMapBloom(viewer)

      // this.addBloomGUI(viewer)

      // bloom.enable = true // 启用bloom
      // bloom.uniforms.glowOnly = true; // 发光
      // bloom.uniforms.contrast = 128.0; // 对比度 [-255.0, 255.0] 
      // bloom.uniforms.brightness = 1 // 光泽亮度 -1.0~1.0
      // bloom.uniforms.delta = 1; // 因子 1~5
      // bloom.uniforms.sigma = 1; // [1,10]
      // bloom.uniforms.stepSize = 1; // [0.s1,10]

      
      this.viewer = viewer
      
      viewer.camera.flyTo({
        ...this.cameraInfo['overview'],
        complete:function(){
          _this.main3dtilesColorAnimate(0)
          // _this.main3dtilesAddCustomShadar()
        }
      })

      // this.initMapLayers(viewer) // 初始化地图业务相关的一些图层,数据集

      this.limitCameraViewRange(viewer)

      // this.add3dtiles(viewer)
      this.addAll3dtiles(viewer)
      // this.addDynamicWater()

      // supermap ==============
      // this.smSetNight(viewer)
      // this.addRoadlamps(viewer)
      // this.addPointLights(viewer)

      //====================


      // console.log(this.viewer)

      // this.addDirectionalLight(viewer)



      // this.addCityVerticalFlowline(viewer)
// 
      // this.addFlowlines(viewer)
      this.addRoadFlowlines(viewer)
      // this.addBuildingFlowlines(viewer)
      // this.addCustomWall(viewer)

      // this.addCars()
      // this.setDarkEffect(viewer)

      this.installCssRenderer(viewer)

      const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
      handler.setInputAction(function (movement) {
        // if (!picking) {
        //   return;
        // }
        _this.editHandler(movement)

        // _this.mapClickHandler(movement)

        // 获取点击位置坐标================
        // var position = viewer.scene.camera.pickEllipsoid(
        //   movement.position,
        //   viewer.scene.globe.ellipsoid
        // );
        // const pos = Cesium.Cartographic.fromCartesian(position);
        // const lng = Cesium.Math.toDegrees(pos.longitude);
        // const lat = Cesium.Math.toDegrees(pos.latitude);
        //=====================

        _this.viewerInfoGet(viewer)
        const feature = scene.pick(movement.position);
        // console.log(feature);
        // // _this.addCustomShadarToFeature(feature)
        if (feature) {
          // console.log(feature.getPropertyNames());
          // console.log(feature.getProperty("building"));
          // console.log(feature.getProperty("name"));

          _this.testFeatureClickHandler(movement)
          // console.log(feature.getProperty("floor"));
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    },

    // 初始化地图业务相关的一些图层,数据集
    initMapLayers(viewer){
      // 设备图层
      this.devicesBillboardCollection = new Cesium.BillboardCollection();
      // this.devicesDataSource = new Cesium.CustomDataSource();
      viewer.scene.primitives.add(this.devicesBillboardCollection)
      
    },

    // bloom相关配置
    enableMapBloom(viewer) {
      const bloom = viewer.scene.postProcessStages.bloom;
      bloom.enabled = true
      console.log('bloom',bloom.uniforms)
      // bloom.uniforms.glowOnly = true; // 发光
      bloom.uniforms.contrast = 1
      bloom.uniforms.brightness = -0.5
    },

    // 加载倾斜摄影模型
    add3dtiles (viewer) {
      const URL = "/screen/tileset/sx/tileset.json"
      // const URL = "/screen/tileset/sx_base/tileset.json"
      // const URL = "/screen/tileset/sx_night/tileset.json"
      // this.get3DtilesScenetree(URL)

      const tileset = new Cesium.Cesium3DTileset({
        url: URL,
        maximumScreenSpaceError:1,
        show: true,
        // shadows:Cesium.ShadowMode.DISABLED,
        // lightColor:new Cesium.Cartesian3 (0,0,0)
      })
      this.tileset = tileset
      const _this = this
      
      tileset.readyPromise.then(function (ts) {
        console.log(ts)
        viewer.scene.primitives.add(ts) //添加tileset
        update3dtilesMaxtrix(ts) // 更新tileset位置
        viewer.zoomTo(ts, new Cesium.HeadingPitchRange(0.0, -0.3, 0.0));//视角移动
      })


      tileset.allTilesLoaded.addEventListener(function () {
        console.log('tiles all loaded')
        // const mesh_shadow_list = ['Mesh15']
        // const featureNames = []
        tileset.style = new Cesium.Cesium3DTileStyle({
          // show: "${name} !== 'Mesh98'",
          color: {
            evaluateColor: (feature) => {
              // 这边似乎是异步的
              //这里收集所有feature
              // if(!featureNames.includes(feature.getProperty('name'))){
              //   _this.features.push(feature)
              //   featureNames.push(feature.getProperty('name'))
              //   // if(mesh_shadow_list.includes(feature.getProperty('name'))){
              //   //   _this.addCustomShadarToFeature(feature)
              //   // }
              //   // feature.show = false
              // }
              _this.features.push(feature)
              // if(mesh_shadow_list.includes(feature.getProperty('name'))){
                // _this.addCustomShadarToFeature(feature)
              //   console.log(feature)
              // }
              // console.log(feature.color)
              return feature.color.withAlpha(1);
            },
            conditions: [
              ["true", "rgba(255, 255, 255,0.95)"],
            ],
          },
        });
        // setTimeout(()=>{
        //   console.log(toRaw(_this.features))
        //   _this.features.forEach(feature => feature.show = false)
        // },3000)
      })

      function update3dtilesMaxtrix(tileset) {
        var params = {
            tx: 120.616859,  //模型中心X轴坐标（经度，单位：十进制度）
            ty: 31.461681,    //模型中心Y轴坐标（纬度，单位：十进制度）
            tz:-0.1,    //模型中心Z轴坐标（高度，单位：米）
            rx: 0,    //X轴（经度）方向旋转角度（单位：度）圆心应该是在地心，改动其中一个值的时候，不止变化了该变量，比如改动ry，模型的高度也有了显著上升
            ry: 0,    //Y轴（纬度）方向旋转角度（单位：度）
            rz:258.5     //Z轴（高程）方向旋转角度（单位：度）
        };
        //旋转
        var mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(params.rx));
        var my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(params.ry));
        var mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(params.rz));
        var rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
        var rotationY = Cesium.Matrix4.fromRotationTranslation(my);
        var rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);
        //平移
        var position = Cesium.Cartesian3.fromDegrees(params.tx, params.ty, params.tz);
        
        var m = Cesium.Transforms.eastNorthUpToFixedFrame(position);
        //旋转、平移矩阵相乘
        Cesium.Matrix4.multiply(m, rotationX, m);
        Cesium.Matrix4.multiply(m, rotationY, m);
        Cesium.Matrix4.multiply(m, rotationZ, m);
        //赋值给tileset
        tileset._root.transform = m;
      }

    },
      // 加载主建筑
    addMain3dtiles (viewer) {
      const URL = "/screen/tileset/suxiang/main/tileset.json"
      // const URL = "/screen/tileset/suxiang/sx_ds/tileset.json"
      // Cesium.ExperimentalFeatures.enableModelExperimental = true;

      const tileset = new Cesium.Cesium3DTileset({
        url: URL,
        maximumScreenSpaceError:1,
        show: true,
        // shadows:Cesium.ShadowMode.DISABLED,
        // lightColor:new Cesium.Cartesian3 (0,0,0)
       
      })
      // this.tileset = tileset
      const _this = this
      
      tileset.readyPromise.then(function (ts) {
        viewer.scene.primitives.add(ts) //添加tileset
        update3dtilesMaxtrix(ts) // 更新tileset位置
        // viewer.zoomTo(ts, new Cesium.HeadingPitchRange(0.0, -0.3, 0.0));//视角移动
      })
      this.addMain3dtilesCustomShadar(tileset)
      // 初始化颜色
      tileset.allTilesLoaded.addEventListener(function (tile) {
        _this.tileset = tileset
        tileset.style = new Cesium.Cesium3DTileStyle({
          // show: "${name} !== 'Mesh2989'",
          color: {
            // evaluateColor: (feature) => {
            //   // 这边似乎是异步的
            //   //这里收集所有feature
            //   // if(!featureNames.includes(feature.getProperty('name'))){
            //   //   _this.features.push(feature)
            //   //   featureNames.push(feature.getProperty('name'))
            //   //   // if(mesh_shadow_list.includes(feature.getProperty('name'))){
            //   //   //   _this.addCustomShadarToFeature(feature)
            //   //   // }
            //   //   // feature.show = false
            //   // }
            //   _this.features.push(feature)
            //   // if(mesh_shadow_list.includes(feature.getProperty('name'))){
            //     // _this.addCustomShadarToFeature(feature)
            //   //   console.log(feature)
            //   // }
            //   // console.log(feature.color)
            //   // return feature.color.withAlpha(1);
            //   return Cesium.Color(0.24,  0.31, 0.44, 1.0)

            // },
            conditions: [
              // ["true", "rgba(108, 162, 249,0.0)"],
              // ["true", "rgba(93,201,246,0.3)"],
              // ["true", "rgba(108, 162, 249,0.3)"],
              ["true", "rgba(255, 255, 255,0)"],
            ],
          },
        });
      })

      function update3dtilesMaxtrix(tileset) {
        var params = {
            tx: 120.619283,  //模型中心X轴坐标（经度，单位：十进制度）
            ty: 31.462566,    //模型中心Y轴坐标（纬度，单位：十进制度）
            tz: 0,    //模型中心Z轴坐标（高度，单位：米）
            rx: 0,    //X轴（经度）方向旋转角度（单位：度）圆心应该是在地心，改动其中一个值的时候，不止变化了该变量，比如改动ry，模型的高度也有了显著上升
            ry: 0,    //Y轴（纬度）方向旋转角度（单位：度）
            rz:258.1     //Z轴（高程）方向旋转角度（单位：度）
        };

        // // BIM模型数据的位置参数
        //  var params = {
        //     tx: 120.619237,  //模型中心X轴坐标（经度，单位：十进制度）
        //     ty: 31.462621,    //模型中心Y轴坐标（纬度，单位：十进制度）
        //     tz: 0,    //模型中心Z轴坐标（高度，单位：米）
        //     rx: 0,    //X轴（经度）方向旋转角度（单位：度）圆心应该是在地心，改动其中一个值的时候，不止变化了该变量，比如改动ry，模型的高度也有了显著上升
        //     ry: 0,    //Y轴（纬度）方向旋转角度（单位：度）
        //     rz:348.7     //Z轴（高程）方向旋转角度（单位：度）
        // };
        //旋转
        var mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(params.rx));
        var my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(params.ry));
        var mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(params.rz));
        var rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
        var rotationY = Cesium.Matrix4.fromRotationTranslation(my);
        var rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);
        //平移
        var position = Cesium.Cartesian3.fromDegrees(params.tx, params.ty, params.tz);
        
        var m = Cesium.Transforms.eastNorthUpToFixedFrame(position);
        //旋转、平移矩阵相乘
        Cesium.Matrix4.multiply(m, rotationX, m);
        Cesium.Matrix4.multiply(m, rotationY, m);
        Cesium.Matrix4.multiply(m, rotationZ, m);
        //赋值给tileset
        tileset._root.transform = m;
      }
    },
    addMain3dtilesCustomShadar(tileset){
      const _this = this
      tileset.tileVisible.addEventListener(function (tile) {
        // console.log(tile)
        // updateTile(tile);
      
        let shadar = `
        varying vec3 v_positionEC;
        void main(void){
        vec4 position = czm_inverseModelView * vec4(v_positionEC,1); // 位置
        float glowRange = 100.0; // 光环的移动范围(高度)
        // gl_FragColor = vec4(1.0,  1.0, 1.0, 1.0); // 颜色
        gl_FragColor = vec4(0.4235,  0.6353, 0.9765, 1.0); // 颜色
         //gl_FragColor *= vec4(vec3((position.z + 10.0) / 30.0), 0.8); // 渐变
         //gl_FragColor *= vec4(vec3((position.z + 30.0) / 60.0), 0.8); // 渐变
        // 动态光环
        float time = fract(czm_frameNumber / 180.0);
        time = abs(time - 0.5) * 2.0;
        float diff = step(0.005, abs( clamp(position.z / glowRange, 0.0, 1.0) - time));
         gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - diff);
        }
      `;
        _this.addCustomShadarToTiles(tile,shadar)
      });
    },
    main3dtilesColorAnimate(idx){
      const that = this
      if(!this.tileset){
        setTimeout(()=>{
          this.main3dtilesColorAnimate(0)
        },0)
      }

      setTimeout(()=>{
        if(idx>=25){
          this.addLogo3dtiles(this.viewer)
          this.addBuildingFlowlines(this.viewer)
          document.getElementById('cesium-map-mask').style.display = 'none'

          // that.tileset.style = new Cesium.Cesium3DTileStyle({
          //   color:{
          //     conditions:[
          //       // ["${floor}>="+idx, "rgba(108, 162, 249, 0.0)"],
          //       // ["true","rgba(108, 162, 249, 0.3)"]
          //       ["${floor}>="+idx, "rgba(255, 255, 255, 0.0)"],
          //       ["${building}!=='north'","rgba(220, 220, 220,0.7)"],
          //       ["true","rgba(255, 255, 255, 0.3)"]
          //     ]
          //   }
          // })

          return
        }
        that.tileset.style = new Cesium.Cesium3DTileStyle({
          color:{
            conditions:[
              // ["${floor}>="+idx, "rgba(108, 162, 249, 0.0)"],
              // ["true","rgba(108, 162, 249, 0.3)"]
              ["${floor}>="+idx, "rgba(255, 255, 255, 0.0)"],
              ["true","rgba(255, 255, 255, 0.3)"]
            ]
          }
        })
        that.main3dtilesColorAnimate(idx+1)
      },80)

      // requestAnimationFrame(function(){
        

      // })
      
    },
    // 更新大楼样式
    updateMain3dtilesStyle() {
      const type = this.currentViewType
      if(type == 'building' || type == 'init'){
        console.log(this.alarms)
        const floors = []
        const conditions = []
        this.alarms.forEach(item => {
          if(!floors.includes(item.floorNum)){
            floors.push(item.floorNum)
            conditions.push(["${floor}="+floorNum,"rgba(255,0,0,0.1)"])
          }
        })
        if(this.tileset){
          this.tileset.style = new Cesium.Cesium3DTileStyle({
            color:{
              conditions:[
                ...conditions,
                // ["true","rgba(108, 162, 249, 0.3)"]
                ["true","rgba(255, 255, 255, 0.3)"]
              ]
            }
          })
        }
      }
    },

    main3dtilesAddCustomShadar(){
      if(this.tileset){
        const upZ = true
        this.tileset.customShader = new Cesium.CustomShader({
              // lightingModel: Cesium.LightingModel.UNLIT,
            fragmentShaderText: `
              void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material)
              {
                vec4 position = czm_inverseModelView * vec4(fsInput.attributes.positionEC,1); // 位置

                // 注意shader中写浮点数是，一定要带小数点，否则会报错，比如0需要写成0.0，1要写成1.0
                float _baseHeight = 0.0; // 物体的基础高度，需要修改成一个合适的建筑基础高度
                float _heightRange = 60.0; // 高亮的范围(_baseHeight ~ _baseHeight + _heightRange)
                float _glowRange = 100.0; // 光环的移动范围(高度)

                // 建筑基础色
                float mars_height = ${upZ ? "position.z" : "position.y"} - _baseHeight;
                // float mars_a11 = fract(czm_frameNumber / 120.0) * 3.14159265 * 2.0;
                // float mars_a12 = mars_height / _heightRange + sin(mars_a11) * 0.1;
                // material.diffuse = vec3(0.0, 0.0, 1.0); // 颜色
                // material.diffuse *= vec3(mars_a12);// 渐变

                // 动态光环
                float time = fract(czm_frameNumber / 360.0);
                time = abs(time - 0.5) * 2.0;
                float mars_h = clamp(mars_height / _glowRange, 0.0, 1.0);
                float mars_diff = step(0.005, abs(mars_h - time));
                material.diffuse += material.diffuse * (1.0 - mars_diff);
              } `
        })
      }
    },
    // 加载其他建筑
    addOther3dtiles (viewer) {
      const URL = "/screen/tileset/suxiang/buildings/tileset.json"

      var yellowEdge = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
      yellowEdge.uniforms.color = Cesium.Color.WHITE;
      yellowEdge.uniforms.length = 1;
      yellowEdge.selected = [];
      viewer.scene.postProcessStages.add(
        Cesium.PostProcessStageLibrary.createSilhouetteStage([yellowEdge])
      );

      const tileset = new Cesium.Cesium3DTileset({
        url: URL,
        maximumScreenSpaceError:3,
        show: true,
        // shadows:Cesium.ShadowMode.DISABLED,
        // lightColor:new Cesium.Cartesian3 (0,0,0)
      })
      const _this = this

      tileset.tileVisible.addEventListener(function (tile) {
        // console.log(tile)
        // updateTile(tile);
        let shadar = `
        varying vec3 v_positionEC;
        void main(void){
        vec4 position = czm_inverseModelView * vec4(v_positionEC,1); // 位置
        float glowRange = 100.0; // 光环的移动范围(高度)
         gl_FragColor = vec4(0.54,  0.72, 0.98, 1.0); // 颜色
        // gl_FragColor = vec4(0.0,  0.0, 0.0, 1.0); // 颜色
        }
      `
        _this.addCustomShadarToTiles(tile,shadar)

      });

      // const customShader = 
      
      tileset.readyPromise.then(function (ts) {
        viewer.scene.primitives.add(ts) //添加tileset
        update3dtilesMaxtrix(ts) // 更新tileset位置
        // viewer.zoomTo(ts, new Cesium.HeadingPitchRange(0.0, -0.3, 0.0));//视角移动
      })

      // tileset.tileLoad.addEventListener(function (tile) {
      //   // console.log(tile)
      //   let content = tile.content;
      //   if (content && content.featuresLength > 0) {
      //     const featuresLength = content.featuresLength;
      //     for (let i = 0; i < featuresLength; ++i) {
      //       const feature = content.getFeature(i);
      //       if (feature) {
      //         yellowEdge.selected = [...yellowEdge.selected,feature]
      //         // console.log(feature)
      //         // console.log(feature.getPropertyNames())
      //         // feature.show = false
      //       }
      //       // let name = SnUtil.getAlias(feature.getProperty('name'));
      //       // if (!tileset.featureMap.get(name)) {
      //       //   let featureEntity = new 3DTileFeatureEntity(feature);
      //       //   tileset.featureMap.set(name, featureEntity);
      //       // }
      //     }
      //   }
      // });

      tileset.allTilesLoaded.addEventListener(function () {
        // const mesh_shadow_list = ['Mesh15']
        // const featureNames = []
        tileset.style = new Cesium.Cesium3DTileStyle({
          // show: "${name} !== 'Mesh2989'",
          color: {
            // evaluateColor: (feature) => {
            //   yellowEdge.selected = [...yellowEdge.selected,feature];
            //    console.log(yellowEdge)

            //   // 这边似乎是异步的
            //   //这里收集所有feature
            //   // if(!featureNames.includes(feature.getProperty('name'))){
            //   //   _this.features.push(feature)
            //   //   featureNames.push(feature.getProperty('name'))
            //   //   // if(mesh_shadow_list.includes(feature.getProperty('name'))){
            //   //   //   _this.addCustomShadarToFeature(feature)
            //   //   // }
            //   //   // feature.show = false
            //   // }
            //   // if(mesh_shadow_list.includes(feature.getProperty('name'))){
            //     // _this.addCustomShadarToFeature(feature)
            //   //   console.log(feature)
            //   // }
            //   // console.log(feature.color)
            //   return feature.color.withAlpha(1);
            // },
            conditions: [
              ["true", "rgba(255, 255, 255,0.05)"],
            ],
          },
        });
      })

      function update3dtilesMaxtrix(tileset) {
        var params = {
            tx: 120.616709,  //模型中心X轴坐标（经度，单位：十进制度）
            ty: 31.461566,    //模型中心Y轴坐标（纬度，单位：十进制度）
            tz: 0,    //模型中心Z轴坐标（高度，单位：米）
            rx: 0,    //X轴（经度）方向旋转角度（单位：度）圆心应该是在地心，改动其中一个值的时候，不止变化了该变量，比如改动ry，模型的高度也有了显著上升
            ry: 0,    //Y轴（纬度）方向旋转角度（单位：度）
            rz:259.6    //Z轴（高程）方向旋转角度（单位：度）
        };
        //旋转
        var mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(params.rx));
        var my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(params.ry));
        var mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(params.rz));
        var rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
        var rotationY = Cesium.Matrix4.fromRotationTranslation(my);
        var rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);
        //平移
        var position = Cesium.Cartesian3.fromDegrees(params.tx, params.ty, params.tz);
        
        var m = Cesium.Transforms.eastNorthUpToFixedFrame(position);
        //旋转、平移矩阵相乘
        Cesium.Matrix4.multiply(m, rotationX, m);
        Cesium.Matrix4.multiply(m, rotationY, m);
        Cesium.Matrix4.multiply(m, rotationZ, m);
        //赋值给tileset
        tileset._root.transform = m;
      }
    },
    // 加载大楼周边
    addBottom3dtiles(viewer){
      const URL = "/screen/tileset/suxiang/bottom/tileset.json"
      this.bottomTileset = new Cesium.Cesium3DTileset({
        url:URL,
        maximumScreenSpaceError:1,
        show:true,
      })
      const tileset = this.bottomTileset
      const _this = this
      tileset.readyPromise.then(function(ts){
        viewer.scene.primitives.add(ts) //添加tileset
        let params = {
           tx: 120.619178,  //模型中心X轴坐标（经度，单位：十进制度）
            ty: 31.462798,    //模型中心Y轴坐标（纬度，单位：十进制度）
            tz:-998,    //模型中心Z轴坐标（高度，单位：米）
            rx: 0,    //X轴（经度）方向旋转角度（单位：度）圆心应该是在地心，改动其中一个值的时候，不止变化了该变量，比如改动ry，模型的高度也有了显著上升
            ry: 0,    //Y轴（纬度）方向旋转角度（单位：度）
            rz:348.4     //Z轴（高程）方向旋转角度（单位：度）
        }
         //旋转
        var mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(params.rx));
        var my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(params.ry));
        var mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(params.rz));
        var rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
        var rotationY = Cesium.Matrix4.fromRotationTranslation(my);
        var rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);
        //平移
        var position = Cesium.Cartesian3.fromDegrees(params.tx, params.ty, params.tz);
        
        var m = Cesium.Transforms.eastNorthUpToFixedFrame(position);
        //旋转、平移矩阵相乘
        Cesium.Matrix4.multiply(m, rotationX, m);
        Cesium.Matrix4.multiply(m, rotationY, m);
        Cesium.Matrix4.multiply(m, rotationZ, m);
        var scale = Cesium.Matrix4.fromUniformScale(1000)
        Cesium.Matrix4.multiply(m, scale, m)
        //赋值给tileset
        tileset._root.transform = m;

      })

    },

    // 加载地面
    addPlane3dtiles(viewer) {
      // const URL = "/tileset/sx/tileset.json"
      const URL = "/screen/tileset/suxiang/plane/tileset.json"
      // this.get3DtilesScenetree(URL)

      const that = this
      const tileset = new Cesium.Cesium3DTileset({
        url: URL,
        maximumScreenSpaceError:32,
        show: true,
        // shadows:Cesium.ShadowMode.DISABLED,
        // lightColor:new Cesium.Cartesian3 (0,0,0)
      })
      
      tileset.readyPromise.then(function (ts) {
        viewer.scene.primitives.add(ts) //添加tileset
        update3dtilesMaxtrix(ts) // 更新tileset位置
      })


      tileset.allTilesLoaded.addEventListener(function () {
        console.log('tiles all loaded')
        // const mesh_shadow_list = ['Mesh15']
        // const featureNames = []
        that.planeTileset = tileset
        tileset.style = new Cesium.Cesium3DTileStyle({
          // show: "${name} !== 'polySurface837'",
          color: {
            conditions: [
              // ["true", "rgba(28, 50, 77,1)"],
              ["true", "rgba(255, 255, 255,1)"],
            ],
          },
        });
        // setTimeout(()=>{
        //   console.log(toRaw(_this.features))
        //   _this.features.forEach(feature => feature.show = false)
        // },3000)
      })

       tileset.tileVisible.addEventListener(function (tile){
         let shadar = `
        varying vec3 v_positionEC;
        void main(void){
        vec4 position = czm_inverseModelView * vec4(v_positionEC,1); // 位置
        float glowRange = 100.0; // 光环的移动范围(高度)
        // gl_FragColor = vec4(0.31,  0.74, 0.91, 1.0); // 颜色
        gl_FragColor = vec4(0.11,  0.196, 0.302, 1.0); // 颜色
        }
      `;
        that.addCustomShadarToTiles(tile,shadar)
       })

      function update3dtilesMaxtrix(tileset) {
        var params = {
            tx: 120.616859,  //模型中心X轴坐标（经度，单位：十进制度）
            ty: 31.461681,    //模型中心Y轴坐标（纬度，单位：十进制度）
            tz:-0.1,    //模型中心Z轴坐标（高度，单位：米）
            rx: 0,    //X轴（经度）方向旋转角度（单位：度）圆心应该是在地心，改动其中一个值的时候，不止变化了该变量，比如改动ry，模型的高度也有了显著上升
            ry: 0,    //Y轴（纬度）方向旋转角度（单位：度）
            rz:258.5     //Z轴（高程）方向旋转角度（单位：度）
        };
        //旋转
        var mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(params.rx));
        var my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(params.ry));
        var mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(params.rz));
        var rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
        var rotationY = Cesium.Matrix4.fromRotationTranslation(my);
        var rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);
        //平移
        var position = Cesium.Cartesian3.fromDegrees(params.tx, params.ty, params.tz);
        
        var m = Cesium.Transforms.eastNorthUpToFixedFrame(position);
        //旋转、平移矩阵相乘
        Cesium.Matrix4.multiply(m, rotationX, m);
        Cesium.Matrix4.multiply(m, rotationY, m);
        Cesium.Matrix4.multiply(m, rotationZ, m);
        //赋值给tileset
        tileset._root.transform = m;
      }

    },
    // 加载路面
    addRoad3dtiles(viewer) {
      const _this = this
      // const URL = "/tileset/sx/tileset.json"
      const URL = "/screen/tileset/suxiang/road/tileset.json"
      // this.get3DtilesScenetree(URL)

      const tileset = new Cesium.Cesium3DTileset({
        url: URL,
        maximumScreenSpaceError:32,
        show: true,
        // shadows:Cesium.ShadowMode.DISABLED,
        // lightColor:new Cesium.Cartesian3 (0,0,0)
      })
      
      tileset.readyPromise.then(function (ts) {
        viewer.scene.primitives.add(ts) //添加tileset
        update3dtilesMaxtrix(ts) // 更新tileset位置
      })


      tileset.allTilesLoaded.addEventListener(function () {
        // const mesh_shadow_list = ['Mesh15']
        // const featureNames = []
        tileset.style = new Cesium.Cesium3DTileStyle({
          // show: "${name} !== 'polySurface837'",
          color: {
            conditions: [
              ["true", "rgba(0, 0, 0,0.2)"],
            ],
          },
        });
        // setTimeout(()=>{
        //   console.log(toRaw(_this.features))
        //   _this.features.forEach(feature => feature.show = false)
        // },3000)
      })

      //  tileset.tileVisible.addEventListener(function (tile){
      //    let shadar = `
      //   varying vec3 v_positionEC;
      //   void main(void){
      //   vec4 position = czm_inverseModelView * vec4(v_positionEC,1); // 位置
      //   float glowRange = 100.0; // 光环的移动范围(高度)
      //   // gl_FragColor = vec4(0.31,  0.74, 0.91, 1.0); // 颜色
      //   gl_FragColor = vec4(0.059,  0.082, 0.16, 1.0); // 颜色
      //   }
      // `;
      //   _this.addCustomShadarToTiles(tile,shadar)
      //  })

      function update3dtilesMaxtrix(tileset) {
        var params = {
            tx: 120.617026,  //模型中心X轴坐标（经度，单位：十进制度）
            ty: 31.461589,    //模型中心Y轴坐标（纬度，单位：十进制度）
            tz:-0.1,    //模型中心Z轴坐标（高度，单位：米）
            rx: 0,    //X轴（经度）方向旋转角度（单位：度）圆心应该是在地心，改动其中一个值的时候，不止变化了该变量，比如改动ry，模型的高度也有了显著上升
            ry: 0,    //Y轴（纬度）方向旋转角度（单位：度）
            rz:258.5     //Z轴（高程）方向旋转角度（单位：度）
        };
        //旋转
        var mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(params.rx));
        var my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(params.ry));
        var mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(params.rz));
        var rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
        var rotationY = Cesium.Matrix4.fromRotationTranslation(my);
        var rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);
        //平移
        var position = Cesium.Cartesian3.fromDegrees(params.tx, params.ty, params.tz);
        
        var m = Cesium.Transforms.eastNorthUpToFixedFrame(position);
        //旋转、平移矩阵相乘
        Cesium.Matrix4.multiply(m, rotationX, m);
        Cesium.Matrix4.multiply(m, rotationY, m);
        Cesium.Matrix4.multiply(m, rotationZ, m);
        //赋值给tileset
        tileset._root.transform = m;
      }

    },
    // 加载logo
    addLogo3dtiles(viewer) {
      const URL = "/screen/tileset/suxiang/logo/tileset.json"

      this.logoTileset = new Cesium.Cesium3DTileset({
        url: URL,
        maximumScreenSpaceError:1,
        show: true,
        // shadows:Cesium.ShadowMode.DISABLED,
        // lightColor:new Cesium.Cartesian3 (0,0,0)
      })
      const tileset = this.logoTileset
      const _this = this
      
      tileset.readyPromise.then(function (ts) {
        // viewer.scene.primitives.add(ts) //添加tileset
        update3dtilesMaxtrix(ts) // 更新tileset位置
      })

      //  tileset.tileVisible.addEventListener(function (tile) {
      //   // console.log(tile)
      //   // updateTile(tile);
      //   let shadar = `
      //   varying vec3 v_positionEC;
      //   void main(void){
      //   vec4 position = czm_inverseModelView * vec4(v_positionEC,1); // 位置
      //   float glowRange = 100.0; // 光环的移动范围(高度)
      //   gl_FragColor = vec4(0.32,  0.41, 0.58, 1.0); // 颜色
      //   // gl_FragColor = vec4(0.31,  0.74, 0.91, 1.0); // 颜色
      //   //  gl_FragColor = vec4(0.3,  0.85, 0.90, 1.0); // 颜色
      //   // gl_FragColor = vec4(0.2,  0.5, 1.0, 1.0); // 颜色
      //   // gl_FragColor *= vec4(vec3((position.z + 5.0) / 60.0), 0.8); // 渐变
      //   // 动态光环
      //   //float time = fract(czm_frameNumber / 180.0);
      //   //time = abs(time - 0.5) * 2.0;
      //   //float diff = step(0.005, abs( clamp(position.z / glowRange, 0.0, 1.0) - time));
      //   // gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - diff);
      //   }
      // `
      //   _this.addCustomShadarToTiles(tile,shadar)

      // });


      tileset.allTilesLoaded.addEventListener(function () {
        // const mesh_shadow_list = ['Mesh15']
        // const featureNames = []
        tileset.style = new Cesium.Cesium3DTileStyle({
          // show: "${name} !== 'polySurface837'",
          color: {
            conditions: [
              ["true", "rgba(82, 105, 148,1)"],
            ],
          },
        });
        // setTimeout(()=>{
        //   console.log(toRaw(_this.features))
        //   _this.features.forEach(feature => feature.show = false)
        // },3000)
      })

      function update3dtilesMaxtrix(tileset) {
        var params = {
            tx: 120.619679,  //模型中心X轴坐标（经度，单位：十进制度）
            ty: 31.463314,    //模型中心Y轴坐标（纬度，单位：十进制度）
            tz:88,    //模型中心Z轴坐标（高度，单位：米）
            rx: 0,    //X轴（经度）方向旋转角度（单位：度）圆心应该是在地心，改动其中一个值的时候，不止变化了该变量，比如改动ry，模型的高度也有了显著上升
            ry: 0,    //Y轴（纬度）方向旋转角度（单位：度）
            rz:258.7     //Z轴（高程）方向旋转角度（单位：度）
        };
        //旋转
        var mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(params.rx));
        var my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(params.ry));
        var mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(params.rz));
        var rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
        var rotationY = Cesium.Matrix4.fromRotationTranslation(my);
        var rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);
        //平移
        var position = Cesium.Cartesian3.fromDegrees(params.tx, params.ty, params.tz);
        
        var m = Cesium.Transforms.eastNorthUpToFixedFrame(position);
        //旋转、平移矩阵相乘
        Cesium.Matrix4.multiply(m, rotationX, m);
        Cesium.Matrix4.multiply(m, rotationY, m);
        Cesium.Matrix4.multiply(m, rotationZ, m);
        //赋值给tileset
        tileset._root.transform = m;
      }
    },
    addFloor3dtiles(viewer,building,floor){
      building = building||'north';
      floor = floor||18;
      // const name = building+"_"+floor
      // const URL = "/screen/tileset/suxiang/floors/"+name+"/tileset.json"

      const {URL,name} = this.getFloorTilesetURL(building,floor)
      // 移除上一个楼层
      if(this.floorTileset){
        this.floorTileset.destroy()
        // viewer.scene.primitives.remove(this.floorTileset) //添加tileset
      }

      if(this.tempFloorTileset){
        this.tempFloorTileset.show = false;
        this.tempLegendShow = false
        this.hideTempLabels(this.viewer)
      }
      this.removTempLights()
      if(floor == 20){
        this.tempAddFloor3dtiles(viewer)
        return
      }
      if(floor == 21){
        this.showTempLights(viewer)
      }



      this.floorTileset = new Cesium.Cesium3DTileset({
        url:URL,
        maximumScreenSpaceError:1,
        show:true
      })
      this.floorTileset.style =  new Cesium.Cesium3DTileStyle({
        color:{
          conditions: [
            ["true","rgba(255,255,255,0.9)"]
          ],
        }
      }) 
      const _this = this;
      const tileset = this.floorTileset
      tileset.readyPromise.then(function (ts) {
        viewer.scene.primitives.add(ts) //添加tileset
        _this.update3dtilesMaxtrix(ts,_this.floorPosParams[name])
        if(_this.floorCameraInfo[name]){

          _this.viewer.camera.flyTo(_this.floorCameraInfo[name])
        }else{
          viewer.flyTo(ts);//视角移动
        }
        // update3dtilesMaxtrix(ts) // 更新tileset位置
      })

    },
    // 移除电梯
    removeLifts(){
      this.liftWebSocketClose()
      const lifts = this.liftsTileset
      for(let key in lifts){
        if(lifts[key]){
          this.liftsTileset[key].destroy()
        }
      }
      this.liftsTileset = null
    },
    addLift3dtiles(data){
      const URL = "/screen/tileset/suxiang/lift/tileset.json"
      data = data || [
          {
              "currentFloor": 1,
              "deviceId": "61769dd67916dc36d16a074b62109cf3",
              "deviceName": "南楼4#",
              "status": "0"
          },
          {
              "currentFloor": 1,
              "deviceId": "5d12704da3e5ae603940095327aac4cc",
              "deviceName": "南楼1#",
              "status": "0"
          },
          {
              "currentFloor": 1,
              "deviceId": "435889096dfdd6dfeea3f01ecb179065",
              "deviceName": "南楼5#",
              "status": "0"
          },
          {
              "currentFloor": 1,
              "deviceId": "4d4d6f4d59f2b4b12893a20b45135b62",
              "deviceName": "南楼2#",
              "status": "0"
          },
          {
              "currentFloor": 1,
              "deviceId": "ddeecf7f16e165a3440cb5812c713b5e",
              "deviceName": "南楼3#",
              "status": "0"
          },
          {
              "currentFloor": 1,
              "deviceId": "227f62dd022e324b661c4765d97ae524",
              "deviceName": "南楼7#",
              "status": "0"
          },
          {
              "currentFloor": 1,
              "deviceId": "e7fad90d83f317eb6fe05d7b1b6eff10",
              "deviceName": "北楼2#",
              "status": "0"
          },
          {
              "currentFloor": 1,
              "deviceId": "c8cc7247bd5590b0210d66953964923e",
              "deviceName": "北楼5#",
              "status": "0"
          },
          {
              "currentFloor": 1,
              "deviceId": "70053d597f3e3e506ef2ba089ca824f8",
              "deviceName": "北楼3#",
              "status": "0"
          },
          {
              "currentFloor": 1,
              "deviceId": "a1492bef4b560047403cbf4a3b3c1a1d",
              "deviceName": "北楼1#",
              "status": "0"
          },
          {
              "currentFloor": 1,
              "deviceId": "2a9fecda7874bc636a6548b567d3b5c4",
              "deviceName": "北楼4#",
              "status": "0"
          },
          {
              "currentFloor": 1,
              "deviceId": "e90f5a5fcc32796e4e2e3c0f997f15e8",
              "deviceName": "北楼6#",
              "status": "0"
          },
          {
              "currentFloor": 1,
              "deviceId": "28fb4199d090c4d60bcc83b5c0b36632",
              "deviceName": "裙楼北1#",
              "status": "0"
          },
          {
              "currentFloor": 1,
              "deviceId": "b3ce8112bcb43dc1e32b93409f0edd50",
              "deviceName": "裙楼西2#",
              "status": "0"
          },
          {
              "currentFloor": 1,
              "deviceId": "bb3386838fde142306aa32bcd927d05f",
              "deviceName": "裙楼西1#",
              "status": "0"
          },
          {
              "currentFloor": 1,
              "deviceId": "d17974fa591f29ad82d90935b5e4fb18",
              "deviceName": "裙楼北2#",
              "status": "0"
          },
          {
              "currentFloor": 1,
              "deviceId": "d4a93fba7afb0d90a791305b94205717",
              "deviceName": "裙楼东1#",
              "status": "0"
          }
      ]
      let lifts = []
      this.liftsTileset = {}

      data.forEach(item => {
        const liftName  = liftsIDMap[item.deviceId]
        const params = {...this.liftPosParams[liftName]}
        params.tz = floorsHeight[item.currentFloor] // 初始化高度
        const name = item.deviceName.slice(2)
        this.liftsTileset[liftName] = new Cesium3dtileLift(URL,params,this.viewer,name)
        const liftTileset = this.liftsTileset[liftName]
        liftTileset.init(() => {
          const color = item.status=='0'?'rgba(0,255,0,1)':(item.status=='2'?'rgba(252, 136, 69, 1)':'rgba(255,0,0,1)')
          liftTileset.setColor(color)
        })
      })

      // for(let key in this.buildingLifts){
      //   lifts = lifts.concat(this.buildingLifts[key])
      // }
      // for(let i =0;i<lifts.length;i++){
      //   this.liftsTileset[lifts[i]] = new Cesium3dtileLift(URL,this.liftPosParams[lifts[i]],this.viewer)
      //   const liftTileset = this.liftsTileset[lifts[i]]
      //   liftTileset.init(() => {
      //     const color = liftStatus[i]?'rgba(0,255,0,1)':'rgba(255,0,0,1)'
      //     liftTileset.setColor(color)

      //     if(liftStatus[i]&&heightMove[i]){
      //       setTimeout(()=>{
      //         liftTileset.liftMove(heightMove[i])
      //       },3000)
      //     }
      //   })
      // }
      
    },
    showLift(){
      this.currentViewType = 'lift'
      const _this = this
      this.removeAll()
      this.removeCarParkPoints()
      this.removeAlarmCircles()
      this.removeBuildingLabel()
      this.removeBuildinglines()
      const building = this.viewerSelect
      // 先更改主楼样式等效果
      // let customShader = `
      //   varying vec3 v_positionEC;
      //   void main(void){
      //   vec4 position = czm_inverseModelView * vec4(v_positionEC,1); // 位置
      //   float glowRange = 100.0; // 光环的移动范围(高度)
      //   // gl_FragColor = vec4(0.31,  0.74, 0.91, 1.0); // 颜色
      //   gl_FragColor = vec4(0.24,  0.31, 0.44, 1.0); // 颜色
      //   // gl_FragColor = vec4(0.2,  0.5, 1.0, 1.0); // 颜色
      //   //  gl_FragColor *= vec4(vec3((position.z + 10.0) / 30.0), 0.8); // 渐变
      //   //  gl_FragColor *= vec4(vec3((position.z + 5.0) / 60.0), 0.8); // 渐变
      //   // 动态光环
      //   //float time = fract(czm_frameNumber / 180.0);
      //   //time = abs(time - 0.5) * 2.0;
      //   //float diff = step(0.005, abs( clamp(position.z / glowRange, 0.0, 1.0) - time));
      //   // gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - diff);
      //   }
      // `;
      // // console.log(tileset)
      // this.tileset.tileVisible.addEventListener(function(tile){
      //   _this.addCustomShadarToTiles(tile,customShader)
      // })
      this.tileset.show = true
      this.planeTileset.show = false 
      this.bottomTileset.show = false
      if(this.floorTileset){
        this.floorTileset.destroy()
      }
      if(this.tempFloorTileset){
        this.tempFloorTileset.show = false;
        this.tempLegendShow = false
        this.hideTempLabels(this.viewer)
      }
      this.removTempLights()

      this.viewer.scene.globe.depthTestAgainstTerrain = false //地形检测
      this.logoTileset.show = false
      this.tileset.style = new Cesium.Cesium3DTileStyle({
        color:{
          conditions: [
            ["true","rgba(255,255,255,0.1)"]
            // ["true","rgba(108, 162, 249,0.1)"]

          ],
        }
      })
      
      this.addUnderFloor(this.viewer,-1)
      this.under1FloorTileset.style = new Cesium.Cesium3DTileStyle({
        color:{
          conditions: [
              // ["${floor}===6","rgba(255,255,255,1)"],
            ["true","rgba(255,255,255,0.05)"]
          ],
        }
      }) 
      this.addUnderFloor(this.viewer,-2)

      this.under2FloorTileset.style = new Cesium.Cesium3DTileStyle({
        color:{
          conditions: [
            ["true","rgba(255,255,255,0.05)"]
          ],
        }
      }) 

      this.liftWebSocketConn()

      this.$emit('showLift')
    },

    update3dtilesMaxtrix(tileset,params) {
      params = params||{
        tx: 120.619679,  //模型中心X轴坐标（经度，单位：十进制度）
        ty: 31.463314,    //模型中心Y轴坐标（纬度，单位：十进制度）
        tz:88,    //模型中心Z轴坐标（高度，单位：米）
        rx: 0,    //X轴（经度）方向旋转角度（单位：度）圆心应该是在地心，改动其中一个值的时候，不止变化了该变量，比如改动ry，模型的高度也有了显著上升
        ry: 0,    //Y轴（纬度）方向旋转角度（单位：度）
        rz:258.7     //Z轴（高程）方向旋转角度（单位：度）
      }
       //旋转
        var mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(params.rx));
        var my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(params.ry));
        var mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(params.rz));
        var rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
        var rotationY = Cesium.Matrix4.fromRotationTranslation(my);
        var rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);
        //平移
        var position = Cesium.Cartesian3.fromDegrees(params.tx, params.ty, params.tz);
        
        var m = Cesium.Transforms.eastNorthUpToFixedFrame(position);
        //旋转、平移矩阵相乘
        Cesium.Matrix4.multiply(m, rotationX, m);
        Cesium.Matrix4.multiply(m, rotationY, m);
        Cesium.Matrix4.multiply(m, rotationZ, m);
        //赋值给tileset
        tileset._root.transform = m;
    },
    addAll3dtiles (viewer) {
      this.addMain3dtiles(viewer)
      this.addPlane3dtiles(viewer)
      this.addRoad3dtiles(viewer)
      this.addOther3dtiles(viewer)
      this.addBottom3dtiles(viewer)

      // this.addLogo3dtiles(viewer)
    },


    // 根据scenestree.json获取所有模型节点
    async get3DtilesScenetree(url) {
      const scenetree = url.substring(0, url.lastIndexOf('/') + 1) + 'scenetree.json'
      // console.log(scenetree)
      await axios.get(scenetree).then(res => {
        if(res.status === 200){
          const data = res.data
          const elements = this.get3DtilesElements(data)
          this.elementsInfo = elements[0]
        }
      })
    },
    get3DtilesElements(data) {
      let arr = []
      if(data.scenes) {
        for (let i = 0; i < data.scenes.length; i++) {
          arr.push(this.get3DtilesElements(data.scenes[i]))
        }
      }else {
        if(data.children&&data.children.length>0){
          data = data.children
          for(let i = 0; i < data.length; i++) {
           const arr2 = this.get3DtilesElements(data[i])
            arr = [...arr,...arr2]
          }
        }else {
          arr.push(data)
        }
      }
      return arr
    },
    showFloor(num){
      const tileset = this.tileset
      if(tileset) {
        if(num>22){
          tileset.style = new Cesium.Cesium3DTileStyle({
            color:{
              conditions:[
                // ["${company} !=='hy'",'rgba(255,255,255,1)'],
                // ["${floor}==="+num,"rgba(255,255,255,1)"],
                ["true","rgba(255,255,255,1)"]
              ]
            }
          })
        }else {
          tileset.style = new Cesium.Cesium3DTileStyle({
            color:{
              conditions:[
                ["${if_sx} !==1",'rgba(255,255,255,1)'],
                ["${floor}==="+num,"rgba(255,255,255,1)"],
                ["true","rgba(255,255,255,0.1)"]
              ]
            }
          })
        }
        
      }
    },
    addCustomShadarToFeature (feature) {
      // ==================== 光特效 start ============================
      let customShader = `
        varying vec3 v_positionEC;
        void main(void){
        vec4 position = czm_inverseModelView * vec4(v_positionEC,1); // 位置
        float glowRange = 60.0; // 光环的移动范围(高度)
        gl_FragColor = vec4(0.31,  0.74, 0.91, 1.0); // 颜色
        // gl_FragColor = vec4(0.3,  0.85, 0.90, 1.0); // 颜色
        // gl_FragColor = vec4(0.2,  0.5, 1.0, 1.0); // 颜色
         gl_FragColor *= vec4(vec3((position.z + 1.0) / 60.0), 0.8); // 渐变
        // 动态光环
        float time = fract(czm_frameNumber / 180.0);
        time = abs(time - 0.5) * 2.0;
        float diff = step(0.005, abs( clamp(position.z / glowRange, 0.0, 1.0) - time));
        gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - diff);
        }
      `;

      let model = feature._content._model;
      console.log(model)
      if (
        customShader &&
        model &&
        model._sourcePrograms &&
        model._rendererResources
      ) {
        Object.keys(model._sourcePrograms).forEach((key) => {
          console.log(key)
          let program = model._sourcePrograms[key];
          model._rendererResources.sourceShaders[program.fragmentShader] =
            customShader;
        });
        model._shouldRegenerateShaders = true;
      }
    },
    addCustomShadarToTiles (tile,customShader) {
      // ==================== 光特效 start ============================
      customShader = customShader || `
        varying vec3 v_positionEC;
        void main(void){
        vec4 position = czm_inverseModelView * vec4(v_positionEC,1); // 位置
        float glowRange = 100.0; // 光环的移动范围(高度)
        gl_FragColor = vec4(0.31,  0.74, 0.91, 1.0); // 颜色
        // gl_FragColor = vec4(0.3,  0.85, 0.90, 1.0); // 颜色
        // gl_FragColor = vec4(0.2,  0.5, 1.0, 1.0); // 颜色
         gl_FragColor *= vec4(vec3((position.z + 5.0) / 60.0), 0.8); // 渐变
        // 动态光环
        float time = fract(czm_frameNumber / 180.0);
        time = abs(time - 0.5) * 2.0;
        float diff = step(0.005, abs( clamp(position.z / glowRange, 0.0, 1.0) - time));
        gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - diff);
        }
      `;
      let content = tile.content;
        for (let i = 0; i < content.featuresLength; i++) {
          let feature = content.getFeature(i);
          let model = feature.content._model;
          if (
            customShader &&
            model &&
            model._sourcePrograms &&
            model._rendererResources
          ) {
            Object.keys(model._sourcePrograms).forEach((key) => {
              let program = model._sourcePrograms[key];
              model._rendererResources.sourceShaders[program.fragmentShader] =
                customShader;
            });
            model._shouldRegenerateShaders = true;
          }
        }
    },

    removeCustomShadarToTiles(tile){
      let content = tile.content;
      for (let i = 0; i < content.featuresLength; i++) {
        let feature = content.getFeature(i);
        let model = feature.content._model;
        if (
          model &&
          model._sourcePrograms &&
          model._rendererResources
        ) {
          Object.keys(model._sourcePrograms).forEach((key) => {
            let program = model._sourcePrograms[key];
            model._rendererResources.sourceShaders[program.fragmentShader] =
              `void main(void){
                 gl_FragColor = vec4(1.0,  1.0, 1.0, 1.0); // 颜色
              }`;
          });
          model._shouldRegenerateShaders = true;
        }
      }
      
    },
    recoverCustomShadarToTiles(tile){
      let content = tile.content;
      for (let i = 0; i < content.featuresLength; i++) {
        let feature = content.getFeature(i);
        let model = feature.content._model;
        if (
          model &&
          model._sourcePrograms &&
          model._rendererResources
        ) {
          Object.keys(model._sourcePrograms).forEach((key) => {
            let program = model._sourcePrograms[key];
            model._rendererResources.sourceShaders[program.fragmentShader] =
             `
        varying vec3 v_positionEC;
        void main(void){
        vec4 position = czm_inverseModelView * vec4(v_positionEC,1); // 位置
        float glowRange = 100.0; // 光环的移动范围(高度)
        // gl_FragColor = vec4(1.0,  1.0, 1.0, 1.0); // 颜色
        gl_FragColor = vec4(0.4235,  0.6353, 0.9765, 1.0); // 颜色
         //gl_FragColor *= vec4(vec3((position.z + 10.0) / 30.0), 0.8); // 渐变
         //gl_FragColor *= vec4(vec3((position.z + 30.0) / 60.0), 0.8); // 渐变
        // 动态光环
        float time = fract(czm_frameNumber / 180.0);
        time = abs(time - 0.5) * 2.0;
        float diff = step(0.005, abs( clamp(position.z / glowRange, 0.0, 1.0) - time));
         gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - diff);
        }
      `;
          });
          model._shouldRegenerateShaders = true;
        }
      }
    },

    addFlowline(positions,option){
      positions = positions|| [
        
      ]
      option = option||{
         width: 10,
          color:"#000000",
        //  color: "#00BFFF",
         duration:24000,
         image:require('../../asserts/images/map/line4.png')
      }
      this.viewer.entities.add({
        polyline: {
          positions:positions,
          // positions:Cesium.Cartesian3.fromDegreesArrayHeights(positions),
          width: option.width,
          // material: new Cesium.PolylineTrailLinkMaterialProperty(Cesium.Color(23,221,255,0.9), 12000),
          material: new Cesium.PolylineTrailLinkMaterialProperty(Cesium.Color.fromCssColorString(option.color), option.duration,option.image),
        } 
      })
    },

    addDynamicWater() {
      const viewer = this.viewer
      const waterImg = require('../../asserts/images/map/movingRiver.png')
      // 流动水面效果
      viewer.scene.primitives.add(
          new Cesium.Primitive({
              geometryInstances: new Cesium.GeometryInstance({
                  geometry: new Cesium.RectangleGeometry({
                      rectangle: Cesium.Rectangle.fromDegrees(
                          120.60804131001787,31.456345496073567,
                          120.6258210499474,31.46793669910031
                      ),
                      vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
                  }),
              }),
              appearance: new Cesium.EllipsoidSurfaceAppearance({
                  material: new Cesium.Material({
                      fabric: {
                          type: "Water",
                          uniforms: {
                              baseWaterColor: new Cesium.Color(64 / 255.0, 157 / 255.0, 253 / 255.0, 0.5),// 水的基本颜色 
                              // blendColor // 水与非水区域的混合颜色
                              normalMap: waterImg,
                              frequency: 500.0,// 水波纹的数量
                              animationSpeed: 0.01,// 水的流速
                              amplitude: 0.5, // 水波纹振幅
                              specularIntensity: 1 //镜面反射强度
                          }
                      }
                  })
              }),
          })
      );

    },

    addFlowlines (viewer) {
      const lines = [
        {
          positions:[
            [120.61930858373987,31.45814375726497],
            [120.619506611104,31.459282527376345],
            [120.61970408618635,31.46042734879773],
            [120.61990550113815,31.461587757450367],
            [120.62010442067007,31.462738503319002],
            [120.62019006926748,31.463229684084123],
            [120.62022848733834,31.463393714408493],
            [120.62020903851442,31.463504671434237],
            [120.62015694066257,31.463654431659993],
            [120.62002975326193,31.463818607605084],
            [120.619966580327,31.46388106274796],
            [120.61989710382043,31.463927942081853],
            [120.61976142323338,31.464002253262734],
            [120.61943432448663,31.464125615625726],
            [120.61817875125111,31.46460182962537],
            [120.61736178294356,31.464918390520598],
            [120.61646102241653,31.46526220400515],
            [120.61547800444643,31.465634905104697],
            [120.61538773192133,31.46565132924212],
            [120.61528738584155,31.46566209098074],
            [120.61508870964383,31.465590771513643],
            [120.61388704793288,31.463845621431922],
            [120.6122157274578,31.46142076559806],
            [120.61219622258156,31.46129949956199],
            [120.6122311261513,31.461192336376374],
            [120.61306234992274,31.460788186338235],
            [120.61640042296898,31.45913662142569],
            [120.61883884994317,31.457929609001905],
            [120.61898820336728,31.457905928050195],
            [120.6191526372802,31.457945971618706],
            [120.61928238673073,31.458059735187618],
            [120.61930858373987,31.45814375726497],
          ],
        },
        {
          positions:[
            [120.62630275147404,31.462964044589828],
            [120.62092891803253,31.46356673893601],
            [120.62078999497945,31.46353167433966],
            [120.62074636862515,31.46345216046152],
            [120.62043412430621,31.461709966441532],
            [120.6197154593923,31.457591847535184],
            [120.61976005987297,31.457501691120843],
            [120.61982797736744,31.45744358933735],
            [120.62577942736935,31.45633923319613],
          ],

        },
        {
          positions:[
            [120.62183835102226,31.47065623405086],
            [120.62137009206268,31.46738162251025],
            [120.62100281590978,31.46482949455533],
            [120.62094640048359,31.464441138937907],
            [120.62089562888129,31.464039233767704],
            [120.62092105298893,31.46385484814542],
            [120.62096132537877,31.463748763604233],
            [120.62631950182713,31.463152418484597],
          ],
        },
        {
          positions:[
            [120.61654370950961,31.470958070424757],
            [120.6157834559109,31.46660401505317],
            [120.61541562924877,31.466054533958463],
            [120.61542029546158,31.466015505500067],
            [120.61552116654802,31.465894780405208],
            [120.61562117415959,31.465841592158515],
            [120.61761471733827,31.46508343545824],
            [120.61989854449094,31.464210190924195],
            [120.62006009179117,31.464138566798244],
            [120.62013840245176,31.4641218624782],
            [120.62020515513886,31.46413652711286],
            [120.62027254712322,31.46418246273566],
            [120.62054848832283,31.466031799728245],
            [120.62084896421439,31.468147125570656],
            [120.62121232650051,31.47069379863774],
          ],
        },
        {
          positions:[
            [120.61875334942536,31.457556148074623],
            [120.61554048967967,31.459136423033467],
            [120.61201542944036,31.460871973059483],
            [120.6117966726455,31.458758678252373],
            [120.61162059698724,31.457056938336883],
            [120.61436211240974,31.456284521273407],
            [120.61880265826412,31.455042090174505],
            [120.61902700218417,31.456347911357287],
            [120.61914013038782,31.45699681867057],
            [120.61914170737396,31.457082432369187],
            [120.61903847985445,31.457300791415054],
            [120.61890870857842,31.457447263475345],
            [120.61875334942536,31.457556148074623],
          ],
        },
        {
          positions:[
            [120.62577505366157,31.456111736471463],
            [120.62323396192346,31.456572348769587],
            [120.61994656778684,31.457165954343],
            [120.61978340013954,31.457155666694934],
            [120.61968561782085,31.45711142994497],
            [120.6196165736663,31.45703238310847],
            [120.61940588308705,31.455831682813336],
            [120.61925385687084,31.454967335632244],
            [120.62091542747666,31.45466892685516],
            [120.6233115148276,31.454232983632902],
            [120.62559613500866,31.453817763930502],
          ],
        },
        {
          positions:[
            [120.61879071904191,31.452303164645183],
            [120.61898456410061,31.453398262507275],
            [120.61920828627603,31.454716762415153],
            [120.62084294975993,31.454426314004756],
            [120.62305750046369,31.454038448203235],
            [120.62558714512187,31.453590118966357],
          ],
        },
        {
          positions:[
            [120.62558571822393,31.45359136467507],
            [120.62367665517918,31.453929821462715],
            [120.62174368436628,31.45426675945515],
            [120.61921243437196,31.454715096792736],
            [120.61902324211742,31.45363849200139],
            [120.61879172230174,31.45230327466148],
          ],
        },
        {
          positions:[
            [120.61833242421258,31.45232898370497],
            [120.61844712370853,31.452981669493386],
            [120.61861288883622,31.45395733123923],
            [120.6187616062418,31.45481457629669],
            [120.61773963585259,31.455099475809746],
            [120.61603240790656,31.45557465186714],
            [120.61360908473647,31.456246346616048],
            [120.61159371479063,31.456804779216704],
            [120.61140399009629,31.45501534737444],
            [120.61116812731908,31.452746938552732],
          ],
        },
        {
          positions:[
            [120.610921570439,31.452746597760314],
            [120.61111577705606,31.45476805354064],
            [120.61132024998112,31.456803874189976],
            [120.61035664432836,31.456825593097896],
            [120.6085764868503,31.45686870695007],
            [120.60712783120819,31.45690496319587],
          ],
        },
        {
          positions:[
            [120.60716991155685,31.45715656514185],
            [120.60892202173794,31.457104566687114],
            [120.6113418182836,31.457029060189157],
            [120.61149435812816,31.458557927920495],
            [120.61172261128782,31.460864605066778],
            [120.6100197648814,31.460953537526457],
            [120.60744152273647,31.461091507477516],
          ],
        },
        {
          positions:[
            [120.60748211230012,31.4617073550634],
            [120.60983036089748,31.461571458427155],
            [120.61178993805214,31.46145102165709],
            [120.61187163149835,31.461477829061902],
            [120.61196680533773,31.46155485863725],
            [120.61311986278501,31.463234109716648],
            [120.61390919867164,31.464382314277124],
            [120.61483574590474,31.465728671104618],
            [120.61485833300418,31.465767196741727],
            [120.6148254012969,31.465846829182],
            [120.61467180174087,31.46591648995224],
            [120.61347558647765,31.4663230664647],
            [120.61287769692144,31.46652715313817],
            [120.61257439398177,31.466602254000275],
            [120.61103701626467,31.466753950492546],
            [120.6094908240897,31.466907833719567],
            [120.60790920742261,31.467067864091323],
          ],
        },
        {
          positions:[
            [120.61330741234676,31.47115370891993],
            [120.61307198415162,31.469746756394052],
            [120.61283832759806,31.468318764165936],
            [120.61262232253131,31.467000122634932],
            [120.61257214246714,31.466950951552416],
            [120.61250952442686,31.46694620090876],
            [120.61023854359775,31.467130082272153],
            [120.60793243350828,31.467315951695852],
          ],
        },
        {
          positions:[
            [120.61353412312427,31.471129228320795],
            [120.61317668641809,31.469000841463384],
            [120.61283649186642,31.46696281135387],
            [120.61281773769477,31.466904052549182],
            [120.61283140019952,31.46685642442184],
            [120.61287045266766,31.466817723783276],
            [120.61413959932811,31.46638513255242],
            [120.61499929325424,31.466092293789554],
            [120.61507823956903,31.466128889066916],
            [120.61552738785869,31.466731930306942],
            [120.6158915114514,31.46882676111573],
            [120.61626535964541,31.47097483901965],
          ],
        }

      ]

      for(let i=0;i<lines.length;i++){
        this.addFlowline(lines[i].positions.map(item => {
          return new Cesium.Cartesian3.fromDegrees(...item,2)
        }))
      }
    },
    addRoadFlowlines (viewer) {
      if(this.roadFlowlineEntities.length){
        return
      }
      const option = {
        width: 5,
        // color: "#00BFFF",
        color:"#4169e1",
        // color:"#000000",
        duration:1000,
        // image:require('../../asserts/images/map/LinkPulse.png')
        image:require('../../asserts/images/map/line6.png')
      }

      // const lines = [
      //   [
      //     [120.61940248158326,31.45789085087609],
      //     [120.6199070198508,31.460685548879606],
      //   ],
      //   [
      //     [120.62062024928332,31.4636301795346],
      //     [120.62021331691811,31.461452321561858],
      //     [120.62003201332963,31.460158416114282],
      //   ],

      // ]

      // LinkPulse.png
      const lines = [
        [
          [120.61843498550637,31.452339628123337],
          [120.61893260763712,31.455090813173683],
          [120.61935771260336,31.457447059250754],
          [120.61968237089546,31.45941103565733],
          [120.62006706508322,31.461789428182996],
          [120.62044887430865,31.463967611926922],
          [120.62084131511095,31.466841882952455],
          [120.621150678328,31.469161558059316],
          [120.6213422693141,31.470684482732384],
        ],
        [
          [120.62165921886638,31.47064580051874],
          [120.62140826910706,31.46879417884222],
          [120.62112566374363,31.46682912544909],
          [120.6208790265205,31.46512861913634],
          [120.62055791263856,31.46314340370653],
          [120.62023048990486,31.46129658159939],
          [120.61992701675258,31.459513605313337],
          [120.61959419335554,31.457575689501223],
          [120.619198204425,31.455322592676357],
          [120.61892263391447,31.45377649084322],
          [120.61867220047516,31.45230293373811],
        ],
      [
        [120.60752221916923,31.461410937538865],
        [120.61215869403159,31.46102524760006],
        [120.61438675331088,31.45991859197167],
        [120.6168163880603,31.458719392247264],
        [120.61900327228632,31.45763241584612],
        [120.61952783015248,31.457383305138812],
        [120.6201313692786,31.457262295772697],
        [120.62228333037294,31.456871757294476],
        [120.62578033784919,31.456231811580533],
      ],
      [
        [120.62627711253452,31.463059784959857],
        [120.62343718562619,31.463375628199046],
        [120.62090310809724,31.4636537760141],
        [120.61914383103482,31.464361552586716],
        [120.61632454379169,31.465426712967076],
        [120.614109642718,31.466235337314178],
        [120.61246678409437,31.46677353428971],
        [120.60790563416629,31.46717956142558],
      ],


      ]
      for(let i=0;i<lines.length;i++){

        let entity = viewer.entities.add({
          polyline:{
            positions:lines[i].map(item => {
              return new Cesium.Cartesian3.fromDegrees(...item,2)
            }),
            width: option.width,
            material: new Cesium.RoadTrailMaterialProperty(Cesium.Color.fromCssColorString(option.color), option.duration,option.image),
          }
        })
        this.roadFlowlineEntities.push(entity)
      }
    },
    removeRoadFlowlines(){
      let entities = this.roadFlowlineEntities
      for(let i=0;i<entities.length;i++){
        this.viewer.entities.remove(entities[i])
      }
      this.roadFlowlineEntities = []
    },
    addCustomWall(){
      if(this.wallEntities.length){
        return
      }
      let viewer = this.viewer

      let walls =[
        [120.61944303974542,31.46153775056373],
        [120.61921273759721,31.461576381065843],
        [120.61889633907312,31.461626984126166],
        [120.61865871332662,31.461723894874194],
        [120.61841130496093,31.461842277549696],
        [120.61837283016776,31.46201612752312],
        [120.61855443368665,31.46236743241797],
        [120.61875134180363,31.46275838475964],
        [120.61891055292253,31.46309935091062],
        [120.61907346515704,31.46343183837083],
        [120.61919060981008,31.463692528161857],
        [120.61932090588023,31.463962295515977],
        [120.61954964295514,31.463881436410148],
        [120.619800583605,31.463791121367535],
        [120.62001048872695,31.463704370604464],
        [120.61993152164591,31.463408657148758],
        [120.61983121490647,31.463023420738363],
        [120.61974495312006,31.462667714583503],
        [120.61965742635252,31.46228104883279],
        [120.61955434669318,31.46188317429385],
        [120.61944303974542,31.46153775056373],
      ]


      const material = this.getCustomMaterialWall({
        id:'mainWall',
        image:require('../../asserts/images/map/meteor_01.png'),
        freely:'cross', // vertical cross
        direction:"-",
        count:1,
        color:Cesium.Color(62/255, 78/255, 112/255, 0.1),
        duration:20000

          // id:'mainWall',
          // // image:require('../../asserts/images/bg_bottom.png'),
          // image:require('../../asserts/images/map/b2.png'),
          // freely:'vertical', // vertical cross
          // direction:"+",
          // count:1,
          // color:Cesium.Color(62/255, 78/255, 112/255, 0.1),
          // duration:2000
      })
      let entity = viewer.entities.add({
        wall:{
          positions:walls.map(item => {
            return new Cesium.Cartesian3.fromDegrees(...item,10)
          }),
          material:material
        }
      })
      this.wallEntities.push(entity)

    },
    removeCustomWalls(){
      let entities = this.wallEntities
      for(let i=0;i<entities.length;i++){
        this.viewer.entities.remove(entities[i])
      }
      this.wallEntities = []
    },

    addCars() {
      // const postionsArr = [
      //   [
      //     [120.62012809700481,31.461242793149935],
      //     [120.62045202986239,31.463197083450716]
      //   ],
      //   [
      //     [120.62023110888138,31.463202009447283],
      //     [120.61937268478611,31.458106544504975]
      //   ]
      // ]
      const cars = [
        {
          positions:[
            [120.62012809700481,31.461242793149935],
            [120.62045202986239,31.463197083450716],
            [120.62051448876126,31.463405213293512],
            [120.62051387196969,31.46350831253622],
            [120.6204701694348,31.463635371668104],
            [120.62040557536713,31.4637688484382],
            [120.6203070399916,31.46388983708523],
            [120.62013544087269,31.463992201620155],
            [120.61987043469702,31.464111093552553],
            [120.61846236028458,31.46473444776037]
          ],
          // heading:3.5,
          heading:0,
          url:'/screen/gltf/car3.gltf',
          steps:1000
        },
        {
          positions:[
            [120.62026140320306,31.46324488933337],
            [120.61942208101154,31.458181755500778]
          ],
          heading:0,
          url:'/screen/gltf/car3.gltf',
          steps:1000
        },
         {
          positions:[
            [120.61986115074342,31.46123383743261],
            [120.6194730628526,31.461351957956303],
            [120.61946260424625,31.461395845776767],
            [120.61942716551594,31.461442762986447],
            [120.61936503358571,31.461469164901548],
            [120.61930100879061,31.461464781195655],
            [120.61922086184691,31.461439251483583],
            [120.61865357884179,31.46161716750475],
            [120.61823298293267,31.461742729408197],
            [120.61809547889182,31.461777776114634],
            [120.61792190570613,31.461778024776752],
            [120.6169903932935,31.461662443219783]
          ],
          heading:0,
          url:'/screen/gltf/car3.gltf',
          steps:1000
        },
        {
          positions:[
            [120.61877711313477,31.4579315646425],
            [120.61750789470202,31.458569195168433],
            [120.61617654898015,31.459233805672838],
            [120.61457622312857,31.460025235495163],
            [120.61228471191582,31.461155669492246],
            [120.6118482252812,31.461387786863412],
            [120.611440106064,31.46145523101609],
            [120.6096338718828,31.461572011167966],
            [120.60740297093056,31.461728690235724]
          ],
          heading:0,
          url:'/screen/gltf/car3.gltf',
          steps:1500
        },{
          positions:[
           [120.61416970878992,31.460185499555827],
           [120.61451539873732,31.460698088543843],
           [120.61466442323238,31.46091671623215],
           [120.6147807926883,31.461084760289854],
           [120.61499903688912,31.461412253293954],
           [120.61529901664579,31.461856232427067],
           [120.61553950873447,31.462205283888665]
          ],
          heading:0,
          url:'/screen/gltf/car3.gltf',
          steps:1000
        },{
          positions:[
           [120.6167165838691,31.465125889137095],
           [120.61643041208812,31.46471704770754],
           [120.61629103091389,31.4644509404929],
           [120.61612878826972,31.464065381033894],
           [120.6160245544329,31.46372922210776],
           [120.61596404318486,31.463348283086184],
           [120.61595678683307,31.462902897373066],
           [120.61597681343561,31.46269913266498],
           [120.61577749998452,31.462462901616743]
          ],
          heading:0,
          url:'/screen/gltf/car3.gltf',
          steps:1000
        },{
          positions:[
           [120.61549929039963,31.46573234757408],
           [120.61649312810867,31.465398609518406],
           [120.61703794087143,31.46521277202992],
           [120.61741699650442,31.465086855699063],
           [120.61774867923792,31.464970258193826],
           [120.61808260216259,31.464825037577018],
           [120.61848237680101,31.464656259367075],
           [120.61900068185983,31.464438026664503],
           [120.61942871526492,31.464254590258385],
           [120.61978580549788,31.464100485269523],
           [120.61997807247027,31.464009957664242],
          ],
          heading:0,
          url:'/screen/gltf/car3.gltf',
          steps:1000
        }
      ]
      
      const carsArr = []
      for(let i=0;i<cars.length;i++){
        let car = cars[i]

        let points = car.positions
        for(let i=0;i<points.length;i++){
          // this.drawPoints([...points[i],4])
        }
        // this.drawLine(points,4)
        this.addFlowline(points.map(item => {
          return new Cesium.Cartesian3.fromDegrees(...item,4)
        }))

        carsArr.push(this.addCar(car.positions,car.heading,car.url,car.steps))
      }
      this.addCarTracks(carsArr)
    },

    addCar(positions,heading,url,steps = 500) {
      const routes = this.setRouteData(positions,steps)
      // console.log(routes)
      const position = [...positions[0],3]
      // var heading = heading;
      // heading = Cesium.Math.toRadians(0)
      var pitch = 0;
      var roll = Cesium.Math.toRadians(0);
      var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
      var orientation = Cesium.Transforms.headingPitchRollQuaternion(new Cesium.Cartesian3.fromDegrees(...position), hpr);
      let carEntity = this.viewer.entities.add({
        name:'car',
        position:new Cesium.Cartesian3.fromDegrees(...position),
        orientation:orientation,
        model:{
          uri:url,
          // uri:'/gltf/qiche.gltf',
          // uri:'/gltf/Cesium_Air.glb',
          // uri:carModel,
          // scale:0.001,
          show:true,
          // minimumPixelSize: 54,
          // maximumScale: 1,
        }
      })
      return {
        carEntity,
        routes,
        heading
      }
    },

    addCarTracks(cars){
      for(let i=0;i<cars.length;i++){
        const {carEntity,routes,heading} = cars[i]
        console.log(heading)
        this.animateCar(carEntity,routes,0,heading)
      }
    },

    addCarTrack () {
      const positions = [
        [120.62012809700481,31.461242793149935],
        [120.62045202986239,31.463197083450716]
      ]
      const routes = this.setRouteData(positions,500)
      console.log(routes)
      const position = [...positions[0],4]
      var heading = 3.3;
      var pitch = 0;
      var roll = Cesium.Math.toRadians(0);
      var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
      var orientation = Cesium.Transforms.headingPitchRollQuaternion(new Cesium.Cartesian3.fromDegrees(...position), hpr);
      let carEntity = this.viewer.entities.add({
        name:'car',
        position:new Cesium.Cartesian3.fromDegrees(...position),
        orientation:orientation,
        model:{
          uri:'/screen/gltf/car2.gltf',
          // uri:'/gltf/qiche.gltf',
          // uri:'/gltf/Cesium_Air.glb',
          // uri:carModel,
          // scale:0.001,
          show:true,
          // minimumPixelSize: 54,
          // maximumScale: 1,
        }
      })
      // this.viewer.flyTo(carEntity)

      this.animateCar(carEntity,routes,0)
    },
    
    animateCar(entity,positions,idx,head=0){
      // console.log(head)
      const that = this
      const height = 4
      if(idx===positions.length-1){
        entity.position = new Cesium.Cartesian3.fromDegrees(...positions[idx],height)
        idx = 0
      }else {
        const position = positions[idx]
        const heading = Cesium.Math.toRadians(turf.rhumbBearing(turf.point(positions[idx]),turf.point(positions[idx+1])))
        // console.log()
        // var heading = this.calRadians(...positions[idx],...positions[idx+1]);
        // console.log(heading)
        var hpr = new Cesium.HeadingPitchRoll(heading, 0, 0);
        var orientation = Cesium.Transforms.headingPitchRollQuaternion(new Cesium.Cartesian3.fromDegrees(...position,height), hpr);
        entity.orientation = orientation;
        entity.position = new Cesium.Cartesian3.fromDegrees(...position,height);
        idx += 1
      }
      window.requestAnimationFrame(function(){
        that.animateCar(entity,positions,idx,head)
      })
    },

    drawPoints(position){
      this.viewer.entities.add({
        position:new Cesium.Cartesian3.fromDegrees(...position),
        point:{
          pixelSize:6
        }
      })
    },
    drawLine(positions,height=4){
      this.viewer.entities.add({
        // position:new Cesium.Cartesian3.fromDegrees(...position),
        polyline:{
          positions:positions.map(item => {
            return new Cesium.Cartesian3.fromDegrees(...item,height)
          })
        }
      })
    },

    
    flyTo(name){
      this.viewer.camera.flyTo(this.cameraInfo[name])
    },
    // 添加 bloom相关配置GUI
    addBloomGUI(viewer){
      let bloom = viewer.scene.postProcessStages.bloom;

      let Options = function () {
          this.contrast = bloom.uniforms.contrast;
          this.brightness = bloom.uniforms.brightness;
          this.delta = bloom.uniforms.delta;
          this.gamma = viewer.scene.gamma;
          this.enabled = bloom.enabled;
          this.highDynamicRange = viewer.scene.highDynamicRange;
          this.shadows = viewer.shadows;
          this.glowOnly = bloom.uniforms.glowOnly;
          this.sigma = bloom.uniforms.sigma;
          this.stepSize = bloom.uniforms.stepSize;
      }
      let option = new Options();

      let gui = new dat.GUI();
      gui.__closeButton.innerHTML = "收缩面板";


      gui.add(option, 'enabled').name("bloom").onChange(function (value) {
          bloom.enabled = value;
      })
      gui.add(option, 'glowOnly').name("发光").onChange(function (value) {
          bloom.uniforms.glowOnly = value;
      })
      gui.add(option, 'enabled').name("启用模糊").onChange(function (value) {
          bloom.enabled = value;
          // bloom.highDynamicRange = value;
      })
      gui.add(option, 'contrast', -255.0, 255.0, 1).name("对比度").onChange(function (value) {
          bloom.uniforms.contrast = value;
      })
      gui.add(option, 'brightness', -1.0, 1.0, 0.01).name("光泽亮度").onChange(function (value) {
          bloom.uniforms.brightness = value;
      })
      gui.add(option, 'delta', 1, 5, 0.01).name("因子").onChange(function (value) {
          bloom.uniforms.delta = value;
      })
      gui.add(option, 'sigma', 1, 10, 0.01).name("sigma").onChange(function (value) {
          bloom.uniforms.sigma = value;
      })
      gui.add(option, 'stepSize', 0.1, 10).name("stepSize").onChange(function (value) {
          bloom.uniforms.stepSize = value;
      })
      gui.add(option, 'shadows').name("启用阴影").onChange(function (value) {
          viewer.shadows = value;
      })
      gui.add(option, 'highDynamicRange').name("高动态范围").onChange(function (value) {
          viewer.scene.highDynamicRange = value;
      })
      gui.add(option, 'gamma', 1, 10, 0.01).name("伽马亮度").onChange(function (value) {
          viewer.scene.gamma = value;
      })
    },

    // 添加垂直的光线
    addCityVerticalFlowline(viewer){
      const positions = [
        [120.61934611985478,31.461657365151904],
        [120.6192919160028,31.461718836791064],
        [120.61929639934546,31.4617827987103]
      ]
      for (let i = 0; i<positions.length;i++) {
        const pos = positions[i]
        const start = Cesium.Cartesian3.fromDegrees(...pos,0)
        const stop = Cesium.Cartesian3.fromDegrees(...pos,100)

        viewer.entities.add({
          polyline: {
            positions: [start, stop],
            width: 3,
            material: new Cesium.PolylineCityLinkMaterialProperty({
              color: new Cesium.Color(77 / 255, 201 / 255, 255 / 255, 1),
              duration: 4000
            }),
          }
        });
      }
    },
    addBuildingFlowlines(viewer){
      viewer = viewer||this.viewer
      if(this.buildingFlowlineEntities.length){
        return
      }
      const lines = [
        // 北楼
        [
          [120.61960099715338,31.46304677236365,98],
          [120.61924927060328,31.463118087637547,98],
          [120.6193335626627,31.46344483255224,98],
          [120.61968579013454,31.463378851146878,98],
          [120.61960099715338,31.46304677236365,98],
        ],
        [
          [120.61960099715338,31.46304677236365,2.5],
          [120.61924927060328,31.463118087637547,2.5],
          [120.6193335626627,31.46344483255224,2.5],
          [120.61968579013454,31.463378851146878,2.5],
          [120.61960099715338,31.46304677236365,2.5],
        ],
        [
          [120.61960099715338,31.46304677236365,0],
          [120.61960099715338,31.46304677236365,98],
        ],
        [
          [120.61924927060328,31.463118087637547,98],
          [120.61924927060328,31.463118087637547,0],
        ],
        [
          [120.6193335626627,31.46344483255224,0],
          [120.6193335626627,31.46344483255224,98],
        ],
        [
          [120.61968579013454,31.463378851146878,98],
          [120.61968579013454,31.463378851146878,0],
        ],
        // 南楼
        [
          [120.6193012385419,31.461806711347535,69],
          [120.61895024238541,31.461873480090905,69],
          [120.61902713203882,31.462201082363876,69],
          [120.61938177628103,31.462138302090327,69],
          [120.6193012385419,31.461806711347535,69],
        ],
        [
          [120.6193012385419,31.461806711347535,2.5],
          [120.61895024238541,31.461873480090905,2.5],
          [120.61902713203882,31.462201082363876,2.5],
          [120.61938177628103,31.462138302090327,2.5],
          [120.6193012385419,31.461806711347535,2.5],
        ],
        [
          [120.6193012385419,31.461806711347535,69],
          [120.6193012385419,31.461806711347535,0],
        ],
        [
          [120.61895024238541,31.461873480090905,69],
          [120.61895024238541,31.461873480090905,0],
        ],
        [
          [120.61902713203882,31.462201082363876,69],
          [120.61902713203882,31.462201082363876,0],
        ],
        [
          [120.61938177628103,31.462138302090327,69],
          [120.61938177628103,31.462138302090327,0],
        ],
        // 裙楼
        [
          [120.61941252188561,31.462647509565492,39.5],
          [120.61906825057586,31.462708118048894,39.5],
          [120.61914580994387,31.462997727723074,39.5],
          [120.61948614577017,31.462937040068976,39.5],
          [120.61941252188561,31.462647509565492,39.5]
        ],
        [
          [120.61941145060156,31.46226449957329,28.5],
          [120.61923856692275,31.462295696591084,28.5],
          [120.6193097644104,31.46258854057198,28.5],
          [120.61948328558601,31.462552991864975,28.5],
          [120.61941145060156,31.46226449957329,28.5],
        ]
      ]
      const option = {
        width: 5,
        // color: "#00BFFF",
        // color:"#4169e1",
        color:"#6ca2ff",
        // color:"#000000",
        duration:4000,
        // image:require('../../asserts/images/map/line6.png')
        image:require('../../asserts/images/map/line4.png')
      }
      for(let i=0;i<lines.length;i++){

        let entity = viewer.entities.add({
          polyline:{
            positions:lines[i].map(item => {
              return new Cesium.Cartesian3.fromDegrees(...item)
            }),
            width: option.width,
            // material: new Cesium.RoadTrailMaterialProperty(Cesium.Color.fromCssColorString(option.color), option.duration,option.image),
            material: new Cesium.PolylineTrailLinkMaterialProperty(Cesium.Color.fromCssColorString(option.color), option.duration,option.image),
          }
        })
        this.buildingFlowlineEntities.push(entity)
      }

    },
    removeBuildinglines(){
      let entities = this.buildingFlowlineEntities
      for(let i=0;i<entities.length;i++){
        this.viewer.entities.remove(entities[i])
      }
      this.buildingFlowlineEntities = []
    },

    // 添加平行光源
    addDirectionalLight(viewer,options){
      options = options|| {
        // color: Cesium.Color.BLUE,
        color:new Cesium.Color(0.01, 0.01, 0.3, 1),
        direction:new Cesium.Cartesian3(0.354925, -0.890918, -0.283358),
        intensity:0.1
      }
      viewer.scene.light = new Cesium.DirectionalLight(options)
    },

    addPointLights(viewer){
      const positions = [
        [120.61960497109798,31.462539450768848,20],
        [120.61940510671971,31.463213701571863,20]
      ]
      for(let i=0;i<positions.length;i++) {
        this.drawPoints(positions[i])
        this.smAddPointLight(viewer,positions[i])
      }
    },

    addRoadlamps(viewer){
      const option = {
        color:Cesium.Color.WHITE,
        distance:15,//光能到达的距离，默认100米
        intensity:3,//点光源强度
        angle: Math.PI/3*2,
        decay:0.9 //点光源衰减因子,越小随着距离衰减越小，越亮
      }
      const lamps = [
        {
          position:[120.62008994612789,31.46257426799254,15],
          targetPosition:[120.62008994612789,31.46257426799254,0]
        },
        {
          position:[120.62015762458381,31.462924748168174,15],
          targetPosition:[120.62015762458381,31.462924748168174,0]
        },
        {
          position:[120.62003436206697,31.462218024041732,15],
          targetPosition:[120.62003436206697,31.462218024041732,0]
        },
        {
          position:[120.62024203928097,31.46327804094181,15],
          targetPosition:[120.62024203928097,31.46327804094181,0]
        },
        {
          position:[120.62075663641674,31.46318851215327,15],
          targetPosition:[120.62075663641674,31.46318851215327,0]
        },
        {
          position:[120.62064560411864,31.46283900998658,15],
          targetPosition:[120.62064560411864,31.46283900998658,0]
        },
        {
          position:[120.61996599386157,31.461862373663255,15],
          targetPosition:[120.61996599386157,31.461862373663255,0]
        },
        {
          position:[120.61992810842699,31.46150518859581,15],
          targetPosition:[120.61992810842699,31.46150518859581,0]
        },
        {
          position:[120.6205832336853,31.46249373084523,15],
          targetPosition:[120.6205832336853,31.46249373084523,0]
        },
        {
          position:[120.62053171855908,31.462131131598778,15],
          targetPosition:[120.62053171855908,31.462131131598778,0]
        },
        {
          position:[120.62049234051297,31.461770997599594,15],
          targetPosition:[120.62049234051297,31.461770997599594,0]
        },
        {
          position:[120.62043198718746,31.461399120749014,15],
          targetPosition:[120.62043198718746,31.461399120749014,0]
        }
      ]
      for(let i=0;i<lamps.length;i++) {
        const {position,targetPosition} = lamps[i]
        this.drawPoints(position)
        this.smAddSpotLight(viewer,position,targetPosition,option)
      }
    },
  
    // ======== 编辑数据用 ===========
    dotEnable() {
      this.enableDot = !this.enableDot

      if(this.enablePoint){
        this.viewer.dataSources.remove(this.tempDataSource,true)
        this.tempPointsArr = []

        this.tempDataCollection.destroy()
        // this.viewer.dataSources.remove(this.tempDataSource,true)
        this.tempPoint = null
        this.tempPoint = null
        this.pointLng = null
        this.pointLat = null
        this.pointHeight = null
      }

      if(this.enableDot) {
        this.tempDataSource = new Cesium.CustomDataSource()
        this.viewer.dataSources.add(this.tempDataSource);
      }else {
        this.viewer.dataSources.remove(this.tempDataSource,true)
        this.tempPointsArr = []
      }
    },
    removeLastPoint() {
      this.tempPointsArr = [...this.tempPointsArr.slice(0,this.tempPointsArr.length-1)]
      // 绘制点和线
      this.linkPoints()
    },
    editHandler(movement){
      const viewer = this.viewer
      var position = viewer.scene.camera.pickEllipsoid(
        movement.position,
        viewer.scene.globe.ellipsoid
      );
      const pos = Cesium.Cartographic.fromCartesian(position);
      const lng = Cesium.Math.toDegrees(pos.longitude);
      const lat = Cesium.Math.toDegrees(pos.latitude);
      if(this.enableDot){
        this.tempPointsArr.push([lng,lat])
        // 绘制点和线
        this.linkPoints()
      }
      if(this.enablePoint){
        this.pointLng = lng
        this.pointLat = lat
        this.pointHeight = this.pointHeight?this.pointHeight:0
        this.drawTempIconPoint([lng,lat,this.pointHeight])
      }
    },
    linkPoints(){
      // const img = require("../../asserts/images/map/meteor_01.png")
      // const img = require("../../asserts/images/map/line2.jpg")
      const img = require("../../asserts/images/map/line6.png")
      const points = this.tempPointsArr
      this.tempDataSource.entities.removeAll()
      for(let i=0;i<points.length;i++){
        // this.drawPoints([...points[i],4])
        this.tempDataSource.entities.add({
          position:new Cesium.Cartesian3.fromDegrees(...points[i],2),
          point:{
            pixelSize:6
          }
        })
      }
      const positions = points.map(item => {
        return new Cesium.Cartesian3.fromDegrees(...item,2)
      })
      this.tempDataSource.entities.add({
         polyline: {
          positions:positions,
          // positions:Cesium.Cartesian3.fromDegreesArrayHeights(positions),
          width: 5,
          material: new Cesium.PolylineTrailLinkMaterialProperty(Cesium.Color.BLUE, 1000,img),
        } 
      })
    },
    // 完成本轮打点
    finishLine(){
      this.tempLinesArr.push([...this.tempPointsArr])
      const points = this.tempPointsArr
      this.tempDataSource.entities.removeAll()
      const positions = points.map(item => {
        return new Cesium.Cartesian3.fromDegrees(...item,4)
      })
      const img = require("../../asserts/images/map/meteor_01.png")

      this.viewer.entities.add({
         polyline: {
          positions:positions,
          // positions:Cesium.Cartesian3.fromDegreesArrayHeights(positions),
          width: 5,
          material: new Cesium.PolylineTrailLinkMaterialProperty(Cesium.Color.BLUE, 12000,img),
        } 
      })
      this.updatePointsString()
      this.tempPointsArr = []
    },
    updatePointsString(){
      const arr = this.tempLinesArr
      this.pointsString = ''
      console.log(arr)
      for(let i=0;i<arr.length;i++){
        const points = arr[i]
        this.pointsString+='[\n'
        for(let j=0;j<points.length;j++){
          const point = points[j]
          this.pointsString+=('['+point[0]+','+point[1]+'],\n')
        }
        this.pointsString+='],\n'
      }
    },

    pointEnable(){
      this.enablePoint = !this.enablePoint
      const viewer = this.viewer
      // 关闭打点连线功能
      if(this.enableDot) {
        this.enableDot = false
        this.viewer.dataSources.remove(this.tempDataSource,true)
        this.tempPointsArr = []
      }
     
      //=============================
      if(this.enablePoint) {
        this.tempDataCollection = new Cesium.BillboardCollection();
        viewer.scene.primitives.add(this.tempDataCollection);

        this.tempDataSource = new Cesium.CustomDataSource()
        this.viewer.dataSources.add(this.tempDataSource);
      }else{
        this.viewer.dataSources.remove(this.tempDataSource,true)
        this.tempPointsArr = []

        this.tempDataCollection.destroy()
        // this.viewer.dataSources.remove(this.tempDataSource,true)
        this.tempPoint = null
        this.pointLng = null
        this.pointLat = null
        this.pointHeight = null
      }
    },
    drawTempIconPoint(pos){
      if(this.tempPoint){
        this.tempDataCollection.remove(this.tempPoint)
      }
      this.tempDataSource.entities.removeAll()
      this.tempDataSource.entities.add({
        position:new Cesium.Cartesian3.fromDegrees(...pos),
        point:{
          pixelSize:6
        }
      })

      this.tempPoint = this.tempDataCollection.add({
        position:Cesium.Cartesian3.fromDegrees(...pos),
        // pixelOffset:Cesium.Cartesian2(0, -23),
        image:require("../../asserts/images/warnlocation_logo.png"),
        verticalOrigin:Cesium.VerticalOrigin.BOTTOM,
        horizontalOrigin:Cesium.HorizontalOrigin.CENTER
      })
      
    },
    updateTempPointPos(){
      this.drawTempIconPoint([this.pointLng,this.pointLat,this.pointHeight])
    },
    updateBuildingColor(val) {
      console.log(this.tilesetColor)
      const color = 'rgba('+this.colorToHex(this.tilesetColor)+','+this.tilesetColorOpacity+')'
      if(this.tileset){
        this.tileset.style = new Cesium.Cesium3DTileStyle({
          // show: "${name} !== 'Mesh2989'",
          color: {
            
            conditions: [
              // ["true", "rgba(255, 255, 255,0.60)"],
              ["true",color],
            ],
          },
        });
      }
    },

    getCameraView(){
      const info = this.viewerInfoGet(this.viewer)
      this.currentCameraInfo = 
        'position:'+info.position.toString() + '\n' +
        'heading:'+info.heading + '\n'+
        'roll:'+info.roll+'\n'+
        'pitch:'+info.pitch
    },

    //=========== 编辑数据用 END ==========
    
    buildingViewChange(name){
      this.currentViewType = 'building'
      const _this = this
      this.removeAll()
      // const floorNum = this.floors[name]
      // let floors = []
      // for(let i=floorNum;i>0;i--){
      //   floors.push(i)
      // }
      // this.currentBuildingFloors = floors
      console.log(this.floors)
      // if(this.liftTileset){
      //   this.liftTileset.destroy()
      // }
      this.removeLifts()

      if(this.floorTileset){
        this.floorTileset.destroy()
      }
      if(this.tempFloorTileset){
        this.tempFloorTileset.show = false;
        this.tempLegendShow = false
        this.hideTempLabels(this.viewer)
      }
      this.removTempLights()

      this.viewer.scene.globe.depthTestAgainstTerrain = true //地形检测
      this.tileset.show = true
      this.planeTileset.show = true
      this.bottomTileset.show = true

      this.resetStyle().resetMainTileset()

      // if(this.floorTileset){
      //   this.floorTileset.destroy()
      //   // this.viewer.scene.primitives.remove(this.floorTileset) //添加tileset
      // }
      this.hideUnderFloor()
      if(this.logoTileset){
        this.logoTileset.show = true
      }

      
      this.flyTo(name)

       // 若本地没有获取过该楼楼层数据,调用接口
      // this.currentBuildingFloors = this.floors[name]
      this.currentBuildingFloor = 0
      // this.viewerSelect = name

      this.setFloorDataByBuildingName(name)
      this.viewerSelect = name
      this.addBuildingLabel(name)
      this.addBuildingFlowlines(this.viewer)
      this.realTimeAlarmFunc(this.alarms,false)
    },

    // 根据楼幢名获取楼层信息
    async setFloorDataByBuildingName(name){
      if(!this.floorsData[name]){
        console.log(this.houseData)
        console.log(this.houseData[name].houseName)
        const houseId = this.houseData[name].houseId
        await this.getFloors(houseId).then(async res => {
          console.log(name,res)
          this.floorsData[name] = res
          this.floorsData[name].reverse()
          // 若地下车库楼层数据没有,获取
          if(!this.floorsData['under']){
            await this.getFloors(this.houseData.under.houseId).then(res => {
              console.log('地下车库楼层',res)
              let under_1 = null
              let under_2 = null
              // 取-1,-2层
              for(let i=0;i<res.length;i++){
                if(res[i].floorNum == -1){
                  under_1 = res[i]
                }else if(res[i].floorNum == -2){
                  under_2 = res[i]
                }
              }
              this.floorsData['under'] = [under_1,under_2]

              const floors = this.floorsData[name].concat(this.floorsData['under'])
              this.currentFloorsData = floors
              this.currentBuildingFloors = floors.map(item=>item.floorNum)
              // this.viewerSelect = name
            })
          }else{
            const floors = this.floorsData[name].concat(this.floorsData['under'])
            this.currentFloorsData = floors
            this.currentBuildingFloors = floors.map(item=>item.floorNum)
            // this.viewerSelect = name

          }
        })
      }else {
        const floors = this.floorsData[name].concat(this.floorsData['under'])
        this.currentFloorsData = floors
        this.currentBuildingFloors = floors.map(item=>item.floorNum)
        // this.viewerSelect = name

      }
    },
    
    backToCarPark(){
      // 如果当前为地下设备显示,那么则返回停车位显示状态
      if(this.currentViewType =='under_device'){
        console.log(3333333)
        this.removeAll()
        this.removeCarParkPoints()
        this.removeAlarmCircles()
        
        this.currentViewType = 'under'
        this.$refs.device.resetTypeSelect() 
        this.parkWebSocketConn()
      }
    },

    floorBackToBuilding(){
      
      // this.removePop('sx-device-pop')
      this.currentViewType = 'building'
      this.removeAll()
      this.removeCarParkPoints()
      this.removeDevicesInMap()
      this.removeAlarmCircles()
      // this.addCustomWall()
      this.buildingViewChange(this.viewerSelect)
      this.$emit('floorBackToBuilding')
    },
    mapBackToInit(){
      // return
      const _this = this
      // 清楚dom点位和dom弹窗
      this.removeAll()
      // 去除电梯
      // if(this.liftTileset){
      //   this.liftTileset.destroy()
      // }
      this.removeLifts()
      // 去除楼层
      if(this.floorTileset){
        this.floorTileset.destroy()
      }
      if(this.tempFloorTileset){
        this.tempFloorTileset.show = false;
        this.tempLegendShow = false
        this.hideTempLabels(this.viewer)
      }
      this.removTempLights()
      
      this.currentBuildingFloor = 0

      this.viewer.scene.globe.depthTestAgainstTerrain = true //地形检测

      if(this.planeTileset){
        this.planeTileset.show = true
      }
      if(this.bottomTileset){
        this.bottomTileset.show = true
      }
      if(this.logoTileset){
        this.logoTileset.show = true
      }

      this.removeCarParkPoints()
      this.removeAlarmCircles()
      this.hideUnderFloor()
      this.currentBuildingFloors = []
      this.viewerSelect = null
      if(this.buildingFlowlineEntities.length==0){
        console.log(")))))))))")
        this.addBuildingFlowlines()
      }
      this.resetStyle().resetMainTileset()

      this.flyTo('overview')
      this.currentViewType = 'init'
      // this.addCustomWall()
      // 报警点需要再显示出来
      this.realTimeAlarmFunc(this.alarms,false)

    },
    async selectFloor({floor,data},bool=false){

      const building = this.viewerSelect
      console.log('选择了'+building+'第'+floor+'层',data)
      this.currentBuildingFloor = floor
      this.hideUnderFloor()
      // if(this.liftTileset){
      //   this.liftTileset.destroy()
      // }
      this.removeLifts()
     
      // 清除所有点位和弹窗
      this.removeAll()
      this.removeCarParkPoints()
      this.removeCustomWalls()
      this.removeAlarmCircles()
      this.removeBuildingLabel()
      this.removeBuildinglines()
      if(floor>0){
        this.currentViewType = 'floor'
        const that = this
        this.tileset.show = true
        
        
        // this.tileset.tileVisible.addEventListener(function (tile) {
        //   // console.log(tile)
        //   // updateTile(tile);
        
        //   let shadar = `
        //   varying vec3 v_positionEC;
        //   void main(void){
        //   vec4 position = czm_inverseModelView * vec4(v_positionEC,1); // 位置
        //   float glowRange = 100.0; // 光环的移动范围(高度)
        //   // gl_FragColor = vec4(0.31,  0.74, 0.91, 1.0); // 颜色
        //   gl_FragColor = vec4(0.24,  0.31, 0.44, 1.0); // 颜色
        //   // gl_FragColor = vec4(0.2,  0.5, 1.0, 1.0); // 颜色
        //   gl_FragColor *= vec4(vec3((position.z + 10.0) / 30.0), 0.8); // 渐变
        //   //  gl_FragColor *= vec4(vec3((position.z + 5.0) / 60.0), 0.8); // 渐变
        //   // 动态光环
        //   float time = fract(czm_frameNumber / 180.0);
        //   time = abs(time - 0.5) * 2.0;
        //   float diff = step(0.005, abs( clamp(position.z / glowRange, 0.0, 1.0) - time));
        //   gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - diff);
        //   }
        // `;
        //   that.addCustomShadarToTiles(tile,shadar)
        // });
        this.planeTileset.show = true
        this.bottomTileset.show = true
        this.tileset.style = new Cesium.Cesium3DTileStyle({
          color:{
            conditions:[
              // ["${building}!=='"+building+"'","rgba(108, 162, 249,0.05)"],
              // ["${floor}>="+floor,"rgba(108, 162, 249,0)"],
              // ["true","rgba(108, 162, 249,0.05)"]
              ["${building}!=='"+building+"'","rgba(255, 255, 255,0.05)"],
              ["${floor}>="+floor,"rgba(255, 255, 255,0)"],
              ["true","rgba(255, 255, 255,0.05)"]
            ]
          }
        })
        this.viewer.scene.globe.depthTestAgainstTerrain = true
        this.addFloor3dtiles(this.viewer,building,floor)
       

        // 获取当前楼层设备
        const buildingId = this.houseData[building].houseId
        const floorId = data.houseId
        await this.getDevicesInfo(buildingId,floorId)

      }else{
        this.currentViewType = 'under'
        if(this.floorTileset){
          this.floorTileset.destroy() // 清楚楼层
        }
        if(this.tempFloorTileset){
          this.tempFloorTileset.show = false;
        this.tempLegendShow = false
        this.hideTempLabels(this.viewer)
        }
        this.removTempLights()

        this.tileset.show = false
        this.logoTileset.show = false
        this.planeTileset.show = false
        this.bottomTileset.show = false

        this.viewer.scene.globe.depthTestAgainstTerrain = false //地形检测

        await this.getDevicesInfo(data.parentId,data.houseId)

        this.addUnderFloor(this.viewer,floor)

        if(!this.carParkPosData[floor]){
          await this.getCarParkPos(data.houseId,floor)
        }
        
        this.parkWebSocketConn()
      }

      this.logoTileset.show = false

      if(!bool){
        this.$emit('floorSelect',data.houseId,data.floorNum,data.parentId)
      }

    },

    async getCarParkPos(floorId,floor){
      getParkPos({floorId}).then(res => {
        console.log('车位位置',res)
        if(res.code==200&&res.data&&res.data.length){
          const obj = {}
          res.data.forEach(item => {
            if(item.latitude&&item.longitude){
              obj[item.unitRoomName] = [item.longitude,item.latitude]
            }
          })
          this.carParkPosData[floor] = obj
        }
      })
    },

    hideUnderFloor(){
      if(this.under1FloorTileset){
        this.under1FloorTileset.show = false
      }
      if(this.under2FloorTileset) {
        this.under2FloorTileset.show = false
      }
    },
    addUnderFloor(viewer,floor){
      let tileset = floor==-1?this.under1FloorTileset:this.under2FloorTileset
      const _this = this
      const {URL,name} = this.getFloorTilesetURL(this.viewerSelect,floor)
      if(tileset){
        tileset.show = true

        if(this.currentViewType == 'lift'){
          this.viewer.camera.flyTo({
            ...this.cameraInfo['lift'],
          })
        }
        else if(this.floorCameraInfo[name]){
          viewer.camera.flyTo(this.floorCameraInfo[name])
        }else{
          viewer.flyTo(ts);//视角移动
        }
      }else{
        if(floor==-1){
          this.under1FloorTileset = new Cesium.Cesium3DTileset({
            url:URL,
            maximumScreenSpaceError:1,
            show:true
          })
          tileset = this.under1FloorTileset
        }else{
          this.under2FloorTileset = new Cesium.Cesium3DTileset({
            url:URL,
            maximumScreenSpaceError:1,
            show:true
          })
          tileset = this.under2FloorTileset
        }

      
        tileset.readyPromise.then(function (ts) {
          viewer.scene.primitives.add(ts) //添加tileset
          _this.update3dtilesMaxtrix(ts,_this.floorPosParams[name])
          if(_this.currentViewType == 'lift'){
            _this.viewer.camera.flyTo({
              ..._this.cameraInfo['lift'],
            })
          }else if(_this.floorCameraInfo[name]){
            viewer.camera.flyTo(_this.floorCameraInfo[name])
          }else{
            viewer.flyTo(ts);//视角移动
          }
          // update3dtilesMaxtrix(ts) // 更新tileset位置
        })
      }
      tileset.style = new Cesium.Cesium3DTileStyle({
        color:{
          conditions: [
            ["true","rgba(255,255,255,1)"]
          ],
        }
      }) 
    },
    getFloorTilesetURL(building,floor){
      let baseUrl = "screen/tileset/suxiang/floors/"
      let name = ''

      if(floor<0){
        return {
          URL:baseUrl + 'under_'+Math.abs(floor) + '/tileset.json',
          name:'under_'+Math.abs(floor)
        }
      }

      if(building === 'north'){
        if(floor>=9&&floor<=13){
          name = 'north_8'
        }else if(floor>=14 && floor<=21){
          name = 'north_14'
        }else{
          name = 'north_'+floor
        }
      }else {
        name = building+'_'+floor
      }
      // return baseUrl + name + '/tileset.json'
      return {
        URL:baseUrl + name + '/tileset.json',
        name:building+'_'+floor
      }
    },

    // 添加弹窗
    addAlarmPop(pos,id,data){
      // this.removePop()
      console.log("告警信息弹窗",data)
      pos = pos||[120.61967165096019,31.463361495323184,20]
      id=id?'sx-pop-'+id:'sx-pop-alarm'
      
      const deviceSatus = {
        '0':'正常',
        '1':'离线',
        '2':'故障',
        '3':'报废'
      }
      data = data||{
        type:'0',
        sortDes:'消防类报警报警',
        deviceName:'烟感传感器',
        buildingName:'南楼',
        buildingNum:1,
        floorNum:0,
        alarmTime:'2022-3-1 12:23',
        deviceStatus:'1',
        alarmMsg:'消防类报警',
        alarmId:''
      }

      this.curPopId = id;

      const img1 = require("../../asserts/images/map/bj.png")
      const img2 = require("../../asserts/images/map/arrow.png")
      const close = require("../../asserts/images/close.png")

      Cesium.Css3Renderer.addEntityLayer({
        id:id,
        position:pos,
        element:`
       <div id="${id}" style="position:absolute;transform: scale(0.8,0.8);transform-origin: left top;">
        <div class="sx-warn-pop-wrapper" >
          <div class="pop-line"></div>
          <div class="pop-content">
            <div style="display:flex;align-items:center;position:relative">
              <img src="${img1}" alt="">
              <span class="alarm-title">${data.sortDes}</span>
              <img class="close-btn" src="${close}" alt="">
            </div>
            <div class="split-line"></div>
            <div class="alarm-device-info">
              <div>
                <span class="sx-warn-label">设备名称:</span>
                <span class="sx-warn-content">${data.deviceName}</span>
              </div>
              <div>
                <span class="sx-warn-label">设备位置:</span>
                <span class="sx-warn-content">${data.deviceAddr}</span>
              </div>
              <div>
                <span class="sx-warn-label">报警信息:</span>
                <span class="sx-warn-content">${data.alarmMsg}</span>
              </div>
              <div>
                <span class="sx-warn-label">报警时间:</span>
                <span class="sx-warn-content">${data.alarmTime}</span>
              </div>
               <div>
                <span class="sx-warn-label">设备状态:</span>
                <span class="sx-warn-content">${deviceSatus[data.deviceStatus]}</span>
              </div>
            </div>
            <div class="monitor-content"></div>

            <div class="sx-warn-btns">
              <span class="sx-warn-btn no-bg sx-warn-detail">查看详情</span>
              `+
              (data.workOrder=='N'?`<span class="sx-warn-btn sx-warn-xj">消警</span>
              <span class="sx-warn-btn sx-warn-gd">生成工单</span>`:'')+
              (data.fireAlarmFlag?'<span class="sx-warn-btn sx-warn-xfbj">应急预案</span>':'')
            +`</div>
          </div>
        </div>
    </div>`,
        // offset:[0,-113], // scale 1
        // offset:[0,-57],// scale 0.5
        offset:[0,-90] // scale 0.8
      })

      // this.drawPoints([120.61967165096019,31.463361495323184,20])

      const pop = document.getElementById(id)
      const that = this
      // 关联场景内容
      const dom = pop.querySelector('.monitor-content')
      if(data.scene&&data.scene.pic){
        const img = document.createElement('img')

        const {alarmId,deviceId} = data
        const param = {
          fileUrl:data.scene.pic,
          alarmId,
          deviceId
        }

        getPhotoInfoByUrl(param).then(res =>{
          if(res.code=='200'&&res.data){
            const url = 'data:image/gif;base64,'+res.data
            img.src = url
            dom.appendChild(img)
          }else{
            dom.style.display = 'none'

          }
        }).catch(()=>{
          dom.style.display = 'none'
        })

        // img.width = "100%"
        // img.height = "100%"
        // img.src = data.scene.pic
        // dom.appendChild(img)
      }else {
        dom.style.display = 'none'
      }

      // 关闭
      const closeDom = pop.querySelector('.close-btn')
      closeDom.addEventListener('click',function(){
        that.removePop(id)
      })
      // 报警查看详情
      const detailDom = pop.querySelector('.sx-warn-detail')
      detailDom.addEventListener('click',function(){
        that.$emit('alarmDetailHandler',data)
        that.alarmDetailHandler(data)
      })
      const yjya = pop.querySelector('.sx-warn-xfbj')
      if(yjya){
        yjya.addEventListener('click',function(){
          that.$emit('alarmYJYAHandler',data)
           that.alarmDetailHandler(data,true)

        })
      }
      
      // 消警
      const xjDom = pop.querySelector('.sx-warn-xj')
      if(xjDom){
        xjDom.addEventListener('click',function(){
          that.alarmHandlerType = 0
          that.alarmHandlerData = data
          // that.alarmModal = true
          that.alarmHandler()
          that.removePop(id)
        })
      }
    
      //生成工单
      const gdDom = pop.querySelector('.sx-warn-gd')
      if(gdDom){
        gdDom.addEventListener('click',function(){
          that.alarmHandlerType = 1
          that.alarmHandlerData = data
          console.log(data)
          // that.alarmModal = true
          that.alarmHandler(gdDom,xjDom,data)
        })
      }
    
    },

    // 告警弹窗查看详情
    async alarmDetailHandler(data,isYJYA = false) {
      console.log("详情数据",data)
      // 目前告警点仅存在于 init 和 building 状态
      if(this.currentViewType=='init'){
        let name = data.buildingName
        const buildingNameMap = {
          '南楼':'south',
          '北楼':'north',
          '裙楼':'middle',
        }
        await this.setFloorDataByBuildingName(buildingNameMap[name])
        this.viewerSelect = buildingNameMap[name]
      }
      // else if(this.currentViewType=='building'){
        const {floorNum} = data
        const floors = this.currentFloorsData
        console.log('告警详情',floors,floorNum)
        for(let i=0;i<floors.length;i++){
          if(floorNum == floors[i].floorNum){
            const param = {floor:floorNum,data:floors[i]}
            this.$refs.floorSelector.updateCurrentBuildingFloor(floorNum)
            await this.selectFloor(param,true)
            console.log('该层设备类型列表',this.deviceTypeList)

            // 进入到告警的设备类型,并选中告警的设备
            this.$nextTick(()=>{
              const type = data.deviceTypeOne
              const list = this.deviceTypeList
              if(isYJYA){
                this.$refs.device.deviceSelectAll()
              }else{
                for(let i=0;i<list.length;i++){
                  if(list[i].deviceTypeOne == type){
                    this.$refs.device.deviceTypeSelect(i,list[i])
                  }
                }
              }
           
              this.$nextTick(()=>{
                this.addAlarmCircle(data.position,floorsHeight[data.floorNum]+1)
              })
            })
            // ....
            break
          }
        }
      // }
    },

    // 添加告警光圈
    addAlarmCircle(pos,height,color="#ff0000"){
      // let entity = this.viewer.entities.add({
      //     position: Cesium.Cartesian3.fromDegrees(
      //       ...pos
      //     ),
      //     ellipse: {
      //       height:height,
      //         semiMinorAxis: new Cesium.CallbackProperty(function(n) {
      //             return 5
      //         }, false),
      //         semiMajorAxis: new Cesium.CallbackProperty(function(n) {
      //             return 5
      //         }, false),
      //         material: new Cesium.CircleWaveMaterialProperty({
      //             duration: 3000,
      //             gradient: 0,
      //             color: new Cesium.Color.fromCssColorString('#ff0000'),
      //             count: 3,
      //         }),
      //     },
      // })
      let entity = this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(
          ...pos
        ),
        ellipse: {
          height: height,
          semiMinorAxis: 5.0,
          semiMajorAxis: 5.0,
          material: new Cesium.EllipsoidFadeMaterialProperty(
            Cesium.Color.fromCssColorString(color),
            2000
          ),
        },
      });
      this.alarmCircleEntities.push(entity)
    },
    removeAlarmCircles(){
      for(let i=0;i<this.alarmCircleEntities.length;i++){
        this.viewer.entities.remove(this.alarmCircleEntities[i])
      }
      this.alarmCircleEntities = []
    },

    addDevicePop(pos,id,deviceData){
      // temp
      // ====================
      getDeviceDetailByIdAndFlagReq({deviceId:id}).then(res => {
        console.log("设备详情",res)
        if(res.code == 200 && res.data){
          const data = res.data
          id = id?('sx-pop-'+id):'sx-pop-device'
          this.curPopId = id

          // 接口数据解析
          const valueData = data.valueData?data.valueData:[]
          let labelInfos = ``
          let monitor = ``
          for(let i = 0;i<valueData.length;i++){

            labelInfos += `
              <div>
                <span class="sx-device-label">${valueData[i].attrCn+':'}</span>
                <span class="sx-device-content">${valueData[i].value + (valueData[i].unit?valueData[i].unit:'')}</span>
              </div>
            `
          }
          if(data.videoFlag == 'Y'&& data.webSocketUrl){
            monitor = `<div class="monitor-content" style="height:180px">
              <video id="${'sx-device-monitor-'+id}" style="width:100%;height:180px" controls muted autoplay></video>
            </div>`
          }


          const img2 = require("../../asserts/images/map/arrow.png")
          const close = require("../../asserts/images/close_blue_1.png")
          const dom = `
            <div id="${id}" style="position:absolute;transform: scale(0.8,0.8);transform-origin: left top;">
              <div class="sx-device-pop-wrapper">
                <div class="pop-line"></div>
                <div class="pop-content" style="position:relative">
                  <div style="display:flex;align-items:center;position:relative">
                    <span class="device-title">${data.deviceName}</span>
                    <img class="close-btn" src="${close}" alt="">
                  </div>
                  <div class="split-line"></div>
                  <div class="device-info" style="margin-bottom:10px">
                  <div>
                    <span class="sx-device-label">设备状态:</span>
                    <span class="sx-device-content">${data.status}</span>
                  </div>
                  <div>
                    <span class="sx-device-label">设备位置:</span>
                    <span class="sx-device-content">${data.deviceAddr}</span>
                  </div>
                  ${labelInfos}
                  </div>
                ${monitor}
                </div>
              </div>
            </div>
          `
          Cesium.Css3Renderer.addEntityLayer({
            id:id,
            element:dom,
            position:pos,
            offset:[0,-135]
          })

          const pop = document.getElementById(id)
          const closeDom = pop.querySelector('.close-btn')
          const that = this
          closeDom.addEventListener('click',function(){
            that.removePop(id)
          })
          const videoId = 'sx-device-monitor-'+id
          const video = pop.querySelector('#'+videoId)
          if(video){
            this.flvPlay(video,data.webSocketUrl)
          }else {
            getDeviceDetailById({deviceId:data.deviceId}).then(res => {
              console.log('设备图表详情:',res)
              if(res.code==200&&res.data&&(res.data.initList||res.data.inList)){
                const chartDom = document.createElement('div')
                const chartId = 'sx-device-chart-'+id
                chartDom.id = 'sx-device-chart-'+id
                chartDom.setAttribute('class','sx-device-chart')
                pop.querySelector('.pop-content').appendChild(chartDom)
                this.initDeviceChart(chartDom,res.data)
              }
            })
          }

        }
      })
      // this.removePop(id)
      // id = id?('sx-pop-'+id):'sx-pop-device'
      // this.curPopId = id;
      // pos = pos||[120.61967165096019,31.463361495323184,75]
      // const img2 = require("../../asserts/images/map/arrow.png")
      // const close = require("../../asserts/images/close.png")
      // const dom = `
      //   <div id="${id}" style="position:absolute;transform: scale(0.8,0.8);transform-origin: left top;">
      //     <div class="sx-device-pop-wrapper">
      //       <div class="pop-content" style="position:absolute">
      //         <div style="display:flex;align-items:center;position:relative">
      //           <span class="device-title">消防水管</span>
      //           <img class="close-btn" src="${close}" alt="">
      //         </div>
      //         <div class="split-line"></div>
      //         <div class="device-info" style="margin-bottom:10px">
      //           <div>
      //             <span class="sx-device-label">设备标识</span>
      //             <span class="sx-device-content">EW213412</span>
      //           </div>
      //            <div>
      //             <span class="sx-device-label">设备状态</span>
      //             <span class="sx-device-content">离线</span>
      //           </div>
      //         </div>
      //         <div style="display:flex;align-items:center;margin-bottom:12px">
      //           <img src="${img2}" alt="">
      //           <span class="monitor-title">关联场景</span>
      //         </div>
      //       <div class="monitor-content"></div>
      //       </div>
      //     </div>
      //   </div>
      // `
      //  Cesium.Css3Renderer.addEntityLayer({
      //    id:id,
      //    element:dom,
      //    position:pos,
      //    offset:[25,-90]
      //  })

      // const pop = document.getElementById(id)
      // const closeDom = pop.querySelector('.close-btn')
      // const that = this
      // closeDom.addEventListener('click',function(){
      //   that.removePop(id)
      // })

    },

    // 添加车位弹窗
    addCarParkPop(pos,id,data){
      const that = this
      id = 'sx-pop-'+id
      this.curPopId = id;
      const {placeNo,carNo,imgInfo,area,entryTime,leasingName,floorName,licenseCarNo} = data
      console.log('停车位弹窗信息',data)
      // const placeNoDom = placeNo.split('').map(item=>`<span>${item}</span>`).join('')
      // const placeNoDom = placeNo.split('').map(item=>`<span>${item}</span>`).join('')
      const ownerDom = leasingName?`   <div class="park-owner-info">
                <div class="sx-pop-info-row">
                  <img class="arrow-pic" src="${require('../../asserts/images/arrow_white.png')}" alt="">
                  <span>车位所有人</span>
                </div>
                <span>${leasingName?leasingName:''}</span>
              </div>`:''
      const carNoDom = licenseCarNo?` <div class="car-no-info">
                <div class="sx-pop-info-row">
                  <img class="arrow-pic" src="${require('../../asserts/images/arrow_white.png')}" alt="">
                  <span>车位所有人车牌号</span>
                </div>
                <span>${licenseCarNo}</span>
              </div>`:''
      const carNoDom2 = carNo?` <div class="car-no-info">
                <div class="sx-pop-info-row">
                  <img class="arrow-pic" src="${require('../../asserts/images/arrow_white.png')}" alt="">
                  <span>车牌号</span>
                </div>
                <span>${carNo}</span>
              </div>`:''
      const entryTimeDom = ` <div class="entry-time-info">
                <div class="sx-pop-info-row">
                  <img class="arrow-pic" src="${require('../../asserts/images/arrow_white.png')}" alt="">
                  <span>停入时间</span>
                </div>
                <span>${moment(parseInt(entryTime)).format("YYYY-MM-DD HH:mm:ss")}</span>
              </div>`
      const dom = `
       <div id="${id}" style="position:absolute;top:0">
        <div class="sx-park-pop-wrapper">
          <div class="pop-line"></div>
          <div class="pop-content">
            <img class="sx-park-pic" src="" alt="">
            <div class="pop-info-wrapper">
              <div class="park-info">
                <span>${floorName}</span>
                <div class="park-no-wrapper">
                  ${placeNo}
                </div>
              </div>
              ${ownerDom}
              ${carNoDom}
              ${carNoDom2}
              ${entryTimeDom}
              </div>
            </div>
          <img class="close-btn" src="${require('../../asserts/images/close_blue.png')}" alt="">
          </div>
        </div>
      `
      Cesium.Css3Renderer.addEntityLayer({
        id:id,
        position:pos,
        element:dom,
        offset:[0,-118] // scale 0.8
      })
      const popDom = document.getElementById(id)
      const carImg = popDom.querySelector('.sx-park-pic')
      if(!imgInfo){
        carImg.src = require("../../asserts/images/no_pic.png")
      }else {
        carImg.src = imgInfo
      }

      const closeDom = popDom.querySelector('.close-btn')
      closeDom.addEventListener('click',function(){
        that.removePop(id)
      })
    },

    realTimeAlarmFunc(tempData,showPop=true){
      tempData = tempData || []
      // [
      //   {
      //     id:'realtime-alarm-0',
      //     position:[120.61934417961334,31.462408519018872,10]
      //   },
      //   {
      //     id:'realtime-alarm-1',
      //     position:[120.61937758038745,31.462783896956864,16]
      //   },
      //   {
      //     id:'realtime-alarm-2',
      //     position:[120.61937758038745,31.462783896956864,16]
      //   },
      //   {
      //     id:'realtime-alarm-3',
      //     position:[120.61934417961334,31.462408519018872,10]
      //   },
      //   {
      //     id:'realtime-alarm-4',
      //     position:[120.61915286702484,31.461897032815536,50]
      //   },
      //   {
      //     id:'realtime-alarm-5',
      //     position:[120.61949753790935,31.463204089075568,65]
      //   },
      // ]
      console.log('新增告警点',tempData)
      for(let i=0;i<tempData.length;i++){
        const {id,position,type} = tempData[i]

        if(position[0]&&position[1]){
          this.addAlarmPoint(tempData[i],type)
          if(showPop){
            this.addAlarmPop(position,id,tempData[i])
            setTimeout(()=>{
              this.removePop('sx-pop-'+id)
            },this.alarmPopAutoHideTime*1000)
          }
        }

        
        // if(this.alarmPopShowMaxCount>this.realTimeAlarmIds.length){
        //   this.realTimeAlarmIds.push(id)
        //   this.addAlarmPoint(tempData[i],type)
        //   this.addAlarmPop(position,id)
        // }else{
        //   const firstId = this.realTimeAlarmIds[0]
        //   this.removeAlarmPoint(firstId)
        //   this.removePop(firstId)

        //   this.realTimeAlarmIds = this.realTimeAlarmIds.slice(1)
        //   this.realTimeAlarmIds.push(id)
        //   this.addAlarmPoint(tempData[i])
        //   this.addAlarmPop(position,id)
        // }
        // setTimeout(()=>{
        //   this.removeAlarmPoint(id)
        //   this.removePop(id)
        // },this.alarmPopAutoHideTime*1000)
      }

    },
    // 删除弹窗
    removePop(id){
      // id = id?('sx-pop-'+id):'sx-warn-pop';

      Cesium.Css3Renderer.remove(id)
    },
    removeAll(){
      Cesium.Css3Renderer.removeAll()
    },
    // 刷新页面显示的报警点
    updateAlarmPoints(res){

      //  报警点每次只会多一个或者少一个,无例外
      let alarms = []
      let alarmIds = []

      // 当前页面已有报警id
      const alarmIdsExist = this.alarms.map(item => item.id)

      let alarmsAdd = []
      let alarmIdsRemove = []

      for(let i=0;i<res.length;i++){
        const type = res[i].type

        // 一般报警不需要展示报警点
        if(type!='2'){
          const data = res[i].deviceList
          const arr = data.map(item => {
            alarmIds.push(item.alarmId)
            const height = this.floorsHeight[item.floorNum?item.floorNum:0]
            if(!alarmIdsExist.includes(item.alarmId)){
              alarmsAdd.push({
                ...item,
                id:item.alarmId,
                position:[item.longitude,item.latitude,height],
                type
              })
            }
            return {
              ...item,
              id:item.alarmId,
              position:[item.longitude,item.latitude,height],
              type
            }
          })
          alarms = alarms.concat(arr)
        }
      }
      this.alarms = alarms

     
      // 新增
      console.log(alarmsAdd,alarmIds,alarmIdsExist)
      if(alarmIds.length>alarmIdsExist.length){
        this.realTimeAlarmFunc(alarmsAdd)
        this.playAlarmAudio()
      }else{
        // 减少
        console.log(alarmIds,alarmIdsExist)
        for(let i=0;i<alarmIdsExist.length;i++){
          const id = alarmIdsExist[i]
          if(!alarmIds.includes(id)){
            // 移除 已经消除的告警点和其弹窗
            this.removeAlarmPoint(id)
          }
        }
      }
    },

    // 添加报警点
    addAlarmPoints(data){
      console.log('报警点位',data)
      const type = data.type
      this.alarms = data.deviceList.map(item => {
        const height = this.floorsHeight[item.floorNum?item.floorNum:0]
        return {
          ...item,
          id:item.alarmId,
          position:[item.longitude,item.latitude,height]
        }
      })

      const alarmPoints = this.alarms
      this.removeAlarmPoints()
      for(let i=0;i<alarmPoints.length;i++){
        this.addAlarmPoint(alarmPoints[i],type)
      }
    },
    // 添加单个报警点
    addAlarmPoint(data,type){
      const that = this
      // const img = require("../../asserts/images/map/red.png")
      const img1 = require("../../asserts/images/map/red.png")
      const img2 = require("../../asserts/images/map/yellow.png")

      const img = type==0?img1:img2
      const id = data.id
      data.type = type
      Cesium.Css3Renderer.addEntityLayer({
        id:id,
        position:data.position,
        boxShow: false,
        circleShow: false,
        element:`<img class="alarm-point-gif${type}" id="${id}" style="position:absolute;width:20px;height:20px" src="${img}" alt="">`,
        offset:[-10,-10] // 
      })
      const dom = document.getElementById(id)
      dom.addEventListener('click',function(){
        that.removePop(that.curPopId)
        that.addAlarmPop(data.position,id,data)
      })
    },
    removeAlarmPoint(id){
      Cesium.Css3Renderer.remove(id)
      // 告警点弹窗也要消除
      const popId = 'sx-pop-'+id
      Cesium.Css3Renderer.remove(popId)
    },
    removeAlarmPoints(){
      const alarmPoints = this.alarms
      for(let i=0;i<alarmPoints.length;i++){
        this.removeAlarmPoint(alarmPoints[i].id)
        // Cesium.Css3Renderer.remove(alarmPoints[i].id)
      }
    },

    // 绘制设备点位
    drawDevicesBillboards(data){
      data = data||[]
      this.removeDevicesInMap()
      for(let i = 0;i<data.length;i++){
        this.devicesBillboardCollection.add({
          position:Cesium.Cartesian3.fromDegrees(...data[i].position),
          image:require("../../asserts/images/devices/red_xfsg.png"),
          verticalOrigin:Cesium.VerticalOrigin.BOTTOM,
          horizontalOrigin:Cesium.HorizontalOrigin.CENTER
        })
      }
    },
    drawDevicesPoints(value) {
      if(this.currentViewType == 'under'){
        this.currentViewType = 'under_device'
      }
      this.removeAlarmCircles()
      value = value||[]
      // this.removeDevicesInMap()
      this.removeAll()
      this.removeCarParkPoints()

      const colorMap = ['blue','grey','red','orange']
      for(let i=0;i<value.length;i++){
        const data = value[i]
        const id = data.id
        let className = deviceIconsClass[data.deviceName]?deviceIconsClass[data.deviceName]:deviceIconsClass['其他']
        className = 'iconfont icon-'+className

        const dom = `<div id="${id}" style="position:absolute;top:0">
          <div class="${'sx-device-point '+colorMap[data.status]}">
            <div class="sx-device-point-name-bg">
            <span class="sx-device-point-name">${data.deviceName}</span>
             <i class="custom-bg-block left-top"></i>
              <i class="custom-bg-block left-bottom"></i>
              <i class="custom-bg-block right-top"></i>
              <i class="custom-bg-block right-bottom"></i>
            </div>
            <i class="${className}"></i>
          </div>
        </div>`

        
        // const color = data.status == 1?"#"
        Cesium.Css3Renderer.addEntityLayer({
          id:id,
          position:data.position,
          boxShow: false,
          circleShow: false,
          element:dom,
          offset:[0,0]
        })
        this.devicePointIds.push(id) //将页面目前显示的设备id保存起来
        const popDom = document.getElementById(id)
        const that = this
        popDom.addEventListener('click',function(){
          // that.removeAll()
           that.removePop(that.curPopId)
           if(id=='temp'){
            that.drawTempDevicePop(data)
            return
           }
           if(id == 'temp2'){
            that.drawTemp2DevicePop(data)
            return 
           }

           that.addDevicePop(data.position,id,data)
        })
      }
    },
    // 清楚设备点位
    removeDevicesInMap(){
      const ids = this.devicePointIds
      for(let i = 0;i<ids.length;i++){
        Cesium.Css3Renderer.remove(ids[i])
        const popId = 'sx-pop-'+ids[i]
        Cesium.Css3Renderer.remove(popId)
      }
      this.devicePointIds = []
    },


    // 停车位停车点位
    updateCarParkPoints(data){
      const _this = this
      // floorNum = floorNum||-1
      data = data|| [
        // {id:0,status:0,position:[120.61919306014715,31.46231407752899],floorNum:-1},
        // {id:1,status:1,position:[120.61919306014715,31.46231407752899],floorNum:-1},
        // {id:2,status:2,position:[120.61920861172473,31.46239057072064],floorNum:-1},
        // {id:3,status:0,position:[120.61886115536717,31.46237600977431],floorNum:-1},
        // {id:4,status:0,position:[120.61906423558348,31.46249484029241],floorNum:-1},
        // {id:5,status:0,position:[120.61928069068618,31.462687554708726],floorNum:-1},
      ]
      const floor = this.currentBuildingFloor
      
      data = data.filter((item) => {
        return floor == item.floorNum
      })
      const pos = this.carParkPosData[floor]

      data.forEach((item,idx) => {
        item.id = item.placeNo
        // item.position = [parseFloat(item.longitude),parseFloat(item.latitude)]
        item.position = pos[item.placeNo]
        if(!item.position){
          return
        }

        // 每层的车位号是唯一的,用车位号作为id
        if(this.carPointsIds.includes(item.placeNo)&&item.dataType==='outParkingPlace'){
          console.log("车辆驶出",item)
          // 删除驶出的车辆车位信息
          Cesium.Css3Renderer.remove(item.placeNo)
          const popId = 'sx-pop-'+item.placeNo
          Cesium.Css3Renderer.remove(popId)

          const idx = this.carPointsIds.indexOf(item.placeNo)
          this.carPointsIds.splice(idx,1)
        }else if(item.dataType === 'inParkingPlace'&&!this.carPointsIds.includes(item.placeNo)) {
          console.log("车辆驶入",item)
          this.carPointsIds.push(item.placeNo)
          
          const img = carSvgURLs[item.rentFlag?1:0]
          this.carPointsIds.push(item.placeNo)
          Cesium.Css3Renderer.addEntityLayer({
            id:item.placeNo,
            position:[...item.position,floorsHeight[item.floorNum]],
            boxShow: false,
            circleShow: false,
            element:`<div id="${item.placeNo}" style="position:absolute"><img style="width:20px;height:40px;opacity:0" src="${img}" alt=""></div>`,
            // offset:[-13.5,-50]
            offset:[-10,-36]
          })
          const dom = document.getElementById(item.placeNo)
          const imgDom = dom.querySelector('img')
          imgDom.style.animationDelay = idx*0.5 +'s'
          imgDom.classList.add('sx-park-img')

          dom.addEventListener('click',function(){
            _this.removePop(_this.curPopId)
            _this.addCarParkPop([...item.position,floorsHeight[item.floorNum]+1.5],item.placeNo,item)
          })
        
        }
      })

      // for(let i=0;i<data.length;i++){
      //   const img = carSvgURLs[data[i].status]
      //   this.carPointsIds.push(data[i].id)
      //   Cesium.Css3Renderer.addEntityLayer({
      //     id:data[i].id,
      //     position:[...data[i].position,floorsHeight[data[i].floorNum]+1.5],
      //     boxShow: false,
      //     circleShow: false,
      //     element:`<img id="${data[i].id}" style="position:absolute;width:20px;height:40px" src="${img}" alt="">`,
      //     // offset:[-13.5,-50]
      //     offset:[-10,-36]
      //   })
      //   const dom = document.getElementById(data[i].id)
      //   dom.addEventListener('click',function(){
      //     _this.removePop(_this.curPopId)
      //     _this.addCarParkPop([...data[i].position,floorsHeight[data[i].floorNum]+1.5],data[i].id,data)
      //   })
      // }
    },
    removeCarParkPoints(){
      const ids = this.carPointsIds
      for(let i=0;i<ids.length;i++){
        Cesium.Css3Renderer.remove(ids[i])
        const popId = 'sx-pop-'+ids[i]
        Cesium.Css3Renderer.remove(popId)
      }
      this.carPointsIds = []
      this.carData = []
      this.parkWebSocketClose()
    },

    mapClickHandler(movement){
      const viewer = this.viewer
      const scene = viewer.scene
      const pickObject = scene.pick(movement.position)
      console.log(pickObject)
      console.log(pickObject instanceof Cesium.Cesium3DTileFeature)
      // 如果点击对象是倾斜摄影,目前不做任何处理
      if(pickObject instanceof Cesium.Cesium3DTileFeature){
        // if(this.currentViewType=='under'){
        //   console.log(pickObject.getPropertyNames());
        //   console.log(pickObject.getProperty("name"));
        //   console.log(pickObject.getProperty("id"));
        //   const name = pickObject.getProperty("name")
        //   this.under1FloorTileset.style = new Cesium.Cesium3DTileStyle({
        //       color: {
        //           conditions: [
        //               ["${name} ==='" + name + "'", "rgba(0, 0, 255,1)"],
        //               // ["true", "rgba(255, 200, 200,1)"]
        //           ]
        //       }
        //   });
        // }
          
        return
      }
      // 点击primitive
      if(pickObject&&pickObject.primitive){
        // 此处为确认点击对象和获取点击对象相关信息的地方
        // ........
        
        // 获取坐标,显示弹窗
        // this.removePop('sx-device-pop')
        // this.removeAll()
        // const pos = this.cartesian3ToLnglat(viewer,pickObject.primitive.position)
      }
    },

    // 点击一般告警
    commonAlarmHandler(){
      this.$emit('commonAlarmHandler')
    },

    // 实时告警websocket
    alarmWebSocketConn(){
      const token = getToken().replace("bearer", "").trim();
      const url = process.env.VUE_APP_WEBSOCKET_URL + 'iot/map-warning-info/MAP_WARN?access_token=' + token
      console.log(url)
      this.alarmSocket = new WebSocket(url)

      this.alarmSocket.onopen = () => {
        console.log('socket连接成功')
        // this.alarmSocket.send('!!!!!!!!!')
      }
      this.alarmSocket.onerror = () => {
        console.log('socket连接失败')
      }
      this.alarmSocket.onclose = () =>{
        console.log('socket连接关闭')
      }
      this.alarmSocket.onmessage = (res) => {
        const data = JSON.parse(res.data)
        console.log('socket推送',data)
        this.alarmData = data
        // 如果现在为楼层页面,则不更新报警点
        if(this.currentViewType!=='init'&&this.currentViewType!=='building'){
          return 
        }
        this.updateAlarmPoints(data)
      }
    },
    // 关闭实时告警socket
    alarmWebSocketClose(){
      if(this.alarmSocket){
        this.alarmSocket.close()
      }
    },

    // 停车位socket
    parkWebSocketConn() {
      const token = getToken().replace("bearer", "").trim();
      const url = process.env.VUE_APP_WEBSOCKET_URL + 'iot/traffic/PARKING_DATA?access_token=' + token
      this.parkSocket = new WebSocket(url)
      this.parkSocket.onopen = () => {
        console.log('停车位socket连接成功')
      }
      this.parkSocket.onerror = () => {
        console.log('停车位socket连接失败')
      }
      this.parkSocket.onclose = () =>{
        console.log('停车位socket连接关闭')
      }
      this.parkSocket.onmessage = (res) => {
        const data = JSON.parse(res.data)

        console.log('停车位socket推送',data)
        this.updateCarParkPoints(data)
      }
    },
    parkWebSocketClose() {
      if(this.parkSocket) {
        this.parkSocket.close()
        this.parkSocket = null
      }
    },

    // 获取告警信息
    getMapWarnInfo(){
      getMapWarnInfo().then(res => {
        console.log('告警信息',res)
        if(res.code == '200'&&res.data&&res.data.length){
          this.alarmData = res.data
        }
      })
    },
    getCanLossAssetList(){
      getCanLossAssetList().then(res => {
        console.log('资产',res)
        if(res.code=='200'&&res.data&&res.data.records){
          let parentId = res.data.records[0].id
          let params = {
            type:2,
            parentId
          }
          this.getHouseList(params)
        }
      })
    },
    // 获取楼幢
    getHouseList(params) {
      getHouseList(params).then(res => {
        console.log('楼幢',res)
        if(res.code =='200'&&res.data.length){
          const data = res.data
          let south  = null
          let north = null
          let middle = null
          let under = null
          for(let i=0;i<data.length;i++){
            if(data[i].houseName === '南楼'){
              south = data[i]
              south._type = 'south'
            }else if(data[i].houseName === '北楼'){
              north = data[i]
              north._type = 'north'
            }else if(data[i].houseName === '裙楼'){
              middle = data[i]
              middle._type = 'middle'
            }else{
              under = data[i]
              under._type = 'under'
            }
          }
          this.houseData = {
            south,
            north,
            middle,
            under
          }
          this.buildingData = [
            south,middle,north
          ]
          
        }
        // if(res.code == '200' && res.data[0]){
        //   this.houseData = res.data

        //   // =======
        //   let houseId = res.data[0].houseId
        //   this.getFloors(houseId)
        // }
      })
    },
    getFloors(houseId) {
      const params = {
        type:3,
        parentId:houseId
      }
      return getHouseList(params).then(res => {
        console.log('楼层',res)
        if(res.code == '200'){
          return Promise.resolve(res.data)
        }else{
          return Promise.resolve([])
        }
        // if(res.code=='200'&&res.data[0]){
        //   let floorId = res.data[0].houseId
        //   this.getDevicesInfo(houseId,floorId)
        // }
        // ============
      }).catch(err => {
        return Promise.resolve([])
      })
    },
    dataInit(){
      this.getCanLossAssetList()
    },
    async getDevicesInfo(buildingId,floorId) {
      await getDevicesInfo({buildingId,floorId}).then(res => {
        if(res.code=='200'&&res.data){
          const deviceTypeList = res.data.typeList?res.data.typeList:[];
          const deviceList = res.data.deviceList?res.data.deviceList:[]
          console.log('设备',res)
          console.log(this.currentBuildingFloor == -1)
          let typeId = ''
          if(this.currentBuildingFloor == -1){
            for(let i=0;i<deviceTypeList.length;i++){
              if(deviceTypeList[i].deviceTypeOneName == "消防类设备"){
                typeId = deviceTypeList[i].deviceTypeOne
                break
              }
            }
           const type = {
            deviceTypeOne:'1',
            deviceTypeOneName:"BA设备",
            status:'Y'
           }
           
           const device = {
            id:'temp',
            deviceTypeOne:"1",
            deviceTypeOneName:"BA设备",
            deviceName:'空调外机',
            deviceAddr:'-1楼停车场',
            floorNum:-1,
            longitude:120.61946140161137,
            latitude:31.463360956350986,
            status:0,
           } 
           const device2 = {
            id:'temp2',
            deviceTypeOne:typeId,
            deviceTypeOneName:"消防类设备",
            deviceName:"火灾报警器",
            deviceAddr:'-1楼停车场',
            floorNum:-1,
            longitude:120.61897479007074,
            latitude:31.462233637407078,
            status:0,
           }
           this.deviceTypeList = [
            type,
            ...deviceTypeList
           ]
           this.deviceList = [
            device,
            device2,
            ...deviceList
           ]
           console.log(this.deviceTypeList)
           console.log(this.deviceList)
           return 
          }
          this.deviceTypeList = deviceTypeList
          this.deviceList = deviceList
        }
      })
    },

    // 消警/生成工单
    alarmHandler(gdDom,xjDom,alarmData){
      const res = this.alarmHandlerData
      const id = res.alarmId
      const flag = this.alarmHandlerType
      const {type,alarmId,alarmMsg} = res
      const data = {
        type,
        flag,
        alarmId,
        describtion:alarmMsg
      }
      generateOrderReq(data).then(res => {
        console.log(res)
        // 如果成功,前端进行删除,因为websocket推送的延迟性
        if(flag===0&&res.code=='200'){
          this.removeAlarmPoint(alarmId)
        }else if(flag===1&&res.code=='200'){
          // 生成工单成功
          if(gdDom){
            gdDom.style.display = 'none'
            xjDom.style.display = 'none'
            for(let i=0;i<this.alarms.length;i++){
              if(this.alarms[i].id === id){
                console.log('生成工单的告警',this.alarms[i])
                this.alarms[i].workOrder = 'Y'
                this.alarmHandlerData.workOrder = 'Y'
                break
              }
            }
          }
        }
      })
      // this.alarmModal = false
    },

    // 电梯websocket
    liftWebSocketConn() {
      const token = getToken().replace("bearer", "").trim();
      const host = process.env.NODE_ENV === 'development'?'ws://10.10.11.48:8080/':process.env.VUE_APP_WEBSOCKET_URL
      const url = host + 'iot/deviceManage/SCREEN_LIFT?access_token=' + token
      this.liftSocket = new WebSocket(url)
      this.liftSocket.onopen = () => {
        console.log('电梯socket连接成功')
      }
      this.liftSocket.onerror = () => {
        console.log('电梯socket连接失败')
      }
      this.liftSocket.onclose = ()=> {
        console.log('电梯socket连接关闭')
      }
      this.liftSocket.onmessage = (res) => {
        const data = JSON.parse(res.data)
        console.log('电梯socket推送',data)
        this.updateLift3dtiles(data)
      }

    },

    liftWebSocketClose() {
      if(this.liftSocket) {
        this.liftSocket.close()
        this.liftSocket = null
      }
    },
    updateLift3dtiles(data){
      if(this.liftsTileset){
        // 如果电梯已加载,则更新状态
        for(let i = 0;i<data.length;i++){
          let liftTileset = this.liftsTileset[liftsIDMap[data[i].deviceId]]
          if(liftTileset){
            // const color = data[i].status=='0'?'rgba(0,255,0,1)':'rgba(255,0,0,1)'
            const color = data[i].status=='0'?'rgba(0,255,0,1)':(data[i].status=='2'?'rgba(252, 136, 69, 1)':'rgba(255,0,0,1)')

            liftTileset.setColor(color)
            const height = floorsHeight[data[i].currentFloor]
            liftTileset.liftMove(height)
          }
        }
      }else{
        this.addLift3dtiles(data)
      }
    },

    // 告警提示音
    playAlarmAudio(){
      console.log("!!!!!!!!!!!!!!!!!")
      const audio = document.getElementById('sx-alarm-cue-audio');
      audio.play()
    },
    
    resetStyle(){
      const that = this
      return {
        resetMainTileset:() => {
          if(this.tileset) {
            this.tileset.show = true
            let conditions = [
              ["true","rgba(255,255,255,0.3)"]
            ]
            if(this.tempZL){
              conditions=[
               
                ["${building}!=='north'","rgba(220, 220, 220,0.3)"],
                ["true","rgba(135, 206, 250, 0.3)"]
              ]
            }
            this.tileset.style = new Cesium.Cesium3DTileStyle({
              color:{
                conditions:conditions
              }
            })
            // this.addMain3dtilesCustomShadar(this.tileset)
          }
        },
      }
    },

    removeBuildingLabel(){
      Cesium.Css3Renderer.remove('sx-map-building-label')
      // this.removeAlarmCircles()
    },

    addBuildingLabel(type){
      this.removeBuildingLabel()
      type = type||this.viewerSelect
      const params = {
        'south':[120.61912719610156,31.46200201441786,75],
        'middle':[120.61932932913955,31.462608635196943,55],
        'north':[120.61949502183096,31.463228030314045,105]
      }
      const nameMap = {
        south:'南楼',
        middle: '裙楼',
        north:'北楼'
      }
      const name = nameMap[type]
      const id = 'sx-map-building-label'
      const dom = `
        <div id="${id}" style="position:absolute">
          <div class="sx-building-label">
           <div class="sx-building-label-bt"></div>
          <div class="sx-building-label-wrapper">
            <span>${name}</span>
          </div>
          </div>
        </div>
      `
      Cesium.Css3Renderer.addEntityLayer({
        id:id,
        position:params[type],
        element:dom,
        offset:[-48,-55]
        // offset:[-60,-45]
      })
      // this.addAlarmCircle(params[type],params[type][2],'#04D3E6')
      
    },

    flvPlay(dom,url){
      if (flvjs.isSupported()) {
            let video =dom
            // if (video) {
            //     this.player = flvjs.createPlayer({
            //         type: "flv",
            //         isLive: true,
            //         url: `http://192.168.10.14/live?port=1935&app=live&stream=mystream`
            //     });
            //     this.player.attachMediaElement(video);
            //     try {
            //         this.player.load();
            //         this.player.play();
            //     } catch (error) {
            //         console.log(error);
            //     };
            // }
            if (video) {
                const player = flvjs.createPlayer({
                  type: 'flv',
                  isLive: true,
                  hasAudio: false,
                  hasVideo: true,
                  enableStashBuffer: true,
                  stashInitialSize: 128,
                  url: url
                  // url: 'http://192.168.10.14/live?port=1935&app=live&stream=mystream'
                });
                player.attachMediaElement(video);
                try {
                    player.load();
                    player.play();
                } catch (error) {
                    console.log(error);
                };
            }
        }
    },
    initDeviceChart(dom,data){
      const mychart = echarts.init(dom)
      if(data.initList){
        const xData = []
        const yData = []
        data.initList.forEach(item => {
          xData.push(item[1])
          // yData.push(item[0])
          yData.push(10)
        })
        const option = {
          grid:{
            containLabel:true,
            bottom:10,
            top:15,
            left:10,
          },
          tooltip:{
            trigger:'axis'
          },
          xAxis:[
            {
              splitNumber: 4,
              type:'time',
              axisTick:{show:false},
              axisLine:{
                lineStyle:{
                  color:"#fff"
                }
              },
              axisLabel:{
                formatter:function(value){
                  return moment(value).format("HH:mm")
                },
                // showMinLabel: true,
                showMaxLabel:true,
                // rotate:30,
                // padding:[0,3]
              },
              data:xData
            }
          ],
          yAxis:[
            {
              type:'value',
              axisLine:{
                lineStyle:{
                  color:"#fff"
                }
              },
              axisLine:{
                show:true,
                lineStyle:{
                  color:"#fff"
                }
              },
              splitLine:{
                show:false
              }
            }
          ],
          series:[
            {
              type:"line",
              lineStyle:{
                color:'#65B9FF'
              },
              data:data.initList
            }
          ]
        }
        mychart.setOption(option)
      }
    },


    // =============== 临时演示用 Start=======================
    tempAddFloor3dtiles(viewer){
      this.tempLegendShow = true
      this.tempZL = false
      this.showTempLabels(viewer)

      if(this.tempFloorTileset){
        this.tempFloorTileset.show = true
        viewer.camera.flyTo(this.floorCameraInfo['north_22'])

        return
      }
      const URL = "/screen/tileset/suxiang/floor_temp/tileset.json"
      const tileset = new Cesium.Cesium3DTileset({
        url:URL,
        maximumScreenSpaceError:1,
        show:true,
      })
      const _this = this
      tileset.readyPromise.then(function(ts){
        viewer.scene.primitives.add(ts) //添加tileset
        let params = {
           tx: 120.619471,  //模型中心X轴坐标（经度，单位：十进制度）
            ty: 31.463246,    //模型中心Y轴坐标（纬度，单位：十进制度）
            tz:70,    //模型中心Z轴坐标（高度，单位：米）
            rx: 0,    //X轴（经度）方向旋转角度（单位：度）圆心应该是在地心，改动其中一个值的时候，不止变化了该变量，比如改动ry，模型的高度也有了显著上升
            ry: 0,    //Y轴（纬度）方向旋转角度（单位：度）
            rz:258.1     //Z轴（高程）方向旋转角度（单位：度）
        }
         //旋转
        var mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(params.rx));
        var my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(params.ry));
        var mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(params.rz));
        var rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
        var rotationY = Cesium.Matrix4.fromRotationTranslation(my);
        var rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);
        //平移
        var position = Cesium.Cartesian3.fromDegrees(params.tx, params.ty, params.tz);
        
        var m = Cesium.Transforms.eastNorthUpToFixedFrame(position);
        //旋转、平移矩阵相乘
        Cesium.Matrix4.multiply(m, rotationX, m);
        Cesium.Matrix4.multiply(m, rotationY, m);
        Cesium.Matrix4.multiply(m, rotationZ, m);
        var scale = Cesium.Matrix4.fromUniformScale(4.2)
        Cesium.Matrix4.multiply(m, scale, m)
        //赋值给tileset
        tileset._root.transform = m;

      })
      tileset.allTilesLoaded.addEventListener(function(){
        console.log("???????")
        _this.tempFloorTileset = tileset
        _this.tempSetStyle(tileset)
        // tileset.style = new Cesium.Cesium3DTileStyle({
        //   color: {
        //     conditions: [
        //       // ["true", "rgba(108, 162, 249,0.0)"],
        //       // ["${name}==='R_1101'",'rgba(0,255,0,1)'],
        //       ["${name}==='R_1102'",'rgba(255,0,0,1)'],
        //       ["${name}==='R_1103'",'rgba(255,255,0,1)'],
        //       ["${name}==='R_1104'",'rgba(0,255,0,1)'],
        //       ["${name}==='R_1105'",'rgba(255,255,0,1)'],
        //       ["${name}==='R_1106'",'rgba(0,255,0,1)'],
        //       ["${name}==='R_1107'",'rgba(0,255,0,1)'],
        //       ["${name}==='R_1108'",'rgba(255,255,0,1)'],
        //       ["${name}==='R_1109'",'rgba(0,255,0,1)'],
        //       ["${name}==='R_1110'",'rgba(0,255,0,1)'],
        //       ["${name}==='R_1111'",'rgba(0,255,0,1)'],
        //       ["true","rgba(0,255,255,0.7)"],
        //       // ["true", "rgba(108, 162, 249,0.3)"],
        //       // ["true", "rgba(255, 255, 255,0)"],
        //     ],
        //   },
        // });
        viewer.camera.flyTo(_this.floorCameraInfo['north_22'])

      })
    },
    tempSetStyle(tileset){
      const data = this.tempLabels
      const colors = ['rgba(61,158,255,1)','rgba(202,231,75,1)','rgba(127,246,175,1)','rgba(227,88,90,1)']
      const styleArr = data.map(item => {
        return ["${name}==='"+item.id+"'",colors[item.data.status]]
      })
      styleArr.push(["true","rgba(0,255,255,0.7)"])
       tileset.style = new Cesium.Cesium3DTileStyle({
          color: {
            conditions: styleArr
          },
        });
    },
    testFeatureClickHandler(movement){
      const scene = this.viewer.scene
      const pick = scene.pick(movement.position)
      console.log(pick)
      if(pick&&pick.id&&pick.id.extraData){

        this.removePop(this.tempPopId)

        const data = pick.id.extraData
        const id = 'test-room-'+id
        const status = ['已出租','未出租','商洽中','即将到期']
        const close = require("../../asserts/images/close_blue_1.png")

        const time = data.data.time?`<div>
                    <span class="sx-device-label">租赁时间:</span>
                    <span class="sx-device-content">${data.data.time}</span>
                  </div>`:''

        const dom = `
            <div id="${id}" style="position:absolute;transform: scale(0.8,0.8);transform-origin: left top;">
              <div class="sx-device-pop-wrapper">
                <div class="pop-line"></div>
                <div class="pop-content" style="position:relative">
                  <div style="display:flex;align-items:center;position:relative">
                    <span class="device-title" style="cursor:pointer">${data.label}</span>
                    <img class="close-btn" src="${close}" alt="">
                  </div>
                  <div class="split-line"></div>
                  <div class="device-info" style="margin-bottom:10px">
                  <div>
                    <span class="sx-device-label">出租状态:</span>
                    <span class="sx-device-content">${status[data.data.status]}</span>
                  </div>
                   <div>
                    <span class="sx-device-label"> 承租方:</span>
                    <span class="sx-device-content">${data.data.corp}</span>
                  </div>
                  <div>
                    <span class="sx-device-label">所占面积:</span>
                    <span class="sx-device-content">${data.data.area}</span>
                  </div>
                  ${time}
                  </div>
                </div>
              </div>
            </div>
          `
          Cesium.Css3Renderer.addEntityLayer({
            id:id,
            element:dom,
            position:data.position,
            offset:[0,-135]
          })
          this.tempPopId = id
          const pop = document.getElementById(id)
          const closeDom = pop.querySelector('.close-btn')
          const that = this
          closeDom.addEventListener('click',function(){
            that.removePop(id)
          })
          const title = pop.querySelector('.device-title')
          title.addEventListener('click',function(){
            if(data.data.status==0){
              window.open("http://192.168.2.177/asset/zhxxcx/htzhcx?id=6b859b65-d8f1-4d8b-b8b1-96e83454b3ce")
            }else if(data.data.status == 1){
              window.open("http://192.168.2.177/contract/rent-contract-management/new-contract?id=1")
            }
          })

      }
      // const feature = scene.pick(movement.position)

      // const data = {
      //   'R_1102':
      // }

      // console.log(feature.getProperty("name"));
      
    },
    drawTempDevicePop(data){
        const id = 'temp_pop';
        this.curPopId = id
        const pos = data.position
        const close = require("../../asserts/images/close_blue_1.png")
        const animateImg = require('../../asserts/images/map/logo26.png')
        const gif = require('../../asserts/images/map/11.gif')
        const dom = `
            <div id="${id}" style="position:absolute;transform: scale(0.8,0.8);transform-origin: left top;">
              <div class="sx-device-pop-wrapper">
                <div class="pop-line"></div>
                <div class="pop-content" style="position:relative;width:500px">
                  <img class="rotate-img" src="${animateImg}" alt="" style="position:absolute;top:65px;right:15px"/>
                  <div style="display:flex;align-items:center;position:relative">
                    <span class="device-title">${data.deviceName}</span>
                    <img class="close-btn" src="${close}" alt="">
                  </div>
                  <div class="split-line"></div>
                  <div class="device-info" style="margin-bottom:10px">
                  <div>
                    <span class="sx-device-label">设备状态:</span>
                    <span class="sx-device-content">正常</span>
                  </div>
                  <div>
                    <span class="sx-device-label">设备位置:</span>
                    <span class="sx-device-content">${data.deviceAddr}</span>
                  </div>
                  <img src="${gif}" style="width:100%">
                  </div>
                </div>
              </div>
            </div>
          `
          Cesium.Css3Renderer.addEntityLayer({
            id:id,
            element:dom,
            position:pos,
            offset:[0,-135]
          })
          const pop = document.getElementById(id)
          console.log(pop)
          const closeDom = pop.querySelector('.close-btn')
          const that = this
          closeDom.addEventListener('click',function(){
            that.removePop(id)
          })
    },
    // 临时演示添加的消防类报警数据
    drawTemp2DevicePop(data){
      const id = 'temp2_pop'
      this.curPopId = id
      const pos = data.position
      const close = require("../../asserts/images/close_blue_1.png")
      const img = require("../../asserts/images/map/img_temp.jpg")
      const dom = `
            <div id="${id}" style="position:absolute;transform: scale(0.8,0.8);transform-origin: left top;">
              <div class="sx-device-pop-wrapper">
                <div class="pop-line"></div>
                <div class="pop-content" style="position:relative;width:500px">
                  <div style="display:flex;align-items:center;position:relative">
                    <span class="device-title">${data.deviceName}</span>
                    <img class="close-btn" src="${close}" alt="">
                  </div>
                  <div class="split-line"></div>
                  <div class="device-info" style="margin-bottom:10px">
                  <div>
                    <span class="sx-device-label">设备状态:</span>
                    <span class="sx-device-content">正常</span>
                  </div>
                  <div>
                    <span class="sx-device-label">设备位置:</span>
                    <span class="sx-device-content">${data.deviceAddr}</span>
                  </div>
                  <img src="${img}" style="width:100%">
                  </div>
                </div>
              </div>
            </div>
          `
          Cesium.Css3Renderer.addEntityLayer({
            id:id,
            element:dom,
            position:pos,
            offset:[0,-135]
          })
          const pop = document.getElementById(id)
          console.log(pop)
          const closeDom = pop.querySelector('.close-btn')
          const that = this
          closeDom.addEventListener('click',function(){
            that.removePop(id)
          })
    },
    tempZLClick(){
      console.log(this.currentViewType)
      if(this.currentViewType !=='init'&&this.currentViewType!=='building'){
        return
      }
      this.tempZL = !this.tempZL
      const _this = this
      const tileset = this.tileset
      if(this.tempZL){
        
        tileset.tileVisible.addEventListener(function(tile){
          // console.log(tile)
          _this.removeCustomShadarToTiles(tile)
        })
        this.tileset.style = new Cesium.Cesium3DTileStyle({
          color:{
            conditions:[
              // ["${floor}>="+idx, "rgba(108, 162, 249, 0.0)"],
              // ["true","rgba(108, 162, 249, 0.3)"]
              ["${building} ==='north'","rgba(135, 206, 250, 0.3)"],
              ["${building} ==='south'","rgba(127, 255, 212	,0.3)"],
              ["true","rgba(255, 255, 255, 0.3)"]
            ]
          }
        })
      }else{
        this.tileset.style = new Cesium.Cesium3DTileStyle({
          color:{
            conditions:[
              ["true","rgba(255, 255, 255, 0.3)"]
            ]
          }
        })
        tileset.tileVisible.addEventListener(function(tile){
          _this.recoverCustomShadarToTiles(tile)
        })
      }
    }
    // =============== 临时演示用 End=======================

  },
  created(){
    // this.getMapWarnInfo()
    this.dataInit()
    // this.initWebSocket()
  },
  mounted () {
    this.initMap()
    this.alarmWebSocketConn()
    // this.flvPlay()
  },
  beforeDestroy() {
    this.removeAll()
  }
}
</script>

<style scoped>
.cesium-map {
  width: 100%;
  height: 100%;
  user-select: none;
  /* position: absolute; */
}
#cesium-container {
  width: 100%;
  height: 100%;
  position: relative;
}
.btn {
  padding: 5px 10px;
  border-radius: 3px;
  border: 1px solid #4db3ff;
  background: rgba(32, 160, 255, 0.2);
  cursor: pointer;
}
.btn:hover {
  background: #4db3ff;
}
.floor-group {
  padding: 10px;
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  font-size: 14px;
  display: flex;
  flex-direction: column;
}
.floor-group .btn {
  margin-bottom: 10px;
}
.viewer-group {
  position: absolute;
  bottom: 10px;
  left: 33.3%;
  transform-origin: center bottom;
  transform:  translateX(-50%);
  /* transform: translateX(-100%); */
  display: flex;
}
.viewer-group .viewer-box{
  width: 147px;
  height: 137px;
  color: #fff;
  font-size: 18px;
  padding-top: 40px;
  cursor: pointer;
  background: url("../../asserts/images/blue_btn.png") center no-repeat;
}
.viewer-group .viewer-box.cur{
  background: url("../../asserts/images/selected_btn.png") center no-repeat;
}
.edit-group{
  position: absolute;
  left: 20px;
  top: 20px;
  padding: 20px;
  color: #fff;
  background: rgba(32, 160, 255, 0.3);
  z-index: 999;
}
.edit-group .btn{
  margin-bottom: 10px;
}
@media screen and (max-width:1920px){
  .viewer-group{
    transform:  translateX(-50%) scale(0.7)
  }
}


</style>
<style lang="less">
.ys-css3-container{
  user-select: none;
  .sx-warn-pop-wrapper{
    display: flex;
    /* transform-origin: left top; */
    /* transform: scale(0.8,0.8); */
    /* flex-direction: column; */
  }
  .sx-warn-pop-wrapper .pop-line{
    width: 183px;
    height: 73px;
    background: url("../../asserts/images/pop_line.png");
    margin-top: 40px;
  }
  .sx-warn-pop-wrapper .pop-content{
    width: 380px;
    // max-height: 500px;
    /* width:190px;
    height:242px; */
    background: url("../../asserts/images/pop_box.png");
    background-size: 100% 100%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    text-align: left;
  }
  .sx-warn-pop-wrapper .pop-content .alarm-title{
    font-size: 18px;
    padding-left: 12px;
    color: #FF6D6D;
    line-height: 18px;
  }
  .sx-warn-pop-wrapper .pop-content .split-line{
    width: 100%;
    height: 1px;
    margin: 15px 0;
    background: linear-gradient(to right, #FF133B 0%, #FF133B 10%,rgba(255, 19, 59, 0.2) 10%,rgba(255, 19, 59, 0.2));
  }
  .sx-warn-pop-wrapper .pop-content .alarm-device-info{
    padding-left: 10px;
    font-size: 14px;
    color: #fff;
  }
  .sx-warn-pop-wrapper .pop-content .alarm-device-info .sx-warn-content{
    color: #F78F8F;
    padding-left: 5px;
  }
  .sx-warn-pop-wrapper .pop-content .alarm-device-info >div{
    margin-bottom: 8px;
  }
  .sx-warn-pop-wrapper .pop-content .monitor-title{
    color: #FF6D6D;
    padding-left: 12px;
    font-size: 16px;
  }
  .sx-warn-pop-wrapper .pop-content .monitor-content{
    border: 1px solid #FF6D6D;
    flex: 1;
    margin-bottom: 10px;
  }
  .sx-warn-pop-wrapper .pop-content .monitor-content img{
    width: 100%;
    height: 100%;
  }
  .sx-warn-pop-wrapper .sx-warn-btns{
    display: flex;
    padding-left: 12px;
    /* margin-bottom: 5px; */
  }
  .sx-warn-pop-wrapper .sx-warn-btns .sx-warn-btn{
    width: 79px;
    height: 26px;
    border-radius: 2px;
    background: rgba(255, 74, 74, 1);
    opacity: 0.8;
    color: #fff;
    font-size: 14px;
    text-align: center;
    line-height: 26px;
    cursor: pointer;
  }
  .sx-warn-pop-wrapper .sx-warn-btns .sx-warn-btn:hover{
    opacity: 1;
  }
  .sx-warn-pop-wrapper .sx-warn-btns .sx-warn-btn.no-bg{
    border: 1px solid #D74244;
    color: #D84345;
    background: transparent;
  }
  .sx-warn-pop-wrapper .sx-warn-btns .sx-warn-btn:not(:last-child){
    margin-right: 15px;
  }
  .sx-warn-pop-wrapper .close-btn{
    cursor: pointer;
    position: absolute;
    right: 0;
  }
  .sx-park-img{
    animation: iconDown 0.8s 1 forwards;
  }
}
@keyframes iconDown {
  0%{
    transform: translateY(-200%);
    opacity: 0;
  }
  100%{
    transform: translateY(0);
    opacity: 1;
  }
}

.alarm-point-gif0{
  animation: alarmPoint 0.8s linear infinite ;
}
.alarm-point-gif1{
  animation: alarmPoint 0.8s linear infinite ;
}
@keyframes alarmPoint {
  0%{
    opacity: 1;
  }
  100%{
    opacity: 0.3;
    /* filter: brightness(1.2); */
  }
}

</style>
<style lang="less">
  .ys-css3-container{
     .sx-device-pop-wrapper{
      display: flex;
      user-select: none;
      .pop-line{
        width: 196px;
        height: 82px;
        background: url("../../asserts/images/line_device_blue.png") center no-repeat;
        background-size: 100% 100%;
        margin-top: 53px;
      }
      // transform-origin: left top;
      .pop-content{
        width: 380px;
        height: auto;
        background: url("../../asserts/images/pop_device_blue.png") top center no-repeat;
        background-size: 100% 100%;
        padding: 20px 20px 12px 20px;
        display: flex;
        flex-direction: column;
        text-align: left;
        .close-btn{
          width: 20px;
          height: 20px;
          cursor: pointer;
          position: absolute;
          right: 0;
        }
        .device-title{
          font-size: 18px;
          // padding-left: 12px;
          color: #65B9FF;
          line-height: 18px;
        }
        .split-line{
          width: 100%;
          height: 1px;
          margin: 15px 0;
          background: linear-gradient(to right, #65B9FF 0%, #65B9FF 10%,rgba(101, 185, 255, 0.2) 10%,rgba(101, 185, 255, 0.2));
        }
        .device-info{
          padding-left: 10px;
          font-size: 14px;
          color: #fff;
        }
        .sx-device-content{
          color: #65B9FF;
          padding-left: 5px;
        }
        .monitor-title{
          color: #65B9FF;
          padding-left: 12px;
          font-size: 16px;
        }
        .monitor-content{
          border: 1px solid #65B9FF;
          flex: 1;
          margin-bottom: 15px;
        }
        .sx-device-chart{
          width: 100%;
          height: 200px;
          position: relative;
        }
      }
    }
    .sx-park-pop-wrapper{
      display: flex;
      position: absolute;
      .pop-line{
        width: 108px;
        height:57px;
        background: url("../../asserts/images/pop_line_blue.png");
        background-size: 100% 100%;
        margin-top: 36px;
      }
      .close-btn{
          width: 23px;
        height: 23px;
        position: absolute;
        right: 0;
        top: 0;
        transform: translate(50%,-5px);
        cursor: pointer;
      }
      .pop-content{
        width: 425px;
        height: 168px;
        background: url("../../asserts/images/msg_bg_blue.png");
        background-size: 100% 100%;
        padding: 20px 5px 23px 15px;
        display: flex;
        position: relative;
      
        .sx-park-pic{
          width: 150px;
          height: 113px;
        }
        .pop-info-wrapper{
          flex: 1;
          padding-left: 5px;
          .park-info{
            width: 100%;
            height: 45px;
            display: flex;
            padding: 0 5px 0 20px;
            align-items: center;
            justify-content: space-between;
            font-size: 16px;
            font-family: 'Source Han Sans SC';
            font-weight: bold;
            color: #fff;
            .park-no-wrapper{
              display: flex;
              padding-right: 10px;
              >span{
                width: 26px;
                height: 26px;
                border-radius: 4px;
                border: 1px solid #fff;
                display: flex;
                justify-content: center;
                align-items: center;
                &:not(:last-child){
                  margin-right: 1px;
                }
              }
            }
          }
          .arrow-pic{
            width: 11px;
            height: 12px;
            margin-right: 4px;
          }
          .sx-pop-info-row{
            display: flex;
            align-items: center;
          }
          .park-owner-info{
            margin-top: 6px;
            width: 100%;
            height: 24px;
            padding: 0px 20px 0 10px;
            // border: 1px solid #fff;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            color: #fff;
            font-weight: 400;
          }
          .car-no-info{
            width: 100%;
            height: 24px;
            padding: 0px 20px 0 10px;
            // border: 1px solid #fff;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            color: #fff;
            font-weight: 400;
          }
          .entry-time-info{
            width: 100%;
            height: 24px;
            padding: 0px 20px 0 10px;
            // border: 1px solid #fff;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            color: #fff;
            font-weight: 400;
          }
        }
      }

    }
    .sx-building-label{
      position: relative;
      width: 96px;
      height: 75px;
      .sx-building-label-wrapper{
        width: 96px;
        height: 60px;
        text-align: center;
        position: absolute;
        top: 0;
        background: url('../../asserts/images/map/label_bg.png');
        background-size: 100% 100%;
        color: #fff;
        font-size: 20px;
        font-weight: 500;
        padding-top: 5px;
        animation: sxBuildingLabelAnimate 8s infinite;
      }
      .sx-building-label-bt{
        width: 44px;
        height: 33px;
        background: url('../../asserts/images/map/label_bt.png');
        background-size: 100% 100%;
        position: absolute;
        bottom: 0;
        left: 21px;
      }
    }
    // .sx-building-label-wrapper{
    //   width: 120px;
    //   height: 45px;
    //   border: 2px solid #fff;
    //   display: flex;
    //   align-items: center;
    //   justify-content: center;
    //   color: #fff;
    //   font-size: 36px;
    //   font-weight: 500;
    //   border-radius: 5px;
    //   position: relative;
    //   animation: sxBuildingLabelAnimate 8s infinite;
    //   &::after{
    //     content:"";
    //     display: block;
    //     position: absolute;
    //     left: 50%;
    //     top: 100%;
    //     transform: translate(-50%,5px);
    //     border-top: 10px solid #fff;
    //     border-left: 10px solid transparent;
    //     border-right: 10px solid transparent;
    //   }
    // }
  }
 
  .sx-device-point{
    display: flex;
    flex-direction: column;
    font-size: 14px;
    align-items: center;
    cursor: pointer;
    transform: translate(-50%,-100%);
    .sx-device-point-name-bg{
      position: relative;
      padding: 2px 8px;
      background-size: 4.5% 100%;
      .custom-bg-block{
        width: 6px;
        height: 3px;
        display: block;
        position: absolute;
        &.left-top{
          left: 0;
          top: 0;
          transform: translateY(-50%)
        }
        &.left-bottom{
          left: 0;
          bottom: 0;
          transform: translateY(50%)
        }
        &.right-top{
          right: 0;
          top: 0;
          transform: translateY(-50%)
        }
        &.right-bottom{
          right: 0;
          bottom: 0;
          transform: translateY(50%)
        }
      }
    }
    &.grey{
      color:grey;
      .sx-device-point-name-bg{
        background-image: linear-gradient(to right,rgba(128, 128, 128, 0.15) 80%,rgba(128, 128, 128, 0) 20%);
        .custom-bg-block{
          background: rgba(128, 128, 128, 0.3);;
        }
      }
    }
    &.blue{
      color: rgb(0, 213, 255);
      .sx-device-point-name-bg{
        background-image: linear-gradient(to right,rgba(0, 213, 255, 0.15) 80%,rgba(0, 213, 255, 0) 20%);
        .custom-bg-block{
          background: rgba(0, 213, 255, 0.3);;
        }
      }
    }
    &.red{
      color:#E95254;
      .sx-device-point-name-bg{
        background-image: linear-gradient(to right,rgba(255, 59, 62, 0.15) 80%,rgba(255, 59, 62, 0) 20%);
        .custom-bg-block{
          background: rgba(255, 59, 62, 0.3);;
        }
      }
    }
    &.orange{
      color:rgb(252, 136, 69);
      .sx-device-point-name-bg{
        background-image: linear-gradient(to right,rgba(252, 136, 69, 0.15) 80%,rgba(252, 136, 69, 0) 20%);
        .custom-bg-block{
          background: rgba(252, 136, 69,0.3);;
        }
      }
    }
    .sx-device-point-name{
      font-weight: 500;
    }
    .iconfont{
      line-height: 40px;
      font-size: 32px;
    }
  }
  .alarm-modal{
    .ivu-modal-content{
      background-color: rgba(14, 46, 73, 1);
    }
    .ivu-modal-footer{
      border-top: 1px solid rgba(29, 65, 92, 1);
    }
    .ivu-modal{
      top: 50%;
      transform: translateY(-50%);
    }
  }

  // @keyframes sxBuildingLabelAnimate {
  //   25%{
  //     transform: translateY(20px);
  //   }
  //   50%{
  //     transform: translateY(0);
  //   }
  //   75%{
  //     transform: translateY(20px);
  //   }
  //   78%{
  //     transform: translateY(17px) rotateY(180deg);
  //   }
  //   81%{
  //     transform: translateY(14px) rotateY(0deg);
  //   }
  //   100%{
  //     transform: translateY(0);
  //   }
   
  // }
    @keyframes sxBuildingLabelAnimate {
    25%{
      transform: translateY(-20px);
    }
    50%{
      transform: translateY(0);
    }
    75%{
      transform: translateY(-20px);
    }
    // 78%{
    //   transform: translateY(-3px) rotateY(180deg);
    // }
    // 81%{
    //   transform: translateY(-6px) rotateY(0deg);
    // }
    100%{
      transform: translateY(0);
    }
   
  }
  .sx-device-pop-wrapper{
    .rotate-img{
      animation: rotate 2s linear  infinite;
    }
  }
  @keyframes rotate {
   
    100%{
        transform: rotate(-1turn);
    }
}

</style>

<style lang="less" scoped>
.alarm-modal {
  .alarm-modal-content{
    text-align: center;
    color: rgba(172, 187, 214, 1);
    font-size: 18px;
    margin: 15px 0;
  }
}
.alarm-btn-group{
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: rgba(172, 187, 214, 1);
  // font-size: 16px;
  .cancel-btn{
    cursor: pointer;
    // padding: 2px 10px;
    border-radius: 3px;
    // border:1px solid rgba(9, 113, 145, 1);
    margin: 0 20px;
    &:hover{
      color: rgba(9, 113, 145, 1);
    }
  }
  .confirm-btn {
     cursor: pointer;
    padding: 2px 10px;
    border-radius: 3px;
    // border:1px solid rgba(9, 113, 145, 1);
    background: rgba(9, 113, 145, 1);
    &:hover{
      filter: brightness(1.2);
    }
  }

}
.flv-box{
  width: 400px;
  height: 300px;
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 999;
  video{
    width: 100%;
    height: 100%;
  }
}

.temp-legends{
  position: absolute;
  top:100px;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateX(-50%);
  font-size: 24px;
  >div{
    display: flex;
    align-items: center;
    color: #fff;
    margin:0 15px;
    .color-block{
      width: 20px;
      height: 20px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
}

.temp-btn{
  cursor: pointer;
  font-size: 24px;
  color: #497ACC;
  // width: 69px;
  padding: 0 5px;
  height: 36px;
  line-height: 36px;
  background: rgba(8, 24, 44, 0.6);
  border: 1px solid #498FF8;
  opacity: 1;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 380px !important;
  margin-left: 30px !important;
  &:hover{
    color: #F6D70A;
    border: 1px solid #F6D70A;
  }
  &.cur{
    border: 1px solid #F6D70A;
    color: #fff;
    background: #FB8D2C;
  }
}

@media screen and (max-width:1920px){
  .temp-btn{
    transform-origin: left top;
    margin-left: 20px !important;
    top: 280px !important;
    transform:translate(10px,10px) scale(0.7)
    // top: 380px !important;
  }
  .temp-legends{
    transform:translateX(-50%) scale(0.7)
  }
}
@media screen and (max-width:1240px){
  .temp-btn{
    transform-origin: left top;
    margin-left: 20px !important;
    top: 240px !important;
    transform:translate(5px,5px) scale(0.5)
  }
  .temp-legends{
    transform: trtranslateX(-50%)ans scale(0.5)
  }
}


</style>