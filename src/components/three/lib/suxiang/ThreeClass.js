import * as THREE from 'three';
import * as dat from 'dat.gui'

import {
    WEBGL
} from "three/examples/jsm/WebGL.js"
import {
    OrbitControls
} from "three/examples/jsm/controls/OrbitControls.js"
import Stats from 'three/examples/jsm/libs/stats.module.js';

import TWEEN from 'tween';
import {
    CSS2DRenderer,
    CSS2DObject
} from "three/examples/jsm/renderers/CSS2DRenderer.js"
import {
    CSS3DRenderer,
    CSS3DObject
} from "three/examples/jsm/renderers/CSS3DRenderer.js"

import StarClass from "./StarClass.js";


import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { SSAARenderPass } from "three/examples/jsm/postprocessing/SSAARenderPass.js";
import { TAARenderPass } from "three/examples/jsm/postprocessing/TAARenderPass.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { CopyShader } from "three/examples/jsm/shaders/CopyShader.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import { SMAAShader } from "three/examples/jsm/shaders/SMAAShader.js";
import { BloomPass } from "three/examples/jsm/postprocessing/BloomPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";

import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";

import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise.js";

// import wall1 from "../../assets/img/publicpic/liudong1.png";
// import wall2 from "../../assets/img/publicpic/liudong2.png";

import { LightningStrike } from "three/examples/jsm/geometries/LightningStrike.js";
import { LightningStorm } from "three/examples/jsm/objects/LightningStorm.js";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";

import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment";

import {Reflector} from 'three/examples/jsm/objects/Reflector.js'

import {
  Lensflare,
  LensflareElement,
} from "three/examples/jsm/objects/Lensflare.js";

import CommonClass from './CommonClass.js';
class ThreeClass {
    constructor(pageObj) {
        this.pageObj = pageObj;
        this.common = new CommonClass();

        //获取界面大小
        this.W = window.innerWidth;
        this.H = window.innerHeight;

        //动画计时
        this.delta = '';
        this.clock = new THREE.Clock();

        //初始化
        this.loadTime = 100; //加载时间计时
        this.renderOrder = 100;

        //基础
        this.container = '';
        this.scene = '';
        this.lightScene = '';
        this.camera = ''; //场景摄像机
        this.cam2=''
        this.controls = ''; //控制
        this.renderer = '';
        this.css2dRenderer = '';
        this.css3dRenderer = '';
        this.stats = '';
        this.gui = '';
        this.axes = '';

        this.cameraView = ''; //观测摄像机

        //鼠标
        this.intersectArr = [];
        this.moveObject = '';
        this.selectObject = '';

        //是否
        this.flagLoad = false; //是否加载
        this.flagHalf = false;
        this.interval_load = '';

        //参数
        this.skyboxMethod = this.pageObj.skyboxMethod;
        this.skyboxOne = this.pageObj.skyboxOne;
        this.skybox = this.pageObj.skybox;
        this.guiParams = this.pageObj.guiParams;
        this.mixerArray = [];
        this.mouseArr = this.pageObj.mouseArr;

        //启用
        this.isVision = this.pageObj.isVision != '' ? this.pageObj.isVision : false;
        this.isTween = this.pageObj.isTween != '' ? this.pageObj.isTween : false;
        this.isStats = this.pageObj.isStats != '' ? this.pageObj.isStats : false;
        this.isGui = this.pageObj.isGui != '' ? this.pageObj.isGui : false;
        this.isCutPic = this.pageObj.isCutPic != '' ? this.pageObj.isCutPic : 0;
        this.cutPicType = this.pageObj.cutPicType != '' ? this.pageObj.cutPicType : false;
        this.isAxes = this.pageObj.isAxes != '' ? this.pageObj.isAxes : false;
        this.isMouse = this.pageObj.isMouse != '' ? this.pageObj.isMouse : false;
        this.isMouseGroup = this.pageObj.isMouseGroup != '' ? this.pageObj.isMouseGroup : false;
        this.isDoubleClick = this.pageObj.isDoubleClick != '' ? this.pageObj.isDoubleClick : false;
        this.isCameraView = this.pageObj.isCameraView != '' ? this.pageObj.isCameraView : false;
        this.isSceneRotate = this.pageObj.isSceneRotate != '' ? this.pageObj.isSceneRotate : false;
        this.isControlRotate = this.pageObj.isControlRotate != '' ? this.pageObj.isControlRotate : false;
        this.isLimitControl = this.pageObj.isLimitControl != '' ? this.pageObj.isLimitControl : false;
        this.isHalfRenderer = this.pageObj.isHalfRenderer != '' ? this.pageObj.isHalfRenderer : false;
        this.isCss2dRenderer = this.pageObj.isCss2dRenderer != '' ? this.pageObj.isCss2dRenderer : false;
        this.isCss3dRenderer = this.pageObj.isCss3dRenderer != '' ? this.pageObj.isCss3dRenderer : false;

        this.mouseLeftClickFunc = this.pageObj.mouseLeftClickFunc != '' ? this.pageObj.mouseLeftClickFunc : '';
        this.mouseLeftClickCancelFunc = this.pageObj.mouseLeftClickCancelFunc != '' ? this.pageObj.mouseLeftClickCancelFunc : '';
        this.mouseRightClickFunc = this.pageObj.mouseRightClickFunc != '' ? this.pageObj.mouseRightClickFunc : '';
        this.mouseRightClickCancelFunc = this.pageObj.mouseRightClickCancelFunc != '' ? this.pageObj.mouseRightClickCancelFunc : '';
        this.mouseMoveFunc = this.pageObj.mouseMoveFunc != '' ? this.pageObj.mouseMoveFunc : '';

        this.canvas3 = null
        this.ctx = null
        this.ctx2 = null
        this.starsArr = [];
        this.maxStars = 1200;
        this.jttexture = null
        this.hue = 217
        this.pointsArr = []
        this.roadnameArr = []
        this.roadmatArr = []
        this.renderScene = null;
        this.bloomPass = null;
        this.composer = null
        this.finalPass = null
        this.finalComposer = null
        this.ENTIRE_SCENE = 0;
        this.BLOOM_SCENE = 1;
        this.bloomLayer = new THREE.Layers();
        this.bloomLayer.set(this.BLOOM_SCENE);
        this.darkMaterial = new THREE.MeshBasicMaterial({color: 'black', transparent: true, opacity: 1});
        this.materials = {}
        this.waterShader = null
        this.elapsed = 0
        this.ksb = null
        this.s = 0
        this.p3 = 1
        this.x = 0
        this.y = 0
        this.o = 0
        this.textureLoader = new THREE.TextureLoader()

        this.numlizi1_1 = Math.floor((290) * Math.random());
        this.numlizi2_1 = Math.floor((290) * Math.random());
        this.numlizi3_1 = Math.floor((290) * Math.random());
        this.numlizi4_1 = Math.floor((290) * Math.random());

        this.numlizi1_2 = Math.floor((290) * Math.random());
        this.numlizi2_2 = Math.floor((290) * Math.random());
        this.numlizi3_2 = Math.floor((290) * Math.random());
        this.numlizi4_2 = Math.floor((290) * Math.random());

        this.numlizi1_3 = Math.floor((290) * Math.random());
        this.numlizi2_3 = Math.floor((290) * Math.random());
        this.numlizi3_3 = Math.floor((290) * Math.random());
        this.numlizi4_3 = Math.floor((290) * Math.random());

        this.numlizi1_4 = Math.floor((290) * Math.random());
        this.numlizi2_4 = Math.floor((290) * Math.random());
        this.numlizi3_4 = Math.floor((290) * Math.random());
        this.numlizi4_4 = Math.floor((290) * Math.random());

        this.lizi1_1 = null
        this.lizi2_1 = null
        this.lizi3_1 = null
        this.lizi4_1 = null

        this.lizi1_2 = null
        this.lizi2_2 = null
        this.lizi3_2 = null
        this.lizi4_2 = null

        this.lizi1_3 = null
        this.lizi2_3 = null
        this.lizi3_3 = null
        this.lizi4_3 = null

        this.lizi1_4 = null
        this.lizi2_4 = null
        this.lizi3_4 = null
        this.lizi4_4 = null

        this.pointsArrlizi1_1 = null
        this.pointsArrlizi1_2 = null
        this.pointsArrlizi1_3 = null
        this.pointsArrlizi1_4 = null
        this.wallPoints = [];

        this.textureLoader2 = new THREE.TextureLoader()
        this.textureLoader3 = new THREE.TextureLoader()
        this.ShaderBar = null
        this.ShaderBar1 = null
        this.ShaderBar1_1 = null
        this.ShaderBar2 = null
        this.ShaderBarC = null
        this.ShaderBar1_p=null

        this.changeStrength = false
        this.changeStrengthLen = -0.005//-0.005

        this.isShowStars = false
        this.isShowLiZi = false
        this.isShowLightTrans = false

        this.colorArr = [new THREE.Color('#4d83ff'), new THREE.Color('#194fd9'), new THREE.Color('#f97055'), new THREE.Color('#355bc8'), new THREE.Color('#9559ef'), new THREE.Color('#55dcf9')]//4d83ff
        this.colorArr2 = [new THREE.Color('#a90fe9'), new THREE.Color('#CCFF33'), new THREE.Color('#152ec2'), new THREE.Color('#64bf68')]  //
        this.c1 = 0
        this.c1_1 = 0

        this.snowMesh = null
        this.positions2 = []
        this.isShowSnow = false

        this.rainMesh = null
        this.isShowRain = false

        this.isKj = true
        this.mainBuildnames = ['abuild01', 'abuild02', 'abuild03', 'abuild04', 'abuild05', 'abuild06', 'abuild07', 'abuild08', 'abuild09', 'abuild10']//['polySurface2355','polySurface923','polySurface2356','pCube402','pCube396','pCube398','pCube399','pCube401','pCube403']
        this.roadNames = ['road01', 'road05', 'road02', 'road06', 'road04', 'road03', 'road']

        this.storm = null
        this.stormShow = true
        this.timeRate = 1;
        this.currentTime = 0;

        this.curMode = 1

        this.ksbShow = true
        this.gqShow = true

        this.objmaterials = {}
        this.objdarkMaterials = {}

        this.clouds = []

        this.groupRain = null

        this.sphereSky = null
        this.sphereSky2 = null
        this.objScene = null

        this.camCurve = new THREE.CurvePath();
        this.camPercent = 0
        this.isManyou = false
        this.curveNum = 0;
        this.curveNum2 = 500;
        this.curveNum3 = 1500;
        this.curveNum4 = 0;
        this.curveNum5 = 500;
        this.curveNum6 = 1500;

        this.curvePoints = []
        this.curvePoints2 = []
        this.carObj = null

        this.pointsArrLx1 = null
        this.indexLx1 = null
        this.numLx1 = null
        this.pointsLx1 = null
        this.indexMaxLx1 = null

        this.pointsArrLx = null
        this.geometryLx = null
        this.indexLx = null
        this.indexMaxLx = null
        this.numLx = null
        this.points2Lx = null


        this.isHuiGuang = false

        this.isFirstShowGx = true
        this.isFirstShowRode = true
        this.isFirstShowDeng = true
        this.isFirstShowKsb = true
        this.isFirstShowFence = true
        this.isFirstShowTrans = true
        this.isFirstShowTrans2 = true
        this.isFirstShowCar = true
        this.isFirstShowSnow = true
        this.isFirstShowRain = true
        this.isFirstShowYg = true

        this.AmbientLight1 = null
        this.directionalLight1 = null

        this.timeOutFun = null
        this.countNum1 = 0

        this.wkGroup = null

        // this.gxColors = ['#f4f229', '#ee6c15', '#cb2d1d', '#8b31c5', '#c0da6a', '#172ea6','#FFFFFF']
        this.gxColors = ['#e9edf0', '#3290c5', '#e6e8e9', '#8f5ab3', '#f9f081','#2296e1','#f1f465']
        this.lfgxMat = null
        this.countNum2 = 0
        this.colorIndex = 0

        this.plArr = ['objpolySurface549', 'group19polySurface9748', 'group3group4polySurface1012', 'group10group2polySurface1008', 'group5group3polySurface1002', 'group19polySurface11401', 'polySurface2194', 'objobjobjobjobjobjobjobjpolySurface29']
        this.plArrBs = ['objpolySurface549', 'group19polySurface9748', 'polySurface2194', 'group19polySurface11401', 'group10group2polySurface1008', 'group3group4polySurface1012', 'group5group3polySurface1002', 'polySurface2186']
        this.plBan = ['objpolySurface549', 'group19polySurface9748', 'polySurface2194', 'group19polySurface11401', 'group10group2polySurface1008', 'group3group4polySurface1012', 'group5group3polySurface1002', 'polySurface2186', 'objobjobjobjlcs01pCube91', 'polySurface2250', 'objobjobjobjgroup3group4pCube128', 'objobjobjpolySurface2008', 'objobjobjgroup19pCube553', 'objobjobjobjgroup10group2pCube135', 'objobjobjobjobjobjobjobjobjobjobjobjpolySurface6', 'objobjobjobjlcs01pCube45', 'objobjobjpCube36']
        this.dimianObj = ['pCube1075','pCube1009', 'objobjobjpolySurface2018', 'polySurface1989', 'lineGL95', 'objobjobjobjobjobjobjobjpolySurface29', 'polySurface2130', 'polySurface2189', 'pCube644', 'pCube1058', 'Rectangle2002033043', '建筑_木材011', 'polySurface2067', 'polySurface2068', 'polySurface2164', 'objobjpCube6', 'polySurface2014', 'objobjobjobjpCube138', 'polySurface2013']//,'polySurface1983'
        this.plArrOld=["group19polySurface9748", "group19polySurface11401", "polySurface2194", "objpolySurface549", "group10group2polySurface1008", "group3group4polySurface1012", "group5group3polySurface1002", "polySurface1644", "objobjobjobjobjobjobjobjpolySurface29", "objobjobjobjobjobjobjobjpolySurface29", "polySurface2186"]
        this.plArrNew=["boli01","boli02","boli03","boli04","boli05"]
        this.plArrNew_O=['网格263_1','group10group2polySurface1008', 'group3group4polySurface1012', 'group5group3polySurface1002','group19polySurface11401','group19polySurface9748','objobjobjobjpolySurface2194','c09', 'objobjobjpolySurface1644']
        this.plArrNew_YJ=['c620','pCube1635','pCube1640','pCube1641','pCube1642','pCube1643','pCube1644','pCube1652','pCube1653']
        this.glArr=['polySurface1989','polySurface2263']
        this.lensflareSun=null
        this.meshplan='meshplan'

        this.publicMaterial = null

        this.YjObjs=[]
        this.YgObjs=[]


        this.plArr_425=[ '网格263_1','group19polySurface9748','group5group3polySurface1002','group3group4polySurface1012','group10group2polySurface1008','group19polySurface11401','objobjobjobjpolySurface2194','polySurface2580']
        this.plArr_425_high=[550.0,535.0,283.0,343.0,426.0,548.0,140.0,130.0]
        this.plArr_425_61=['group5group3polySurface1002', 'group3group4polySurface1012', 'group10group2polySurface1008', '网格010_1', 'polySurface22232','group19polySurface9748', 'group19polySurface11401','objobjobjobjobjobjobjobjpolySurface2194']

        //'group5group3polySurface1002'(1) , 'group3group4polySurface1012'(2) , 'group10group2polySurface1008'(3) , '网格010_1'(4_1) , 'polySurface22232'(4_2),'group19polySurface9748'(5) , 'group19polySurface11401'(6),'objobjobjobjobjobjobjobjpolySurface2194'(7  大底楼)

        this.jbShader4Arr=[]

        this.target2=new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight);

        this.lxpic_n="assets/img/publicpic/y5.png"    // y5_2.png

        this.npArr=[]

        this.wdobjArr1=[]

        this.topLight=null

        this.jbShader4_ceshi=null

        this.isYj=false

        this.waterShader3=null

        this.meshGb=null

        // 墙体特效
        this.wallShader = {
            uniforms: {
                color1:{
                    value:new THREE.Color('#D5FEFF')     //下面白色部分
                    // value:new THREE.Color('#D2FAFF')     //下面白色部分
                },
                color2:{
                    value:new THREE.Color('#1C43FF')     //上面蓝色部分
                    // value:new THREE.Color('#004b9d')     //上面蓝色部分
                },
                color3:{
                    value:new THREE.Color('#B1EAFD')   // 线条颜色
                },
                addVal:{
                    value:-19.5
                },
                maxH:{
                    value:-20.0
                },
                time: {
                    type: "pv2",
                    value: 0
                },
    
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
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        uniform float maxH;
        uniform float addVal;
        uniform float time;
       
        void main() {
            float bl=pow((vUv.y),0.5);
            float bl2=pow((vUv.y),0.6);   
            float vy=fract(vUv.y+time); // 取小数部分以实现循环效果
        
            vec3 gradient = mix(color2, color1, smoothstep(0.0,maxH,v_pz+addVal));
            vec4 c1=vec4(gradient.xyz,1.0);
            // gl_FragColor =  vec4(c1.r,c1.g,c1.b,bl);
            if(vy>0.0 && vy<0.27){
               gl_FragColor = vec4(c1.r,c1.g,c1.b,bl);
            }
            if(vy>0.27 && vy<0.34){    
                gl_FragColor=vec4(color3.rgb,bl2);
            }
            if(vy>0.34 && vy<0.59){    
                gl_FragColor = vec4(c1.r,c1.g,c1.b,bl);
            }
            if(vy>0.59 && vy<0.66){      
                gl_FragColor=vec4(color3.rgb,bl2);
            }
            if(vy>0.66 && vy<0.91){      
                gl_FragColor = vec4(c1.r,c1.g,c1.b,bl);
            }
            if(vy>0.91 && vy<0.98){
               gl_FragColor=vec4(color3.rgb,bl2);
            }
            if(vy>0.98 && vy<1.0){
               gl_FragColor=vec4(c1.r,c1.g,c1.b,bl);
            }
            
        }
            `
        },

        this.wallMaterial = new THREE.ShaderMaterial({
            uniforms:this.wallShader.uniforms,
            vertexShader:this.wallShader.vs,
            fragmentShader:this.wallShader.fs,
            blending:THREE.NormalBlending,
            transparent: true,
            depthTest: true,
            side: THREE.DoubleSide,
            opacity:1.0
        })
        // 告警点光圈特效
        this.circleShader = {
            uniforms:{
                uColor: {value: new THREE.Color("#ff0000")},
                uOpacity: {value: 1},
                uSpeed: {value: 0.05},
                uSge: {value: 10},
                // uSge: {value: 8},
                // uRadius: {value: wdith/2},
                uRadius: {value: 20},
                time: {value: 1}
            },
            VSHADER: `
                varying vec2 vUv;
                void main() { 
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }
            `,
            FSHADER: `
                varying vec2 vUv;
                uniform vec3 uColor;
                uniform float uOpacity;
                uniform float uSpeed; 
                uniform float uSge;
                uniform float time;
                float PI = 3.14159265;
                float drawCircle(float index, float range) {
                    float opacity = 1.0;
                    if (index >= 1.0 - range) {
                        opacity = 1.0 - (index - (1.0 - range)) / range;
                    } else if(index <= range) {
                        opacity = index / range;
                    } 
                    return opacity;
                }
                float distanceTo(vec2 src, vec2 dst) {
                    float dx = src.x - dst.x;
                    float dy = src.y - dst.y;
                    float dv = dx * dx + dy * dy;
                    return sqrt(dv);
                } 
                void main() { 
                    float iTime = -time * uSpeed;
                    float opacity = 0.0;
                    float len = distanceTo(vec2(0.5, 0.5), vec2(vUv.x, vUv.y)); 

                    float size = 1.0 / uSge;
                    vec2 range = vec2(0.65, 0.75);
                    float index = mod(iTime + len, size); 
                    // 中心圆 
                    vec2 cRadius = vec2(0.06, 0.12); 
                    
                    if (index < size && len <= 0.5) {   
                        float i = sin(index / size * PI); 

                        // 处理边缘锯齿
                        if (i >= range.x && i <= range.y){
                            // 归一
                            float t = (i - range.x) / (range.y - range.x);
                            // 边缘锯齿范围
                            float r = 0.3;
                            opacity = drawCircle(t, r);
                            
                        }
                        // 渐变
                        opacity *=  1.0 - len / 0.5;
                    }; 
                    
                    gl_FragColor = vec4(uColor, uOpacity * opacity);
                }
            `
        }
        this.circleMaterial = new THREE.ShaderMaterial({
            uniforms:this.circleShader.uniforms,
            vertexShader:this.circleShader.VSHADER,
            fragmentShader:this.circleShader.FSHADER,
            blending:THREE.NormalBlending,
            transparent: true,
            depthTest: true,
            side: THREE.DoubleSide,
        })
        this.jbShadar4 = {
            uniforms: {
                color1:{
                    value:new THREE.Color('#142034')     //
                },
                color2:{
                    value:new THREE.Color('#4d83ff')     //
                },
                color3:{
                    value:new THREE.Color('#6ac5fc')     //
                },
                addVal:{
                    value:10.0
                },
                lightHeight:{
                    value:0
                    // value:-20.0
                },//运动时高度  -1.2
                lightWidth:{
                    value:-36.0
                },// 大小(高度) 0.3  上下扫描线宽度
                colorGo:{
                    value:new THREE.Color('#ffffff')
                },
        
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
            uniform vec3 color1;
            uniform vec3 color2;
            uniform vec3 color3;
            uniform vec3 colorGo;
            uniform float addVal;
            uniform float lightHeight;
            uniform float lightWidth;
                    
            float plot (float pct){
                return  smoothstep( pct-lightWidth*1.0, pct, v_pz) - smoothstep( pct, pct+lightWidth, v_pz);
            }
        
            void main() {
                vec4 c1=vec4(color3.r,color3.g,color3.b,0.4);
                float f1 = plot(lightHeight);
                vec4 b1 = vec4(colorGo.r, colorGo.g, colorGo.b, 1.0) ;
                gl_FragColor = mix(c1.rgba,b1,f1);
                // if(v_pz < -5000){
                //     gl_FragColor = vec4(color3.r,color3.g,color3.b,0.4);
                // }
                // if(v_pz >= -5000){
                //     gl_FragColor = vec4(color1.r,color1.g,color1.b,1);
                // }
            }
            `
        }
    }



    //加载
    load() {
        this.isVision ? console.log(THREE.REVISION) : '';
        //兼容性判断
        if (WEBGL.isWebGLAvailable() === false) {
            document.body.appendChild('您的浏览器不支持WebGL,请更换Chrome或360浏览器。');
        } else {
            this.init();
        }

    }

    //初始化
    init() {
        this.initCanvas();
        this.initScene();
        this.initCamera();
        this.isCameraView ? this.initCameraView() : '';
        this.initLight2();
        //this.initGround();
        this.initControls();
        this.initRenderer();
        this.initModel();
        this.initShader();
       // this.initHuiGuang()
        this.isStats ? this.initStats() : '';
        this.isGui ? this.initGui() : '';
        this.isAxes ? this.initAxes() : '';

        //窗口变化
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
       // debugger;
        var that=this
        this.interval_load = setInterval(() => {
            if (this.flagLoad) {
                clearInterval(this.interval_load);
                this.isMouse ? this.initMouse() : '';//鼠标
                if (this.isDoubleClick) {
                    $(document).on('dblclick', e => {
                        this.common.dBlclick(e, that.camera, that.scene);
                    });
                }

                that.start();
                that.animate(); //执行渲染
            }
        }, that.loadTime);
    }

    initModel() { }

    initShader() { }
    start() { }

    //初始化画布
    initCanvas() {
        this.container = document.createElement('div');
        this.container.id = 'div_canvas';
        this.container.className = 'container-hand';
        document.getElementById('canvas_frame').appendChild(this.container);
        //document.body.insertBefore(this.container, document.body.firstChild);
    }

