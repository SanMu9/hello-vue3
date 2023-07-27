<template>
  <div style="width:100%;height: 100%; position: absolute; top: 0">
    <div id="canvas_frame"></div>
    <div id="cssrender"></div>
    <div id="css2drender"></div>
    <div class="btn-group" :style="btnGroupStyle" v-if="CUR_MODE=='init'">
      <!-- <div  class="btn" @click="changeToDay">白天</div> -->
      <!-- <div  class="btn" @click="changeToNight">夜景</div> -->
    </div>


    <div class="viewer-group" v-if="SCENE_MODE=='day'&&!currentBuildingFloor&&!allAlarmsShow" :style="buildingSelectorStyle">
      <div
        class="viewer-box"
        v-for="(item, idx) in buildingData"
        :class="{ cur: viewerSelect === item.houseName }"
        @click="buildingViewChange(item.houseName)"
        :key="idx"
      >
        <span>{{ item.houseName }}</span>
      </div>
      <!-- <div 
        class="viewer-box"
        @click="(ev) => showGuanXian(ev)"
      >
        <span>管线</span>
      </div> -->
    </div>

    <alarm-group v-if="CUR_MODE!='FloorSelected'"  :alarmData="alarmData" @seriesAlarmHandler="()=>{}" @jzAlarmHandler="()=>{}" :style="alarmGroupStyle" @commonAlarmHandler="commonAlarmHandler"></alarm-group>
    <device-group :style1="buildingSelectorStyle" :style2="alarmGroupStyle" ref="device" v-if="currentBuildingFloor" @updateDevicePoint="drawDevicesPoints" :typeList="deviceTypeList" :deviceList="deviceList" :style="buildingSelectorStyle"></device-group>
    <device-group2 ref="device2" v-if="allDevicesShow||(CUR_MODE=='BuildingSelected'&&buildingDevicesShow)" @updateDevicePoint="drawDevicesPoints2" :typeList="deviceTypeList" :deviceList="deviceList" :buildingSelected="viewerSelect" :style="buildingSelectorStyle"></device-group2>
    <!-- <device-group3 ref="device3" v-if="allDevicesShow||CUR_MODE=='BuildingSelected'" @updateDevicePoint="drawDevicesPoints2" :typeList="allDeviceTypeList" :buildingSelected="viewerSelect" :style="buildingSelectorStyle"></device-group3> -->
    
    <floor-selector
      ref="floorSelector"
			:style="floorSelectorStyle"
      v-if="currentBuildingFloors.length"
      :floorsData="currentBuildingFloors"
      :currentBuildingFloors="currentBuildingFloors"
      :currentBuildingFloor.sync="currentBuildingFloor"
      :hoverBuildingFloor="hoverBuildingFloor"
      @floorBackToBuilding="floorBackToBuilding"
      @selectFloor="selectFloor"
      @backToInit="mapBackToInit"
    ></floor-selector>

    <div v-if="SCENE_MODE=='day'">
      <div :style="alarmGroupStyle" v-if="!viewerSelect" class="temp-btn all-devices-btn" :class="{'cur':allDevicesShow}" @click="showAllDevices()">设备总览</div>
      <div :style="alarmGroupStyle" v-if="!viewerSelect" class="temp-btn all-alarms-btn" :class="{'cur':allAlarmsShow}" @click="showAllAlarms()">告警总览</div>
      <!-- <div :style="alarmGroupStyle" v-if="!viewerSelect" class="temp-btn all-lift-btn" :class="{'cur':liftShow}" @click="liftShowToggle()">电梯</div>
      <div :style="alarmGroupStyle" v-if="buildingBackToDevicesShow"  class="temp-btn all-back-btn" :class="{'cur':buildingBackToDevicesShow}" @click="buildingBackToAllDevices()"></div> -->
    </div>


    <div v-if="animating" class="animate-mask"></div>
    <div v-if="monitorHistoryModalShow">
      <monitor-history-modal :show="monitorHistoryModalShow" @model-close="monitorHistoryModalClose" :deviceId="monitorSelectedId" :deviceName="monitorSelectedName" ></monitor-history-modal>
    </div>

    <div v-if="alarmScreenShow">
      <alarm-screen @close="alarmScreenShow=false" :alarmData="alarmScreenData"></alarm-screen>
    </div>
   
  </div>
</template>

<script>
import config from '@/config'

import {getDeviceGroupByPage,getMapWarnInfo,getCanLossAssetList,getHouseList,getDevicesInfo,generateOrderReq, getDeviceDetailByIdAndFlagReq,getPhotoInfoByUrl,getDeviceDetailById,getParkPos, getAllDeviceInfoReq,getDeviceDetailByParentIdReq, getPersonAccessInfoReq,getVehicleInfoReq, getBADeviceInfoReq} from '@/api/screen/screen-map.js'
import { getToken, getUserInfo } from "@/libs/util";

import moment from 'moment';

import FloorSelector from "./FloorSelector2.vue";
import AlarmGroup from './AlarmGroup.vue'
import DeviceGroup from './DeviceGroup3.vue'
import DeviceGroup2 from './DeviceGroup2.vue'

import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry' ;
import ThreeClass from "../../libs/ThreeClass.js";
import CommonClass from "../../libs/CommonClass.js";
import gsap from "gsap";
import skybox1 from "../../assets/img/skybox/star/5/px.png";
import skybox2 from "../../assets/img/skybox/star/5/nx.png";
import skybox3 from "../../assets/img/skybox/star/5/px.png";
import skybox4 from "../../assets/img/skybox/star/5/py.png";
import skybox5 from "../../assets/img/skybox/star/5/pz.png";
import skybox6 from "../../assets/img/skybox/star/5/nz.png";
import {Water} from 'three/examples/jsm/objects/Water2.js'