    //初始化场景
    initScene() {
        this.scene = new THREE.Scene();
        this.lightScene = new THREE.Scene();

        //天空盒
        switch (this.skyboxMethod) {
            case 2:
               // this.scene.background = new THREE.Color('#000d4d');
                //this.scene.background = new THREE.Color('#111C51');
                //this.scene.background = new THREE.Color('#101C4F');
                //this.scene.background = new THREE.Color('#333333');
                break;
            case 1:
                //this.scene.background = new THREE.TextureLoader().load(this.skyboxOne);
                break;
            default:
                //this.scene.background = new THREE.CubeTextureLoader().load(this.skybox);
        }

        //this.scene.fog = new THREE.Fog(this.scene.background, 1, 5000);

        //全景图
        /* const geometry = new THREE.SphereBufferGeometry(1000, 120, 80);
        geometry.scale(-1, 1, 1);
        const texture = new THREE.TextureLoader().load(panorama);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh); */
    }
    //初始化摄像机
    initCamera() {
        this.camera=new THREE.PerspectiveCamera(0.1,this.W / this.H,1,10000);    //30
        if (this.isCameraView) {
            let helper = new THREE.CameraHelper(this.camera);
            this.scene.add(helper);
        }
        this.cam2=this.camera.clone()
        this.cam2.name='cam2'
    }
    //初始化观测摄像机
    initCameraView() {
        this.cameraView = new THREE.PerspectiveCamera(30, this.W / this.H, 1, 100000);//30, this.W / this.H, 1, 100000
        this.cameraView.position.set(1000, 1000, 1000);
    }
    //初始化光线
    initLight() {
        this.AmbientLight1=new THREE.AmbientLight(0x555555,2)//2
        this.scene.add(this.AmbientLight1);

        this.directionalLight1 = new THREE.DirectionalLight(0xffffff,0.4);  // 0.9
        this.directionalLight1.position.set(0-2000,1050+0,-1940-2000);   //0,1050,-1940
        this.scene.add(this.directionalLight1);
        //debugger;
        this.directionalLight1.castShadow = true;
        this.directionalLight1.shadow.mapSize.width=2560;  //2560
        this.directionalLight1.shadow.mapSize.height=2560; //2560

        // this.directionalLight1.shadow.camera.near=-9000
        // this.directionalLight1.shadow.camera.far = 6500//*0.01;
        // this.directionalLight1.shadow.camera.left = -2200.0//*0.01;
        // this.directionalLight1.shadow.camera.right = 2200.0//*0.01;
        // this.directionalLight1.shadow.camera.top = 900//*0.01;
        // this.directionalLight1.shadow.camera.bottom = -1000//*0.01;
        // this.directionalLight1.shadow.bias=-0.0005

        this.dir2=this.directionalLight1.clone()
        this.dir2.castShadow=false
        this.dir2.intensity=0.6
        this.dir2.position.x=0
        this.dir2.position.z=0
        this.dir2.position.y=1050
        this.dir2.position.z+=3600
        this.dir2.position.x+=1500
        this.scene.add(this.dir2)

        var geometry = new THREE.SphereGeometry( 6.8, 20, 20 );
        var material = new THREE.MeshLambertMaterial ({color:'#5ebaff'});
        var sphere = new THREE.Mesh( geometry, material );
        this.scene.add(sphere);
        sphere.position.copy(this.directionalLight1.position)

    }

    initLight2(){
        this.AmbientLight1=new THREE.AmbientLight('#fff',1)
        this.scene.add(this.AmbientLight1);

        this.pointLight2 = new THREE.PointLight("#ffffff", 0.0);  //0.1
        this.pointLight2.position.set(896.2745213045123, 249.68234367236601, -548.9733088617019);
        this.scene.add(this.pointLight2);



        this.pointLight3 = new THREE.PointLight("#ffffff", 0.0);
        this.pointLight3.position.set(681.9938581037145, 249.154107508444202, -265.7308369865375);
        this.scene.add(this.pointLight3);



        this.pointLight4 = new THREE.PointLight("#ffffff", 0.0);   //EEDD0D
        this.pointLight4.position.set(201.36166854475195, 249.47328204789148, -51.78066930741193+100);
        this.scene.add(this.pointLight4);


        this.directionalLight1 = new THREE.DirectionalLight("#fff", 2.5);    //fff     2.5
        this.directionalLight1.castShadow = true;
        this.directionalLight1.position.set(1578.141853090013+100, 1023.732229319972422, 2494.5078842210496+100);
        this.directionalLight1.target.position.set(0, 0, 0);
        this.directionalLight1.castShadow = true;

        // this.directionalLight1.shadow.mapSize.set(2560, 2560);
        this.directionalLight1.shadow.mapSize.set(8192, 8192);
        this.directionalLight1.shadow.camera.near=-9000
        this.directionalLight1.shadow.camera.far=6500
        this.directionalLight1.shadow.camera.left = -2200;
        this.directionalLight1.shadow.camera.right = 2200;
        this.directionalLight1.shadow.camera.top = 900;
        this.directionalLight1.shadow.camera.bottom = -1000;
        this.directionalLight1.shadow.bias=-0.0005


        this.scene.add(this.directionalLight1);

    }


    //初始化布料背景
    initGround() {
        //模式
        switch (this.pageObj.groundMethod) {
            case 0:
                //网格
                let helper = new THREE.GridHelper(5000, 100);
                this.scene.add(helper);
                break;
        }

    }
    //加载界面控制器
    initControls() {
        this.controls = new OrbitControls(this.isCameraView ? this.cameraView : this.camera, this.container);
        this.isLimitControl ? this.controls.maxPolarAngle = Math.PI * 0.499 : '';
        //设置相机距离原点的最近距离
        this.controls.minDistance = 0.1//10;
        //设置相机距离原点的最远距离
        // this.controls.maxDistance = 9000;//4000

        this.controls.minPolarAngle = 0;
        this.controls.maxPolarAngle = Math.PI/2.1;

        this.isControlRotate ? this.controls.autoRotate = true : '';
        /*让模型看起来整体向下移动一段距离*/
        // this.controls.target.y+=250
        this.controls.update()
        // "x":-1.2573851910360985,"y":-44.81075416419973,"z":-29.25156673757547
        this.controls.target = new THREE.Vector3(-1.2573851910360985,-44.81075416419973,-29.25156673757547)
        this.controls.userData = {target:new THREE.Vector3(-1.2573851910360985,-44.81075416419973,-29.25156673757547)}
    }
    //鼠标
    initMouse() {
        if (window['appmouse']) {
            window['appmouse'].removeListener(this);
            window['appmouse'] = null;
        }

        window['appmouse'] = new AppMouseClass(this);
        window['appmouse'].isMouseGroup = this.isMouseGroup;
        window['appmouse'].init();
    }
    //加载渲染器
    initRenderer() {

        if (!this.isCutPic) {
            this.renderer = new THREE.WebGLRenderer({
                antialias: true,
                // logarithmicDepthBuffer:true,//精度更高的z缓冲，来代替原有的Z缓冲
                logarithmicDepthBuffer:false,//
                preserveDrawingBuffer:false,
                autoClear:false,
                alpha:true,
                precision:'highp',
                stencil:false
            });

        } else {
            //开启图形缓冲区用于截图
            this.renderer = new THREE.WebGLRenderer({
                antialias: true, //开启锯齿
                logarithmicDepthBuffer:false,   // false 高清 true 不高清
                preserveDrawingBuffer:false,//保留图形缓冲区
                autoClear:false,
                precision:'highp',
                stencil:false,
                alpha: true
            });
        }

        // this.renderer = new THREE.WebGLRenderer({
        //     antialias: true, //开启锯齿
        // });

        this.renderer.setSize(this.W, this.H);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.autoClear=false
        this.container.appendChild(this.renderer.domElement);
        this.renderer.render(this.scene,this.camera);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.needsUpdate = true;
        this.renderer.localClippingEnabled=true


        this.css3dRenderer = new CSS3DRenderer();
        this.css3dRenderer.setSize(this.W, this.H);

        this.css2dRenderer = new CSS2DRenderer()
        this.css2dRenderer.setSize(this.W, this.H);

        document.querySelector("#cssrender").appendChild(this.css3dRenderer.domElement);
        document.querySelector("#css2drender").appendChild(this.css2dRenderer.domElement);

        // this.css3dRenderer.render(this.scene, this.camera)
        // this.renderer.render(this.scene,this.cam2);

      //  this.renderer.domElement.style.position = 'absolute';

    }
    //动画
    //动画
    animate() {
        // alert('nnnnnnnnnnnnnnnnnnn')
        var that=this
        this.render();
        requestAnimationFrame(this.animate.bind(this));
       // debugger;
      if(this.renderScene!=null && this.bloomPass!=null && this.composer!=null && this.finalPass!=null && this.finalComposer!=null && this.isHuiGuang){
           this.renderBloom( true );
           this.finalComposer.render();
      }

      if(!this.isHuiGuang){
          // this.cam2.position.copy(this.camera.position);      //倒影功能
          // this.cam2.quaternion.copy(this.camera.quaternion);   //倒影功能

          this.renderer.render(this.scene,this.camera)
          this.css3dRenderer.render(this.scene,this.camera)
          this.css2dRenderer.render(this.scene,this.camera)

          // console.log(this.target2)
          // this.cam2.matrixWorldInverse.elements[6]=this.cam2.matrixWorldInverse.elements[6]*(-1)

          // this.renderer.render(this.scene,this.cam2)
      }

        TWEEN.update()

        var deltaTime=this.clock.getDelta()
        this.controls ? this.controls.update(this.delta) : '';

    }

    renderBloom( mask ) {
        this.scene.traverse( this.darkenNonBloomed.bind(this) );
        this.composer.render();
        this.scene.traverse( this.restoreMaterial.bind(this) );
     }

    darkenNonBloomed( obj ) {
        if ( obj.isMesh && this.bloomLayer.test( obj.layers ) === false || obj.isSprite && this.bloomLayer.test( obj.layers ) === false || (obj.type=='SpotLight' && this.bloomLayer.test( obj.layers ) === false) || (obj.type=='Lensflare' && this.bloomLayer.test( obj.layers ) === false)){
            if(obj.type=="SpotLight"){
               // alert(obj.name)
            }

            this.materials[ obj.uuid ] = obj.material;
            obj.material = this.darkMaterial;
           // console.log(obj.type)

        }

        // const material=obj.material
        // if(material && this.bloomLayer.test(obj.layers)===false){
        //     this.objmaterials[obj.uuid]=material
        //     if(!this.objdarkMaterials[material.type]){
        //         const Proto=Object.getPrototypeOf(material).constructor
        //         this.objdarkMaterials[material.type]=new Proto({color:0x000000})
        //     }
        //     obj.material=this.objdarkMaterials[material.type]
        // }
    }
    restoreMaterial( obj ) {
        if ( this.materials[ obj.uuid ] ) {

                obj.material = this.materials[ obj.uuid ];
                delete this.materials[ obj.uuid ];



        }

    }
    //渲染
    render(){
        var that=this
     
        if(this.meshGb){
            this.meshGb._s += 0.007;// 0.007
            this.meshGb.scale.set(this.meshGb.size*this.meshGb._s*5,this.meshGb.size*this.meshGb._s*5,this.meshGb.size*this.meshGb._s*5);  //mesh.scale.set(mesh.size*mesh._s,mesh.size*mesh._s,mesh.size*mesh._s);
            if (this.meshGb._s <= 1.5) {
                this.meshGb.material.opacity = (this.meshGb._s-1) * 2;//2等于1/(1.5-1.0)，保证透明度在0~1之间变化
            } else if (this.meshGb._s > 1.5 && this.meshGb._s <= 2) {
                this.meshGb.material.opacity =  1 - (this.meshGb._s - 1.5)*2;//2等于1/(2.0-1.5) mesh缩放2倍对应0 缩放1.5被对应1
            } else {
                this.meshGb._s = 1.0;
            }
        }






        if(that.wdobjArr1.length>0 && that.isHuiGuang==true && this.isYj==true){
            var vec1=(new THREE.Vector3(-477.45001220703125,975,-284.5)).sub((new THREE.Vector3(-477.45001220703125,975,-254.5)))
            var vec2=that.camera.position.clone().sub((new THREE.Vector3(-477.45001220703125,975,-284.5)))
            var angle=vec1.angleTo(vec2)
            var degrees=angle*180/Math.PI
            if(degrees<90){
                that.wdobjArr1[0].visible=false
            }else{
                that.wdobjArr1[0].visible=true
            }

            var vec3=(new THREE.Vector3(-680.3499755859375,975,-427)).sub((new THREE.Vector3(-680.3499755859375,975,-457)))
            var vec4=that.camera.position.clone().sub((new THREE.Vector3(-680.3499755859375,975,-427)))
            var angle2=vec3.angleTo(vec4)
            var degrees2=angle2*180/Math.PI
            if(degrees2<90){
                that.wdobjArr1[1].visible=false
            }else{
                that.wdobjArr1[1].visible=true
            }

            var vec5=(new THREE.Vector3(-507.3999938964844,975,-457.3500061035156)).sub((new THREE.Vector3(-477.3999938964844,975,-457.3500061035156)))
            var vec6=that.camera.position.clone().sub((new THREE.Vector3(-507.3999938964844,975,-457.3500061035156)))
            var angle3=vec5.angleTo(vec6)
            var degrees3=angle3*180/Math.PI
            if(degrees3<90){
                that.wdobjArr1[2].visible=false
            }else{
                that.wdobjArr1[2].visible=true
            }

            var vec7=(new THREE.Vector3(-650.0999755859375,975,-254.4499969482422)).sub((new THREE.Vector3(-680.0999755859375,975,-254.4499969482422)))
            var vec8=that.camera.position.clone().sub((new THREE.Vector3(-650.0999755859375,975,-254.4499969482422)))
            var angle4=vec7.angleTo(vec8)
            var degrees4=angle4*180/Math.PI
            if(degrees4<90){
                that.wdobjArr1[3].visible=false
            }else{
                that.wdobjArr1[3].visible=true
            }











        }



        // }

        if(that.lfgxMat && that.isHuiGuang){
            // alert('tttttttttt');
            if(that.countNum2>50){   //100
                that.countNum2=0
                if(that.colorIndex==(that.gxColors.length-1)){
                    that.colorIndex=0
                }else{
                    that.colorIndex+=1
                }
                that.lfgxMat.color=new THREE.Color(that.gxColors[that.colorIndex])   //=new THREE.MeshBasicMaterial({color:that.gxColors[that.colorIndex]})//.color=that.gxColors[that.colorIndex]
                that.ShaderBar1_p.uniforms.color.value=new THREE.Color(that.gxColors[that.colorIndex])
                that.topLight.color=new THREE.Color(that.gxColors[that.colorIndex])
            }else{
                that.countNum2+=1
            }
        }

        if(this.geometryLx){                     //光线流动
            // debugger;
            if (this.indexLx > this.indexMaxLx) this.indexLx = 0;
            this.indexLx += 2
            this.points2Lx = this.pointsArrLx.slice(this.indexLx, this.indexLx + this.numLx); //从曲线上获取一段
            var curve = new THREE.CatmullRomCurve3(this.points2Lx);
            var newPoints2 = curve.getSpacedPoints(100); //获取更多的点数
            this.geometryLx.setFromPoints(newPoints2);
        }


        if(this.curvePoints.length>0){
          //   if (this.camPercent >= 1.0)this.camPercent = 0;
          //   this.camPercent += 0.01;
          //   var pos = this.camCurve.getPointAt(this.camPercent);
          // //  console.log('ccccccccccccc------',pos.x,-pos.y)
          //   if(pos && pos.x && pos.y){
          //       this.camera.position.set(pos.x, 0, -pos.y);
          //       this.camera.position.y = 17;
          //       var dir = this.camCurve.getTangentAt(this.camPercent);
          //       var newdir = new THREE.Vector3(dir.x, 0, -dir.y);
          //       var target = this.camera.position.clone();
          //       target.add(newdir.clone().multiplyScalar(0.01));
          //       this.camera.lookAt(target);
          //   }
            if (this.curveNum < this.curvePoints.length - 100) {
                var i = Math.floor(this.curveNum)
                this.carObj.position.set(this.curvePoints[i].x, this.curvePoints[i].y, this.curvePoints[i].z);
                this.carObj.lookAt(new THREE.Vector3(this.curvePoints[i + 1].x, this.curvePoints[i + 1].y, this.curvePoints[i + 1].z));
                // if(i>65.0){
                //     this.camera.position.set(this.curvePoints[i-64].x, this.curvePoints[i-64].y+10, this.curvePoints[i-64].z);
                //     this.camera.lookAt(new THREE.Vector3(this.curvePoints[i-64 + 1].x, this.curvePoints[i-64 + 1].y+10, this.curvePoints[i-64 + 1].z));
                // }
                this.curveNum += 1.8//0.6;
            } else {
                this.curveNum = 0
            }

            if (this.curveNum2 < this.curvePoints.length - 100) {
                var i = Math.floor(this.curveNum2)
                this.carObj2.position.set(this.curvePoints[i].x, this.curvePoints[i].y, this.curvePoints[i].z);
                this.carObj2.lookAt(new THREE.Vector3(this.curvePoints[i + 1].x, this.curvePoints[i + 1].y, this.curvePoints[i + 1].z));
                this.curveNum2 += 1.8//0.6;
            } else {
                this.curveNum2 = 0
            }

            if (this.curveNum3 < this.curvePoints.length - 100) {
                var i = Math.floor(this.curveNum3)
                this.carObj3.position.set(this.curvePoints[i].x, this.curvePoints[i].y, this.curvePoints[i].z);
                this.carObj3.lookAt(new THREE.Vector3(this.curvePoints[i + 1].x, this.curvePoints[i + 1].y, this.curvePoints[i + 1].z));
                this.curveNum3 += 1.8//0.6;
            } else {
                this.curveNum3 = 0
            }

            if (this.curveNum4 < this.curvePoints2.length - 100) {
                var i = Math.floor(this.curveNum4)
                this.carObj4.position.set(this.curvePoints2[i].x, this.curvePoints2[i].y, this.curvePoints2[i].z);
                this.carObj4.lookAt(new THREE.Vector3(this.curvePoints2[i + 1].x, this.curvePoints2[i + 1].y, this.curvePoints2[i + 1].z));
                this.curveNum4 += 1.8//0.6;
            } else {
                this.curveNum4 = 0
            }

            if (this.curveNum5 < this.curvePoints2.length - 100) {
                var i = Math.floor(this.curveNum5)
                this.carObj5.position.set(this.curvePoints2[i].x, this.curvePoints2[i].y, this.curvePoints2[i].z);
                this.carObj5.lookAt(new THREE.Vector3(this.curvePoints2[i + 1].x, this.curvePoints2[i + 1].y, this.curvePoints2[i + 1].z));
                this.curveNum5 += 1.8//0.6;
            } else {
                this.curveNum5 = 0
            }

            if (this.curveNum6 < this.curvePoints2.length - 100) {
                var i = Math.floor(this.curveNum6)
                this.carObj6.position.set(this.curvePoints2[i].x, this.curvePoints2[i].y, this.curvePoints2[i].z);
                this.carObj6.lookAt(new THREE.Vector3(this.curvePoints2[i + 1].x, this.curvePoints2[i + 1].y, this.curvePoints2[i + 1].z));
                this.curveNum6 += 1.8//0.6;
            } else {
                this.curveNum6 = 0
            }



        }

        if(this.isShowRain==true && this.groupRain){
            // that.groupRain.rotateZ(0.01)
            that.groupRain.children.forEach(sprite => {
                // 雨滴的y坐标每次减1
                sprite.position.y -= 3;
                sprite.position.x-=1.75
                if (sprite.position.y < -100) {
                    // 如果雨滴落到地面，重置y，从新下落
                    sprite.position.y = 1000;
                    sprite.position.x = sprite.userData.x
                }
            })
        }

        if(this.clouds.length>0){
            for(var i=0;i<this.clouds.length;i++){
                this.clouds[i].material.uniforms.cameraPos.value.copy( this.camera.position );
                this.clouds[i].material.uniforms.frame.value ++;
            }
        }

        if(this.isShowStars){
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.globalAlpha = 0.8;
            this.ctx.fillStyle = 'hsla(' + this.hue + ', 64%, 6%, 1)';
            this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
            this.ctx.globalCompositeOperation = 'lighter';
            for (var i = 1, l = this.starsArr.length; i < l; i++) {
                this.starsArr[i].draw();
            };
            this.scene.background.needsUpdate=true
        }

        for(var i=0;i<this.roadmatArr.length;i++){
            this.roadmatArr[i].map.offset.x -= 0.002//0.002
        }

        if(this.waterShader){
            that.elapsed += 0.016;
            that.waterShader.uniforms.time.value = that.elapsed
            // window.shaderInfo5.uniforms.u_CameraPos=window.camera1.position.clone()
        }

        if(that.ksb){
            that.s = that.s + 0.01
            that.p3 = that.p3 - 0.001  //0.002
            if(that.s>9) { //5
                that.s = 0;
                that.p3 = 1
            }
            that.ksb.scale.set(1+that.s,1,1+that.s);
            if(that.ksb.material[0]){
                that.ksb.material[0].opacity = that.p3
            }else{
                that.ksb.material.opacity = that.p3
            }

        }

        if(this.isShowLiZi==true){
            this.numlizi1_1 += 1;
            if (this.numlizi1_1>this.pointsArrlizi1_1.length-2) this.numlizi1_1 = 0;
            this.lizi1_1.position.copy(this.pointsArrlizi1_1[this.numlizi1_1]);
            this.numlizi2_1 += 1;
            if (this.numlizi2_1>this.pointsArrlizi1_1.length-2) this.numlizi2_1 = 0;
            this.lizi2_1.position.copy(this.pointsArrlizi1_1[this.numlizi2_1]);
            this.numlizi3_1 += 1;
            if (this.numlizi3_1>this.pointsArrlizi1_1.length-2) this.numlizi3_1 = 0;
            this.lizi3_1.position.copy(this.pointsArrlizi1_1[this.numlizi3_1]);
            this.numlizi4_1 += 1;
            if (this.numlizi4_1>this.pointsArrlizi1_1.length-2) this.numlizi4_1 = 0;
            this.lizi4_1.position.copy(this.pointsArrlizi1_1[this.numlizi4_1]);

            this.numlizi1_2 += 1;
            if (this.numlizi1_2>this.pointsArrlizi1_2.length-2) this.numlizi1_2 = 0;
            this.lizi1_2.position.copy(this.pointsArrlizi1_2[this.numlizi1_2]);
            this.numlizi2_2+=1;
            if (this.numlizi2_2>this.pointsArrlizi1_2.length-2) this.numlizi2_2 = 0;
            this.lizi2_2.position.copy(this.pointsArrlizi1_2[this.numlizi2_2]);
            this.numlizi3_2 += 1;
            if (this.numlizi3_2>this.pointsArrlizi1_2.length-2) this.numlizi3_2 = 0;
            this.lizi3_2.position.copy(this.pointsArrlizi1_2[this.numlizi3_2]);
            this.numlizi4_2 += 1;
            if (this.numlizi4_2>this.pointsArrlizi1_2.length-2) this.numlizi4_2 = 0;
            this.lizi4_2.position.copy(this.pointsArrlizi1_2[this.numlizi4_2]);

            this.numlizi1_3 += 1;
            if (this.numlizi1_3>this.pointsArrlizi1_3.length-2) this.numlizi1_3 = 0;
            this.lizi1_3.position.copy(this.pointsArrlizi1_3[this.numlizi1_3]);
            this.numlizi2_3+=1;
            if (this.numlizi2_3>this.pointsArrlizi1_3.length-2) this.numlizi2_3 = 0;
            this.lizi2_3.position.copy(this.pointsArrlizi1_3[this.numlizi2_3]);
            this.numlizi3_3 += 1;
            if (this.numlizi3_3>this.pointsArrlizi1_3.length-2) this.numlizi3_3 = 0;
            this.lizi3_3.position.copy(this.pointsArrlizi1_3[this.numlizi3_3]);
            this.numlizi4_3 += 1;
            if (this.numlizi4_3>this.pointsArrlizi1_3.length-2) this.numlizi4_3 = 0;
            this.lizi4_3.position.copy(this.pointsArrlizi1_3[this.numlizi4_3]);

            this.numlizi1_4 += 1;
            if (this.numlizi1_4>this.pointsArrlizi1_4.length-2) this.numlizi1_4 = 0;
            this.lizi1_4.position.copy(this.pointsArrlizi1_4[this.numlizi1_4]);
            this.numlizi2_4+=1;
            if (this.numlizi2_4>this.pointsArrlizi1_4.length-2) this.numlizi2_4 = 0;
            this.lizi2_4.position.copy(this.pointsArrlizi1_4[this.numlizi2_4]);
            this.numlizi3_4 += 1;
            if (this.numlizi3_4>this.pointsArrlizi1_4.length-2) this.numlizi3_4 = 0;
            this.lizi3_4.position.copy(this.pointsArrlizi1_4[this.numlizi3_4]);
            this.numlizi4_4 += 1;
            if (this.numlizi4_4>this.pointsArrlizi1_4.length-2) this.numlizi4_4 = 0;
            this.lizi4_4.position.copy(this.pointsArrlizi1_4[this.numlizi4_4]);
        }

        if (this.fenceShader) {
            this.fenceShader.uniforms.time.value += 0.005;
        }

        if (this.jbShader4_ceshi) {
            this.jbShader4_ceshi.uniforms.time.value += 0.004;
        }

        if (this.fenceShader2) {
            this.fenceShader2.uniforms.time.value += 0.005;
        }
        if (this.fenceShader3) {
            this.fenceShader3.uniforms.time.value += 0.01;
        }

        // if (this.fenceShader4) {
        //     this.fenceShader4.uniforms.time.value += 0.01;
        // }

        if (this.fenceShader5) {
            this.fenceShader5.uniforms.time.value += 0.02;
        }

        if (this.waterShader3) {
            this.waterShader3.uniforms.time1.value += 0.02;
        }

        if (this.fenceShader6_2) {
            this.fenceShader6_2.uniforms.time.value += 0.03;
        }

        if (this.fenceShader7) {
            this.fenceShader7.uniforms.time.value += 0.04;
        }

        // if (this.fenceShader8) {
        //     this.fenceShader8.uniforms.time.value += 0.02;
        // }

        if (this.ShaderBarC) {
            this.ShaderBarC.uniforms.time.value += 0.005;
        }

       if(that.isShowLightTrans==true){


           if(that.ShaderBar1){
               if(that.ShaderBar1.uniforms.addval.value<-5){ //-5
                   that.ShaderBar1.uniforms.addval.value=100  //10
                   if(that.c1>=5){
                       that.c1=0
                       that.ShaderBar1.uniforms.color1.value=that.colorArr[5]
                       that.ShaderBar1.uniforms.color2.value=that.colorArr[0]
                   }else{
                       that.ShaderBar1.uniforms.color1.value=that.colorArr[that.c1]
                       that.ShaderBar1.uniforms.color2.value=that.colorArr[that.c1+1]
                       that.c1=that.c1+1
                   }
               }else{
                   that.ShaderBar1.uniforms.addval.value-=0.5  //0.05
               }

               // console.log(that.ShaderBar1.uniforms.addval.value)
           }

           if(that.ShaderBar1_1){
               if(that.ShaderBar1_1.uniforms.addval.value<-100){
                   that.ShaderBar1_1.uniforms.addval.value=200
                   if(that.c1_1>=3){
                       that.c1_1=0
                       that.ShaderBar1_1.uniforms.color1.value=that.colorArr2[3]
                       that.ShaderBar1_1.uniforms.color2.value=that.colorArr2[0]
                   }else{
                       that.ShaderBar1_1.uniforms.color1.value=that.colorArr2[that.c1_1]
                       that.ShaderBar1_1.uniforms.color2.value=that.colorArr2[that.c1_1+1]
                       that.c1_1=that.c1_1+1
                   }
               }else{
                   that.ShaderBar1_1.uniforms.addval.value-=1.5
               }
           }
            if(that.jbShader4Arr.length>0){
                // console.log('ddvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv')
                that.x = that.x + 0.007 //0.007  值越大上下扫的越快
                // that.y = that.y + 0.03
                var xV=Math.sin(that.x)*5.4-5.5 // 减的越多光线下降的越少
                for(var i=0;i<that.jbShader4Arr.length;i++){
                    that.jbShader4Arr[i].uniforms.lightHeight.value = xV  //上下扫描
                    // that.jbShader4Arr[i].uniforms.goz.value = that.jbShader4Arr[i].uniforms.goz.value > -14? that.jbShader4Arr[i].uniforms.goz.value - 0.03 : 14   //光线扫描
                    // that.jbShader4Arr[i].uniforms.u_r.value = that.jbShader4Arr[i].uniforms.u_r.value < that.jbShader4Arr[i].uniforms.u_max.value ? that.jbShader4Arr[i].uniforms.u_r.value + 0.03 : 0.025  // 圆圈扫描
                }

            }

       }else{
           if(this.bloomPass){
               this.bloomPass.strength=0.6 //1.0
           }
       }

        if(this.snowMesh && this.isShowSnow){
            // debugger;
            var positions=this.snowMesh.geometry.attributes.position.array
            for(var i=0;i<positions.length;i+=3){
                var px=this.positions2[i]
                var py=this.positions2[i+1]
                var pz=this.positions2[i+2]

                positions[i]=positions[i]-px
                positions[i+1]=positions[i+1]-py
                positions[i+2]=positions[i+2]-pz

                if (positions[i+1] <= -5000/2) positions[i+1] = 5000 / 2;
                if (positions[i] <= -5000/2 || positions[i] >= 5000/2) positions[i] = positions[i] * -1;
                if (positions[i+2] <= -5000/2 || positions[i+2] >= 5000/2)this.positions2[i+2] = this.positions2[i+2] * -1;
            }
            this.snowMesh.geometry.attributes.position.needsUpdate = true
        }

        if(this.rainMesh && this.isShowRain){
            var pos_buffattr=that.rainMesh.geometry.getAttribute('position')
            var py_buffattr=that.rainMesh.geometry.getAttribute('pyArr')
            for(var i=0;i<pos_buffattr.count;i++){
                var pos_x=pos_buffattr.getX(i)
                var pos_y=pos_buffattr.getY(i)

                var py_x=py_buffattr.getX(i)
                var py_y=py_buffattr.getY(i)
                pos_x=pos_x-py_x
                pos_y=pos_y-py_y

                if(pos_x<=-20 || pos_x>=20) py_x=py_x*-1
                if(pos_y<=-250) pos_y=800

                pos_buffattr.setX(i,pos_x)
                pos_buffattr.setY(i,pos_y)
            }
            pos_buffattr.needsUpdate=true
            py_buffattr.needsUpdate=true
        }

        if(that.storm){
            that.currentTime += that.timeRate * that.clock.getDelta();
            if ( that.currentTime < 0 ) {
                that.currentTime = 0;
            }
            that.storm.update(that.currentTime);
        }


       
        this.uniformsUpdate()


    }