import {
    computeTangents,
    mergeBufferGeometries,
    mergeBufferAttributes,
    interleaveAttributes,
    estimateBytesUsed,
    mergeVertices,
    toTrianglesDrawMode,
    computeMorphedAttributes,
} from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { CSS3DObject, CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer";
import { CSS2DRenderer,CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer"

import {AllDevicesDataTemp} from "../../libs/TempData"

import TWEEN from "tween";
import * as dat from 'dat.gui'


import {deviceIconsClass} from '../../const/map.js'

import {wallMaterial} from '../../libs/Material'

import {BuildingFloorView,BuildingView,buildingPos,buildingAlarmPanelPos,alarmCircleImgs,DeviceIcons,ModelNameMap,ModelNameMap2,AlarmTypeMap,ModelObjectNameBuildingMap} from '../../libs/StaticData'
// let gui = new dat.GUI()

import {getViedoRealTimeUrl} from '@/api/bigscreen/screenMonitor.js' //监控摄像头接口
import MonitorHistoryModal from './MonitorHistoryModal.vue';
import MonitorWall from './MonitorWall.vue';
import AlarmScreen from './AlarmScreen.vue';

import { getItemValue,getTask } from "@/api/iot/sys_control/device.js"
import { getLightList } from "@/api/iot/sys_control/lighting.js"

let modalMeshGroupMap = {}
let floorMeshMatMap = {}
let floorSelected = null // 当前选择的对象楼层
let mouse = new THREE.Vector2();
let raycaster = new THREE.Raycaster();
let modelSelected = null
let CUR_MODE = "init" 
// let SCENE_MODE = "day" // day 白天; night 夜景
let MODE_DESC = {
  "init":"页面初始状态",
  "FloorSelected":"选择了楼层",
  "BuildingSelected":"选择了楼栋",
  "AllDevices":"所有设备",
  "Alarms":"告警点"
}
let BuildingSelected = null // 当前选择的楼栋模型对象
// 缓存已加载的楼栋模型对象
const BuildingModals = {
  // 'w01':null
}
let BuildingModal = null // 分层模型对象

let DevicesObjects = [] // 设备点集合
let DevicePopObject = null

const device = [
  {
    id: 1,
    name: '设备1',
    type: '相机',
    state: '在线',
    position : [-671.4498073064989,497.6158593473147,-361.37277953419454]
  },
  {
    id: 2,
    name: '设备2',
    type: '相机',
    state: '离线',
    position : [-615.237418610226,497.6158593473147,-435.62789279391365]
  },
  // {
  //   id: 3,
  //   name: '设备3',
  //   type: '报警',
  //   state: '在线',
  //   position : [-0.042990535638049505, 3.490332475455405, -0.5256408119847157]
  // },
  // {
  //   id: 4,
  //   name: '设备4',
  //   type: '门禁',
  //   state: '离线',
  //   position : [0.5197238805951798, 3.5035712917285555, 0.06917525472604945]
  // }
]
let element = null
let showTag = false
let showTagName = ''

let WaterObject = null //河流对象

let buildingMaterial = new THREE.MeshLambertMaterial({
  color:new THREE.Color('#0055a8'),
  opacity:0.6,
  transparent:true,
  depthTest:false,
  side:THREE.DoubleSide,
})

let GuanXianModels_temp = null // 管线模型

let alarms = [] // 报警
let AlarmsObjects = [] //报警点集合
let AlarmsPopObjects = [] //报警点弹窗

// 
let allDevicesBuildingModel = null // 所有设备的场景模型

let PlaneTexture = null //地面贴图缓存

let alarmCircleObjects = [] // 告警光圈对象集合
let alarmDeviceId = "" // 当前查看的告警设备id
let buildingAlarmCountGroup = {
  'w01':{
    0:0,
    1:0,
    2:0
  }
}

let buildingAlarmPanelObjects = []

let devicePopMonitorPugin = null

const GlbLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("assets/draco/");
GlbLoader.setDRACOLoader(dracoLoader);

export default {
  props: {
    contentLeft: {
      type: Object,
      default: () => ({
        width: "0px",
      }),
    },
    contentRight: {
      type: Object,
      default: () => ({
        width: "0px",
      }),
    },
    contentWidth: {
      type: Object,
      default: () => ({
        left: 0,
        right: 0,
      }),
    },
  },
  data() {
    return {
      SCENE_MODE:"day",// day 白天; night 夜景
      CUR_MODE:"init",

      monitorHistoryModalShow:false,
      monitorSelectedName:'',
      monitorSelectedId:"6b67b4298f6f4277aa8ece247e9b4b0f",
      // monitorSelectedId:"6d9483777f1e412ba8eb0b321e0eb243",
      // monitorSelectedParams:{
      //   "appId": "baeb4bf45f774c24b167ke136e515545",
      //   "deviceId": "6d9483777f1e412ba8eb0b321e0eb243",
      //   "recordLocation": 1,
      //   "protocol": "ws",
      //   "transmode": 0,
      //   "beginTime": "2023-06-05T09:00:00.000+08:00",
      //   "endTime": "2023-06-05T10:00:00.000+08:00",
      //   "uuid": "",
      //   "expand": "transcode=0",
      //   "streamform": "ps",
      //   "lockType": 0
      // },

      buildingBackToDevicesShow:false,

      monitorWallShow:true,
      monitorWallURLs:[],

      alarmScreenShow:false,//消防告警弹出
      alarmScreenData:null,

      liftShow:false,

      animating:false, // 是否正在动画

      // floorNumber: 0,
      alarmModal: false,
      currentBuildingFloor: 0,
      viewerSelect: '',
      buildingSelect: '',
      hoverBuildingFloor: 0,
      currentBuildingFloors: [],
      currentViewType: "init", // 当前模型页面显示的功能类型: init 初始视角;building 楼栋视角;floor 楼层视角;under 地下车库视角;under_device 地下设备;lift 电梯视角
      currentFloorsData: [],
      scene2: null,
      camera2: null,
      controls2: null,
      renderer2: null,

      // 
      alarmSocket:null,
      alarmData:new Array(3).fill({count:0,deviceList:[]}),

      parkSocket:null, // 停车位websocket
      
      // 保存接口返回的楼栋数据
      houseData:{
        // "w01":{
        //   calculateArea:1430,
        //   floorNum:"",
        //   houseId:"5163c1fb-e14e-4d49-b8dc-523c76baa97c",
        //   houseName:"w01",
        //   houseType:"2",
        //   parentId:"157074ce-823b-4073-9237-874b094a6cd1",
        //   rentStatus:"待出租"
        // },
      },
      buildingData:[
        // {
        //   calculateArea:1430,
        //   floorNum:"",
        //   houseId:"5163c1fb-e14e-4d49-b8dc-523c76baa97c",
        //   houseName:"w01",
        //   houseType:"2",
        //   parentId:"157074ce-823b-4073-9237-874b094a6cd1",
        //   rentStatus:"待出租"
        // },
      ],
      floorsData:{
        // '南楼':new Array(12).fill(0).map((item,idx) => ({floorNum:12-idx+'',houseId:idx,}))
      },

      // 楼层设备
      deviceTypeList:[],
      deviceList:[],

      // 
      allDeviceTypeList:[],
      allDeviceData:[],

      curPopId:'',

      // 告警
      alarmHandlerType: 0,// 0 消警; 1 生成工单
      alarmHandlerData:null,

      allDevicesShow:false,
      allAlarmsShow:false,

      buildingDevicesShow:false


    };
  },
  components: { FloorSelector, AlarmGroup, DeviceGroup, DeviceGroup2, MonitorHistoryModal, MonitorWall, AlarmScreen},
	computed:{
    alarmGroupStyle(){
      return {
        left:this.contentLeft.width,
        marginLeft:'20px',
        top:'90px'
      }
    },
    btnGroupStyle(){
      return {
        top:"60px",
        right:this.contentRight.width,
        marginRight:"45px",
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
      const center = (cw-rightW-leftW)/2+leftW
      return {
        left:center+'px'
      }
    }
  },
  methods: {
    mapBackToInit() {
      this.currentBuildingFloor = 0
      this.currentBuildingFloors = []
      this.hoverBuildingFloor = 0
      this.viewerSelect = ""
      this.buildingDevicesShow = false
      if(CUR_MODE == "BuildingSelected"){
        window["scene3d"].buildingBackToInit()
      }else if(CUR_MODE == "FloorSelected"){
        window["scene3d"].floorBackToInit()
      }else if(CUR_MODE == 'Lift'){

      }
      // this.realTimeAlarmFunc(alarms,false)
    },
    init() {
			const vue_this = this
      $(function () {
        let common = new CommonClass();
        let pageObj = $.extend(common.pageObj, {
          skybox: [skybox1, skybox2, skybox3, skybox4, skybox5, skybox6], //天空盒
          groundMethod: 2,
					vue_this
        });

        window["scene3d"] = new SceneClass(pageObj);
        window["scene3d"].load();


        //let tipArr = ['内容','1、剖切','2、多视点观察'];
        //common.intOperationTip(tipArr, 1);
      });
      class SceneClass extends ThreeClass {
        constructor(pageObj) {
          super(pageObj);
					this.vue_this = pageObj.vue_this
          this.curve = "";
          this.mouse = { x: 0, y: 0 };
        }

        initRiver3(){
          var that=this

          // this.scene.traverse(function (obj) {
              var obj=that.objScene.getObjectByName('objobjobjobjobjobjpolySurface3')
          
          obj.material=new THREE.MeshLambertMaterial({color:'#021f47'})   // 2a80f5


          var rectShape = new THREE.Shape();
          rectShape.moveTo( -298.42727266346986,-1* -661.0370803674815);
          rectShape.lineTo(-149.5732979031396, -1*-653.6775245851808);
          rectShape.lineTo(-160.05367329134117,-1*-381.66773701566575);
          rectShape.lineTo(-162.43194121860176,-1*-179.26662338171474);
          rectShape.lineTo(-213.99132523060638,-1*21.25325179524556);
          rectShape.lineTo(-222.50234702138005, -1*241.84260878155635)
          rectShape.lineTo(-237.20931458464474 ,-1*452.96354825656334)
          rectShape.lineTo(-343.0187493399435 , -1*454.85794657463833)
          rectShape.lineTo(-342.809362821307, -1*230.63687602059096)
          rectShape.lineTo(-341.4129408281266 , -1*175.62228508763988)
          rectShape.lineTo(-312.50181468003296 , -1*-441.9222510115723)
          rectShape.lineTo(-299.4304039588429 , -1*-659.2341151261273)

          
          var geometry = new THREE.ShapeGeometry(rectShape);
          // geometry.rotateX(-Math.PI/2)
          // geometry.translate(0,20,0);

          var rectShape2 = new THREE.Shape();
          rectShape2.moveTo(-2101.2056156314125 ,-1* 887.541981096259);
          rectShape2.lineTo(-2101.007758142324 ,-1* 1189.7685069407187);
          rectShape2.lineTo(1892.6557009682635 ,-1* 1116.4614422384902)
          rectShape2.lineTo(1958.8831883448413 ,-1* 764.0146086999403)
          rectShape2.lineTo(-2101.2056156314125 ,-1* 887.541981096259);
          var geometry2 = new THREE.ShapeGeometry(rectShape2);

          var rectShape3 = new THREE.Shape();
          rectShape3.moveTo(-43.28242304929347,-1*-197.40042497417704)
          rectShape3.lineTo(-53.179507982662585,-1*-191.12629923620878)
          rectShape3.lineTo(-59.10125059769575,-1*-181.6973788120622)
          rectShape3.lineTo(-61.59761418528217,-1*-170.6353565945941)
          rectShape3.lineTo(-59.247164862989564,-1*-159.0637828936894)
          rectShape3.lineTo(-52.89861596744916,-1*-149.5778873523322)
          rectShape3.lineTo(-43.874677432972874,-1*-143.36121258900212)
          rectShape3.lineTo(-32.98435829643748,-1*-140.96782250441748)
          rectShape3.lineTo(-21.978336742629892 , -1*-142.78470359620792)
          rectShape3.lineTo(-13.145989454986193 , -1*-149.1343136255434)
          rectShape3.lineTo(-4.902289481068863 ,-1*-159.18136715070932)
          rectShape3.lineTo(-3.6917504614405345 ,-1*-170.29074273736396)
          rectShape3.lineTo(-5.100433595055051,-1*-181.8951195715172)
          rectShape3.lineTo(-11.82887042759674,-1*-190.99805132598172)
          rectShape3.lineTo(-20.96723588622598,-1*-197.4124026311632)
          rectShape3.lineTo(-31.83688012789159,-1*-199.806627244436)
          rectShape3.lineTo(-43.28242304929347,-1*-197.40042497417704)
          var geometry3 = new THREE.ShapeGeometry(rectShape3);

          this.waterShader3 = {
              uniforms: {
                  time1: {
                      type: "pv2",
                      value: 0
                  },
                  iResolution:{value:new THREE.Vector2(window.innerWidth,window.innerHeight)}
              },

              vs: `
          precision lowp float;
          precision lowp int;
          varying vec2 vUv;
          varying float v_px;
          varying float v_py;
          varying float v_pz;


          void main() {
              vUv = uv;
              v_px = position.x;
              v_py = position.y;
              v_pz=position.z;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

          }
          `,

              fs: `
              varying vec2 vUv;
              varying float v_px;
              varying float v_py;
              varying float v_pz;
              uniform float time1;
              uniform vec2 iResolution;
              #define TAU 6.28318530718
              #define MAX_ITER 5


              void main() {
                  float time = time1 * .5+23.0;
              // uv should be the 0-1 uv of texture...
              vec2 uv = vUv.xy/100.0;
              
              #ifdef SHOW_TILING
                  vec2 p = mod(uv*TAU*2.0, TAU)-250.0;
              #else
                  vec2 p = mod(uv*TAU, TAU)-250.0;
              #endif
              vec2 i = vec2(p);
              float c = 1.0;
              float inten = .005;

              for (int n = 0; n < MAX_ITER; n++) 
              {
                  float t = time * (1.0 - (3.5 / float(n+1)));
                  i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
                  c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
              }
              c /= float(MAX_ITER);
              c = 1.17-pow(c, 1.4);
              vec3 colour = vec3(pow(abs(c), 8.0));
              colour = clamp(colour + vec3(0.0, 0.35, 0.5), 0.0, 1.0);

              #ifdef SHOW_TILING
              // Flash tile borders...
              vec2 pixel = 2.0 / iResolution.xy;
              uv *= 2.0;
              float f = floor(mod(time1*.5, 2.0)); 	// Flash value.
              vec2 first = step(pixel, uv) * f;		   	// Rule out first screen pixels and flash.
              uv  = step(fract(uv), pixel);				// Add one line of pixels per tile.
              colour = mix(colour, vec3(1.0, 1.0, 0.0), (uv.x + uv.y) * first.x * first.y); // Yellow line
              #endif
              
              gl_FragColor = vec4(colour, 1.0);


          }
          `
          }

          let option5_2 = {
              material: new THREE.ShaderMaterial({
                  uniforms:that.waterShader3.uniforms,
                  vertexShader:that.waterShader3.vs,
                  fragmentShader:that.waterShader3.fs,
                  // blending: THREE.AdditiveBlending,
                  blending:THREE.NormalBlending,
                  transparent: true,
                  depthTest: true,
                  side: THREE.DoubleSide,
                  opacity:1.0
              })
          };

          var mg3=new THREE.Mesh(geometry3,option5_2.material)
          // that.scene.add(mg3)
          mg3.rotateX(-Math.PI/2)
          mg3.position.y+=22


          const c = new THREE.CylinderGeometry( 30, 30, 44, 50,50);
          const m = new THREE.MeshBasicMaterial( {color:'blue'} );
          const cylinder = new THREE.Mesh( c, m );
          // that.scene.add( cylinder );
          cylinder.position.x-=31
          cylinder.position.z-=170
          c.rotateX(-Math.PI/2)
          c.translate(-32,170,-17);

          var bufferGeometryArr = []
          bufferGeometryArr.push(geometry)
          bufferGeometryArr.push(geometry2)
          bufferGeometryArr.push(c)
          var BfferGeometry = mergeBufferGeometries(bufferGeometryArr);

          var water=new Water(BfferGeometry,{
              textureWidth: 1024/1,
              textureHeight: 1024/1,  //6024
              color:0xeeeeff,
              flowDirection:new THREE.Vector2(1,1),
              scale:0.05,//0.05
              cam:that.camera,
              rend:that.renderer,
              sce:that.scene,
              flowSpeed:0.006
          })
          water.name='wt2'
          water.rotation.x=-Math.PI/2
          // water.position.y=-1
          that.scene.add(water)
          WaterObject = water
          // water.rotation.x=-Math.PI/2
          // water.position.x-=247+250
          water.position.y+=17    //17



        }

        initModel() {

          var that = this;
          this.flagLoad = true;
         
          const manager = new THREE.LoadingManager();
          var loader = new GLTFLoader(manager);
          const dracoLoader = new DRACOLoader();
          dracoLoader.setDecoderPath("assets/draco/");
          loader.setDRACOLoader(dracoLoader);



          // const css3drender = new CSS3DRenderer();
          // css3drender.setSize(window.innerWidth, window.innerHeight);
          // document.querySelector("#cssrender").appendChild(css3drender.domElement);

       
          loader.load(
            "assets/models/glb/sx_waijing.glb",
            function (obj) {
 
              console.log(obj.scene)

              that.scene.add(obj.scene);


              obj.scene.scale.set(100.0, 100.0, 100.0); // 12000.0,12000.0,12000.0
              that.objScene = obj.scene;

              // that.objScene.position.x += 105;
              // that.objScene.position.z += 20; //10080

              // that.initRiver3();
              that.changeObjMat();
              that.initHuiGuang();
              // that.traverseModel();
              that.YgScene2();

              // that.initRoof2();


              that.container.addEventListener(
                "mousemove",
                that.onMouseMove.bind(that),
                false
              );
              that.container.addEventListener(
                "click",
                that.onMousedown.bind(that),
                false
              );

              that.vue_this.alarmWebSocketConn()

            }
          );
        }

        YjScene() {
          var that=this
          this.isYj=true

          // this.renderer.outputEncoding=3000
          // this.renderer.toneMapping=0
          // this.renderer.toneMappingExposure=1
          this.isManyou=false

          this.isShowRain=false
          this.isShowSnow=false
          this.rangeSky('sky_18.jpg')   //bluesky.jpg
          // that.ShowGx2()



          that.initRodes()

          that.KaiDeng()
          // that.lensflareSun.visible=false
          // that.initKuoSanBo()
          that.hideObj('Yj')
          that.addLightTransForm4()
          this.isHuiGuang=true
          that.camera.position.copy(that.camera.userData.pos)
          this.pointLight2.intensity=0.0
          this.pointLight3.intensity=0.0
          this.pointLight4.intensity=0.0
          this.directionalLight1.intensity=0.0
          this.AmbientLight1.intensity=0.4
          // that.meshplan.material.color=new THREE.Color('#414d77')   //0d1013
          
          that.publicMaterial.glassMat.metalness=0   //0  0.25
          that.publicMaterial.glassMat.roughness=0.0      //1
          that.publicMaterial.glassMat.envMapIntensity=0
          that.publicMaterial.glassMat.color=new THREE.Color('#333323')  //232b33   333323   232b33
          that.publicMaterial.glassMat.opacity=0.9
          that.publicMaterial.glassMat.transmission=1.0


          var op2=that.objScene.getObjectByName('objobjobjpCube36')    // objobjobjpCube36
          op2.material=new THREE.MeshStandardMaterial({
              color:'#fcfecc',   //ffffff
              side:THREE.DoubleSide,
              // emissive:'#fcfbc4'
          })
        }
        
        YgScene2() {
          var that=this

          this.isYj=false
          this.isHuiGuang=false
          this.isManyou=false

          this.isShowRain=false
          this.isShowSnow=false
          // debugger
          this.rangeSky('bluesky.jpg')
          this.hideObj('Yg')
          // for(var i=0;i<that.wdobjArr1.length;i++){
          //     that.wdobjArr1[i].visible=false
          // }

          that.camera.position.copy(that.camera.userData.pos)
          this.traverseModel()
          this.AmbientLight1.intensity=1.5
          this.pointLight2.intensity=0.0  //0.1
          this.pointLight3.intensity=0.0  //0.1
          this.pointLight4.intensity=0.0  //0.1
          // this.directionalLight1.intensity=0.7   // 0.7
          this.directionalLight1.intensity=0   // 0.7
          this.directionalLight1.castShadow = false
          that.meshplan.material.color=new THREE.Color('#565758')  //   aacbea
          that.meshplan.receiveShadow = false
          that.publicMaterial={
              // 透明蓝色材质
              transparentBlue: new THREE.MeshPhysicalMaterial({
                  transparent: true,
                  opacity: 0.4,
                  // color: "#4E83D9",
                  color: "#7a9cd2",
                  specularColor: new THREE.Color("#7a9cd2"),
                  side: THREE.DoubleSide,
                  roughness: 0.6,
                  metalness: 0.8
              }),
              // 透明蓝色材质2
              transparentBlue2: new THREE.MeshPhysicalMaterial({
                  transparent: true,
                  opacity: 0.9,
                  // color: "#4E83D9",
                  color: new THREE.Color("#7a9cd2").multiplyScalar(0.3),
                  // specularColor: new Color("#53648D"),
                  side: THREE.DoubleSide,
                  // roughness: 0.5,
                  // metalness: 0.8
              }),
              // 玻璃的材质
              glassMat: (() => {
                  // 环境贴图
                  // debugger
                  var envMap =that.getTexture('assets/img/publicpic/bluesky.jpg')
                  envMap.mapping = THREE.EquirectangularReflectionMapping;

                  const envMat = new THREE.MeshPhysicalMaterial({
                      color: "#283953",   //fff  283953  89a1c7    模型颜色
                      side: THREE.DoubleSide,
                      transparent: true,
                      opacity: 0.7,                        //透明度
                      envMap,
                      envMapIntensity: 1,//1               感受到环境贴图的强度
                      // reflectivity: 1,                  //当金属度metalness不为 1 的时候起作用，数字越大越反光，数字越小越不反光
                      roughness:0.5,   //0.5               数字越小越反光，数字越大越不反光
                      metalness:1.0                        //数字越大越黑，数字越小越白
                  });

                  return envMat;
              })(),
          }

          that.objScene.traverse(function (mesh) {
              if(mesh.isMesh){
                  if (that.plArrNew.includes(mesh.name)) {
                      // debugger
                      mesh.geometry.computeVertexNormals();
                      mesh.material = that.publicMaterial.glassMat;
                      mesh.castShadow = true;
                  }

                  if(that.plArrNew.indexOf(mesh.name)==-1){
                      // debugger
                      if(['polySurface3750','polySurface3686','polySurface3686001','polySurface22705'].indexOf(mesh.name)==-1 ){
                          mesh.receiveShadow = true;
                          mesh.geometry.computeVertexNormals();
                          (mesh.material).roughness = 0.5;
                          (mesh.material).metalness = 0;
                          mesh.material.emissive=new THREE.Color("#000000")     //.set("#000000")
                      }


                  }

                  if(mesh.name=='polySurface22705'){
                      mesh.material.color=new THREE.Color('#bfbfbf') //  9b9a9a    bfbfbf
                  }

                  // 提亮公路
                  if (that.glArr.includes(mesh.name)) {
                      (mesh.material).emissive=new THREE.Color("#666")      //.set("#666")
                  }

                  if(that.plArrNew_YJ.includes(mesh.name)){
                      mesh.geometry.computeVertexNormals();
                      mesh.material = that.publicMaterial.glassMat;
                      mesh.castShadow = true;
                      // mesh.visible=false
                  }

              }
          })
        }

       

        onMouseMove(event) {
          if(CUR_MODE == 'BuildingSelected'){
            this.hoverMesh(event)
          }
        }

        onMousedown(event) {
          event.preventDefault()
          this.getCamera()
          let mouse = new THREE.Vector3()
          mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
          mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
          let raycaster = new THREE.Raycaster();
          raycaster.setFromCamera(mouse, this.camera);
          let intersects = raycaster.intersectObjects(
            this.scene.children,
            true
          );
          console.log(intersects)
          // let intersect = intersects.some(mesh => {
          //   return mes
          // })
          if(intersects[0]){
            console.log(
              "当前鼠标位置",JSON.stringify(intersects[0].point)
          );
          }
          
          if(CUR_MODE == "BuildingSelected"){
            this.buildingClickHandler(event)
          }else if (CUR_MODE == "FloorSelected"){
            this.floorClickHandler(event)
          }else if (CUR_MODE == 'AllDevices'){
            this.allDevicesSceneClickHandler(event)
          }
        }

        onMouseUp(event) {
          var that = this;

          if (event.button == 0) {
            that.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            that.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            let raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(that.mouse, this.camera);
            let intersects = raycaster.intersectObjects(
              this.scene.children,
              true
            );
            var geosp = new THREE.SphereGeometry(1.5, 5, 5);
            var matsp = new THREE.MeshBasicMaterial({
              color: "lightgreen",
            });
            var meshsp = new THREE.Mesh(geosp, matsp);
            meshsp.position.copy(
              new THREE.Vector3(
                intersects[0].point.x,
                intersects[0].point.y,
                intersects[0].point.z
              )
            );
            this.scene.add(meshsp);
            // console.log(intersects[0].point.x,intersects[0].point.y,intersects[0].point.z,intersects[0])
            console.log(
              intersects[0].point.x,
              intersects[0].point.y,
              intersects[0].point.z
            );
            console.log("8888888888888888");
          }
        }

        initCamera() {
          this.camera = new THREE.PerspectiveCamera(
            30,
            this.W / this.H,
            10,
            100000
          );
          this.camera.position.set(
            262.44654168195666,
            242.0775210749106,
            626.2302886062911
          );
          this.camera.userData.pos = new THREE.Vector3(
            262.44654168195666,
            242.0775210749106,
            626.2302886062911
          );
          this.camera.name='cam1'

          this.cam2=this.camera.clone()
          this.cam2.name='cam2'
        }

        

				getCamera() {
					console.log(this.camera);
					console.log("camera",JSON.stringify(this.camera.position));
					console.log("control",JSON.stringify(this.controls.target));
				}
        
				// 相机平滑移动
				cameraFlyTo(pos, target, callback) {
          let that = this
					let tween = new TWEEN.Tween(this.camera.position).to(pos, 1500);
					let tween2 = new TWEEN.Tween(this.controls.target).to(target, 1500);
					tween.onComplete(function () {
            if(callback){
              callback()
            }
						
					});
					tween.start();
					tween2.start();
				}

        hideModel() {
          console.log(this.scene)
          let mesh = this.scene.getObjectByName('Scene');
          mesh.visible = false
          this.scene.remove(WaterObject)
        }
        recoverScene(){
          this.scene.add(WaterObject)
          let mesh = this.scene.getObjectByName('Scene');
          mesh.visible = true
        }

        // 显示对应楼栋
        showBuilding(name,callback){
          this.vue_this.animating = true
          this.hideModel()
          modelSelected = name
          this.changeToBuildingLight()
          this.removeAllBuildingAlarmPanels()
          CUR_MODE = "BuildingSelected"
          this.vue_this.CUR_MODE = "BuildingSelected"
          
          let that = this
          if(!BuildingModal){
            GlbLoader.load('assets/models/glb/sx_fenceng.glb',gltf => {
              console.log('楼栋模型加载',gltf.scene)
              BuildingModal = gltf.scene
              BuildingSelected = gltf.scene
              BuildingSelected.buildingName = name
              gltf.scene.name = "building"
              gltf.scene.scale.set(5.0, 5.0, 5.0);

              // that.addGltfSceneControlGUI(gltf.scene)

              let objects = BuildingModal.children[0].children

              let objectSelectd = null

              for(let i = 0; i < objects.length; i++){
                let object = objects[i]
                BuildingModals[ModelObjectNameBuildingMap[object.name]] = object
                object.userData.buildingName = ModelObjectNameBuildingMap[object.name]
                that.initBuildingModalName(object,ModelObjectNameBuildingMap[object.name])

                if(object.children&&object.children.length){
                  for(let j = 0;j<object.children.length;j++){
                    let item = object.children[j]
                    let floor = parseInt(item.name.split('_')[1])
                    that.initBuildingModalFloor(item,item,floor)
                  }
                }
                console.log(object.name,ModelObjectNameBuildingMap[object.name])
                if(ModelObjectNameBuildingMap[object.name] == name){
                  objectSelectd = object
                }
              }

              gltf.scene.traverse(function(mesh){
                if(mesh.userData.buildingName){
                  if(mesh.userData.buildingName == name) {
                    mesh.visible = true
                  }else{
                    mesh.visible = false
                  }
                }
              })

              for(let i=0;i<objectSelectd.children.length;i++){
                let object = objectSelectd.children[i]
                let floorNum = object.userData.floorNum
                if(floorNum){
                  let y = -(floorNum*1000 + 5000)
                  let y_before = object.position.z
                  object.position.z = y
                  gsap.to(object.position, {
                    z: y_before,
                    duration: 3,
                    onComplete:()=>{
                      if(i == objectSelectd.children.length-1){
                        that.vue_this.animating = false
                        if(callback){
                          callback()
                        }else{
                        }
                      }
                    }
                  });
                }
              }

              that.scene.add(gltf.scene)
              
            })
          }else{
            BuildingSelected = BuildingModal
            BuildingSelected.buildingName = name

            let objects = BuildingModal.children[0].children

            let objectSelectd = BuildingModals[name]

            // for(let i = 0; i < objects.length; i++){
            //   let object = objects[i]
            //   if(ModelObjectNameBuildingMap[object.name] == name){
            //     objectSelectd = object
            //   }
            // }

            BuildingModal.traverse(function(mesh){
              if(mesh.userData.buildingName){
                if(mesh.userData.buildingName == name) {
                  mesh.visible = true
                }else{
                  mesh.visible = false
                }
              }
            })

            for(let i=0;i<objectSelectd.children.length;i++){
              let object = objectSelectd.children[i]
              let floorNum = object.userData.floorNum
              if(floorNum){
                let y = -(floorNum*1000 + 5000)
                let y_before = object.position.z
                object.position.z = y
                gsap.to(object.position, {
                  z: y_before,
                  duration: 3,
                  onComplete:()=>{
                    if(i == objectSelectd.children.length-1){
                      that.vue_this.animating = false
                      if(callback){
                        callback()
                      }else{
                      }
                    }
                  }
                });
              }
            }

            that.scene.add(BuildingModal)
          }
          return 

          this.vue_this.animating = true
          this.hideModel()
          modelSelected = name
          this.changeToBuildingLight()
          this.removeAllBuildingAlarmPanels()
          CUR_MODE = "BuildingSelected"
          this.vue_this.CUR_MODE = "BuildingSelected"
          if(name == '7'||name == '地下室'){
            this.showUnder(name,callback)
            return
          }
          if(name == '地面'){
            this.showDimian(name,callback)
            this.vue_this.animating = false
            return
          }

          if(!BuildingModals[name]){
            var loader = new GLTFLoader();
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath("assets/draco/");
            loader.setDRACOLoader(dracoLoader);

            let that = this;

            // let floorGroup;
            loader.load("assets/models/glb/building/"+ModelNameMap[name]+".glb", (gltf) => {
              console.log('楼栋模型加载',gltf.scene)
              BuildingModals[name] = gltf.scene
              BuildingSelected = gltf.scene
              BuildingSelected.buildingName = name
        
              gltf.scene.name = "building"
              // console.log(mesh)
              const {x,y,z} = buildingPos[name]||{"x":105,"y":0,"z":20}
              gltf.scene.scale.set(5700.0, 5700.0, 5700.0);
              gltf.scene.position.set(x,y,z)

              // that.controls.target.set(x,y,z)
              // that.camera.lookAt(that.controls.target)
              let mesh = gltf.scene.children[0].children
              // console.log(mesh)
            

              for(let i = 0; i < mesh.length; i++) {
                // mesh[i].visible = false
                let meshName = mesh[i].name

                let y = parseInt(meshName.split('_')[1])

                let y_before = mesh[i].position.z
                mesh[i].position.z = -y
                console.log(y,y_before)
                
                gsap.to(mesh[i].position, {
                  z: y_before,
                  duration: 3,
                  onComplete:()=>{
                    if(i == mesh.length-1){
                      that.vue_this.animating = false

                      // that.vue_this.drawBuildingDevices()
                      if(callback){
                        callback()
                      }else{
                        // that.vue_this.drawBuildingDevices()
                      }
                    }
                  }
                });
                
                
              }
              that.scene.add(gltf.scene)

        
              that.initMehGroupMap(gltf.scene.children[0])
              // that.vue_this.animating = false

              // that.addBuildingPosControlGUI(name)
              

            });
          }else{
            const that = this
            BuildingSelected = BuildingModals[name]
            let mesh = BuildingSelected.children[0].children
            // this.mesh = mesh
            for(let i = 0; i < mesh.length; i++) {
              // mesh[i].visible = false
              let meshName = mesh[i].name
              let y = parseInt(meshName.split('_')[1])

              let y_before = mesh[i].position.z
              mesh[i].position.z = -y
            
              gsap.to(mesh[i].position, {
                z: y_before,
                duration: 3,
                onComplete:()=>{
                  if(i == mesh.length-1){
                    that.vue_this.animating = false
                    if(callback){
                      callback()
                    }else{
                      // that.vue_this.drawBuildingDevices()
                    }
                  }
                }
              });
              
            }
            // that.vue_this.animating = false
            this.scene.add(BuildingSelected);
          }
        }

        showUnder(name,callback){
          const vue_this = this.vue_this
          let that = this;
          vue_this.animating = true

          if(!BuildingModals[name]){
            
            var loader = new GLTFLoader();
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath("assets/draco/");
            loader.setDRACOLoader(dracoLoader);
            console.log("加载的模型",name,ModelNameMap[name])
            loader.load("assets/models/glb/building/"+ModelNameMap[name]+".glb",gltf => {

              console.log('楼栋模型加载',gltf.scene)

              BuildingModals[name] = gltf.scene
              BuildingSelected = gltf.scene
              BuildingSelected.buildingName = name
              gltf.scene.name = "building"
              const {x,y,z} = buildingPos[name]||{"x":105,"y":0,"z":20}
              gltf.scene.scale.set(5700.0, 5700.0, 5700.0);
              gltf.scene.position.set(x,y,z)
              let mesh = gltf.scene.children[0].children
              for(let i = 0; i < mesh.length; i++) {

                that.initMeshUnderMap(mesh[i],mesh[i].children)
                // mesh[i].visible = false
                let meshName = mesh[i].name

                // let y = parseInt(meshName.split('_')[1])

                // let y_before = mesh[i].position.z
                // mesh[i].position.z = -y
                // console.log(y,y_before)
                
                // gsap.to(mesh[i].position, {
                //   z: y_before,
                //   duration: 3,
                //   onComplete:()=>{
                //     if(i == mesh.length-1){
          
                //       vue_this.animating = false

                //       // that.vue_this.drawBuildingDevices()
                //       if(callback){
                //         callback()
                //       }else{
                //         // that.vue_this.drawBuildingDevices()
                //       }
                //     }
                //   }
                // });
                
              }

              that.scene.add(gltf.scene);
            })
          }else{
            BuildingSelected = BuildingModals[name]
            // let mesh = BuildingSelected.children[0].children
            // for(let i = 0; i < mesh.length; i++) {
            //   // mesh[i].visible = false
            //   let meshName = mesh[i].name
            //   let y = parseInt(meshName.split('_')[1])

            //   let y_before = mesh[i].position.z
            //   mesh[i].position.z = -y
            
            //   gsap.to(mesh[i].position, {
            //     z: y_before,
            //     duration: 3,
            //     onComplete:()=>{
            //       if(i == mesh.length-1){
            //         vue_this.animating = false
            //         if(callback){
            //           callback()
            //         }else{
            //           // that.vue_this.drawBuildingDevices()
            //         }
            //       }
            //     }
            //   });
              
            // }
            this.scene.add(BuildingSelected);

          }
          vue_this.animating = false
        }

        showDimian(name,callback){
          const vue_this = this.vue_this
          let that = this;
          if(!BuildingModals[name]){
            var loader = new GLTFLoader();
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath("assets/draco/");
            loader.setDRACOLoader(dracoLoader);

            // var envMap = this.getTexture("assets/img/publicpic/bluesky.jpg");
            // envMap.mapping = THREE.EquirectangularReflectionMapping;
            // let material = new THREE.MeshPhysicalMaterial({
            //   color: "#fff",
            //   side: THREE.DoubleSide,
            //   transparent: true,
            //   opacity: 1,
            //   envMap,
            //   envMapIntensity: 1,//1
            //   // reflectivity: 1,
            //   roughness:0.7,   //0.5
            //   metalness:1.0,
            //   depthWrite:true,
            //   depthTest:true,
            //   forceSinglePass:false
            // })
            // this.addAllDevicesBuildingSceneControl(buildingMaterial,'dimian')

            loader.load("assets/models/glb/building/"+ModelNameMap[name]+".glb",gltf => {
              console.log('楼栋模型加载',gltf.scene)
              BuildingModals[name] = gltf.scene
              BuildingSelected = gltf.scene
              BuildingSelected.buildingName = name
              gltf.scene.name = "building"
              const {x,y,z} = buildingPos[name]||{"x":105,"y":0,"z":20}
              gltf.scene.scale.set(5700.0, 5700.0, 5700.0);
              gltf.scene.position.set(x,y,z)
              let mesh = gltf.scene.children[0]

              mesh.floorNo = 1

              mesh.material = buildingMaterial

              that.scene.add(gltf.scene);

              if(callback){
                callback()
              }

            })

          }else{
            BuildingSelected = BuildingModals[name]
            this.scene.add(BuildingSelected);
            if(callback){
              callback()
            }
          }
          vue_this.animating = false
        }

        // 无动画显示对应楼栋
        showBuildingNoAnimation(name,callback){
          this.hideModel()
          modelSelected = name
          this.changeToBuildingLight()
          this.removeAllBuildingAlarmPanels()

          CUR_MODE = "BuildingSelected"
          this.vue_this.CUR_MODE = "BuildingSelected"
    
          if(!BuildingModals[name]){
            var loader = new GLTFLoader();
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath("assets/draco/");
            loader.setDRACOLoader(dracoLoader);

            let that = this;
            // let floorGroup;
            loader.load("assets/models/glb/sx_fenceng.glb", (gltf) => {
              console.log('楼栋模型加载',gltf.scene)
              BuildingModal = gltf.scene
              BuildingSelected = gltf.scene
              BuildingSelected.buildingName = name
              gltf.scene.name = "building"
              gltf.scene.scale.set(1.0, 1.0, 1.0);

              let objects = BuildingModal.children[0].children

              for(let i = 0; i < objects.length; i++){
                let object = objects[i]
                BuildingModals[ModelObjectNameBuildingMap[object.name]] = object
                object.userData.buildingName = ModelObjectNameBuildingMap[object.name]
                that.initBuildingModalName(object,ModelObjectNameBuildingMap[object.name])

                if(object.children&&object.children.length){
                  for(let j = 0;j<object.children.length;j++){
                    let item = object.children[j]
                    let floor = parseInt(item.name.split('_')[1])
                    that.initBuildingModalFloor(item,item,floor)
                  }
                }
                console.log(object.name,ModelObjectNameBuildingMap[object.name])
                if(ModelObjectNameBuildingMap[object.name] == name){
                  objectSelectd = object
                }
              }

              gltf.scene.traverse(function(mesh){
                if(mesh.userData.buildingName){
                  if(mesh.userData.buildingName == name) {
                    mesh.visible = true
                  }else{
                    mesh.visible = false
                  }
                }
              })
              that.scene.add(gltf.scene)

              if(callback){
                callback()
              }

            });
          }else{
            const that = this
            BuildingSelected = BuildingModal
            BuildingSelected.buildingName = name

            BuildingModal.traverse(function(mesh){
              if(mesh.userData.buildingName){
                if(mesh.userData.buildingName == name) {
                  mesh.visible = true
                }else{
                  mesh.visible = false
                }
              }
            })

            if(callback){
              callback()
            }
            this.scene.add(BuildingSelected);
          }
        }

        addBuildingPosControlGUI(name){
          let control = gui.addFolder("Building POS")
          let params = {
            ...buildingPos[name]
          }

          control.add(params,'x',-1500,1500,1).onChange(function(val){
            BuildingSelected.position.x = val
          })
          control.add(params,'y',0,500,1).onChange(function(val){
            BuildingSelected.position.y = val
          })
          control.add(params,'z',-3000,3000,1).onChange(function(val){
            BuildingSelected.position.z = val
          })

        }

        // 更改 显示大楼时的灯光
        changeToBuildingLight(name){
          // return
          this.AmbientLight1.intensity= 1
          this.directionalLight1.intensity=0.6  //1.5
          this.directionalLight1.position.set(-566.4441844522534,1000,600); 
          // this.directionalLight1.target.position.set(0,0,0)
          this.directionalLight1.castShadow = true


          // 修改地面贴图
          const that = this
          // if(!PlaneTexture){
          //   PlaneTexture= this.textureLoader.load('assets/img/publicpic/plane3.jpg')
          // }
          // // that.meshplan.set
          // that.meshplan.material = new THREE.MeshBasicMaterial({
          //     map:PlaneTexture,
          //     side:THREE.DoubleSide,
          // })
          that.meshplan.castShadow = false
          that.meshplan.receiveShadow = false
          that.meshplan.position.y = 0

        }

        recoverBuildingLight(){
          this.AmbientLight1.intensity=1.5
          this.directionalLight1.intensity=0  //1.5
          this.directionalLight1.castShadow = false
          this.directionalLight1.position.set(1578.141853090013+100, 1023.732229319972422, 2494.5078842210496+100);   //0,1050,-1940
          // this.directionalLight1.position.set(-566.4441844522534,1000,600); 
          this.meshplan.material = new THREE.MeshBasicMaterial({color:'#565758',side:THREE.DoubleSide,transparent:false})
          this.meshplan.castShadow = false
          this.meshplan.receiveShadow = false
          this.meshplan.position.y = -50

        }

        // 更改显示所有设备时的灯光
        changeToAllDevicesLight(){
          this.AmbientLight1.intensity=10
          this.directionalLight1.intensity=0  //1.5
          // this.addDirectionLightControlGUI(this.directionalLight1)
          const that = this
          // let texture = this.textureLoader.load('assets/img/publicpic/sky_6.jpg')
          // if(!PlaneTexture){
          //   PlaneTexture= this.textureLoader.load('assets/img/publicpic/plane3.jpg')
          // }
          // // that.meshplan.set
          // that.meshplan.material = new THREE.MeshBasicMaterial({
          //     map:PlaneTexture,
          //     side:THREE.DoubleSide,
          // })
          that.meshplan.castShadow = false
          that.meshplan.receiveShadow = false
          that.meshplan.position.y = 0

        }

        recoverAllDevicesLight() {
          this.AmbientLight1.intensity=1.5
          this.directionalLight1.intensity=0  //1.5
          this.directionalLight1.castShadow = false
          this.meshplan.material = new THREE.MeshBasicMaterial({color:'#565758',side:THREE.DoubleSide,transparent:false})
          this.meshplan.castShadow = false
          this.meshplan.receiveShadow = false
          this.meshplan.position.y = -50

        }

        recoverAllDevicesLight2() {

        }

        drawDevicePoint(data){

          // 若告警设备id 和 设备id一样
          if(alarmDeviceId == data.id){
            this.addAlarmCircle()
          }

          const colorMap = ['blue','grey','red','orange']
          let dom = document.createElement('div')
          // DeviceIcons
          let className = deviceIconsClass[data.deviceTypeOneName]?deviceIconsClass[data.deviceTypeOneName]:deviceIconsClass['其他']
          className = 'iconfont icon-'+className
          dom.classList.add('three-div_device-point')
          dom.setAttribute('id',data.id)
          dom.innerHTML = ` 
          <div class="${'sx-device-point '+colorMap[data.status]}">
            <div class="sx-device-point-name-bg">
            <span class="sx-device-point-name">${data.deviceName}</span>
             <i class="custom-bg-block left-top"></i>
              <i class="custom-bg-block left-bottom"></i>
              <i class="custom-bg-block right-top"></i>
              <i class="custom-bg-block right-bottom"></i>
            </div>
            <i class="${className}"></i>
          </div>`
          // console.log("设备dom",dom)
          // let objectCss = new CSS2DObject(dom)
          let objectCss = new CSS2DObject(dom)
          let pos = data.position
          // let pos = [-671.4498073064989,525.6761610662487,-361.37277953419454] //测试用数据
          objectCss.position.set(...pos)
          DevicesObjects.push(objectCss)
          // console.log(pos,objectCss)

          this.scene.add(objectCss)



          const that = this
          dom.addEventListener('click',function(ev){
            ev.preventDefault()
            console.log("我点击了设备点",data)
            // that.removeDevicePoints()
            that.showDevicePop(data)
          })

          

        }

        drawDevicePointWithoutLabel(data,ifSmall=false){
          const colorMap = ['blue','red','grey','orange']
          // const colorMap = ['white','grey','red','orange']
          let dom = document.createElement('div')
          let typeName = data.deviceTypeTwoName?data.deviceTypeTwoName:data.deviceTypeOneName
          let className = deviceIconsClass[typeName]?deviceIconsClass[typeName]:deviceIconsClass['其他']
          // let className = deviceIconsClass[data.deviceTypeOneName]?deviceIconsClass[data.deviceTypeOneName]:deviceIconsClass['其他']
          className = 'iconfont icon-'+className
          // let img = DeviceIcons[data.deviceTypeOneName]?DeviceIcons[data.deviceTypeOneName]:DeviceIcons['其他']
          dom.classList.add('three-div_device-point')
          dom.setAttribute('id',data.id)
          let className2 = ifSmall?'small':''
          dom.innerHTML = ` 
          <div class="${'sx-device-point '+className2+' '+colorMap[data.status]}">
            <i class="${className}"></i>
          </div>`
          // console.log("设备dom",dom)
          let objectCss = new CSS2DObject(dom)
          let pos = data.position

          // let pos = [-671.4498073064989,525.6761610662487,-361.37277953419454] //测试用数据
          objectCss.position.set(...pos)
          DevicesObjects.push(objectCss)
          objectCss.name = data.id

          this.scene.add(objectCss)
          // console.log("设备点对象",objectCss,this.scene.getObjectByName(data.id))

          const that = this
          dom.addEventListener('click',function(ev){
            ev.preventDefault()
            console.log("我点击了设备点",data)
            // that.removeDevicePoints()
            that.showDevicePop(data)
          })

            // 若告警设备id 和 设备id一样
          if(alarmDeviceId == data.id){
            this.addAlarmCircle()
          }

         

        }
        drawDevicePointWithoutLabel2(data,ifSmall=false){
          const colorMap = ['blue','grey','red','orange']
          let dom = document.createElement('div')
          let typeName = data.deviceTypeTwoName?data.deviceTypeTwoName:data.deviceTypeOneName
          let className = deviceIconsClass[typeName]?deviceIconsClass[typeName]:deviceIconsClass['其他']
          className = 'iconfont icon-'+className
          // let img = DeviceIcons[data.deviceTypeOneName]?DeviceIcons[data.deviceTypeOneName]:DeviceIcons['其他']
          // let imgStr = `<img src=${img}>`
          dom.classList.add('three-div_device-point')
          dom.setAttribute('id',data.id)
          let color = data.buildingNum == '7'?'orange':'white'
          let className2 = ifSmall?'small':''
          dom.innerHTML = ` 
          <div class="${'sx-device-point '+className2+' '+color}">
            <i class="${className}"></i>
          </div>`
          // dom.innerHTML = ` 
          // <div class="${'sx-device-point '+className2+' '+color}">
          //   ${imgStr}
          // </div>`
          // console.log("设备dom",dom)
          let objectCss = new CSS2DObject(dom)
          let pos = data.position

          // let pos = [-671.4498073064989,525.6761610662487,-361.37277953419454] //测试用数据
          objectCss.position.set(...pos)
          DevicesObjects.push(objectCss)
          objectCss.name = data.id

          this.scene.add(objectCss)
          // console.log("设备点对象",objectCss,this.scene.getObjectByName(data.id))

          const that = this
          dom.addEventListener('click',function(ev){
            ev.preventDefault()
            console.log("我点击了设备点",data)
            // that.removeDevicePoints()
            that.showDevicePop(data)
          })

        //  // 若告警设备id 和 设备id一样
        //  if(alarmDeviceId == data.id){
        //     this.addAlarmCircle()
        //   }

        }

        removeDevicePoints(){
          const scene = this.scene
          for(let i=0;i<DevicesObjects.length;i++){
            scene.remove(DevicesObjects[i])
          }
          DevicesObjects = []
        }

        showDevicePop(value){
          this.removeDevicePop()
          let pos = value.position
          // let pos = [-671.4498073064989,525.6761610662487,-361.37277953419454]
          let id = value.id
          let vue_this = this.vue_this

          // console.log(value,"????????")
           getDeviceDetailByIdAndFlagReq({deviceId:id}).then(async res => {
            console.log("设备详情",value,res)
            if(res.code == 200 && res.data){
              let data = res.data

              // 接口数据解析
              let deviceDetailData = await vue_this.getDeviceDetailByTypeAndId(value)
              let valueData = data.valueData?data.valueData:[]
              valueData = deviceDetailData.length?deviceDetailData:valueData
              let labelInfos = vue_this.getDomStrByDeviceType(id,value,valueData,data)
              let popW = vue_this.getDevicePopWidthByDeviceType(value)
              popW = 'width:'+popW+'px;'
              let monitor = ``
              // for(let i = 0;i<valueData.length;i++){
              //   labelInfos += `
              //     <div style="display:flex;align-items:center">
              //       <span class="sx-device-label">${valueData[i].attrCn+':'}</span>
              //       <span class="sx-device-content">${valueData[i].value + (valueData[i].unit?valueData[i].unit:'')}</span>
              //     </div>
              //   `
              // }
              if(data.videoFlag == 'Y'){
                // monitor = `<div class="monitor-content" style="height:180px">
                //   <video id="${'sx-device-monitor-'+id}" style="width:100%;height:180px" controls muted autoplay></video>
                // </div>`
                monitor = `<div class="monitor-content" style="height:180px">
                    <div id="${'play_window_'+id}" class="play_window" style="height:100%;width:100%;pointer-events:auto"></div>
                    <div class="play_window_tools">
                      <svg class="play_window_tools_btn tool_zoom" viewBox="0 0 1024 1024" width="24" height="24"><path d="M704 64h256v64h-256z" p-id="2377"></path><path d="M896 64h64v256h-64zM66.688 64h64v256h-64z" p-id="2378"></path><path d="M66.688 64h256v64h-256zM66.688 894.976h256v64h-256z" p-id="2379"></path><path d="M66.688 702.976h64v256h-64zM896 702.976h64v256h-64z" p-id="2380"></path><path d="M704 894.976h256v64h-256z" p-id="2381"></path></svg>
                    </div>
                    </div>
                    <div class="monitor-btns">
                      <div class="btn-replay">回放</div>
                      </div>`
              }
              const img2 = require("../../asserts/images/map/arrow.png")
              const close = require("../../asserts/images/close_blue_1.png")
              let dom = document.createElement('div')
              dom.classList.add('three-div_device-pop')
              // let posStr = data.deviceAddr?` <div>
              //       <span class="sx-device-label">设备位置:</span>
              //       <span class="sx-device-content">${data.deviceAddr}</span>
              //     </div>`:``
              let str = `
                <div class="sx-device-pop-wrapper">
                  <div class="pop-line"></div>
                  <div class="pop-content" style="position:relative;${popW}">
                    <div style="display:flex;align-items:center;position:relative">
                      <span class="device-title">${data.deviceName}</span>
                      <img class="close-btn" src="${close}" alt="" style="pointer-events:auto">
                    </div>
                    <div class="split-line"></div>
                    <div class="device-info" style="margin-bottom:10px">
                      ${labelInfos}
                    </div>
                  ${monitor}
                  </div>
                </div>`
              dom.innerHTML = str
              let objectCss = new CSS2DObject(dom)
              objectCss.position.set(...pos)
              DevicePopObject = objectCss
              this.scene.add(DevicePopObject)

              const closeDom = dom.querySelector('.close-btn')
              const that = this

              closeDom.addEventListener('click',function(ev){
                that.removeDevicePop()
              })

              setTimeout(async ()=>{
                if(data.videoFlag == 'Y'){
                  let playId = 'play_window_'+id
                  devicePopMonitorPugin = new JSPlugin({
                      szId: playId,
                      // szBasePath: "../../../public/h5Player/h5player.min.js",
                      szBasePath: './screen/js/h5Player/', // 相对路径,此路径地址为了录像等功能中调用index.html中的路径需要相对地址
                      // iWidth: 200,
                      // iHeight: 200,
                      // 分屏播放，默认最大分屏4*4
                      iMaxSplit: 4,
                      iCurrentSplit: 1,
                      oStyle: {
                          border: '#343434',
                          borderSelect: '#FFCC00',
                          background: '#000'
                      }
                      // 视频播放区域样式
                  })
                  let myPlugin = devicePopMonitorPugin
                  myPlugin
                      .JS_SetWindowControlCallback({
                        windowEventSelect(iWndIndex) {
                            // 插件选中窗口回调
                            // this.iWind = iWndIndex;
                            // console.log('点击选中的窗口', that.iWind)
                            // console.log(this.iWind)
                        },
                        pluginErrorHandler(iWndIndex, iErrorCode, oError) {
                            // 插件错误回调
                            // console.error(
                            //   `window-${iWndIndex}, errorCode: ${iErrorCode}`,
                            //   oError
                            // );

                            // that.$Message.error(
                            //   "错误码--" + iErrorCode + "--请至安防平台查看错误码"
                            // );

                            // return;
                        },
                        windowEventOver(iWndIndex) {
                            // 鼠标移过回调
                            // console.log(iWndIndex, "鼠标移过回调");
                        },
                        windowEventOut(iWndIndex) {
                            // 鼠标移出回调
                            // console.log(iWndIndex, "鼠标移出回调");
                        },
                        windowEventUp(iWndIndex) {
                            // 鼠标mouseup事件回调
                            console.log(iWndIndex, '鼠标mouseup事件回调')
                        },
                        windowFullCcreenChange(bFull) {
                            // 全屏切换回调
                            console.log(bFull, '全屏切换回调')
                        },
                        firstFrameDisplay(iWndIndex, iWidth, iHeight) {
                            // 首帧显示回调
                            console.log(iWndIndex, iWidth, iHeight, '首帧显示回调')
                        },
                        performanceLack() {
                            // 性能不足回调
                            console.log('性能不足')
                            // that.$Message.error('性能不足')
                        }
                      })
                      .then(() => {
                        myPlugin
                          .JS_SetOptions({
                              bSupportSound: true, // 是否支持音频，默认支持
                              bSupporDoubleClickFull: true, // 是否双击窗口全屏，默认支持
                              bOnlySupportMSE: false, // 只支持MSE
                              bOnlySupportJSDecoder: false // 只支持JSDecoder
                          })
                          .then(() => {
                              console.log('JS_SetOptions')
                          })
                      })
                  let params = {
                    "appId": "baeb4bf45f774c24b167ke136e515545",
                    // "deviceId": "6d9483777f1e412ba8eb0b321e0eb243",
                    // "deviceId": "9fe2d5dd25f34d5892f94d11e673e872",
                    "deviceId":value.deviceCode,
                    // recordLocation:0,
                    "streamType": 0,
                    "protocol": "ws",
                    "expand": "transcode=0",
                    "streamform": "ps"
                  }
                  // let params = {
                  //   "appId": "baeb4bf45f774c24b167ke136e515545",
                  //   "deviceId": "9fe2d5dd25f34d5892f94d11e673e872",
                  //   "streamType": 0,
                  //   "protocol": "ws",
                  //   "expand": "transcode=0",
                  //   "streamform": "ps"
                  // }
                  vue_this.getViedoRealTimeUrlAndPlay(params,myPlugin)

                  const zoomDom = dom.querySelector('.tool_zoom')
                  zoomDom.addEventListener('click',function(){
                    vue_this.monitorSelectedName = data.deviceName
                    vue_this.monitorFullScreenPlay()

                    return

                    myPlugin.JS_FullScreenDisplay(true).then(()=>{
                      console.log(`wholeFullScreen success`)
                    },e=>{console.log(e)})
                  })
                  const replayDom = dom.querySelector('.btn-replay')
                  replayDom.addEventListener('click',function(){
                    let deviceId = value.deviceCode
                    // let deviceId = '6d9483777f1e412ba8eb0b321e0eb243'
                  
                    vue_this.monitorSelectedName = data.deviceName
                    vue_this.monitorReplay(deviceId)
                  })

                }
              },1000)
             

            }
          })
        }
        removeDevicePop(){
          if(devicePopMonitorPugin){
            devicePopMonitorPugin.JS_Stop(0)
            devicePopMonitorPugin = null
          }
          if(DevicePopObject){
            this.scene.remove(DevicePopObject)
            DevicePopObject = null
          }
        }

        // 添加告警扩散波
        addAlarmCircle(pos,type){
          // 临时数据
          // pos = pos || [0,542.0649772279536,-424.74336272283836]
          pos = pos || [-673.0201894446361,542.0649772279536,-424.74336272283836]
          type = type?type:0
          // let circle = new THREE.Mesh(new THREE.CircleGeometry(25,128),this.circleMaterial)
          // alarmCircleObjects.push(circle)
          // circle.rotateX(-Math.PI/2)
          // circle.position.set(...pos)
          // this.scene.add(circle)
          // console.log("扩散波",pos,circle)
          const img = alarmCircleImgs[type]
          let dom = document.createElement('div')
          dom.innerHTML = `
            <img class="device-alarm-circle" src="${img}">
          `
          let objectCss = new CSS2DObject(dom)
          objectCss.position.set(...pos)
          alarmCircleObjects.push(objectCss)
          this.scene.add(objectCss)
          

        }
        removeAllAlarmCircles(){
          for(let i=0;i<alarmCircleObjects.length;i++){
            let obj = alarmCircleObjects[i]
            // this.deleteObj(obj)
            this.scene.remove(obj)
          }
          alarmCircleObjects = []
        }

        addDevice(){
          
          for(let i = 0; i < device.length; i++) {
            const color = 0xffffff
            const textureLoader = new THREE.TextureLoader();
            const typeObj = {
              火警: "assets/img/tag/fire.png",
              相机: "assets/img/tag/jingcha.png",
              电力: "assets/img/tag/e.png",
            };
            const map = textureLoader.load(typeObj[device[i].type]);
            let material = new THREE.SpriteMaterial({
              map: map,
              color: color,
              // blending: THREE.AdditiveBlending,
              transparent: true,
              depthTest: false,
            });
            let mesh = new THREE.Sprite(material);
            mesh.name = device[i].name
            // 设置位置
            mesh.position.set(device[i].position[0], device[i].position[1], device[i].position[2]);
            // mesh.position.copy(camera.position)
            mesh.scale.set(10, 10, 10)
            console.log(mesh)
            this.scene.add(mesh)
            // var sphereGeometry = new THREE.SphereGeometry(0.01, 5, 5);
            // var sphereMaterial = new THREE.MeshBasicMaterial({
            //   color: "lightgreen",
            // });
            // var sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
            // sphereMesh.position.set(device[i].position[0], device[i].position[1],device[i].position[2])
            // console.log(sphereMesh)
            // this.scene.add(sphereMesh)

            // this.createTag(sphereMesh.position)
          }

        }

        // 显示选择的楼层
        async selectFloorModel(floor,bool=false) {
    

          this.vue_this.animating = true
          const vue_this = this.vue_this
          
          if(floorSelected){
            this.recoverFloorMat(floorSelected)
          }
          // 进入楼层时,去除报警点及其弹窗
          this.removeAlarmPointsAll()
          this.closeAllAlarmPop()

          let that = this
          let buildingName = vue_this.viewerSelect
          let children = BuildingModals[buildingName].children
          let floorGroup = children.find(item => {
            return floor == parseInt(item.userData.floorNum)
          })

          this.addFloorWallEffect(floorGroup)

          let view = BuildingFloorView[buildingName]?BuildingFloorView[buildingName][floor]:null
          if(view){
            this.viewFlyTo(this.camera,this.controls,view.camera,view.control,1500,function(){
              // 添加楼层设备
              // that.addDevice()
              vue_this.animating = false
            })
          }else{
            vue_this.animating = false
          }

          floorSelected = floorGroup
          let floorNum = floor
          if(CUR_MODE == 'BuildingSelected'){
            CUR_MODE = "FloorSelected"
            vue_this.CUR_MODE = "FloorSelected"

            for(let i=0;i<children.length;i++){
              let floor = children[i]
              let floorNo = floor.userData.floorNum
              if(floorNo>floorNum){
                gsap.to(floor.position, {
                  z:  -((floorNo-floorNum)*1000 + 5000),
                  duration: 1,
                  
                  onComplete: () => {
                    if(CUR_MODE == 'FloorSelected'){
                      floor.visible = false
                      floor.position.z = 0
                      floorGroup.visible = true
                    }
                  }
                });
              }else if(floorNo<floorNum){
                gsap.to(floor.position, {
                  z: (floorNum-floorNo)*1000+5000,
                  duration: 1,
                  
                  onComplete: () => {
                    if(CUR_MODE == 'FloorSelected'){
                      floor.visible = false
                      floor.position.z = 0
                      floorGroup.visible = true
                    }
                    // if(i==children.length-1){
                    //   vue_this.animating = false
                    // }
                  }
                });
              }
            }
          }else{
            CUR_MODE = "FloorSelected"
            vue_this.CUR_MODE = "FloorSelected"
            for(let i=0;i<children.length;i++){
              let floor = children[i]
              floor.visible = false
              floor.position.z = 0
            }
            floorGroup.visible = true
            vue_this.animating = false
          }

          const floorsData = vue_this.floorsData[buildingName]
          const houseData = vue_this.houseData[buildingName]
          const floorData = floorsData.find(item => item.floorNum == floor)
          console.log("选择的楼层数据",floorsData,floor,floorData)
          console.log("选择的楼栋数据",houseData)
          const houseId = houseData.houseId
          const floorId = floorData.houseId
          const parentId = floorData.parentId
          // 
          if(floor>0 && !bool){
            vue_this.$emit('floorSelect',floorId,floor,parentId)
          }
          await vue_this.getDevicesInfo(houseId,floorId)
          this.removeDevicePoints()
          this.removeDevicePop()

          
        }
        async selectUnderFloorModel(floor,bool = false){
          CUR_MODE="FloorSelected"
          this.vue_this.CUR_MODE="FloorSelected"
          this.vue_this.animating = true
          const vue_this = this.vue_this
          if(floorSelected){
            this.recoverFloorMat(floorSelected)
          }
          // 进入楼层时,去除报警点及其弹窗
          this.removeAlarmPointsAll()
          this.closeAllAlarmPop()

          let that = this
          let children = BuildingSelected.children[0].children

          let floor2 = floor==-1?2:1

          console.log('选择的地下楼层',floor2)

          let floorGroup = children.find(item => {
            return floor2 == parseInt(item.name.split("_")[1])
          })
          floorSelected = floorGroup
          console.log('选择的楼层group',floorGroup)
          let buildingName = BuildingSelected.buildingName



          let view = BuildingFloorView[buildingName]?BuildingFloorView[buildingName][floor2]:null
          if(view){
            this.viewFlyTo(this.camera,this.controls,view.camera,view.control,1500,function(){
              // 添加楼层设备
              // that.addDevice()
              vue_this.animating = false
            })
          }else{
            vue_this.animating = false
          }
          let floorNum = floor2
          if(CUR_MODE == 'BuildingSelected'){
            CUR_MODE = "FloorSelected"
            vue_this.CUR_MODE = "FloorSelected"
            for(let i=0;i<children.length;i++){
              let floor = children[i]
              let floorNo = parseInt(children[i].name.split("_")[1] )
              if(floorNo>floorNum){
                gsap.to(floor.position, {
                  z: -floorNo / 10,
                  duration: 3,
                  
                  onComplete: () => {
                    if(CUR_MODE == 'FloorSelected'){
                      floor.visible = false
                      floor.position.z = 0
                      floorGroup.visible = true
                    }

                  }
                });
              } else if(floorNo<floorNum){
                gsap.to(floor.position, {
                  z: -(floorNo-floorNum)/10,
                  duration: 2,
                  
                  onComplete: () => {
                    if(CUR_MODE == 'FloorSelected'){
                      floor.visible = false
                      floor.position.z = 0
                      floorGroup.visible = true

                    }
                  }
                });
              }
            }
          }else{
            CUR_MODE = "FloorSelected"
            vue_this.CUR_MODE = "FloorSelected"
            for(let i=0;i<children.length;i++){
              let floorNo = parseInt(children[i].name.split("_")[1] )
              let floor = children[i]
              floor.visible = false
              floor.position.z = 0
            }
            floorGroup.visible = true

              vue_this.animating = false
          }

          const floorsData = vue_this.floorsData[buildingName]
          const houseData = vue_this.houseData[buildingName]
          const floorData = floorsData.find(item => item.floorNum == floor)
          console.log("选择的楼层数据",floorsData,floor,floorData)
          console.log("选择的楼栋数据",houseData)
          const houseId = houseData.houseId
          const floorId = floorData.houseId
          const parentId = floorData.parentId

          if( !bool){
            vue_this.$emit('floorSelect',floorId,floor.toString(),parentId)
          }
          await vue_this.getDevicesInfo(houseId,floorId)
          this.removeDevicePoints()
          this.removeDevicePop()

        }

        async selectDimianFloorModel(floor,bool=false){
          const vue_this = this.vue_this
          CUR_MODE="FloorSelected"
          vue_this.CUR_MODE="FloorSelected"

          let buildingName = BuildingSelected.buildingName
          const floorsData = vue_this.floorsData[buildingName]
          const houseData = vue_this.houseData[buildingName]
          const floorData = floorsData.find(item => item.floorNum == floor)

          console.log("选择的楼层数据",floorsData,floor,floorData)
          console.log("选择的楼栋数据",houseData)
          const houseId = houseData.houseId
          const floorId = floorData.houseId
          const parentId = floorData.parentId
          if(!bool){
            vue_this.$emit('floorSelect',floorId,floor,parentId)
          }
          await vue_this.getDevicesInfo(houseId,floorId)
          this.removeDevicePoints()
          this.removeDevicePop()
        }
       
        // CUR_MODE 从FloorSelected 到 BuildingSelected
        buildingFloorRecover(duration=3){
          let vue_this = this.vue_this
          let floors = BuildingModals[BuildingSelected.buildingName].children
          if(duration){
            vue_this.animating = true
            for(let i=0;i<floors.length;i++){
              floors[i].visible = true

              let floor = floors[i]
              gsap.to(floor.position, {
                  z: 0,
                  duration: duration,
                  
                  onComplete: () => {
                    floor.visible = true
                    if(i==floors.length-1){
                      vue_this.animating = false
                    }
                    // gsap.to(floor.position, {
                    //   y: 0,
                    //   duration: 3,
                    // });
                  }
              });
            }
          }else{
            for(let i=0;i<floors.length;i++){
              floors[i].visible = true
              floors[i].position.y = 0
            }
          }
          if(floorSelected){
            this.recoverFloorMat(floorSelected)
          }
          floorSelected = null
          
        }

        // CUR_MODE 从 BuildingSelected 到 init
        buildingBackToInit(){
          const vue_this = this.vue_this
          CUR_MODE = "init"
          vue_this.CUR_MODE = "init"

          // 移出楼栋
          this.scene.remove(BuildingSelected)
          BuildingSelected = null

          // 移除设备
          this.removeDevicePoints()
          this.removeDevicePop()

          this.recoverBuildingLight()

          // 恢复初始场景
          this.recoverScene()

          // 
          this.alarmPanelsUpdate()
          // 
          this.vue_this.viewerSelect = ""

          alarmDeviceId = ""

          vue_this.animating = true
          this.cameraFlyTo(this.camera.userData.pos,this.controls.userData.target,function(){
            vue_this.animating = false
          })
        }

        // 
        changeBuilding(name){
          console.log(BuildingSelected,"////////")
          this.scene.remove(BuildingSelected)
          BuildingSelected = null
          const that = this
          this.vue_this.animating = true
          this.cameraFlyTo(BuildingView[name].camera, BuildingView[name].control, function(){
            that.vue_this.animating = false
            that.showBuilding(name)

          })
        }

        // CUR_MODE 从 FloorSelected 到init
        floorBackToInit(){
          const vue_this = this.vue_this
          this.removeDevicePoints()
          this.removeDevicePop()
          this.removeAllAlarmCircles()

          CUR_MODE = "init"
          vue_this.CUR_MODE = "init"

          this.enableControl()
          this.vue_this.currentBuildingFloor = 0 
          this.vue_this.viewerSelect = ""

          this.buildingFloorRecover(0)
          
          // this.closeTag()
          this.scene.remove(BuildingSelected)
          BuildingSelected = null
          floorSelected = null

           // 恢复初始场景
          this.recoverScene()
          this.alarmPanelsUpdate()

          vue_this.animating = true
          this.cameraFlyTo(this.camera.userData.pos,this.controls.userData.target,function(){
            vue_this.animating = false
          })
          // this.recoverFloorMat()
          alarmDeviceId = ""
          this.recoverBuildingLight()

          vue_this.$emit('floorBackToBuilding')

        }

        floorToBuilding(){
          CUR_MODE = "BuildingSelected"
          this.vue_this.CUR_MODE = "BuildingSelected"
          // this.vue_this.currentBuildingFloor = 0
          let name = BuildingSelected.buildingName
          this.buildingFloorRecover()
          if(BuildingView[name]){
            const {camera,control} = BuildingView[name]
            this.cameraFlyTo(camera, control)
          }
        
          this.removeDevicePoints()
          this.removeDevicePop()
          this.removeAllAlarmCircles()
          this.enableControl()
          alarmDeviceId = ""

          this.vue_this.$emit('floorBackToBuilding')

        }

        viewFlyTo(camera,controls,cameraPos,controlTarget,duration,callback){
          let pos = new THREE.Vector3(cameraPos.x,cameraPos.y,cameraPos.z)
          let target = new THREE.Vector3(controlTarget.x,controlTarget.y,controlTarget.z)
          let tween = new TWEEN.Tween(camera.position).to(cameraPos,duration)
          let tween2 = new TWEEN.Tween(controls.target).to(controlTarget,duration)
          tween.onComplete(function(){
            console.log("动画完成")
            if(callback){
              callback()
            }
          })
          tween.start()
          tween2.start()
        }

        // 初始化大楼模型名称，楼层
        initBuildingModalName(object,name){
          object.userData['buildingName'] = name
          if(object.children&&object.children.length){
            for(let i=0;i<object.children.length;i++){
              this.initBuildingModalName(object.children[i],name)
            }
          }
        }
        initBuildingModalFloor(object,group,floor){
          group.userData['floorNum'] = floor
          if(group.type == "Mesh"){
            let name = group.name
            group.receiveShadow = true
            group.castShadow = true
            group.material.side = THREE.DoubleSide
            group.material.transparent = false

            if(name.split("_")[0] === 'wall'){
                // console.log("wall",group)
                // console.log(name)
                group.material.transparent = true
                group.material.opacity = 0.5
                // group.material.opacity = 0
                // group.material.depthWrite = false
                // group.material.depthTest = false
                // group.castShadow = false
                // group.material.depthWrite = false
            }
            group.userData.material_before = group.material //保存原有样式
            group.userData.floorGroup = object // 保存属于楼层group

          }
          if(group.children&&group.children.length){
            for(let i=0;i<group.children.length;i++){
              this.initBuildingModalFloor(object,group.children[i],floor)
            }
          }
        }

        initMehGroupMap(arr){

          let data = arr.children
          for(let i = 0;i <data.length;i++){
            let group = data[i]
            if(group.type === 'Mesh'){
              let name = group.name
              // group.castShadow = true
              // group.material = buildingMaterial
              // modalMeshGroupMap.set(name,arr)

              group.receiveShadow = true
              group.castShadow = true
              group.material.side = THREE.DoubleSide
              group.material.transparent = false
              
              

              if(name.split("_")[0] === 'wall'){
                // console.log("wall",group)
                // console.log(name)
                group.material.transparent = true
                group.material.opacity = 0.3
                // group.material.opacity = 0
                // group.material.depthWrite = false
                // group.material.depthTest = false
                // group.castShadow = false
                // group.material.depthWrite = false
              }
              // let material = group.material.clone()

              // group.material.opacity = 0.6
              

              // group.material = material

              group.floorNo = parseInt(arr.name.split("_")[1])
              group.userData.material_before = group.material //保存原有样式
              group.userData.floorGroup = arr // 保存属于楼层group


            }else{
              if(group.children){
                this.initMehGroupMap(group)
              }
            }
          }
        }
        initMeshUnderMap(floor,children){
          // console.log(floor.name)
          for(let i = 0;i<children.length;i++){
            let c = children[i]
            if(c.type == 'Mesh'){
              // modalMeshGroupMap.set(c.name,floor)
              c.receiveShadow = true
              c.castShadow = true
              c.material.side = THREE.DoubleSide
              c.material.transparent = false
              c.floorNo = parseInt(floor.name.split("_")[1])
              // floorMeshMatMap.set(c.name,c.material)
              c.userData.material_before = c.material //保存原有样式
              c.userData.floorGroup = floor // 保存属于楼层group
            }else{
              this.initMeshUnderMap(floor,c.children)
            }
          }
        }

        hoverMesh(event) {
          let that = this
          
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            // let raycaster = new THREE.Raycaster();
            
            //通过摄像机和鼠标位置更新射线
            raycaster.setFromCamera(mouse, this.camera);
            // let floorObject = this.scene.getObjectByName(BuildingSelected.name)
            let intersects = []
            //进行检测
            if(BuildingSelected){
              intersects = raycaster.intersectObject(BuildingSelected);
            }

            if(intersects.length){
              let mesh = intersects[0].object
              let name = mesh.name
              // console.log("当前mesh",name,mesh.material)
              let group = mesh.userData.floorGroup
              if(!group){
                return
              }
              let floorName = group.name //当前hover楼层name
              let floorNum = parseInt(group.name.split("_")[1] )
              this.vue_this.hoverBuildingFloor = floorNum
              
              if(floorSelected&&floorSelected.name === floorName){
                return
              }
              // 还原material
              if(floorSelected){
                // console.log("!!!!!",floorSelected.name, floorName)

                let children = floorSelected.children
                for(let i=0;i<children.length;i++){
                  children[i].material = children[i].userData.material_before
                }
              }
              floorSelected = group
              let children = group.children
              for(let i=0;i<children.length;i++){
                children[i].material = new THREE.MeshLambertMaterial({
                  color:new THREE.Color('#049EF4')
                })
              }
              console.log("当前mesh",mesh,group,floorSelected)
              // console.log(floorSelected)
            }else {
              this.vue_this.hoverBuildingFloor = 0
              // 还原material
              if(floorSelected){
                let children = floorSelected.children
                for(let i=0;i<children.length;i++){
                  children[i].material = children[i].userData.material_before
                }
              }
            }

        }

        buildingClickHandler(event) {

          let that = this
          mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
          mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

          //通过摄像机和鼠标位置更新射线
          raycaster.setFromCamera(mouse, this.camera);
          // let floorObject = this.scene.getObjectByName("floor")
          
          // console.log(floorObject)
          // 进行检测
          let intersects = []
          if(BuildingSelected){
            intersects = raycaster.intersectObject(BuildingSelected);
          }
          if(intersects.length) {
            let mesh = intersects[0].object
            let name = mesh.name
            // console.log("当前mesh",name,mesh.material)
            let group = mesh.userData.floorGroup
            if(!group){
              return
            }
            let floorNum = parseInt(group.name.split("_")[1])

            this.vue_this.currentBuildingFloor = floorNum
            this.selectFloorModel(floorNum)

           
          }
          
        }
        // 还原楼层样式
        recoverFloorMat(group){
          let children = group.children
          for(let i=0;i<children.length;i++){
            // if(children[i].name.split("_")[0] == 'kuang2'){
            //   children[i].visible = true
            // }
            if(children[i].userData.material_before){
              children[i].material = children[i].userData.material_before
            }
          }
          
        }

        // 选择楼层时需要进行的效果修改
        addFloorWallEffect(group){
          console.log("选择的楼层",group)
          let children = group.children
          for(let i=0;i<children.length;i++){
            if(children[i].name.split("_")[0] == 'wall'){
              children[i].material = this.wallMaterial
              console.log(children[i],'material')
            }
            // if(children[i].name.split("_")[0] == 'kuang2'){
            //   children[i].visible = false
            // }
          

          }
          // let gui = new dat.GUI()
          // let control = gui.addFolder("wall")

          // let params = {
          //   addVal:15.3,
          //   maxH:15.0,
          // }
          // const that = this
          
          // control.add(params,'addVal',-1000,1000,0.1).onChange(function(val){
          //     that.wallShader.uniforms.addVal.value = val
          // })
          // control.add(params,'maxH',-1000,1000.0,0.1).onChange(function(val){
          //     that.wallShader.uniforms.maxH.value = val
          // })

        }

        // 不允许control操作 
        disableControl(){
          this.controls.enabled = false
          return 
          this.controls.enableZoom = false
          this.controls.enableRotate = false
          this.controls.enablePan = false
        }

        // 允许control操作
        enableControl(){
          this.controls.enabled = true
        }



        floorClickHandler(event) {
          // console.log(event)
          let that = this
          mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
          mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
          
          //通过摄像机和鼠标位置更新射线
          raycaster.setFromCamera(mouse, this.camera);
          // let floorObject = scene.getObjectByName("floor")
          
          // console.log(floorObject)
          //进行检测
          const intersects = raycaster.intersectObject(BuildingSelected);
          if(intersects.length){
            let floor = this.vue_this.currentBuildingFloor
            for(let i=0;i<intersects.length;i++){
              if( intersects[i].object.userData.floorNum == floor){
                console.log("当前鼠标位置所在楼层",JSON.stringify(intersects[i].point),intersects[i]);
                break
              }
            }
          }
            

        }

        allDevicesSceneClickHandler(event){
          let that = this
          mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
          mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
          
          //通过摄像机和鼠标位置更新射线
          raycaster.setFromCamera(mouse, this.camera);
          const intersects = raycaster.intersectObject(allDevicesBuildingModel);
          
          if(intersects.length){
            console.log('所有设备场景点击',intersects)
            // let nameMap = ModelNameMap2
            // for(let i = 0;i<intersects.length; i++){
            //   let obj = intersects[i].object
            //   if(obj.name&&nameMap[obj.name.split('_')[1]]){
            //     let name = nameMap[obj.name.split('_')[1]]
            //     console.log('点击了',name)
            //     this.vue_this.buildingViewChange(name)
            //     break
            //   }
            // }
          }
          
        }

        // 添加单个报警点
        addAlarmPoint(data,type){
          const that = this
          // const img = require("../../asserts/images/map/red.png")
          const img1 = require("../../asserts/images/map/red.png")
          const img2 = require("../../asserts/images/map/yellow.png")
          // const img1 = require("../../asserts/images/map/red.gif")
          // const img2 = require("../../asserts/images/map/yellow.gif")

          const img = type==0?img1:img2
          const id = data.id
          data.type = type

          let dom = document.createElement('div')
          dom.setAttribute('id',id)
          dom.innerHTML = `<img class="alarm-point-gif${type}" id="${id}" style="width:20px;height:20px" src="${img}" alt="">`
          let ObjectCss = new CSS2DObject(dom)
          let pos = data.position
          ObjectCss.position.set(...pos)
          console.log('报警点点位',pos)
          ObjectCss.userData.id = id
          AlarmsObjects.push(ObjectCss)
          this.scene.add(ObjectCss)
          this.showPointMesh(pos)
          dom.addEventListener('click',function(ev){
            ev.preventDefault()
            let pop = document.getElementById('sx-pop-'+id)
            if(pop){
              return
            }
            that.addAlarmPop(data.position,id,data)
          })
        }

        // 报警点弹窗
        addAlarmPop(pos,id,data){
           
          let newId = 'sx-pop-'+id

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

          this.vue_this.curPopId = newId;
          const img1 = require("../../asserts/images/map/bj.png")
          const img2 = require("../../asserts/images/map/arrow.png")
          const close = require("../../asserts/images/close.png")

          let dom = document.createElement('div')
          dom.classList.add('three_alarm-pop')
          dom.setAttribute('id',newId)
          dom.innerHTML = `
            <div  style="transform: scale(0.8,0.8) translate(281px, 24px);">
              <div class="sx-warn-pop-wrapper" >
                <div class="pop-line"></div>
                <div class="pop-content">
                  <div style="display:flex;align-items:center;position:relative">
                    <img src="${img1}" alt="">
                    <span class="alarm-title">${AlarmTypeMap[data.sort]}</span>
                    <img class="close-btn" src="${close}" alt="" style="pointer-events:auto">
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
          </div>`
          let objectCss = new CSS2DObject(dom)
          objectCss.position.set(...pos)
          objectCss.userData.id = id
          AlarmsPopObjects.push(objectCss)
          this.scene.add(objectCss)

          const closeDom = dom.querySelector('.close-btn')
          const that = this
          
          closeDom.addEventListener('click',function(ev){
            ev.preventDefault()
            console.log("点击了关闭按钮")
            // that.scene.remove(objectCss)
            that.closeAlarmPopById(id)
          })

          const detailDom = dom.querySelector('.sx-warn-detail')
          detailDom.addEventListener('click',function(ev){
            console.log(data)
            that.vue_this.$emit('alarmDetailHandler',data)
            that.alarmDetailHandler(data)
          })

          // 应急预案
          const yjya = dom.querySelector('.sx-warn-xfbj')
          if(yjya){
            yjya.addEventListener('click',function(){
              that.vue_this.$emit('alarmYJYAHandler',data)
              that.alarmDetailHandler(data,true)

            })
          }

          // 消警
          const xjDom = dom.querySelector('.sx-warn-xj')
          if(xjDom){
            xjDom.addEventListener('click',function(){
              that.vue_this.alarmHandlerType = 0
              that.vue_this.alarmHandlerData = data
              // // that.alarmModal = true
              that.vue_this.alarmHandler()
              that.closeAlarmPopById(id)
              that.removeAlarmPointById(id)

              let type = 0

              let alarmData = that.vue_this.alarmData
              for(let i=0;i<alarmData.length;i++) {
                const list = alarmData[i].deviceList
                for(let j=0;j<list.length;j++){
                  if(list[j].deviceId == data.deviceId){
                    type = alarmData[i].type
                    break
                  }
                }
              }
              buildingAlarmCountGroup[data.buildingName][type]-=1

              // that.vue_this.groupAlarmsByBuildingName(alarmData)

            })
          }
          //生成工单
          const gdDom = dom.querySelector('.sx-warn-gd')
          if(gdDom){
            gdDom.addEventListener('click',function(){
              that.vue_this.alarmHandlerType = 1
              that.vue_this.alarmHandlerData = data
              // console.log(data)
              // // that.alarmModal = true
              that.vue_this.alarmHandler(gdDom,xjDom,data)
            })
          }

          return objectCss

        }

        // 告警弹窗查看详情
        async alarmDetailHandler(data,isYJYA = false){
          const that = this
          console.log("详情数据",data)
          // 当前告警的设备id 目前为 测试 假 数据 ！！！！！（妈的，烦死了）
          // alarmDeviceId = data.deviceId
          alarmDeviceId = "50ce5bd6e28f96876f6089676296b149"
          // this.recoverAllDevicesLight()
          // 当前
          if(CUR_MODE == 'Alarms'){
            this.allAlarmsSceneChangeToFloor()
            let buildingName = data.buildingName
            await this.vue_this.setFloorDataByBuildingName(buildingName)
            this.vue_this.viewerSelect = buildingName
            this.vue_this.animating = true
            this.cameraFlyTo(BuildingView[buildingName].camera, BuildingView[buildingName].control, function(){
              that.showBuildingNoAnimation(buildingName,async function(){
                that.alarmDetailHandlerFunc(data,isYJYA)
              })
              that.vue_this.animating = false
            })
          }
          // else{
          //   that.alarmDetailHandlerFunc(data,isYJYA = false)
          // }

        }
        async alarmDetailHandlerFunc(data,isYJYA = false){
          // 临时假数据
          data = {
            floorNum:20,
            deviceTypeOne:"a41abfc18cf416f1d9ccb9e84288aab7"
          }
          const that = this
          let floorNum = data.floorNum
          let floors = that.vue_this.currentFloorsData
          console.log('告警详情',floors,floorNum)

          for(let i=0;i<floors.length;i++){
            if(floorNum == floors[i].floorNum){
              const param = {floor:floorNum,data:floors[i]}
              that.vue_this.currentBuildingFloor = floorNum

              await that.vue_this.selectFloor(floorNum,true)

              that.vue_this.$nextTick(()=>{
                const type = data.deviceTypeOne
                const list = that.vue_this.deviceTypeList

                if(isYJYA){
                  that.vue_this.$refs.device.deviceSelectAll()
                }else{
                  for(let i=0;i<list.length;i++){
                    if(list[i].deviceTypeOne == type){
                      that.vue_this.$refs.device.deviceTypeSelect(i,list[i])
                      break
                    }
                  }
                }
                // that.addAlarmCircle()

                
              })
              break
            }
          }
        }

        // 关闭报警弹窗
        closeAlarmPopById(id){
          for(let i=0;i<AlarmsPopObjects.length;i++){
            let obj = AlarmsPopObjects[i]
            if(obj.userData.id == id){
              this.scene.remove(obj)
              AlarmsPopObjects.splice(i,1)
            }
          }
        }
        closeAllAlarmPop(){
          for(let i=0;i<AlarmsPopObjects.length;i++){
            this.scene.remove(AlarmsPopObjects[i])
          }
          AlarmsPopObjects = []
        }

        // 根据id删除报警点
        removeAlarmPointById(id){
          for(let i=0;i<AlarmsObjects.length;i++){
            let obj = AlarmsObjects[i]
            if(obj.userData.id == id){
              this.scene.remove(obj)
              AlarmsObjects.splice(i,1)
            }
          }
        }
        // 移除报警点
        removeAlarmPointsAll(){
          for(let i=0;i<AlarmsObjects.length;i++){
            this.removeObjInScene(AlarmsObjects[i])
          }
          AlarmsObjects = []
        }

        // 移除场景中的对象
        removeObjInScene(obj){
          this.scene.remove(obj)
        }

        showPointMesh(position){
          var geosp = new THREE.SphereGeometry(10, 5, 5);
          var matsp = new THREE.MeshBasicMaterial({
            color: "lightgreen",
          });
          let mesh = new THREE.Mesh(geosp, matsp);
          mesh.position.set(
            new THREE.Vector3(...position)
          )
          this.scene.add(mesh);
        }

        showGuanXian_temp(){
          // CUR_MODE = ""
          const cameraPos = {"x":1109.8014241803512,"y":1541.9486054820134,"z":703.3055915415658}
          const controlTarget ={"x":621.8477452102918,"y":374.1049510725,"z":-214.90072269796443}
          var loader = new GLTFLoader();
          const dracoLoader = new DRACOLoader();
          dracoLoader.setDecoderPath("assets/draco/");
          loader.setDRACOLoader(dracoLoader);
          let that = this;

          this.cameraFlyTo(cameraPos,controlTarget,function(){
            // that.hideModel()
            loader.load("assets/models/glb/01guanxian.glb",(gltf) => {
              GuanXianModels_temp = gltf.scene
              console.log(GuanXianModels_temp)
              const {x,y,z} = {"x":-34.69600863310664,"y":0,"z":150.3774026388162}
              gltf.scene.scale.set(20000, 20000, 20000);
              gltf.scene.position.set(x,y,z)
              // gltf.scene.rotation.x = -Math.PI
              that.scene.add(gltf.scene);
              that.hideModel()
              // that.scene.add(gltf.scene);
            })
          })

        }
        hideGuanXian_temp(){
          if(GuanXianModels_temp){
            this.scene.remove(GuanXianModels_temp)
          }
        }
       

        async showAllDevicesScene(){

          CUR_MODE = "AllDevices"
          this.vue_this.CUR_MODE = "AllDevices"

          this.hideModel()

          this.removeAlarmPointsAll()
          this.closeAllAlarmPop()
          
          this.removeAllBuildingAlarmPanels()

          this.changeToAllDevicesLight()
          const that = this
          this.cameraFlyTo(BuildingView['main'].camera,BuildingView['main'].control,function(){
            that.showAllDevicesBuildingScene()
          })


          let vue_this = this.vue_this
          // 临时 假数据
          const buildingId = "5163c1fb-e14e-4d49-b8dc-523c76baa97c"
          const floorId = "565e09d7-d74f-11ec-8084-0242ac110121"
          // vue_this.currentBuildingFloor = 20
          // await vue_this.getDevicesInfo(buildingId,floorId)
         
          this.vue_this.getAllDevices()


          // this.showBuilding('w07')

          // vue_this.alarmWebSocketConn()
          // vue_this.realTimeAlarmFunc(alarms,true)
        }

        showAlarmsScene(buildingName){
          let vue_this = this.vue_this
          CUR_MODE = "Alarms"
          vue_this.CUR_MODE = "Alarms"
          // this.removeAlarmPointsAll()
          // this.closeAllAlarmPop()
          const that = this
          this.hideModel()

          this.removeAllBuildingAlarmPanels()

          // 目前报警和所有设备共用一套灯光和模型
          this.changeToAllDevicesLight()

          this.cameraFlyTo(BuildingView['main'].camera,BuildingView['main'].control,function(){
            that.showAllDevicesBuildingScene()
          })
          
          vue_this.realTimeAlarmFunc(alarms,true)
        }

        hideAllDevicesScene(){
          this.removeDevicePoints()
          this.removeDevicePop()
          this.removeAllAlarmCircles()
          this.recoverAllDevicesLight()
          this.vue_this.currentBuildingFloor = 0
          this.hideAllDevicesBuildingScene()
          this.cameraFlyTo(this.camera.userData.pos,this.controls.userData.target)
          this.recoverScene()

          CUR_MODE = "init"
          this.vue_this.CUR_MODE = "init"
          this.alarmPanelsUpdate()
          // this.vue_this.alarmWebSocketClose()

        }

        hideAllAlarmsScene(){
          this.removeAlarmPointsAll()
          this.closeAllAlarmPop()
          this.recoverAllDevicesLight()
          this.hideAllDevicesBuildingScene()
          this.recoverScene()

          CUR_MODE = "init"
          this.vue_this.CUR_MODE = "init"
          this.alarmPanelsUpdate()
        }
        allDevicesSceneChangeToFloor(){
          this.vue_this.allDevicesShow = false
          this.removeDevicePoints()
          this.removeDevicePop()
          this.removeAllAlarmCircles()
          this.recoverAllDevicesLight()
          this.vue_this.currentBuildingFloor = 0
          this.closeAllAlarmPop()
          this.removeAlarmPointsAll()
          this.hideAllDevicesBuildingScene()
        }
        allAlarmsSceneChangeToFloor(){
          this.vue_this.allAlarmsShow = false
          this.removeAlarmPointsAll()
          this.closeAllAlarmPop()
          this.vue_this.currentBuildingFloor = 0
          this.removeAllAlarmCircles()
          this.recoverAllDevicesLight()
          this.hideAllDevicesBuildingScene()
        }
        allDevicesSceneChangeToBuilding(){
          const vue_this = this.vue_this
          vue_this.allDevicesShow = false
          this.removeDevicePoints()
          this.removeDevicePop()
          this.removeAllAlarmCircles()
          vue_this.currentBuildingFloor = 0
          this.hideAllDevicesBuildingScene()
        }
        buildingBackToAllDevicesScene() {
          const vue_this = this.vue_this
          vue_this.allDevicesShow = true
          this.removeDevicePoints()
          this.removeDeivcePop()
          vue_this.currentBuildingFloor = 0

           // 移出楼栋
          this.scene.remove(BuildingSelected)
          BuildingSelected = null
          // ...未完成

        }

        devicesSceneToAlarmsScene(){
          let vue_this = this.vue_this
          CUR_MODE = "Alarms"
          vue_this.CUR_MODE = "Alarms"
          this.removeDevicePoints()
          this.removeDevicePop()
          this.vue_this.currentBuildingFloor = 0

          vue_this.realTimeAlarmFunc(alarms,true)
        }
        devicesSceneToLiftScene(){
          this.removeDevicePoints()
          this.removeDevicePop()
          this.vue_this.currentBuildingFloor = 0

          showLiftScene()
        }
        alarmsSceneToDevicesScene() {
          this.removeAlarmPointsAll()
          this.closeAllAlarmPop()
          this.showAllDevicesScene()
        }

        alarmsSceneToLiftScene(){
          this.removeAlarmPointsAll()
          this.closeAllAlarmPop()
          this.showLiftScene()
        }

        liftSceneToAlarmsScene(){
          let vue_this = this.vue_this
          vue_this.$emit('floorBackToBuilding')

          CUR_MODE = "Alarms"
          vue_this.CUR_MODE = "Alarms"
          vue_this.realTimeAlarmFunc(alarms,true)

        }

        liftSceneToDevicesScene(){
          let vue_this = this.vue_this
          vue_this.$emit('floorBackToBuilding')

          this.showAllDevicesScene()
        }

        // 显示 展示所有设备时候的场景
        showAllDevicesBuildingScene(){
          this.hideModel()

          if(!allDevicesBuildingModel){
            var loader = new GLTFLoader();
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath("assets/draco/");
            loader.setDRACOLoader(dracoLoader);

            var envMap = this.getTexture("assets/img/publicpic/bluesky.jpg");
            envMap.mapping = THREE.EquirectangularReflectionMapping;
            let material = new THREE.MeshPhysicalMaterial({
              color: "#fff",
              side: THREE.DoubleSide,
              transparent: true,
              opacity: 0.2,
              envMap,
              envMapIntensity: 1,//1
              // reflectivity: 1,
              roughness:0.7,   //0.5
              metalness:1.0,
              depthWrite:true,
              depthTest:true,
              forceSinglePass:false
            })

            let dimianMat = material.clone()
            dimianMat.opacity = 0.7
            // dimianMat.color = new THREE.Color("#fcfcfc")

            let otherMat = material.clone()
            // this.addAllDevicesBuildingSceneControl(dimianMat,'dimian')
            // this.addAllDevicesBuildingSceneControl(otherMat,'other')
            // let material = new THREE.MeshLambertMaterial({
            //   color: "#ffffff",
            //   side: THREE.DoubleSide,
            //   transparent: true,
            //   opacity: 0.5,
            //   roughness:0.7,   //0.5
            //   metalness:1.0,
            //   // reflectivity: 1,
            //   // roughness:0.7,   //0.5
            //   // metalness:1.0,
            //   // depthWrite:false,
            //   // depthTest:false
            // })
            // let material = buildingMaterial

            let that = this;
            loader.load("assets/models/glb/sx_lanmo.glb",gltf => {
              allDevicesBuildingModel = gltf.scene
              gltf.scene.scale.set(5.0, 5.0, 5.0);
              // gltf.scene.scale.set(200.0, 200.0, 200.0);
              // gltf.scene.position.x += 105;
              // gltf.scene.position.z += 20; //10080

              allDevicesBuildingModel.traverse(obj => {
               
                obj.material = material
                if(obj.name.split('_')[0] == 'dimian'){
                  obj.material = dimianMat
                  
                  // console.log(obj.name,"!@#$%^&*()")
                  let floor = parseInt(obj.name.split('_')[2])
                  if(floor){
                    obj.renderOrder = floor
                  }
                
               
                }else{

                  obj.material = otherMat
                  obj.renderOrder = 25
                  // let floor = parseInt(obj.name.split('_')[2])

                  // if(obj.name.split('_')[0] == 'wall'){
                  //   let floor = 24-parseInt(obj.name.split('_')[2])
                  //   if(floor){
                  //     obj.renderOrder = floor
                  //   }
                  // }
           
                }
                obj.material.side = THREE.DoubleSide
                obj.castShadow = false
                obj.receiveShadow = false
              })

              that.scene.add(gltf.scene)


              that.ceshi7(gltf.scene)

              
            })
          }else{
            this.scene.add(allDevicesBuildingModel)
            // that.ceshi7(gltf.scene)
          }
          
        }

        hideAllDevicesBuildingScene(){
          this.scene.remove(allDevicesBuildingModel)
        }

        showLiftScene(){
          CUR_MODE = 'Lift'
          let vue_this = this.vue_this
          vue_this.CUR_MODE = 'Lift'
          this.removeAlarmPointsAll()
          this.closeAllAlarmPop()
          this.removeAllBuildingAlarmPanels()

          this.changeToAllDevicesLight()
          this.showAllDevicesBuildingScene()

          vue_this.$emit('showLift')
        }

        showAllLifts(){

          var loader = new GLTFLoader();
          const dracoLoader = new DRACOLoader();
          dracoLoader.setDecoderPath("assets/draco/");
          loader.setDRACOLoader(dracoLoader);

          loader.load('assets/models/glb/dianti.glb',gltf => {
            
          })

        }

        hideLiftScene(){
          this.recoverAllDevicesLight()
          this.vue_this.currentBuildingFloor = 0
          this.hideAllDevicesBuildingScene()
          this.recoverScene()
          CUR_MODE = "init"
          this.vue_this.CUR_MODE = "init"
          this.alarmPanelsUpdate()
          this.vue_this.$emit('floorBackToBuilding')
        }

        uniformsUpdate(){
          const that = this
          if(this.wallShader&&CUR_MODE=="FloorSelected"){
              // this.wallShader.uniforms.time.value += 0.002;
              this.wallShader.uniforms.time.value += 0.003;
          }
          if(this.circleShader){
              this.circleShader.uniforms.time.value += 0.01;
          }
     
          if(this.jbShadar4&&CUR_MODE=='AllDevices'||CUR_MODE=='Alarms'){
            // return
              that.x = that.x + 0.007 
              var xV=Math.sin(that.x)*5000.0-5000.0
              that.jbShadar4.uniforms.lightHeight.value = xV  
              // that.jbShadar4.uniforms.lightHeight.value -=1

          }
        }

        alarmPanelsUpdate(){
          if(CUR_MODE == 'init'){
            console.log("告警点按楼层分组数据",buildingAlarmCountGroup)
            // // TMD的 还是 用 假数据！！！
            // buildingAlarmCountGroup = {
            //   '3':{0:1,1:0,2:0},
            //   '2':{0:0,1:1,2:0},
            //   '1':{0:2,1:1,2:0},
            //   '5':{0:0,1:4,2:0},
            //   '6':{0:1,1:0,2:0}
            // }

            for(let key in buildingAlarmCountGroup){
              this.updateAlarmPanel(key,buildingAlarmCountGroup[key])
            }
          }
        }

        updateAlarmPanel(buildingName,data){

          let total = 0

          for(let key in data){
            if(data[key]){
              total+=data[key]
              // str += `
              //   <div class="alarm-panel ${'alarm-panel-'+key}">
              //     <div class="alarm-panel-title">${typeName[key]}</div>
              //     <div class="alarm-panel-count">${data[key]}</div>
              //   </div>
              // `
            }
          }
          let obj = this.scene.getObjectByName(name)
          if(total == 0){
            if(obj){
              this.scene.remove(obj)
            }
            return 
          }

          let name = 'buildingAlarmPanel_'+buildingName
          // let obj = this.scene.getObjectByName(name)
          if(!obj){
            let dom = document.createElement('div')
            dom.style.pointerEvents = 'none'
            // dom.classList.add('three-alarm-panel')
            obj = new CSS2DObject(dom)
            // console.log(buildingAlarmPanelPos[buildingName])
            if(!buildingAlarmPanelPos[buildingName]){
              return
            }
            const {x,y,z} = buildingAlarmPanelPos[buildingName]
            obj.position.set(x,y,z)
            this.scene.add(obj)
            buildingAlarmPanelObjects.push(obj)
          }
          let ele = obj.element
          let typeName = {
            "0":'严重告警',
            "1":"较重告警",
            "2":"一般告警"
          }
          let str = ''
          
          str = `
            <div class="alarm-panel2 " >
              <span>${total}</span>
            </div>
          `

          if(str){
            let domStr = `
              <div class="three-alarm-panels">
              ${str}
              </div>
            `
            ele.innerHTML = domStr
          }
          const that = this
          let panel = ele.querySelector('.alarm-panel2')
          // console.log('panel',ele,panel)
          if(panel){
            panel.addEventListener('click',function(){
              that.vue_this.showAllAlarms(buildingName)
            })
          }
          return 
          // const that = this
          let panel0 = ele.querySelector('.alarm-panel-0')
          if(panel0){
            panel0.addEventListener('click',function(){
              console.log('点击了严重告警')
              that.vue_this.showAllDevices()
            })
          }
          let panel1 = ele.querySelector('.alarm-panel-1')
          if(panel1){
            panel1.addEventListener('click',function(){
              console.log('点击了较重告警')
              that.vue_this.showAllDevices()

            })
          }
          let panel2 = ele.querySelector('.alarm-panel-2')
          if(panel2){
            panel2.addEventListener('click',function(){
              console.log('点击了一般告警')
              that.vue_this.showAllDevices()
            })
          }
        
        }

        removeAllBuildingAlarmPanels(){
          for(let i=0;i<buildingAlarmPanelObjects.length;i++){
            this.scene.remove(buildingAlarmPanelObjects[i])
          }
          buildingAlarmPanelObjects = []
        }

        

        addAllDevicesBuildingSceneControl(material,name='control'){
          let gui = new dat.GUI()
          let control = gui.addFolder(name)
          let params = {
            color:"#ffffff",
            transparent: true,
            opacity: 0.5,
            envMapIntensity: 1,//1
            // reflectivity: 1,
            roughness:0.7,   //0.5
            metalness:1.0,
            depthWrite:true,
            depthTest:false,
            forceSinglePass:false,
            side:'double'
          }
          control.addColor(params,'color').onChange((val)=>{
            console.log(val)
            material.color.set(val)
          })
          control.add(params,'opacity',0,1,0.1).onChange(val=>{
            material.opacity = val
          })
          // control.add(params,'envMapIntensity',0,1,0.1).onChange(val=>{
          //   material.envMapIntensity = val
          // })
          control.add(params,'roughness',0,1,0.1).onChange(val=>{
            material.roughness = val
          })
          control.add(params,'metalness',0,1,0.1).onChange(val=>{
            material.metalness = val
          })
          control.add(params,'depthWrite').onChange(val=>{
            material.depthWrite = val
          })
          control.add(params,'depthTest').onChange(val=>{
            material.depthTest = val
          })
          control.add(params,'transparent').onChange(val=>{
            material.transparent = val
          })
          control.add(params,'forceSinglePass').onChange(val=>{
            material.forceSinglePass = val
          })
          control.add(params,'side',['double','font','back']).onChange(val=>{
            switch (val) {
                case "front":
                material.side = THREE.FrontSide;
                    break;
                case "back":
                material.side = THREE.BackSide;
                    break;
                case "double":
                material.side = THREE.DoubleSide;
                    break;
            }
            material.needsUpdate = true;

          })
        }
        addLineMaterialControl(material,params,name='line'){
          let gui = new dat.GUI()
          let control = gui.addFolder(name)
          params = params||{
            color:"#58595a",
            opacity:1,
            transparent:true
          }
          control.addColor(params,'color').onChange((val)=>{
            console.log(val)
            material.color.set(val)
          })
          control.add(params,'transparent').onChange(val=>{
            material.transparent = val
          })
          control.add(params,'opacity',0,1,0.1).onChange(val=>{
            material.opacity = val
          })

        }
        
        addLiftPosControlGUI(lift){
          let control = gui.addFolder("Lift POS")
          let params = {
            x:0,
            y:0,
            z:0,
            scale:5700
          }
          control.add(params,'x',-500,500,1).onChange(function(val){
            lift.position.x = val
          })
          control.add(params,'y',-100,500,1).onChange(function(val){
            lift.position.y = val
          })
          control.add(params,'z',-500,500,1).onChange(function(val){
            lift.position.z = val
          })
          control.add(params,'scale',1,6000,1).onChange(function(val){
            lift.scale.set(val,val,val)
          })
        }

        addPositionControlGUI(object,params){
          let control = gui.addFolder("POS")
          params = params||{
            x:0,
            y:0,
            z:0,
            scale:5700
          }
          control.add(params,'x',-500,500,1).onChange(function(val){
            object.position.x = val
          })
          control.add(params,'y',-100,500,1).onChange(function(val){
            object.position.y = val
          })
          control.add(params,'z',-500,500,1).onChange(function(val){
            object.position.z = val
          })
        }

        addDirectionLightControlGUI(light,params){
          params = params || {
            intensity:1,
            x:1000,
            y:1000,
            z:1000,
          }
          const helper = new THREE.DirectionalLightHelper( light, 5 );
          this.scene.add( helper );
          console.log('DirectionalLightHelper',helper)

          let gui = new dat.GUI()
          let control = gui.addFolder("DirectionLight")

          control.add(params,'x',-5000,5000,1).onChange(function(val){
            light.position.x = val
            helper.update()
          })
          control.add(params,'y',-5000,5000,1).onChange(function(val){
            light.position.y = val
            helper.update()
          })
          control.add(params,'z',-5000,5000,1).onChange(function(val){
            light.position.z = val
            helper.update()
          })
          control.add(params,'intensity',0,1,0.1).onChange(function(val){
            light.intensity = val
            helper.update()
          })



        }


      }
    },

    // 添加报警点
    addAlarmPoints(data){

    },
    commonAlarmHandler(){},
     // 点击一般告警
    commonAlarmHandler(){
      this.$emit('commonAlarmHandler')
    },

    // getCamera() {
    //   console.log(this.camera);
    //   console.log(JSON.stringify(this.camera.position));
    //   console.log(JSON.stringify(this.controls.target));
    // },

    
    changeToNight() {
      if (window.scene3d) {
        this.SCENE_MODE = 'night'
        window["scene3d"].removeAllBuildingAlarmPanels()
        window["scene3d"].YjScene();
      }
    },
    changeToDay() {
      if (window.scene3d) {
        this.SCENE_MODE = 'day'
        window['scene3d'].alarmPanelsUpdate()
        window["scene3d"].YgScene2();
      }
    },
		buildingViewChange(name) {
      console.log("buildingViewChange",name)
      const that = this
      this.viewerSelect = ""
      if(CUR_MODE === "init"){
        if (window.scene3d ) {
          this.animating = true
          window['scene3d'].hideModel()
          // window['scene3d'].changeToBuildingLight()

          window["scene3d"].cameraFlyTo(BuildingView[name].camera, BuildingView[name].control, function(){
            window["scene3d"].showBuilding(name)
            that.animating = false
          })
        }
        this.viewerSelect = name;
        this.setFloorDataByBuildingName(name) // 获取楼栋楼层信息
      }else if(CUR_MODE === 'BuildingSelected'){
        this.viewerSelect = name;
       
        window['scene3d'].removeDevicePoints()
        window['scene3d'].removeDevicePop()

        window["scene3d"].changeBuilding(name)
        this.setFloorDataByBuildingName(name)
       
      }else if(CUR_MODE === 'AllDevices'){
        this.viewerSelect = name
        window['scene3d'].allDevicesSceneChangeToBuilding()
        
        this.buildingDevicesShow = true

        this.animating = true
        window["scene3d"].cameraFlyTo(BuildingView[name].camera, BuildingView[name].control, function(){
          window["scene3d"].showBuilding(name)
          that.animating = false
        })
        this.setFloorDataByBuildingName(name)
        // this.removeDevicePoints()
        // this.removeDevicePop()
        // this.removeAllAlarmCircles()
        // this.vue_this.currentBuildingFloor = 0

      }

			
		},
    // 根据楼幢名获取楼层信息
    async setFloorDataByBuildingName(name){
      console.log('选择的大楼',name,this.floorsData[name])
      if(!this.floorsData[name]){
        const houseId = this.houseData[name].houseId
        await this.getFloors(houseId).then(async res => {
          console.log("楼层数据",name,res)

          // TMD 临时用
          let floors = {"南楼":12,'裙楼':8,'北楼':22}
          res = res.slice(0,floors[name])
          // TMD 临时用 END

          this.floorsData[name] = res
          this.floorsData[name].reverse()
          this.currentFloorsData = this.floorsData[name]
          this.currentBuildingFloors = this.currentFloorsData.map(item => parseInt(item.floorNum))
        })
      }else{
        console.log("楼层数据",name,this.floorsData[name])
        this.currentFloorsData = this.floorsData[name]
        this.currentBuildingFloors = this.currentFloorsData.map(item => parseInt(item.floorNum))
      }
    },
    getFloors(houseId){
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
    
    async selectFloor(floor,bool = false) {
      const building = this.viewerSelect;
      console.log("选择了" + building + "第" + floor + "层");
      // this.alarmModal = true;
      this.hoverBuildingFloor = 0

      if(building == '地面'){
        window['scene3d'].selectDimianFloorModel(floor,bool)
        return
      }

      if(floor<=0){
        console.log(floor,"???????????/")
        window['scene3d'].selectUnderFloorModel(floor,bool)
      }else{
        await window["scene3d"].selectFloorModel(floor,bool)
      }
      // this.floorNumber = data
      // this.$refs.model.modalInit()
      // this.modalInit();
    },
    
    floorBackToBuilding(){
      // console.log('11111111')
      // // window["scene3d"].backToInit()
      // let pos = {
			// 	x: 743.5491222034896,
			// 	y: 703.867000202067,
			// 	z: 2088.157444882376
			// }
			// let target = {
			// 	x:  -25.779824898290673,
			// 	y: 152.34487355865735,
			// 	z: -70.38663440490355
			// }
      
      let name = BuildingSelected.buildingName
      this.buildingDevicesShow = false
      if(BuildingView[name]){
        // const {camera,control} = BuildingView[name]
        // window["scene3d"].cameraFlyTo(pos, target)
        if(CUR_MODE == 'FloorSelected'){
          // CUR_MODE = "BuildingSelected"
          this.currentBuildingFloor = 0
          window["scene3d"].floorToBuilding()
          this.getAllDevices()
         
          // this.drawBuildingDevices()

          // this.realTimeAlarmFunc(alarms,false)
        }
      }
      
  
      this.$emit('floorBackToBuilding')
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
        console.log("报警socket推送",data)
        this.alarmData = data

        // 告警分类 字典表 0-消防类 1-能耗类 2-安防类 3-环境类 4-7 5-设备设施 6-巡检 7-报修 8-咨询投诉 9-其他 20-入侵类
        this.updateAlarmPoints(data)
        this.groupAlarmsByBuildingName(data)
      }
    },
    // 关闭实时告警socket
    alarmWebSocketClose(){
      if(this.alarmSocket){
        this.alarmSocket.close()
      }
    },

    // 将告警点按楼栋名分配
    groupAlarmsByBuildingName(res){
      let obj = {}
      for(let i=0;i<res.length;i++) {
        const type = res[i].type
        const data = res[i].deviceList
        
        data.forEach(item => {
          // let buildingName = item.buildingName
          let buildingName = item.buildingName 
          if(!buildingName){
            return
          }
          if(!obj[buildingName]){
            obj[buildingName] = {
              '0':0,
              '1':0,
              '2':0
            }
          }
          obj[buildingName][type]+=1
        })

        Object.assign(buildingAlarmCountGroup,obj)
      }
      window['scene3d'].alarmPanelsUpdate()
    },

    // 刷新页面显示的报警点
    updateAlarmPoints(res){
      console.log("报警点位数据",res)
      //  报警点每次只会多一个或者少一个,无例外
      let alarmsArr = []
      let alarmIds = [] // 告警点id 数据

      // 当前页面已有报警id
      const alarmIdsExist = alarms.map(item => item.id)

      let alarmsAdd = [] // 
      
      // TMD 测试用临时点位
      let test_pos = [
      [2.495083094786047,2.3648858903561565,-32.65810296460433],
          [16.110204154436147,0.5230267544338477,-166.3807792333442],
          [131.412898866946,0.5230059620033396,-11.627799514521675]
      ]
      // let test_pos = {
      //   0:[[-510.3556572793226,240.743702610741,-387.70219710168186],
      //   [-505.39470618526695,100,-279.3919591759544],
      //   [-559.5703429242966,50.743702610741,-347.3784161980457],],
      //   1:[
      //   [-671.4498073064989,590.743702610741,-361.37277953419454],
      //   [-630.5064424403656,400,-400.80560593380585],
      //   ]
      // }
      

      for(let i=0;i<res.length;i++) {
        const type = res[i].type

        // 一般报警不需要展示报警点，
        if(type!='2'){
          const data = res[i].deviceList
          const arr = data.map((item,idx) => {
            alarmIds.push(item.alarmId)
            // TMD 先使用测试数据
            let position = [parseFloat(item.locX),parseFloat(item.locY),parseFloat(item.locZ)]
            position = test_pos[i%3]
            // 若是新增的告警点位
            if(!alarmIdsExist.includes(item.alarmId)){
              alarmsAdd.push({
                ...item,
                id:item.alarmId,
                position:position,
                type
              })
            }
            return {
              ...item,
              id:item.alarmId,
              position:position,
              type
            }

          })
          alarmsArr = alarmsArr.concat(arr)
        }
      }
      alarms = alarmsArr

      if(CUR_MODE !== 'Alarms'){
         // 新增
         console.log('新增告警点',alarmsAdd,alarmIds,alarmIdsExist)
      // console.log(alarmsAdd,alarmIds,alarmIdsExist)
        if(alarmIds.length>alarmIdsExist.length){
          for(let i=0;i<alarmsAdd.length;i++){
            let tempData = alarmsAdd[i]
            // 消防告警 和 越界告警
            if(tempData.sort == '20' || tempData.sort == '0'){
              console.log('消防告警和越界告警',tempData)
              this.alarmScreenData = tempData
              this.alarmScreenShow = true
            }

          }
          // this.playAlarmAudio()
        }
           
        return
      }

      // 新增
      // console.log(alarmsAdd,alarmIds,alarmIdsExist)
      if(alarmIds.length>alarmIdsExist.length){
        this.realTimeAlarmFunc(alarmsAdd)
        // this.playAlarmAudio()
      }else{
         // 减少
        // console.log(alarmIds,alarmIdsExist)
        for(let i=0;i<alarmIdsExist.length;i++){
          const id = alarmIdsExist[i]
          if(!alarmIds.includes(id)){
            // 移除 已经消除的告警点和其弹窗
            window['scene3d'].removeAlarmPointById(id)
            window['scene3d'].closeAlarmPopById(id)
          }
        }
      }


    },
    realTimeAlarmFunc(tempData,showPop=true){
      // tempData = tempData || []
      console.log('新增告警点',tempData)
      for(let i=0;i<tempData.length;i++){
        const {id,position,type} = tempData[i]
        if(position&&position.length){
          window['scene3d'].addAlarmPoint(tempData[i],type)
          if(showPop){
            window['scene3d'].addAlarmPop(position,id,tempData[i])
            setTimeout(()=>{
              window['scene3d'].closeAlarmPopById(id)
            },5*1000)
          }
       

        }

      }
      
    },
    dataInit(){
      this.getCanLossAssetList()
    },
    async getCanLossAssetList(){
      await getCanLossAssetList().then(async res => {
        console.log('资产',res)
        if(res.code=='200'&&res.data&&res.data.records){
          let records = res.data.records
          // for(let i = 0;i<records.length;i++){
            let parentId = records[0].id
            let params = {
              type:2,
              parentId
            }
            await this.getHouseList(params)
          // }
          
        }
      })
    },

    async getHouseList(params) {
      // ===============================
      await getHouseList(params).then(res => {
        console.log('楼幢',res)
        let buildingData = []

        // TMD 测试用 START =====================
        let tempArr = ['南楼','裙楼','北楼']
        if(res.code =='200'&&res.data.length){
          const data = res.data
          for(let i=0;i<3;i++){
            data[i].houseName = tempArr[i]

            this.houseData[data[i].houseName] = data[i]
            buildingData.push(data[i])
          }
          this.buildingData =[...this.buildingData,...buildingData]

        }
        return
        // TMD 测试用 END =====================
        
        if(res.code =='200'&&res.data.length){
          const data = res.data
          for(let i = 0;i<data.length;i++){
            data[i].houseName = data[i].houseName.toLowerCase() //TMD 前端将 名字小写 

            data[i]._type = data[i].houseName
            this.houseData[data[i].houseName] = data[i]
            buildingData.push(data[i])
          }
          this.buildingData =[...this.buildingData,...buildingData]
        }


       
      })
    },

    async getDevicesInfo(buildingId,floorId){

      // // TMD 假数据
      // const tempMap = {
      //   '南楼':{
      //     1:{
      //       deviceList:[
      //         {deviceTypeOneName:'监控点',deviceTypeTwoName:'监控点',locX:10.21058564987797,locY:69.00001119067686,locZ:-25.76819614964259,buildingName:'南楼',deviceName:"监控点1"}
      //       ],
      //       typeList:[
      //         {deviceTypeOneName:'监控点'},
      //       ]
      //     }
      //   }
      // }

      // return
      
      await getDevicesInfo({buildingId,floorId}).then(res => {
        if(res.code == '200' && res.data){
          const deviceTypeList = res.data.typeList?res.data.typeList:[];
          const deviceList = res.data.deviceList?res.data.deviceList:[]
          console.log('设备',res)

          this.deviceTypeList = deviceTypeList
          this.deviceList = deviceList

        }
      })
    },

    async getAllDevices(){
  

      if(!this.allDeviceData.length){
        await this.getAllDeviceData() 
      }

      let allDeviceData = this.allDeviceData
      console.log('所有设备',allDeviceData)
      
     
    // TMD假数据，临时演示使用
      // const deviceMap = {
      //   '高清红外枪型摄像机':"视频监控",
      //   '室内CO2传感器':"环境监测类",
      //   "室内PM2.5传感器":"环境监测类",
      //   "室内温湿度传感器":"能量计量设备",
      //   "能量计量数据采集箱":"能量计量设备",
      //   "高清全景摄像机":"视频监控",
      //   "高清数字人脸抓拍半球摄像机":"视频监控",
      //   "高清数字人脸抓拍摄像机":"视频监控",
      //   "高清数字电梯摄像机":"视频监控",
      //   "高清数字越界报警摄像机":"视频监控",
      //   "高清数字防油烟摄像机":"视频监控",
      //   "高清红外半球摄像机":"视频监控",
      // }
      // let nameMap = ModelNameMap2
      // const deviceList = AllDevicesDataTemp.map(item => {
      //   return {
      //     id:item.id,
      //     position:[parseFloat(item.loc_x),parseFloat(item.loc_y),parseFloat(item.loc_z)],
      //     deviceName:item.type,
      //     deviceTypeOneName:deviceMap[item.type]?deviceMap[item.type]:'其他设备类',
      //     status:"0",
      //     buildingName:nameMap[item.code.slice(0,3)]
      //   }
      // })
      // console.log("所有设备DeviceList",deviceList)
      // let typeList = [
      //   {deviceTypeOneName:"环境监测类"},
      //   {deviceTypeOneName:"能量计量设备"},
      //   {deviceTypeOneName:"视频监控"},
      //   {deviceTypeOneName:"其他设备类"},
      // ]
      this.deviceTypeList = allDeviceData.typeList
      let arr  = allDeviceData.deviceList.filter(item => {
        return item.locX&&item.locY&&item.locZ
      })
      arr.forEach(item => {
        item.position = [parseFloat(item.locX),parseFloat(item.locY),parseFloat(item.locZ),]
      })
      this.deviceList = arr

      // this.deviceTypeList = typeList
      // this.deviceList = deviceList
      
    },

    drawDevicesPoints(value){

      // let height = {20:542.0649772279536,19:525.6761610662487}
      // let y = height[this.currentBuildingFloor]
      // if(!y){
      //   return
      // }
      let buildingName = this.viewerSelect
      const arr = {
        '南楼':[
          [2.495083094786047,2.3648858903561565,-32.65810296460433],
          [16.110204154436147,0.5230267544338477,-166.3807792333442],
          [131.412898866946,0.5230059620033396,-11.627799514521675]
        ]
      }
      let temp = arr[buildingName]
      if(!temp){
        return 
      }

      console.log("设备点数据",value)
      window['scene3d'].removeDevicePoints()
      window['scene3d'].removeAllAlarmCircles()
      window['scene3d'].removeDevicePop()

      for(let i=0;i<value.length;i++){
        if(i<3){
          const data = value[i]
          // TMD 临时假数据
          data.locX = temp[i][0]
          data.locY = temp[i][1]
          data.locZ = temp[i][2]
          //========
          if(data.locX&&data.locY&&data.locZ){
            data.position = [parseFloat(data.locX),parseFloat(data.locY),parseFloat(data.locZ)]
            window['scene3d'].drawDevicePointWithoutLabel(data)
          }
          // data.position = arr[i]
          // window['scene3d'].drawDevicePointWithoutLabel(data)
        }

      }
    },

    drawDevicesPoints2(value){
      console.log('对应设备类型的设备数据：',value)    
      window['scene3d'].removeDevicePoints()
      window['scene3d'].removeAllAlarmCircles()
      window['scene3d'].removeDevicePop()
      // if(CUR_MODE == 'BuildingSelected'){
      //   value = this.filterDevicesByBuildingName(value,this.viewerSelect)
      // }
      let temp = [
        [2.495083094786047,2.3648858903561565,-32.65810296460433],
        [0.18210371582970672,2.3648858903561565,0.26879313096884033],
        [7.739890962867153,2.3648858903561565,-9.23098106141229],
      ]
      for(let i=0;i<value.length;i++){
        // TMD 临时假数据
        if(i<3){
          let  data = value[i]
          data.locX = temp[i][0]
          data.locY = temp[i][1]
          data.locZ = temp[i][2]
          data.position = temp[i]
          // window['scene3d'].drawDevicePoint(data)
        
          window['scene3d'].drawDevicePointWithoutLabel2(data,true)

        }
     
      }
    },

    // 根据资产名称 过滤出 设备
    filterDevicesByBuildingName(data,name){
      let devices = data.filter(item => {
        return item.buildingName == name
      })
      return devices
    },

    // 消警/生成工单
    alarmHandler(gdDom,xjDom){
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
          // this.removeAlarmPoint(alarmId)
          window['scene3d'].removeAlarmPointById(alarmId)
        }else if(flag===1&&res.code=='200'){
          // 生成工单成功
          if(gdDom){
            gdDom.style.display = 'none'
            xjDom.style.display = 'none'
            for(let i=0;i<this.alarms.length;i++){
              if(alarms[i].id === id){
                console.log('生成工单的告警',this.alarms[i])
                alarms[i].workOrder = 'Y'
                this.alarmHandlerData.workOrder = 'Y'
                break
              }
            }
          }
        }
      })
    },
    //========= 临时,绘制大楼视角时的设备 ===========
    async drawBuildingDevices(){
      const buildingId = "5163c1fb-e14e-4d49-b8dc-523c76baa97c"
      const floorId = "565e09d7-d74f-11ec-8084-0242ac110121"

      await this.getDevicesInfo(buildingId,floorId)
      const value = this.deviceList
      // console.log("!@@#$%^&*",value)
      this.drawBuildingDevicePoints(value)
    },
    drawBuildingDevicePoints(value){
      let height = {20:590.743702610741,19:525.6761610662487}
      let y = height['20']
      

      const arr = [
        [-671.4498073064989,y,-361.37277953419454],
        [-630.5064424403656,y,-400.80560593380585],
        [-510.3556572793226,y,-387.70219710168186],
        [-505.39470618526695,y,-279.3919591759544],
        [-559.5703429242966,y,-347.3784161980457],
      ]
      console.log("设备点数据",value)
      window['scene3d'].removeDevicePoints()
      window['scene3d'].removeAllAlarmCircles()
      window['scene3d'].removeDevicePop()
      for(let i=0;i<value.length;i++){
        if(i<5){
          const data = value[i]
          data.position = arr[i]
          window['scene3d'].drawDevicePointWithoutLabel(data)
        }

      }
    },
    //==========================临时 ============

    showGuanXian(ev){
      ev.preventDefault()
      ev.stopPropagation()
      window['scene3d'].showGuanXian_temp()
    },
    
    async showAllDevices(){
      if(this.allDevicesShow){
        this.allDevicesShow = false
        window['scene3d'].hideAllDevicesScene()
      }else{
        this.allDevicesShow = true
        if(this.allAlarmsShow){
          window['scene3d'].alarmsSceneToDevicesScene()
          this.allAlarmsShow = false
          return 
        }
        if(this.liftShow){
          window['scene3d'].liftSceneToDevicesScene()
          this.liftShow = false
          return 
        }
        await window['scene3d'].showAllDevicesScene()
      }
    },

    showAllAlarms(buildingName) {
      if(this.allAlarmsShow){
        this.allAlarmsShow = false
        window['scene3d'].hideAllAlarmsScene()
      }else{
        this.allAlarmsShow = true
        if(this.allDevicesShow){
          window['scene3d'].devicesSceneToAlarmsScene()
          this.allDevicesShow = false
          return 
        }
        if(this.liftShow){
          window['scene3d'].liftSceneToAlarmsScene()
          this.liftShow = false
          return
        }
        window['scene3d'].showAlarmsScene()
      }
    },

    async getAllDeviceData(){
      await getAllDeviceInfoReq().then(res => {
        if(res&&res.code == '200'){
          this.allDeviceData = res.data?res.data:[]
        }
      })
    },

    liftShowToggle(){
      if(this.liftShow){
        this.liftShow = false
        window['scene3d'].hideLiftScene()
        // this.mapBackToInit()
      }else {
        this.liftShow = true
        if(this.allAlarmsShow){
          window['scene3d'].alarmsSceneToLiftScene()
          this.allAlarmsShow = false
          return 
        }
        if(this.allDevicesShow){
          window['scene3d'].devicesSceneToLiftScene()
          this.allDevicesShow = false
          return 
        }
        window['scene3d'].showLiftScene()
      }
    },

    buildingBackToAllDevices(){
      this.buildingBackToDevicesShow = false
      window['scene3d'].buildingBackToAllDevicesScene()
    },

    getViedoRealTimeUrlAndPlay(cameraPlayParams, myPlugin){
      getViedoRealTimeUrl(cameraPlayParams).then(res => {
        let url = res.data.url
        this.monitorSelectedUrl = url
        myPlugin.JS_Play(url,{playURL:url,mode:0},0).then(res => {
          console.log(res,"播放成功")
        }).catch(err => {
          console.log(err, '播放失败')
        })
      })
    },

    monitorReplay(deviceId){
      this.monitorSelectedId = deviceId
      this.monitorHistoryModalShow = true
    },
    monitorHistoryModalClose(){
      console.log("CLOSE")
      this.monitorHistoryModalShow = false
    },
    // 根据设备类型 返回对应细节内容
    async getDeviceDetailByTypeAndId(data){
      let valueData = []
      if(data.deviceTypeOneName == "智能照明"){

        return await getLightList({
          deviceType: "2c5d4832fe7b598ef211f2ef73131871",
          buildingId: data.buildingId,
          floorName: data.floorName
        }).then( async res => {
          if(!res.success){
            return []
          }
          if (!res.data.records || res.data.records.length == 0) {
            return []
          }
          let arr = [{attrCn:'场景',value:'获取状态异常'}]
          for(let i = 0;i<res.data.records.length;i++){
            let el = res.data.records[i]
            let params = {
              appId:'baeb4bf45f774c24b167ke136e515545',
              deviceId:el.deviceCode
            }
            let status = await getItemValue(params).then(value => {
              return value.data?true:false
            }).catch(()=>{
              return false
            })
            if(status){
              arr = [{attrCn:'场景',value:el.deviceName}]
              break
            }
          }
          return arr
        }).catch(err => {
          return [{attrCn:'场景',value:'获取状态异常'}]
        })

        return await getItemValue({
          appId:'baeb4bf45f774c24b167ke136e515545',
          deviceId:data.deviceCode
        }).then(res => {
          console.log('照明设备状态',res)
          if(res&&res.code == '200'){
            let status = res.data?'在线':"离线"
            return [{attrCn:"控制箱状态",value:status}]
          }else{
            return []
          }
        }).catch(err=>{
          return []
        })
      }else if(data.deviceTypeOneName == '背景音乐'){
         // BGM播放设备
        return await getTask({
          appId:'baeb4bf45f774c24b167ke136e515545',
          supplierFlag: 'ITCMUSIC'
        }).then(res => {
          console.log('bgm设备状态',res)
          let status = ''
          if (!res.data.data.TaskInfoArray || res.data.data.TaskInfoArray.length == 0) {
              status = '暂未播放';
              return [{attrCn:"播放状态",value:status}];;
          }
          let chooseAudio = 'lid6592113c2fdc302c7afeba48bb9as'
          let tmp = res.data.data.TaskInfoArray.filter(p => p.TaskID === '{' + chooseAudio + '}');
          if (!tmp || tmp.length == 0) { 
            status = '暂未播放';
            return [{attrCn:"播放状态",value:status}];
          }
          let taskInfo = tmp[0];
          let chooseSource = taskInfo.TaskType;
          if (taskInfo.TaskType == 10 || taskInfo.TaskType == '10') {
              status = '音乐播放中';
              let playMusicName = taskInfo.TaskShowInfo;
          } else if (taskInfo.TaskType == 11 || taskInfo.TaskType == '11') { 
              status = '文本播放中';
          }
          return [{attrCn:"播放状态",value:status}]
        })
      } else if(data.deviceTypeOneName == 'BA'){
        return await getBADeviceInfoReq({deviceId:data.id}).then(res => {
          console.log('BA数据',res)
          if(res&&res.data&&res.data.valueData){
            return res.data.valueData
          }
          return []
        }).catch(() => {
          return []
        })
        // if(data.deviceTypeTwoName == 'CO2传感器'){
        //   return [{attrCn:"二氧化碳",value:613,unit:'ug/㎡'}]
        // }else if(data.deviceTypeTwoName == "湿度传感器"){
        //   return [{attrCn:"湿度",value:72,unit:'%'}]
        // }else if(data.deviceTypeTwoName == "温度传感器"){
        //   return [{attrCn:"温度",value:26,unit:'°C'}]
        // }else {
        //   return [{attrCn:"温度",value:26,unit:'°C'}]
        // }
      } else if(data.deviceTypeOneName == '能量计量'){
        if(data.deviceTypeTwoName == "电表配电箱"){
          return await getDeviceDetailByParentIdReq({deviceId:data.id}).then(res => {
            console.log('配电箱数据',res)
            if(res.data&&res.data.length){
              return res.data.map(item => {
                return {attrCn:item.deviceName,value:item.valueData[0].value,unit:item.valueData[0].unit}
              })
            }else{
              return []
            }
          }).catch(()=>{
            return []
          })
        }
      } else if(data.deviceTypeOneName == '门禁') {
        return await getPersonAccessInfoReq({deviceId:data.id}).then(res => {
          console.log('门禁',res)
          if(res&&res.code=='200'){
            let items = res.data.valueData
            items = items&&items.length?items:[]
            return items
            return items.map(item => {
              return {
                attrCn:item.attrCn,
                value:item.peopleName + ' ' +moment(item.inTime).format('YYYY-MM-DD HH:mm:ss'),
              }
            })
          }else{
            return []
          }
        }).catch(() => {
          return []
        })
      } else if(data.deviceTypeOneName == "停车管理"){
        return getVehicleInfoReq({deviceId:data.id}).then(res => {
          console.log('停车管理',res)
          if(res&&res.data&&res.data.valueData){
            let items = res.data.valueData
            items = items&&items.length?items:[]
            return items
            return res.data.valueData.map(item => {
              return {
                attrCn:item.attrCn,
                value:item.plateNo + ' ' + moment(item.entryTime).format('YYYY-MM-DD hh:mm:ss') 
              }
            })
          }else{
            return []
          }
        }).catch(()=>{
          return []
        })
      }
      

      return []
      

     
    },
    getDomStrByDeviceType(id,data,valueData,detail){
      let labelInfos = ''
      let posStr = detail.deviceAddr?` <div>
          <span class="sx-device-label">设备位置:</span>
          <span class="sx-device-content">${detail.deviceAddr}</span>
        </div>`:``
      let str = `
          <div>
            <span class="sx-device-label">设备状态:</span>
            <span class="sx-device-content">${detail.status}</span>
          </div>
      `
      
      if(data.deviceTypeOneName == 'BA'){
        str = ``
        const getLabelByValue = function(value,remark){
          let obj = remark.find(item => {
            return item.key == value
          })
          return obj.value?obj.value:''
        }
        if(data.deviceTypeTwoName == "全热交换器"){
          // let lw_status_map = {'0':'关','1':'开'}
          let lw_color_map = {'0':'yellow','1':'green','-1':'red'}

          let xflw = '离线' // 新风滤网
          let xflw_text_color = 'red'
          let pflw = '离线' // 排风滤网
          let pflw_text_color = 'red'
          let ff = '离线' // 风阀
          let ff_text_color = 'red'
          let pfj_yxzt = '离线' // 排风机运行状态
          let pfj_gzbj = '离线' // 排风机故障报警
          let pfj_yc = '离线' // 排风机压差
          let pfj_qt = '离线' // 排风机 启停控制
          let pfj_zd = '' // 排风机 自动

          let sfj_yxzt = '离线' // 送风机运行状态
          let sfj_gzbj = '离线' // 送风机故障报警
          let sfj_yc = '离线' // 送风机压差
          let sfj_qt = '离线' // 送风机 启停控制
          let sfj_zd = '' // 送风机 自动

          let pfj_yxzt_value = ''
          let sfj_yxzt_value = ''
          for(let i=0;i<valueData.length;i++){
            let item = valueData[i]
            switch(item.attrCn){
              case '新风滤网':
                xflw = item.value?getLabelByValue(item.value,item.remark):xflw
                xflw_text_color = item.value?lw_color_map[item.value]:xflw_text_color
                break;
              case "排风滤网":
                pflw = item.value?getLabelByValue(item.value,item.remark):pflw
                pflw_text_color = item.value?lw_color_map[item.value]:pflw_text_color
                break;
              case "风阀":
                ff = item.value?getLabelByValue(item.value,item.remark):ff
                ff_text_color = item.value?lw_color_map[item.value]:ff_text_color
                break;
              case "排风机运行状态":
                pfj_yxzt_value = item.value
                pfj_yxzt = item.value?getLabelByValue(item.value,item.remark):pfj_yxzt
                break;
              case "排风机故障状态":
                pfj_gzbj = item.value?getLabelByValue(item.value,item.remark):pfj_gzbj
                break;
              case "排风压差":
                pfj_yc = item.value?getLabelByValue(item.value,item.remark):pfj_yc
                break;
              case "排风机启停":
                pfj_qt = item.value?getLabelByValue(item.value,item.remark):pfj_qt
                break;
              case "排风机自动状态":
                pfj_zd = item.value?getLabelByValue(item.value,item.remark):pfj_zd
                break;
              case "送风机运行状态":
                sfj_yxzt_value = item.value
                sfj_yxzt = item.value?getLabelByValue(item.value,item.remark):sfj_yxzt
                break;
              case "送风机故障状态":
                sfj_gzbj = item.value?getLabelByValue(item.value,item.remark):sfj_gzbj
                break;
              case "送风压差":
                sfj_yc = item.value?getLabelByValue(item.value,item.remark):sfj_yc
                break;
              case "送风机启停":
                sfj_qt = item.value?getLabelByValue(item.value,item.remark):sfj_qt
                break;
              case "送风机自动状态":
                // sfj_zd = item.value?getLabelByValue(item.value,item.remark):sfj_zd
                sfj_zd = item.value
                break;
              
            }
          }

          let className = ''
          let left_status =0 // 0 离线 
          let right_status = 0
          if(pfj_yxzt_value  && pfj_yxzt_value != '-1' ){
            left_status = 1
          }
          if(sfj_yxzt_value  && sfj_yxzt_value != '-1' ){
            right_status = 1
          }
          if(!left_status&&!right_status){
            className = 'ql'
          }else if(left_status&&!right_status){
            className = 'zd'
          }else if(!left_status&&right_status){
            className = 'yd'
          }


          labelInfos = `
            <div class="video-content qrjhj ${className}">
              <div class="status-text xflw" style="color:${xflw_text_color}">${xflw}</div>
              <div class="status-text pflw" style="color:${pflw_text_color}">${pflw}</div>
              <div class="status-text ff" style="color:${ff_text_color}">${ff}</div>
              <div class="status-box pfj">
                <div>排风机</div>
                <div><span>运行状态：</span><span class="value">${pfj_yxzt}</span></div>
                <div><span>故障报警：</span><span class="value">${pfj_gzbj}</span></div>
                <div><span>风机压差：</span><span class="value">${pfj_yc}</span></div>
                <div><span>启停控制：</span><span class="value">${pfj_zd?pfj_zd:pfj_qt}</span></div>
              </div>
              <div class="status-box sfj">
                <div>送风机</div>
                <div><span>运行状态：</span><span class="value">${sfj_yxzt}</span></div>
                <div><span>故障报警：</span><span class="value">${sfj_gzbj}</span></div>
                <div><span>风机压差：</span><span class="value">${sfj_yc}</span></div>
                <div><span>启停控制：</span><span class="value">${sfj_zd=='1'?'自动':sfj_qt}</span></div>
              </div>
              <div class="label-text xf">新风</div>
              <div class="label-text pf">排风</div>
              <div class="label-text hf">回风</div>
              <div class="label-text sf">送风</div>
            </div>
          `
        }else if(data.deviceTypeTwoName == '集水井'){
          let yw = '离线'
          for(let i=0;i<valueData.length;i++){
            let item = valueData[i]
            if(item.attrCn == "集水坑液位"){
              yw = item.value?getLabelByValue(item.value,item.remark):yw
            }

          }

          labelInfos = `
            <div class="video-content jsj">
              <div class="status-text">
                <span>${yw}</span>
              </div>
            </div>
          `
        }else if(data.deviceTypeTwoName == '双泵集水井'){
          let yw = '离线'
          let yxzt1 = '离线'
          let gzzt1 = '离线'
          let yxzt2 = '离线'
          let gzzt2 = '离线'
          for(let i=0;i<valueData.length;i++){
            let item = valueData[i]

            switch(item.attrCn){
              case "双泵集水坑液位":
                yw = item.value?getLabelByValue(item.value,item.remark):yw 
                break;
              case "双泵集水坑运行状态1":
                yxzt1 = item.value?getLabelByValue(item.value,item.remark):yxzt1 
                break;
              case "双泵集水坑运行状态2":
                yxzt2 = item.value?getLabelByValue(item.value,item.remark):yxzt2
                break;
              case "双泵集水坑故障状态1":
                gzzt1 = item.value?getLabelByValue(item.value,item.remark):gzzt1 
                break;
              case "双泵集水坑故障状态2":
                gzzt2 = item.value?getLabelByValue(item.value,item.remark):gzzt2
                break;
            }
          }

          labelInfos = `
            <div class="video-content jsj">
              <div class="status-box left">
                <div>潜污泵1</div>
                <div><span>运行状态：</span><span class="value">${yxzt1}</span></div>
                <div><span>故障状态：</span><span class="value">${gzzt1}</span></div>
              </div>
              <div class="status-box right">
                <div>潜污泵2</div>
                <div><span>运行状态：</span><span class="value">${yxzt2}</span></div>
                <div><span>故障状态：</span><span class="value">${gzzt2}</span></div>
              </div>
              <div class="sbjsj-yw-text">${yw}</div>
            </div>
          `
          
        }else if(data.deviceTypeTwoName == '隔油池'){
          let yw_yxzt = '离线' //液位运行状态
          let yw_gzzt = '离线' //故障状态
          let yw_kgzt1 = '离线' // 开关状态1
          let yw_kgzt2 = '离线' // 开关状态2
          let yl_dx = '离线' // 压力传感器断线
          let yl_dl = '离线' // "隔油池压力传感器短路"
          let qy_dx = '离线' // 气压传感器断线
          let qy_dl = '离线' // "隔油池气压传感器短路"
          for(let i=0;i<valueData.length;i++){
            let item = valueData[i]
            switch(item.attrCn){
              case "隔油池液位运行状态":
                yw_yxzt = item.value?getLabelByValue(item.value,item.remark):yw_yxzt
                break;
              case "隔油池液位故障状态":
                yw_gzzt = item.value?getLabelByValue(item.value,item.remark):yw_gzzt
                break;
              case "隔油池溢水液位开关状态1":
                yw_kgzt1 = item.value?getLabelByValue(item.value,item.remark):yw_kgzt1
                break;
              case "隔油池溢水液位开关状态2":
                yw_kgzt2 = item.value?getLabelByValue(item.value,item.remark):yw_kgzt2
                break;
              case "隔油池压力传感器断线":
                yl_dx = item.value?getLabelByValue(item.value,item.remark):yl_dx
                break; 
              case "隔油池压力传感器短路":
                yl_dl = item.value?getLabelByValue(item.value,item.remark):yl_dl
                break; 
              case "隔油池气压传感器断线":
                qy_dx = item.value?getLabelByValue(item.value,item.remark):qy_dx
                  break; 
                case "隔油池气压传感器短路":
                qy_dl = item.value?getLabelByValue(item.value,item.remark):qy_dl
                break; 
              
            }

          }
          labelInfos = `
            <div class="video-content gyc">
              <div class="status-box left">
                <div><span>液位运行状态：</span><span class="value">${yw_yxzt}</span></div>
                <div><span>液位故障状态：</span><span class="value">${yw_gzzt}</span></div>
                <div><span>溢水液位开关状态1：</span><span class="value">${yw_kgzt1}</span></div>
                <div><span>溢水液位开关状态2：</span><span class="value">${yw_kgzt2}</span></div>
              </div>
              <div class="status-box right">
                <div><span>压力传感器断线：</span><span class="value">${yl_dx}</span></div>
                <div><span>压力传感器短路：</span><span class="value">${yl_dl}</span></div>
                <div><span>气压传感器断线：</span><span class="value">${qy_dx}</span></div>
                <div><span>气压传感器短路：</span><span class="value">${qy_dl}</span></div>
              </div>
            </div>
          `
        
        }else if(data.deviceTypeTwoName == '生活水泵'){
          let yxzt1 = '离线'
          let gzzt1 = '离线'
          let yxzt2 = '离线'
          let gzzt2 = '离线'
          let yxzt3 = '离线'
          let gzzt3 = '离线'
          let yxzt4 = '离线'
          let gzzt4 = '离线'
          let yxzt5 = '离线'
          let gzzt5 = '离线'
          let yxzt6 = '离线'
          let gzzt6 = '离线'
          let yxzt7 = '离线'
          let gzzt7 = '离线'
          let yxzt8 = '离线'
          let gzzt8 = '离线'
          let yxzt9 = '离线'
          let gzzt9 = '离线'
          let yw = '离线'

          for(let i=0;i<valueData.length;i++){
            let item = valueData[i]
            switch(item.attrCn){
              case "生活水泵1运行状态":
                yxzt1 = item.value?getLabelByValue(item.value,item.remark):yxzt1
                break;
              case "生活水泵1故障状态":
                gzzt1 = item.value?getLabelByValue(item.value,item.remark):gzzt1
                break;
              case "生活水泵2运行状态":
                yxzt2 = item.value?getLabelByValue(item.value,item.remark):yxzt2
                break;
              case "生活水泵2故障状态":
                gzzt2 = item.value?getLabelByValue(item.value,item.remark):gzzt2
                break;
              case "生活水泵3运行状态":
                yxzt3 = item.value?getLabelByValue(item.value,item.remark):yxzt3
                break;
              case "生活水泵3故障状态":
                gzzt3 = item.value?getLabelByValue(item.value,item.remark):gzzt3
                break;
              case "生活水泵4运行状态":
                yxzt4 = item.value?getLabelByValue(item.value,item.remark):yxzt4
                break;
              case "生活水泵4故障状态":
                gzzt4 = item.value?getLabelByValue(item.value,item.remark):gzzt4
                break;
                case "生活水泵5运行状态":
                yxzt5 = item.value?getLabelByValue(item.value,item.remark):yxzt5
                break;
              case "生活水泵5故障状态":
                gzzt5 = item.value?getLabelByValue(item.value,item.remark):gzzt5
                break;
              case "生活水泵6运行状态":
                yxzt6 = item.value?getLabelByValue(item.value,item.remark):yxzt6
                break;
              case "生活水泵6故障状态":
                gzzt6 = item.value?getLabelByValue(item.value,item.remark):gzzt6
                break;
              case "生活水泵7运行状态":
                yxzt7 = item.value?getLabelByValue(item.value,item.remark):yxzt7
                break;
              case "生活水泵7故障状态":
                gzzt7 = item.value?getLabelByValue(item.value,item.remark):gzzt7
                break;
              case "生活水泵8运行状态":
                yxzt8 = item.value?getLabelByValue(item.value,item.remark):yxzt8
                break;
              case "生活水泵8故障状态":
                gzzt8 = item.value?getLabelByValue(item.value,item.remark):gzzt8
                break;
              case "生活水泵9运行状态":
                yxzt9 = item.value?getLabelByValue(item.value,item.remark):yxzt9
                break;
              case "生活水泵9故障状态":
                gzzt9 = item.value?getLabelByValue(item.value,item.remark):gzzt9
                break;
              case "生活水池液位":
                yw = item.value?getLabelByValue(item.value,item.remark):yw
                break;
            }
          }
          let img = require('../../asserts/images/BA/sb.png')
          labelInfos = `
            <div class="video-content sb">
              <div class="flex-row">
                <div class="status-box">
                  <div>生活水泵1</div>
                  <div><span>运行状态：</span><span class="value">${yxzt1}</span></div>
                  <div><span>故障状态：</span><span class="value" >${gzzt1}</span></div>
                  <img  style="width:48px" src="${img}">
                </div>
                <div class="status-box">
                  <div>生活水泵2</div>
                  <div><span>运行状态：</span><span class="value">${yxzt2}</span></div>
                  <div><span>故障状态：</span><span class="value">${gzzt2}</span></div>
                  <img style="width:48px" src="${img}">
                </div>
                <div class="status-box">
                  <div>生活水泵3</div>
                  <div><span>运行状态：</span><span class="value">${yxzt3}</span></div>
                  <div><span>故障状态：</span><span class="value">${gzzt3}</span></div>
                  <img style="width:48px" src="${img}">
                </div>
              </div>
              <div class="flex-row">
                <div class="status-box">
                  <div>生活水泵4</div>
                  <div><span>运行状态：</span><span class="value">${yxzt4}</span></div>
                  <div><span>故障状态：</span><span class="value">${gzzt4}</span></div>
                  <img  style="width:48px" src="${img}">
                </div>
                <div class="status-box">
                  <div>生活水泵5</div>
                  <div><span>运行状态：</span><span class="value">${yxzt5}</span></div>
                  <div><span>故障状态：</span><span class="value">${gzzt5}</span></div>
                  <img style="width:48px" src="${img}">
                </div>
                <div class="status-box">
                  <div>生活水泵6</div>
                  <div><span>运行状态：</span><span class="value">${yxzt6}</span></div>
                  <div><span>故障状态：</span><span class="value">${gzzt6}</span></div>
                  <img style="width:48px" src="${img}">
                </div>
              </div>
              <div class="flex-row">
                <div class="status-box">
                  <div>生活水泵7</div>
                  <div><span>运行状态：</span><span class="value">${yxzt7}</span></div>
                  <div><span>故障状态：</span><span class="value">${gzzt7}</span></div>
                  <img  style="width:48px" src="${img}">
                </div>
                <div class="status-box">
                  <div>生活水泵8</div>
                  <div><span>运行状态：</span><span class="value">${yxzt8}</span></div>
                  <div><span>故障状态：</span><span class="value">${gzzt8}</span></div>
                  <img style="width:48px" src="${img}">
                </div>
                <div class="status-box">
                  <div>生活水泵9</div>
                  <div><span>运行状态：</span><span class="value">${yxzt9}</span></div>
                  <div><span>故障状态：</span><span class="value">${gzzt9}</span></div>
                  <img style="width:48px" src="${img}">
                </div>
              </div>
              <div class="flex-row">
                <div class="status-box">
                  <div>生活水箱液位</div>
                  <div><span class="value">${yw}</span></div>
                </div>
               
              </div>
              
            </div>
          `
      
        }else if(data.deviceTypeTwoName == '风机'){
          let yxzt = '离线'
          let gzbj = '离线'
          let qt = '离线'
          let zd = ''
          let className = 'jt'
          for(let i=0;i<valueData.length;i++){
            let item = valueData[i]
            switch(item.attrCn){
              case "风机运行状态":
                console.log(item,'!!!')
                className = ((!item.value)||item.value=='-1')?'jt':''
                yxzt = item.value?getLabelByValue(item.value,item.remark):yxzt
                break;
              case "风机故障状态":
                gzbj = item.value?getLabelByValue(item.value,item.remark):gzbj

                break;
              case "风机启停":
                qt = item.value?getLabelByValue(item.value,item.remark):qt

                break;
              case "风机自动状态":
                // zd = item.value?getLabelByValue(item.value,item.remark):zd
                zd = item.value
                break;
            }
          }

          labelInfos = `
            <div class="video-content fj ${className}">
              <div class="status-box">
                <div><span>运行状态：</span><span class="value">${yxzt}</span></div>
                <div><span>故障报警：</span><span class="value">${gzbj}</span></div>
                <div><span>启停控制：</span><span class="value">${zd=='1'?'自动':qt}</span></div>
              </div>
            </div>
          `

        }
        
      }else if(data.deviceTypeOneName == '停车管理'){
        for(let i = 0;i<valueData.length;i++){
          labelInfos += `
          <div style="display:flex;align-items:center;color:#fff;">
            <span style="flex:1;">${valueData[i].attrCn}</span>
            <span style="flex:2;">${valueData[i].plateNo}</span>
            <span style="flex:2;">${valueData[i].carType=='0'?'月租车':'临时车'}</span>
            <span style="flex:3;">${moment(valueData[i].entryTime).format('YYYY-MM-DD HH:mm:ss') }</span>
          </div>`
        }
      }else if(data.deviceTypeOneName == '门禁'){
        for(let i = 0;i<valueData.length;i++){
          labelInfos += `
          <div style="display:flex;align-items:center;color:#fff;">
            <span style="flex:1;">${valueData[i].attrCn}</span>
            <span style="flex:2;">${valueData[i].peopleName}</span>
            <span style="flex:3;">${moment(valueData[i].inTime).format('YYYY-MM-DD HH:mm:ss') }</span>
          </div>`
        }
      }else{
        for(let i = 0;i<valueData.length;i++){
          labelInfos += `
            <div style="display:flex;align-items:center">
              <span class="sx-device-label">${valueData[i].attrCn+':'}</span>
              <span class="sx-device-content">${valueData[i].value + (valueData[i].unit?valueData[i].unit:'')}</span>
            </div>
          `
        }
      
      }
     
      return `
         ${str}
         ${posStr}
         ${labelInfos}
       `

      
    },
    getDevicePopWidthByDeviceType(data){
      if(data.deviceTypeOneName == 'BA'){
        return 480
      }
      return 380

    },
    

  },
  created(){
    this.dataInit()
  },
  mounted() {
    this.init();
    // this.alarmWebSocketConn()
  },
  
};
</script>

<style lang="scss" scoped>
@use "sass:math";

@function torem($px) {
  //$px为需要转换的字号
  @return $px / 108 * 1rem; //108px为根字体大小
}

#canvas_frame {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
}
.animate-mask{
  position: fixed;
  width: 100%;
  height: 100%;
  top:0;
}

.btn-group {
  position: absolute;
  font-family: Source Han Sans CN;
  transition: all 0.5s;
  .btn {
    margin-top: 15px;
    cursor: pointer;
    font-size: 16px;
    color: #497acc;
    width: 54px;
    height: 32px;
    line-height: 32px;
    background: rgba(8, 24, 44, 0.6);
    border: 1px solid #498ff8;
    opacity: 1;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.viewer-group {
  position: absolute;
  // bottom: 40px;
  left: torem(1250);
	bottom: 10px;
  // left: 33.3%;
  transform-origin: center bottom;
  transform:  translateX(-50%);
  /* transform: translateX(-100%); */
  display: flex;
}
.viewer-group .viewer-box {
  width: 147px;
  height: 137px;
  color: #fff;
  font-size: 18px;
  padding-top: 40px;
  cursor: pointer;
  background: url("../../asserts/images/blue_btn.png") center no-repeat;
}
.viewer-group .viewer-box.cur {
  background: url("../../asserts/images/selected_btn.png") center no-repeat;
}


// .alarm-modal {
//   .ivu-modal-content {
//     background-color: rgba(14, 46, 73, 1);
//   }
//   .ivu-modal-footer {
//     border-top: 1px solid rgba(29, 65, 92, 1);
//   }
//   .ivu-modal {
//     top: 50%;
//     transform: translateY(-50%);
//   }
// }
// .alarm-modal {
//   .alarm-modal-content {
//     // position: absolute;
//     height: 520px;
//     width: 965px;
//     padding-top: 7px;
//     text-align: center;
//     color: rgba(172, 187, 214, 1);
//     font-size: 18px;
//     margin: 15px 0;
//   }
// }



@media screen and (max-width:1920px){
  .viewer-group{
    transform:  translateX(-50%) scale(0.7)
  }
}


</style>

<style lang="less">
#cssrender {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  pointer-events: none;
}
#css2drender{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  pointer-events: none;
}