    uniformsUpdate() {
    }

    ////////////////辅助//////////////
    //性能监测
    initStats() {
        this.stats = new Stats(); // 创建一个性能监视器
        this.stats.setMode(0); // 0: fps, 1: ms
        this.stats.domElement.style.position = 'absolute'; // 样式， 坐标
        this.stats.domElement.style.left = '0px';
        this.stats.domElement.style.top = '0px';
        document.getElementById('canvas_frame').appendChild(this.stats.domElement); // 添加到canvas-frame

        !this.isStats ? this.stats = '' : '';
    }
    //GUI
    initGui() {

    }

    //截图
    cutPic() {
        let dom = document.getElementById('div_canvas').firstChild;
        switch (this.cutPicType) {
            case 1:
                this.downLoad(this.saveAsJPG(dom));
                break;
            default:
                this.downLoad(this.saveAsPNG(dom));
        }

    }

    // 保存成png格式的图片
    saveAsPNG(canvas) {
        return canvas.toDataURL('image/png');
        //return canvas.toDataURL('image/bmp');//bmp有些浏览器不支持
    }

    // 保存成jpg格式的图片
    saveAsJPG(canvas) {
        return canvas.toDataURL('image/jpeg');
    }

    //下载文件
    downLoad(url) {
        let fd = document.createElement('a');
        fd.download = '截图文件';//默认名是下载
        fd.href = url;
        document.body.appendChild(fd);
        fd.click();
        fd.remove();
    }

    //三维坐标轴的显示
    initAxes() {
        this.axes = new THREE.AxesHelper(1000000);
        this.scene.add(this.axes);
    }

    ///////////////其他///////////////
    onWindowResize() {
        //窗口变化时
        this.W = window.innerWidth;
        this.H = window.innerHeight;

        this.camera.aspect = this.W / this.H;
        this.camera.updateProjectionMatrix();

        if (this.isCameraView) {
            this.cameraView.aspect = this.W / this.H;
            this.cameraView.updateProjectionMatrix();
        }

        this.renderer.setSize(this.W, this.H);
        this.css2dRenderer.setSize(this.W, this.H) 
        this.css3dRenderer.setSize(this.W, this.H)

        this.composer ? this.composer.setSize(window.innerWidth, window.innerHeight) : '';
    }
    addOrder() {
        //渲染层级
        this.renderOrder += 10;
        return this.renderOrder;
    }

    getShaderMat55(val,maxH1,addVal1){
        var that=this
        var jbShader4 = this.jbShadar4
        let option5_2 = {
            material: new THREE.ShaderMaterial({
                uniforms:jbShader4.uniforms,
                vertexShader:jbShader4.vs,
                fragmentShader:jbShader4.fs,
                // blending: THREE.AdditiveBlending,
                blending:THREE.NormalBlending,
                transparent: true,
                depthTest: false,
                depthWrite:true,
                side: THREE.DoubleSide,
                opacity:1.0
            })
        };
        that.jbShader4Arr.push(jbShader4)
        return option5_2.material
    }

    ceshi7(obj){
        const that = this
        let material = that.getShaderMat55(90.0,220.0,10.0)
        material.depthTest = true


    //     let gui = new dat.GUI()
    //     let control = gui.addFolder("shadar")

    //    let params = {
    //     lightHeight:0,
    //     lightWidth:0.05,
    //    }

      
    //     control.add(params,'lightHeight',-10000,10000,1).onChange(function(val){
    //         that.jbShadar4.uniforms.lightHeight.value = val
    //     })
    //      control.add(params,'lightWidth',-100,10.0,0.001).onChange(function(val){
    //         that.jbShadar4.uniforms.lightWidth.value = val
    //     })

        

        // that.addAllDevicesBuildingSceneControl(material,'wall')

        // var envMap = this.getTexture("assets/img/publicpic/bluesky.jpg");
        // envMap.mapping = THREE.EquirectangularReflectionMapping;
        // let material2 = new THREE.MeshPhysicalMaterial({
        //     color: "#ffffff",
        //     side: THREE.DoubleSide,
        //     transparent: true,
        //     opacity: 0.2,
        //     envMap,
        //     envMapIntensity: 1,//1
        //     // reflectivity: 1,
        //     roughness:0.7,   //0.5
        //     metalness:1.0,
        //     depthWrite:true,
        //     depthTest:true,
        //     forceSinglePass:false
        // })
        // let dimianMat = material2.clone()
        // dimianMat.color = new THREE.Color("#fcfcfc")
        // let otherMat = material2.clone()
        // let lineMat = new THREE.LineBasicMaterial({
        //     color:'#58595a', //58595a
        //     transparent:true,
        //     opacity:1.0,
        // })

        // that.addAllDevicesBuildingSceneControl(material,'material')
        // that.addAllDevicesBuildingSceneControl(dimianMat,'dimian')

        let lineMat = new THREE.LineBasicMaterial({
            color:'#b2e7f9', //58595a
            transparent:true,
            opacity:1.0,
        })
        // this.addLineMaterialControl(lineMat,{
        //     color:'#b2e7f9', //58595a
        //     transparent:true,
        //     opacity:1.0,
        // })

        obj.traverse(function (o) {
            if(o.isMesh){
                if(o.name.indexOf('wall')!=-1){     //
                    o.material= material  //22000.0,7.0

                    console.log('OBJECT',o)

                    var edges = new THREE.EdgesGeometry(o.geometry, 50);
                    var edgesMaterial = lineMat
                    var line = new THREE.LineSegments(edges, edgesMaterial);
                    o.add(line);
                }
                // if(o.name.split('_')[0] == 'dimian'){

                //     o.material = dimianMat
                //     let floor = parseInt(obj.name.split('_')[2])
                //     if(floor){
                //         o.renderOrder = floor
                //     }
                //     // obj.material = material
                //     // obj.material.transparent = true
                //     o.material.depthTest = true
                //     o.material.depthWrite = false
                // }else{
                //     o.renderOrder = 25
                // }
            }
        })
    }

    addLight(h, s, l, x, y, z){
        var that=this;
    

        var textureLoader = new THREE.TextureLoader();
        var textureFlare0 = textureLoader.load( 'assets/img/publicpic/lensflare0_alpha2.png' );//lensflare0_alpha.png
    

        var spriteMaterial = new THREE.SpriteMaterial({
            map:textureFlare0,
            transparent:true
            // opacity:0
        });
        var spritehot1 = new THREE.Sprite(spriteMaterial);
        spritehot1.layers.enable(1)
        spritehot1.scale.set(40,40,1);
        spritehot1.renderOrder=202
        // light.add(spritehot1);
        this.scene.add(spritehot1)
        spritehot1.position.copy(new THREE.Vector3(x,y,z));
        spritehot1.name='ld'

        // light.name='ld'



        // lensflare.renderOrder=78
        // light.layers.enable(0)
        // lensflare.layers.enable(0)
    }

    addSpotLights(h, s, l, x, y, z,x2,y2,z2,intensityV,ang,dec,dis,colorVal){
        var that=this
        var light = new THREE.SpotLight(colorVal, 3 );
        light.position.copy(new THREE.Vector3(x,y,z));
        light.angle = ang;
        light.penumbra = 1  //0.1;    //半影
        light.decay = dec;          //衰退
        light.distance = dis    //70;
        light.intensity = intensityV  //3
        // light.color.setHSL(h,s,l)
        light.shadow.camera.visible=true
        var geometry = new THREE.SphereGeometry( 0.0000000000000000000018, 2, 2 );  //0.000000020
        var material = new THREE.MeshLambertMaterial ({color:'#5ebaff'});
        var sphere = new THREE.Mesh( geometry, material );
        sphere.position.copy(new THREE.Vector3(x2,y2,z2)) //      -407.42747056223817, 135.2345118463844, -535.6255450586743
        light.target = sphere
        this.scene.add(sphere);
        this.scene.add( light );
        sphere.name='ld'
        light.name='ld'


        var sp2=sphere.clone()
        sp2.position.copy(light.position.clone())
        // this.scene.add( sp2 );
    }

    addReactLight() {
        var that = this;

        const geometry = new THREE.PlaneGeometry(6.0, 12.0);
        const material = new THREE.MeshBasicMaterial({
        color: "#eef849",
        side: THREE.DoubleSide,
        });
        const rectLight1 = new THREE.Mesh(geometry, material);
        this.scene.add(rectLight1);
        rectLight1.position.set(
        -1057.6248742612395 - 180,
        249.9083627748439,
        80.99738487335665 - 330
        );
        rectLight1.layers.enable(1);
        rectLight1.rotateY(Math.PI / 2);

        var r2 = rectLight1.clone();
        that.scene.add(r2);
        r2.position.copy(rectLight1.position.clone());
        r2.position.z += 35;

        var r3 = r2.clone();
        that.scene.add(r3);
        r3.position.copy(r2.position.clone());
        r3.position.z += 35;

        var r4 = r3.clone();
        that.scene.add(r4);
        r4.position.copy(r3.position.clone());
        r4.position.z += 35;

        var r5 = r4.clone();
        that.scene.add(r5);
        r5.position.copy(r4.position.clone());
        r5.position.z += 35;

        var r6 = rectLight1.clone();
        that.scene.add(r6);
        r6.position.copy(rectLight1.position.clone());
        r6.position.y -= 20;

        var r7 = r6.clone();
        that.scene.add(r7);
        r7.position.copy(r6.position.clone());
        r7.position.z += 35;

        var r8 = r7.clone();
        that.scene.add(r8);
        r8.position.copy(r7.position.clone());
        r8.position.z += 35;

        var r9 = r8.clone();
        that.scene.add(r9);
        r9.position.copy(r8.position.clone());
        r9.position.z += 35;

        var r10 = r9.clone();
        that.scene.add(r10);
        r10.position.copy(r9.position.clone());
        r10.position.z += 35;
    }
    addPointLights(colorVal, x, y, z,i,j,d,name){
    var that=this;
    var light = new THREE.PointLight( 0xffffff, i, j, d);
    light.color=new THREE.Color(colorVal)
    light.position.set( x, y, z );
    light.name=name

    if(name=='wdyd'){
        that.topLight=light
        this.scene.add(that.topLight);
    }else{
        this.scene.add(light);
    }

    light.visible=true

    // var geometry = new THREE.SphereGeometry( 8, 20, 20 );//0.000008
    // var material = new THREE.MeshLambertMaterial ({color:'#5ebaff'});
    // var sphere = new THREE.Mesh( geometry, material );
    // sphere.name='yd'
    // sphere.position.copy(light.position.clone())
    // this.scene.add( sphere );
    }