.elementTag {
  position: relative;
  /* left: -30px;
  top: 15px; */
  top: 50px;
}

.elementContent {
  background-color: rgba(20, 143, 221, 0.68);
  box-shadow: 0 0 12px rgba(0, 128, 255, 0.75);
  border: 1px solid rgba(127, 177, 255, 0.75);
  /* padding: 20px; */
  color: #efefef;
}

.elementContent p {
  /* font-size: 20px; */
  /* font-weight: bold; */
  margin: 0;
}
// button {
//   color: rgb(6,222,233);
//   border:1px solid rgb(2,222,233);
//   background:none;
//   cursor:pointer;
//   float:right;
//   height: 15px;
//   width: 15px;
// }
// button:before {
//   content: '\2716';
//   color: rgb(6,222,233);
// }

.sx-device-point{
    display: flex;
    flex-direction: column;
    font-size: 14px;
    align-items: center;
    cursor: pointer;
    pointer-events: auto;
    &.small{
      transform: scale(0.5);
    }
    z-index: 1;
    // transform: scale(0.6);
    // transform: translate(-50%,-100%);
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
    &.white{
      color:rgb(255, 255, 255);
      .sx-device-point-name-bg{
        background-image: linear-gradient(to right,rgba(255, 255, 255, 0.15) 80%,rgba(255, 255, 255, 0) 20%);
        .custom-bg-block{
          background: rgba(255, 255, 255,0.3);;
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
.three-div_device-pop{
  z-index: 999 !important;
}
.sx-device-pop-wrapper{
  display: flex;
  align-items: center;
  user-select: none;
  transform: translate(50%, 0%);
  // transform: translateY();
  .pop-line{
    width: 196px;
    height: 82px;
    background: url("../../asserts/images/line_device_blue.png") center no-repeat;
    background-size: 100% 100%;
    // margin-top: 53px;
    transform: translateY(-50%);
  }
  // transform-origin: left top;
  .pop-content{
    width: 380px;
    // width: 480px;
    // height: auto;
    min-height: 180px;
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
      position: relative;
      // flex: 1;
      margin-bottom: 15px;
      // .play_window{
      //   pointer-events: auto;
      // }
      .play_window_tools{
        position: absolute;
        background: rgba(255, 255, 255, 0.1);
        pointer-events: auto;
        display: flex;
        align-items: center;
        justify-content: end;
        opacity: 0;
        bottom:0;
        width: 100%;
        padding: 2px 5px;
        &:hover{
          opacity: 1;
        }
        .play_window_tools_btn{
          fill: #fff;
          cursor: pointer;
        }
      }
    }

    .video-content{
      position: relative;
      margin-top: 10px;
      &.qrjhj{
        width: 100%;
        height: 340px;
        background: url(../../asserts/images/BA/qrjhj.gif)  no-repeat;
        background-size: 100% 100%;

        &.ql{
          background: url(../../asserts/images/BA/qrjhj_qj.png)  no-repeat;
          background-size: 100% 100%;

        }
        &.zd{
          background: url(../../asserts/images/BA/qrjhj_zd.gif)  no-repeat;
          background-size: 100% 100%;
        }
        &.yd{
          background: url(../../asserts/images/BA/qrjhj_yd.gif)  no-repeat;
          background-size: 100% 100%;
        }

        .status-text{
          font-size: 12px;
          position: absolute;
          &.xflw{
            left:118px;
            top: 54px;
          }
          &.pflw{
            right:106px;
            top: 54px;
          }
          &.ff{
            left: 64px;
            top: 54px;
          }
        }
        .status-box {
          font-size: 12px;
          position: absolute;
          color: #fff;
          &.pfj{
            top: 125px;
            left: 40px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          &.sfj{
            top: 125px;
            right: 40px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .value{
            color:yellow
          }
        }
        .label-text{
          font-size: 16px;
          position: absolute;
          color: yellow;
          &.xf{
            left: 5px;
            top: 82px;
          }
          &.pf{
            left: 1px;
            bottom: 76px;
          }
          &.hf{
            right: 9px;
            top: 82px;
          }
          &.sf{
            right: 2px;
            bottom: 76px;
          }
        }
      }
      &.jsj{
        width: 100%;
        height: 340px;
        background: url(../../asserts/images/BA/jsj.png);
        background-size: 100% 100%;
        .status-text{
          position: absolute;
          font-size: 24px;
          color: yellow;
          left: 50px;
          top: 50%;
          transform: translateY(-50%);
        }
        .status-box{
          position: absolute;
          font-size: 12px;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          .value{
            color: yellow;
          }

          &.left{
            left:5px;
            top: 50px;
          }
          &.right{
            right:5px;
            top: 50px;
          }
        }
        .sbjsj-yw-text{
          position: absolute;
          top: 20px;
          color: yellow;
          font-size: 16px;
          left: 50%;
          transform: translateX(-50%);
        }

      }
      &.gyc{
        width: 100%;
        height: 340px;
        background: url(../../asserts/images/BA/gyc.png);
        background-size: 100% 100%;

        .status-box {
          font-size: 12px;
          position: absolute;
          color: #fff;
          // display: flex;
          // flex-direction: column;
          &.left{
            top: 3px;
            left: 20px;
          }
          &.right{
            top: 3px;
            right: 20px;
          }
          .value{
            color:yellow
          }
        }
      }
      &.sb{
        width: 100%;
        height: 340px;
        // background: url(../../asserts/images/BA/sb.png) no-repeat;
        // background-size: 100% 100%;
        font-size: 12px;
        color: #fff;
        .flex-row{
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          .status-box{
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            .value{
              color: yellow;
            }
          }
        }
      }
      &.fj{
        width: 100%;
        height: 340px;
        background: url(../../asserts/images/BA/fj.gif);
        background-size: 100% 100%;
        &.jt{
          background: url(../../asserts/images/BA/fj_jt.png);
          background-size: 100% 100%;
        }
        .status-box{
          position: absolute;
          left: 50px;
          top: 5px;
          font-size: 12px;
          .value{
            color: yellow;
          }
        }

      }
    
    }
    .monitor-btns{
      width: 100%;
      padding: 3px 5px;
      display: flex;
      justify-content: end;
      >div{
        pointer-events: auto;
        cursor: pointer;
        // width: 79px;
        height: 26px;
        border-radius: 2px;
        border: 1px solid #498FF8;
        color: #497ACC;
        padding: 0 5px;
        line-height: 26px;
      }
    }

    .sx-device-chart{
      width: 100%;
      height: 200px;
      position: relative;
    }
  }
}

.alarm-point-gif0{
  animation: alarmPoint 0.8s linear infinite ;
  cursor: pointer;
}
.alarm-point-gif1{
  animation: alarmPoint 0.8s linear infinite ;
  cursor: pointer;
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
.sx-warn-pop-wrapper{
  // pointer-events: none;
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
    // flex: 1;
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
    pointer-events: auto;
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

.three_alarm-pop{
  pointer-events: none !important;
}


.temp-btn{
  transition: all 0.5s;
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
  margin-left: 30px !important;
  // &.all-devices-btn{
  //    top: 380px !important;
  // }
  // &.all-alarms-btn{
  //   top: 430px !important
  // }
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
@media screen and (min-width:1920px){
  .all-devices-btn{
    transform-origin: left top;
    // margin-left: 20px !important;
    top: 360px !important;
    transform:translate(10px,10px) scale(0.7)
    // top: 380px !important;
  }
  .all-alarms-btn{
    transform-origin: left top;
    // margin-left: 20px !important;
    top: 400px !important;
    transform:translate(10px,10px) scale(0.7)
    // top: 380px !important;
  }
  .all-lift-btn{
    transform-origin: left top;
    // margin-left: 20px !important;
    top: 440px !important;
    transform:translate(10px,10px) scale(0.7)
  }
}
@media screen and (max-width:1920px){
  .all-devices-btn{
    transform-origin: left top;
    // margin-left: 20px !important;
    top: 280px !important;
    transform:translate(10px,10px) scale(0.7)
    // top: 380px !important;
  }
  .all-alarms-btn{
    transform-origin: left top;
    // margin-left: 20px !important;
    top: 320px !important;
    transform:translate(10px,10px) scale(0.7)
    // top: 380px !important;
  }
  .all-lift-btn{
    transform-origin: left top;
    // margin-left: 20px !important;
    top: 360px !important;
    transform:translate(10px,10px) scale(0.7)
  }
  .temp-legends{
    transform:translateX(-50%) scale(0.7)
  }
}
@media screen and (max-width:1240px){
  .all-devices-btn{
    transform-origin: left top;
    margin-left: 20px !important;
    top: 240px !important;
    transform:translate(5px,5px) scale(0.5)
  }
  .all-alarms-btn{
    transform-origin: left top;
    margin-left: 20px !important;
    top: 280px !important;
    transform:translate(5px,5px) scale(0.5)
  }
  .all-lift-btn{
    transform-origin: left top;
    margin-left: 20px !important;
    top: 320px !important;
    transform:translate(5px,5px) scale(0.5)
  }
  .temp-legends{
    transform: trtranslateX(-50%)ans scale(0.5)
  }
}


.three-alarm-panels{
  pointer-events: auto;
  cursor: pointer;
  display: flex;
  transform:scale(0.6) translateY(-20px);
  >div{
    margin:0 5px;
    pointer-events: auto;
  }
  .alarm-panel{
    width: 83px;
    height: 70px;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    pointer-events: auto;
    .alarm-panel-title{
      height: 27px;
      color: #fff;
      font-size: 16px;
      line-height: 27px;
      
    }
    .alarm-panel-count{
      flex: 1;
      border: 1px solid;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 30px;
      font-weight: 500;
      color: #fff;
    }
  }
  .alarm-panel-0{
    .alarm-panel-title{
      background: rgba(227, 88, 90, 1);
    }
    .alarm-panel-count{
      border-color: rgba(239, 90, 90, 1);
      background: rgba(255, 80, 80, 0.28);
    }
  }
  .alarm-panel-1{
    .alarm-panel-title{
      background: rgba(252, 136, 69, 1);
    }

    .alarm-panel-count{
      border-color: rgba(252, 136, 69, 1);
      background: rgba(252, 136, 69, 0.28);
    }
  }
  .alarm-panel-2{
    .alarm-panel-title{
      border-color: rgba(16, 180, 212, 1);
    }
    .alarm-panel-count{
      border-color: rgba(16, 180, 212, 1);
      background: rgba(16, 180, 212, 0.28);
    }
  }
  .alarm-panel2 {
    width: 60px;
    height: 60px;
    background:url('../../asserts/images/map/location.gif');
    font-size: 24px;
    color: #fff;
  }
}
.device-alarm-circle{
  z-index:0;
  transform: translateY(50%);
}

</style>