    KaiDeng(){
        var that=this
        if(this.isFirstShowDeng){
            this.isFirstShowDeng=false
            var intVal=0.7+0.4
            var intVal2=0.1
            that.addSpotLights(0.995, 0.5, 0.9,-1162.4696117600888, 150.682091286169946, 374.13214014247484,-1162.4696117600888, 0 ,374.13214014247484,intVal,Math.PI/2,1.5,5870,'yellow')
            that.addSpotLights(0.995, 0.5, 0.9,-1162.4696117600888, 150.682091286169946, 24.13214014247484,-1162.4696117600888, 0 ,24.13214014247484,intVal,Math.PI/2,1.5,5870,'yellow')
            that.addSpotLights(0.995, 0.5, 0.9,-562.4696117600888, 150.682091286169946, 374.13214014247484,-562.4696117600888, 0 ,374.13214014247484,intVal,Math.PI/2,1.5,5870,'yellow')
            that.addSpotLights(0.995, 0.5, 0.9,-562.4696117600888, 150.682091286169946, -130.13214014247484,-562.4696117600888, 0 ,-130.13214014247484,intVal,Math.PI/2,1.5,5870,'yellow')
            // that.addSpotLights(0.995, 0.5, 0.9,-62.4696117600888, 150.682091286169946, -130.13214014247484,-62.4696117600888, 0 ,-130.13214014247484,0.01,Math.PI/2,1.5,5870,'yellow')
            that.addSpotLights(0.995, 0.5, 0.9,-62.4696117600888, 150.682091286169946, 374.13214014247484,-62.4696117600888, 0 ,374.13214014247484,intVal,Math.PI/2,1.5,5870,'yellow')
            that.addSpotLights(0.995, 0.5, 0.9,-62.4696117600888+400, 150.682091286169946, 374.13214014247484-300,-62.4696117600888+400, 0 ,374.13214014247484-300,intVal,Math.PI/2,1.5,5870,'yellow')
            that.addSpotLights(0.995, 0.5, 0.9,-62.4696117600888+720, 150.682091286169946, 374.13214014247484-600,-62.4696117600888+720, 0 ,374.13214014247484-600,intVal,Math.PI/2,1.5,5870,'yellow')
            that.addSpotLights(0.995, 0.5, 0.9,-62.4696117600888+1020, 150.682091286169946, 374.13214014247484-850,-62.4696117600888+1020, 0 ,374.13214014247484-850,intVal,Math.PI/2,1.5,5870,'yellow')
            that.addSpotLights(0.995, 0.5, 0.9,-62.4696117600888+1320, 150.682091286169946, 374.13214014247484-900,-62.4696117600888+1320, 0 ,374.13214014247484-900,intVal,Math.PI/2,1.5,5870,'yellow')

            // that.addSpotLights(0.995, 0.5, 0.9,-572.7945062608237, 548.0164449972809+80, -251.9190926232817-100,-572.7945062608237, 548.0164449972809+90, -251.9190926232817-100,intVal+0.6,Math.PI/6.0,1.5,850,'#ffffff')   //楼顶灯

            var plIntensity=1.0
            var plIntensity2=-14.1
            var plIntensity3=1.0
            var decay=1.0
            var decay2=4
            var decayAddVal=0.5

            /*  that.addPointLights('#fff',-1389.532378466236, 322.67671027349603+100, -434.5815118090789,plIntensity,1000,decay,'yd')
            // that.addPointLights('#fff',-1383.0578982762604, 322.676536787189683+100, 138.08208627874475,plIntensity,1000,decay2,'yd')
            //
            that.addPointLights('#fff',-41.223286059900374, 322.363491054902163+100, -414.08380648892654,plIntensity,1000,decay,'yd')  //0.995, 0.5, 0.9

            that.addPointLights('#fff',-33.83355632524626, 322.999950237463292+100, 108.49366820244273+200,plIntensity,1000,decay2,'yd')
            that.addPointLights('#fff',1583.1737497072995+200, 490.10658554907661+100, -301.15753037356416-300,plIntensity,1000,decay2,'yd')
            that.addPointLights('#fff',1446.5818117973258, 490.106177960962+100, 1044.2562991456468,plIntensity,1000,decay2,'yd')
            //
            that.addPointLights('#fff',-580.354413845625, 432.21888111045627+100, 618.5763029476811-200,plIntensity,1000,decay,'yd')
            that.addPointLights('#fff',779.0281894160444, 432.80564753002963+160, 576.2712885200531-550,plIntensity2,1200,decay,'yd')*/

            var pc='#fcfecc'  //yellow  DAA520  FFD700  FAEFD4 fdfbc7
            that.addPointLights(pc,586.5667939738123+20,110.95914431691469, -439.9081858045997-60,plIntensity2+15,110,decay+decayAddVal,'yd')        //#fef500
            that.addPointLights(pc,586.5667939738123+110,110.95914431691469, -439.9081858045997-60,plIntensity2+15,110,decay+decayAddVal,'yd')
            that.addPointLights(pc,586.5667939738123+110,110.95914431691469, -439.9081858045997-140,plIntensity2+15,110,decay+decayAddVal,'yd')
            that.addPointLights(pc,586.5667939738123+20,110.95914431691469, -439.9081858045997-140,plIntensity2+15,110,decay+decayAddVal,'yd')
            //
            that.addPointLights(pc,586.5667939738123-50,110.95914431691469, -439.9081858045997-130,plIntensity2+15,100,decay+decayAddVal,'yd')
            that.addPointLights(pc,586.5667939738123-250,110.95914431691469, -439.9081858045997-130,plIntensity2+15,100,decay+decayAddVal,'yd')
            that.addPointLights(pc,586.5667939738123-250,110.95914431691469, -439.9081858045997+80,plIntensity2+15,100,decay+decayAddVal,'yd')
            that.addPointLights(pc,586.5667939738123-50,110.95914431691469, -439.9081858045997+80,plIntensity2+15,75,decay+decayAddVal,'yd')

            that.addPointLights(pc,586.5667939738123-185,110.95914431691469+20, -439.9081858045997+150,plIntensity2+15,78,decay+decayAddVal,'yd')
            that.addPointLights(pc,586.5667939738123-185,110.95914431691469+20, -439.9081858045997+220,plIntensity2+15,78,decay+decayAddVal,'yd')
            that.addPointLights(pc,586.5667939738123-268,110.95914431691469+20, -439.9081858045997+220,plIntensity2+15,78,decay+decayAddVal,'yd')
            that.addPointLights(pc,586.5667939738123-268,110.95914431691469+20, -439.9081858045997+150,plIntensity2+15,78,decay+decayAddVal,'yd')

            that.addPointLights(pc,586.5667939738123-268,110.95914431691469-53, -439.9081858045997+150,plIntensity2+15,62,decay+decayAddVal,'yd')
            that.addPointLights(pc,586.5667939738123-268,110.95914431691469-53, -439.9081858045997+270,plIntensity2+15,62,decay+decayAddVal,'yd')
            that.addPointLights(pc,586.5667939738123-198,110.95914431691469-53, -439.9081858045997+270,plIntensity2+15,62,decay+decayAddVal,'yd')
            that.addPointLights(pc,586.5667939738123-198,110.95914431691469-53, -439.9081858045997+120,plIntensity2+15,62,decay+decayAddVal,'yd')

            that.addPointLights(pc,586.5667939738123-258,110.95914431691469-78, -439.9081858045997+410,plIntensity2+15,56,decay+decayAddVal,'yd')
            that.addPointLights(pc,586.5667939738123-333,110.95914431691469-78, -439.9081858045997+410,plIntensity2+15,56,decay+decayAddVal,'yd')
            that.addPointLights(pc,586.5667939738123-333,110.95914431691469-78, -439.9081858045997+335,plIntensity2+15,56,decay+decayAddVal,'yd')
            that.addPointLights(pc,586.5667939738123-258,110.95914431691469-78, -439.9081858045997+380,plIntensity2+15,56,decay+decayAddVal,'yd')

            that.addPointLights('yellow',-572.7945062608237-5, 548.0164449972809+90, -251.9190926232817-100,plIntensity3+15,136,decay-0.5,'wdyd')    //楼顶灯

            // that.addPointLights(pc,-911.6258660670894-10, 103.14202306022726, 124.66456976931606,plIntensity2+15,76,decay-0.5,'yd')
            // that.addPointLights(pc,-911.6258660670894-10, 103.14202306022726, 124.66456976931606+90,plIntensity2+15,76,decay-0.5,'yd')
            // that.addPointLights(pc,-911.6258660670894-110, 103.14202306022726, 124.66456976931606+90,plIntensity2+15,76,decay-0.5,'yd')
            // that.addPointLights(pc,-911.6258660670894-110, 103.14202306022726, 124.66456976931606-10,plIntensity2+15,76,decay-0.5,'yd')
            //
            // that.addPointLights(pc,-1028.0819325034445-50, 244.30216233843603+5, -219.6456532542686-10,plIntensity2+15,90,decay+0.2,'yd')
            // that.addPointLights(pc,-1028.0819325034445-50, 244.30216233843603+5, -219.6456532542686+80,plIntensity2+15,90,decay+0.2,'yd')
            // that.addPointLights(pc,-1028.0819325034445-140, 244.30216233843603+5, -219.6456532542686+80,plIntensity2+15,90,decay+0.2,'yd')
            // that.addPointLights(pc,-1028.0819325034445-140, 244.30216233843603+5, -219.6456532542686-10,plIntensity2+15,90,decay+0.2,'yd')
            //
            // that.addPointLights(pc,-882.9416155397553+10,287.8487491770721+5,-385.27782773966624-50,plIntensity2+15,90,decay+0.2,'yd')
            // that.addPointLights(pc,-882.9416155397553-100,287.8487491770721+5,-385.27782773966624-50,plIntensity2+15,90,decay+0.2,'yd')
            // that.addPointLights(pc,-882.9416155397553-100,287.8487491770721+5,-385.27782773966624-145,plIntensity2+15,90,decay+0.2,'yd')
            // that.addPointLights(pc,-882.9416155397553+10,287.8487491770721+5,-385.27782773966624-145,plIntensity2+15,90,decay+0.2,'yd')
            //
            // that.addPointLights(pc,-475.433804749448-45, 375.0263782643025, -405.35592922911394-5,plIntensity2+15,90,decay+0.2,'yd')
            // that.addPointLights(pc,-475.433804749448-45, 375.0263782643025, -405.35592922911394+108,plIntensity2+15,90,decay+0.2,'yd')
            // that.addPointLights(pc,-475.433804749448-160, 375.0263782643025, -405.35592922911394+108,plIntensity2+15,90,decay+0.2,'yd')
            // that.addPointLights(pc,-475.433804749448-160, 375.0263782643025, -405.35592922911394-5,plIntensity2+15,90,decay+0.2,'yd')
            //
            // that.addPointLights(pc,445.4650327570109-40, 355.6653395516534, -281.40513944779866-15,plIntensity2+15,90,decay+0.2,'yd')
            // that.addPointLights(pc,445.4650327570109-40, 355.6653395516534, -281.40513944779866+79,plIntensity2+15,90,decay+0.2,'yd')
            // that.addPointLights(pc,445.4650327570109-135, 355.6653395516534, -281.40513944779866+79,plIntensity2+15,90,decay+0.2,'yd')
            // that.addPointLights(pc,445.4650327570109-135, 355.6653395516534, -281.40513944779866-20,plIntensity2+15,90,decay+0.2,'yd')
            //
            // that.addPointLights(pc,750.8764955942216-37, 411.961645675957, -582.589564934282,plIntensity2+18,90,decay+0.2,'yd')
            // that.addPointLights(pc,750.8764955942216-37, 411.961645675957, -582.589564934282+94,plIntensity2+18,90,decay+0.2,'yd')
            // that.addPointLights(pc,750.8764955942216-137, 411.961645675957, -582.589564934282+94,plIntensity2+18,90,decay+0.2,'yd')
            // that.addPointLights(pc,750.8764955942216-137, 411.961645675957, -582.589564934282-6,plIntensity2+18,90,decay+0.2,'yd')



            // var geometry = new THREE.SphereGeometry( 4, 20, 20 );//0.000008
            // var material = new THREE.MeshLambertMaterial ({color:'#5ebaff',depthTest:true});
            // var sphere = new THREE.Mesh( geometry, material );
            // sphere.position.copy(new THREE.Vector3(750.8764955942216-37, 411.961645675957, -582.589564934282))
            // this.scene.add( sphere );






            that.addLight(0.995, 0.5, 0.9,-1793.0568931603916, 191.4815001154969, 767.048552543222);
            that.addLight( 0.995, 0.5, 0.9,-1535.0052516510648, 191.4905669555492, 800.939517383618);
            that.addLight( 0.995, 0.5, 0.9,-1296.2448867499616, 190.46746862422793, 800.8856546502985);
            that.addLight( 0.995, 0.5, 0.9,-959.65173671535, 187.6210529111828, 789.1517569817306);
            that.addLight( 0.995, 0.5, 0.9,-1071.0887150437422, 187.53417620612615, 720.2736174689389);
            that.addLight( 0.995, 0.5, 0.9, -1881.0943671530065, 188.76752810522726, 605.1854845211598);
            that.addLight( 0.995, 0.5, 0.9, -1688.017300102949, 191.15212175746433, 569.8540017738343);
            that.addLight( 0.995, 0.5, 0.9,-1502.1866103229638, 191.34678662588422, 544.2723357137425);
            that.addLight( 0.995, 0.5, 0.9,-1291.4084414482338, 191.28992596337054, 528.40033190435);
            that.addLight( 0.995, 0.5, 0.9,-1079.4711492573956, 190.74149322776648, 520.2020336642453);
            that.addLight( 0.995, 0.5, 0.9,-1079.6482446051818, 190.81025371168403, 595.0211474681513);
            that.addLight( 0.995, 0.5, 0.9,-877.5246303275429, 185.84497739839242, 518.1567299216221);
            that.addLight( 0.995, 0.5, 0.9,-681.4533376001558, 179.62558197953842, 514.5122472111165);
            that.addLight( 0.995, 0.5, 0.9,-732.7471291457239, 194.20178425481913, 581.8289402285068);
            that.addLight( 0.995, 0.5, 0.9,-724.2191349973685, 190.69854502804066, 709.5052420284425);
            that.addLight( 0.995, 0.5, 0.9,-642.4411819469061, 183.34208351517685, 778.6825894517086);
            that.addLight( 0.995, 0.5, 0.9,-452.96524054756793, 171.46306120922802, 501.50849105700166);
            that.addLight( 0.995, 0.5, 0.9,-320.95790496471415, 179.8599782690134, 765.890935306738);
            that.addLight( 0.995, 0.5, 0.9, -224.61056765293682, 191.03227214280432, 691.2421549690222);
            that.addLight( 0.995, 0.5, 0.9,-233.07119854178433, 194.42130365408207, 566.4345843578443);
            that.addLight( 0.995, 0.5, 0.9,-222.15412033161357, 163.68898687165503, 490.4074340296191);
            that.addLight( 0.995, 0.5, 0.9,-11.937311072091404, 175.77932735525832, 755.2411836014402);
            that.addLight( 0.995, 0.5, 0.9,281.19370646013465, 172.1392482414009, 744.9389537283422);
            that.addLight( 0.995, 0.5, 0.9,229.71075804212177, 191.10778866380738, 674.390226293437);
            that.addLight( 0.995, 0.5, 0.9, 221.40805194868756, 194.12285567589277, 548.0293335627899);
            that.addLight( 0.995, 0.5, 0.9,21.08371718466042, 154.78830194265691, 480.12018807667596);
            that.addLight( 0.995, 0.5, 0.9,573.4479946664904, 81.40083782197227, 453.57036046244275);
            that.addLight( 0.995, 0.5, 0.9,677.1031725658028, 81.40382308553299, 664.7557850897152);
            that.addLight( 0.995, 0.5, 0.9,532.4405213918685, 82.12463948259125, 668.1971417095773);
            that.addLight( 0.995, 0.5, 0.9, 651.9280105082674, 166.06880445900725, 764.0385777596501);

            that.addLight( 0.995, 0.5, 0.9,754.9349881318421, 69.8314858804282, -89.93438980485034);
            that.addLight( 0.995, 0.5, 0.9,1644.9320860712464, 81.35594049210972, 1409.1977780635923);
            that.addLight( 0.995, 0.5, 0.9,1308.466953731397 ,81.7037271402539, 1519.280265995833);
            // that.addLight( 0.995, 0.5, 0.9,1566.4890773232157, 82.08890234315359, 2478.4003244588844);
            // that.addLight( 0.995, 0.5, 0.9, 1511.3163943256657, 84.16521522667183, 2474.900238936448);
            // that.addLight( 0.995, 0.5, 0.9,1296.7611132989657, 80.85993537992377, 2475.7166254533954);
            // that.addLight( 0.995, 0.5, 0.9,1237.9285707040572, 81.34853873488046, 2420.904959152588);
            // that.addLight( 0.995, 0.5, 0.9, 1314.9678698300513, 111.57243166202235, 2123.595212919709);
            // that.addLight( 0.995, 0.5, 0.9,1529.740906671794, 115.13639976478005, 2122.4694294309365);
            // that.addLight( 0.995, 0.5, 0.9,1279.6794069400844, 82.57400738814367, 1929.7308481379798);
            // that.addLight( 0.995, 0.5, 0.9,1620.9536281115627, 81.52904693403207, 1754.8012610131802);
            // that.addLight( 0.995, 0.5, 0.9,1548.4477252671268, 148.112010140792, 1755.5416006404816);
            // that.addLight( 0.995, 0.5, 0.9,1334.9281486610453, 143.81018470131133 ,1756.5015258565022);
            // that.addLight( 0.995, 0.5, 0.9,1592.330273786284, 81.54574928662433, 2173.6432163180757);
            that.addLight( 0.995, 0.5, 0.9,1391.9615227799231, 154.48929882772865, 1521.7933299209121);
            that.addLight( 0.995, 0.5, 0.9,1515.187897435594, 154.3866423910676, 1516.5942457040874);
            that.addLight( 0.995, 0.5, 0.9,1561.9385090228084, 148.94706340649154, 1399.5880779423117);
            that.addLight( 0.995, 0.5, 0.9, 1315.351936529896, 150.56834242714632, 1434.831403396535);
            that.addLight( 0.995, 0.5, 0.9, 1394.9234842425842 ,154.34351033539252, 1318.9804100435128);
            that.addLight( 0.995, 0.5, 0.9,1519.8316101227442, 154.33576247133206, 1306.9329042855948);
            that.addLight( 0.995, 0.5, 0.9,1190.8519806212482 ,153.19250739384034, 1149.0886512034606);
            that.addLight( 0.995, 0.5, 0.9, 1609.2677751268805, 149.0428384288889, 1146.15716230043);
            that.addLight( 0.995, 0.5, 0.9,1420.5759014426349, 154.2479457404093, 1057.1719729308616);
            that.addLight( 0.995, 0.5, 0.9,1544.9797947419595, 154.56727515348237, 1041.483571213271);
            that.addLight( 0.995, 0.5, 0.9,1678.263482206081, 81.31424644758351, 981.9653494118597);
            that.addLight( 0.995, 0.5, 0.9,1733.3555915169293, 145.02234174502635, 779.7150599499804);
            that.addLight( 0.995, 0.5, 0.9,1577.6521483447186, 153.88125641044442, 734.2976437903368);
            that.addLight( 0.995, 0.5, 0.9,1453.3259837543237, 154.6302661573024, 732.9972676699551);
            that.addLight( 0.995, 0.5, 0.9,1818.4462132325516, 81.77214083088796, 647.0162193719121);
            that.addLight( 0.995, 0.5, 0.9, 2077.078515682712, 81.70196690840721, 633.9980458128075);
            that.addLight( 0.995, 0.5, 0.9,1934.95890667066, 191.0897821314424, 618.5059700662349);
            that.addLight( 0.995, 0.5, 0.9,1926.968564799642, 194.53966073071265, 495.18321375139885);
            that.addLight( 0.995, 0.5, 0.9,1926.7513574099678, 81.71880714414789, 416.66469623272025);
            that.addLight( 0.995, 0.5, 0.9,1833.2573836070133, 139.5987359875134, 417.5774103869775);
            that.addLight( 0.995, 0.5, 0.9,1757.1802708296943, 81.78427795588716, 353.23993246006955);
            that.addLight( 0.995, 0.5, 0.9,1488.1541294994079, 154.04821957514258, 377.4412748338254);
            that.addLight( 0.995, 0.5, 0.9,1612.5322922303649, 154.165643653831, 365.34234710922317);
            that.addLight( 0.995, 0.5, 0.9,1856.330811169785, 130.2533539853328, 138.55279071387676);
            that.addLight( 0.995, 0.5, 0.9,1731.154573189044, 81.61655837366924, 105.62054707853754);
            that.addLight( 0.995, 0.5, 0.9,1637.5687184321685, 154.10601459814717, 76.87911579510907);
            that.addLight( 0.995, 0.5, 0.9,1513.140119685399, 154.8087478253347, 82.43242185167685);
            that.addLight( 0.995, 0.5, 0.9,1734.5727138579202, 81.61289267796087, -155.80683094573033);
            that.addLight( 0.995, 0.5, 0.9, 1700.9623995026955, 125.25597840717664, -171.2493001983866);
            that.addLight( 0.995, 0.5, 0.9,1663.0521806838153, 154.26693077597037, -210.916919212027987);
            that.addLight( 0.995, 0.5, 0.9, 1476.6708524541275, 81.89628423785953, -131.114600849078);
            that.addLight( 0.995, 0.5, 0.9,1538.1304938588746, 154.3668064415429, -203.1758268905989);
            that.addLight( 0.995, 0.5, 0.9,1737.7027311762627, 81.65260610444696, -420.17445161525217);
            that.addLight( 0.995, 0.5, 0.9,1913.6918671286644, 81.47281809157606, -684.1166853777604);
            that.addLight( 0.995, 0.5, 0.9,1907.4759415751585, 81.76116011085307, -881.821234814019);
            that.addLight( 0.995, 0.5, 0.9,1703.3908869189581, 154.37482256258232, -585.128800584119);
            that.addLight( 0.995, 0.5, 0.9,1580.232606534208, 154.73099900889883, -591.2664711143276);
            that.addLight( 0.995, 0.5, 0.9,1504.3334604615818, 81.76384367316498, -896.6128647677425);



            that.addLight( 0.995, 0.5, 0.9,1238.4692985786755, 81.53302698248585, -871.7119985877171);
            that.addLight( 0.995, 0.5, 0.9,1247.1462521480696, 81.35796548742627, -690.7004560380155);
            that.addLight( 0.995, 0.5, 0.9,-870.6031726178866, 81.43299636044807, 503.5641345526962);
            that.addLight( 0.995, 0.5, 0.9, -520.4881784411383, 81.59853602889459 ,493.56993622468156);
            that.addLight( 0.995, 0.5, 0.9,-209.79925123978308, 81.53102025891732, 480.6347467724183);
            that.addLight( 0.995, 0.5, 0.9,10.181158886939732, 82.0579577656412, 443.36209701988145);
            that.addLight( 0.995, 0.5, 0.9,140.74613456842795, 81.72415668088242, 264.3699878780052);
            that.addLight( 0.995, 0.5, 0.9,38.913794150479866, 81.851731583805, 266.3409889980046);
            that.addLight( 0.995, 0.5, 0.9,34.868418776388616, 81.69630859029459, 39.24833053757365);
            that.addLight( 0.995, 0.5, 0.9,140.8474519904044, 81.69173319584851 ,39.0134994512607);
            that.addLight( 0.995, 0.5, 0.9,138.40790709971276, 81.7079596377825, -182.06454187951798);
            that.addLight( 0.995, 0.5, 0.9,34.954388438383596, 81.71941963598533 ,-188.31166548879378);
            that.addLight( 0.995, 0.5, 0.9,35.399791138110785, 81.85910282577797, -427.84177481751703);
            that.addLight( 0.995, 0.5, 0.9,155.11964279018184, 81.46608502331338 ,-419.8168018060081);
            that.addLight( 0.995, 0.5, 0.9,-1453.9219890680256, 81.75151161475155 ,399.8924917015609);
            that.addLight( 0.995, 0.5, 0.9,-1314.5425467943473, 81.62851219667482, 400.08978583159177);
            that.addLight( 0.995, 0.5, 0.9,-1317.5224018748545, 81.75413747820778 ,184.86227391647475);
            that.addLight( 0.995, 0.5, 0.9,-1458.0683037217996, 81.65100051015844 ,190.6264390400229);
            that.addLight( 0.995, 0.5, 0.9,-1442.846227130375, 82.14464223094632 ,-2.7672535169318753);
            that.addLight( 0.995, 0.5, 0.9,-1319.3168515728275, 81.61491829711426, -5.023444869262587);
            that.addLight( 0.995, 0.5, 0.9,-1448.6707994475391, 81.68683719151551, -223.33335788727626);
            that.addLight( 0.995, 0.5, 0.9,-1325.3239616044746, 81.60998451604945, -223.3821253066494);
            that.addLight( 0.995, 0.5, 0.9,-1452.887365892277, 81.42291946921519, -427.4661176300626);
            that.addLight( 0.995, 0.5, 0.9,-1310.430440259239, 81.76679597487407, -420.02776854022824);
            that.addLight( 0.995, 0.5, 0.9,-1309.6949075709863, 81.54023131502998, -604.9924163705388);
            that.addLight( 0.995, 0.5, 0.9,-1552.504943063725, 81.40378693551948, -692.3719685934958);
            that.addLight( 0.995, 0.5, 0.9,-1553.4336229183484, 81.33883584451465, -875.2028126700487);
            that.addLight( 0.995, 0.5, 0.9,-1315.2389784052793, 81.34841643025402, -953.1746061137583);
            that.addLight( 0.995, 0.5, 0.9,-1166.79881575941, 81.36931495452562, -691.9022999440564);
            that.addLight( 0.995, 0.5, 0.9,-1167.155924684497, 81.82324397919801, -870.7578088287828);
            that.addLight( 0.995, 0.5, 0.9,-1016.5385930084025, 81.43105452301211, -692.1949033880109);
            that.addLight( 0.995, 0.5, 0.9,-1012.3859934768564, 81.79027884018113, -870.8784917353547);
            that.addLight( 0.995, 0.5, 0.9,-856.5193825791242, 81.78296676942375, -870.8931571474243);
            that.addLight( 0.995, 0.5, 0.9,-865.7657005761322, 81.53056894354873, -692.5856407182911);
            that.addLight( 0.995, 0.5, 0.9,-715.641361942548, 81.82594864424368, -693.3575041419546);
            that.addLight( 0.995, 0.5, 0.9,-695.0520498793784, 81.51768778700854, -871.7633917018757);
            that.addLight( 0.995, 0.5, 0.9,-553.1596461141204, 81.71758131110758, -871.097509421019);
            that.addLight( 0.995, 0.5, 0.9,-414.0860407873161, 81.3729068346401 ,-691.2953550294333);
            that.addLight( 0.995, 0.5, 0.9,-420.1043927815379, 81.41269168721281, -872.4524625681738);
            that.addLight( 0.995, 0.5, 0.9,-266.5079698894744, 81.47047040638992, -871.9981618185769);
            that.addLight( 0.995, 0.5, 0.9,-264.0497516946019, 81.66221557041163, -691.1650827764568);
            that.addLight( 0.995, 0.5, 0.9,-113.14081476382165, 81.44486919220634, -688.0536816477513);
            that.addLight( 0.995, 0.5, 0.9,-107.44531260914574, 81.47850248361273, -871.9340824050298);
            that.addLight( 0.995, 0.5, 0.9,248.00464308806045, 81.76805276486454, -687.1831297452572);
            that.addLight( 0.995, 0.5, 0.9,245.69721880339648, 81.83336740524186, -870.7211127795448);
            that.addLight( 0.995, 0.5, 0.9,401.52156751384933, 81.40007792124072, -685.570239386566);
            that.addLight( 0.995, 0.5, 0.9,427.0839093691552 ,81.88207704090752, -870.563638916839);
            that.addLight( 0.995, 0.5, 0.9,533.2651392696035, 81.37360493787882, -684.249271331774);
            that.addLight( 0.995, 0.5, 0.9,568.2953798841776 ,81.91318229154376, -870.46941511312);
            that.addLight( 0.995, 0.5, 0.9,677.6346610269729, 82.47664936075326, -699.3929035494475);
            that.addLight( 0.995, 0.5, 0.9,756.5572546289949 ,81.73460029477656, -871.0469921156033);
            that.addLight( 0.995, 0.5, 0.9, 868.3038961480402, 81.47267624538125, -697.07829652992);
            that.addLight( 0.995, 0.5, 0.9,987.417114868267, 81.68867880006906, -871.1995793553588);
            // that.addLight( 0.995, 0.5, 0.9,1046.6079480177673 81.40558334967622 -691.9946262636482);
            // that.addLight( 0.995, 0.5, 0.9,-1108.5976955542858, 20.194187691338033, 374.5239896833353);
            // that.addLight( 0.995, 0.5, 0.9,-1109.793569563247 ,20.100830854885174, 415.98151773660203);
            // that.addLight( 0.995, 0.5, 0.9,-881.6792997089422, 20.13631678506168, 406.4018370233074);
            // that.addLight( 0.995, 0.5, 0.9, -880.4387154854309, 20.218759994019784, 364.19950877516266);
            // that.addLight( 0.995, 0.5, 0.9, -715.9737674415452, 20.190533230009557, 405.77177992026196);
            // that.addLight( 0.995, 0.5, 0.9,-728.8885814032675 ,20.213975726917294, 450.904627616152);
            // that.addLight( 0.995, 0.5, 0.9, -564.838834369431, 20.144554013741278 ,503.22469458957613);
            // that.addLight( 0.995, 0.5, 0.9,-552.1947228719167, 20.137957243393917 ,459.0751499113856);
            // that.addLight( 0.995, 0.5, 0.9,-370.08975974712, 20.20485237957318 ,519.5674852915727);
            // that.addLight( 0.995, 0.5, 0.9,-382.5666749764453, 20.12395179610175, 563.8097499998921);
            // that.addLight( 0.995, 0.5, 0.9,-220.8152318791887, 20.16121935006704 ,618.8096702649937);
            // that.addLight( 0.995, 0.5, 0.9,-208.0724500850996, 20.145682094636992 ,574.9678654901571);
            // that.addLight( 0.995, 0.5, 0.9,-78.64547601335553, 20.19224959757015 ,617.9306488672794);
            // that.addLight( 0.995, 0.5, 0.9, -91.29822668406779, 20.15859825109133, 662.5204214284205);
            // that.addLight( 0.995, 0.5, 0.9,134.56451038073132, 20.1400582247652, 739.8010029954763);
            // that.addLight( 0.995, 0.5, 0.9,150.31863606553918 ,20.15109615247099, 693.8398291337032);
            // that.addLight( 0.995, 0.5, 0.9,293.474466444248, 20.146687215801474, 741.7518910071626);
            // that.addLight( 0.995, 0.5, 0.9,277.9583492434968, 20.123354850448077, 787.5049188115479);
            //
            // that.addLight( 0.995, 0.5, 0.9,-1898.7273215788034, 20.181770195134565, 919.1151961226741);
            // that.addLight( 0.995, 0.5, 0.9, -1911.055939209763, 2.25021521785915 ,958.6428013346442);
            // that.addLight( 0.995, 0.5, 0.9,-1731.3289726447404 ,20.189088594895495, 947.143425277409);
            // that.addLight( 0.995, 0.5, 0.9,-1731.9020453166947 ,20.103298762582984, 910.9276399915077);
            // that.addLight( 0.995, 0.5, 0.9,-1563.4872350213468, 20.150061989690048, 902.2839046833805);
            // that.addLight( 0.995, 0.5, 0.9,-1563.2567871879426, 20.044728039366934, 935.7642635068613);
            // that.addLight( 0.995, 0.5, 0.9,-1388.7012120594645, 20.14705355093065 ,924.479381856487);
            // that.addLight( 0.995, 0.5, 0.9, -1389.953611701437, 20.130890101432673, 893.7764440591168);
            // that.addLight( 0.995, 0.5, 0.9,-1199.5578588354185, 20.158363272476286, 883.2581647892621);
            // that.addLight( 0.995, 0.5, 0.9,-1196.8089622006396, 20.147215245657353 ,912.331301763516);
            // that.addLight( 0.995, 0.5, 0.9,-1014.833087545167 ,20.166669572826315, 874.2501514288738);
            // that.addLight( 0.995, 0.5, 0.9,-1011.6510444294619 ,20.128740440759262, 900.2596908645007);

            // var geometry = new THREE.SphereGeometry( 43, 20, 20 );//0.000008
            // var material = new THREE.MeshLambertMaterial ({color:'green',depthTest:true});
            // var sphere = new THREE.Mesh( geometry, material );
            // sphere.position.copy(new THREE.Vector3(1566.4890773232157, 82.08890234315359, 2478.4003244588844))
            // this.scene.add( sphere );

        }
    }

    traverseModel() {
        var that=this
        this.objScene.traverse(function (obj) {
            if(obj.name=='polySurface3686' || obj.name=='polySurface3686001'){//polySurface3686
                obj.material.color=new THREE.Color('#272727')
                // obj.material=new THREE.MeshPhysicalMaterial({
                //     color:'#272727',
                //
                // })
            }


            if(that.plArrNew.indexOf(obj.name)!=-1 || that.dimianObj.indexOf(obj.name)!=-1){  //
                if(obj.userData.oldmat){
                    obj.material=obj.userData.oldmat
                }
            }

            if(obj.name=='pCylinder300' || obj.name=='polySurface3685' || obj.name=='polySurface3663003'){  //polySurface2568
                // obj.layers.enable(0)
                // if(obj.userData.oldmat){
                //     obj.material=obj.userData.oldmat
                // }
                obj.material=new THREE.MeshLambertMaterial({color:'#f4f3eb'})
            }

            // if(obj.isMesh){
            //   console.log(obj) that.objScene
                obj.castShadow = false;
                obj.receiveShadow=false
            // }
        })
        // var that = this;
        
        // this.objScene.traverse(function (obj) {
        //   if(that.plArrNew.indexOf(obj.name)!=-1 || that.dimianObj.indexOf(obj.name)!=-1){  //
        //       if(obj.userData.oldmat){
        //           obj.material=obj.userData.oldmat
        //       }
        //   }

        //   if(obj.name=='pCylinder300' || obj.name=='polySurface3685' || obj.name=='polySurface3663003'){  //polySurface2568
        //       // obj.layers.enable(0)
        //       // if(obj.userData.oldmat){
        //       //     obj.material=obj.userData.oldmat
        //       // }
        //       obj.material=new THREE.MeshLambertMaterial({color:'#f4f3eb'})
        //   }
        //   if(obj.name === 'polySurface3688'){
        //       obj.material = new  THREE.MeshLambertMaterial({
        //           color:'gray',
        //           transparent:true,
        //           opacity:0.5,
        //           side:THREE.DoubleSide
        //       })
        //   }

        //   // if(obj.isMesh){
        //    //   console.log(obj) that.objScene
        //       obj.castShadow = true;
        //       obj.receiveShadow=true
        //   // }
        // })
    }

    traverseModel2() {
        this.objScene.traverse(function (obj) {
        // if(obj.isMesh){
        //   console.log(obj)
        obj.castShadow = false;
        obj.receiveShadow = false;
        // }
        });
    }

    addSpotLight() {
        var spotLight = new THREE.SpotLight(0xffffff, 1);
        spotLight.position.copy(new THREE.Vector3(-50, 192, -260));
        spotLight.angle = Math.PI / 2;
        spotLight.penumbra = 0.1; //半影
        spotLight.decay = 4; //衰退
        spotLight.distance = 280; //280;
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;
        spotLight.shadow.camera.near = 1;
        spotLight.shadow.camera.far = 500;
        spotLight.intensity = 5; //15.5
        spotLight.color.setHex(0xffffff);
        spotLight.shadow.camera.visible = true;
        var geometry = new THREE.SphereGeometry(8, 20, 20);
        var material = new THREE.MeshLambertMaterial({ color: "#5ebaff" });
        var sphere = new THREE.Mesh(geometry, material);
        this.scene.add(sphere);
        sphere.position.copy(new THREE.Vector3(-300, 62, -510));
        spotLight.target = sphere;
        this.scene.add(spotLight);
        spotLight.castShadow = true;
        spotLight.visible = true;

        var s2 = spotLight.clone();
        s2.decay = 1;
        s2.distance = 370;
        s2.position.copy(new THREE.Vector3(-300, 252, -160));
        var sphere2 = sphere.clone();
        sphere2.position.copy(-300, 62, -450);
        s2.target = sphere2;
        this.scene.add(s2);
        s2.castShadow = true;
        s2.visible = true;

        var s3 = s2.clone();
        s3.distance = 450;
        s3.position.copy(new THREE.Vector3(-700, 352, -360));
        var sphere3 = sphere.clone();
        sphere3.position.copy(-300, 2, -400);
        s3.target = sphere3;
        this.scene.add(s3);
        s3.castShadow = true;
        s3.visible = true;

        var s4 = s3.clone();
        s4.distance = 450;
        s4.position.copy(new THREE.Vector3(-150, 352, -660));
        var sphere4 = sphere.clone();
        sphere4.position.copy(-250, 2, -450);
        s4.target = sphere4;
        this.scene.add(s4);
        s4.castShadow = true;

        var s5 = s4.clone();
        s5.distance = 370;
        s5.position.copy(new THREE.Vector3(150, 352, -460));
        var sphere5 = sphere.clone();
        sphere5.position.copy(-250, 2, -450);
        s5.target = sphere5;
        this.scene.add(s5);
        s5.castShadow = true;
        s5.visible = true;

        var s = sphere.clone();
        s.material = new THREE.MeshBasicMaterial({ color: "red" });
        s.position.copy(new THREE.Vector3(-700, 352, -360));
        this.scene.add(s);
    }

    initPointLight() {
        var sphere = new THREE.SphereBufferGeometry(8, 16, 8);
        var point = new THREE.PointLight(0xffffff, 2.0, 350); //'#001c3e'   '#03dbff'
        point.name = "pointLight1";
        point.add(
        new THREE.Mesh(
            sphere,
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        )
        );
        point.position.copy(new THREE.Vector3(-350, 262, -260));
        this.scene.add(point);

        var point2 = point.clone();
        this.scene.add(point2);
        point2.name = "pointLight1";
        point2.position.copy(new THREE.Vector3(-50, 192, -260));

        var point3 = point.clone();
        this.scene.add(point3);
        point3.name = "pointLight1";
        point3.position.copy(new THREE.Vector3(-220, 62, -260));

        var point4 = point.clone();
        this.scene.add(point4);
        point4.name = "pointLight1";
        point4.position.copy(new THREE.Vector3(-220, 62, -510));

        var point5 = point.clone();
        this.scene.add(point5);
        point5.name = "pointLight1";
        point5.position.copy(new THREE.Vector3(-350, 262, -510));

        var point6 = point.clone();
        this.scene.add(point6);
        point6.name = "pointLight1";
        point6.position.copy(new THREE.Vector3(-50, 192, -510));

        var point7 = point.clone();
        this.scene.add(point7);
        point7.name = "pointLight1";
        point7.position.copy(new THREE.Vector3(90, 82, -400));

        var point8 = point.clone();
        this.scene.add(point8);
        point8.name = "pointLight1";
        point8.position.copy(new THREE.Vector3(-470, 162, -400));
    }

    addBorderLine2(obj) {
        var that = this;
        // if(!this.isFirstShowTrans2){
        //
        // }
        obj.traverse(function (object) {
        if (
            object.type === "Mesh" &&
            that.mainBuildnames.indexOf(object.name) == -1
        ) {
            // 设置模型边线

            var edges = new THREE.EdgesGeometry(object.geometry, 50);
            var edgesMaterial = new THREE.LineBasicMaterial({
            color: "#ffffff", //081a7b
            });
            var line = new THREE.LineSegments(edges, edgesMaterial);
            object.add(line);
            line.layers.enable(1); //
            line.name = "lineGL95";
        }
        });
    }

    addBorderLine(obj2) {
        obj2.traverse(function (obj) {
        if (obj.isMesh) {
            var edges = new THREE.EdgesGeometry(obj.geometry, 50);
            var linegeometry = new LineSegmentsGeometry();
            var pointArr = [];
            var pos = edges.attributes.position;
            for (let i = 0; i < edges.attributes.position.count; i++) {
            pointArr.push(pos.getX(i), pos.getY(i), pos.getZ(i));
            }
            linegeometry.setPositions(pointArr);
            var material7 = new LineMaterial({
            color: 0xffffff,
            // 线宽度
            linewidth: 2, //线宽
            });
            material7.resolution.set(window.innerWidth, window.innerHeight);
            var line = new LineSegments2(linegeometry, material7);
            obj.add(line);
            line.layers.enable(1); //
            line.name = "lineGL95";
        }
        });
    }

    deleteObj(obj) {
        if (obj) {
        this.scene.remove(obj);
        obj.traverse(function (obj2) {
            if (obj2.isMesh || obj2.isPoints) {
            obj2.geometry.dispose();
            obj2.material.dispose();
            }
        });
        }
    }

    getTexture(pic) {
        var texture = new THREE.TextureLoader().load(pic);
        return texture;
    }

    rangeSky(str) {
        var that = this;
        if (!that.sphereSky) {
        that.scene.background = new THREE.Color(0x101010);
        const panoSphereGeo = new THREE.SphereGeometry(50000, 100, 100); //500000
        const panoSphereMat = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            // displacementScale: - 4.0
        });
        this.sphereSky = new THREE.Mesh(panoSphereGeo, panoSphereMat);
        this.sphereSky.name = "sphereSky";
        const manager = new THREE.LoadingManager();
        const loader = new THREE.TextureLoader(manager);
        loader.load("assets/img/publicpic/" + str, function (texture) {
            // 'assets/img/publicpic/yg2.jpg'
            // texture.minFilter = THREE.NearestFilter;
            // texture.generateMipmaps = false;
            that.sphereSky.material.map = texture;
        });
        manager.onLoad = function () {
            that.scene.add(that.sphereSky);
        };
        } else {
        const manager = new THREE.LoadingManager();
        const loader = new THREE.TextureLoader(manager);
        loader.load("assets/img/publicpic/" + str, function (texture) {
            // 'assets/img/publicpic/yg2.jpg'
            texture.minFilter = THREE.NearestFilter;
            texture.generateMipmaps = false;
            that.sphereSky.material.map = texture;
        });
        }
    }

    getShaderMat(highV, mixV) {
        // debugger
        const shader1 = {
        vertexShader: `
            varying vec2 vUv;
            varying float v_py;
            varying float v_pz;
            varying float a1;
            uniform float highVal;
            
    
            void main() {
                vUv = uv;
                v_py = position.y;
                v_pz=position.z;
                
                vec4 worldPos=modelViewMatrix * vec4(position, 1.0);
                // a1=pow(worldPos.y/highVal,1);
                //   a1=position.y/highVal;
                a1=worldPos.y/highVal;
                    
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                } `,
        fragmentShader: ` // 根据片元的高度来渐变
            varying vec2 vUv;
            varying float v_py;
            varying float v_pz;
            varying float a1;
            uniform float mixVal;
            uniform vec3 _FarColor; 
            
            void main(){
                gl_FragColor=vec4(1.0,1.0,1.0,a1);
                // gl_FragColor = mix(vec4(1.0,1.0,1.0,a1),vec4(1.0,1.0,1.0,1.0),mixVal);
                // gl_FragColor = mix(vec4(1.0,1.0,1.0,a1),vec4(_FarColor.r,_FarColor.g,_FarColor.b,1.0),mixVal);
            } `,
        };

        var ShaderBar1 = {
        uniforms: {
            highVal: { value: highV }, //#001327
            mixVal: { value: mixV },
            _FarColor: { value: new THREE.Color("#020214") },
        },
        vertexShader: shader1.vertexShader,
        fragmentShader: shader1.fragmentShader,
        };

        let option6 = {
        material: new THREE.ShaderMaterial({
            uniforms: ShaderBar1.uniforms,
            vertexShader: ShaderBar1.vertexShader,
            fragmentShader: ShaderBar1.fragmentShader,
            // blending: THREE.MultiplyBlending,
            blending: THREE.NormalBlending,
            transparent: true,
            depthTest: true,
            side: THREE.DoubleSide,
            opacity: 0.5,
        }),
        };

        return option6;
    }

    getShaderMat2(highVal, tex) {
        const shader1 = {
        vertexShader: `
            varying vec2 vUv;
            varying float v_py;
            varying float v_pz;
            varying float a1;
            uniform float highVal;
            
            void main() {
                vUv = uv;
                v_py = position.y;
                v_pz=position.z;
                
                vec4 worldPos=modelViewMatrix * vec4(position, 1.0);
                // a1=pow(worldPos.y/highVal,1);
                    a1=worldPos.y/highVal;
                    
                
                    
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                } `,
        fragmentShader: ` // 根据片元的高度来渐变
            varying vec2 vUv;
            varying float v_py;
            varying float v_pz;
            varying float a1;
            uniform sampler2D texture1;
            
            void main(){
                
                gl_FragColor = mix(texture2D(texture1,vUv),mix(vec4(1.0,1.0,1.0,a1),vec4(0.0,0.0,1.0,1.0),0.6),0.7);
            } `,
        };

        var ShaderBar1 = {
        uniforms: {
            highVal: { value: 590.0 }, //#001327
            texture1: { value: tex },
        },
        vertexShader: shader1.vertexShader,
        fragmentShader: shader1.fragmentShader,
        };

        let option6 = {
        material: new THREE.ShaderMaterial({
            uniforms: ShaderBar1.uniforms,
            vertexShader: ShaderBar1.vertexShader,
            fragmentShader: ShaderBar1.fragmentShader,
            // blending: THREE.MultiplyBlending,
            // blending:THREE.NormalBlending,
            transparent: false,
            depthTest: true,
            side: THREE.DoubleSide,
            opacity: 1.0,
        }),
        };

        return option6;
    }

    /*蓝色科技感 */
    getShaderMat3() {
        var that = this;
        // debugger
        const shader1 = {
        vertexShader: `
            varying vec2 vUv;
            varying float v_px;
            varying float v_py;
            varying float v_pz;
            varying vec4 outcolor;
            uniform float _Distance;
            uniform vec3 _NearColor; 
            uniform vec3 _FarColor; 
    
            void main() {
                vUv = uv;
                v_px = position.x;
                v_py = position.y;
                v_pz=position.z;
                // vec4 worldpos=modelViewMatrix * vec4(position, 1.0);
                    vec4 worldpos= vec4(position, 1.0);
                float jl=length(worldpos.xyz);
                if(jl<_Distance){
                    outcolor=vec4(0.0,0.0,0.25,1.0-0.2);
                }
                
                if(jl>_Distance && jl<(_Distance+20.0)){
                    float j2=jl-_Distance;
                    float alpha=1.0-j2/(_Distance+20.0);
                    outcolor=vec4(0.0,0.0,0.5,1.0*alpha);
                }       
                    
                if(jl>(_Distance+20.0)){
                    outcolor=vec4(_FarColor.r,_FarColor.g,_FarColor.b,1.0);
                } 
                    
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                } `,
        fragmentShader: ` // 根据片元的高度来渐变
            varying vec2 vUv;
            varying float v_px;
            varying float v_py;
            varying float v_pz;
            varying vec4 outcolor;
            
            void main(){
                gl_FragColor=outcolor.rgba;
            } `,
        };

        var ShaderBar1 = {
        uniforms: {
            _Distance: { value: 5.0 },
            _NearColor: { value: new THREE.Color("#5a62f8") },
            _FarColor: { value: new THREE.Color("#020214") },
        },
        vertexShader: shader1.vertexShader,
        fragmentShader: shader1.fragmentShader,
        };

        let option6 = {
        material: new THREE.ShaderMaterial({
            uniforms: ShaderBar1.uniforms,
            vertexShader: ShaderBar1.vertexShader,
            fragmentShader: ShaderBar1.fragmentShader,
            // blending: THREE.MultiplyBlending,
            // blending:THREE.NormalBlending,
            transparent: false,
            depthTest: true,
            side: THREE.DoubleSide,
            opacity: 1.0,
        }),
        };

        return option6;
    }

    hideObj(str){
        var that=this
        switch (str) {
            case 'Yg':
            that.scene.traverse(function (obj) {
                    if(obj.name){
                        if(obj.name=='topplane' || obj.name=='wdobj' || obj.name=='lineGL95' || obj.name=='lumian' || obj.name=='lumian2' || obj.name=='ksb' || obj.name=='weiqiang3' || obj.name=='ld' || obj.name=='yjgx' || obj.name=='yjlx'|| obj.name=='rainMesh1'|| obj.name=='snowMesh1' || obj.name=='yd' || obj.name=='wdyd' || obj.name=='polySurface2250' || that.plArrNew_YJ.includes(obj.name)){   //polySurface2250_001
                            obj.visible=false
                        }

                        if(that.plArrNew.includes(obj.name) || obj.name=='c01' || obj.name=='polySurface19494'){
                            obj.visible=true
                        }

                    }
                })
                break;
            case 'Xy':
                that.scene.traverse(function (obj) {
                    if(obj.name){
                        if(obj.name=='wdobj' || obj.name=='lineGL95' || obj.name=='lensf1' || obj.name=='lumian' || obj.name=='ksb' || obj.name=='weiqiang3' || obj.name=='ld' || obj.name=='yjgx' || obj.name=='yjlx' || obj.name=='snowMesh1' || obj.name=='Mesh_0' || obj.name=='Mesh_1'|| obj.name=='Mesh_2' || obj.name=='Mesh_3' || obj.name=='Mesh_4'|| obj.name=='Mesh_5' || obj.name=='yd' || obj.name=='wdyd' || obj.name=='polySurface2250' || obj.name=='polySurface2250_001' ){
                            obj.visible=false
                        }


                        // if(obj.name=='polySurface2186'){
                        //     if(obj.userData.oldmat){
                        //         obj.material=obj.userData.oldmat
                        //     }
                        // }

                        // if(obj.name=='rainMesh1'){
                        //     obj.visible=true
                        // }
                    }
                })
                break;
            case 'Xx':
                that.scene.traverse(function (obj) {
                    if(obj.name){
                        if(obj.name=='lineGL95' || obj.name=='lumian' || obj.name=='ksb' || obj.name=='weiqiang3' || obj.name=='ld' || obj.name=='yjgx' || obj.name=='yjlx' || obj.name=='rainMesh1'){
                            obj.visible=false
                        }
                        // if(obj.name=='polySurface881'){
                        //     if(obj.userData.oldmat){
                        //         obj.material=obj.userData.oldmat
                        //     }
                        // }
                        if(obj.name=='snowMesh1'){
                            obj.visible=true
                        }
                    }
                })
                break;
            case 'Yj':
                that.scene.traverse(function (obj) {
                    if(obj.userData.oldmat){
                        obj.material=obj.userData.oldmat
                    }
                    if(obj.name){
                        if(obj.name=='lineGL95' || obj.name=='rainMesh1' || obj.name=='snowMesh1' || obj.name=='c01'  || obj.name=='lumian2')//  || obj.name=='polySurface19494'           || that.plArrNew.includes(obj.name)
                        {
                            obj.visible=false
                        }

                        // if(that.plArrNew.includes(obj.name)){
                        //     if(['pCube1653','objobjobjobjobjobjobjobjpolySurface2194','polySurface2580'].indexOf(obj.name)==-1){
                        //         obj.visible=false
                        //     }
                        // }

                        // if(obj.name=='rainMesh1'){
                        //     if(that.groupRain){
                        //         that.deleteObj(this.groupRain)
                        //         that.groupRain=null
                        //     }
                        // }
                        // if( obj.name=='snowMesh1'){
                        //     if(that.snowMesh){
                        //         that.deleteObj(this.snowMesh)
                        //         that.snowMesh=null
                        //     }
                        // }

                        if(obj.name=='topplane' || obj.name=='wdobj' || obj.name=='lumian' || obj.name=='ld' || obj.name=='yjgx' || obj.name=='yjlx' || obj.name=='yd' || obj.name=='wdyd' || obj.name=='polySurface22698' || that.plArrNew_YJ.includes(obj.name)){  // polySurface2250_001
                            obj.visible=true
                            // that.YjObjs.push(obj)
                        }

                        if(obj.name=='pCylinder300' || obj.name=='polySurface3685' || obj.name=='polySurface3663003'){
                            obj.material=new THREE.MeshBasicMaterial({
                                color:"#4f4e2b",   //585727   595819
                                side:THREE.DoubleSide
                            })
                            obj.layers.enable(1)
                        }

                        // if(obj.name=='polySurface2186'){
                        //     if(obj.userData.oldmat){
                        //         obj.material=obj.userData.newmat
                        //
                        //     }
                        // }
                    }
                })
                break;
            case 'My':
                that.scene.traverse(function (obj) {
                    if(obj.name){
                        if(obj.name=='lineGL95' || obj.name=='lumian' || obj.name=='weiqiang3' || obj.name=='ksb' || obj.name=='rainMesh1' || obj.name=='snowMesh1'){
                            obj.visible=false
                        }
                        if(obj.name=='ld'){
                            obj.visible=true
                        }
                    }
                })
                break;
            case 'kj':
                that.scene.traverse(function (obj) {
                    if(obj.name){
                        // if(obj.name=='polySurface2250'){
                        //     obj.material=that.lfgxMat
                        //     obj.layers.enable(1)
                        //     obj.visible=true
                        // }
                        //


                        if(['yjgx','ld','yd','wdyd','polySurface2250','polySurface2250_001','carGroup','lumian'].indexOf(obj.name)!=-1){  // 'lumian',
                            obj.visible=false
                        }

                        if(['yjlx','lumian2'].indexOf(obj.name)!=-1){
                            obj.visible=true
                        }
                    }
                })
            default:
                break;
        }
    }
  
    initRoof2(){
          var that=this
  
  
          var geometry = new THREE.PlaneGeometry( 202.9,400 );   // 202.9,640
          const shader1 =  {
              vertexShader:`
                  varying vec2 vUv;
                  varying float v_py;
                  varying float v_pz;
                 
                  
                  void main() {
                      vUv = uv;
                      v_py = position.y;
                      v_pz=position.z;
                      
                      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                   } `,
              fragmentShader: ` // 根据片元的高度来渐变
                  varying vec2 vUv;
                  varying float v_py;
                  varying float v_pz;
                  uniform vec3 color;
                
                  void main(){
                      vec4 color1=vec4(0.,0.,0.,0.);
                      float bl=pow((1.0-vUv.y),3.3);  //1.8
                      // float bl=(1.0-vUv.y);
                      
                      if(vUv.x>0.0 && vUv.x<0.025){
                          color1=vec4(1.0,1.0,1.0,0.1*bl);
                          
                      }
                      if(vUv.x>0.05 && vUv.x<0.075){
                          color1=vec4(1.0,1.0,1.0,0.1*bl);
                      }
                      if(vUv.x>0.1 && vUv.x<0.125){
                          color1=vec4(1.0,1.0,1.0,0.1*bl);
                      }
                      if(vUv.x>0.15 && vUv.x<0.175){
                          color1=vec4(1.0,1.0,1.0,0.1*bl);
                      }
                      if(vUv.x>0.2 && vUv.x<0.225){
                          color1=vec4(1.0,1.0,1.0,0.1*bl);
                      }
                      if(vUv.x>0.25 && vUv.x<0.275){
                         color1=vec4(1.0,1.0,1.0,0.1*bl);
                      }
                      if(vUv.x>0.3 && vUv.x<0.325){
                         color1=vec4(1.0,1.0,1.0,0.1*bl);
                      }
                      if(vUv.x>0.35 && vUv.x<0.375){
                         color1=vec4(1.0,1.0,1.0,0.1*bl);
                      }
                      if(vUv.x>0.4 && vUv.x<0.425){
                         color1=vec4(1.0,1.0,1.0,0.1*bl);
                      }
                      if(vUv.x>0.45 && vUv.x<0.475){
                         color1=vec4(1.0,1.0,1.0,0.1*bl);
                      }
                      if(vUv.x>0.5 && vUv.x<0.525){
                         color1=vec4(1.0,1.0,1.0,0.1*bl);
                      }
                      if(vUv.x>0.55 && vUv.x<0.575){
                         color1=vec4(1.0,1.0,1.0,0.1*bl);
                      }
                      if(vUv.x>0.6 && vUv.x<0.625){
                         color1=vec4(1.0,1.0,1.0,0.1*bl);
                      }
                      if(vUv.x>0.65 && vUv.x<0.675){
                         color1=vec4(1.0,1.0,1.0,0.1*bl);
                      }
                      if(vUv.x>0.7 && vUv.x<0.725){
                         color1=vec4(1.0,1.0,1.0,0.1*bl);
                      }
                      if(vUv.x>0.75 && vUv.x<0.775){
                         color1=vec4(1.0,1.0,1.0,0.1*bl);
                      }
                      if(vUv.x>0.8 && vUv.x<0.825){
                         color1=vec4(1.0,1.0,1.0,0.1*bl);
                      }
                      if(vUv.x>0.85 && vUv.x<0.875){
                         color1=vec4(1.0,1.0,1.0,0.1*bl);
                      }
                      if(vUv.x>0.9 && vUv.x<0.925){
                         color1=vec4(1.0,1.0,1.0,0.1*bl);
                      }
                      if(vUv.x>0.95 && vUv.x<0.975){
                         color1=vec4(1.0,1.0,1.0,0.1*bl);
                      }
                
                      
                      // gl_FragColor=color1.rgba;
                      // gl_FragColor=mix(color1.rgba,vec4(1.0,1.0,1.0,bl),0.5);
                      
                      // if(bl<0.1){
                      //     discard;
                      // }
                      
                      gl_FragColor=vec4(color.r,color.g,color.b,bl);
                  } `
          }
  
          that.ShaderBar1_p = {
              uniforms: {
                  color: {
                      value: new THREE.Color(that.gxColors[0])
                  },
              },
              vertexShader: shader1.vertexShader,
              fragmentShader: shader1.fragmentShader
          }
  
          let option6 = {
              material: new THREE.ShaderMaterial({
                  uniforms: that.ShaderBar1_p.uniforms,
                  vertexShader: that.ShaderBar1_p.vertexShader,
                  fragmentShader: that.ShaderBar1_p.fragmentShader,
                  // blending: THREE.MultiplyBlending,
                  blending:THREE.NormalBlending,
                  // blending:THREE.AdditiveBlending,
                  // blending:THREE.NoBlending,
                  transparent: true,
                  depthTest: true,
                  side: THREE.BackSide,
  
                  // opacity:0.0
              })
          };
  
          var material=option6.material
  
          // var material2=new THREE.MeshPhysicalMaterial({
          //     roughness:0,
          //     metalness:0,
          //     envMapIntensity:0,
          //     transmission:1.0,
          //     transparent:true,
          //     opacity:0.3,
          //     color:'#fff',
          //     side: THREE.DoubleSide
          // })
  
          var material2=new THREE.MeshLambertMaterial({
              transparent:true,
              opacity:0.3,
              color:'#494140'
          })
  
          // var material2=new THREE.MeshPhongMaterial({
          //     color:'#f1ef72',
          //     specular:0x444444,//高光(镜面反射)部分的颜色
          //     shininess:1,//高光部分的亮度，默认30
          //     transparent:true,
          //     opacity:0.3,
          // })
  
          // var material2=new THREE.MeshStandardMaterial({
          //     transparent:true,
          //     opacity:0.1,
          //     side:THREE.DoubleSide,
          //     // emissive:'#000'
          //     roughness:0,
          //     metalness:0.0,
          //
          // })
          // material2.color.setRGB(0.665386974811554,0.6653873324394226,0.8227859139442444)
  
          // var material2=new THREE.MeshBasicMaterial({
          //     transparent:true,
          //     opacity:0,
          //     side:THREE.DoubleSide,
          //     depthWrite: false
          // })
  
  
  
  
          var plane = new THREE.Mesh( geometry, material );
          this.scene.add( plane );
          plane.rotateY(Math.PI)
          // plane.renderOrder=1
          plane.position.x-=580-1.1
          plane.position.y+=655+155
          plane.position.z-=250-0.5+5      // 250-0.5
          plane.name='wdobj'
          plane.visible=false
          // plane.layers.enable(1)
          that.wdobjArr1.push(plane)
  
          var plane2=plane.clone()
          this.scene.add(plane2)
          plane2.rotateY(Math.PI)
          plane2.position.copy(plane.position.clone())
          plane2.position.z-=212.5-10         // z-=212.5-10
          plane2.name='wdobj'
          plane2.visible=false
          that.wdobjArr1.push(plane2)
  
          var plane3=plane2.clone()
          this.scene.add(plane3)
          plane3.rotateY(-Math.PI/2)
          plane3.position.copy(plane2.position.clone())
          plane3.position.z+=106+0.1-5            // 106+0.1
          plane3.position.x+=107-0.5-5          // 107-0.5
          plane3.name='wdobj'
          plane3.visible=false
          that.wdobjArr1.push(plane3)
  
          var plane4=plane3.clone()
          this.scene.add(plane4)
          plane4.rotateY(Math.PI)
          plane4.position.copy(plane3.position.clone())
          plane4.position.x-=203.07    // 202.7
          plane4.name='wdobj'
          plane4.visible=false
          that.wdobjArr1.push(plane4)
  
  
  
  
  
  
  
  
  
          // var h1=new VertexNormalsHelper(plane4, 30, 0xfff000)
          // console.log(h1)
          // this.scene.add(h1);
          //
          // debugger
          // var v3_2=new THREE.Vector3(h1.geometry.attributes.position.array[0],h1.geometry.attributes.position.array[1],h1.geometry.attributes.position.array[2])
          // var v3_1=new THREE.Vector3(h1.geometry.attributes.position.array[3],h1.geometry.attributes.position.array[4],h1.geometry.attributes.position.array[5])
          //
  
  
  
  
          // var vec1=v3_1.sub(v3_2)
          // var vec2=that.camera.position.clone().sub(v3_1)
          // var angle=vec1.angleTo(vec2)
          // var degrees=angle*180/Math.PI
          // console.log('zzzzzzzzzzzzzzzzzzzzzzz')
          // console.log(degrees)
          // console.log('zzzzzzzzzzzzzzzzzzzzzzz')
  
          // var geosp = new THREE.SphereGeometry(1.5, 5, 5);
          // var matsp=new THREE.MeshBasicMaterial({
          //     color:'lightgreen'
          // })
          // var meshsp=new THREE.Mesh(geosp,matsp)
          // meshsp.position.copy(new THREE.Vector3(v3_2.x,v3_2.y,v3_2.z))
          // this.scene.add(meshsp)
          //
          // var meshsp2=meshsp.clone()
          // meshsp2.material=new THREE.MeshBasicMaterial({
          //     color:'red'
          // })
          // this.scene.add(meshsp2)
          // meshsp.position.copy(new THREE.Vector3(v3_1.x,v3_1.y,v3_1.z))
  
  
  
          // var plane2=plane.clone()
          // this.scene.add(plane2)
          // plane2.position.copy(plane.position.clone())
          // plane2.position.z-=212.5-10         // z-=212.5-10
          // plane2.name='wdobj'
          // plane2.visible=false
          //
          // var plane3=plane2.clone()
          // this.scene.add(plane3)
          // plane3.position.copy(plane2.position.clone())
          // plane3.rotateY(Math.PI/2)
          // plane3.position.z+=106+0.1-5            // 106+0.1
          // plane3.position.x+=107-0.5-5          // 107-0.5
          // plane3.name='wdobj'
          // plane3.visible=false
          //
          // var plane4=plane3.clone()
          // this.scene.add(plane4)
          // plane4.position.copy(plane3.position.clone())
          // plane4.position.x-=212.7-10    // 212.7
          // plane4.name='wdobj'
          // plane4.visible=false
  
  
  
    }
  
    initRoof() {
    // debugger
    var that = this;
    // obj.material=that.getShaderMat(590,0.6).material
    var c = [
        -471.7621230520307, -251.34576641387287, -683.951922748962,
        -248.8927082962257, -687.3628589278355, -459.72563644101433,
        -473.96091361529295, -463.52545569649624, -471.7621230520307,
        -251.34576641387287,
    ];

    var geometry = new THREE.BufferGeometry(); //声明一个空几何体对象
    var posArr = [];
    var h = 160; //围墙拉伸高度
    for (var i = 0; i < c.length - 2; i += 2) {
        // 三角形1  三个顶点坐标
        posArr.push(
        c[i],
        c[i + 1],
        0,
        c[i + 2],
        c[i + 3],
        0,
        c[i + 2],
        c[i + 3],
        h
        );
        // 三角形2  三个顶点坐标
        posArr.push(
        c[i],
        c[i + 1],
        0,
        c[i + 2],
        c[i + 3],
        h,
        c[i],
        c[i + 1],
        h
        );
    }
    // 设置几何体attributes属性的位置position属性
    geometry.attributes.position = new THREE.BufferAttribute(
        new Float32Array(posArr),
        3
    );

    var posAtt = geometry.attributes.position; //几何体顶点位置缓冲对象
    var num = geometry.attributes.position.count; //几何体顶点数量
    var alphaArr = []; //每个顶点创建一个透明度数据(随着高度渐变)
    for (var i = 0; i < num; i++) {
        // 线性渐变
        alphaArr.push(1 - posAtt.getZ(i) / h);
    }
    geometry.setAttribute(
        "alpha",
        new THREE.BufferAttribute(new Float32Array(alphaArr), 1)
    );

    const shader1 = {
        vertexShader: `
            varying vec2 vUv;
            varying float v_py;
            varying float v_pz;
            attribute float alpha;
            varying float vAlpha;
            

            void main() {
                vUv = uv;
                v_py = position.y;
                v_pz=position.z;
                vAlpha=alpha;
                
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            } `,
        fragmentShader: ` // 根据片元的高度来渐变
            varying vec2 vUv;
            varying float v_py;
            varying float v_pz;
            varying float vAlpha;
        
        
        
            void main(){
                //gl_FragColor=vec4(1.0,1.0,1.0,vAlpha); //vec4(1.0,1.0,1.0,vUv.x);
                gl_FragColor=vec4(1.0,1.0,1.0,vUv.y);
            } `,
    };

    var ShaderBar1 = {
        uniforms: {},
        vertexShader: shader1.vertexShader,
        fragmentShader: shader1.fragmentShader,
    };

    let option6 = {
        material: new THREE.ShaderMaterial({
        uniforms: ShaderBar1.uniforms,
        vertexShader: ShaderBar1.vertexShader,
        fragmentShader: ShaderBar1.fragmentShader,
        // blending: THREE.MultiplyBlending,
        blending: THREE.NormalBlending,
        transparent: true,
        depthTest: true,
        side: THREE.DoubleSide,
        opacity: 0.5,
        }),
    };

    var material = option6.material;

    var mesh = new THREE.Mesh(geometry, material);
    mesh.rotateX(-Math.PI / 2);
    that.scene.add(mesh);
    mesh.position.x += 0;
    mesh.position.y += 540;
    mesh.position.z -= 710;
    }
  
    addLightTransForm4(){
    var that=this

    this.lfgxMat=new THREE.MeshBasicMaterial({
        color:"#e9edf0",
        side:THREE.DoubleSide
    })

    that.scene.traverse(function (obj) {
        // alert('bvbbbbbbbbbbbbbbbbbbbb')
        if(obj.name){
            if(obj.name=='polySurface22705'){//polySurface2250  polySurface2250_001    polySurface22698  polySurface22705
                // obj.scale.set(5,5,5)
                //  alert('bvbbbbbbbbbbbbbbbbbbbb')
                // debugger
                obj.material=that.lfgxMat
                obj.layers.enable(1)
                // obj.visible=false
            }

            // if(obj.name=='pCylinder300' || obj.name=='polySurface3685' || obj.name=='polySurface3663003'){
            //     if(!obj.userData.oldmat){
            //         obj.userData.oldmat=obj.material.clone()
            //     }
            //     obj.layers.enable(1)
            // }
        }
    })
    }
  
    initVisible() {
    var that = this;
    // debugger
    var road = this.scene.getObjectByName("c01");
    if (road) {
        // road.material.depthTest=false
    }

    // that.objScene.visible=false
    var allObjs = this.plArrNew.concat(this.plBan);
    }
  
    initHuiGuang(){
    var that=this
    // this.renderScene = new RenderPass(this.scene,this.camera);
    // this.bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    // this.bloomPass.threshold = 0.2
    // this.bloomPass.strength = 1.5;
    // this.bloomPass.radius = 0.4
    // this.composer = new EffectComposer(this.renderer);
    // this.composer.renderToScreen = false;
    // this.composer.addPass( this.renderScene );
    // this.composer.addPass( this.bloomPass );
    // this.finalPass = new ShaderPass(
    //     new THREE.ShaderMaterial( {
    //         uniforms: {
    //             baseTexture: { value: null },
    //             bloomTexture: { value: that.composer.renderTarget2.texture }
    //         },
    //         vertexShader: document.getElementById( 'vertexshader' ).textContent,
    //         fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
    //         defines: {}
    //     } ), 'baseTexture'
    // );
    // this.finalPass.needsSwap = true;
    // this.finalPass.renderToScreen=true
    // this.finalComposer = new EffectComposer( this.renderer );
    // this.finalComposer.addPass( this.renderScene );
    // this.finalComposer.addPass( this.finalPass );


    const pixelRatio = this.renderer.getPixelRatio();
    let renderTarget = new THREE.WebGLRenderTarget(
        window.innerWidth * pixelRatio,
        window.innerHeight * pixelRatio,
        {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            stencilBuffer: false,
            type: THREE.FloatType,
        }
    );
    renderTarget.texture.name = "EffectComposer.rt1"
    this.composer = new EffectComposer(this.renderer,renderTarget);
    this.composer.setPixelRatio(window.devicePixelRatio);
    this.composer.setSize(window.innerWidth, window.innerHeight);

    this.renderScene = new RenderPass(this.scene,this.camera);
    this.bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    this.bloomPass.threshold = 0.2;
    this.bloomPass.strength = 1.5;//1.5
    this.bloomPass.radius = 0.4  //0.4;

    let effectFXAA = new ShaderPass(FXAAShader);
    effectFXAA.uniforms["resolution"].value.set(
        1 / (window.innerWidth*3),
        1 / (window.innerHeight*3)
    );
    // effectFXAA.uniforms["resolution"].value.set(
    //     new THREE.Vector2(1 / window.innerWidth,1 / window.innerHeight)
    // );
    effectFXAA.renderToScreen = true;
    // 去掉条带
    let ssaaRenderPass = new SSAARenderPass(this.scene,this.camera);
    ssaaRenderPass.sampleLevel = 1;
    ssaaRenderPass.unbiased = true;

    // let ssaaRenderPass = new TAARenderPass(this.scene,this.camera);
    // ssaaRenderPass.sampleLevel = 1;

    this.composer.renderToScreen = false;
    this.composer.addPass( this.renderScene );
    // this.composer.addPass( ssaaRenderPass );
    this.composer.addPass( this.bloomPass );
    this.composer.addPass( effectFXAA );
    this.finalPass = new ShaderPass(
        new THREE.ShaderMaterial( {
            uniforms: {
                baseTexture: { value: null },
                bloomTexture: { value: this.composer.renderTarget2.texture }
            },
            vertexShader: document.getElementById( 'vertexshader' ).textContent,
            fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
            defines: {}
        } ), 'baseTexture'
    );
    this.finalPass.needsSwap = true;
    this.finalPass.renderToScreen=true
    this.finalComposer = new EffectComposer( this.renderer );
    this.finalComposer.addPass( this.renderScene );
    this.finalComposer.addPass( this.finalPass );
    // this.finalComposer.addPass( ssaaRenderPass );
    this.finalComposer.addPass( effectFXAA );
    }

    changeObjMat(){
        var that=this
        
        // debugger
        var dimian=this.scene.getObjectByName("地形_马路018")
        // if(dimian){
            var planegeo=new THREE.PlaneGeometry(10000,10000)    //100000
            // var meshplan=new THREE.Mesh(planegeo,dimian.material.clone());
            that.meshplan=new THREE.Mesh(planegeo,new THREE.MeshBasicMaterial({color:'#a0a1a3',side:THREE.DoubleSide,transparent:false}));  //aacbea
            this.scene.add(that.meshplan);
        that.meshplan.rotateX(Math.PI/2)
        that.meshplan.position.y-=50
        that.meshplan.name='mianban'
            // meshplan.visible=false
    


        
        // 白模建筑 name 
        let bmNames = ['polySurface217','polySurface353']
        for(let i=0;i<bmNames.length;i++){
            var object=this.scene.getObjectByName(bmNames[i])//  polySurface3750   polySurface3688
            object.material = new THREE.MeshLambertMaterial({
                color: "#737476", //批量设置颜色
                transparent: true,//允许透明计算
                opacity: 0.4,//半透明设置
            })
            // 设置模型边线
            var edges = new THREE.EdgesGeometry(object.geometry, 50);
            var edgesMaterial = new THREE.LineBasicMaterial({
                color:'#58595a',
                transparent:true,
                opacity:0.4
            });
            var line = new THREE.LineSegments(edges, edgesMaterial);
            object.add(line);
            line.layers.enable(0)
        }

       

    }
  
    createRoad2(R, L, L6, arr1, THREE, scaleX, scaleY, scaleZ) {
    var that = this;
    var arr = arr1;
    var L = 1;
    var BezierArr = []; //所有拐角贝塞尔曲线集合
    for (var i = 1; i < arr.length - 1; i++) {
        //注意两端的点不用圆角化
        // 三个点坐标
        var p1 = arr[i - 1];
        var p2 = arr[i]; // 直线交点
        var p3 = arr[i + 1];
        var dir1 = p1.clone().sub(p2).normalize();
        var dir2 = p3.clone().sub(p2).normalize();
        var BezierP1 = p2.clone().add(dir1.clone().multiplyScalar(L));
        var BezierP3 = p2.clone().add(dir2.clone().multiplyScalar(L));
        var BezierCurve = new THREE.QuadraticBezierCurve3(
        BezierP1,
        p2,
        BezierP3
        );
        BezierArr.push(BezierCurve);
        BezierCurve.startPoint = BezierP1;
        BezierCurve.endPoint = BezierP3;
    }
    var curve = new THREE.CurvePath();
    curve.curves.push(
        new THREE.LineCurve3(arr[0], BezierArr[0].startPoint)
    );
    for (var i = 0; i < BezierArr.length; i++) {
        curve.curves.push(BezierArr[i]);
        if (i < BezierArr.length - 1) {
        curve.curves.push(
            new THREE.LineCurve3(
            BezierArr[i].endPoint,
            BezierArr[i + 1].startPoint
            )
        );
        } else {
        curve.curves.push(
            new THREE.LineCurve3(BezierArr[i].endPoint, arr[arr.length - 1])
        );
        }
    }
    this.pointsArr = curve.getSpacedPoints(300); //曲线上获取顶点坐标

    var list = [];
    this.pointsArr.forEach((p) => list.push([p.x, p.y, p.z]));
    var l = [];
    list.forEach((e) => l.push(new THREE.Vector3(e[0], e[1], e[2])));
    var curve2 = new THREE.CatmullRomCurve3(l);
    var tubegeo = new THREE.TubeGeometry(curve2, 150, 10, 150);
    var textureLoader1 = new THREE.TextureLoader().load(
        "assets/img/publicpic/y5.png"
    );
    textureLoader1.wrapS = THREE.RepeatWrapping;
    var roadmat = new THREE.MeshBasicMaterial({
        map: textureLoader1,
        side: THREE.DoubleSide,
        transparent: true,
        color: "#fff",
    }); //#fff
    var line2 = new THREE.Mesh(tubegeo, roadmat);
    // debugger
    line2.renderOrder = 38;
    this.scene.add(line2);
    //line2.scale.set(1,0.1,1)  //1,0.1,1    scaleX,scaleY,scaleZ
    line2.position.y += 35;
    // line2.name='lu'+Math.random()+Math.random()+Math.random()
    line2.name = "lumian";
    this.roadnameArr.push(line2.name);
    this.roadmatArr.push(roadmat);
    line2.layers.enable(1);
    }

    createRoad(R, L, L6, arr6, THREE, scaleX, scaleY, scaleZ) {
    var pointsArr = [];
    var R = 5;
    var L = 1;
    var pointsArr = []; //拐角过渡贝塞尔曲线顶点坐标集合
    var BezierArr = []; //所有拐角贝塞尔曲线集合
    for (var i = 1; i < arr6.length - 1; i++) {
        //注意两端的点不用圆角化
        // 三个点坐标
        var p1 = arr6[i - 1];
        var p2 = arr6[i]; // 直线交点
        var p3 = arr6[i + 1];
        var dir1 = p1.clone().sub(p2).normalize();
        var dir2 = p3.clone().sub(p2).normalize();
        var BezierP1 = p2.clone().add(dir1.clone().multiplyScalar(L));
        var BezierP3 = p2.clone().add(dir2.clone().multiplyScalar(L));
        var BezierCurve = new THREE.QuadraticBezierCurve3(
        BezierP1,
        p2,
        BezierP3
        );
        BezierArr.push(BezierCurve);
        BezierCurve.startPoint = BezierP1;
        BezierCurve.endPoint = BezierP3;
    }
    var curve = new THREE.CurvePath();
    curve.curves.push(
        new THREE.LineCurve3(arr6[0], BezierArr[0].startPoint)
    );
    for (var i = 0; i < BezierArr.length; i++) {
        curve.curves.push(BezierArr[i]);
        if (i < BezierArr.length - 1) {
        curve.curves.push(
            new THREE.LineCurve3(
            BezierArr[i].endPoint,
            BezierArr[i + 1].startPoint
            )
        );
        } else {
        curve.curves.push(
            new THREE.LineCurve3(
            BezierArr[i].endPoint,
            arr6[arr6.length - 1]
            )
        );
        }
    }
    var geometry = new THREE.BufferGeometry(); //创建一个缓冲类型几何体
    this.pointsArr = curve.getSpacedPoints(200); //曲线上获取顶点坐标
    geometry.setFromPoints(this.pointsArr);
    var material = new THREE.LineBasicMaterial({
        color: "#fff",
    });
    var list = [];
    this.pointsArr.forEach((p) => list.push([p.x, p.y, p.z]));
    var l = [];
    list.forEach((e) => l.push(new THREE.Vector3(e[0], e[1], e[2])));
    var curve2 = new THREE.CatmullRomCurve3(l);
    var tubegeo = new THREE.TubeGeometry(curve2, 100, 20, 50);
    var textureLoader1 = new THREE.TextureLoader().load(
        "assets/img/publicpic/y5.png"
    );
    textureLoader1.wrapS = THREE.RepeatWrapping;
    var roadmat = new THREE.MeshBasicMaterial({
        map: textureLoader1,
        side: THREE.DoubleSide,
        transparent: true,
        color: "#fff",
    });
    var line2 = new THREE.Mesh(tubegeo, roadmat);
    // debugger
    line2.renderOrder = 38;
    this.scene.add(line2);
    line2.scale.set(scaleX, scaleY, scaleZ); //1,0.1,1
    line2.position.y += 15;
    // line2.name='lu'+Math.random()+Math.random()+Math.random()
    line2.name = "lumian";
    this.roadnameArr.push(line2.name);
    this.roadmatArr.push(roadmat);
    line2.layers.enable(1);
    }
  
    initRiver2() {
    var that = this;
    const nrm = new THREE.TextureLoader().load(
        "assets/img/publicpic/wn1.jpg"
    );
    nrm.wrapS = nrm.wrapT = THREE.RepeatWrapping;
    const dif = new THREE.TextureLoader().load(
        "assets/img/publicpic/w1.png"
    );
    dif.wrapS = dif.wrapT = THREE.RepeatWrapping;

    const manager = new THREE.LoadingManager();
    var gltfloader = new GLTFLoader(manager);
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./assets/draco/");
    gltfloader.setDRACOLoader(dracoLoader);
    gltfloader.load(
        "assets/models/fbx/sx2/tietu_gltf/huuv.gltf",
        function (obj) {
        console.log("zzzzzzzzzzzzzzzzzzzzzz");
        console.log(obj);
        console.log("zzzzzzzzzzzzzzzzzzzzzz");
        that.scene.add(obj.scene);
        obj.scene.traverse(function (obj) {
            obj.scale.set(7.52, 7.52, 7.52);
            obj.position.y += 2;
            obj.position.z += 32;
            obj.position.x -= 8;
            // obj.material=new THREE.MeshBasicMaterial({color:'red'})
            if (obj.isMesh) {
            obj.geometry.computeTangents();
            // console.log(river)
            that.waterShader = {
                uniforms: {
                textureCau: { value: dif },
                textureNrm: { value: nrm },
                camPos: { value: that.camera.position },
                time: { value: 1.0 },
                },
                vs: `
            varying vec3 vNormal;
            varying vec3 vTangent;
            varying vec3 vBitangent;
            varying vec2 vUv;
            varying vec4 vPos;
            void main() {
                vPos = modelViewMatrix * vec4(position, 1.);
                mat3 world2Object = inverse(mat3(modelViewMatrix));
                vUv = uv;
                vNormal = normalize(normal * world2Object);
                vTangent = normalize(tangent.xyz * world2Object);
                vBitangent = cross(vNormal, vTangent) * tangent.w;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
            }
        `,
                fs: `
        uniform sampler2D textureNrm;
        uniform sampler2D textureCau;
        uniform vec3 camPos;
        uniform float time;
    
        varying vec3 vNormal;
        varying vec3 vTangent;
        varying vec3 vBitangent;
        varying vec2 vUv;
        varying vec4 vPos;
        vec3 NormalSampleToWorldSpace(vec3 normalMapSample, vec3 unitNormal, vec3 tangent, vec3 binormal) {
            vec3 normalT = vec3(2.0 * normalMapSample.x - 1.0, 1.0 - 2.0 * normalMapSample.y, 2.0 * normalMapSample.z - 1.0);
            mediump vec3 N = unitNormal;
            mediump vec3 T = tangent;
            mediump vec3 B = binormal;
            mat3 TBN = mat3(T, B, N);
            vec3 bumpedNormal = normalize(TBN * normalT);
            return bumpedNormal;
        }

            void main() {
                vec4 color = vec4(1.);
                vec3 viewDir = normalize(camPos - vPos.xyz);
        
                vec4 temp = vPos.xyxy * 0.0017 + time * vec4(1.2 , 0.8 , -1.1 , -0.7) * 0.01;
                vec3 bumpColor1 = texture2D(textureNrm , temp.xy).rgb;
                vec3 bumpColor2 = texture2D(textureNrm , temp.zw).rgb;
        
                vec3 normal1 = NormalSampleToWorldSpace(bumpColor1 , vNormal , vTangent , vBitangent);
                vec3 normal2 = NormalSampleToWorldSpace(bumpColor2 , vNormal , vTangent , vBitangent);
                vec3 normal = normalize(normal1 + normal2);
        
                float D = dot(viewDir, normal);
                vec2 texCoord = vec2(D, D);
        
                color *= texture2D(textureCau, texCoord);
                color.rgb += texture2D(textureCau, vUv + texCoord * 1.2).rgb * .05;    //.7
        
                gl_FragColor = clamp(color, 0., 1.);
            }
        `,
            };

            obj.material = new THREE.ShaderMaterial({
                defines: {
                USE_TANGENT: true,
                },
                uniforms: that.waterShader.uniforms,
                vertexShader: that.waterShader.vs,
                fragmentShader: that.waterShader.fs,
                blending: THREE.NormalBlending,
                transparent: true,
                depthTest: true,
                //   side:THREE.DoubleSide
            });
            }
        });
        }
    );
    }

    initRiver() {
    var that = this;

    const nrm = new THREE.TextureLoader().load(
        "assets/img/publicpic/wn1.jpg"
    );
    nrm.wrapS = nrm.wrapT = THREE.RepeatWrapping;
    const dif = new THREE.TextureLoader().load(
        "assets/img/publicpic/w1.png"
    );
    dif.wrapS = dif.wrapT = THREE.RepeatWrapping;

    //  this.scene.getObjectByName('polySurface992').visible=false

    this.scene.traverse(function (obj) {
        if (obj.isMesh) {
        if (obj.name == "objobjobjobjobjobjpolySurface3") {
            //            alert('ddd')
            var river = obj; //this.scene.getObjectByName('polySurface992')  //rever01
            if (river) {
            // debugger
            river.geometry.computeTangents();
            // console.log(river)
            that.waterShader = {
                uniforms: {
                textureCau: { value: dif },
                textureNrm: { value: nrm },
                camPos: { value: that.camera.position },
                time: { value: 1.0 },
                },
                vs: `
            varying vec3 vNormal;
            varying vec3 vTangent;
            varying vec3 vBitangent;
            varying vec2 vUv;
            varying vec4 vPos;
            void main() {
                vPos = modelViewMatrix * vec4(position, 1.);
                mat3 world2Object = inverse(mat3(modelViewMatrix));
                vUv = uv;
                vNormal = normalize(normal * world2Object);
                vTangent = normalize(tangent.xyz * world2Object);
                vBitangent = cross(vNormal, vTangent) * tangent.w;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
            }
        `,
                fs: `
        uniform sampler2D textureNrm;
        uniform sampler2D textureCau;
        uniform vec3 camPos;
        uniform float time;
    
        varying vec3 vNormal;
        varying vec3 vTangent;
        varying vec3 vBitangent;
        varying vec2 vUv;
        varying vec4 vPos;
        vec3 NormalSampleToWorldSpace(vec3 normalMapSample, vec3 unitNormal, vec3 tangent, vec3 binormal) {
            vec3 normalT = vec3(2.0 * normalMapSample.x - 1.0, 1.0 - 2.0 * normalMapSample.y, 2.0 * normalMapSample.z - 1.0);
            mediump vec3 N = unitNormal;
            mediump vec3 T = tangent;
            mediump vec3 B = binormal;
            mat3 TBN = mat3(T, B, N);
            vec3 bumpedNormal = normalize(TBN * normalT);
            return bumpedNormal;
        }

            void main() {
                vec4 color = vec4(1.);
                vec3 viewDir = normalize(camPos - vPos.xyz);
        
                vec4 temp = vPos.xyxy * 0.0017 + time * vec4(1.2 , 0.8 , -1.1 , -0.7) * 0.01;
                vec3 bumpColor1 = texture2D(textureNrm , temp.xy).rgb;
                vec3 bumpColor2 = texture2D(textureNrm , temp.zw).rgb;
        
                vec3 normal1 = NormalSampleToWorldSpace(bumpColor1 , vNormal , vTangent , vBitangent);
                vec3 normal2 = NormalSampleToWorldSpace(bumpColor2 , vNormal , vTangent , vBitangent);
                vec3 normal = normalize(normal1 + normal2);
        
                float D = dot(viewDir, normal);
                vec2 texCoord = vec2(D, D);
        
                color *= texture2D(textureCau, texCoord);
                color.rgb += texture2D(textureCau, vUv + texCoord * 1.2).rgb * .05;    //.7
        
                gl_FragColor = clamp(color, 0., 1.);
            }
        `,
            };

            river.material = new THREE.ShaderMaterial({
                defines: {
                USE_TANGENT: true,
                },
                uniforms: that.waterShader.uniforms,
                vertexShader: that.waterShader.vs,
                fragmentShader: that.waterShader.fs,
                blending: THREE.NormalBlending,
                transparent: true,
                depthTest: true,
                //   side:THREE.DoubleSide
            });
            }
        }
        }
    });
    }
    
  
    initRodes(){
        if(this.isFirstShowRode){
            var R = 5;
            var L = 95;
            var L2=10;

            var arr1 = [
                // new THREE.Vector3(1692.9315030134928 ,94.84923268054403+0, -982.598801069353),
                // new THREE.Vector3( 1459.4976421250644, 94.84851199998292+0, 1396.3066678611317),
                // new THREE.Vector3(1457.9583873130534 ,94.84842182120939+0 ,1693.9791614319836),
                // new THREE.Vector3(1409.1997399777945 ,21.919161057950774+0, 2627.3513188542615)
                new THREE.Vector3(1409.1997399777945 ,21.919161057950774+0, 2627.3513188542615),
                new THREE.Vector3(1457.9583873130534 ,94.84842182120939+0 ,1693.9791614319836),
                new THREE.Vector3( 1459.4976421250644, 94.84851199998292+0, 1396.3066678611317),
                new THREE.Vector3(1692.9315030134928 ,94.84923268054403+0, -982.598801069353)
            ]
        // this.createRoad2(R,L,L2,arr1,THREE,1,0.1,1)

            var arr2 = [
                // new THREE.Vector3(1337.6497584241963+5, 21.550860193154264, 2617.399139326566),
                // new THREE.Vector3( 1378.9213372403767+5 ,93.99884267008943, 1771.6518482463075),
                // new THREE.Vector3(1394.0377668479402+5, 94.84852887180944, 1340.6141994406005),
                // new THREE.Vector3( 1619.2438570838733+5 ,94.84923804327812, -1000.3007319108827)
                new THREE.Vector3( 1619.2438570838733+5 ,94.84923804327812-5, -1000.3007319108827),
                new THREE.Vector3(1394.0377668479402+5, 94.84852887180944-5, 1340.6141994406005),
                new THREE.Vector3( 1378.9213372403767+5 ,93.99884267008943-5, 1771.6518482463075-10),
                // new THREE.Vector3(1337.6497584241963+5, 21.550860193154264-5, 2617.399139326566-110),
                // new THREE.Vector3(1409.1997399777945,21.919161057950774-5, 2627.3513188542615-110),
                new THREE.Vector3(1457.9583873130534+40 ,94.84842182120939-5,1693.9791614319836+50),
                new THREE.Vector3( 1459.4976421250644+40, 94.84851199998292-5, 1396.3066678611317),
                new THREE.Vector3(1692.9315030134928+40 ,94.84923268054403-5, -982.598801069353)
            ]

            this.createRoad2(R,L,L2,arr2,THREE,1,0.1,1,'assets/img/publicpic/y5.png','lumian')
            this.createRoad2(R,L,L2,arr2,THREE,1,0.1,1,'assets/img/publicpic/y5_2.png','lumian2')

            var arr3 = [
                new THREE.Vector3(2097.0408546891995, 139.83113055186226-20,605.8413279278853+30),
                new THREE.Vector3( 1817.6011048614619 ,139.83113428262496-20, 593.5263956559417+30),
                new THREE.Vector3(-2089.4540062252527+140 ,139.83109521994422-20, 722.4689951153064+30)
            ]
            this.createRoad2(R,L,L2,arr3,THREE,1,0.1,1,'assets/img/publicpic/y5.png','lumian')
            this.createRoad2(R,L,L2,arr3,THREE,1,0.1,1,'assets/img/publicpic/y5_2.png','lumian2')

            var arr4 = [
                new THREE.Vector3(-2118.917787435361+170 ,139.83110965475885-20, 674.8208972382492-60),
                new THREE.Vector3( 1801.6058004019933 ,139.8311458298988-20, 555.4098238167071-60),
                new THREE.Vector3(2067.0986102652105+30, 139.83114250871466-20, 566.372771284824-60)
            ]
            this.createRoad2(R,L,L2,arr4,THREE,1,0.1,1,'assets/img/publicpic/y5.png','lumian')
            this.createRoad2(R,L,L2,arr4,THREE,1,0.1,1,'assets/img/publicpic/y5_2.png','lumian2')

            var arr5 = [
                new THREE.Vector3(-1777.2292727564466 ,132.88290101785748 ,591.8322924459449),
                new THREE.Vector3(43.443201545319155 ,95.46595575667864, 496.5790832972478),
                new THREE.Vector3(76.79884281841815 ,94.91168374793892, 493.9054723069333),
                new THREE.Vector3(83.60075303466965 ,94.37892893449597, 492.29739755867683),
                new THREE.Vector3(95.26174550551949, 94.29310748570802, 489.8804348423881),
                new THREE.Vector3(107.82244591632812 ,94.19730013052317, 486.1506852009703),
                new THREE.Vector3(118.22277053369332 ,94.59398540812842, 483.40857499533735),
                new THREE.Vector3(128.26048968535963 ,94.03586800388373 ,480.4850614829257),
                new THREE.Vector3(141.7722058666148 ,93.95222029896307, 476.3901723542215),
                new THREE.Vector3(152.85129887135503 ,93.91209119021927, 473.57483369441076),
                new THREE.Vector3(166.948517519524, 94.10063016411794, 470.0769784324025),
                new THREE.Vector3(178.47536975629419, 93.8169057693733, 465.67689832572586),
                new THREE.Vector3(187.37946961456663, 93.78290263049784, 462.7036623176725),
                new THREE.Vector3(196.51979054659685 ,93.74742424006521 ,459.20343828080854),
                new THREE.Vector3(208.21181751741847 ,93.65904174820916, 454.8200842008832),
                new THREE.Vector3(219.10781378523166, 93.53271695046372, 449.69943987360404),
                new THREE.Vector3(231.32431614701545 ,93.39508297161198 ,445.03494767853755),
                new THREE.Vector3(243.2094221779769, 93.50337352834644, 439.8481777013344),
                new THREE.Vector3(253.1618396415968 ,93.13455045431725 ,435.0375187932209),
                new THREE.Vector3(264.9362209504891 ,93.00114641898568, 431.2807105249144),
                new THREE.Vector3(287.26264790091415 ,92.87766102676467 ,419.4255101800791),
                new THREE.Vector3(300.1931944198877 ,92.32552159626572 ,413.2037209309752),
                new THREE.Vector3( 320.5084427585791 ,92.1299231807236, 402.6488619077533),
                new THREE.Vector3( 332.4998711636796 ,91.63832247817261 ,395.4552308759582),
                new THREE.Vector3(351.6106874900711 ,91.39010881161647 ,383.0089186556148),
                new THREE.Vector3( 363.24531325558513 ,91.13071123955575 ,376.1671404525022),
                new THREE.Vector3(381.0636482305409 ,90.42783437379344 ,363.7735018991738),
                new THREE.Vector3(393.675698566397 ,89.8126907680502 ,354.6035610223653),
                new THREE.Vector3( 411.63405704564894 ,89.4208912002403 ,341.6691513558781),
                new THREE.Vector3(433.686215414703, 89.10899623560583, 325.586565863119),
                new THREE.Vector3(448.93141052488755, 88.1840010630338 ,313.65399569770227),
                new THREE.Vector3( 461.69034997840254 ,87.70960829430288 ,302.5735586848049),
                new THREE.Vector3(472.4612477927998 ,87.29267587477248 ,292.21274589646504),
                new THREE.Vector3( 484.1606598360718 ,86.90883307721693 ,280.3214698742111),
                new THREE.Vector3(493.82334156967346 ,86.48298837481843 ,271.38869411257105),
                new THREE.Vector3(503.91265068514116 ,85.94737554503173, 260.884871453653),
                new THREE.Vector3(514.7344398545495, 85.44443262193695, 249.74445489257837),
                new THREE.Vector3( 524.8875968841251 ,84.73865041828867, 239.68198985969875),
                new THREE.Vector3( 536.949224514688 ,84.37099493033324, 226.9319229988456),
                new THREE.Vector3( 544.9208585521758 ,83.99768129172074 ,218.60000959095356),
                new THREE.Vector3( 553.1984646327796, 82.62622849858644 ,207.64496235249862),
                new THREE.Vector3( 566.4901781970113, 81.3663790921647, 190.33065194730776),
                new THREE.Vector3( 576.6561837156252, 80.24705398200547, 179.2435998604235),
                new THREE.Vector3( 590.4297291393402, 78.82213503292195 ,162.05927829227858),
                new THREE.Vector3( 599.19183788277, 78.0597651782989 ,151.4713108325697),
                new THREE.Vector3( 612.8460904430533 ,76.41541638152897 ,134.48055330440852),
                new THREE.Vector3( 622.9872256545234 ,75.33694398109012, 123.37953547778277),
                new THREE.Vector3( 636.6555849600476 ,73.9196104868343 ,106.2695810363223),
                new THREE.Vector3( 645.8340275963571, 73.12298876579844, 94.94019389102873),
                new THREE.Vector3(659.7161577834604, 72.16947855501277, 77.83262310854175),
                new THREE.Vector3(668.1790370229296 ,71.88916331888665 ,66.4406451166016),
                new THREE.Vector3( 680.9496804307427 ,71.16847779862219, 48.12404234918419),
                new THREE.Vector3(689.9140274941215 ,70.66084740238917 ,36.51979910742422),
                new THREE.Vector3( 703.0481752324075, 70.17780854044126, 18.534334957868097),
                new THREE.Vector3(712.1733158093239, 69.9208039974332 ,7.697552713967905),
                new THREE.Vector3(725.1542131390846 ,69.43982681175001, -10.52455024335644),
                new THREE.Vector3(735.037527793088, 68.85109277421596 ,-24.091272402217413),
                new THREE.Vector3(745.9041460463309, 68.4513029217452, -38.99555474912777),
                new THREE.Vector3( 755.495913599708 ,68.19576953655891, -50.711666092959334),
                new THREE.Vector3(768.5975066752598 ,67.95764434213287, -68.25751462337804),
                new THREE.Vector3( 777.15834526762 ,67.45960866231906 ,-80.04990087238795),
                new THREE.Vector3(790.2180922461945, 67.45962283630828 ,-97.57659717243862),
                new THREE.Vector3( 800.081391149911, 67.45963144429629, -108.22071370666168),
                new THREE.Vector3( 813.6659919948456 ,67.45964579055742 ,-125.96043113561623),
                new THREE.Vector3( 823.5678824358905 ,67.45965358884115, -135.60331628517767),
                new THREE.Vector3( 838.7050915916484 ,67.45966691215702, -152.07812158025868),
                new THREE.Vector3( 848.9759169329302 ,67.45967458434878, -161.56508897034382),
                new THREE.Vector3( 858.6450236215585 ,67.45968260284873 ,-171.48028029196675),
                new THREE.Vector3(868.4125262156447 ,67.45463488269851, -181.0080477727631),
                new THREE.Vector3( 881.40445255824, 67.45464310203184 ,-191.17157741611848),
                new THREE.Vector3(892.7010533975564 ,67.45970500317966 ,-199.17917244468623),
                new THREE.Vector3( 904.3344927788503, 67.70639561954444 ,-208.58141191281916),
                new THREE.Vector3( 921.4938074268828, 67.70640633967075 ,-221.83727064642036),
                new THREE.Vector3( 933.5404443503259 ,67.70641276359224, -229.7807027760325),
                new THREE.Vector3( 946.0917690851385, 67.70641915557414 ,-237.68464034172467),
                new THREE.Vector3( 958.7049640791508, 67.45468675422887 ,-245.14923961006548),
                new THREE.Vector3( 996.415190718512, 67.70644301561735, -267.18852426611016),
                new THREE.Vector3( 1015.8785421472332 ,67.70644999678382 ,-275.82101176503943),
                new THREE.Vector3(1029.6499075624915, 67.70645456631179 ,-281.47141328874665),
                new THREE.Vector3( 1044.781728025905, 67.70646007635617, -288.2848002687725),
                new THREE.Vector3( 1058.4000820418094, 67.45472636600728, -294.13076502788095),
                new THREE.Vector3( 1075.7183052510866 ,67.45473071548712, -299.5090683469152),
                new THREE.Vector3( 1090.1794372845036 ,67.45473442382098 ,-304.0945692782339),
                new THREE.Vector3(1105.7216838344375, 67.7064769783816 ,-309.18482093992964),
                new THREE.Vector3( 1119.4513685232414, 67.7064798053045, -312.68042261165994),
                new THREE.Vector3( 1136.2305025362546 ,67.45474535147464 ,-317.6070437581995),
                new THREE.Vector3( 1153.5465373888944, 67.45474836541273, -321.3338970030888),
                new THREE.Vector3(1168.6072091259164 ,67.45475039189083 ,-323.839717046187),
                new THREE.Vector3( 1185.2691751576715 ,67.70649144491182, -327.07325570338486),
                new THREE.Vector3( 1200.3031316648007, 67.45475496166655 ,-329.4904249265695),
                new THREE.Vector3( 1215.2504604102467, 67.70649488237349, -331.3238127010841),
                new THREE.Vector3( 1228.9563093936124 ,67.45475714200084 ,-332.18649421287057),
                new THREE.Vector3( 1246.2558402459329, 67.70649651334219 ,-333.3405697787728),
                new THREE.Vector3( 1262.6603880877435 ,67.70649680977662, -333.707122580313),
                new THREE.Vector3( 1277.1425840701725 ,67.4547588187816, -334.2598996355221),
                new THREE.Vector3( 1299.3138817149184 ,67.70649777531985 ,-334.9010548313902),
                new THREE.Vector3( 1326.0389925634943 ,67.70649576531892 ,-332.4156094593978),
                new THREE.Vector3( 1344.0532452684429 ,67.45475546706383, -330.11536851064193),
                new THREE.Vector3( 1362.3659211031343, 67.70649243118588 ,-328.2928226617116),
                new THREE.Vector3( 1384.6035289971196 ,67.4547517877248, -325.5657207730099),
                new THREE.Vector3( 1402.6867922698175 ,67.45474808668887, -320.9892440852505),
                new THREE.Vector3( 1419.76365598824, 67.45474487544924 ,-317.0184197018583),
                new THREE.Vector3( 1440.246709871512, 67.70647900567677 ,-311.69165133338504),
                new THREE.Vector3( 1456.974410890006, 67.7064749423277 ,-306.6671600524909),
                new THREE.Vector3( 1473.9736247663927, 67.70647089523963 ,-301.6627761216258),
                new THREE.Vector3( 1491.1831774951302 ,67.4597825751193 ,-295.0999334314761),
                new THREE.Vector3( 1510.784358822119 ,67.4597752650318 ,-286.06072208412826),


                new THREE.Vector3( 1533.8144687999873 ,67.4597752650318, -274.5160566851851),

                new THREE.Vector3( 1549.243238947186,67.4597752650318, -264.32323072368126),

                new THREE.Vector3( 1567.4040708652053,67.4597752650318, -256.00089211439683),

                new THREE.Vector3( 1579.7209503709644 ,67.4597752650318,-249.64566417384987),

                new THREE.Vector3(1599.3991568626602,67.4597752650318, -236.30986144234436),

                new THREE.Vector3( 1619.172944914953,67.4597752650318, -219.44061987562378),

                new THREE.Vector3( 1644.7865107035248, 67.45967410624633, -199.71755217122242),

                new THREE.Vector3( 1674.105410056607 ,67.45967410624633 ,-173.5214236038849),

                new THREE.Vector3( 1687.1281286666801 ,67.45967410624633, -160.97389652045658),

                new THREE.Vector3(1697.1488514200737 ,67.45966532835179, -150.11968398589983),

            new THREE.Vector3( 1709.2860976489537 ,67.45965592305657, -138.4896656730745),

            new THREE.Vector3( 1720.1527315990315 ,67.45459089293708, -126.61297383845803),

            new THREE.Vector3( 1730.313884403917 ,67.54966901021685, -113.98011896431828),

            new THREE.Vector3( 1737.968651448015 ,67.6809242331201 ,-103.60789056852039),

            new THREE.Vector3( 1744.4306535443773, 67.95298650396983 ,-94.66117730177511),

            new THREE.Vector3( 1753.6914312883916 ,67.95297582865544 ,-81.4607302809685),

            new THREE.Vector3( 1764.7149977644688 ,68.22785778342767 ,-64.94944617405221),

            new THREE.Vector3( 1772.42095367154, 68.9396694677788, -50.767600111456346),

            new THREE.Vector3( 1778.7733181738374 ,68.51984904693482, -38.1107673112271),

            new THREE.Vector3( 1787.5250491661218, 68.9396458985931, -21.62337298406846),

            new THREE.Vector3( 1795.6390371752698, 69.0069260870555, -4.3220101837413125),

            new THREE.Vector3( 1802.695010735134 ,69.24564749989145, 10.958679964225032),

            new THREE.Vector3( 1808.8111089489894 ,69.63631463163185 ,26.725762104727725),

            new THREE.Vector3( 1815.2602134246977, 70.66635213047485, 45.73363946390648),

            new THREE.Vector3( 1821.6702575894915 ,70.50365073468636 ,63.20675879079653),

            new THREE.Vector3( 1827.1302250770152 ,71.40636573912883, 81.14132658476903),

            new THREE.Vector3( 1831.3432845357747, 71.22869934529842 ,99.6501957910646),

            new THREE.Vector3( 1836.9419338411685, 72.14637300020755, 124.39804083211371),

            new THREE.Vector3( 1839.303697106378, 72.88640342755657, 139.0087486697111),

            new THREE.Vector3( 1842.5963935334316, 72.88638601633555, 160.5384098723318),

            new THREE.Vector3( 1843.0890180993254, 73.62640991776593 ,174.81647863825998),

            new THREE.Vector3( 1845.3814446862964, 73.62639208055688, 196.87289094981344),

            new THREE.Vector3( 1845.6272299664856, 75.59982402681378 ,211.427590406525),

            new THREE.Vector3( 1846.3805114980055, 75.59980603344884, 233.6770953782774),

            new THREE.Vector3( 1845.0781011758306 ,75.38737499712168 ,248.086213609951),

            new THREE.Vector3( 1844.7123595691733, 76.09313776309114, 267.6829405688783),

            new THREE.Vector3( 1843.1391125326877, 76.56623179019486 ,283.60428308616935),

            new THREE.Vector3( 1841.9131197281972 ,77.32650811076458, 306.17139220204314),

            new THREE.Vector3( 1838.529646510073 ,79.0532643957567, 320.03795522999866),

            new THREE.Vector3( 1835.1589035170186, 79.05324818086503 ,340.0883077923315),

            new THREE.Vector3( 1826.8362319905316, 80.77997244107725, 376.75038437590945),

            new THREE.Vector3( 1820.333966326037 ,80.7799506369303 ,403.71207164988766),

            new THREE.Vector3( 1813.5863667486885 ,81.17447172089656, 426.5265220182817),

                new THREE.Vector3(1748.028967059791 ,85.04679510344613, 659.2007491237483),

            new THREE.Vector3( 1713.928859543266 ,86.62819571014565 ,781.3284025356947),

            new THREE.Vector3( 1583.0013321904069 ,90.0066741370425 ,1174.8767294595973),

            new THREE.Vector3(1579.7925983507575, 90.00666477393888, 1186.4545761370348),

            new THREE.Vector3(1572.5289631813903 ,90.00663370846988, 1224.8682530575766),

            new THREE.Vector3(1547.5900732206214, 90.00651441828302, 1372.375271115629),

            new THREE.Vector3(1543.1390771423607, 90.00648056907029 ,1414.231156865825),

            new THREE.Vector3(1537.2382941949702, 90.00627691534744 ,1666.0570124886283)



        ]

            arr5.reverse()
            this.createRoad2(R,L,L2,arr5,THREE,1,0.1,1,'assets/img/publicpic/y5.png','lumian')
            this.createRoad2(R,L,L2,arr5,THREE,1,0.1,1,'assets/img/publicpic/y5_2.png','lumian2')

            var arr6 = [
                new THREE.Vector3(1355.8759118773314 ,90.74629615001155 ,1663.5589624759978),

            new THREE.Vector3( 1355.3262291380802, 90.70094311395438 ,1643.5608643075968),

            new THREE.Vector3( 1353.518260611236 ,90.64689455464848, 1619.700611263026),

            new THREE.Vector3( 1352.865870445157 ,90.71270029654158 ,1590.6335777128736),

            new THREE.Vector3( 1350.766928047306 ,91.13959293656123 ,1560.512827898797),

            new THREE.Vector3( 1348.3918331908817, 91.38628771794849, 1537.5581794626164),

            new THREE.Vector3( 1344.4184733637035 ,91.5785076292274, 1518.8293666542484),

            new THREE.Vector3( 1341.8314130618849, 91.87967680501801, 1500.6393051917364),

            new THREE.Vector3( 1338.3733989893906 ,91.96760912349825, 1481.4802329951574),

            new THREE.Vector3( 1335.6703404075956 ,92.37307110135275 ,1465.6811634853907),

            new THREE.Vector3( 1331.3378791072323 ,92.37672791576195 ,1443.139538773632),

            new THREE.Vector3( 1328.0252454703077 ,92.61978027401494 ,1424.9311363381794),

            new THREE.Vector3( 1323.6612203285883 ,92.75316769884391, 1409.024830210753),

            new THREE.Vector3( 1319.6174176619386 ,93.35984667835139, 1395.0548813017663),

            new THREE.Vector3( 1313.6601877760263, 93.15742712618042, 1373.6830235319144),

            new THREE.Vector3( 1309.0588723851715, 93.61860268057647, 1359.7126162102495),

            new THREE.Vector3( 1302.7566346391297 ,93.84754895217594 ,1339.443879816059),

            new THREE.Vector3( 1296.9186314900096 ,93.85326182532827 ,1325.9119042582947),

            new THREE.Vector3( 1292.3082814575555 ,93.85327168708771 ,1313.7174498424802),

            new THREE.Vector3( 1283.8169301157686, 94.34664914025811, 1291.1843502822462),

            new THREE.Vector3( 1275.642767855345 ,94.34666431364711, 1272.4218566971008),

            new THREE.Vector3( 1269.844974707463 ,94.84004233068542 ,1257.5937065840228),

            new THREE.Vector3( 1260.3581861191342, 94.84005684838628, 1239.6419973843015),

            new THREE.Vector3( 1252.8273616007978, 95.08674441202695 ,1225.6123772260853),

            new THREE.Vector3( 1244.5500546741032 ,95.08675749912531 ,1209.4296641392182),

            new THREE.Vector3( 1235.8270378695565 ,95.82681285108916 ,1193.2201033024928),

            new THREE.Vector3( 1226.3714155791513 ,95.82682769430136, 1174.865886231221),

            new THREE.Vector3( 1217.1382385447569, 96.32019794690123, 1161.2365760602133),

            new THREE.Vector3( 1206.3549685786631 ,96.3202117913002 ,1144.117431173554),

            new THREE.Vector3( 1197.443406390517 ,96.81358116482784, 1131.5751280841564),

            new THREE.Vector3( 1185.9800557669248, 96.8135960831331, 1113.1280557264724),

            new THREE.Vector3( 1177.7897921886822, 96.66198743300917, 1101.6797776646567),

            new THREE.Vector3( 1164.2591205359151, 97.30698553683256 ,1084.1580234465857),

            new THREE.Vector3( 1155.2226446242314 ,97.55367097262945, 1072.7595658830512),

            new THREE.Vector3( 1146.8758127835756, 97.55367917217359, 1062.6205063489153),

            new THREE.Vector3( 1134.1126730017525 ,97.92107639222121 ,1047.395524140127),

            new THREE.Vector3( 1124.4681323336004, 98.19739051440254, 1036.2110018054839),

            new THREE.Vector3( 1118.0098786103956 ,98.54043278301937, 1027.5584323534545),

            new THREE.Vector3( 1108.0844693057038, 99.03379377862618, 1016.9735643777766),

            new THREE.Vector3( 1096.0886763003725 ,99.03380335393508 ,1005.1333174818898),

            new THREE.Vector3( 1087.5108682426912 ,99.07166385629192 ,997.0161507628767),

            new THREE.Vector3( 1079.0656368092514, 99.77385919135412 ,988.3234721918939),

            new THREE.Vector3( 1067.409734693894, 99.7738692226683, 975.9193568244002),

            new THREE.Vector3( 1052.4588345921943 ,99.86203771705064 ,961.6398799611949),

            new THREE.Vector3( 1038.1028612554476 ,100.1725729635861, 947.9497215635803),

            new THREE.Vector3( 1027.844793689705, 100.37421943510583, 940.014798646663),

            new THREE.Vector3( 1019.0413228297184, 100.5583442735351, 932.147645322947),

            new THREE.Vector3( 1005.5827095317363 ,100.83420480948725, 920.9533904264829),

            new THREE.Vector3( 990.8161770231007 ,101.25400691719356, 910.1252974613155),

            new THREE.Vector3( 975.8798808806454 ,101.43105186221842, 898.5895453145542),

            new THREE.Vector3( 959.4935675977694 ,101.74738387229725, 888.2080769589934),

            new THREE.Vector3( 940.8745088032214 ,102.24905478847415 ,875.5770868631499),

            new THREE.Vector3( 922.3940509430408, 102.48272326933684, 864.1710361712308),

            new THREE.Vector3( 909.9741758143699, 103.00348219115948, 854.9894612278459),

            new THREE.Vector3( 890.9278691020476 ,103.04836222606185, 843.7220924847275),

            new THREE.Vector3( 879.0080007799347 ,103.47418587953841 ,837.1350822273329),

            new THREE.Vector3( 865.1434694840057, 103.51669113085595 ,829.7928920678967),

            new THREE.Vector3( 846.4724604580997, 104.21424137492814 ,820.7481695894256),

            new THREE.Vector3( 830.7478209448399, 104.21424814167786 ,812.3808169202154),

            new THREE.Vector3( 814.4599312650975, 104.70949821113389, 804.2078059094521),

            new THREE.Vector3( 798.1479758561303 ,105.09183670743384 ,797.347811617375),

            new THREE.Vector3( 779.993359559082, 105.21762871557328, 790.3139157676211),

            new THREE.Vector3( 761.4046447260171, 105.65197047122818 ,782.2759559157122),

            new THREE.Vector3( 746.3599682314665 ,105.94888095011233, 776.0923885851014),

            new THREE.Vector3( 725.8787197200719, 106.18148208974017, 768.9682409130589),

            new THREE.Vector3( 707.7143174663169, 106.34219980672228, 763.8670570906932),

            new THREE.Vector3( 690.6081432826716, 106.91882013345985, 758.0780261941787),

            new THREE.Vector3( 676.2235996206662 ,106.9512574097226, 754.3501881754754),

            new THREE.Vector3( 655.8631985936186 ,107.41410817630403 ,747.7270532430539),

            new THREE.Vector3( 641.7191940610887 ,107.45957630151486, 744.4903047521495),

            new THREE.Vector3( 620.546334565609 ,107.90562381217197, 740.5742519233482),

            new THREE.Vector3( 605.6338398601151 ,108.1676856485738, 737.9962640977888),

            new THREE.Vector3( 583.9809204854889 ,108.14333509648748 ,732.7762454494409),

            new THREE.Vector3( 570.0250928437399 ,108.9104978892663 ,730.4398449034622),

            new THREE.Vector3( 548.2877861221818 ,109.37963492291468, 728.2697486960411),

            new THREE.Vector3( 532.4725661026048 ,109.41311418409542 ,726.6311939333897),

            new THREE.Vector3( 512.2051644953672 ,109.63293492757458 ,724.3109478519667),

            new THREE.Vector3( 497.5724026443335 ,109.64893098990626 ,722.9628340092353),

            new THREE.Vector3( 475.6691039023027, 110.11691652432198 ,721.97619101466),

            new THREE.Vector3( 455.37253567127436 ,110.32857152748404 ,721.7881750465893),

            new THREE.Vector3( 438.9260465807594 ,110.86024032275462 ,722.6870440424335),

            new THREE.Vector3( 423.477354188256 ,111.3680461283481 ,723.1549982013223),

            new THREE.Vector3( 401.9605718731991, 111.36804535779282, 724.1078201630457),

            new THREE.Vector3( 387.6500631291662 ,111.62855086912975, 724.6423087844696),

            new THREE.Vector3( 365.9077199000431 ,112.09675499492026, 725.3040814841896),

            new THREE.Vector3( 350.8030441815783 ,112.12630600432097, 726.2937269745782),

            new THREE.Vector3( 328.8527802862261, 112.59835432199799 ,726.765820901123),

            new THREE.Vector3( 293.07305079370735 ,113.32291911534097, 727.9407169613194),

            new THREE.Vector3( -327.55233660875604, 121.97527169751623 ,749.948293103283),

            new THREE.Vector3( -1019.3566562275387, 129.2119591823861 ,773.7351750079963),

            new THREE.Vector3(-1291.4636891227165 ,132.01200825767032 ,784.5596928831073),

            new THREE.Vector3( -1478.7969575998025 ,132.88273922661674 ,791.8935391078259)

        ]
            // arr6.reverse()
            this.createRoad2(R,L,L2,arr6,THREE,1,0.1,1,'assets/img/publicpic/y5.png','lumian')
            this.createRoad2(R,L,L2,arr6,THREE,1,0.1,1,'assets/img/publicpic/y5_2.png','lumian2')

            var arr7 = [
                new THREE.Vector3(1990.2068987220855, 132.76171044038878+1100, 445.14038501560253+0),
                new THREE.Vector3(1094.9855221978025, 109.50822838182454+950, 478.1741917710998+0),
                new THREE.Vector3(1075.5962089861591, 109.14863213060161+870, 478.1291432221347),
                new THREE.Vector3(1056.9467454754117, 108.84309245070862+870, 474.582445903512),
                new THREE.Vector3(1038.2806531605652, 108.84309353634244+870, 470.99886070980784),
                new THREE.Vector3(1021.8662587527456, 108.84309469907703+870, 467.16077094663353),
                new THREE.Vector3(1006.3228739963329, 108.90195425360989+870, 460.94192213484297),
                new THREE.Vector3(989.6490901168826, 108.90195609755263+870, 454.85522336505204),
                new THREE.Vector3(969.3281520333899, 108.37092905136686+870, 446.9549809632255),
                new THREE.Vector3(955.768607653643, 108.24687873510449+870, 438.24545179766864),
                new THREE.Vector3(938.6966319910495, 108.40860462984506+870, 428.76163357955113),
                new THREE.Vector3(926.3870777254006, 108.40860697135916+870, 421.03249395577114),
                new THREE.Vector3(912.6618014784083, 107.710655673378+870, 411.2366185650116),
                new THREE.Vector3(897.5568092222647, 107.48767852144924+870, 399.2668764492149),
                new THREE.Vector3(883.827902956618, 107.223064906529+870 ,389.4193036432076),
                new THREE.Vector3(869.5777973296758 ,107.02721846508713+870, 375.05094962945094),
                new THREE.Vector3(861.3664087878141, 106.93220145072307+870, 363.4146870915669),
                new THREE.Vector3(849.2491866935728, 106.96840089661359+870, 347.63367384315063),
                new THREE.Vector3(836.0513882009978, 106.05157313301811+870 ,333.14470912113086),
                new THREE.Vector3(826.1626195752638, 105.86910188611726+870 ,317.0948247644073),
                new THREE.Vector3(818.596280738969, 106.43519912275124+870, 300.7571279873163),
                new THREE.Vector3(808.3922310349543, 105.75967869945597+870, 282.43796468067666),
                new THREE.Vector3(801.019558017999, 105.6550760336985+870, 268.3633736523359),
                new THREE.Vector3(796.645462350268, 105.49986517676878+870, 250.50012762211693),
                new THREE.Vector3(791.2515610541543, 105.20563200426308+870, 233.88478105387838),
                new THREE.Vector3(785.4605252477568, 104.91792269261386+870, 213.85291601573434),
                new THREE.Vector3(781.9363595578714, 104.65153210209829+870, 193.54783092825434),
                new THREE.Vector3(778.1050063960188, 103.99708983412653+870, 170.93813249587717),
                new THREE.Vector3(776.6598990732999, 103.22004303635994+870, 149.17379191464522),
                new THREE.Vector3(775.3472791086715, 102.46883526804808+870, 128.5185221753375),
                new THREE.Vector3( 777.1787162171236 ,101.67057359930446+870, 105.16726706446111),
                new THREE.Vector3( 780.4259419765528 ,100.97143247289455+870, 83.94342790541492),
                new THREE.Vector3( 784.2240805704873 ,100.46059378486244+870, 67.27699819453939),
                new THREE.Vector3(789.1702945491523, 99.99165939995648+870 ,50.46972967750223),
                new THREE.Vector3( 795.2896927280012, 99.80859063479089+870, 33.54834459276812),
                new THREE.Vector3( 799.4028905167125, 99.70879014684101+870, 19.170253859854384),
                new THREE.Vector3(807.8248763980629, 99.67327577976718 +870,1.989526680978166),
                new THREE.Vector3( 813.0935100877418, 99.67328017527171+870 ,-12.519661386267884),
                new THREE.Vector3( 822.6595978669044, 99.5798506268641+870 ,-29.853078639081758),
                new THREE.Vector3( 833.2382642278259, 99.44045533703263+870 ,-48.4781823713259),
                new THREE.Vector3( 848.2487378727121, 99.11349343317069+870, -68.80666316017727),
                new THREE.Vector3( 861.2506850426173 ,98.82404416025145 +870,-86.59319730756665),
                new THREE.Vector3( 875.5365776870425, 98.53394003057831+870, -103.37354220752971),
                new THREE.Vector3( 894.6663448024135 ,98.19836685449349+870 ,-118.39082733934006),
                new THREE.Vector3( 912.6666990382327, 97.88763420601093+870, -133.28529521496256),
                new THREE.Vector3( 929.9253385181765 ,97.60512959047483+870 ,-144.6036889464656),
                new THREE.Vector3( 949.4824762064293, 97.29203761145303+870, -156.192334595709),
                new THREE.Vector3( 971.5995129339143 ,96.96226142728291+870 ,-165.74586055651065),
                new THREE.Vector3( 993.4700652179517, 96.94712331999396+870, -177.54196257787328),
                new THREE.Vector3( 1015.6036642908244, 96.9471261954603+870 ,-187.03363331740925),
                new THREE.Vector3( 1040.417837800635 ,96.90755411627806+870, -193.3365203017716),
                new THREE.Vector3( 1065.5160593021399 ,96.2135215388136+870 ,-197.48047179293135),
                new THREE.Vector3(1089.70019345423 ,96.32145960434887+870, -199.01283135525236),
                new THREE.Vector3( 1117.451579002162 ,96.32145984380757+870, -199.8032628741711),
                new THREE.Vector3( 1149.8334568090404 ,95.70795298300855+870, -201.24699727630178),
                new THREE.Vector3( 1172.2369738251582 ,95.70795197908498+870, -197.93312792679845),
                new THREE.Vector3( 1195.1699476348933, 95.40283665810067+870, -190.07526996905332),
                new THREE.Vector3( 1217.763713419839, 94.78567098243076+870, -185.74325344094567),
                new THREE.Vector3( 1232.4125068543729, 94.61211094271427+870, -179.25828547515522),
                new THREE.Vector3( 1249.0960544613665, 94.49524811104948+870, -175.3254735200136),
                new THREE.Vector3( 1269.9632597968932, 94.36768246977815+870, -164.86669912330157),
                new THREE.Vector3( 1292.5899902868134, 94.23822415379298+870, -148.77968481313755),
                new THREE.Vector3(1312.6513322129954, 94.2209102949328+870, -134.7230860821099),
                new THREE.Vector3(1330.65606024842, 94.22090526211912+870, -118.11019447934203),
                new THREE.Vector3(1346.38680934769 ,94.07885232647207+870, -101.27327348485461),
                new THREE.Vector3(1362.000012561268, 93.87677867659113+870, -85.60296615273356),
                new THREE.Vector3(1375.8121360676923 ,93.65316415311895+870, -65.0858257585312),
                new THREE.Vector3(1393.5736618808082 ,93.85460751948062+870, -39.16065322521953),
                new THREE.Vector3(1409.1771480017426 ,93.36124025010459+870, -13.094274227853127),
                new THREE.Vector3( 1421.291420383198, 93.11454914652325+870, 13.378357690304622),
                new THREE.Vector3( 1431.073334697213, 92.50013652444548+870, 38.90926571441722),
                new THREE.Vector3( 1439.5301977001097, 92.14762208580237+870, 63.44246174392384),
                new THREE.Vector3(1444.2939821829084, 91.88112529614399+870, 86.06865868153393),
                new THREE.Vector3( 1448.064606899602, 91.48177485841663+870 ,109.94946649604039),
                new THREE.Vector3( 1450.9258007483536, 91.1132502903277+870, 136.24050171117065),
                new THREE.Vector3( 1451.7792781308976, 90.70667050709511+870, 164.53641914769062),
                new THREE.Vector3( 1449.6542757362663, 90.62352592455267+870 ,204.19283657423318),
                new THREE.Vector3( 1446.904501501035, 90.66939906139942+870, 249.00492239898495),
                new THREE.Vector3( 1444.996910909429 ,90.50322053477231+870, 316.9093424870412),
                new THREE.Vector3( 1392.7074572517859, 90.50306213215461+870, 839.7829636885712),
                new THREE.Vector3(1360.2140018400012, 90.50306213215461+870,1413.0847146131953)
            ]

            // var geosp = new THREE.SphereGeometry(6.5, 5, 5);
            // var matsp=new THREE.MeshBasicMaterial({
            //     color:'lightgreen'
            // })
            // var meshsp=new THREE.Mesh(geosp,matsp)
            // meshsp.position.copy(new THREE.Vector3(1025.822283394201, 116.48360113054557+20,470.64736689995533))
            // this.scene.add(meshsp)

            arr7.reverse()
            this.createRoad(R,L,L2,arr7,THREE,1,0.1,1,'assets/img/publicpic/y5.png','lumian')
            this.createRoad(R,L,L2,arr7,THREE,1,0.1,1,'assets/img/publicpic/y5_2.png','lumian2')

            var arr8 = [
                new THREE.Vector3(486.73032372411944-30 ,L2, 1516.3358581330679),
                new THREE.Vector3(388.3581276340715-30 ,L2, 744.30060898593),
                new THREE.Vector3(821.8214611528683-2 ,L2, -646.8304738795102),
                new THREE.Vector3(829.0399816021237-2 ,L2, -1705.3364826938753)
            ]
        // this.createRoad(R,L,L2,arr8,THREE,1,0.1,1)

            var arr9 = [
                new THREE.Vector3(1017.7340083704514 ,L2, 1445.5670002037587),
                new THREE.Vector3(979.9640257389203 ,L2, 565.6993424926573),
                new THREE.Vector3(1135.2814125037978 ,L2, 171.42577570909953),
                new THREE.Vector3(1894.1780270204026 ,L2, -45.24185986204043)
            ]
            // this.createRoad(R,L,L2,arr9,THREE,1,0.1,1)

            var arr10 = [
                new THREE.Vector3(1692.9315030134928 ,94.84923268054403, -982.598801069353),
                new THREE.Vector3( 1459.4976421250644, 94.84851199998292, 1396.3066678611317),
                new THREE.Vector3(1457.9583873130534 ,94.84842182120939 ,1693.9791614319836),
                new THREE.Vector3(1409.1997399777945 ,21.919161057950774, 2627.3513188542615)
            ]
            //  this.createRoad(R,L,L2,arr10,THREE,1,0.1,1)

            // var arr11 = [
            //     new THREE.Vector3(-1636.2082499090495 ,L2, 907.6149048907553),
            //     new THREE.Vector3(-1255.726398296864 ,L2, 880.853307194112),
            //     new THREE.Vector3(-827.6964249824092 ,L2, 861.5443875322436)
            // ]
            // this.createRoad(R,L,L2,arr11,THREE,1,0.1,1)
            //
            // var arr12 = [
            //     new THREE.Vector3(-832.2436196589998 ,L2, 891.0873077076698),
            //     new THREE.Vector3(-1256.8751460654773 ,L2, 924.0015621586892),
            //     new THREE.Vector3(-1639.3368460821519 ,L2, 947.9896635413517)
            // ]
            // this.createRoad(R,L,L2,arr12,THREE,1,0.1,1)


            this.isFirstShowRode=false
        }
    }
    initGround() {
        //地板
        const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
        let plane = new THREE.Mesh(planeGeometry);
        //水平面旋转并且设置位置
        plane.rotation.x = -0.5 * Math.PI;
        //plane.material.update = true;
        plane.position.set(0, -2, 0);
        plane.name = "plane";
        plane.material = new THREE.MeshBasicMaterial({
            color: "#dddddd",
            side: THREE.DoubleSide,
            depthTest: true,
            transparent: true,
            opacity: 0.5,
        });
        this.scene.add(plane);
    }
    addGltfSceneControlGUI(scene){
        let gui = new dat.GUI()

        let control = gui.addFolder("GLTF SCENE")
        let params = {
            x:0,
            y:0,
            z:0,
            scale:100
        }
        control.add(params,'x',-500,500,1).onChange(function(val){
            scene.position.x = val
        })
        control.add(params,'y',-100,500,1).onChange(function(val){
            scene.position.y = val
        })
        control.add(params,'z',-500,500,1).onChange(function(val){
            scene.position.z = val
        })
        control.add(params,'scale',1,6000,1).onChange(function(val){
            scene.scale.set(val,val,val)
        })

    }


}

export default ThreeClass;